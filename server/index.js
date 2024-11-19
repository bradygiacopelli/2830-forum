const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Serve static files for profile pictures
app.use('/uploads', express.static('public/uploads'));

// Mount Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/forums', require('./routes/forums'));
app.use('/api/posts', require('./routes/posts'));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Forum App API');
});

// Start Server
const PORT = process.env.PORT || 5001;
console.log('Starting backend server...');
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
