import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaBuilding,FaBriefcase, FaFileAlt, FaUser, FaArrowLeft } from 'react-icons/fa'; // Icons (back arrow added)
import '../Styles/Navbar.css'; // Dedicated CSS (create below)

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/'); // Redirect to login
  };

  const goBack = () => {
    navigate(-1); // Go to previous page in history
  };

  return (
    <div className="navbar-container">
      <button className="back-btn" onClick={goBack}>
        <FaArrowLeft className="nav-icon" /> Back
      </button>
      <div className="nav-links">
        <Link to="/home" className="nav-item">
          <FaHome className="nav-icon" /> Home
        </Link>
        <Link to="/learning" className="nav-item">
          <FaBook className="nav-icon" /> Learning
        </Link>
        <Link to="/roadmap" className="nav-item">
          <FaBook className="nav-icon" /> Roadmap
        </Link>
        <Link to="/placements" className="nav-item">
          <FaBriefcase className="nav-icon" /> Placements
        </Link>
         <Link to="/ide" className="nav-item">
          <FaBuilding className="nav-icon" /> IDE
        </Link>
        <Link to="/resume-builder" className="nav-item">
          <FaFileAlt className="nav-icon" /> Resume Builder
        </Link>
        <Link to="/my-profile" className="nav-item">
          <FaUser className="nav-icon" /> My Profile
        </Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      

      </div>
    </div>
  );
};

export default Navbar;
