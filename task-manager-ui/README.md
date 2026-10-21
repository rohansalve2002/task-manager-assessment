# Task Manager — React Frontend

React frontend for the Task Manager assessment, built with React and Vite.

## Features
- User registration and login.
- Authentication using Laravel Sanctum API tokens.
- Create, view, edit, and delete tasks.
- Filter tasks by status.
- Pagination for task listings.
- Role-based task visibility for users and administrators.

## Requirements
- Node.js and npm.
- Laravel backend running locally.

## Setup
1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL displayed in the terminal.

## Backend Configuration
The Vite development server proxies `/api` requests to `http://127.0.0.1:8000`. Start the Laravel backend using:

```bash
php artisan serve
```

## Technology
- React
- Vite
- JavaScript
- CSS
