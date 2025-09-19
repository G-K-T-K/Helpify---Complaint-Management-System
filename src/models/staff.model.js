const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const staffSchema = new mongoose.Schema({
  // As per your SCHEMA_SPEC.md
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true }, // e.g., 'Electrician', 'Plumber'
  passwordHash: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
staffSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;