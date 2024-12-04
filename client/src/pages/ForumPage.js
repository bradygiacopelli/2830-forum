import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ForumPage.css';

const ForumPage = () => {
    const { forumId } = useParams();
    const [forum, setForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState('latest');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const userId = localStorage.getItem('userId');

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
                }
            } catch (error) {
                console.error('Error fetching forum details:', error);
            }
        };
        fetchForum();
    }, [forumId]);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5001/api/posts/${forumId}?sort=${sort}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data);
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

    const handleFileChange = (e) => setFile(e.target.files[0]);

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

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/posts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? {
                                ...post,
                                likes: updatedPost.likes,
                                dislikes: updatedPost.dislikes,
                                likedBy: updatedPost.likedBy,
                                dislikedBy: updatedPost.dislikedBy,
                                createdBy: {
                                    ...post.createdBy, // Ensure `createdBy` is preserved
                                    ...updatedPost.createdBy,
                                },
                            }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleDislike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/posts/${postId}/dislike`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === postId
                            ? {
                                ...post,
                                likes: updatedPost.likes,
                                dislikes: updatedPost.dislikes,
                                likedBy: updatedPost.likedBy,
                                dislikedBy: updatedPost.dislikedBy,
                                createdBy: {
                                    ...post.createdBy, // Ensure `createdBy` is preserved
                                    ...updatedPost.createdBy,
                                },
                            }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error('Error disliking post:', error);
        }
    };

    return (
        <div className="forum-page">
            {forum ? (
                <>
                    {/* Forum Banner */}
                    <div className="forum-banner">
                        <img
                            src={`http://localhost:5001${forum.image}`}
                            alt="Forum Banner"
                            className="forum-banner-image"
                        />
                        {editing ? (
                            <div className="edit-forum-container">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Forum Name"
                                    className="edit-input"
                                />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Forum Description"
                                    className="edit-textarea"
                                />
                                <label className="edit-file-label">
                                    Upload New Banner:
                                    <input type="file" onChange={handleFileChange} className="edit-file-input" />
                                </label>
                                <div className="edit-buttons">
                                    <button onClick={handleSave} className="save-button">Save Changes</button>
                                    <button onClick={() => setEditing(false)} className="cancel-button">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="forum-banner-content">
                                <h1 className="forum-banner-title">{forum.name}</h1>
                                <p className="forum-banner-description">{forum.description}</p>
                                {forum.createdBy === userId && (
                                    <Link to={`/edit-forum/${forumId}`} className="edit-button">
                                        Edit Forum
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Forum Actions */}
                    <div className="forum-actions">
                        {isSubscribed ? (
                            <button onClick={handleUnsubscribe} className="subscribe-button">
                                Unsubscribe
                            </button>
                        ) : (
                            <button onClick={handleSubscribe} className="subscribe-button">
                                Subscribe
                            </button>
                        )}
                        <Link to={`/forums/${forumId}/create-post`} className="create-post-button">
                            Create Post
                        </Link>
                        <button
                            onClick={() => setSort('latest')}
                            className={`sort-button ${sort === 'latest' ? 'active' : ''}`}
                        >
                            Sort by Latest
                        </button>
                        <button
                            onClick={() => setSort('mostLiked')}
                            className={`sort-button ${sort === 'mostLiked' ? 'active' : ''}`}
                        >
                            Sort by Most Liked
                        </button>
                    </div>

                    {/* Posts */}
                    <div className="forum-posts">
                        {posts.map((post) => (
                            <div key={post._id} className="post-card">
                                <div className="post-header">
                                    <Link to={`/users/${post.createdBy._id}`} className="post-user">
                                        <img
                                            src={`http://localhost:5001${post.createdBy.profilePicture}`}
                                            alt={post.createdBy.displayName}
                                            className="post-user-image"
                                        />
                                        <span className="post-display-name">
                                            {post.createdBy.displayName}
                                        </span>
                                        <span className="post-username">
                                            @{post.createdBy.username}
                                        </span>
                                    </Link>
                                </div>
                                <div className="post-body">
                                    <h2>{post.title}</h2>
                                    <p>{post.content}</p>
                                </div>
                                <div className="post-footer">
                                    <button onClick={() => handleLike(post._id)} className="like-button">
                                        👍 {post.likes}
                                    </button>
                                    <button
                                        onClick={() => handleDislike(post._id)}
                                        className="dislike-button"
                                    >
                                        👎 {post.dislikes}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p>Loading forum...</p>
            )}
        </div>
    );
};

export default ForumPage;
