# Full-Stack To-Do List Application

> IMPORTANT
> register with
> test@gmail.com
> test 

A full-stack to-do list web application built using React, Node.js, Express, and MongoDB. Users can register, log in, and manage their personal tasks securely.

---

# Frontend
React
→ Handles UI (login, register, tasks)
Vite
→ Fast development server and build system
JavaScript (ES6)
→ Core programming language
Fetch API
→ Sends requests to your backend

# ⚙️ Backend
Node.js
→ Runs your server
Express.js
→ Handles routes and middleware

# 🗄️ Database
MongoDB
→ Stores users and tasks
Mongoose
→ Defines schemas and interacts with MongoDB

# Authentication
JSON Web Token (JWT)
→ Secure login system

# Core Concepts Used
REST API
CRUD operations (Create, Read, Update, Delete)
Middleware (Express)
Client-server architecture
Local storage (browser)

---

# Features

- User registration and login (JWT authentication)
- Create, read, update, and delete (CRUD) tasks
- Secure routes (only accessible when logged in)
- Middleware protections:
  - Only Gmail accounts allowed
  - Task length limited to 140 characters
  - Only JSON requests accepted
- Persistent login using localStorage
- Clean and simple user interface

---

# 🛠️ Technologies Used

## Frontend
- React
- Vite
- JavaScript (ES6)
- Fetch API

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- JSON Web Tokens (JWT)

---

# ⚙️ Installation & Setup

## 1. Clone the repository

### backend setup
```bash
git clone <your-repo-url>
cd todo-app
cd backend
npm install
```

### create .env file in backend
MONGO_URI=mongodb://127.0.0.1:27017/todo-app
JWT_SECRET=your_secret_key
PORT=5050

### frontend setup
cd ../frontend
npm install 

---

# TWO terminals

cd backend
npm run dev

cd frontend
npm run dev

---

How to Use the App
1. Register
Open the app
You will see the Register page
Enter:
A username ending with @gmail.com
A password
Submit the form

You will be automatically logged in

2. Login (existing users)
Click "Login"
Enter your credentials
Submit

3. Manage Tasks

Once logged in, you can:

Add tasks
Edit tasks
Delete tasks

4. Logout
Click the Logout button
You will be redirected to the Register page
Middleware Rules

The backend enforces the following:

Only users with @gmail.com usernames can access tasks
Tasks must not exceed 140 characters
Requests must be in JSON format
All task routes are protected (JWT required)

Notes
Users must register before logging in
Data is stored in MongoDB
Authentication is handled using JWT tokens stored in localStorage

Future Improvements
Improve UI styling (e.g. Tailwind CSS)
Add password hashing (bcrypt)
Add task completion status
Deploy application online

