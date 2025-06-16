const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rate limiter for Free tier (3 bios/day per IP or fingerprint)
const bioLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  message: { error: 'Free tier limit reached (3 bios/day). Upgrade to Elite or Diamond!' },
  keyGenerator: (req) => req.body.fingerprint || req.ip
});

// Mock database for storing saved bios
const savedBios = new Map();

// Generate bio endpoint
app.post('/generate-bio', bioLimiter, async (req, res) => {
  try {
    const { purpose, location, platform, tone, fingerprint } = req.body;
    if (!purpose || !platform || !tone || !fingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Mock AI bio generation
    const platformLimits = {
      Instagram: 150,
      LinkedIn: 2000,
      TikTok: 80,
      Twitter: 160
    };
    let bio = `${purpose} | ${tone} vibe`;
    if (location) bio += ` | ${location} 📍`;
    bio += ` | #${platform}`;
    if (bio.length > platformLimits[platform]) {
      bio = bio.substring(0, platformLimits[platform] - 3) + '...';
    }
    res.json({ bio });
  } catch (err) {
    console.error('Bio generation error:', err);
    res.status(500).json({ error: 'Error generating bio' });
  }
});

// Save bio endpoint
app.post('/save-bio', async (req, res) => {
  try {
    const { email, bio } = req.body;
    if (!email || !bio) {
      return res.status(400).json({ error: 'Email and bio are required' });
    }
    savedBios.set(email, bio);
    res.json({ message: 'Bio saved successfully!' });
  } catch (err) {
    console.error('Save bio error:', err);
    res.status(500).json({ error: 'Error saving bio' });
  }
});

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
