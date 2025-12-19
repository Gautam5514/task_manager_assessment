# Collaborative Task Manager

A full-stack real-time task management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Secure JWT-based login and registration.
- **Task Management**: Create, read, update, and delete tasks.
- **Real-time Collaboration**: Instant updates across all connected clients using Socket.io (Task creation, updates, deletions, and assignments).
- **Kanban Board**: Visualize tasks by status (To Do, In Progress, Review, Completed).
- **Filtering & Sorting**: Filter by Priority, Ownership (Assigned to Me / Created by Me), and Overdue status. Sort by Newest, Oldest, or Due Date.
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Socket.io Client
- **Backend**: Node.js, Express, Mongoose, Socket.io, JSON Web Token (JWT), Bcrypt
- **Database**: MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd task_manager
\`\`\`

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
\`\`\`

Start the backend server:
\`\`\`bash
npm run dev
\`\`\`
Server will run on `http://localhost:5000`.

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
\`\`\`bash
cd ../frontend
npm install
\`\`\`

Start the development server:
\`\`\`bash
npm run dev
\`\`\`
Frontend will run on `http://localhost:5173`.

## API Documentation

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get token
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/users` - Get list of all users

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Architecture & Decisions

- **Database**: efficient handling of document-based data (Tasks, Users).
- **Structure**: Controller-Service/Model-Route pattern for clear separation of concerns.
- **Real-time**: Socket.io was chosen for its ease of use and event-driven architecture.
    - `taskCreated`, `taskUpdated`, `taskDeleted` events broadcast changes to all clients (optimistic UI updates).
    - `taskAssigned` event notifies specific users when tasks are assigned to them (via `user:userId` rooms).
- **Frontend State**: React `useState` combined with socket listeners ensures the UI is always in sync without aggressive re-fetching. SWR/React Query could be added for more robust caching strategies, but `useEffect` + Sockets covers the "Real-time" requirement effectively.

## Future Improvements
- Add persistent notifications history.
- Add drag-and-drop support for the Kanban board.
- Add unit and integration tests.
