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

// Advanced keyword suggestion
const suggestKeywords = (bioPurpose) => {
  const keywordBase = {
    'marketing': ['SEO guru', 'digital trailblazer', 'ad maestro', 'growth hacker', 'brand strategist'],
    'bakery': ['artisan baker', 'pastry wizard', 'bread artisan', 'dessert innovator', 'cake craftsman'],
    'branding': ['identity sculptor', 'self-growth pioneer', 'influence architect', 'personal visionary', 'brand alchemist'],
    'business': ['entrepreneurial genius', 'corporate innovator', 'startup visionary', 'growth catalyst', 'business oracle'],
    'fitness': ['fitness revolutionary', 'health sage', 'workout maestro', 'wellness guru', 'strength architect'],
    'photography': ['visual poetry master', 'photo odyssey expert', 'portrait genius', 'landscape sorcerer', 'image alchemist'],
    'travel': ['global wanderer', 'journey weaver', 'adventure chronicler', 'cultural navigator', 'pathfinder'],
    'fashion': ['style revolutionist', 'trendsetting icon', 'design oracle', 'couture visionary', 'fabric maestro'],
    'technology': ['tech visionary', 'innovation prophet', 'code sorcerer', 'digital pioneer', 'future architect'],
    'dating': ['romance expert', 'connection creator', 'flirt master', 'love navigator', 'charm architect']
  };
  const words = bioPurpose.toLowerCase().match(/\w+/g) || [];
  const relevant = words.map(w => keywordBase[w] || []).flat();
  const generic = ['expert', 'creator', 'innovator', 'pro', 'legend', 'guru', 'icon'];
  const custom = words.map(w => `${w} ${generic[Math.floor(Math.random() * generic.length)]}`).slice(0, 2);
  return [...new Set([...custom, ...relevant.slice(0, 3)])];
};

// Advanced bio generation with 3 options
const generateBios = (theme, bioPurpose, location, platform, tone, keywords) => {
  const charLimit = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[platform] || 200;
  const toneStyles = {
    professional: { style: 'refined', energy: 'precision', vibe: 'excellence', connector: 'delivering' },
    witty: { style: 'playful', energy: 'wit', vibe: 'charm', connector: 'sprinkling' },
    bold: { style: 'daring', energy: 'intensity', vibe: 'impact', connector: 'unleashing' },
    friendly: { style: 'heartfelt', energy: 'warmth', vibe: 'connection', connector: 'sharing' },
    inspirational: { style: 'uplifting', energy: 'motivation', vibe: 'hope', connector: 'igniting' },
    romantic: { style: 'passionate', energy: 'love', vibe: 'affection', connector: 'weaving' },
    casual: { style: 'laid-back', energy: 'chill', vibe: 'vibe', connector: 'bringing' }
  };
  const toneData = toneStyles[tone] || toneStyles.professional;
  const keywordArray = keywords ? keywords.split(', ').slice(0, 3) : [];
  const locationPart = location ? `rooted in ${location}` : 'globally inspired';
  const themeStyle = theme === 'elegant' ? 'elegantly sculpted' : 'vibrantly forged';
  const platformTag = { Instagram: '#BioBlaze', Twitter: '#TweetLegend', LinkedIn: '#LinkedPro', TikTok: '#TikTokIcon', Tinder: '#LoveSpark', Bumble: '#DateVibe' }[platform] || '';

  const templates = [
    `${toneData.style} ${bioPurpose} ${themeStyle} ${keywordArray.join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.energy} with every ${platform} moment. ${platformTag}`,
    `${toneData.vibe}-driven ${bioPurpose} ${themeStyle} ${keywordArray[0] || ''} ${locationPart}, crafting ${toneData.energy} across ${platform}. ${platformTag}`,
    `${toneData.style} ${bioPurpose} pioneer ${themeStyle} ${keywordArray.slice(0, 2).join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.vibe} on ${platform}. ${platformTag}`
  ];

  return templates.map(template => {
    let bio = template.replace(/\s+/g, ' ').trim();
    return { text: bio.length > charLimit ? bio.substring(0, charLimit - 3) + '...' : bio, length: bio.length };
  });
};

// Keyword suggestion route
app.post('/api/suggest-keywords', (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Bio Purpose is required.' });
  const keywords = suggestKeywords(bioPurpose);
  res.json({ keywords });
});

// Bio generation route
app.post('/api/generate-bios', (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }
  const bios = generateBios(theme, bioPurpose, location, platform, tone, keywords);
  res.json({ bios });
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
