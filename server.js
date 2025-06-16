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
  message: { error: 'Free limit reached (3 bios/day). Upgrade to Elite or Diamond!' },
  keyGenerator: (req) => req.body.fingerprint || req.ip
});

const savedBios = new Map();

app.post('/generate-bio', bioLimiter, async (req, res) => {
  const { purpose, location, platform, tone, fingerprint } = req.body;
  if (!purpose || !platform || !tone || !fingerprint) return res.status(400).json({ error: 'Missing fields' });

  const platformLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
  const generateBio = (toneVar) => {
    let bio = `${purpose} | ${toneVar === 'Witty' ? 'Quirky' : toneVar} Pro`;
    if (location) bio += ` | ${location} 📍`;
    bio += ` | #${platform}Elite`;
    if (toneVar === 'Luxury') bio += ' | Luxe Vibes';
    if (toneVar === 'Friendly') bio += ' | Warm Welcome';
    if (toneVar === 'Witty') bio += ' | Wit Unleashed';
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

app.listen(port, () => console.log(`Server at http://localhost:${port}`));
