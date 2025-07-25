import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/AdminHome.css';

function AdminHome() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/summary')
      .then(res => {
        const data = res.data;
        setAnalyticsData([
          { title: 'Total Students', value: data.totalStudents },
          { title: 'Active Job Drives', value: data.activeJobs },
          { title: 'Placement Rate', value: data.placementRate },
          { title: 'Unplaced Students', value: data.nonPlacedStudents },
        ]);
      })
      .catch(err => console.error(err));
  }, []);

  const quickLinks = [
    { title: 'Job Management', path: '/admin/job-management' },
    { title: 'Placement Management', path: '/admin/placement-management' },
    { title: 'Student Tracking', path: '/admin/student-tracking' },
    { title: 'Overview Reports', path: '/admin/overview-reports' },
  ];

  const recentActivity = [
    'New job posting: TechCorp - Software Engineer',
    'Student feedback submitted for InnoTech drive',
    '5 new applications for DataSolutions',
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-home-container">
      <div className="greeting">
        <span>Welcome, Admin</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <h3 className="section-title">Analytics Overview</h3>
      <div className="analytics-grid">
        {analyticsData.map((item, index) => (
          <div key={index} className="analytics-card">
            <div className="card-title">{item.title}</div>
            <div className="card-value">{item.value}</div>
          </div>
        ))}
      </div>

      <h3 className="section-title">Quick Links</h3>
      <div className="links-grid">
        {quickLinks.map((link, index) => (
          <div key={index} className="link-card" onClick={() => navigate(link.path)}>
            <div className="link-title">{link.title}</div>
          </div>
        ))}
      </div>

      <h3 className="section-title">Recent Activity</h3>
      <div className="activity-section">
        <ul className="activity-list">
          {recentActivity.map((activity, index) => (
            <li key={index} className="activity-item">{activity}</li>
          ))}
        </ul>
        <button className="view-all-btn">View All</button>
      </div>
    </div>
  );
}

export default AdminHome;

