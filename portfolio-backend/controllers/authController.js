// --- controllers/authController.js ---
// Contains the logic for user authentication (signup, signin, signout)

// Import the User model
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route   POST /auth/signup
// @desc    Register a new user
// @access  Public
exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        // Create a new user instance
        user = new User({
            username,
            email,
            password,
            role: role || 'user' // Default role to 'user' if not provided
        });

        // Password hashing is handled by the pre-save hook in the User model

        // Save the user to the database
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ message: 'User registered successfully', token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during signup');
    }
};

// @route   POST /auth/signin
// @desc    Authenticate user & get token
// @access  Public
exports.signin = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        // Check if user exists by email or username
        let user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Compare provided password with hashed password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ message: 'Logged in successfully', token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error during signin');
    }
};

// @route   GET /auth/signout
// @desc    Sign out user (client-side token removal)
// @access  Private (though token invalidation is client-side)
exports.signout = (req, res) => {
    // For JWT, signout is primarily a client-side action:
    // The client simply discards the token.
    // On the server, we can optionally blacklist tokens if we maintain a blacklist,
    // but for stateless JWTs, simply not sending the token is enough.
    // Here, we just send a success message.
    res.json({ message: 'User signed out successfully (token should be removed from client)' });
};
