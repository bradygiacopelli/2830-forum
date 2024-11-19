const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');

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
    console.log('Create forum request received:', { name, description, userId }); // Log to verify userId

    if (!name || !userId) {
        console.log('Forum creation failed: Name or User ID is missing');
        return res.status(400).json({ message: 'Forum name and User ID are required' });
    }

    try {
        const forum = new Forum({
            name,
            description,
            createdBy: userId, // Use the userId directly from the request body
        });

        await forum.save();
        console.log('Forum created successfully:', forum);
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


module.exports = router;
