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
  message: { error: 'Free limit reached (3 bios/day). Upgrade to Luxe!' },
  keyGenerator: (req) => req.ip
});

const savedBios = new Map();

app.post('/generate-bio', bioLimiter, async (req, res) => {
  const { purpose, location, platform, tone } = req.body;
  if (!purpose || !platform || !tone) return res.status(400).json({ error: 'Missing fields' });

  const platformLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
  const generateBio = (toneVar) => {
    let bio = `${purpose} | ${toneVar === 'Witty' ? 'Quirky Elite' : toneVar} Visionary`;
    if (location) bio += ` | ${location} 📍`;
    bio += ` | #${platform}Luxe`;
    if (toneVar === 'Luxury') bio += ' | Opulent Style';
    if (toneVar === 'Friendly') bio += ' | Warm Elite';
    if (toneVar === 'Witty') bio += ' | Humor Master';
    return bio.length > platformLimits[platform] ? bio.slice(0, platformLimits[platform] - 3) + '...' : bio;
  };

  const bio1 = generateBio(tone);
  const bio2 = generateBio(tone === 'Professional' ? 'Friendly' : tone === 'Friendly' ? 'Luxury' : 'Witty');
  res.json({ bio1, bio2 });
});

app.post('/save-bio', async (req, res) => {
  const { email, bio } = req.body;
  if (!email || !bio) return res.status(400).json({ error: 'Email and bio required' });
  savedBios.set(email, bio);
  res.json({ message: 'Bio saved successfully!' });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
