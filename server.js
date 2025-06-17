// server.js
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const session = require('express-session');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(express.static(__dirname)); // Serve static files from current folder

// OpenAI & Stripe Setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// In-memory user session tracking
const userSessions = new Map();

// Bio generation route
app.post('/api/generate-bio', async (req, res) => {
  const { name, role, industry, tone, platform, length } = req.body;
  const sessionId = req.session.id;

  // Initialize user session if not exists
  if (!userSessions.has(sessionId)) {
    userSessions.set(sessionId, { plan: 'free', biosToday: [], premium: false });
  }
  const user = userSessions.get(sessionId);

  // Check bio limit for free plan (3 bios/day)
  if (user.plan === 'free') {
    const today = new Date().toDateString();
    user.biosToday = user.biosToday.filter(b => b.date === today);
    if (user.biosToday.length >= 3) {
      return res.status(403).json({ error: 'Free plan limit reached. Upgrade to Premium!' });
    }
  }

  try {
    const prompt = `You are an expert bio writer. Generate a ${length}-word ${platform} bio for ${name}, a ${role} in ${industry}. Highlight leadership and innovation with a ${tone} tone. Ensure it’s concise, engaging, and platform-optimized. Avoid clichés.`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.8,
    });

    const bio = response.choices[0].message.content;

    // Update session for free plan
    if (user.plan === 'free') {
      user.biosToday.push({ date: new Date().toDateString(), bio });
    }

    res.json({ bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate bio' });
  }
});

// Stripe checkout for premium
app.post('/api/create-checkout-session', async (req, res) => {
  const sessionId = req.session.id;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID, // Set in Stripe dashboard
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/?cancel=true`,
    });

    // Mark user as premium (in-memory)
    userSessions.set(sessionId, { ...userSessions.get(sessionId), plan: 'premium', premium: true });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create checkout session' });
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
    <body class="bg-blue-50">
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold text-gray-800 text-center">Contact Us</h1>
        <p class="mt-4 text-lg text-gray-600 text-center">Reach out at support@sparkvibe.ai</p>
        <a href="/" class="block mt-4 text-blue-600 hover:underline text-center">Back to Home</a>
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
    <body class="bg-blue-50">
      <div class="max-w-4xl mx-auto py-12 px-4">
        <h1 class="text-4xl font-bold text-gray-800 text-center">Privacy Policy</h1>
        <p class="mt-4 text-lg text-gray-600 text-center">Your data is safe with us. We only store session data temporarily to enhance your experience.</p>
        <a href="/" class="block mt-4 text-blue-600 hover:underline text-center">Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
