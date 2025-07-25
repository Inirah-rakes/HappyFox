import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import '../Styles/OverviewReport.css';

function OverviewReport() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/admin/summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  const pieData = [
    { name: 'Placed', value: summary.placedStudents },
    { name: 'Non-Placed', value: summary.nonPlacedStudents },
  ];

  const barData = [
    { name: 'Eligible', value: summary.eligibleStudents },
    { name: 'Active Jobs', value: summary.activeJobs },
  ];

  return (
    <div className="overview-report-container">
      <h2>Overview Reports</h2>
      <div className="chart-container">
        <h3>Placement Status (Pie Chart)</h3>
        <PieChart width={400} height={300}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#007bff" label />
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <div className="chart-container">
        <h3>Key Metrics (Bar Chart)</h3>
        <BarChart width={400} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#28a745" />
        </BarChart>
      </div>
    </div>
  );
}

export default OverviewReport;
