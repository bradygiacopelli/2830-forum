import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditForumPage.css';

const EditForumPage = () => {
    const { forumId } = useParams();
    const [forum, setForum] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForum = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/forums/${forumId}`);
                if (response.ok) {
                    const data = await response.json();
                    setForum(data);
                    setName(data.name);
                    setDescription(data.description);
                }
            } catch (error) {
                console.error('Error fetching forum details:', error);
            }
        };

        fetchForum();
    }, [forumId]);

    const handleFileChange = (e) => setFile(e.target.files[0]); // comment

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (file) formData.append('image', file);

        try {
            const response = await fetch(`http://localhost:5001/api/forums/${forumId}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                alert('Forum updated successfully!');
                navigate(`/forums/${forumId}`);
            } else {
                alert('Failed to update forum.');
            }
        } catch (error) {
            console.error('Error updating forum:', error);
        }
    };

    return (
        <div className="edit-forum-page">
            {forum ? (
                <div className="edit-forum-container">
                    <h1>Edit Forum</h1>
                    <label>Forum Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="edit-input"
                    />
                    <label>Forum Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="edit-textarea"
                    />
                    <label className="edit-file-label">
                        Upload New Banner:
                        <input type="file" onChange={handleFileChange} className="edit-file-input" />
                    </label>
                    <div className="edit-buttons">
                        <button onClick={handleSave} className="save-button">Save Changes</button>
                        <button onClick={() => navigate(`/forums/${forumId}`)} className="cancel-button">
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading forum...</p>
            )}
        </div>
    );
};

export default EditForumPage;
