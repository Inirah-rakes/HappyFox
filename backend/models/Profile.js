const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  personalInfo: {
    fullName: { type: String, required: true },
    professionalTitle: { type: String }
  },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String }
  },
  summary: { type: String },
  education: [{
    institution: { type: String },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    gpa: { type: String }
  }],
  skills: {
    programmingLanguages: [{ type: String }],
    frameworks: [{ type: String }],
    databases: [{ type: String }],
    tools: [{ type: String }]
  },
  projects: [{
    title: { type: String },
    description: { type: String },
    technologies: [{ type: String }],
    link: { type: String }
  }],
  experience: [{
    title: { type: String },
    company: { type: String },
    location: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    responsibilities: [{ type: String }]
  }],
  achievements: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema, 'my-profile');
