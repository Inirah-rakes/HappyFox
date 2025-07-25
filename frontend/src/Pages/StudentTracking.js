import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/StudentTracking.css'; // Assuming your CSS file path

function StudentTracking() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token'); // If auth is required, get token
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const res = await axios.get('http://localhost:3001/api/admin/students', config);
        console.log('Fetched students:', res.data); // Log to verify data
        setStudents(res.data.sort((a, b) => a.status.localeCompare(b.status))); // Sort by status (optional)
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students. Check if the backend is running and data is in MongoDB.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="student-tracking-container">
      <h2>Student Tracking</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Eligible</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td className={student.status === 'placed' ? 'status-placed' : 'status-non-placed'}>{student.status}</td>
                <td>{student.eligible ? 'Yes' : 'No'}</td>
                <td>{student.company || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No students found. Verify records in MongoDB Atlas.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTracking;
