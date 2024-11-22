import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [actualName, setActualName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username, displayName, actualName }),
            });

            if (response.ok) {
                alert('Signup successful! Please log in.');
                navigate('/login');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to sign up.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred.');
        }
    };

    return (
        <div className="signup-form">
            {/* Back Button Styled as Text */}
            <span className="back-link" onClick={() => navigate('/')}>
                ← Back
            </span>
            <h1>Sign Up</h1>
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
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label>Display Name:</label>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
                <label>Full Name:</label>
                <input
                    type="text"
                    value={actualName}
                    onChange={(e) => setActualName(e.target.value)}
                    required
                />
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupForm;
