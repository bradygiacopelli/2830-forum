import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/HomePage.css";

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check if the user is already authenticated
        if (token) {
            navigate('/dashboard'); // Redirect to the dashboard if authenticated
        }
    }, [navigate]);

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
            </div>
        </div>
    );
}

export default HomePage;
