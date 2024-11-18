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
app.use('/api/auth', require('./routes/auth'));

// Define Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Forum App API');
});

const PORT = process.env.PORT || 5001;
console.log('Starting backend server...');
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
