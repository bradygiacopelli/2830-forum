import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/HomePage.css";

function HomePage({ setGuestMode }) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && token !== 'guest') {
            navigate('/dashboard'); // Redirect to the dashboard if authenticated
        }
    }, [navigate]);

    // Function to set a guest token in localStorage
    const handleContinueAsGuest = () => {
        localStorage.setItem('token', 'guest');
        setGuestMode(true);
        navigate('/dashboard');
    };

    return (
        <div className="home-page">
            <img src="/image.png" alt="Scrollspace Logo" className="homepage-logo" />
            <h1>Welcome to ScrollSpace!</h1>
            
            <p>ScrollSpace is a forum service where ideas are shared, stories are told, and friends are made.</p>


            <div className="button-container">
                <Link to="/login">
                    <button className="homepage-button">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="homepage-button">Sign Up</button>
                </Link>
                <button
                    onClick={handleContinueAsGuest}
                    className="homepage-button"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
}

export default HomePage;
