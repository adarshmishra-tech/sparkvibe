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
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));
app.use(express.json());
app.use(express.static(__dirname));

// Advanced keyword suggestion with SEO focus
const suggestKeywords = (bioPurpose) => {
  const keywordBase = {
    'marketing': ['SEO titan', 'digital guru', 'ad maestro', 'growth wizard', 'brand oracle'],
    'bakery': ['artisan titan', 'pastry guru', 'bread maestro', 'dessert wizard', 'cake oracle'],
    'branding': ['identity titan', 'self-growth guru', 'influence maestro', 'personal wizard', 'brand oracle'],
    'business': ['entrepreneurial titan', 'corporate guru', 'startup maestro', 'growth wizard', 'business oracle'],
    'fitness': ['fitness titan', 'health guru', 'workout maestro', 'wellness wizard', 'strength oracle'],
    'photography': ['visual poetry titan', 'photo odyssey guru', 'portrait maestro', 'landscape wizard', 'image oracle'],
    'travel': ['global wanderer titan', 'journey weaver guru', 'adventure maestro', 'cultural wizard', 'pathfinder oracle'],
    'fashion': ['style titan', 'trendsetting guru', 'design maestro', 'couture wizard', 'fabric oracle'],
    'technology': ['tech titan', 'innovation guru', 'code maestro', 'digital wizard', 'future oracle'],
    'dating': ['romance titan', 'connection guru', 'flirt maestro', 'love wizard', 'charm oracle']
  };
  const words = bioPurpose.toLowerCase().match(/\w+/g) || [];
  const relevant = words.map(w => keywordBase[w] || []).flat();
  const generic = ['expert', 'creator', 'innovator', 'pro', 'legend', 'guru', 'maestro', 'oracle'];
  const custom = words.map(w => `${w} ${generic[Math.floor(Math.random() * generic.length)]}`).slice(0, 2);
  return [...new Set([...custom, ...relevant.slice(0, 3)])];
};

// Advanced bio generation with theme impact and SEO optimization
const generateBios = (theme, bioPurpose, location, platform, tone, keywords, useEmoji) => {
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
  const themeStyle = theme === 'elegant' ? 'elegantly woven with sophistication' : 'vibrantly infused with energy';
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
  if (!bioPurpose) return res.status(400).json({ error: 'Please enter a Bio Purpose (e.g., Dating Coach).' });
  const keywords = suggestKeywords(bioPurpose);
  res.json({ keywords });
});

// Bio generation route
app.post('/api/generate-bios', (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords, useEmoji } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }
  try {
    const bios = generateBios(theme, bioPurpose, location, platform, tone, keywords, useEmoji);
    res.json({ bios });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
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
