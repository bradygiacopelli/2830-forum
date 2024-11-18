import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Forum App!</h1>
            <p>This is the home page of your forum app.</p>
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
