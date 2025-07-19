// middleware/authMiddleware.js
// Middleware to verify JWT tokens and protect routes

const jwt = require('jsonwebtoken'); // <--- ENSURE THIS LINE IS PRESENT

// Middleware function to protect routes
module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token'); // Common header name for JWT

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object
        // This makes user information (like ID and role) available in subsequent route handlers
        req.user = decoded.user;
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        // If token is not valid (e.g., expired, malformed)
        res.status(401).json({ message: 'Token is not valid' });
    }
};
