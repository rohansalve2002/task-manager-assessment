# Task Manager Assessment

A task management application built with Laravel, React, and MySQL.

## Technology Stack
- Backend: PHP and Laravel
- Frontend: React and Vite
- Database: MySQL
- Authentication: Laravel Sanctum

## Tasks Completed

### Task 1 — Task CRUD
- Create, view, update, and delete tasks.
- Filter tasks by status.
- Paginated task listing.
- Task title, description, status, priority, and due date.

### Task 2 — Authentication and Authorization
- User registration and login.
- Token-based API authentication with Laravel Sanctum.
- Users can access their own tasks.
- Admins can view tasks across users.

### Task 3 — Database Optimization
- Database indexes for task queries.
- MySQL EXPLAIN queries used to inspect query execution plans.

## Project Structure
- `task-manager/` — Laravel backend.
- `task-manager-ui/` — React frontend.

## Setup Instructions

### Backend
1. Install PHP, Composer, and MySQL.
2. Navigate to `task-manager/`.
3. Run `composer install`.
4. Copy `.env.example` to `.env` and configure your local database credentials.
5. Run `php artisan key:generate`.
6. Run `php artisan migrate`.
7. Start the API with `php artisan serve`.

### Frontend
1. Install Node.js and npm.
2. Navigate to `task-manager-ui/`.
3. Run `npm install`.
4. Run `npm run dev`.

The frontend's Vite proxy targets `http://127.0.0.1:8000` by default.

## Bonus Tasks
No bonus tasks are claimed in this submission.

## Database Notes
Document the actual EXPLAIN results and indexes created in the database. Do not report unverified performance improvements.

## Time Spent
Approximately 5 hours.

## Security
Do not commit `.env` files, real passwords, or API keys.
