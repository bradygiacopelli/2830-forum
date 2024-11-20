import React, { useState, useEffect } from 'react';

const ProfilePage = ({ refreshProfilePicture }) => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [actualName, setActualName] = useState('');
    const [bio, setBio] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);

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
            {profile && (
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
                    <p>Followers: {profile.followers.length}</p>
                    <p>Following: {profile.following.length}</p>

                    {/* Edit Profile Button */}
                    <button onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
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
