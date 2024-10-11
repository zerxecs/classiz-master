// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming User model contains student info

// Route to fetch registered students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('fname lname email'); // Fetch students with selected fields
    res.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch students.' });
  }
});

module.exports = router;
