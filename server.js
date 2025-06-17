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

// Advanced keyword suggestion logic
const suggestKeywords = (bioPurpose) => {
  const keywordDatabase = {
    'Digital Marketing': ['SEO master', 'digital innovator', 'marketing wizard', 'online growth hacker', 'ad campaign pro'],
    'Bakery': ['artisan bread maker', 'pastry artisan', 'baking enthusiast', 'homemade dessert expert', 'cake decorator'],
    'Personal Branding': ['brand visionary', 'self-development guru', 'identity architect', 'influence builder', 'personal empowerment'],
    'Business': ['entrepreneurial leader', 'business strategist', 'startup pioneer', 'corporate visionary', 'growth catalyst'],
    'Fitness': ['fitness trailblazer', 'health revolutionist', 'workout innovator', 'wellness pioneer', 'strength mentor'],
    'Photography': ['visual artistry pro', 'photo journey expert', 'portrait maestro', 'landscape visionary', 'image craft specialist'],
    'Travel': ['globetrotting expert', 'travel storyteller', 'adventure guide', 'cultural explorer', 'journey curator'],
    'Fashion': ['style innovator', 'trendsetter guru', 'fashion visionary', 'design maestro', 'couture expert'],
    'Technology': ['tech pioneer', 'innovation leader', 'software visionary', 'coding maestro', 'digital futurist']
  };
  const genericKeywords = ['expert', 'creator', 'specialist', 'innovator', 'pro', 'guru', 'master', 'enthusiast'];
  const purposeWords = bioPurpose.toLowerCase().split(' ').filter(w => w.length > 2);
  const customKeywords = purposeWords.map(word => `${word} ${genericKeywords[Math.floor(Math.random() * genericKeywords.length)]}`).slice(0, 2);
  const baseKeywords = keywordDatabase[bioPurpose] || keywordDatabase[Object.keys(keywordDatabase)[Math.floor(Math.random() * Object.keys(keywordDatabase).length)]];
  return [...new Set([...customKeywords, ...baseKeywords.slice(0, 3)])].join(', ');
};

// Advanced bio generation logic
const generateBio = (theme, bioPurpose, location, platform, tone, keywords) => {
  const charLimit = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150 }[platform] || 200;
  const toneStyles = {
    professional: { style: 'polished', energy: 'dedication', connector: 'delivering' },
    witty: { style: 'quirky', energy: 'humor', connector: 'sprinkling' },
    bold: { style: 'bold', energy: 'power', connector: 'unleashing' },
    friendly: { style: 'warm', energy: 'connection', connector: 'sharing' },
    inspirational: { style: 'uplifting', energy: 'inspiration', connector: 'igniting' }
  };
  const toneData = toneStyles[tone] || toneStyles.professional;
  const keywordArray = keywords ? keywords.split(', ').slice(0, 3) : [];
  const locationPart = location ? `based in ${location}` : 'globally inspired';
  const themeStyle = theme === 'elegant' ? 'sophisticatedly curated' : 'dynamically crafted';
  const platformTag = { Instagram: '#BioVibe', Twitter: '#TweetPro', LinkedIn: '#LinkedInExpert', TikTok: '#TikTokStar' }[platform] || '';
  const bioBase = `${toneData.style} ${bioPurpose} ${themeStyle} ${keywordArray.join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.energy} with every ${platform} post. ${platformTag}`;
  let bio = bioBase.replace(/\s+/g, ' ').trim();
  return bio.length > charLimit ? bio.substring(0, charLimit - 3) + '...' : bio;
};

// Keyword suggestion route
app.post('/api/suggest-keywords', (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Bio Purpose is required.' });
  const keywords = suggestKeywords(bioPurpose);
  res.json({ keywords });
});

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
