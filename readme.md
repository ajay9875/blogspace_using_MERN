# 🔐 Secure Auth & BlogSpace (MERN Stack)

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.x-blue)
![React](https://img.shields.io/badge/React-18.2.x-61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)

A high-performance Full-Stack application featuring a secure JWT-based authentication system and a dynamic blogging platform with advanced search and interaction capabilities.

## ✨ Features

### 🔑 Authentication & Security
- **Dual-Token Strategy**: Implementation of Short-lived Access Tokens and Long-lived Refresh Tokens.
- **Secure Storage**: Tokens handled via HTTP-Only Cookies to prevent XSS attacks.
- **Protection**: Helmet.js for secure headers, CORS for origin control, and Bcrypt for password hashing.
- **Interceptors**: Automatic token refreshing via Axios interceptors on the frontend.

### 📝 BlogSpace System
- **Advanced Search**: Multi-field search logic (Title, Category, Tags) using MongoDB `$or` and `$regex`.
- **Engagement**: Real-time Like/Unlike system and nested Comment/Reply threads.
- **Performance**: Optimized data retrieval using **Mongoose Population** for relational content.
- **Fuzzy Matching**: Client-side fuzzy search integration using **Fuse.js** for enhanced UX.

## 🛠 Tech Stack

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Winston & Morgan (Logging), Joi (Validation).
**Frontend:** React.js (Context API), React Router DOM, Axios, Tailwind CSS, Fuse.js.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login user & get tokens | ❌ |
| `POST` | `/api/auth/logout` | Logout & clear cookies | ❌ |
| `GET` | `/api/auth/profile` | Get current user profile | ✅ |

### Blogs & Interaction
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Get all blogs (with Search/Pagination) | ❌ |
| `GET` | `/api/blogs/:id` | Get single blog with comments | ❌ |
| `POST` | `/api/blogs` | Create a new blog post | ✅ |
| `POST` | `/api/blogs/:id/like` | Toggle like on a blog | ✅ |
| `POST` | `/api/blogs/:id/comments` | Add a comment/reply | ✅ |

## 🚀 Installation & Setup

1. **Install Dependencies**:
   ```bash
   # From the root directory
   npm run install-all

## Environment Configuration (backend/.env)

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

## Environment Configuration (frontend/.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application
```bash
npm run dev 
```

## 🚀 Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```