
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./css/Global_Styling.css";
import "./css/HP_Styling.css";

function HomePage() {
    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem('token'); // Check if the user is already authenticated
        if (token) {
            navigate('/dashboard'); // Redirect to the dashboard if authenticated
        }
    }, [navigate]);

    return (
        <div className="home-page">
        <h1>Welcome to ScrollSpace!</h1>
        <p>This is the home page of your forum app.</p>
        
        
        <div className="button-container">
            <Link to="/login">
                <button className="homepage-button highlighted-button">Login</button>
            </Link>
            <span className="or-text">- or -</span> 
            <Link to="/signup">
                <button className="homepage-button highlighted-button">Sign Up</button>
            </Link>
        </div>
    </div>
);
}

export default HomePage;
