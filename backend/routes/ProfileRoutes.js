const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create or update profile
router.post('/', async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // Find and update or create new
    const profile = await Profile.findOneAndUpdate(
      { studentId },
      req.body,
      { new: true, upsert: true }
    );
    
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile by studentId
router.get('/:studentId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ studentId: req.params.studentId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
