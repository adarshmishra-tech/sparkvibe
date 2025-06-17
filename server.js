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
    'marketing': ['SEO wizard', 'digital pioneer', 'ad genius', 'growth catalyst', 'brand maestro'],
    'bakery': ['artisan baker', 'pastry virtuoso', 'bread artisan', 'dessert maestro', 'cake artisan'],
    'branding': ['identity sculptor', 'self-growth guru', 'influence titan', 'personal visionary', 'brand sorcerer'],
    'business': ['entrepreneurial titan', 'corporate visionary', 'startup maestro', 'growth oracle', 'business sage'],
    'fitness': ['fitness titan', 'health guru', 'workout wizard', 'wellness sage', 'strength maestro'],
    'photography': ['visual poetry titan', 'photo odyssey guru', 'portrait wizard', 'landscape sage', 'image maestro'],
    'travel': ['global wanderer titan', 'journey weaver guru', 'adventure wizard', 'cultural sage', 'pathfinder maestro'],
    'fashion': ['style titan', 'trendsetting guru', 'design wizard', 'couture sage', 'fabric maestro'],
    'technology': ['tech titan', 'innovation guru', 'code wizard', 'digital sage', 'future maestro'],
    'dating': ['romance titan', 'connection guru', 'flirt wizard', 'love sage', 'charm maestro']
  };
  const words = bioPurpose.toLowerCase().match(/\w+/g) || [];
  const relevant = words.map(w => keywordBase[w] || []).flat();
  const generic = ['expert', 'creator', 'innovator', 'pro', 'legend', 'guru', 'icon', 'maestro'];
  const custom = words.map(w => `${w} ${generic[Math.floor(Math.random() * generic.length)]}`).slice(0, 2);
  return [...new Set([...custom, ...relevant.slice(0, 3)])];
};

// Advanced bio generation with 3 SEO-optimized options
const generateBios = (theme, bioPurpose, location, platform, tone, keywords, useEmoji) => {
  const charLimit = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[platform] || 200;
  const toneStyles = {
    professional: { style: 'refined', energy: 'precision', vibe: 'excellence', emoji: '💼', connector: 'delivering' },
    witty: { style: 'playful', energy: 'wit', vibe: 'charm', emoji: '😄', connector: 'sprinkling' },
    bold: { style: 'daring', energy: 'intensity', vibe: 'impact', emoji: '💪', connector: 'unleashing' },
    friendly: { style: 'heartfelt', energy: 'warmth', vibe: 'connection', emoji: '😊', connector: 'sharing' },
    inspirational: { style: 'uplifting', energy: 'motivation', vibe: 'hope', emoji: '🌟', connector: 'igniting' },
    romantic: { style: 'passionate', energy: 'love', vibe: 'affection', emoji: '❤️', connector: 'weaving' },
    casual: { style: 'laid-back', energy: 'chill', vibe: 'vibe', emoji: '😎', connector: 'bringing' }
  };
  const toneData = toneStyles[tone] || toneStyles.professional;
  const keywordArray = keywords ? keywords.split(', ').slice(0, 3) : [];
  const locationPart = location ? `rooted in ${location}` : 'globally inspired';
  const themeStyle = theme === 'elegant' ? 'elegantly crafted with finesse' : 'vibrantly sculpted with flair';
  const platformTag = { Instagram: '#BioBlaze', Twitter: '#TweetLegend', LinkedIn: '#LinkedPro', TikTok: '#TikTokIcon', Tinder: '#LoveSpark', Bumble: '#DateVibe' }[platform] || '';
  const emoji = useEmoji ? ' ✨' : '';

  const templates = [
    `${toneData.style} ${bioPurpose} ${themeStyle} ${keywordArray.join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.energy}${emoji} with every ${platform} moment. ${platformTag}`,
    `${toneData.vibe}-driven ${bioPurpose} ${themeStyle} ${keywordArray[0] || ''} ${locationPart}, crafting ${toneData.energy}${emoji} across ${platform}. ${platformTag}`,
    `${toneData.style} ${bioPurpose} pioneer ${themeStyle} ${keywordArray.slice(0, 2).join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.vibe}${emoji} on ${platform}. ${platformTag}`
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
  const { theme, bioPurpose, location, platform, tone, keywords, useEmoji } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }
  const bios = generateBios(theme, bioPurpose, location, platform, tone, keywords, useEmoji);
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
