import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/CourseDetails.css'; // Assuming you have this CSS file
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Hardcode course data and YouTube video for now (expand as needed)


function CourseDetail() {

  const initialCourseData = {
  1: {
    name: 'Data Structures & Algorithms',
    youtube: 'https://www.youtube.com/embed/ryeycH0njP8', // Sample DSA video (searched for a relevant, high-quality tutorial on YouTube)
    mcq: []
  },
  2: {
    name: 'Web Development Basics',
    youtube: 'https://www.youtube.com/embed/6mbwJ2xhgzM', // Sample web dev video
    mcq: [] // Add MCQs here
  },
  3: {
    name: 'Machine Learning Fundamentals',
    youtube: 'https://www.youtube.com/embed/GwIo3gDZCVQ', // Sample ML video
    mcq: [] // Add MCQs here
  },
  4: {
    name: 'Soft Skills for Interviews',
    youtube: 'https://www.youtube.com/embed/7v6wU6od5mE', // Sample soft skills video
    mcq: [] // Add MCQs here
  }
  // Add more courses with IDs matching your Learning.js data
  };
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(initialCourseData);
  const { id } = useParams();

  const course = courseData[id] || { name: 'Course Not Found', youtube: '', mcq: [] }; // Fallback for invalid ID
  const [summary, setSummary] = useState('click here to fetch summary');
  
  // MCQ State
  const [step, setStep] = useState(0); // 0: video, 1: MCQ, 2: coding, 3: result
  const [userAnswers, setUserAnswers] = useState(Array(course.mcq.length).fill(null));
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  const fetchRecommendedVideos = async () => {
    console.log("weakTopics:", weakTopics);
  try {
    const response = await fetch('http://localhost:5000/recommend-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topics: weakTopics })  // weakTopics is already in your state
    });
    const data = await response.json();
    setRecommendedVideos(data.videos || []);
    console.log("Recommended Videos:", data.videos);
  } catch (error) {
    console.error("Error fetching video recommendations:", error);
  }
};


  // Fetch YouTube transcript and summary
  const fetchSummary = async () => {
    setSummary('Fetching summary...'); // Reset summary text
    try{
      const response = await fetch('http://localhost:3001/api/youtube-summary',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ link: course.youtube})
      });
      console.log('Response from backend:', response);
      const data = await response.json();
      setSummary(data.summary || 'No summary available');
    } catch (err){
      console.error('Error fetching summary:', err);
      setSummary('Error fetching summary. Please try again later.');
    }
  }

  // MCQ logic
  const handleMCQOption = (qIdx, oIdx) => {
    const nextAnswers = [...userAnswers];
    nextAnswers[qIdx] = oIdx;
    setUserAnswers(nextAnswers);
  };

  const handleMCQSubmit = () => {
    setEndTime(Date.now());
    setStep(3); // show performance/result
  };

  
  const generateMcqsForCourse = async (courseId, summary) => {
    try {
      const response = await axios.post('http://localhost:3001/api/summary-mcq', {
        summary
      });

      const mcqs = response.data.mcqs || [];
      console.log("Generated MCQs:", mcqs);

      setCourseData(prev => ({
        ...prev,
        [courseId]: {
          ...prev[courseId],
          mcq: mcqs
        }
        
    }));
    } catch (error) {
      console.error("Error generating MCQs:", error.message);
      alert("Failed to generate MCQs for this course.");
    }
  };
  console.log("Course Data:", courseData);

  const correctCount = userAnswers.filter((ans, idx) => ans === course.mcq[idx]?.correct_answer).length;

  // Performance metrics
  const totalTime = endTime && startTime ? Math.round((endTime - startTime) / 1000) : 0;
  const avgTime = course.mcq.length ? Math.round(totalTime / course.mcq.length) : 0;
  const weakTopics = course.mcq
    .map((q, idx) => (userAnswers[idx] !== q.correct_answer ? q.topic : null))
    .filter(Boolean);

  return (
    <div className="course-detail-container">
      <h2>{course.name}</h2>
      <div className="section">
        <h3>Video Material</h3>
        <div className="video-container">
          {/* Embed YouTube */}
          <iframe
            width="560"
            height="315"
            src={course.youtube}
            title="Course Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ borderRadius: '10px', width: '100%', maxWidth: '600px' }}
          />
        </div>
        <h4>Video Summary</h4>
        <button className="next-btn" onClick={() => {fetchSummary()}}>summarize video</button>
        <p>{summary}</p>

        <button className="next-btn" onClick={() => generateMcqsForCourse(id, {summary})}>
          Generate MCQs
        </button>

        <button className="next-btn" onClick={() => { setStep(1); setStartTime(Date.now()); }}>
          Proceed to MCQ Test
        </button>

        <button className="next-btn" onClick={() => navigate('/ide')}>Practice with IDE</button>
      </div>

      {step === 1 && (
        <div className="section">
          <h3>MCQ Assessment</h3>
          {course.mcq.map((q, idx) => (
            <div key={idx} className="mcq-question">
              <div>{idx + 1}. {q.question}</div>
              <div className="mcq-options">
                {Object.entries(q.options).map(([key, value], oIdx) => (
                  <label key={oIdx} className="mcq-option">
                    <input
                      type="radio"
                      name={`mcq-${idx}`}
                      value={key}
                      checked={userAnswers[idx] === key}
                      onChange={() => handleMCQOption(idx, key)}
                    />
                    {key}. {value}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="next-btn" onClick={handleMCQSubmit}>Submit MCQ</button>
          <button className="next-btn" style={{ marginLeft: '10px' }} onClick={() => setStep(2)}>
            Skip to Coding Test
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="section">
          <h3>Code Assessment <span style={{ color: '#888' }}>(Coming Soon)</span></h3>
          <div className="blank-compiler">
            <p>LeetCode-style coding test will be available here (Integrated Online Compiler placeholder)</p>
          </div>
          <button className="next-btn" onClick={() => setStep(3)}>View Performance</button>
        </div>
      )}

      {step === 3 && (
        <div className="section performance-section">
          <h3>Performance Overview</h3>
          <p><strong>Correct Answers:</strong> {correctCount} / {course.mcq.length}</p>
          <p><strong>Your Time:</strong> {totalTime}s</p>
          <p><strong>Avg Time per Question:</strong> {avgTime}s</p>
          <p><strong>Topics Needed for Improvement:</strong> {weakTopics.length > 0 ? weakTopics.join(', ') : 'None!'}</p>
          <div>
            <strong>Suggested Next Steps:</strong>
            <ul>
              <li>Review video and MCQ explanations.</li>
              <li>Try more practice problems on this topic.</li>
              <li>Attempt similar LeetCode problems when available.</li>
            </ul>
          </div>
        </div>
      )}
      <button className="next-btn" onClick={fetchRecommendedVideos}>Show Suggested Courses</button>

      {recommendedVideos.length > 0 && (
      <div className="suggested-courses">
      <h4>Suggested Courses to Improve Weak Topics:</h4>
      <div className="video-grid">
        {recommendedVideos.map((video, index) => (
          <div key={index} className="video-card">
            <img src={video.thumbnail} alt={video.title} width="100%" />
            <p><a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a></p>
          </div>
        ))}
      </div>
    </div>
  )}
    </div>
  );
}

export default CourseDetail; // Explicit default export here
