const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const typingRoutes = require('./routes/typing');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/typing', typingRoutes);

// Root route - serve the web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'GitHub README Dynamic Typing',
    version: '1.0.0',
    description: 'Generate animated SVGs with typewriter effect using live GitHub data',
    endpoints: {
      typing: '/typing?user=username&type=commit|stars|followers|forks',
      preview: '/typing/preview?text=custom-text',
      info: '/typing/info'
    },
    webInterface: '/'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Only start the server when running locally. On Vercel, the app is exported.
if (require.main === module && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 GitHub Dynamic Typing SVG service started`);
  });
}

module.exports = app;

