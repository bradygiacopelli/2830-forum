import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to log in.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred.');
        }
    };

    return (
        <div className="login-form">
            {/* Back Button Styled as Text */}
            <span className="back-link" onClick={() => navigate('/')}>
                ← Back
            </span>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Log In</button>
            </form>
        </div>
    );
};

export default LoginForm;
