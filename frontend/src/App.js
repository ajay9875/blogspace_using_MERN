import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext'; // Add this import
import Navbar from './components/layout/Navbar'; // Add this import
import Signup from './components/Signup'; // Update path
import Login from './components/Login'; // Update path
import Profile from './components/Profile'; // Update path
import ProtectedRoute from './components/ProtectedRoute'; // Update path
import BlogList from './components/blog/BlogList'; // Add this import
import BlogDetail from './components/blog/BlogDetail'; // Add this import
import BlogForm from './components/blog/BlogForm'; // Add this import

function App() {
  return (
    <Router>
      <AuthProvider>
        <BlogProvider> {/* Add BlogProvider here */}
          <div className="min-h-screen bg-gray-50">
            <Navbar /> {/* Add Navbar */}
            <Routes>
              {/* Auth Routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Blog Routes - Add these */}
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route
                path="/blog/create"
                element={
                  <ProtectedRoute>
                    <BlogForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/edit/:id"
                element={
                  <ProtectedRoute>
                    <BlogForm />
                  </ProtectedRoute>
                }
              />

              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/blogs" replace />} />
            </Routes>
          </div>
        </BlogProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;