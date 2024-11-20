const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get posts in a forum with sorting
router.get('/:forumId', async (req, res) => {
    const { sort } = req.query; // Sort can be 'mostLiked' or 'latest'
    try {
        const posts = await Post.find({ forumId: req.params.forumId })
            .sort(sort === 'mostLiked' ? { likes: -1 } : { createdAt: -1 })
            .populate('createdBy', 'username displayName profilePicture'); // Include user info

        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new post
router.post('/:forumId', async (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ message: 'Title, content, and user ID are required' });
    }

    try {
        const post = new Post({
            title,
            content,
            forumId: req.params.forumId,
            createdBy: userId, // Include userId from request body
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Like a post (toggle functionality)
router.post('/:postId/like', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const post = await Post.findById(req.params.postId).populate('createdBy', 'displayName profilePicture');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.likedBy.includes(userId)) {
            post.likedBy.pull(userId);
            post.likes -= 1;
        } else {
            post.likedBy.push(userId);
            post.likes += 1;

            // If previously disliked, remove the dislike
            if (post.dislikedBy.includes(userId)) {
                post.dislikedBy.pull(userId);
                post.dislikes -= 1;
            }
        }

        await post.save();

        // Re-populate the `createdBy` field
        await post.populate('createdBy', 'displayName profilePicture');

        res.json(post);
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Dislike a post (toggle functionality)
router.post('/:postId/dislike', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const post = await Post.findById(req.params.postId).populate('createdBy', 'displayName profilePicture');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.dislikedBy.includes(userId)) {
            post.dislikedBy.pull(userId);
            post.dislikes -= 1;
        } else {
            post.dislikedBy.push(userId);
            post.dislikes += 1;

            // If previously liked, remove the like
            if (post.likedBy.includes(userId)) {
                post.likedBy.pull(userId);
                post.likes -= 1;
            }
        }

        await post.save();

        // Re-populate the `createdBy` field
        await post.populate('createdBy', 'displayName profilePicture');

        res.json(post);
    } catch (err) {
        console.error('Error disliking post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;