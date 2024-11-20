import React from 'react';
import { Link } from 'react-router-dom';
import "./HP_Styling.css";

function HomePage() {
    return (
        <div className="home-page">
            <h1>Welcome to ScrollSpace!</h1>
            <p>This is the home page of your forum app.</p>
            <Link to="/login">
            <button className="homepage-button">
                    Login
                </button>
            </Link>
            <Link to="/signup">
            <button className="homepage-button">
                    Sign Up
                </button>
            </Link>
        </div>
    );
}

export default HomePage;
