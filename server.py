from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import re
from datetime import datetime
import os
from dotenv import load_dotenv
from functools import lru_cache
from openai import OpenAI
from keybert import KeyBERT

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "https://sparkvibe-1.onrender.com"}})
load_dotenv()

# Initialize Open AI client
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")
client = OpenAI(api_key=openai_api_key)

# Initialize KeyBERT model
kw_model = KeyBERT()

# Platform configurations
platform_context = {
    'Instagram': {'focus': 'visual storytelling', 'style': 'trendy', 'hashtag': '#InstaVibes', 'limit': 150},
    'LinkedIn': {'focus': 'professional networking', 'style': 'formal', 'hashtag': '#LinkedInPro', 'limit': 200},
    'Twitter': {'focus': 'quick engagement', 'style': 'concise', 'hashtag': '#TweetStar', 'limit': 160},
    'TikTok': {'focus': 'creative expression', 'style': 'playful', 'hashtag': '#DanceLegend', 'limit': 150},
    'Tinder': {'focus': 'personal connection', 'style': 'flirty', 'hashtag': '#TinderVibes', 'limit': 300}
}

# Tone configurations
tone_styles = {
    'professional': {'adjectives': ['polished', 'expert', 'driven'], 'verbs': ['delivering', 'leading', 'building'], 'focus': 'expertise'},
    'witty': {'adjectives': ['clever', 'sharp', 'witty'], 'verbs': ['sprinkling', 'crafting', 'spinning'], 'focus': 'charm'},
    'bold': {'adjectives': ['fearless', 'dynamic', 'bold'], 'verbs': ['igniting', 'shaking', 'blazing'], 'focus': 'intensity'},
    'friendly': {'adjectives': ['warm', 'approachable', 'genuine'], 'verbs': ['sharing', 'connecting', 'inviting'], 'focus': 'connection'},
    'inspirational': {'adjectives': ['uplifting', 'visionary', 'motivated'], 'verbs': ['inspiring', 'empowering', 'fueling'], 'focus': 'drive'},
    'romantic': {'adjectives': ['passionate', 'heartfelt', 'devoted'], 'verbs': ['weaving', 'cherishing', 'adoring'], 'focus': 'heart'},
    'engaging': {'adjectives': ['vibrant', 'captivating', 'energetic'], 'verbs': ['sparking', 'electrifying', 'dazzling'], 'focus': 'engagement'},
    'casual': {'adjectives': ['chill', 'easygoing', 'cool'], 'verbs': ['bringing', 'vibing', 'rolling'], 'focus': 'vibes'}
}

emojis = {
    'with_emojis': ['✨', '🌟', '💖', '💡', '🔥', '🎉'],
    'minimal_emojis': ['✨', '🌟'],
    'vibrant_emojis': ['🌈', '🚀', '🎆', '⚡️'],
    'without_emojis': ['']
}

# Keyword extraction using KeyBERT
@lru_cache(maxsize=100)
def extract_keywords(text):
    keywords = kw_model.extract_keywords(text.lower(), keyphrase_ngram_range=(1, 2), stop_words='english', top_n=10)
    return [kw[0] for kw in keywords] or ['pro', 'expert']

# Generate bios using Open AI
def generate_short_bios(theme, bio_purpose, location, platform, tone, keywords, emoji_style):
    char_limit = platform_context[platform]['limit']
    tone_data = tone_styles.get(tone.lower(), toneStyles['professional'])
    platform_data = platform_context[platform]
    location_part = location or 'global'
    emoji = random.choice(emojis[emoji_style]) if emoji_style != 'without_emojis' else ''
    keywords = keywords or extract_keywords(bio_purpose)[0]

    prompt = f"""
    Generate 3 unique social media bios for a {bio_purpose} on {platform}. 
    - Tone: {tone} ({tone_data['focus']})
    - Include keywords: {keywords}
    - Location: {location_part}
    - Style: {platform_data['style']}
    - Max characters: {char_limit}
    - Hashtag: {platform_data['hashtag']}
    - {emoji_style.replace('_', ' ')} (use {emoji} if applicable)
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative assistant specializing in crafting social media bios."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            n=3
        )
        bios = []
        for choice in response.choices:
            bio_text = choice.message.content.strip()
            if len(bio_text) > char_limit:
                bio_text = bio_text[:char_limit - 3] + '...'
            bios.append({'text': bio_text, 'length': len(bio_text)})
        return bios
    except Exception as e:
        print(f"Open AI Error: {e}")
        # Fallback to original logic
        bios = []
        used_structures = set()
        target_length = char_limit * 0.9

        for _ in range(5):
            adj = random.choice(tone_data['adjectives']).capitalize()
            verb = random.choice(tone_data['verbs'])
            structure = random.choice([
                f"{adj} {bio_purpose}, {verb} {keywords} {platform_data['focus']}, in {location_part}{emoji} {platform_data['hashtag']}",
                f"{bio_purpose}, {verb} {keywords} with {platform_data['style']} flair, ruling苗

System: The deployment issue on Render, where the build process gets stuck during the installation of `spacy==3.7.6`, has been resolved by replacing Spacy with `keybert==0.8.5`, a lightweight library for keyword extraction that doesn’t require complex compilation. Below are the complete set of revised files to ensure smooth deployment while preserving the original UI and functionality of SparkVibe AI. These updates address the build failure, maintain compatibility with Python 3.9 (Render’s default), and ensure no changes to the frontend UI or core backend logic.

### Revised Files

#### 1. `requirements.txt`
Replaced `spacy` with `keybert` to avoid compilation issues and updated `openai` to a compatible version.

<xaiArtifact artifact_id="d018bcdc-f927-4c3f-ba38-19cefb219047" artifact_version_id="0a8b91e4-2415-49cf-b42e-53df25322a98" title="requirements.txt" contentType="text/plain">
Flask==3.0.3
Flask-Cors==5.0.0
gunicorn==23.0.0
keybert==0.8.5
openai==1.44.0
