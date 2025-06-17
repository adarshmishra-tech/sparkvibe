// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname));

// Custom keyword suggestion logic
const suggestKeywords = (bioPurpose) => {
  const keywordMap = {
    'Digital Marketing': ['SEO expert', 'digital strategist', 'marketing guru', 'online growth', 'ad specialist'],
    'Bakery': ['artisan baker', 'fresh pastries', 'bakery chef', 'homemade bread', 'sweet treats'],
    'Personal Branding': ['brand builder', 'personal coach', 'identity expert', 'self-growth', 'influence creator'],
    'Business': ['entrepreneur', 'business leader', 'startup founder', 'corporate strategist', 'innovation hub'],
    'Fitness': ['fitness coach', 'health guru', 'workout expert', 'wellness advocate', 'strength trainer'],
    'Photography': ['photo artist', 'visual storyteller', 'portrait pro', 'landscape expert', 'image creator']
  };
  const defaultKeywords = ['expert', 'creator', 'specialist', 'innovator', 'pro'];
  return keywordMap[bioPurpose] || defaultKeywords;
};

// Keyword suggestion route
app.post('/api/suggest-keywords', (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Bio Purpose is required.' });

  const keywords = suggestKeywords(bioPurpose).slice(0, 5).join(', ');
  res.json({ keywords });
});

// Custom bio generation logic
const generateBio = (theme, bioPurpose, location, platform, tone, keywords) => {
  const charLimit = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150 }[platform] || 200;
  const tones = {
    professional: { adj: 'dedicated', vibe: 'precision' },
    witty: { adj: 'clever', vibe: 'humor' },
    bold: { adj: 'dynamic', vibe: 'energy' },
    friendly: { adj: 'warm', vibe: 'connection' },
    inspirational: { adj: 'motivated', vibe: 'inspiration' }
  };
  const toneData = tones[tone] || tones.professional;
  const keywordArray = keywords ? keywords.split(', ').slice(0, 3) : [];
  const locationPart = location ? `from ${location}` : '';
  const themePart = theme === 'elegant' ? 'elegantly crafted' : 'vibrantly designed';
  const baseBio = `${toneData.adj} ${bioPurpose} ${themePart} ${keywordArray.join(' ')} ${locationPart}. Bringing ${toneData.vibe} to every ${platform}.`;
  return baseBio.substring(0, charLimit).trim() + (baseBio.length > charLimit ? '...' : '');
};

// Bio generation route
app.post('/api/generate-bio', (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }

  const bio = generateBio(theme, bioPurpose, location, platform, tone, keywords);
  res.json({ bio, characters: bio.length });
});

// Contact and Privacy
app.get('/contact', (req, res) => res.sendFile(__dirname + '/contact.html'));
app.get('/privacy', (req, res) => res.sendFile(__dirname + '/privacy.html'));

// Dynamic date
app.get('/api/current-date', (req, res) => {
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu', hour12: true });
  res.json({ date });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} | SparkVibe AI - Free Forever!`);
});
