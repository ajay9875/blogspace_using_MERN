# 🔐 Authentication System

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.x-blue)
![React](https://img.shields.io/badge/React-18.2.x-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

A complete full-stack authentication system built with the MERN stack featuring JWT authentication using Access & Refresh tokens, secure password hashing, and role-based route protection.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)

## ✨ Features

- **Authentication Strategy**: Double-token authentication system (Short-lived Access Token + Long-lived Refresh Token).
- **Security**: 
  - HTTP-Only Cookies for token storage.
  - Helmet.js for setting secure HTTP headers.
  - CORS configuration for allowed origins.
  - Rate limiting to prevent brute-force attacks.
  - Data Validation using `Joi`.
- **Backend Logging**: Advanced structured logging using `Winston` and request logging with `Morgan`.
- **Frontend**: 
  - React.js with Context API for global auth state management.
  - Protected Routes (HOC) to secure pages.
  - Automatic token refreshing via Axios interceptors.
- **Styling**: Tailwind CSS & PostCSS configured for modern styling.

## 🛠 Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & Bcrypt
- Winston & Morgan (Logging)
- Helmet & CORS (Security)

**Frontend:**
- React.js (Create React App)
- React Router DOM
- Axios
- Tailwind CSS & PostCSS

## 📁 Project Structure

```bash
Authentication-system/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & Environment config
│   │   ├── controllers/      # Route controllers (Auth logic)
│   │   ├── middlewares/      # Auth, Error, & Validation middlewares
│   │   ├── models/           # Mongoose models (User)
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic (Auth, Token services)
│   │   ├── utils/            # AppError, Async handlers
│   │   └── validations/      # Joi schemas
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   └── .env                 # Backend environment variables
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # UI Components (Login, Signup, Profile)
│   │   ├── context/         # Auth Provider & Context
│   │   ├── services/        # API configuration (Axios)
│   │   ├── App.js           # Main application component
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Global styles (Tailwind directives)
│   └── .env                 # Frontend environment variables
│
└── package.json             # Root scripts for concurrent execution
```

## ⚙️ Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local instance running on `27017` or Atlas URI)

## 🚀 Installation

1.  **Clone the repository** (if applicable) or navigate to project root.

2.  **Install All Dependencies** (Root, Backend, and Frontend):
    ```bash
    npm run install-all
    ```
    *Alternatively, install individually:*
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    ```

## 🔑 Environment Variables

Ensure you have `.env` files in both `backend/` and `frontend/` directories.

**Backend (`backend/.env`):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auth_system
JWT_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
BCRYPT_ROUNDS=10
CLIENT_URL=http://localhost:3000
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## ▶️ Running the Application

You can run both backend and frontend concurrently from the root directory:

```bash
npm run dev
```

- **Backend** runs on: `http://localhost:5000`
- **Frontend** runs on: `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user & get tokens | ❌ |
| `POST` | `/api/auth/logout` | Logout user (clear cookies) | ❌ |
| `POST` | `/api/auth/refresh-token` | Refresh access token | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |
