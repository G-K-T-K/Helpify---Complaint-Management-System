const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');
const Complaint = require('../models/complaint.model.js');

// --- NEW: STATISTICS ROUTE ---
// @route   GET /api/admin/complaints/stats
// @desc    Get complaint statistics for the admin dashboard chart
// @access  Private (Admin only)
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const pendingComplaints = await Complaint.countDocuments({ status: { $ne: 'Resolved' } });

    res.json({
      total: totalComplaints,
      resolved: resolvedComplaints,
      pending: pendingComplaints,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/admin/complaints (Existing Route)
// @desc    Get all complaints for the admin dashboard
router.get('/', [auth, admin], async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('studentId', 'name rollNumber')
      .populate('assignedStaffId', 'name role') // Also populate assigned staff info
      .sort({ createdAt: -1 });

    const formattedComplaints = complaints.map(complaint => ({
      id: complaint._id,
      student: complaint.studentId,
      category: complaint.category,
      description: complaint.description,
      status: complaint.status,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      image: {
        contentType: complaint.image.contentType,
        data: complaint.image.data.toString('base64'),
      },
      assignedStaff: complaint.assignedStaffId,
      remarks: complaint.remarks,
    }));
    res.json(formattedComplaints);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/complaints/:id/assign (Existing Route)
// @desc    Assign a complaint to a staff member and update its status
// @access  Private (Admin only)
router.put('/:id/assign', [auth, admin], async (req, res) => {
  const { staffId } = req.body;

  if (!staffId) {
    return res.status(400).json({ msg: 'Staff ID is required.' });
  }

  try {
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: 'Complaint not found.' });
    }

    complaint.assignedStaffId = staffId;
    complaint.status = 'In Progress'; // Automatically update status
    complaint.updatedAt = Date.now();

    await complaint.save();

    // Populate with details before sending back for a seamless UI update
    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'name rollNumber')
      .populate('assignedStaffId', 'name role');

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;