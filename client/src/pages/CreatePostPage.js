import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { forumId } = useParams(); // Get forumId from URL
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

        if (!userId) {
            alert('User not logged in.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/posts/${forumId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, userId }), // Include userId
            });

            if (response.ok) {
                navigate(`/forums/${forumId}`); // Redirect to the forum page
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to create post.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post.');
        }
    };

    return (
        <div>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label>Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePostPage;
