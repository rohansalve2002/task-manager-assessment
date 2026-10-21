# Task Manager Assessment

A Task Management application built using Laravel, React, and MySQL.

## Tech Stack
- **Backend:** PHP, Laravel
- **Frontend:** React, Vite
- **Database:** MySQL
- **Authentication:** Laravel Sanctum API tokens

## Features

### Task 1: Task CRUD
- Create, view, update, and delete tasks.
- Filter tasks by status.
- Pagination for task listings.
- Task fields include title, description, status, priority, and due date.

### Task 2: Authentication and Authorization
- User registration and login.
- API authentication using Laravel Sanctum.
- Users can access only their own tasks.
- Admin users can view tasks across users.
- Protected API endpoints.

### Task 3: Database Optimization
- Database indexes for task queries.
- Query execution plans checked using MySQL EXPLAIN.

## Project Structure
- `task-manager/` — Laravel backend API.
- `task-manager-ui/` — React frontend.

## Setup Instructions

### Backend
1. Navigate to `task-manager/`.
2. Run `composer install`.
3. Copy `.env.example` to `.env`.
4. Configure your MySQL database in `.env`.
5. Run `php artisan key:generate`.
6. Run `php artisan migrate`.
7. Start the server using `php artisan serve`.

### Frontend
1. Navigate to `task-manager-ui/`.
2. Run `npm install`.
3. Run `npm run dev`.

Configure the database credentials locally. Never commit real passwords, API keys, or `.env` files.

## API Endpoints
- `POST /api/register`
- `POST /api/login`
- `GET /api/me`
- `POST /api/logout`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PUT/PATCH /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

## Author
Rohan Salve
