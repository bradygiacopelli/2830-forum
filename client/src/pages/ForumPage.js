import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ForumPage = () => {
    const { forumId } = useParams(); // Get forumId from URL
    const [forum, setForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState('latest'); // 'latest' or 'mostLiked'
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [editing, setEditing] = useState(false); // Editing state
    const [name, setName] = useState(''); // Name input state
    const [description, setDescription] = useState(''); // Description input state
    const [file, setFile] = useState(null); // File input state
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    // Fetch forum details
    useEffect(() => {
        const fetchForum = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/forums/${forumId}`);
                if (response.ok) {
                    const data = await response.json();
                    setForum(data);
                    setName(data.name);
                    setDescription(data.description);
                } else {
                    console.error('Failed to fetch forum details');
                }
            } catch (error) {
                console.error('Error fetching forum details:', error);
            }
        };
        fetchForum();
    }, [forumId]);

    // Fetch posts for the forum
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5001/api/posts/${forumId}?sort=${sort}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
                } else {
                    console.error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, [forumId, sort]);

    // Check subscription status
    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/forums/${forumId}/isSubscribed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId }),
                });

                if (response.ok) {
                    const { isSubscribed } = await response.json();
                    setIsSubscribed(isSubscribed);
                }
            } catch (error) {
                console.error('Error checking subscription status:', error);
            }
        };

        fetchSubscriptionStatus();
    }, [forumId, userId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await fetch(`http://localhost:5001/api/forums/${forumId}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const updatedForum = await response.json();
                setForum(updatedForum.forum);
                setEditing(false);
                alert('Forum updated successfully!');
            } else {
                alert('Failed to update forum.');
            }
        } catch (error) {
            console.error('Error updating forum:', error);
        }
    };

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/forums/${forumId}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                setIsSubscribed(true);
            } else {
                console.error('Failed to subscribe');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/forums/${forumId}/unsubscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                setIsSubscribed(false);
            } else {
                console.error('Failed to unsubscribe');
            }
        } catch (error) {
            console.error('Error unsubscribing:', error);
        }
    };

    return (
        <div>
            {/* Display forum details */}
            {forum ? (
                <div>
                    {editing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Forum Name"
                        />
                    ) : (
                        <h1>{forum.name}</h1>
                    )}

                    <img
                        src={`http://localhost:5001${forum.image}`}
                        alt="Forum"
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />

                    {editing ? (
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Forum Description"
                        />
                    ) : (
                        <p>{forum.description}</p>
                    )}

                    {forum.createdBy === userId && (
                        <div>
                            {editing ? (
                                <>
                                    <label>Upload New Image:</label>
                                    <input type="file" onChange={handleFileChange} />
                                    <button onClick={handleSave}>Save Changes</button>
                                    <button onClick={() => setEditing(false)}>Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => setEditing(true)}>Edit Forum</button>
                            )}
                        </div>
                    )}

                    <button onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}>
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                    <Link to={`/forums/${forumId}/create-post`}>
                        <button>Create Post</button>
                    </Link>
                </div>
            ) : (
                <p>Loading forum...</p>
            )}

            {/* Sorting options */}
            <div>
                <button onClick={() => setSort('latest')}>Sort by Latest</button>
                <button onClick={() => setSort('mostLiked')}>Sort by Most Liked</button>
            </div>

            {/* List of posts */}
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        {post.createdBy && (
                            <div>
                                <Link to={`/users/${post.createdBy._id}`}>
                                    <img
                                        src={`http://localhost:5001${post.createdBy.profilePicture}`}
                                        alt={post.createdBy.displayName}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                    />
                                    <span>{post.createdBy.displayName}</span>
                                </Link>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ForumPage;
