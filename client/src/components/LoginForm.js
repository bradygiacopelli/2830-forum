import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const { token, userId } = await response.json();
                localStorage.setItem('token', token); // Store token
                localStorage.setItem('userId', userId); // Store userId
                setIsAuthenticated(true); // Update auth state
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred.');
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
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
            <button type="submit" className="login-button">
                Login
            </button>
        </form>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    backButton: {
        background: 'none',
        border: 'none',
        color: '#007BFF',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
};

export default LoginForm;
