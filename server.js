// server.js
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000', // Match Render URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current folder

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_fallback' // Fallback for local testing
});

// Keyword suggestion route
app.post('/api/suggest-keywords', async (req, res) => {
  const { bioPurpose } = req.body;
  if (!bioPurpose) {
    return res.status(400).json({ error: 'Bio Purpose is required for keyword suggestions.' });
  }

  try {
    const prompt = `Suggest 5 SEO-optimized keywords related to "${bioPurpose}" for a bio. Return as a comma-separated list (e.g., keyword1, keyword2, keyword3, keyword4, keyword5).`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.5,
      max_tokens: 50
    });
    const keywords = response.choices[0].message.content.trim();
    res.json({ keywords });
  } catch (error) {
    console.error('Keyword Suggestion Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to suggest keywords.' });
  }
});

// Bio generation route
app.post('/api/generate-bio', async (req, res) => {
  const { theme, bioPurpose, location, platform, tone, keywords } = req.body;

  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'Theme, Bio Purpose, Platform, and Tone are required.' });
  }

  try {
    const keywordStr = keywords ? ` Incorporate these keywords: ${keywords}.` : '';
    const prompt = `You are an expert SEO-optimized bio writer. Generate a ${platform === 'Instagram' ? '150' : '200'}-character bio with a ${tone} tone for a ${bioPurpose} theme. Include location: ${location || 'not specified'}${keywordStr} Optimize for SEO with relevant keywords, avoid clichés, and ensure it’s engaging.`;
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
    if (error.response && error.response.status === 401) {
      res.status(500).json({ error: 'Invalid OpenAI API key. Please verify your key in Render settings.' });
    } else {
      res.status(500).json({ error: 'Failed to generate bio. Check API key or try again later.' });
    }
  }
});

// Routes for contact and privacy
app.get('/contact', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Contact - SparkVibe AI</title><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="bg-gradient-to-b from-gold-100 to-purple-900 text-white">
      <div class="max-w-2xl mx-auto py-12 px-4"><h1 class="text-4xl font-bold text-gold-500 text-center">Contact Us</h1><p class="mt-4 text-lg text-gray-200 text-center">Reach out at support@sparkvibe.ai</p><a href="/" class="block mt-4 text-neon-purple hover:text-gold-500 text-center">Back to Home</a></div>
    </body>
    </html>
  `);
});

app.get('/privacy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Privacy Policy - SparkVibe AI</title><script src="https://cdn.tailwindcss.com"></script></head>
    <body class="bg-gradient-to-b from-gold-100 to-purple-900 text-white">
      <div class="max-w-2xl mx-auto py-12 px-4"><h1 class="text-4xl font-bold text-gold-500 text-center">Privacy Policy</h1><p class="mt-4 text-lg text-gray-200 text-center">Your data is safe. Free forever, no storage.</p><a href="/" class="block mt-4 text-neon-purple hover:text-gold-500 text-center">Back to Home</a></div>
    </body>
    </html>
  `);
});

// Dynamic date display
app.get('/api/current-date', (req, res) => {
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu', hour12: true });
  res.json({ date });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} | SparkVibe AI - Free Forever!`);
});
