const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Class = require('../models/Class');
const User = require('../models/User');

const router = express.Router();

// Route to create a new class
router.post('/create-class', authMiddleware, async (req, res) => {
  const { name, description, type, additionalInfo } = req.body;

  try {
    const newClass = new Class({
      name,
      description,
      type,
      additionalInfo, // Assuming this contains student emails
      createdBy: req.user._id,
    });

    await newClass.save();
    res.status(201).json({ success: true, message: 'Class created successfully!', class: newClass });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(400).json({ error: 'Error creating class: ' + error.message });
  }
});

// Route to get all classes for the logged-in user
router.get('/classes', authMiddleware, async (req, res) => {
  try {
    const classes = await Class.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, classes });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get class details by ID
router.get('/class/:id', authMiddleware, async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ success: false, error: 'Class not found' });
    }

    // Find students based on emails stored in additionalInfo
    const students = await User.find({ email: { $in: classData.additionalInfo } });
    
    res.json({ success: true, class: { ...classData._doc, students } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});




// POST route to add a student to a class
router.post('/class/:classId/add-student', async (req, res) => {
  const { classId } = req.params;
  const { fname, lname, email } = req.body;

  // Validate request data
  if (!fname || !lname || !email) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // Find the class by ID
    const classItem = await Class.findById(classId);

    if (!classItem) {
      return res.status(404).json({ success: false, error: 'Class not found.' });
    }

    // Create a new student object
    const newStudent = { fname, lname, email };

    // Add the new student to the class's student list
    classItem.students.push(newStudent);

    // Save the updated class
    await classItem.save();

    return res.status(200).json({ success: true, class: classItem });
  } catch (err) {
    console.error('Error adding student:', err);
    return res.status(500).json({ success: false, error: 'An error occurred while adding the student.' });
  }
});




module.exports = router;


