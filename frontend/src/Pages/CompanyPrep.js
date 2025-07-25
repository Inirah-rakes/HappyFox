import React from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/CompanyPrep.css'; // New CSS file

// Dummy courses from Learning.js (shared or fetched)
const availableCourses = [
  { id: 1, title: 'Data Structures & Algorithms', topics: ['DSA', 'coding'] },
  { id: 2, title: 'Web Development Basics', topics: ['React', 'Node.js'] },
  { id: 3, title: 'Machine Learning Fundamentals', topics: ['ML'] },
  { id: 4, title: 'Soft Skills for Interviews', topics: ['behavioral', 'HR'] },
];

// Dummy JD and feedback analysis (replace with AI backend call)
const getCuratedCourses = (driveId) => {
  // Simulate analysis: Keywords from JD/feedback
  const keywords = ['DSA', 'problem-solving', 'behavioral', 'system design']; // Based on driveId from DB
  return availableCourses.filter(course => 
    course.topics.some(topic => keywords.includes(topic))
  );
};

function CompanyPrep() {
  const { id } = useParams();
  const curatedCourses = getCuratedCourses(id);

  return (
    <div className="company-prep-container">
      <h2>Company Specific Preparation for Drive {id}</h2>
      <p>Curated based on Job Description and Seniors' Feedback.</p>

      <div className="curated-courses">
        {curatedCourses.length > 0 ? (
          curatedCourses.map(course => (
            <div key={course.id} className="course-item">
              <h3>{course.title}</h3>
              {/* Appended Assessment Placeholder */}
              <div className="assessment">
                <h4>Assessment</h4>
                <p>MCQ or Coding Test: [Placeholder - Integrate like CourseDetail.js]</p>
                {/* Add MCQ or coding component here */}
              </div>
            </div>
          ))
        ) : (
          <p>No curated courses available yet.</p>
        )}
      </div>
    </div>
  );
}

export default CompanyPrep;
