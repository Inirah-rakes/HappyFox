const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Student = require('../models/Student');

// GET jobs for Jobs.js and PlacementMgt.js
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRUD for PlacementMgt.js (example: POST to add job)
router.post('/jobs', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE job for PlacementMgt.js
router.delete('/jobs/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET students for StudentTracking.js
router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET summaries for AdminHome.js and OverviewReport.js
router.get('/summary', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const placedStudents = await Student.countDocuments({ status: 'placed' });
    const nonPlacedStudents = await Student.countDocuments({ status: 'non-placed' });
    const eligibleStudents = await Student.countDocuments({ eligible: true });
    const activeJobs = await Job.countDocuments();

    res.json({
      totalStudents,
      placedStudents,
      nonPlacedStudents,
      eligibleStudents,
      activeJobs,
      placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) + '%' : '0%',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
