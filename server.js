const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('.'));
app.use(express.json());
app.use(cors());

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory storage for saved bios (replace with database in production)
const savedBios = [];

app.post('/generate-bio', async (req, res) => {
  try {
    const { bioPurpose, location, tone, platform } = req.body;

    if (!bioPurpose || !platform) {
      return res.status(400).json({ error: 'bioPurpose and platform are required' });
    }

    const platformCharLimits = {
      Instagram: 150,
      LinkedIn: 2000,
      TikTok: 80,
      Twitter: 160
    };
    const maxLength = platformCharLimits[platform] || 150;

    const prompt = `Generate a ${tone} bio for ${platform} with the purpose of "${bioPurpose}"${location ? `, based in ${location}` : ''}. Keep it under ${maxLength} characters, SEO-optimized, and engaging.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional bio writer specializing in SEO-optimized social media bios.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: Math.ceil(maxLength / 4),
      temperature: 0.7,
    });

    const bio = response.choices[0]?.message?.content?.trim();
    if (!bio) {
      throw new Error('No bio generated from OpenAI response');
    }

    const finalBio = bio.length > maxLength ? bio.substring(0, maxLength - 3) + '...' : bio;
    res.status(200).json({ bio: finalBio });
  } catch (error) {
    console.error('Error in /generate-bio:', error);
    res.status(500).json({ error: `Failed to generate bio: ${error.message}` });
  }
});

// Save Bio Endpoint
app.post('/save-bio', async (req, res) => {
  try {
    const { email, bio, platform } = req.body;
    if (!email || !bio || !platform) {
      return res.status(400).json({ error: 'Email, bio, and platform are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Store bio (in-memory for demo; use database in production)
    savedBios.push({ email, bio, platform, timestamp: new Date() });
    res.status(200).json({ message: 'Bio saved successfully' });
  } catch (error) {
    console.error('Error in /save-bio:', error);
    res.status(500).json({ error: `Failed to save bio: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
