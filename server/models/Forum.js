const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users subscribed to this forum
    image: { type: String, default: '/uploads/default-forum-image.png' }, // Default image
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Forum', forumSchema);
