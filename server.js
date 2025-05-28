const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'https://*.onrender.com' }));
app.use(express.json());
app.use(express.static('.')); // Serve files from root directory

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.post('/generate-bio', async (req, res) => {
  const { bioPurpose, location, tone, platform } = req.body;
  const platformCharLimits = {
    Instagram: 150,
    LinkedIn: 2000,
    TikTok: 80,
    Twitter: 160
  };
  const maxChars = platformCharLimits[platform] || 150;

  const prompt = `Generate a ${tone.toLowerCase()} bio for a ${platform} profile. The bio should be optimized for SEO, including relevant keywords for ${bioPurpose} (e.g., "${bioPurpose} expert", "${bioPurpose} professional"). ${location ? `Incorporate the location: ${location}.` : ''} Keep it under ${maxChars} characters.`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.ceil(maxChars / 4),
      temperature: 0.7,
    });

    const bio = response.data.choices[0].message.content.trim();
    res.json({ bio });
  } catch (error) {
    console.error('Error generating bio:', error.message);
    res.status(500).json({ error: 'Failed to generate bio' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





