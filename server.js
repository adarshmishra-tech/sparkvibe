const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to serve static files and parse JSON
app.use(express.static('.')); // Serve files from root directory
app.use(express.json());

// Initialize OpenAI with API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to generate bio
app.post('/generate-bio', async (req, res) => {
  try {
    const { bioPurpose, location, tone, platform } = req.body;

    // Validate request body
    if (!bioPurpose || !platform) {
      return res.status(400).json({ error: 'bioPurpose and platform are required' });
    }

    // Define platform-specific character limits
    const platformCharLimits = {
      Instagram: 150,
      LinkedIn: 2000,
      TikTok: 80,
      Twitter: 160
    };
    const maxLength = platformCharLimits[platform] || 150;

    // Construct the prompt for OpenAI
    const prompt = `Generate a ${tone} bio for ${platform} with the purpose of "${bioPurpose}"${location ? `, based in ${location}` : ''}. Keep it under ${maxLength} characters, SEO-optimized, and engaging.`;

    // Call OpenAI API (using latest API standards as of May 2025)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Use a model available as of May 2025
      messages: [
        { role: 'system', content: 'You are a professional bio writer specializing in SEO-optimized social media bios.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: Math.ceil(maxLength / 4), // Approximate tokens for character limit
      temperature: 0.7, // Balanced creativity
    });

    // Extract the generated bio
    const bio = response.choices[0]?.message?.content?.trim();
    if (!bio) {
      throw new Error('No bio generated from OpenAI response');
    }

    // Ensure bio is within character limit
    const finalBio = bio.length > maxLength ? bio.substring(0, maxLength - 3) + '...' : bio;

    // Send success response
    res.status(200).json({ bio: finalBio });
  } catch (error) {
    // Log the error for debugging
    console.error('Error in /generate-bio:', error.message, error.stack);
    // Send detailed error response
    res.status(500).json({
      error: `Failed to generate bio: ${error.message}`,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
