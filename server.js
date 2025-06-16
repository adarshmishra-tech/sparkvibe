const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const bioLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: { error: 'Free tier limit reached (3 bios/day). Upgrade to Elite or Diamond!' },
  keyGenerator: (req) => req.body.fingerprint || req.ip
});

const savedBios = new Map();

app.post('/generate-bio', bioLimiter, async (req, res) => {
  try {
    const { purpose, location, platform, tone, fingerprint } = req.body;
    if (!purpose || !platform || !tone || !fingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
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

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
