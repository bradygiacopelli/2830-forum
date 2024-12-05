import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/CreatePostPage.css';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { forumId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert('User not logged in.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/posts/${forumId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, userId }),
            });

            if (response.ok) {
                navigate(`/forums/${forumId}`);
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
        <div className="create-post-page">
            <div className="create-post-container">
                <h1>Create a New Post</h1>
                <form onSubmit={handleSubmit} className="create-post-form">
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="form-buttons">
                        <button type="submit" className="submit-button">Create Post</button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate(`/forums/${forumId}`)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;
