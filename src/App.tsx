import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CreateEditPostPage } from './pages/CreateEditPostPage';
import { MyPostsPage } from './pages/MyPostsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-[#050505] text-[#E5E5E5] selection:bg-[#FF2B2B] selection:text-white">

            <Navbar />

            <main className="flex-1">
              <Routes>

                {/* Home */}
                <Route
                  path="/"
                  element={<HomePage />}
                />

                {/* Explore */}
                <Route
                  path="/explore"
                  element={<ExplorePage />}
                />

                {/* Post */}
                <Route
                  path="/post/:id"
                  element={<PostDetailPage />}
                />

                {/* Create */}
                <Route
                  path="/create"
                  element={<CreateEditPostPage />}
                />

                {/* Edit */}
                <Route
                  path="/edit/:id"
                  element={<CreateEditPostPage />}
                />

                {/* My Posts */}
                <Route
                  path="/my-posts"
                  element={<MyPostsPage />}
                />

                {/* Profile */}
                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />

                {/* Login */}
                <Route
                  path="/login"
                  element={<LoginPage />}
                />

                {/* Register */}
                <Route
                  path="/register"
                  element={<RegisterPage />}
                />

                {/* Unknown route */}
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />

              </Routes>
            </main>

            <Footer />

          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
