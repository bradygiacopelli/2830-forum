import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/PublicProfilePage.css';

const PublicProfilePage = () => {
    const { userId } = useParams(); // ID of the user being viewed
    const [profile, setProfile] = useState(null);
    const [subscribedForums, setSubscribedForums] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const loggedInUserId = localStorage.getItem('userId'); // Logged-in user's ID

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setIsFollowing(data.followers.includes(loggedInUserId));

                    // Fetch subscribed forums
                    if (data.subscribedForums.length > 0) {
                        const subscribedResponse = await fetch(
                            `http://localhost:5001/api/forums/details`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ forumIds: data.subscribedForums }),
                            }
                        );
                        const subscribedData = await subscribedResponse.json();
                        setSubscribedForums(subscribedData);
                    }
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [userId, loggedInUserId]);

    const handleFollow = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}/follow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: loggedInUserId }),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile.user);
                setIsFollowing(true);
            } else {
                console.error('Failed to follow user');
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}/unfollow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ followerId: loggedInUserId }),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile.user);
                setIsFollowing(false);
            } else {
                console.error('Failed to unfollow user');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <div className="public-profile-card">
            {profile ? (
                <>
                    <div className="profile-header">
                        <img
                            src={`http://localhost:5001${profile.profilePicture}`}
                            alt="Profile"
                            className="profile-picture"
                        />
                        <div className="profile-details">
                            <h1 className="profile-display-name">{profile.displayName || 'User'}</h1>
                            <p className="profile-username">@{profile.username}</p>
                        </div>
                        <div className="followers-following">
                            <div>Followers: {profile.followers?.length || 0}</div>
                            <div>Following: {profile.following?.length || 0}</div>
                        </div>
                    </div>
                    <p className="profile-bio">{profile.bio || 'No bio provided'}</p>
                    {loggedInUserId !== userId && (
                        <div className="action-buttons">
                            <button
                                className="action-button"
                                onClick={isFollowing ? handleUnfollow : handleFollow}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        </div>
                    )}
                    {subscribedForums.length > 0 && (
                        <div className="forum-section">
                            <h2>Subscribed Forums</h2>
                            <ul className="forum-list">
                                {subscribedForums.map((forum) => (
                                    <li key={forum._id}>
                                        <Link to={`/forums/${forum._id}`} className="forum-link">
                                            {forum.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default PublicProfilePage;
