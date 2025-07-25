import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Placements.css'; // Import the dedicated CSS file

function Placements() {

const navigate = useNavigate();
  // Dummy data for drives (replace with API fetch later)
  const allDrives = [
    {
      id: 1,
      company: 'TechCorp',
      date: '2025-08-15',
      status: 'upcoming',
      eligibility: 'eligible',
      description: 'Software Engineer role, GPA > 7.0',
    },
    {
      id: 2,
      company: 'DataSolutions',
      date: '2025-07-28',
      status: 'ongoing',
      eligibility: 'not-eligible',
      description: 'Data Analyst, requires ML experience',
    },
    {
      id: 3,
      company: 'InnoTech',
      date: '2025-06-10',
      status: 'completed',
      eligibility: 'eligible',
      description: 'Full Stack Developer, open to all departments',
    },
    {
      id: 4,
      company: 'GlobalFinance',
      date: '2025-09-05',
      status: 'upcoming',
      eligibility: 'eligible',
      description: 'Finance Analyst, GPA > 8.0',
    },
    // Add more drives as needed
  ];

  // Dummy data for placed drives
  const placedDrives = [
    {
      id: 3,
      company: 'InnoTech',
      date: '2025-06-10',
      role: 'Full Stack Developer',
      package: '12 LPA',
    },
    // Add more if needed
  ];

  // Dummy summary stats
  const summaryStats = {
    eligible: 10,
    optedIn: 4,
    optedOut: 2,
    placed: 1,
    notApplied: 4,
    notEligible: 2,
  };

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all'); // all, upcoming, ongoing, completed
  const [eligibilityFilter, setEligibilityFilter] = useState('all'); // all, eligible, not-eligible

  // Filtered drives
  const filteredDrives = allDrives.filter(drive => {
    const statusMatch = statusFilter === 'all' || drive.status === statusFilter;
    const eligibilityMatch = eligibilityFilter === 'all' || drive.eligibility === eligibilityFilter;
    return statusMatch && eligibilityMatch;
  });
  const handleDriveClick = (id, eligibility) => {
    if (eligibility === 'eligible') {
      navigate(`/drive/${id}`);
    }
  };

  return (
    <div className="placements-container">
      {/* Drive Summary */}
      <div className="section-title">Drive Summary</div>
      <div className="summary-card">
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-number">{summaryStats.eligible}</div>
            <div className="stat-label">Eligible</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{summaryStats.optedIn}</div>
            <div className="stat-label">Opted-In</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{summaryStats.optedOut}</div>
            <div className="stat-label">Opted-Out</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{summaryStats.placed}</div>
            <div className="stat-label">Placed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{summaryStats.notApplied}</div>
            <div className="stat-label">Not Applied</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{summaryStats.notEligible}</div>
            <div className="stat-label">Not Eligible</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="section-title">Filters</div>
      <div className="filters">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All Status
        </button>
        <button
          className={`filter-btn ${statusFilter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setStatusFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`filter-btn ${statusFilter === 'ongoing' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ongoing')}
        >
          Ongoing
        </button>
        <button
          className={`filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setStatusFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-btn ${eligibilityFilter === 'all' ? 'active' : ''}`}
          onClick={() => setEligibilityFilter('all')}
        >
          All Eligibility
        </button>
        <button
          className={`filter-btn ${eligibilityFilter === 'eligible' ? 'active' : ''}`}
          onClick={() => setEligibilityFilter('eligible')}
        >
          Eligible
        </button>
        <button
          className={`filter-btn ${eligibilityFilter === 'not-eligible' ? 'active' : ''}`}
          onClick={() => setEligibilityFilter('not-eligible')}
        >
          Not Eligible
        </button>
      </div>

      {/* Drives Section */}
     <div className="section-title">Drives</div>
      <div className="drives-grid">
        {filteredDrives.length > 0 ? (
          filteredDrives.map(drive => (
            <div 
              key={drive.id} 
              className="drive-card"
              onClick={() => handleDriveClick(drive.id, drive.eligibility)} // New: Click handler
              style={{ cursor: drive.eligibility === 'eligible' ? 'pointer' : 'not-allowed' }} // Visual cue
            >
              <div className="drive-title">{drive.company}</div>
              <div className="drive-description">{drive.description}</div>
              <div className={`drive-status status-${drive.status}`}>{drive.status}</div>
              <div className={`eligibility-${drive.eligibility}`}>
                Eligibility: {drive.eligibility === 'eligible' ? 'Eligible' : 'Not Eligible'}
              </div>
              <div>Date: {drive.date}</div>
            </div>
          ))
        ) : (
          <p>No drives match the filters.</p>
        )}
     </div>
      {/* Placed Drives Section */}
      <div className="section-title">Placed Drives</div>
      <div className="drives-grid">
        {placedDrives.length > 0 ? (
          placedDrives.map(drive => (
            <div key={drive.id} className="drive-card">
              <div className="drive-title">{drive.company}</div>
              <div className="drive-description">Role: {drive.role} | Package: {drive.package}</div>
              <div>Date: {drive.date}</div>
            </div>
          ))
        ) : (
          <p>No placed drives yet.</p>
        )}
      </div>
    </div>
  );
}

export default Placements;
