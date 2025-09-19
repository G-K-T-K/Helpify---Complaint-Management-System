const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware.js');
const admin = require('../middleware/admin.middleware.js');
const Staff = require('../models/staff.model.js');

// @route   POST /api/admin/staff
// @desc    Create a new staff member
// @access  Private (Admin only)
router.post(
  '/',
  [auth, admin],
  [
    body('staffId', 'Staff ID is required').not().isEmpty(),
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('role', 'Role is required').not().isEmpty(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { staffId, name, email, role, password } = req.body;

    try {
      let staff = await Staff.findOne({ email });
      if (staff) {
        return res.status(400).json({ msg: 'Staff with this email already exists' });
      }

      staff = new Staff({ staffId, name, email, role, passwordHash: password });
      await staff.save();
      res.status(201).json(staff);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/admin/staff
// @desc    Get all staff members
// @access  Private (Admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const staff = await Staff.find().select('-passwordHash'); // Exclude password from response
    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: UPDATE STAFF ROUTE ---
// @route   PUT /api/admin/staff/:id
// @desc    Update a staff member's details
// @access  Private (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  const { staffId, name, email, role } = req.body;
  const staffFields = { staffId, name, email, role };

  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ msg: 'Staff not found' });

    staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true }
    ).select('-passwordHash');

    res.json(staff);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: DELETE STAFF ROUTE ---
// @route   DELETE /api/admin/staff/:id
// @desc    Delete a staff member
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    let staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ msg: 'Staff not found' });

    await Staff.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Staff member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;