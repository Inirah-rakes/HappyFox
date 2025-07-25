import React, { useState } from 'react';
import '../Styles/Home.css'; // Assuming the CSS is still in App.css; adjust if needed
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts'; // For pie chart

function Home() {
  const [studentName] = useState('Harini S'); // Placeholder; replace with actual data fetch

  // Dummy data for pie chart (success/loss ratio) - to be replaced with real data
  const pieData = [
    { name: 'Success', value: 70 },
    { name: 'Loss', value: 30 },
  ];
  const COLORS = ['#28a745', '#dc3545']; // Green for success, red for loss

  return (
    <div className="app-container">
      {/* Greeting */}
      <div className="greeting">
        Hi, {studentName}
      </div>

      {/* Performance Card */}
      <div className="performance-card">
        <div className="card-title">Your Performance Overview</div>
        <div className="chart-container">
          {/* Pie Chart for Success/Loss Ratio */}
          <div>
            <PieChart width={300} height={200}>
              <Pie
                data={pieData}
                cx={150}
                cy={100}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            <p className="placeholder-text">Success/Loss Ratio</p>
          </div>

          {/* Placeholder for other metrics */}
          <div>
            <h4>Topics Needing Improvement</h4>
            <ul className="placeholder-text">
              <li>Data Structures</li>
              <li>Dynamic Programming</li>
              {/* Fetch from evaluation page later */}
            </ul>

            <h4>Time Spent on Learning</h4>
            <p className="placeholder-text">Total: 6 hrs</p>
            {/* Add bar chart or other graphs here later */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
