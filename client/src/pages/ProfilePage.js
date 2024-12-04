import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProfilePage.css';

const ProfilePage = ({ refreshProfilePicture }) => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [showSubscribedForums, setShowSubscribedForums] = useState(false);
    const [subscribedForums, setSubscribedForums] = useState([]);
    const [username, setUsername] = useState('');
    const [actualName, setActualName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    const userId = localStorage.getItem('userId'); // Get user ID from storage

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setUsername(data.username);
                    setActualName(data.actualName);
                    setBio(data.bio);

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
    }, [userId]);

    const handleFileChange = (e) => setProfilePicture(e.target.files[0]);

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('actualName', actualName);
        formData.append('bio', bio);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile.user);
                setEditing(false);
                refreshProfilePicture(); // Refresh navbar picture
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-card">
            {profile ? (
                <>
                    {!editing ? (
                        <>
                            <div className="profile-header">
                                <img
                                    src={`http://localhost:5001${profile.profilePicture}`}
                                    alt="Profile"
                                    className="profile-picture"
                                />
                                <div className="profile-details">
                                    <h1 className="profile-display-name">{profile.actualName || 'User'}</h1>
                                    <p className="profile-username">@{profile.username}</p>
                                </div>
                                <div className="followers-following">
                                    <div>Followers: {profile.followers?.length || 0}</div>
                                    <div>Following: {profile.following?.length || 0}</div>
                                </div>
                            </div>
                            <p className="profile-bio">{profile.bio || 'No bio provided'}</p>
                            <div className="action-buttons">
                                <button
                                    className="action-button"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </button>
                                <button
                                    className="action-button"
                                    onClick={() => setShowSubscribedForums((prev) => !prev)}
                                >
                                    {showSubscribedForums
                                        ? 'Hide Subscribed Forums'
                                        : 'Show Subscribed Forums'}
                                </button>
                            </div>
                            {showSubscribedForums && subscribedForums.length > 0 && (
                                <ul className="forum-list">
                                    {subscribedForums.map((forum) => (
                                        <li key={forum._id}>
                                            <Link to={`/forums/${forum._id}`} className="forum-link">
                                                {forum.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <form className="edit-profile-form" onSubmit={handleSave}>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    value={actualName}
                                    onChange={(e) => setActualName(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Username:
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Bio:
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </label>
                            <label>
                                Profile Picture:
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <div className="edit-buttons">
                                <button type="submit" className="save-button">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="cancel-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default ProfilePage;
