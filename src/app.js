// --- LOAD ENV VARIABLES FIRST ---
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());        // Allows cross-origin requests
app.use(express.json());    // Parses incoming JSON bodies

// --- ROUTES ---
const authRoutes = require('./routes/auth.routes.js');
const complaintRoutes = require('./routes/complaint.routes.js');
const adminComplaintRoutes = require('./routes/admin.complaint.routes.js');
const adminStaffRoutes = require('./routes/admin.staff.routes.js');
const staffRoutes = require('./routes/staff.routes.js'); // 1. IMPORT the new staff routes

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin/complaints', adminComplaintRoutes);
app.use('/api/admin/staff', adminStaffRoutes);
app.use('/api/staff', staffRoutes); // 2. USE the new staff routes

// --- MONGODB CONNECTION ---
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
}

// Call the DB connection
connectDB();

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});