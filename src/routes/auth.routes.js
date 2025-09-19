const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// @route   POST /api/auth/register
// @desc    Register a new student
router.post('/register', authController.register);

// We will add the /login route here later.
router.post('/login', authController.login);

module.exports = router;