// models/User.js - Mongoose schema for the User model

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // <--- ENSURE THIS LINE IS PRESENT

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: { // Example for user roles (e.g., 'user', 'admin')
        type: String,
        enum: ['user', 'admin'], // Define possible roles
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving the user to the database
userSchema.pre('save', async function(next) {
    // Only hash if the password field is new or has been modified
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare entered password with hashed password in the database
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
