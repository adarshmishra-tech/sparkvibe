// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({
  origin: 'https://sparkvibe-1.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.static(__dirname));

// Keyword suggestion
const suggestKeywords = (bioPurpose) => {
  const keywords = {
    'love': ['romance titan', 'connection guru', 'flirt maestro', 'love wizard', 'charm oracle'],
    'default': ['expert', 'creator', 'innovator', 'pro', 'legend']
  };
  const words = bioPurpose.toLowerCase().match(/\w+/g) || ['default'];
  return keywords[words[0]] || keywords['default'];
};

// Bio generation with clear theme impact
const generateBios = (theme, bioPurpose, location, platform, tone, keywords, useEmoji) => {
  const charLimit = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[platform] || 200;
  const toneStyles = {
    professional: { style: 'refined', energy: 'precision', vibe: 'excellence' },
    witty: { style: 'playful', energy: 'wit', vibe: 'charm' },
    bold: { style: 'daring', energy: 'intensity', vibe: 'impact' },
    friendly: { style: 'heartfelt', energy: 'warmth', vibe: 'connection' },
    inspirational: { style: 'uplifting', energy: 'motivation', vibe: 'hope' },
    romantic: { style: 'passionate', energy: 'love', vibe: 'affection' },
    casual: { style: 'laid-back', energy: 'chill', vibe: 'vibe' }
  };
  const toneData = toneStyles[tone] || toneStyles.professional;
  const keyword = keywords || 'legend';
  const locationPart = location ? `from ${location}` : 'worldwide';
  const themeStyle = theme === 'elegant' ? 'with elegant grace' : 'with vibrant flair';
  const emoji = useEmoji ? ' ✨' : '';
  const platformTag = { Instagram: '#BioBlaze', Twitter: '#TweetLegend', LinkedIn: '#LinkedPro', TikTok: '#TikTokIcon', Tinder: '#LoveSpark', Bumble: '#DateVibe' }[platform] || '';

  const bios = [
    `${toneData.style} ${bioPurpose} ${themeStyle}, ${keyword} ${locationPart}, delivering ${toneData.energy}${emoji} on ${platform}. ${platformTag}`,
    `${toneData.vibe}-focused ${bioPurpose} ${themeStyle}, ${keyword} ${locationPart}, crafting ${toneData.energy}${emoji} via ${platform}. ${platformTag}`,
    `${toneData.style} ${bioPurpose} pioneer ${themeStyle}, ${keyword} ${locationPart}, sharing ${toneData.vibe}${emoji} on ${platform}. ${platformTag}`
  ];

  return bios.map(bio => ({
    text: bio.length > charLimit ? bio.slice(0, charLimit - 3) + '...' : bio,
    length: bio.length
  }));
};

// Endpoints
app.post('/api/suggest-keywords', (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Bio Purpose required (e.g., love).' });
  const keywords = suggestKeywords(bioPurpose);
  res.json({ keywords });
});

app.post('/api/generate-bios', (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords, useEmoji } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) return res.status(400).json({ error: 'Missing required fields.' });
  const bios = generateBios(theme, bioPurpose, location, platform, tone, keywords, useEmoji);
  res.json({ bios });
});

app.get('/api/current-date', (req, res) => {
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu', hour12: true });
  res.json({ date });
});

app.get('/contact', (req, res) => res.sendFile(__dirname + '/contact.html'));
app.get('/privacy', (req, res) => res.sendFile(__dirname + '/privacy.html'));

app.listen(port, () => console.log(`Server on port ${port}`));
