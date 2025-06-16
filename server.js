const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const bioLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: { error: 'Free limit reached. Upgrade to Luxe!' },
  keyGenerator: (req) => req.ip
});

const savedBios = new Map();

app.post('/generate-bio', bioLimiter, (req, res) => {
  const { purpose, location, platform, tone } = req.body;
  if (!purpose || !platform || !tone) return res.status(400).json({ error: 'Missing fields' });

  const platformLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
  const generateBio = (toneVar) => {
    let bio = `${purpose} | ${toneVar === 'Witty' ? 'Quirky Visionary' : toneVar} Elite`;
    if (location) bio += ` | ${location}`;
    bio += ` | #${platform}Star`;
    if (bio.length > platformLimits[platform]) bio = bio.slice(0, platformLimits[platform] - 3) + '...';
    return bio;
  };

  const bio1 = generateBio(tone);
  const bio2 = generateBio(tone === 'Professional' ? 'Friendly' : 'Luxury');
  res.json({ bio1, bio2 });
});

app.post('/save-bio', (req, res) => {
  const { email, bio } = req.body;
  if (!email || !bio) return res.status(400).json({ error: 'Email and bio required' });
  savedBios.set(email, bio);
  res.json({ message: 'Bio saved!' });
});

app.listen(port, () => console.log(`Server on http://localhost:${port}`));
