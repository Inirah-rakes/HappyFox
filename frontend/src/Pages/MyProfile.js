import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const navigate = useNavigate();
  const [storedData, setStoredData] = useState(null);
  const [formData, setFormData] = useState({
    studentId: 'STU001',
    personalInfo: { fullName: '', professionalTitle: '' },
    contactInfo: { email: '', phone: '', linkedin: '', github: '', portfolio: '' },
    summary: '',
    education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' }],
    skills: { programmingLanguages: [], frameworks: [], databases: [], tools: [] },
    projects: [{ title: '', description: '', technologies: [], link: '' }],
    experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] }],
    achievements: [''],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/profile/STU001');
        console.log(res);
        if (res.data) {
          setStoredData(res.data);
          setFormData({
            ...formData,
            ...res.data,
            education: res.data.education && res.data.education.length > 0 ? res.data.education : formData.education,
            skills: res.data.skills || formData.skills,
            projects: res.data.projects && res.data.projects.length > 0 ? res.data.projects : formData.projects,
            experience: res.data.experience && res.data.experience.length > 0 ? res.data.experience : formData.experience,
            achievements: res.data.achievements || formData.achievements,
          });
        } else {
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e, section, index, field) => {
    if (!e || !e.target) {
      console.error('Invalid event object:', e, 'Section:', section, 'Index:', index, 'Field:', field);
      return;
    }
    const value = e.target.value;
    const updatedFormData = { ...formData };

    if (section === 'personalInfo' || section === 'contactInfo') {
      updatedFormData[section][field] = value;
    } else if (section === 'summary') {
      updatedFormData[section] = value;
    } else if (['education', 'projects', 'experience'].includes(section)) {
      if (!updatedFormData[section][index]) {
        updatedFormData[section][index] = {};
      }
      updatedFormData[section][index][field] = value;
    } else if (section === 'skills') {
      updatedFormData[section][field] = value.split(',').map(item => item.trim());
    } else if (section === 'achievements') {
      if (!updatedFormData[section][index]) updatedFormData[section][index] = '';
      updatedFormData[section][index] = value;
    } else if (section === 'responsibilities') {
      if (!updatedFormData.experience[index]) {
        updatedFormData.experience[index] = { responsibilities: [] };
      }
      updatedFormData.experience[index].responsibilities = value.split('\n');
    }
    setFormData(updatedFormData);
  };

  const addField = (section) => {
    const updatedFormData = { ...formData };
    if (section === 'education') {
      updatedFormData.education.push({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' });
    } else if (section === 'projects') {
      updatedFormData.projects.push({ title: '', description: '', technologies: [], link: '' });
    } else if (section === 'experience') {
      updatedFormData.experience.push({ title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] });
    } else if (section === 'achievements') {
      updatedFormData.achievements.push('');
    }
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/profile', formData);
      setStoredData(res.data);
      setIsEditing(false);
      navigate('/my-profile');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Error saving profile. Please try again.');
    }
  };

  const startEditing = () => {
    setFormData(storedData || formData);
    setIsEditing(true);
  };

  const displayValue = (value) => (value && value.length > 0 ? value : 'Not specified');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app-container">
      <h2>My Profile</h2>
      {!isEditing ? (
        <div>
          <p><strong>Full Name:</strong> {displayValue(storedData?.personalInfo?.fullName)}</p>
          <p><strong>Professional Title:</strong> {displayValue(storedData?.personalInfo?.professionalTitle)}</p>
          <p><strong>Email:</strong> {displayValue(storedData?.contactInfo?.email)}</p>
          <p><strong>Phone:</strong> {displayValue(storedData?.contactInfo?.phone)}</p>
          <p><strong>Summary:</strong> {displayValue(storedData?.summary)}</p>
          <h3>Education</h3>
          {storedData?.education?.map((edu, index) => (
            <div key={index}>
              <p><strong>Institution:</strong> {displayValue(edu.institution)}</p>
              <p><strong>Degree:</strong> {displayValue(edu.degree)}</p>
            </div>
          ))}
          <h3>Skills</h3>
          <p><strong>Programming Languages:</strong> {displayValue(storedData?.skills?.programmingLanguages.join(', '))}</p>
          <h3>Projects</h3>
          {storedData?.projects?.map((proj, index) => (
            <div key={index}>
              <p><strong>Title:</strong> {displayValue(proj.title)}</p>
              <p><strong>Description:</strong> {displayValue(proj.description)}</p>
            </div>
          ))}
          <h3>Experience</h3>
          {storedData?.experience?.map((exp, index) => (
            <div key={index}>
              <p><strong>Title:</strong> {displayValue(exp.title)}</p>
              <p><strong>Company:</strong> {displayValue(exp.company)}</p>
            </div>
          ))}
          <h3>Achievements</h3>
          {storedData?.achievements?.map((ach, index) => (
            <p key={index}>{displayValue(ach)}</p>
          ))}
          <button onClick={startEditing}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name:</label>
            <input
              value={formData.personalInfo.fullName || ''}
              onChange={(e) => handleChange(e, 'personalInfo', 0, 'fullName')}
            />
          </div>
          <div>
            <label>Professional Title:</label>
            <input
              value={formData.personalInfo.professionalTitle || ''}
              onChange={(e) => handleChange(e, 'personalInfo', 0, 'professionalTitle')}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              value={formData.contactInfo.email || ''}
              onChange={(e) => handleChange(e, 'contactInfo', 0, 'email')}
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              value={formData.contactInfo.phone || ''}
              onChange={(e) => handleChange(e, 'contactInfo', 0, 'phone')}
            />
          </div>
          <div>
            <label>Summary:</label>
            <textarea
              value={formData.summary || ''}
              onChange={(e) => handleChange(e, 'summary', 0, 'summary')}
            />
          </div>
          <div className="section-columns">
            <h3>Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index} className="column">
                <label>Institution:</label>
                <input
                  value={edu.institution || ''}
                  onChange={(e) => handleChange(e, 'education', index, 'institution')}
                />
                <label>Degree:</label>
                <input
                  value={edu.degree || ''}
                  onChange={(e) => handleChange(e, 'education', index, 'degree')}
                />
                {index === formData.education.length - 1 && (
                  <button type="button" onClick={() => addField('education')}>Add Education</button>
                )}
              </div>
            ))}
          </div>
          <div className="section-columns">
            <h3>Projects</h3>
            {formData.projects.map((proj, index) => (
              <div key={index} className="column">
                <label>Title:</label>
                <input
                  value={proj.title || ''}
                  onChange={(e) => handleChange(e, 'projects', index, 'title')}
                />
                <label>Description:</label>
                <input
                  value={proj.description || ''}
                  onChange={(e) => handleChange(e, 'projects', index, 'description')}
                />
                {index === formData.projects.length - 1 && (
                  <button type="button" onClick={() => addField('projects')}>Add Project</button>
                )}
              </div>
            ))}
          </div>
          <div className="section-columns">
            <h3>Experience</h3>
            {formData.experience.map((exp, index) => (
              <div key={index} className="column">
                <label>Title:</label>
                <input
                  value={exp.title || ''}
                  onChange={(e) => handleChange(e, 'experience', index, 'title')}
                />
                <label>Company:</label>
                <input
                  value={exp.company || ''}
                  onChange={(e) => handleChange(e, 'experience', index, 'company')}
                />
                <label>Responsibilities:</label>
                <textarea
                  value={exp.responsibilities.join('\n') || ''}
                  onChange={(e) => handleChange(e, 'responsibilities', index, 'responsibilities')}
                />
                {index === formData.experience.length - 1 && (
                  <button type="button" onClick={() => addField('experience')}>Add Experience</button>
                )}
              </div>
            ))}
          </div>
          <div className="section-columns">
            <h3>Achievements</h3>
            {formData.achievements.map((ach, index) => (
              <div key={index} className="column">
                <label>Achievement:</label>
                <input
                  value={ach || ''}
                  onChange={(e) => handleChange(e, 'achievements', index, 'achievements')}
                />
                {index === formData.achievements.length - 1 && (
                  <button type="button" onClick={() => addField('achievements')}>Add Achievement</button>
                )}
              </div>
            ))}
          </div>
          <div>
            <label>Skills (Programming Languages):</label>
            <input
              value={formData.skills.programmingLanguages.join(',') || ''}
              onChange={(e) => handleChange(e, 'skills', 0, 'programmingLanguages')}
            />
          </div>
          <button type="submit">Save Profile</button>
        </form>
      )}
    </div>
  );
}

export default MyProfile;
