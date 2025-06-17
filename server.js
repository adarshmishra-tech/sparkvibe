// server.js
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5000', // Allow specific origin
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current folder

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your_openai_api_key_fallback' // Fallback for local testing
});

// Bio generation route
app.post('/api/generate-bio', async (req, res) => {
  const { theme, bioPurpose, location, platform, tone } = req.body;

  if (!theme || !bioPurpose || !platform || !tone) {
    return res.status(400).json({ error: 'All fields (Theme, Bio Purpose, Platform, Tone) are required.' });
  }

  try {
    const prompt = `You are an expert SEO-optimized bio writer. Generate a ${platform === 'Instagram' ? '150' : '200'}-character bio with a ${tone} tone for a ${bioPurpose} theme. Include location: ${location || 'not specified'} and optimize for SEO with relevant keywords. Avoid clichés and ensure it’s engaging.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const bio = response.choices[0].message.content.trim();
    res.json({ bio, characters: bio.length });
  } catch (error) {
    console.error('OpenAI API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to generate bio. Please check your API key or try again later.' });
  }
});

// Routes for contact and privacy
app.get('/contact', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact - SparkVibe AI</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-b from-gray-900 to-black text-white">
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold text-neon-blue text-center">Contact Us</h1>
        <p class="mt-4 text-lg text-gray-300 text-center">Reach out at support@sparkvibe.ai</p>
        <a href="/" class="block mt-4 text-neon-purple hover:underline text-center">Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/privacy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Privacy Policy - SparkVibe AI</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-b from-gray-900 to-black text-white">
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold text-neon-blue text-center">Privacy Policy</h1>
        <p class="mt-4 text-lg text-gray-300 text-center">Your data is safe with us. No storage, free forever.</p>
        <a href="/" class="block mt-4 text-neon-purple hover:underline text-center">Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

// Dynamic date display route
app.get('/api/current-date', (req, res) => {
  const date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu', hour12: true });
  res.json({ date });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} | SparkVibe AI - Free Forever!`);
});
