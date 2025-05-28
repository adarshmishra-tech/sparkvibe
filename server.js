const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai'); // ✅ latest SDK

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://sparkvibe-1.onrender.com', 'http://localhost:3000']
}));
app.use(express.json());
app.use(express.static('.'));

// ✅ Setup OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.post('/generate-bio', async (req, res) => {
  const { bioPurpose, location, tone, platform } = req.body;

  if (!bioPurpose || typeof bioPurpose !== 'string' || bioPurpose.trim().length < 1) {
    return res.status(400).json({ error: 'Bio purpose is required' });
  }

  const platformCharLimits = {
    Instagram: 150,
    LinkedIn: 2000,
    TikTok: 80,
    Twitter: 160
  };

  const maxChars = platformCharLimits[platform] || 150;

  const prompt = `Generate a ${tone?.toLowerCase() || 'professional'} bio for a ${platform || 'social media'} profile. The bio should be optimized for SEO, include relevant keywords for ${bioPurpose}. ${location ? `Include location: ${location}.` : ''} Keep it under ${maxChars} characters. Add 1-2 emojis and hashtags.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.ceil(maxChars / 3),
      temperature: 1.0,
    });

    const bio = response.choices[0].message.content.trim();
    res.json({ bio });
  } catch (error) {
    console.error('Error generating bio:', error.message, error.response?.data);
    const message = error.response?.status === 401
      ? 'Invalid API key. Check your .env or Render secrets.'
      : error.message || 'Something went wrong.';
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
