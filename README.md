🌟 SparkVibe AI
SparkVibe AI is a creative web app that helps you generate SEO-optimized bios for social platforms like Instagram, LinkedIn, Twitter, TikTok, and even Tinder — using OpenAI's GPT-4o-mini.

No login required

100% free to use

Loved by 50,000+ users

✨ Features
✅ Generate bios based on platform + tone
✅ Supports character limits for each platform
✅ Suggests keywords using spaCy NLP
✅ Add emojis, themes, and location for personalization
✅ Mobile-friendly and fast

🧰 What You Need Before You Start
Requirement	Use
Python 3.11+	Runs the backend (Flask app)
Git	To clone the repo
OpenAI API Key	Needed for generating bios (Get it here)
Render (optional)	For free cloud hosting (render.com)

⚙️ Setup Guide (Local & Online)
✅ Option A: Run SparkVibe on Your Computer (Local)
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/adarshmishra-tech/sparkvibe.git
cd sparkvibe
2. Install Python Dependencies
bash
Copy
Edit
pip install -r requirements.txt
python -m spacy download en_core_web_sm
3. Add Your OpenAI Key
Create a file called .env in the root directory:

env
Copy
Edit
OPENAI_API_KEY=your-openai-api-key-here
4. Start the App
bash
Copy
Edit
gunicorn server:app
Your app will be available at:
http://localhost:10000

🌐 Option B: Deploy SparkVibe to the Web (with Render)
1. Push Your Code to GitHub (if not already)
bash
Copy
Edit
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sparkvibe.git
git push -u origin main
2. Set Up on Render
Go to render.com and log in

Click New → Web Service

Connect your GitHub repo

Configure as:

Setting	Value
Runtime	Python
Build Command	pip install -r requirements.txt && python -m spacy download en_core_web_sm
Start Command	gunicorn server:app
Environment Vars	OPENAI_API_KEY=your-openai-api-key-here

Once deployed, access your live app at:
https://your-app-name.onrender.com

💡 How to Use SparkVibe
Open the app (locally or online)

Choose:

A platform (e.g., LinkedIn)

A tone (e.g., Professional, Witty)

A theme and emoji style

Enter your bio purpose (e.g., “Marketing Specialist”)

Add optional keywords or location

Click “Suggest Keywords” (uses NLP)

Click “Forge My Stellar Bios”

Copy the one you like most 🚀

🛠️ Troubleshooting
Problem	Solution
App doesn’t start	Make sure .env is set with your OpenAI key
403 / 429 errors	Check OpenAI credits or key permissions
Render build fails	Check logs, make sure spaCy model is downloading
CORS error on deployed app	Update server.py CORS line with correct domain
Nothing happens on button	Open browser dev tools → Console → Check errors

📂 Folder Structure (for reference)
bash
Copy
Edit
sparkvibe/
├── server.py            # Flask backend
├── index.html           # Frontend UI
├── script.js            # Frontend logic
├── styles.css           # Styling
├── requirements.txt     # Python packages
├── .env                 # Your API key (not committed)
├── .render.yaml         # Render deployment settings
├── contact.html         # Extra pages
├── privacy.html         # Privacy page
├── manifest.json        # PWA manifest
📣 Final Notes
You can change the theme, colors, or tone presets in script.js or index.html

You can also plug in your own API (Claude, Gemini, etc.) by editing server.py

Great for dev portfolios, client projects, or personal tools

