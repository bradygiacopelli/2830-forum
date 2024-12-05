import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ForumPage from './pages/ForumPage';
import CreatePostPage from './pages/CreatePostPage';
import Navbar from './components/Navbar'; // Authenticated Navbar
import NavbarGuest from './components/NavbarGuest'; // Guest Navbar
import ProfilePage from './pages/ProfilePage';
import CreateForumPage from './pages/CreateForumPage';
import EditForumPage from './pages/EditForumPage';
import PublicProfilePage from './pages/PublicProfilePage';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to check state before rendering
    const [guestMode, setGuestMode] = useState(null); // Same here, null until checked
    const [profilePicture, setProfilePicture] = useState('/uploads/default-profile.png');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userPicture = localStorage.getItem('profilePicture');
        const tokenGuest = token === 'guest';

        setIsAuthenticated(!!token && !tokenGuest); // true if authenticated, false if guest
        setGuestMode(tokenGuest); // Set guest mode if token is 'guest'

        if (userPicture) {
            setProfilePicture(userPicture);
        }
    }, []); // This will run only once when the component mounts

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

    if (isAuthenticated === null || guestMode === null) {
        return null; // Return null or a loading spinner while the state is being determined
    }

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

const RoutesWrapper = ({
    isAuthenticated,
    guestMode,
    setIsAuthenticated,
    profilePicture,
    refreshProfilePicture,
    setGuestMode
}) => {
    const location = useLocation(); // Access location here inside the Router context

    // Reset navbar state when visiting the login page, ensuring the logged-in navbar shows if user is authenticated
    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/signup') {
            // When visiting login or signup, the navbar should not be visible.
            setIsAuthenticated(false);
            setGuestMode(false);
        }
    }, [location.pathname]); // This effect will run when location changes (i.e., when user navigates)

    return (
        <>
            {/* Conditionally render Navbar based on authentication */}
            {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && (
                <Navbar
                    guestMode={guestMode}
                    setIsAuthenticated={setIsAuthenticated}
                    profilePicture={profilePicture}
                    refreshProfilePicture={refreshProfilePicture}
                />
            )}

            {/* Render the guest navbar only if in guest mode and not on login/signup pages */}
            {guestMode && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/' && (
                <NavbarGuest guestMode={guestMode} />
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


