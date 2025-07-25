import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginPage.css'; // Import dedicated CSS (create this file as per instructions)

const LoginPage = () => {
  const [role, setRole] = useState('student'); // Toggle between 'student' and 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Predefined mock credentials for frontend testing (replace with backend later)
  const predefinedCredentials = {
    student: { email: 'student@example.com', password: 'studentpass' },
    admin: { email: 'admin@example.com', password: 'adminpass' },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const creds = predefinedCredentials[role];

    // Mock check for credentials
    if (email === creds.email && password === creds.password) {
      // Simulate storing token/credentials in localStorage for dynamic sessions
      localStorage.setItem('token', 'dummy-token-' + role);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email); // Store email for dynamic use

      if (role === 'student') {
        navigate('/home'); // Redirect to homepage for students
      } else {
        navigate('/adminhome'); // Redirect to adminhome for admins
      }
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="section-title">Login to Placement System</h2>
        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'student' ? 'active' : ''}`} 
            onClick={() => setRole('student')}
          >
            Student Login
          </button>
          <button 
            className={`role-btn ${role === 'admin' ? 'active' : ''}`} 
            onClick={() => setRole('admin')}
          >
            Admin Login
          </button>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="input-field"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="input-field"
          />
          <button type="submit" className="login-btn">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
