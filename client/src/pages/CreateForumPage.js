import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateForumPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        console.log('Submitting forum creation:', { name, description, userId }); // Log to verify

        try {
            const response = await fetch('http://localhost:5001/api/forums/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description, userId }), // Include userId in the request
            });

            console.log('Response status:', response.status); // Log response status

            if (response.ok) {
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                console.error('Error data:', errorData); // Log response error data
                alert(errorData.message || 'Failed to create forum.');
            }
        } catch (error) {
            console.error('Error creating forum:', error); // Log any fetch-related errors
            alert('An error occurred while creating the forum.');
        }
    };

    return (
        <div>
            <h1>Create a New Forum</h1>
            <form onSubmit={handleSubmit}>
                <label>Forum Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Create Forum</button>
            </form>
        </div>
    );
};

export default CreateForumPage;
