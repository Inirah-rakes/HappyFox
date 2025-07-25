import React, { useState } from 'react';
import '../Styles/RoadmapCreator.css';

function RoadmapCreator() {
  const [formData, setFormData] = useState({
    name: '',
    yearOfStudy: '',
    dreamRole: '',
    passions: '',
    technicalSkills: '',
    behavioralTraits: '',
    preferredIndustries: '',
    learningStyle: '',
  });

  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRoadmap(data.roadmap);
    } catch (error) {
      alert('Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="roadmap-container">
      <h2>Career Roadmap Creator</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your Name" onChange={handleChange} required />
        <select name="yearOfStudy" onChange={handleChange} required>
          <option value="">Year of Study</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="final">Final Year</option>
        </select>
        <input name="dreamRole" placeholder="Dream Role (e.g. SDE, AI Researcher)" onChange={handleChange} required />
        <input name="passions" placeholder="What are you passionate about?" onChange={handleChange} />
        <input name="technicalSkills" placeholder="Current technical skills (e.g. Python, React)" onChange={handleChange} />
        <input name="behavioralTraits" placeholder="Behavioral traits (e.g. leadership, curiosity)" onChange={handleChange} />
        <input name="preferredIndustries" placeholder="Preferred industries (e.g. Fintech, HealthTech)" onChange={handleChange} />
        <input name="learningStyle" placeholder="Learning style (e.g. visual, hands-on)" onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Roadmap'}
        </button>
      </form>

      {roadmap && (
        <div className="roadmap-result">
          <h3>Your Personalized Career Roadmap</h3>
          <pre>{roadmap}</pre>
        </div>
      )}
    </div>
  );
}

export default RoadmapCreator;
