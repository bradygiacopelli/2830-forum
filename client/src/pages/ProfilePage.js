import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = ({ refreshProfilePicture }) => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [actualName, setActualName] = useState('');
    const [bio, setBio] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);

    const [showCreatedForums, setShowCreatedForums] = useState(false);
    const [showSubscribedForums, setShowSubscribedForums] = useState(false);
    const [createdForums, setCreatedForums] = useState([]);
    const [subscribedForums, setSubscribedForums] = useState([]);

    const userId = localStorage.getItem('userId'); // Get user ID from storage

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                    setUsername(data.username);
                    setDisplayName(data.displayName);
                    setActualName(data.actualName);
                    setBio(data.bio);

                    // Fetch details for created and subscribed forums
                    if (data.createdForums.length > 0) {
                        const createdResponse = await fetch(
                            `http://localhost:5001/api/forums/details`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ forumIds: data.createdForums }),
                            }
                        );
                        const createdData = await createdResponse.json();
                        setCreatedForums(createdData);
                    }

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

    const handleFileChange = (e) => {
        setNewProfilePicture(e.target.files[0]);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('displayName', displayName);
        formData.append('actualName', actualName);
        formData.append('bio', bio);
        if (newProfilePicture) {
            formData.append('profilePicture', newProfilePicture);
        }

        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile.user);
                refreshProfilePicture(); // Refresh navbar picture
                setEditing(false);
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating your profile.');
        }
    };

    return (
        <div>
            {profile ? (
                <div>
                    {/* Profile Picture */}
                    <img
                        src={`http://localhost:5001${profile.profilePicture}`}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                    />
                    {/* Profile Details */}
                    <h1>{profile.displayName || 'User'}</h1>
                    <p>@{profile.username}</p>
                    <p>{profile.bio || 'No bio provided'}</p>

                    {/* Followers and Following */}
                    <p>Followers: {profile.followers?.length || 0}</p>
                    <p>Following: {profile.following?.length || 0}</p>

                    {/* Edit Profile Button */}
                    <button onClick={() => setEditing(true)}>Edit Profile</button>

                    {/* Created Forums Dropdown */}
                    <div>
                        <button
                            onClick={() => setShowCreatedForums((prev) => !prev)}
                            style={{ marginTop: '20px' }}
                        >
                            {showCreatedForums ? 'Hide Created Forums' : 'Show Created Forums'}
                        </button>
                        {showCreatedForums && createdForums.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {createdForums.map((forum) => (
                                    <li key={forum._id}>
                                        <Link to={`/forums/${forum._id}`}>{forum.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Subscribed Forums Dropdown */}
                    <div>
                        <button
                            onClick={() => setShowSubscribedForums((prev) => !prev)}
                            style={{ marginTop: '20px' }}
                        >
                            {showSubscribedForums ? 'Hide Subscribed Forums' : 'Show Subscribed Forums'}
                        </button>
                        {showSubscribedForums && subscribedForums.length > 0 && (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {subscribedForums.map((forum) => (
                                    <li key={forum._id}>
                                        <Link to={`/forums/${forum._id}`}>{forum.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
            {editing && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Display Name:</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={actualName}
                        onChange={(e) => setActualName(e.target.value)}
                    />
                    <label>Bio:</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <label>Profile Picture:</label>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit">Save</button>
                </form>
            )}
        </div>
    );
};

export default ProfilePage;
