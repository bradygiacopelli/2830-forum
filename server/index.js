const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Mount Routes
app.use('/api/auth', require('./routes/auth')); // Auth routes
app.use('/api/forums', require('./routes/forums')); // Forums routes
app.use('/api/posts', require('./routes/posts')); // Posts routes

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Forum App API');
});

// Start the Server
const PORT = process.env.PORT || 5001;
console.log('Starting backend server...');
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
