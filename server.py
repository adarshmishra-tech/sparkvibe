const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: 'https://sparkvibe-1.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.static(__dirname));

// SEO Power Words Dictionary
const powerWords = {
  vibrant: ['dynamic', 'bold', 'radiant', 'striking', 'vivid', 'energetic', 'lively', 'sparkling', 'thriving', 'bustling'],
  elegant: ['sophisticated', 'refined', 'polished', 'graceful', 'timeless', 'exquisite', 'classy', 'cultivated', 'distinguished', 'chic'],
  general: ['expert', 'guru', 'pioneer', 'visionary', 'maestro', 'oracle', 'pro', 'legend', 'innovator', 'master']
};

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
  const custom = words.map(w => `${w} ${powerWords.general[Math.floor(Math.random() * powerWords.general.length)]}`).slice(0, 3);
  return [...new Set([...custom, ...relevant.slice(0, 4), ...powerWords.general.slice(0, 2)])];
};

// Advanced bio generation with distinct theme impact
const generateBios = (theme, bioPurpose, location, platform, tone, keywords, emojiStyle) => {
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
  const themeWords = powerWords[theme] || powerWords.vibrant;
  const themeStyle = theme === 'elegant' 
    ? `${themeWords[Math.floor(Math.random() * themeWords.length)]} with timeless sophistication` 
    : `${themeWords[Math.floor(Math.random() * themeWords.length)]} with bold energy`;
  const platformTag = { Instagram: '#BioBlaze', Twitter: '#TweetLegend', LinkedIn: '#LinkedPro', TikTok: '#TikTokIcon', Tinder: '#LoveSpark', Bumble: '#DateVibe' }[platform] || '';
  const emojis = {
    minimal: ['✨', '🌟', '💡'],
    vibrant: ['🌈', '🚀', '🎉', '🔥'],
    none: ['']
  };
  const emoji = emojiStyle !== 'none' ? emojis[emojiStyle][Math.floor(Math.random() * emojis[emojiStyle].length)] : '';

  const templates = [
    `${themeWords[0]} ${toneData.style} ${bioPurpose} ${themeStyle}, mastering ${keywordArray.join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.energy}${emoji} on ${platform}. ${platformTag}`,
    `${toneData.vibe}-driven ${bioPurpose} ${themeStyle}, excelling as ${keywordArray[0] || 'expert'} ${locationPart}, crafting ${toneData.energy}${emoji} for ${platform}. ${platformTag}`,
    `${themeWords[1]} ${bioPurpose} pioneer ${themeStyle}, leading with ${keywordArray.slice(0, 2).join(' & ')} ${locationPart}, ${toneData.connector} ${toneData.vibe}${emoji} across ${platform}. ${platformTag}`
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
  try {
    const keywords = suggestKeywords(bioPurpose);
    res.json({ keywords });
  } catch (error) {
    console.error('Keyword Suggestion Error:', error);
    res.status(500).json({ error: 'Failed to suggest keywords. Please try again.' });
  }
});

// Bio generation route
app.post('/api/generate-bios', (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords, emojiStyle } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }
  try {
    const bios = generateBios(theme, bioPurpose, location, platform, tone, keywords, emojiStyle);
    if (!bios || bios.length < 3) throw new Error('Failed to generate sufficient bios');
    res.json({ bios });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate bios. Please try again later.' });
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
