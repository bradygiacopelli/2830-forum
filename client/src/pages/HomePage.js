import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Check if the user is already authenticated
        if (token) {
            navigate('/dashboard'); // Redirect to the dashboard if authenticated
        }
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to ScrollSpace!</h1>
            <p>This is the home page of ScrollSpace.</p>
            <Link to="/login">
                <button style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
                    Login
                </button>
            </Link>
            <Link to="/signup">
                <button style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Sign Up
                </button>
            </Link>
        </div>
    );
}

export default HomePage;
