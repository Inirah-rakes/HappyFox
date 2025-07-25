import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBriefcase, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa'; // Icons
import '../Styles/AdminNavbar.css'; // Dedicated CSS

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/'); // Redirect to login
  };

  return (
    <div className="admin-navbar">
      <div className="nav-links">
        <Link to="/adminhome" className="nav-item">
          <FaHome className="nav-icon" /> Home
        </Link>
        <Link to="/admin/jobs" className="nav-item">
          <FaBriefcase className="nav-icon" /> Job Management
        </Link>
        <Link to="/admin/placement-management" className="nav-item">
          <FaUsers className="nav-icon" /> Placement Management
        </Link>
        <Link to="/admin/student-tracking" className="nav-item">
          <FaUsers className="nav-icon" /> Student Tracking
        </Link>
        <Link to="/admin/overview-reports" className="nav-item">
          <FaChartBar className="nav-icon" /> Overview Reports
        </Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="nav-icon" /> Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
