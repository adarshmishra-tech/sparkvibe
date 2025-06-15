const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Redis client for rate limiting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key-here';
const openaiConfig = {
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

// Rate limiting middleware
const rateLimit = async (req, res, next) => {
  const clientId = req.headers['x-client-id'] || req.ip;
  const key = `rate-limit:${clientId}`;
  const current = await redis.get(key);
  const count = parseInt(current) || 0;

  if (count >= 3) {
    return res.status(429).json({ error: 'Daily limit of 3 free bios reached. Upgrade to Elite or Diamond.' });
  }

  await redis.incr(key);
  if (count === 0) {
    await redis.expire(key, 24 * 60 * 60); // 24 hours TTL
  }

  next();
};

// Generate bio endpoint
app.post('/generate-bio', rateLimit, async (req, res) => {
  const { bioPurpose, location, tone, platform } = req.body;
  if (!bioPurpose || !platform) {
    return res.status(400).json({ error: 'Bio purpose and platform are required.' });
  }

  let model = 'gpt-3.5-turbo';
  let maxTokens = 150;

  // Placeholder for user tier detection (implement with authentication)
  const userTier = 'free'; // Replace with actual user tier logic (e.g., JWT)

  if (userTier === 'elite') {
    model = 'gpt-4-turbo';
    maxTokens = 300;
  } else if (userTier === 'diamond') {
    model = 'gpt-4o';
    maxTokens = 500;
  }

  const platformCharLimits = {
    Instagram: 150,
    LinkedIn: 2000,
    TikTok: 80,
    Twitter: 160
  };

  const prompt = `
    Generate a ${tone} bio for ${platform} with the purpose of ${bioPurpose}.
    ${location ? `Include location: ${location}.` : ''}
    Ensure the bio is SEO-optimized, engaging, and within ${platformCharLimits[platform]} characters.
  `;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7
    }, openaiConfig);

    const bio = response.data.choices[0].message.content.trim();
    res.json({ bio });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ error: 'Failed to generate bio.' });
  }
});

// Save bio endpoint
app.post('/save-bio', async (req, res) => {
  const { email, bio, platform } = req.body;
  if (!email || !bio || !platform) {
    return res.status(400).json({ error: 'Email, bio, and platform are required.' });
  }

  // Placeholder for email service integration (e.g., SendGrid)
  console.log(`Saving bio for ${email}: ${bio} (${platform})`);
  res.json({
