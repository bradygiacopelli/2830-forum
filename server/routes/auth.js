const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Login Route
router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for email:', email);
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log("User ID:", user._id);
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login successful for user:', email);

        // Include userId in the response
        res.json({
            token,
            userId: user._id,
         });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



// Sign-Up Route
// Sign-Up Route
router.post('/signup', async (req, res) => {
    const { email, password, username, displayName, actualName } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create and save the new user
        const newUser = new User({
            email,
            password,
            username,
            displayName,
            actualName,
            followers: [], // Initialize as empty
            following: [], // Initialize as empty
        });

        await newUser.save();

        // Generate a JWT for immediate login after sign-up
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Sign-Up Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
