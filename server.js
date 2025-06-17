// server.js
const express = require('express');
const OpenAI = require('openai');
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

// OpenAI Setup with Validation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_fallback'
});
let apiQuotaChecked = false;

const checkApiQuota = async () => {
  if (apiQuotaChecked) return true;
  try {
    await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: 'Ping' }],
      max_tokens: 1
    });
    apiQuotaChecked = true;
    return true;
  } catch (error) {
    console.error('API Quota Check Error:', error.response ? error.response.data : error.message);
    return false;
  }
};

// Keyword suggestion route
app.post('/api/suggest-keywords', async (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) return res.status(400).json({ error: 'Bio Purpose is required.' });

  if (!(await checkApiQuota())) {
    return res.status(503).json({ error: 'API quota exceeded or key invalid. Please check your OpenAI plan.' });
  }

  try {
    const prompt = `Suggest 5 SEO-optimized keywords for "${bioPurpose}". Return as a comma-separated list.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.5,
      max_tokens: 50
    });
    const keywords = response.choices[0].message.content.trim();
    res.json({ keywords });
  } catch (error) {
    console.error('Keyword Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to suggest keywords. Check API key or plan.' });
  }
});

// Bio generation route
app.post('/api/generate-bio', async (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords } = req.body;
  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }

  if (!(await checkApiQuota())) {
    return res.status(503).json({ error: 'API quota exceeded or key invalid. Please check your OpenAI plan.' });
  }

  try {
    const keywordStr = keywords ? ` Incorporate these keywords: ${keywords}.` : '';
    const charLimit = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150 }[platform] || 200;
    const prompt = `Generate a ${charLimit}-character SEO-optimized bio with a ${tone} tone for ${bioPurpose}. Include location: ${location || 'not specified'}${keywordStr}. Use relevant keywords, avoid clichés, and keep it engaging.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });
    const bio = response.choices[0].message.content.trim();
    res.json({ bio, characters: bio.length });
  } catch (error) {
    console.error('Bio Generation Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'API quota exceeded. Please add credits to your OpenAI plan.' });
    } else if (error.response && error.response.status === 401) {
      res.status(401).json({ error: 'Invalid API key. Verify it in Render settings.' });
    } else {
      res.status(500).json({ error: 'Failed to generate bio. Try again later.' });
    }
  }
});

// Contact and Privacy
app.get('/contact', (req, res) => res.sendFile(__dirname + '/contact.html'));
app.get('/privacy', (req, res) => res.sendFile(__dirname + '/contact.html'));

// Dynamic date
app.get('/api/current-date', (req, res) => {
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu', hour12: true });
  res.json({ date });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} | SparkVibe AI - Free Forever!`);
});
