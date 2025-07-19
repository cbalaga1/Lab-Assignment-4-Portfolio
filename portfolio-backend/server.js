// server.js (or app.js) - Main application file
// This file sets up the Express server, connects to MongoDB, and defines main routes.

// Required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all routes
// In a production environment, you might want to restrict this to specific origins.
app.use(cors());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_app';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import authentication routes
const authRoutes = require('./routes/authRoutes');

// Use authentication routes
app.use('/auth', authRoutes);

// Simple root route for testing
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running!');
});

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});