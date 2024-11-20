import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';

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
                const { token, userId } = await response.json(); // Extract userId from the response
                console.log('Token:', token, 'UserId:', userId); // Debug log
                localStorage.setItem('token', token); // Store token
                localStorage.setItem('userId', userId); // Store userId
                console.log(localStorage)
                setIsAuthenticated(true); // Update auth state
                navigate('/dashboard');
            } else {
                const errorData = await response.json(); // Parse error response
                console.error('Error response:', errorData);
                alert(errorData.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
