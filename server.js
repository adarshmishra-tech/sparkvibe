const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('.')); // Serve static files from root
app.use(express.json());

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Toggle for mock response (set to true to bypass OpenAI API for testing)
const USE_MOCK_RESPONSE = false;

// Route to generate bio
app.post('/generate-bio', async (req, res) => {
  try {
    const { bioPurpose, location, tone, platform } = req.body;

    // Validate request body
    if (!bioPurpose || !platform) {
      console.warn('Invalid request: bioPurpose or platform missing', req.body);
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

    // Construct the prompt
    const prompt = `Generate a ${tone} bio for ${platform} with the purpose of "${bioPurpose}"${location ? `, based in ${location}` : ''}. Keep it under ${maxLength} characters, SEO-optimized, and engaging.`;

    let bio;

    if (USE_MOCK_RESPONSE) {
      // Mock response for testing
      console.log('Using mock response for /generate-bio');
      bio = `${bioPurpose} | ${tone.charAt(0).toUpperCase() + tone.slice(1)} & Engaging${location ? ` | Based in ${location}` : ''} | #${platform}`;
    } else {
      // Call OpenAI API
      console.log('Calling OpenAI API with prompt:', prompt);
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Fallback to a more stable model (as of May 2025)
        messages: [
          { role: 'system', content: 'You are a professional bio writer specializing in SEO-optimized social media bios.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: Math.ceil(maxLength / 4), // Approximate tokens for character limit
        temperature: 0.7, // Balanced creativity
      });

      // Extract the generated bio
      bio = response.choices[0]?.message?.content?.trim();
      if (!bio) {
        throw new Error('No bio generated from OpenAI response');
      }

      console.log('OpenAI API response:', bio);
    }

    // Ensure bio is within character limit
    const finalBio = bio.length > maxLength ? bio.substring(0, maxLength - 3) + '...' : bio;

    // Send success response
    res.status(200).json({ bio: finalBio });
  } catch (error) {
    // Log detailed error information
    console.error('Error in /generate-bio:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data || 'No response data',
      status: error.response?.status,
    });

    // Send detailed error response
    let errorMessage = 'Failed to generate bio';
    if (error.message.includes('api key')) {
      errorMessage += ': Invalid or missing API key. Please check your OPENAI_API_KEY.';
    } else if (error.message.includes('model')) {
      errorMessage += ': Model not available. Please check the model name or your API permissions.';
    } else {
      errorMessage += `: ${error.message}`;
    }

    res.status(500).json({
      error: errorMessage,
      details: error.response?.data || 'No additional details available',
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
