import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                <label>Upload Forum Image:</label>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Create Forum</button>
            </form>
        </div>
    );
};

export default CreateForumPage;
