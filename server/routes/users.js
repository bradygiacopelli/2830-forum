const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Save files in the "public/uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Serve uploaded files statically
router.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/:userId', upload.single('profilePicture'), async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);
    const { name, bio } = req.body;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (req.file) {
            user.profilePicture = `/uploads/${req.file.filename}`;
        } else if (!user.profilePicture) {
            user.profilePicture = '/uploads/default-profile.png';
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Follow a user
router.post('/:userId/follow', async (req, res) => {
    const { followerId } = req.body; // ID of the user following

    try {
        const userToFollow = await User.findById(req.params.userId);
        const follower = await User.findById(followerId);

        if (!userToFollow || !follower) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!userToFollow.followers.includes(followerId)) {
            userToFollow.followers.push(followerId);
            follower.following.push(req.params.userId);

            await userToFollow.save();
            await follower.save();
        }

        res.json({ message: 'Followed successfully', user: userToFollow });
    } catch (err) {
        console.error('Error following user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unfollow a user
router.post('/:userId/unfollow', async (req, res) => {
    const { followerId } = req.body;

    try {
        const userToUnfollow = await User.findById(req.params.userId);
        const follower = await User.findById(followerId);

        if (!userToUnfollow || !follower) {
            return res.status(404).json({ message: 'User not found' });
        }

        userToUnfollow.followers.pull(followerId);
        follower.following.pull(req.params.userId);

        await userToUnfollow.save();
        await follower.save();

        res.json({ message: 'Unfollowed successfully', user: userToUnfollow });
    } catch (err) {
        console.error('Error unfollowing user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;
