<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    private function authorizeTask(Request $request, Task $task): void
    {
        abort_unless(
            $request->user()->role === 'admin'
            || $task->user_id === $request->user()->id,
            403,
            'You are not authorized to access this task.'
        );
    }

    public function index(Request $request)
    {
        $query = Task::query();

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        } else {
            $query->with('user:id,name,email');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $tasks = $query
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:150',
            'description' => 'nullable|string|max:5000',
            'status' => [
                'sometimes',
                Rule::in(['todo', 'in_progress', 'done']),
            ],
            'priority' => [
                'sometimes',
                Rule::in(['low', 'medium', 'high']),
            ],
            'due_date' => 'nullable|date_format:Y-m-d',
        ]);

        $task = $request->user()->tasks()->create($data);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorizeTask($request, $task);

        if ($request->user()->role === 'admin') {
            $task->load('user:id,name,email');
        }

        return response()->json(['task' => $task]);
    }

    public function update(Request $request, Task $task)
    {
        $this->authorizeTask($request, $task);

        $data = $request->validate([
            'title' => 'sometimes|required|string|max:150',
            'description' => 'sometimes|nullable|string|max:5000',
            'status' => [
                'sometimes',
                Rule::in(['todo', 'in_progress', 'done']),
            ],
            'priority' => [
                'sometimes',
                Rule::in(['low', 'medium', 'high']),
            ],
            'due_date' => 'sometimes|nullable|date_format:Y-m-d',
        ]);

        $task->update($data);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task->fresh(),
        ]);
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authorizeTask($request, $task);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }
}