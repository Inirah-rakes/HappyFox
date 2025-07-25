const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  salary: { type: String },
  deadline: { type: Date },
  description: { type: String },
  requirements: [String],
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
