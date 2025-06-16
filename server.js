const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const bioDatabase = {};
const userLimits = {};

function generateBio(purpose, location, platform, tone) {
  try {
    const platformSpecifics = {
      Instagram: { maxChars: 150, style: 'emojis, hashtags, casual CTA' },
      LinkedIn: { maxChars: 2000, style: 'professional, detailed, formal CTA' },
      TikTok: { maxChars: 80, style: 'emojis, short, trendy CTA' },
      Twitter: { maxChars: 160, style: 'witty, hashtags, casual CTA' }
    };
    const { maxChars, style } = platformSpecifics[platform] || { maxChars: 160, style: 'default' };
    let bio = '';
    switch (platform) {
      case 'Instagram':
        bio = `🌌 ${purpose} | ${location ? `${location} 📍` : ''} | DM for collabs! ✨ #${purpose.replace(/\s/g, '')}`;
        break;
      case 'LinkedIn':
        bio = `${purpose} Expert | Driving success with innovative strategies | ${location ? `${location} | ` : ''}Let’s connect! 💼 #${purpose.replace(/\s/g, '')}`;
        break;
      case 'TikTok':
        bio = `🎬 ${purpose} | ${tone === 'Excited' ? 'Vibes!' : 'Chill'} | Join me! 😎 #${purpose.replace(/\s/g, '')}`;
        break;
      case 'Twitter':
        bio = `${purpose} ${tone === 'Witty' ? '😎' : '😂'} | ${location ? `${location} | ` : ''}#${purpose.replace(/\s/g, '')}`;
        break;
      default:
        bio = `${purpose} | ${location ? `${location} | ` : ''}Created with SparkVibe!`;
    }
    if (tone !== 'Professional') {
      bio = bio.replace('Expert', tone === 'Luxury' ? 'Icon' : tone);
    }
    return bio.slice(0, maxChars);
  } catch (err) {
    console.error('Bio generation error:', err);
    return 'Error generating bio.';
  }
}

app.post('/generate-bio', (req, res) => {
  try {
    const { purpose, location, platform, tone, fingerprint } = req.body;
    if (!purpose || !platform || !tone || !fingerprint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const today = new Date().toISOString().split('T')[0];
    if (!userLimits[fingerprint]) {
      userLimits[fingerprint] = { date: today, count: 0 };
    }
    if (userLimits[fingerprint].date !== today) {
      userLimits[fingerprint].date = today;
      userLimits[fingerprint].count = 0;
    }
    if (userLimits[fingerprint].count >= 3) {
      return res.status(403).json({ error: 'Free tier limit reached (3 bios/day). Upgrade for unlimited bios!' });
    }
    userLimits[fingerprint].count++;
    const bio = generateBio(purpose, location, platform, tone);
    res.json({ bio });
  } catch (err) {
    console.error('Generate bio endpoint error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/save-bio', (req, res) => {
  try {
    const { email, bio } = req.body;
    if (!email || !bio) {
      return res.status(400).json({ error: 'Email and bio are required' });
    }
    bioDatabase[email] = bioDatabase[email] || [];
    bioDatabase[email].push(bio);
    res.json({ message: 'Bio saved successfully! You’ll receive premium updates.' });
  } catch (err) {
    console.error('Save bio endpoint error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
