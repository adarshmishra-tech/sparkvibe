markdown

Collapse

Wrap

Copy
# SparkVibe AI

SparkVibe AI generates SEO-optimized social media bios for Instagram, LinkedIn, Twitter, TikTok, and Tinder using Open AI's GPT-4o-mini model. It’s free to use, requires no login, and is trusted by over 50,000 creators.

## Features
- Platform-specific bios with character limits
- Custom tones (professional, witty, bold, etc.)
- NLP-powered keyword suggestions via spaCy
- Customizable themes and emoji styles
- Optimized for Render deployment

## Prerequisites
- Python 3.11 (Render does not support 3.13.4; see [Render Python docs](https://render.com/docs/python-version))
- Open AI API key ([platform.openai.com](https://platform.openai.com))
- Render account ([render.com](https://render.com))
- Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd sparkvibe
2. Install Dependencies
Install Python dependencies:

bash

Collapse

Wrap

Run

Copy
pip install -r requirements.txt
Download the spaCy model:

bash

Collapse

Wrap

Run

Copy
python -m spacy download en_core_web_sm
3. Configure Open AI API Key
Sign up at platform.openai.com and get an API key.
Create a .env file in the project root:
env

Collapse

Wrap

Copy
OPENAI_API_KEY=your-openai-api-key
Or set it as an environment variable:
bash

Collapse

Wrap

Run

Copy
export OPENAI_API_KEY=your-openai-api-key
4. Run Locally
Start the Flask server:

bash

Collapse

Wrap

Run

Copy
gunicorn server:app
Access at http://localhost:10000.

5. Deploy to Render
Remove Node.js Artifacts: Ensure package.json is deleted:
bash

Collapse

Wrap

Run

Copy
rm package.json
git rm package.json
git commit -m "Remove package.json to fix Node.js error"
git push origin main
Create a Web Service:
Go to render.com and create a new Web Service.
Connect your repository and select the branch (e.g., main).
Configure the Service:
Runtime: Python
Build Command: pip install -r requirements.txt && python -m spacy download en_core_web_sm
Start Command: gunicorn server:app
Environment Variables:
OPENAI_API_KEY: Your Open AI API key
PYTHONUNBUFFERED: 1
Deploy:
Click "Deploy" and monitor the build logs.
Access the app at https://<your-service>.onrender.com.
Using SparkVibe
Open the app in a browser.
Select a theme, platform, tone, and emoji style.
Enter a bio purpose (e.g., "Dancing Coach") and optional location/keywords.
Click "Suggest Keywords" for NLP suggestions.
Click "Forge My Stellar Bios" to generate bios.
Copy bios to your clipboard.
Troubleshooting
EINTEGRITY Error: Ensure package.json is removed, and .render.yaml specifies runtime: python-3.11.
Build Fails: Check Render logs (/opt/render/.cache/_logs/). Verify OPENAI_API_KEY and internet access for spaCy model download.
API Errors: Confirm your Open AI API key is valid and has credits. Test with a small request via Postman:
json

Collapse

Wrap

Copy
POST https://<your-service>.onrender.com/api/generate-bios
{
  "theme": "cosmic_glow",
  "bioPurpose": "Dancing Coach",
  "platform": "Instagram",
  "tone": "professional",
  "emojiStyle": "with_emojis"
}
CORS Issues: Update server.py CORS to https://<your-service>.onrender.com.
License
This project is under a commercial license. See LICENSE.txt for details.

Contact
Email support@sparkvibe.ai for support.

Powered by STX Tech
