const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    forumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forum', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],    // Users who liked the post
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who disliked the post
});

module.exports = mongoose.model('Post', postSchema);
