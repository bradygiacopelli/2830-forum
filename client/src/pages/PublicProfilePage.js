import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PublicProfilePage = () => {
    const { userId } = useParams(); // ID of the user being viewed
    const [profile, setProfile] = useState(null);
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
        <div>
            {profile && (
                <div>
                    <img
                        src={`http://localhost:5001${profile.profilePicture}`}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                    />
                    <h1>{profile.displayName}</h1>
                    <p>@{profile.username}</p>
                    <p>{profile.bio}</p>
                    <p>Followers: {profile.followers?.length || 0}</p>
                    <p>Following: {profile.following?.length || 0}</p>
                    {loggedInUserId !== userId && (
                        <button onClick={isFollowing ? handleUnfollow : handleFollow}>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
            )}
            {profile?.createdForums?.length > 0 && (
                <div>
                    <h2>Forums Created</h2>
                    <ul>
                        {profile.createdForums.map((forum) => (
                            <li key={forum._id}>{forum.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            {profile?.subscribedForums?.length > 0 && (
                <div>
                    <h2>Forums Subscribed To</h2>
                    <ul>
                        {profile.subscribedForums.map((forum) => (
                            <li key={forum._id}>{forum.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PublicProfilePage;
