SparkVibe AI
SparkVibe AI is a web application that generates SEO-optimized social media bios for Instagram, LinkedIn, Twitter, TikTok, and Tinder using Open AI's GPT-4o-mini model. It’s free to use, requires no login, and is trusted by over 50,000 creators. This guide explains how to deploy the project on Render using a zip folder, configure the Open AI API key, and test the tool to ensure it’s live.
Features

Platform-specific bios with character limits (e.g., 150 for Instagram, 160 for Twitter)
Custom tones (professional, witty, bold, friendly, inspirational, romantic, engaging, casual)
NLP-powered keyword suggestions using spaCy
Customizable themes (Cosmic Glow, Neon Pulse) and emoji styles
Optimized for Render deployment with Python 3.11

Prerequisites

Zip Folder: A zip file containing the project files (listed below).
Open AI API Key: Obtain from platform.openai.com.
Render Account: Sign up at render.com.
Local Environment (Optional): Python 3.11 and unzip for local testing (Render uses 3.11, not 3.13.4; see Render Python docs).
Browser and Postman (Optional): For testing the deployed app and API.

Project Files
Ensure your zip folder contains these files in the root directory:

.render.yaml: Configures Render for Python deployment.
requirements.txt: Lists Python dependencies.
server.py: Flask backend with Open AI and spaCy integration.
index.html: Main frontend page.
script.js: JavaScript for form handling and API calls.
styles.css: Tailwind-based styles.
contact.html: Contact page.
privacy.html: Privacy policy page.
manifest.json: PWA manifest.
LICENSE.txt: Commercial license.

Important: Do not include package.json or pyproject.toml, as they cause Render to misdetect the project as a Node.js or Poetry project, leading to build errors.
Setup Instructions
1. Prepare the Zip Folder

Verify Files:
Unzip the folder locally to confirm all listed files are present.
Ensure requirements.txt includes:Flask==3.0.3
flask-cors==5.0.0
gunicorn==23.0.0
spacy==3.7.6
python-dotenv==1.0.1
openai==1.51.2


Check .render.yaml specifies:services:
  - type: web
    name: sparkvibe
    env: python
    runtime: python-3.11
    buildCommand: pip install -r requirements.txt && python -m spacy download en_core_web_sm
    startCommand: gunicorn server:app
    plan: free
    numInstances: 1
    envVars:
      - key: PYTHONUNBUFFERED
        value: "1"
      - key: OPENAI_API_KEY
        sync: false




Re-zip the Folder:
Update any missing or incorrect files.
Create a new zip file (e.g., sparkvibe.zip) with all files in the root directory:zip -r sparkvibe.zip .render.yaml requirements.txt server.py index.html script.js styles.css contact.html privacy.html manifest.json LICENSE.txt





2. Obtain an Open AI API Key

Go to platform.openai.com and sign up or log in.
Navigate to the API section, click “Create new secret key,” and copy the key.
Store the key securely (you’ll need it for Render configuration).
Ensure your Open AI account has sufficient credits.

3. Deploy on Render

Log in to Render:
Sign in at render.com.


Create a Web Service:
Click “New” > “Web Service” in the Render dashboard.
Select “Upload a zip file” and upload sparkvibe.zip.


Configure the Service:
Name: Set to sparkvibe (or any preferred name).
Runtime: Select Python (critical to avoid Node.js or Poetry detection).
Region: Choose the closest region (e.g., Oregon for US users).
Build Command:pip install -r requirements.txt && python -m spacy download en_core_web_sm


Start Command:gunicorn server:app


Instance Type: Select Free (or a paid plan for better performance).


Set Environment Variables:
In the “Environment” section, add:
Key: OPENAI_API_KEY, Value: Your Open AI API key.
Key: PYTHONUNBUFFERED, Value: 1 (enables logging).




Deploy:
Click “Create Web Service” to start deployment.
Monitor the build logs in the Render dashboard.
Expect to see:
pip install -r requirements.txt installing dependencies.
python -m spacy download en_core_web_sm downloading the spaCy model.
No npm install or Poetry-related commands.


Note the deployed URL (e.g., https://sparkvibe.onrender.com).



4. Test Locally (Optional)
To test before deploying:

Install Python 3.11 locally.
Extract the zip folder:unzip sparkvibe.zip
cd sparkvibe


Install dependencies:pip install -r requirements.txt
python -m spacy download en_core_web_sm


Set the Open AI API key:
Create a .env file:OPENAI_API_KEY=your-openai-api-key


Or set it as an environment variable:export OPENAI_API_KEY=your-openai-api-key




Run the app:gunicorn server:app


Open http://localhost:10000 and test bio generation.

5. Test the Deployed Tool

Access the App:
Open the Render URL (e.g., https://sparkvibe.onrender.com) in a browser.


Generate Bios:
Select a theme (e.g., Cosmic Glow), platform (e.g., Instagram), tone (e.g., Professional), and emoji style (e.g., With Emojis).
Enter a bio purpose (e.g., “Dancing Coach”) and optional location (e.g., “New York”).
Click “Suggest Keywords” to see NLP suggestions (e.g., “dance”, “coach”).
Click “Forge My Stellar Bios” to generate three bios.
Verify bios:
Adhere to platform character limits (e.g., 150 for Instagram).
Include hashtags (e.g., #InstaVibes).
Reflect the selected tone and keywords.




Copy Bios:
Click the “Copy” button and paste into a text editor to confirm functionality.


Test Other Pages:
Visit /contact and /privacy to ensure they load.
Check the footer for the current date (via /api/current-date).


Test API Directly (Optional):
Use Postman to test the /api/generate-bios endpoint:POST https://<your-service>.onrender.com/api/generate-bios
Content-Type: application/json
{
  "theme": "cosmic_glow",
  "bioPurpose": "Dancing Coach",
  "platform": "Instagram",
  "tone": "professional",
  "emojiStyle": "with_emojis"
}


Expect a response like:{
  "shortBios": [
    {"text": "Polished Dancing Coach, leading dance expertise in New York✨ #InstaVibes", "length": 70},
    {"text": "Expert Dancing Coach, delivering vibrant moves in New York✨ #InstaVibes", "length": 72},
    {"text": "Driven Dancing Coach, building dance passion in New York✨ #InstaVibes", "length": 71}
  ]
}





6. Update CORS (If Needed)
If CORS errors appear in the browser console (F12 > Console):

Update server.py with your Render URL:CORS(app, resources={r"/api/*": {"origins": "https://<your-service>.onrender.com"}})


Re-zip the folder:zip -r sparkvibe.zip .render.yaml requirements.txt server.py index.html script.js styles.css contact.html privacy.html manifest.json LICENSE.txt


Re-upload in Render:
Go to your Web Service, click “Manual Deploy” > “Upload a new zip file,” and select sparkvibe.zip.
Redeploy and retest.



Troubleshooting

Build Hangs at “Installing build dependencies”:
Cause: Resource constraints or outdated spaCy version.
Fix: Ensure requirements.txt uses spacy==3.7.6. Consider upgrading to a paid Render tier for more resources. Check build logs for specific errors.


Poetry Detection Error:
Cause: Render detects a Poetry project due to a pyproject.toml file.
Fix: Ensure pyproject.toml is not in the zip folder. Use .render.yaml to enforce env: python.


Missing Dependencies:
Cause: requirements.txt is missing or incorrect.
Fix: Verify requirements.txt matches the provided content. Re-upload the zip file.


Open AI API Errors:
Cause: Invalid or missing OPENAI_API_KEY.
Fix: Check the key in Render’s “Environment” section. Verify it’s valid at platform.openai.com. Test with Postman.


CORS Issues:
Cause: Mismatched CORS settings.
Fix: Update server.py CORS (see step 6), re-zip, and redeploy.


404 or File Not Found:
Cause: Files are missing or in subfolders.
Fix: Ensure all files are in the zip folder’s root directory.



License
This project is under a commercial license. See LICENSE.txt for details.
Contact
For support, email support adarshmishraa121@gmail.com

Powered by STX Tech
