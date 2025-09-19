const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware.js');
const Complaint = require('../models/complaint.model.js');
const Student = require('../models/student.model.js'); // Ensure Student model is imported if needed for population

// Middleware to ensure the user has a staff role
const isStaff = (req, res, next) => {
  if (req.user && req.user.role === 'staff') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Staff privileges required.' });
  }
};

// --- NEW: GET ACTIVE COMPLAINTS ---
// @route   GET /api/staff/complaints/active
// @desc    Get active (Submitted or In Progress) complaints for the logged-in staff
// @access  Private (Staff only)
router.get('/complaints/active', [auth, isStaff], async (req, res) => {
  try {
    // Fetches complaints that are NOT 'Resolved'
    const complaints = await Complaint.find({
      assignedStaffId: req.user.id,
      status: { $ne: 'Resolved' }
    })
      .populate('studentId', 'name rollNumber')
      .sort({ createdAt: -1 });
    
    // Format data for the frontend
    const formatted = complaints.map(c => ({
      id: c._id,
      student: c.studentId,
      category: c.category,
      description: c.description,
      status: c.status,
      createdAt: c.createdAt,
      image: {
        contentType: c.image.contentType,
        data: c.image.data.toString('base64'),
      }
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: GET RESOLVED COMPLAINTS ---
// @route   GET /api/staff/complaints/resolved
// @desc    Get resolved complaints for the logged-in staff
// @access  Private (Staff only)
router.get('/complaints/resolved', [auth, isStaff], async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedStaffId: req.user.id,
      status: 'Resolved'
    })
      .populate('studentId', 'name rollNumber')
      .sort({ updatedAt: -1 }); // Sort by most recently completed

    const formatted = complaints.map(c => ({
      id: c._id,
      student: c.studentId,
      category: c.category,
      description: c.description,
      status: c.status,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      remarks: c.remarks,
      image: {
        contentType: c.image.contentType,
        data: c.image.data.toString('base64'),
      }
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- UPDATED: UPDATE STATUS ROUTE ---
// @route   PUT /api/staff/complaints/:id/status
// @desc    Update the status and remarks of a complaint
// @access  Private (Staff only)
router.put(
  '/complaints/:id/status',
  [
    auth,
    isStaff,
    [
      body('status', 'Status is required').isIn(['In Progress', 'Resolved']),
      body('remarks', 'Remarks are required for resolved complaints').if(body('status').equals('Resolved')).not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ msg: 'Complaint not found' });
      }

      if (complaint.assignedStaffId.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const { status, remarks } = req.body;
      complaint.status = status;
      complaint.remarks = remarks || '';
      complaint.updatedAt = Date.now();

      await complaint.save();

      // Fetch the fully populated complaint to send back for a seamless UI update
      const updatedComplaint = await Complaint.findById(complaint._id)
        .populate('studentId', 'name rollNumber');
      
      // Format the single updated complaint for the frontend
      const formatted = {
        id: updatedComplaint._id,
        student: updatedComplaint.studentId,
        category: updatedComplaint.category,
        description: updatedComplaint.description,
        status: updatedComplaint.status,
        createdAt: updatedComplaint.createdAt,
        updatedAt: updatedComplaint.updatedAt,
        remarks: updatedComplaint.remarks,
        image: {
          contentType: updatedComplaint.image.contentType,
          data: updatedComplaint.image.data.toString('base64'),
        }
      };

      res.json(formatted);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;