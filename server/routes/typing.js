const express = require('express');
const router = express.Router();
const githubService = require('../services/githubService');
const SVGGenerator = require('../svg/svgGenerator');

const svgGenerator = new SVGGenerator();

// Main typing endpoint
router.get('/', async (req, res) => {
  try {
    const {
      user,
      type = 'commit',
      color,
      size = '14',
      cursor = 'true',
      repeat = 'true',
      speed = '50',
      theme = 'dark',
      width = '400',
      height = '50'
    } = req.query;

    // Validate required parameters
    if (!user) {
      return res.status(400).json({ 
        error: 'Missing required parameter: user',
        usage: '/typing?user=username&type=commit|stars|followers|forks|repos'
      });
    }

    // Validate type parameter
    const validTypes = ['commit', 'stars', 'followers', 'forks', 'repos'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: `Invalid type parameter. Must be one of: ${validTypes.join(', ')}`,
        provided: type
      });
    }

    // Parse options
    const options = {
      fontSize: parseInt(size, 10),
      color: color,
      cursor: cursor === 'true',
      repeat: repeat === 'true',
      speed: parseInt(speed, 10),
      theme: theme,
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    };

    // Fetch GitHub data
    const data = await githubService.getUserData(user, type);
    
    // Generate SVG
    const svg = svgGenerator.generateTypingAnimation(data.text, options);

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=600'); // 10 minutes
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.send(svg);

  } catch (error) {
    console.error('Error in typing endpoint:', error);
    
    // Generate error SVG
    const errorText = `Error: ${error.message}`;
    const errorSvg = svgGenerator.generateTypingAnimation(errorText, {
      color: '#ff6b6b',
      theme: 'dark'
    });

    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send(errorSvg);
  }
});

// Preview endpoint for testing
router.get('/preview', (req, res) => {
  const {
    text = 'Hello, GitHub! 👋',
    color = '#58a6ff',
    size = '14',
    cursor = 'true',
    repeat = 'true',
    speed = '50',
    theme = 'dark'
  } = req.query;

  const options = {
    fontSize: parseInt(size, 10),
    color: color,
    cursor: cursor === 'true',
    repeat: repeat === 'true',
    speed: parseInt(speed, 10),
    theme: theme
  };

  const svg = svgGenerator.generateTypingAnimation(text, options);

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Info endpoint
router.get('/info', (req, res) => {
  res.json({
    endpoint: '/typing',
    parameters: {
      required: {
        user: 'GitHub username'
      },
      optional: {
        type: 'commit|stars|followers|forks|repos (default: commit)',
        color: 'Hex color code (default: theme-based)',
        size: 'Font size in pixels (default: 14)',
        cursor: 'Show blinking cursor (default: true)',
        repeat: 'Loop animation (default: true)',
        speed: 'Typing speed in ms per character (default: 50)',
        theme: 'dark|light|ocean|forest|sunset (default: dark)',
        width: 'SVG width (default: 400)',
        height: 'SVG height (default: 50)'
      }
    },
    examples: [
      '/typing?user=octocat&type=commit',
      '/typing?user=octocat&type=stars&color=%23ff6b6b&theme=dark',
      '/typing/preview?text=Custom%20Text&color=%2300ff00'
    ],
    themes: ['dark', 'light', 'ocean', 'forest', 'sunset']
  });
});

module.exports = router;

