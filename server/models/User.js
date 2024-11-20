const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Unique username
    displayName: { type: String, required: true }, // Name displayed on posts
    actualName: { type: String, required: true }, // User's full name
    bio: { type: String, default: '' }, // Optional bio
    profilePicture: { type: String, default: '/uploads/default-profile.png' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Following
    createdAt: { type: Date, default: Date.now },
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
