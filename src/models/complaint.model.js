const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  category: {
    type: String,
    enum: ['Electrical', 'Plumbing', 'Cleanliness', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  // --- CORRECTED IMAGE SCHEMA ---
  image: {
    data: {
      type: Buffer,
      required: [true, 'Image data buffer is required.']
    },
    contentType: {
      type: String,
      required: [true, 'Image content type is required.']
    }
  },
  // --- END OF CORRECTION ---
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved'],
    default: 'Submitted',
  },
  assignedStaffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    default: null,
  },
  remarks: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;