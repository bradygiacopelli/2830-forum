import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateForumPage.css';

const CreateForumPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null); // State to hold the uploaded image
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('userId', userId);
        if (file) {
            formData.append('image', file); // Add the image to the form data
        }

        try {
            const response = await fetch('http://localhost:5001/api/forums/create', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to create forum.');
            }
        } catch (error) {
            console.error('Error creating forum:', error);
            alert('An error occurred while creating the forum.');
        }
    };

    return (
        <div className="create-forum-page">
            <form onSubmit={handleSubmit} className="create-forum-form">
                <span className="back-link" onClick={() => navigate('/dashboard')}>
                    ← Back
                </span>
                <h1>Create a New Forum</h1>
                <label htmlFor="forum-name">Forum Name:</label>
                <input
                    id="forum-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="forum-description">Description:</label>
                <textarea
                    id="forum-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label htmlFor="forum-image">Upload Forum Image:</label>
                <input
                    id="forum-image"
                    type="file"
                    onChange={handleFileChange}
                />
                <button type="submit" className="create-forum-button">
                    Create Forum
                </button>
            </form>
        </div>
    );
};

export default CreateForumPage;
