import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
    const [guestMode, setGuestMode] = useState(false); 
    const [profilePicture, setProfilePicture] = useState('/uploads/default-profile.png');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userPicture = localStorage.getItem('profilePicture');
        const tokenGuest = token === 'guest';
        setIsAuthenticated(!!token && !tokenGuest);
        setGuestMode(tokenGuest);
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
            <RoutesWrapper
                isAuthenticated={isAuthenticated}
                guestMode={guestMode}
                setIsAuthenticated={setIsAuthenticated}
                profilePicture={profilePicture}
                refreshProfilePicture={refreshProfilePicture}
                setGuestMode={setGuestMode}
            />
        </Router>
    );
};

const RoutesWrapper = ({ isAuthenticated, guestMode, setIsAuthenticated, profilePicture, refreshProfilePicture, setGuestMode }) => {
    const location = useLocation(); // Access the current route
    const [currentPath, setCurrentPath] = useState(location.pathname); // Track current path for re-render

    useEffect(() => {
        setCurrentPath(location.pathname); // Update the path on route change
    }, [location]);

    return (
        <>
            {/* Render Navbar only if not on the home page */}
            {(isAuthenticated || guestMode) && location.pathname !== '/' && (
                <Navbar
                    key={currentPath} // Force re-render on path change
                    setIsAuthenticated={setIsAuthenticated}
                    profilePicture={profilePicture}
                    refreshProfilePicture={refreshProfilePicture}
                />
            )}

            <Routes>
                <Route path="/" element={<HomePage setGuestMode={setGuestMode} />} />
                <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<SignupPage />} />

                {guestMode ? (
                    <>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/forums/:forumId" element={<ForumPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage refreshProfilePicture={refreshProfilePicture} />} />
                        <Route path="/create-forum" element={<CreateForumPage />} />
                        <Route path="/forums/:forumId" element={<ForumPage />} />
                        <Route path="/edit-forum/:forumId" element={<EditForumPage />} />
                        <Route path="/forums/:forumId/create-post" element={<CreatePostPage />} />
                        <Route path="/users/:userId" element={<PublicProfilePage />} />
                    </>
                )}
            </Routes>
        </>
    );
};

export default App;


