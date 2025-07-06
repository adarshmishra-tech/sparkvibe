const express = require('express');
const cors = require('cors');
const keywordExtractor = require('keyword-extractor');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'https://sparkvibe-1-5s4s.onrender.com' }));
app.use(express.json());
app.use(express.static('.'));

const platformContext = {
  Instagram: { focus: 'visual storytelling', style: 'trendy', hashtag: '#InstaVibes', limit: 150 },
  LinkedIn: { focus: 'professional networking', style: 'formal', hashtag: '#LinkedInPro', limit: 200 },
  Twitter: { focus: 'quick engagement', style: 'concise', hashtag: '#TweetStar', limit: 160 },
  TikTok: { focus: 'creative expression', style: 'playful', hashtag: '#DanceLegend', limit: 150 },
  Tinder: { focus: 'personal connection', style: 'flirty', hashtag: '#TinderVibes', limit: 300 }
};

const toneStyles = {
  professional: { adjectives: ['polished', 'expert', 'driven'], verbs: ['delivering', 'leading', 'building'], focus: 'expertise' },
  witty: { adjectives: ['clever', 'sharp', 'witty'], verbs: ['sprinkling', 'crafting', 'spinning'], focus: 'charm' },
  bold: { adjectives: ['fearless', 'dynamic', 'bold'], verbs: ['igniting', 'shaking', 'blazing'], focus: 'intensity' },
  friendly: { adjectives: ['warm', 'approachable', 'genuine'], verbs: ['sharing', 'connecting', 'inviting'], focus: 'connection' },
  inspirational: { adjectives: ['uplifting', 'visionary', 'motivated'], verbs: ['inspiring', 'empowering', 'fueling'], focus: 'drive' },
  romantic: { adjectives: ['passionate', 'heartfelt', 'devoted'], verbs: ['weaving', 'cherishing', 'adoring'], focus: 'heart' },
  engaging: { adjectives: ['vibrant', 'captivating', 'energetic'], verbs: ['sparking', 'electrifying', 'dazzling'], focus: 'engagement' },
  casual: { adjectives: ['chill', 'easygoing', 'cool'], verbs: ['bringing', 'vibing', 'rolling'], focus: 'vibes' }
};

const emojis = {
  with_emojis: ['✨', '🌟', '💖', '💡', '🔥', '🎉'],
  minimal_emojis: ['✨', '🌟'],
  vibrant_emojis: ['🌈', '🚀', '🎆', '⚡️'],
  without_emojis: ['']
};

function extractKeywords(text) {
  const extraction = keywordExtractor.extract(text.toLowerCase(), {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true
  });
  return extraction.length > 0 ? extraction.slice(0, 10) : ['pro', 'expert'];
}

function generateShortBios(theme, bioPurpose, location, platform, tone, keywords, emojiStyle) {
  const charLimit = platformContext[platform].limit;
  const toneData = toneStyles[tone.toLowerCase()] || toneStyles.professional;
  const platformData = platformContext[platform];
  const locationPart = location || 'global';
  const emoji = emojiStyle !== 'without_emojis' ? emojis[emojiStyle][Math.floor(Math.random() * emojis[emojiStyle].length)] : '';
  const selectedKeyword = keywords || extractKeywords(bioPurpose)[0];

  const bios = [];
  const usedStructures = new Set();
  const targetLength = charLimit * 0.9;

  for (let i = 0; i < 5 && bios.length < 3; i++) {
    const adj = toneData.adjectives[Math.floor(Math.random() * toneData.adjectives.length)].replace(/^\w/, c => c.toUpperCase());
    const verb = toneData.verbs[Math.floor(Math.random() * toneData.verbs.length)];
    const structures = [
      `${adj} ${bioPurpose}, ${verb} ${selectedKeyword} ${platformData.focus} in ${locationPart}${emoji} ${platformData.hashtag}`,
      `${bioPurpose}, ${verb} ${selectedKeyword} with ${platformData.style} flair on ${platform}${emoji} ${platformData.hashtag}`,
      `${locationPart}'s ${bioPurpose}, ${verb} ${selectedKeyword} ${toneData.focus}${emoji} ${platformData.hashtag}`
    ];
    const structure = structures[Math.floor(Math.random() * structures.length)];
    const bio = structure.replace(/\s+/g, ' ').trim();
    const structKey = `${structure.split(' ')[0]}-${verb}`;

    if (!usedStructures.has(structKey) && bio.length <= charLimit) {
      usedStructures.add(structKey);
      bios.push({ text: bio, length: bio.length });
    }
  }

  while (bios.length < 3) {
    const bio = `${toneData.adjectives[Math.floor(Math.random() * toneData.adjectives.length)].replace(/^\w/, c => c.toUpperCase())} ${bioPurpose}, ${toneData.verbs[Math.floor(Math.random() * toneData.verbs.length)]} ${selectedKeyword} in ${locationPart}${emoji} ${platformData.hashtag}`.replace(/\s+/g, ' ').trim().slice(0, charLimit);
    bios.push({ text: bio, length: bio.length });
  }

  return bios;
}

// Comment out OpenAI client initialization for showcase deployment
// To enable OpenAI API:
// 1. Uncomment the OpenAI import below
// 2. Uncomment the line below and set OPENAI_API_KEY in Render's environment variables
// 3. Add "openai": "4.68.1" to package.json dependencies
/*
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not set');
}
*/

app.post('/api/suggest-keywords', async (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Bio Purpose is required' });
  try {
    const keywords = extractKeywords(bioPurpose);
    res.json({ keywords });
  } catch (error) {
    console.error('Keyword Error:', error);
    res.status(500).json({ error: 'Failed to suggest keywords' });
  }
});

app.post('/api/generate-bios', async (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords, emojiStyle } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) return res.status(400).json({ error: 'All fields are required' });
  try {
    const bios = generateShortBios(theme, bioPurpose, location || '', platform, tone, keywords || 'pro', emojiStyle || 'with_emojis');
    res.json({ shortBios: bios });
  } catch (error) {
    console.error('Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate bios' });
  }
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'All fields are required' });
  // Simulate contact submission
  res.json({ message: 'Thank you for your message! We will get back to you soon.' });
});

app.get('/api/current-date', (req, res) => {
  res.json({ date: new Date().toISOString().slice(0, 19).replace('T', ' ') });
});

app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, 'privacy.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}`));
