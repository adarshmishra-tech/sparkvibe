const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from root (adjust if using /public)
app.use(express.static(path.join(__dirname, '.')));

// Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
});
app.use('/generate-bio', limiter);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

console.log('API key loaded?', !!OPENROUTER_API_KEY); // Debug log

async function fetchBio(businessType, location, tone, platform) {
  const charLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
  const maxChars = charLimits[platform] || 150;
  const locationText = location ? ` located in ${location}` : '';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Write a professional and ${tone} ${platform} bio for a ${businessType} business${locationText}. Keep it under ${maxChars} characters. Include emojis and 1-2 relevant hashtags for engagement.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sparkvibe-pi5u.onrender.com',
            'X-Title': 'SparkVibe',
          },
          timeout: 10000,
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw new Error(`API error after ${MAX_RETRIES} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

app.post('/generate-bio', async (req, res) => {
  const { businessType, location, tone, platform } = req.body;

  if (!OPENROUTER_API_KEY) {
    console.error('Missing API key in environment variables.');
    return res.status(500).json({ bio: 'API key missing. Please configure your .env file.' });
  }

  try {
    const bio = await fetchBio(businessType, location, tone, platform);
    res.json({ bio });
  } catch (error) {
    console.error('Error generating bio:', error.message);
    res.status(500).json({ bio: 'Error generating bio. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at https://sparkvibe-pi5u.onrender.com`);
});


