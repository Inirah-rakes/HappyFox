// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['placed', 'non-placed'], required: true },
  eligible: { type: Boolean, required: true },
  company: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
