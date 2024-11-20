import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ForumPage = () => {
    const { forumId } = useParams(); // Get forumId from URL
    const [forum, setForum] = useState(null);
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState('latest'); // 'latest' or 'mostLiked'
    const [isSubscribed, setIsSubscribed] = useState(false);
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    // Fetch forum details
    useEffect(() => {
        const fetchForum = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/forums/${forumId}`);
                if (response.ok) {
                    const data = await response.json();
                    setForum(data);
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

    const updatePostUI = (updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
        );
    };

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const updatedPost = await response.json(); // Fetch updated post data
                updatePostUI(updatedPost); // Update the specific post in the UI
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to like the post.');
            }
        } catch (error) {
            console.error('Error liking post:', error);
            alert('An error occurred while liking the post.');
        }
    };

    const handleDislike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/posts/${postId}/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (response.ok) {
                const updatedPost = await response.json(); // Fetch updated post data
                updatePostUI(updatedPost); // Update the specific post in the UI
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to dislike the post.');
            }
        } catch (error) {
            console.error('Error disliking post:', error);
            alert('An error occurred while disliking the post.');
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
            {/* Display the forum name */}
            <h1>{forum ? forum.name : 'Loading...'}</h1>
            <p>{forum ? forum.description : ''}</p>

            {/* Subscribe/Unsubscribe Button */}
            <button onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}>
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>

            {/* Add a button to create a post */}
            <Link to={`/forums/${forumId}/create-post`}>
                <button>Create Post</button>
            </Link>

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
                        <button onClick={() => handleLike(post._id)}>Like ({post.likes})</button>
                        <button onClick={() => handleDislike(post._id)}>Dislike ({post.dislikes})</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ForumPage;
