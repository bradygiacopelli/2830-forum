import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ForumPage from './pages/ForumPage';
import CreatePostPage from './pages/CreatePostPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import CreateForumPage from './pages/CreateForumPage';
import EditForumPage from './pages/EditForumPage';
import PublicProfilePage from './pages/PublicProfilePage';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/uploads/default-profile.png');

    // Check if the user is logged in and set the profile picture on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userPicture = localStorage.getItem('profilePicture');
        setIsAuthenticated(!!token); // Convert token existence to boolean
        if (userPicture) {
            setProfilePicture(userPicture);
        }
    }, []);

    const refreshProfilePicture = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const updatedPicture = `http://localhost:5001${data.profilePicture}`;
                setProfilePicture(updatedPicture);
                localStorage.setItem('profilePicture', updatedPicture);
            }
        } catch (error) {
            console.error('Error refreshing profile picture:', error);
        }
    };

    return (
        <Router>
            {/* Conditionally render the Navbar */}
            <div>
                {isAuthenticated && (
                    <Navbar
                        setIsAuthenticated={setIsAuthenticated}
                        profilePicture={profilePicture}
                        refreshProfilePicture={refreshProfilePicture}
                    />
                )}
            </div>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<SignupPage />} />
                {isAuthenticated ? (
                    <>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route
                            path="/profile"
                            element={<ProfilePage refreshProfilePicture={refreshProfilePicture} />}
                        />
                        <Route path="/create-forum" element={<CreateForumPage />} />
                        <Route path="/forums/:forumId" element={<ForumPage />} />
                        <Route path="/edit-forum/:forumId" element={<EditForumPage />} />
                        <Route path="/forums/:forumId/create-post" element={<CreatePostPage />} />
                        <Route path="/users/:userId" element={<PublicProfilePage />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/" />} />
                )}
            </Routes>
        </Router>
    );
};

export default App;
