const Student = require('../models/student.model.js');
const Staff = require('../models/staff.model.js'); // Import the new Staff model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Your register function remains the same
exports.register = async (req, res) => {
  try {
    const { rollNumber, name, email, password } = req.body;
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'A student with this email already exists.' });
    }
    student = new Student({ rollNumber, name, email, passwordHash: password });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- THIS IS THE CORRECTED AND ERROR-FREE LOGIN FUNCTION ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    let userRole = '';
    let isPasswordCorrect = false;

    // 1. Check if the user is the Super Admin from the .env file
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        user = { _id: 'admin_id', name: 'Hostel Admin' }; // Use _id to be consistent
        userRole = 'admin';
        isPasswordCorrect = true;
      }
    } else {
      // 2. If not admin, check if the user is a Staff member
      let staffMember = await Staff.findOne({ email });
      if (staffMember) {
        user = staffMember;
        userRole = 'staff';
        isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
      } else {
        // 3. If not staff, check if the user is a Student
        let studentMember = await Student.findOne({ email });
        if (studentMember) {
          user = studentMember;
          userRole = 'student';
          isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        }
      }
    }

    // 4. If no user was found OR the password was incorrect, send an error
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 5. Create the JWT with the correct user info and role
    const payload = {
      user: {
        id: user._id, // Use ._id which is the standard MongoDB identifier
        name: user.name,
        role: userRole,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};