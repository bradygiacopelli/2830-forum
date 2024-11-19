import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateForumPage from './pages/CreateForumPage';
import ForumPage from './pages/ForumPage';
import CreatePostPage from './pages/CreatePostPage';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/create-forum" element={<CreateForumPage />} />
                <Route path="/forums/:forumId" element={<ForumPage />} />
                <Route path="/forums/:forumId/create-post" element={<CreatePostPage />} />
            </Routes>
        </Router>
    );
}

export default App;
