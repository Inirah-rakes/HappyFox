const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to User model
  name: { type: String, required: true },
  academicDetails: {
    gpa: { type: Number },
    department: { type: String },
    year: { type: Number },
  },
  skills: [String],
  // Add more fields as needed (e.g., resume, performance)
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
