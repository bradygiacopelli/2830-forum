const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');
const User = require('../models/User')

// Get forums the user is subscribed to
router.get('/subscribed', async (req, res) => {
    try {
        const forums = await Forum.find(); // For now, return all forums
        res.json(forums);
    } catch (err) {
        console.error('Error fetching forums:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new forum
router.post('/create', async (req, res) => {
    const { name, description, userId } = req.body;

    if (!name || !userId) {
        return res.status(400).json({ message: 'Forum name and User ID are required' });
    }

    try {
        const forum = new Forum({
            name,
            description,
            createdBy: userId,
            subscribers: [userId], // Automatically subscribe the creator
        });

        await forum.save();

        // Add the forum to the creator's profile
        const user = await User.findById(userId);
        user.createdForums.push(forum._id);
        user.subscribedForums.push(forum._id);
        await user.save();

        res.status(201).json({ message: 'Forum created successfully', forum });
    } catch (err) {
        console.error('Error creating forum:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific forum by ID
router.get('/:forumId', async (req, res) => {
    try {
        const forum = await Forum.findById(req.params.forumId);
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }
        res.json(forum);
    } catch (err) {
        console.error('Error fetching forum:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Subscribe to a forum
router.post('/:forumId/subscribe', async (req, res) => {
    const { userId } = req.body;
    try {
        const forum = await Forum.findById(req.params.forumId);
        const user = await User.findById(userId);

        if (!forum || !user) {
            return res.status(404).json({ message: 'Forum or user not found' });
        }

        if (!forum.subscribers.includes(userId)) {
            forum.subscribers.push(userId);
            user.subscribedForums.push(req.params.forumId);

            await forum.save();
            await user.save();
        }

        res.json({ message: 'Subscribed successfully', forum });
    } catch (err) {
        console.error('Error subscribing to forum:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Unsubscribe from a forum
router.post('/:forumId/unsubscribe', async (req, res) => {
    const { userId } = req.body;
    try {
        const forum = await Forum.findById(req.params.forumId);
        const user = await User.findById(userId);

        if (!forum || !user) {
            return res.status(404).json({ message: 'Forum or user not found' });
        }

        forum.subscribers.pull(userId);
        user.subscribedForums.pull(req.params.forumId);

        await forum.save();
        await user.save();

        res.json({ message: 'Unsubscribed successfully', forum });
    } catch (err) {
        console.error('Error unsubscribing from forum:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:forumId/isSubscribed', async (req, res) => {
    const { userId } = req.body;

    try {
        const forum = await Forum.findById(req.params.forumId);
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found' });
        }

        const isSubscribed = forum.subscribers.includes(userId);
        res.json({ isSubscribed });
    } catch (err) {
        console.error('Error checking subscription status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/details', async (req, res) => {
    const { forumIds } = req.body;

    try {
        const forums = await Forum.find({ _id: { $in: forumIds } });
        res.json(forums);
    } catch (error) {
        console.error('Error fetching forums:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
