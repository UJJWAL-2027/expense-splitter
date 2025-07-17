const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');

// Get all friends
router.get('/', async (req, res) => {
  try {
    const friends = await Friend.find().sort({ createdAt: -1 });
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get friend by ID
router.get('/:id', async (req, res) => {
  try {
    const friend = await Friend.findById(req.params.id);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    res.json(friend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new friend
router.post('/', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Check if friend with email already exists
    const existingFriend = await Friend.findOne({ email });
    if (existingFriend) {
      return res.status(400).json({ message: 'Friend with this email already exists' });
    }

    const friend = new Friend({
      name,
      email,
      avatar
    });

    const savedFriend = await friend.save();
    res.status(201).json(savedFriend);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update friend
router.put('/:id', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    const friend = await Friend.findByIdAndUpdate(
      req.params.id,
      { name, email, avatar },
      { new: true, runValidators: true }
    );

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    res.json(friend);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete friend
router.delete('/:id', async (req, res) => {
  try {
    const friend = await Friend.findByIdAndDelete(req.params.id);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    res.json({ message: 'Friend deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;