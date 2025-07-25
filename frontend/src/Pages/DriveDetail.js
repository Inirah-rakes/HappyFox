import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/DriveDetail.css'; // New CSS file

// Dummy drive data (shared or fetched; replace with API)
const driveData = {
  1: {
    company: 'TechCorp',
    optInBefore: '2025-08-10',
    ctc: '15 LPA',
    role: 'Software Engineer',
    description: 'Develop scalable web applications using React and Node.js. Requires strong problem-solving skills.',
    date: '2025-08-15',
    feedback: [ // Dummy seniors' feedback (fetched post-drive)
      { student: 'Senior A', comment: 'Round 1: Coding test on DSA. Round 2: HR interview focused on behavioral questions.' },
      { student: 'Senior B', comment: 'Prepare for system design; they asked about scalable architectures.' }
    ]
  },
  // Add more by ID
};

function DriveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const drive = driveData[id] || { company: 'Not Found' }; // Fallback

  const [feedback, setFeedback] = useState([]); // State for feedback

  // Simulate fetching feedback if drive is finished
  useEffect(() => {
    const currentDate = new Date();
    const driveDate = new Date(drive.date);
    if (driveDate < currentDate) {
      // Replace with actual API fetch: axios.get(`/api/feedback/${id}`)
      setFeedback(drive.feedback || []);
    }
  }, [id, drive.date]);

  return (
    <div className="drive-detail-container">
      <h2>{drive.company}</h2>
      <div className="detail-section">
        <p><strong>Opt-In Before:</strong> {drive.optInBefore}</p>
        <p><strong>CTC:</strong> {drive.ctc}</p>
        <p><strong>Job Role:</strong> {drive.role}</p>
        <p><strong>Description:</strong> {drive.description}</p>
        <p><strong>Drive Date:</strong> {drive.date}</p>
      </div>

      {/* Seniors' Feedback (shown post-drive) */}
      {feedback.length > 0 ? (
        <div className="feedback-section">
          <h3>Seniors' Feedback</h3>
          {feedback.map((fb, idx) => (
            <div key={idx} className="feedback-item">
              <p><strong>{fb.student}:</strong> {fb.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Feedback will be available after the drive completes.</p>
      )}

      {/* Company Specific Preparation Button */}
      <button 
        className="prep-btn"
        onClick={() => navigate(`/prep/${id}`)}
      >
        Company Specific Preparation
      </button>
    </div>
  );
}

export default DriveDetail;
