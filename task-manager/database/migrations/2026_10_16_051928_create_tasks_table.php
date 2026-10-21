<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        $table->string('title', 150);
        $table->text('description')->nullable();
        $table->string('status', 20)->default('todo');
        $table->string('priority', 20)->default('medium');
        $table->date('due_date')->nullable();

        $table->foreignId('user_id')
            ->constrained('users')
            ->cascadeOnDelete();

        $table->timestamps();

        $table->index(['user_id', 'status']);
        $table->index(['status', 'due_date']);
    });
}

public function down(): void
{
    Schema::dropIfExists('tasks');
}
};
