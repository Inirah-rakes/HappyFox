import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import '../Styles/Learning.css'; // Import the dedicated CSS file

function Learning() {
  const [studentName] = useState('Harini S'); // Placeholder; replace with actual user data (e.g., from context or API)

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Dummy data for courses (replace with API fetch later)
  const allCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental data structures and algorithms for technical interviews.',
      status: 'completed', // Example statuses: 'completed', 'on-progress', 'not-enrolled'
    },
    {
      id: 2,
      title: 'Web Development Basics',
      description: 'Learn HTML, CSS, and JavaScript for building modern web apps.',
      status: 'on-progress',
    },
    {
      id: 3,
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML concepts, models, and Python libraries.',
      status: 'not-enrolled',
    },
    {
      id: 4,
      title: 'Soft Skills for Interviews',
      description: 'Develop communication and problem-solving skills for placements.',
      status: 'not-enrolled',
    },
    // Add more diverse topics as needed
  ];

  // Filter enrolled courses (those with 'completed' or 'on-progress')
  const enrolledCourses = allCourses.filter(course => course.status === 'completed' || course.status === 'on-progress');

  // Function to get status class and text
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return { class: 'status-completed', text: 'Completed' };
      case 'on-progress':
        return { class: 'status-on-progress', text: 'On Progress' };
      default:
        return { class: 'status-not-enrolled', text: 'Not Enrolled' };
    }
  };

  // Function to handle course click and navigate to detail page
  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="learning-container">
      {/* Greeting */}
      <div className="greeting">
        Hello, {studentName}
      </div>

      {/* Enrolled Courses Section */}
      <div className="section-title">Enrolled Courses</div>
      <div className="courses-grid">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map(course => {
            const statusInfo = getStatusInfo(course.status);
            return (
              <div 
                key={course.id} 
                className="course-card" 
                onClick={() => handleCourseClick(course.id)} // Add click handler
                style={{ cursor: 'pointer' }} // Optional: Make it look clickable
              >
                <div className="course-title">{course.title}</div>
                <div className="course-description">{course.description}</div>
                <div className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</div>
              </div>
            );
          })
        ) : (
          <p>No enrolled courses yet.</p>
        )}
      </div>

      {/* Available Courses Section */}
      <div className="section-title">Available Courses</div>
      <div className="courses-grid">
        {allCourses.map(course => {
          const statusInfo = getStatusInfo(course.status);
          return (
            <div 
              key={course.id} 
              className="course-card" 
              onClick={() => handleCourseClick(course.id)} // Add click handler
              style={{ cursor: 'pointer' }} // Optional: Make it look clickable
            >
              <div className="course-title">{course.title}</div>
              <div className="course-description">{course.description}</div>
              <div className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Learning;
