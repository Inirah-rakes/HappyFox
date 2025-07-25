const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ debug: true });

const app = express();
const PORT = 3001; // Node.js server port
const FLASK_URL = 'http://localhost:5000/generate-resume-ai'; // Flask endpoint URL
const profileRoutes = require('./routes/ProfileRoutes');

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/admin', require('./routes/admin'));

app.post('/api/summary-mcq', async (req, res) => {
  const { summary } = req.body;

  if (!summary) {
    return res.status(400).json({ error: 'Summary is required' });
  }

  try {
    const flaskResponse = await axios.post('http://localhost:5000/generate-mcq', {
      summary: summary
    });

    return res.json({ mcqs: flaskResponse.data }); // Send MCQs back to React
  } catch (error) {
    console.error('Error communicating with Flask:', error.message);
    return res.status(500).json({ error: 'Failed to generate MCQs from Flask' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Node.js backend for HappyFox!');
});
app.post('/api/youtube-summary', async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: 'YouTube link is required' });
  }

  try {
    const response = await axios.post('http://localhost:5000/youtube-transcript', { 'link': link });
    const data = response.data;
    
    if (data.error) {
      return res.status(500).json({ error: data.error });
    }
    
    res.json({ summary: data.summary || 'No summary available' });
  } catch (error) {
    console.error('Error fetching YouTube summary:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube summary' });
  }
});
// Endpoint to receive data from React frontend and forward to Flask
app.post('/api/forward-student', async (req, res) => {
  console.log('Received data from frontend:', req.body);  
  try {
    // Forward the received data to the Flask endpoint
    const flaskResponse = await axios.post(FLASK_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Send Flask response back to the frontend
    console.log('Response from Flask:', flaskResponse.data);
    res.status(flaskResponse.status).json(flaskResponse.data);
  } catch (error) {
    console.error('Error forwarding data to Flask:', error.message);
    if (error.response) {
      // Forward Flask error response if available
      res.status(error.response.status).json({
        error: error.response.data || 'Error from Flask backend',
      });
      
    } else if (error.request) {
      // Handle case where request was made but no response received
      console.error('No response received from Flask:', error.request);
      res.status(500).json({ error: 'No response from Flask backend' });

    }
    
    else {
      // Handle network or other errors
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Node.js server running on http://localhost:${PORT}`);
});