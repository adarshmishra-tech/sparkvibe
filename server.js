const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from Render secret file or fallback to local .env
const secretPath = '/etc/secrets/.env';
const result = dotenv.config({ path: secretPath });
if (result.error) {
  dotenv.config(); // fallback for local development
}

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
  windowMs: 60 * 1000, // 1 minute window
  max: 10,
  message: 'Too many requests, please try again later.',
});
app.use('/generate-bio', limiter);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/v1/chat/completions';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

console.log('API key loaded?', !!OPENROUTER_API_KEY); // Debug log

async function fetchBio(businessType, location, tone, platform) {
  const charLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
  const maxChars = charLimits[platform] || 150;
  const locationText = location ? ` located in ${location}` : '';

  console.log('Using API Key:', OPENROUTER_API_KEY ? '[REDACTED]' : 'NOT FOUND');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        OPENROUTER_URL,
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

      console.log('API response:', JSON.stringify(response.data, null, 2));
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error(`Attempt ${attempt} failed.`);

      if (error.response) {
        console.error('API error status:', error.response.status);
        console.error('API error headers:', error.response.headers);
        console.error('API error data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }

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
    return res.status(500).json({ bio: 'API key missing. Please configure your .env file or environment variables.' });
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





