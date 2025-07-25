import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/PlacementMgt.css';

function PlacementMgt() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', deadline: '', description: '', requirements: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddJob = () => {
    axios.post('http://localhost:3001/api/admin/jobs', newJob)
      .then(res => setJobs([...jobs, res.data]))
      .catch(err => console.error(err));
    setNewJob({ title: '', company: '', location: '', salary: '', deadline: '', description: '', requirements: '' });
  };

  const handleDeleteJob = (id) => {
    axios.delete(`http://localhost:3001/api/admin/jobs/${id}`)
      .then(() => setJobs(jobs.filter(job => job._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div className="placement-mgt-container">
      <h2>Placement Management</h2>
      <div className="add-job-form">
        <input placeholder="Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
        <input placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
        <input placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
        <input placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
        <input type="date" value={newJob.deadline} onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })} />
        <input placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
        <input placeholder="Requirements (comma-separated)" value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value.split(',') })} />
        <button onClick={handleAddJob}>Add Job</button>
      </div>
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-item">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <button onClick={() => handleDeleteJob(job._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacementMgt;
