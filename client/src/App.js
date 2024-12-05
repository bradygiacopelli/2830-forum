import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ForumPage from './pages/ForumPage';
import CreatePostPage from './pages/CreatePostPage';
import Navbar from './components/Navbar';
import GuestNavbar from './components/GuestNavbar'; // Separate Guest Navbar
import ProfilePage from './pages/ProfilePage';
import CreateForumPage from './pages/CreateForumPage';
import EditForumPage from './pages/EditForumPage';
import PublicProfilePage from './pages/PublicProfilePage';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [guestMode, setGuestMode] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/uploads/default-profile.png');

    // Function to reset authentication states
    const resetAuthStates = () => {
        const token = localStorage.getItem('token');
        const userPicture = localStorage.getItem('profilePicture');
        const tokenGuest = token === 'guest';
        setIsAuthenticated(!!token && !tokenGuest);
        setGuestMode(tokenGuest);
        if (userPicture) {
            setProfilePicture(userPicture);
        } else {
            setProfilePicture('/uploads/default-profile.png');
        }
    };

    // Check auth state on load
    useEffect(() => {
        resetAuthStates();
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

    const handleLoginStateChange = () => {
        resetAuthStates();
    };

    return (
        <Router>
            {/* Conditionally render the appropriate Navbar */}
            {guestMode ? (
                <GuestNavbar />
            ) : (
                isAuthenticated && (
                    <Navbar
                        setIsAuthenticated={setIsAuthenticated}
                        profilePicture={profilePicture}
                        refreshProfilePicture={refreshProfilePicture}
                    />
                )
            )}
            <Routes>
                {/* Routes for all users */}
                <Route
                    path="/"
                    element={
                        <HomePage
                            setGuestMode={(mode) => {
                                setGuestMode(mode);
                                handleLoginStateChange(); // Reset state dynamically
                            }}
                        />
                    }
                />
                <Route
                    path="/login"
                    element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="/signup" element={<SignupPage />} />

                {/* Guest users */}
                {guestMode ? (
                    <>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/forums/:forumId" element={<ForumPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    // Authenticated users
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
                )}
            </Routes>
        </Router>
    );
};

export default App;
