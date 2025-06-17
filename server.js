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
  const categories = {
    'love': ['romance titan', 'love guru', 'flirt maestro', 'heart wizard', 'charm oracle'],
    'tech': ['tech titan', 'innovation guru', 'code maestro', 'digital wizard', 'future oracle'],
    'business': ['business titan', 'entrepreneur guru', 'growth maestro', 'startup wizard', 'corporate oracle'],
    'fitness': ['fitness titan', 'health guru', 'workout maestro', 'strength wizard', 'wellness oracle'],
    'default': ['creator', 'expert', 'innovator', 'pro', 'legend']
  };
  const words = bioPurpose.toLowerCase().match(/\w+/g) || ['default'];
  return categories[words[0]] || categories['default'];
};

// Bio generation with clear theme differentiation
const generateBios = (theme, bioPurpose, location, platform, tone, keywords, useEmoji) => {
  const charLimits = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 };
  const charLimit = charLimits[platform] || 150;
  const tones = {
    professional: { adj: 'refined', action: 'delivering', emoji: '💼' },
    witty: { adj: 'playful', action: 'sprinkling', emoji: '😄' },
    bold: { adj: 'daring', action: 'unleashing', emoji: '💪' },
    friendly: { adj: 'warm', action: 'sharing', emoji: '😊' },
    inspirational: { adj: 'inspiring', action: 'igniting', emoji: '🌟' },
    romantic: { adj: 'passionate', action: 'weaving', emoji: '❤️' },
    casual: { adj: 'relaxed', action: 'bringing', emoji: '😎' }
  };
  const toneData = tones[tone] || tones.professional;
  const keyword = keywords || 'legend';
  const locationPart = location ? `from ${location}` : 'across the globe';
  const themeStyle = theme === 'elegant' ? 'with graceful elegance' : 'with vibrant energy';
  const emoji = useEmoji ? ` ${toneData.emoji}` : '';
  const hashtag = { Instagram: '#BioBlaze', Twitter: '#TweetLegend', LinkedIn: '#LinkedPro', TikTok: '#TikTokIcon', Tinder: '#LoveSpark', Bumble: '#DateVibe' }[platform] || '';

  const bios = [
    `${toneData.adj} ${bioPurpose} ${themeStyle}, ${keyword} ${locationPart}, ${toneData.action} expertise${emoji} on ${platform}. ${hashtag}`,
    `${bioPurpose} pioneer ${themeStyle}, ${keyword} ${locationPart}, ${toneData.action} ${toneData.adj} vibes${emoji} via ${platform}. ${hashtag}`,
    `${toneData.adj} ${bioPurpose} expert ${themeStyle}, ${keyword} ${locationPart}, ${toneData.action} passion${emoji} on ${platform}. ${hashtag}`
  ];

  return bios.map(bio => ({
    text: bio.length > charLimit ? bio.slice(0, charLimit - 3) + '...' : bio,
    length: bio.length
  }));
};

// Endpoints
app.post('/api/suggest-keywords', (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Please enter a Bio Purpose (e.g., love, tech).' });
  const keywords = suggestKeywords(bioPurpose);
  res.json({ keywords });
});

app.post('/api/generate-bios', (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords, useEmoji } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }
  try {
    const bios = generateBios(theme, bioPurpose, location, platform, tone, keywords, useEmoji);
    if (bios.length < 3) throw new Error('Failed to generate enough bios');
    res.json({ bios });
  } catch (error) {
    res.status(500).json({ error: `Generation failed: ${error.message}` });
  }
});

app.get('/api/current-date', (req, res) => {
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu', hour12: true });
  res.json({ date });
});

app.get('/contact', (req, res) => res.sendFile(__dirname + '/contact.html'));
app.get('/privacy', (req, res) => res.sendFile(__dirname + '/privacy.html'));

app.listen(port, () => console.log(`Server on ${port} | SparkVibe AI`));
