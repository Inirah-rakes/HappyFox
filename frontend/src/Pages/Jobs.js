import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Jobs.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="jobs-container">
      <h2>All Job Details</h2>
      <div className="jobs-grid">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.jobId} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Job ID:</strong> {job.jobId}</p>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Requirements:</strong> {job.requirements.join(', ')}</p>
            </div>
          ))
        ) : (
          <p>No jobs available.</p>
        )}
      </div>
    </div>
  );
}

export default Jobs;
