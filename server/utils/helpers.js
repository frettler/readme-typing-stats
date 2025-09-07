/**
 * Utility functions for the GitHub README Dynamic Typing service
 */

/**
 * Validates a GitHub username
 * @param {string} username - The username to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidGitHubUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // GitHub username rules:
  // - May only contain alphanumeric characters or hyphens
  // - Cannot have multiple consecutive hyphens
  // - Cannot begin or end with a hyphen
  // - Maximum is 39 characters
  const githubUsernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]|-(?!-))*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
  
  return username.length <= 39 && githubUsernameRegex.test(username);
}

/**
 * Validates a hex color code
 * @param {string} color - The color to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidHexColor(color) {
  if (!color || typeof color !== 'string') {
    return false;
  }
  
  // Allow both #ffffff and ffffff formats
  const hexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
}

/**
 * Sanitizes text for SVG display
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

/**
 * Formats numbers with appropriate suffixes (K, M, B)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Truncates text to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength = 50) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Calculates SVG dimensions based on text content
 * @param {string} text - The text content
 * @param {number} fontSize - Font size in pixels
 * @param {number} padding - Padding in pixels
 * @returns {object} - Object with width and height
 */
function calculateSVGDimensions(text, fontSize = 14, padding = 20) {
  const avgCharWidth = fontSize * 0.6; // Approximate character width for monospace fonts
  const textWidth = text.length * avgCharWidth;
  const width = Math.max(200, textWidth + padding);
  const height = Math.max(30, fontSize + padding);
  
  return { width, height };
}

/**
 * Validates query parameters for the typing endpoint
 * @param {object} query - Express query object
 * @returns {object} - Validation result with errors array
 */
function validateTypingParams(query) {
  const errors = [];
  const {
    user,
    type = 'commit',
    size = '14',
    speed = '50',
    width = '400',
    height = '50',
    color,
    theme = 'dark'
  } = query;
  
  // Required parameters
  if (!user) {
    errors.push('Missing required parameter: user');
  } else if (!isValidGitHubUsername(user)) {
    errors.push('Invalid GitHub username format');
  }
  
  // Optional parameters validation
  const validTypes = ['commit', 'stars', 'followers', 'forks', 'repos'];
  if (type && !validTypes.includes(type)) {
    errors.push(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
  }
  
  const validThemes = ['dark', 'light', 'ocean', 'forest', 'sunset'];
  if (theme && !validThemes.includes(theme)) {
    errors.push(`Invalid theme. Must be one of: ${validThemes.join(', ')}`);
  }
  
  // Numeric parameter validation
  const numericParams = { size, speed, width, height };
  for (const [param, value] of Object.entries(numericParams)) {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue <= 0) {
      errors.push(`Invalid ${param}: must be a positive integer`);
    }
  }
  
  // Color validation
  if (color && !isValidHexColor(color)) {
    errors.push('Invalid color format. Use hex color codes (e.g., #ff6b6b or ff6b6b)');
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Generates cache key for GitHub data
 * @param {string} username - GitHub username
 * @param {string} type - Data type
 * @returns {string} - Cache key
 */
function generateCacheKey(username, type) {
  return `github-${username}-${type}`.toLowerCase();
}

/**
 * Checks if a file is older than specified seconds
 * @param {string} filePath - Path to the file
 * @param {number} maxAge - Maximum age in seconds
 * @returns {Promise<boolean>} - True if file is older than maxAge
 */
async function isFileExpired(filePath, maxAge = 600) {
  const fs = require('fs-extra');
  
  try {
    if (!(await fs.pathExists(filePath))) {
      return true;
    }
    
    const stats = await fs.stat(filePath);
    const now = new Date();
    const fileAge = (now - stats.mtime) / 1000; // age in seconds
    
    return fileAge > maxAge;
  } catch (error) {
    return true; // Consider expired if we can't read the file
  }
}

module.exports = {
  isValidGitHubUsername,
  isValidHexColor,
  sanitizeText,
  formatNumber,
  truncateText,
  calculateSVGDimensions,
  validateTypingParams,
  generateCacheKey,
  isFileExpired
};

