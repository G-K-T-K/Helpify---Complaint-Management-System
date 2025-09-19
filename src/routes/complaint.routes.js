const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware.js');
const Complaint = require('../models/complaint.model.js');
const multer = require('multer');

// Configure multer to store files in memory and set a file size limit
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// @route   POST /api/complaints
// @desc    Create a new complaint
router.post(
  '/',
  auth,
  upload.single('image'),
  [
    body('category', 'Category is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
  ],
  async (req, res) => {
    // ... your existing complaint submission logic remains here ...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'Image is required.' });
    }
    const { category, description } = req.body;
    try {
      const newComplaint = new Complaint({
        studentId: req.user.id,
        category,
        description,
        image: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });
      const complaint = await newComplaint.save();
      res.json(complaint);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// --- THIS IS THE NEW ROUTE FOR TRACKING COMPLAINTS ---
// @route   GET /api/complaints/my-complaints
// @desc    Get all complaints for the logged-in student
// @access  Private
router.get('/my-complaints', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user.id }).sort({ createdAt: -1 });

    // Format the complaints to be easily used by the frontend
    const formattedComplaints = complaints.map(complaint => ({
      id: complaint._id,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      createdAt: complaint.createdAt,
      // Convert the image buffer to a Base64 string for easy display
      image: {
        contentType: complaint.image.contentType,
        data: complaint.image.data.toString('base64'),
      },
    }));

    res.json(formattedComplaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;