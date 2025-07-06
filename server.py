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

# Initialize OpenAI client
openai_api_key = os.getenv('OPENAI_API_KEY')
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY not set")
client = OpenAI(api_key=openai_api_key)

# Initialize KeyBERT
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

@lru_cache(maxsize=100)
def extract_keywords(text):
    keywords = kw_model.extract_keywords(text.lower(), keyphrase_ngram_range=(1, 2), stop_words='english', top_n=10)
    return [kw[0] for kw in keywords] or ['pro', 'expert']

def generate_short_bios(theme, bio_purpose, location, platform, tone, keywords, emoji_style):
    char_limit = platform_context[platform]['limit']
    tone_data = tone_styles.get(tone.lower(), tone_styles['professional'])
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
        print(f"OpenAI Error: {e}")
        bios = []
        used_structures = set()
        target_length = char_limit * 0.9

        for _ in range(3):
            adj = random.choice(tone_data['adjectives']).capitalize()
            verb = random.choice(tone_data['verbs'])
            structure = random.choice([
                f"{adj} {bio_purpose}, {verb} {keywords} {platform_data['focus']} in {location_part}{emoji} {platform_data['hashtag']}",
                f"{bio_purpose}, {verb} {keywords} with {platform_data['style']} flair on {platform}{emoji} {platform_data['hashtag']}",
                f"{location_part}'s {bio_purpose}, {verb} {keywords} {tone_data['focus']}{emoji} {platform_data['hashtag']}"
            ])
            bio = re.sub(r'\s+', ' ', structure).strip()
            struct_key = (structure.split()[0], verb)

            if struct_key not in used_structures and len(bio) <= char_limit:
                used_structures.add(struct_key)
                bios.append({'text': bio, 'length': len(bio)})

        while len(bios) < 3:
            bio = f"{random.choice(tone_data['adjectives']).capitalize()} {bio_purpose}, {random.choice(tone_data['verbs'])} {keywords} in {location_part}{emoji} {platform_data['hashtag']}"
            bio = re.sub(r'\s+', ' ', bio).strip()[:char_limit]
            bios.append({'text': bio, 'length': len(bio)})
        return bios

@app.route('/api/suggest-keywords', methods=['POST'])
def suggest_keywords():
    data = request.get_json()
    bio_purpose = data.get('bioPurpose')
    if not bio_purpose:
        return jsonify({'error': 'Bio Purpose is required'}, 400)
    try:
        keywords = extract_keywords(bio_purpose)
        return jsonify({'keywords': keywords})
    except Exception as e:
        print(f"Keyword Error: {e}")
        return jsonify({'error': 'Failed to suggest keywords'}, 500)

@app.route('/api/generate-bios', methods=['POST'])
def generate_bios():
    data = request.get_json()
    required = ['theme', 'bioPurpose', 'platform', 'tone']
    if not all(data.get(field) for field in required):
        return jsonify({'error': 'All fields are required'}, 400)
    try:
        bios = generate_short_bios(
            data['theme'], data['bioPurpose'], data.get('location', ''),
            data['platform'], data['tone'], data.get('keywords', 'pro'),
            data.get('emojiStyle', 'without_emojis')
        )
        return jsonify({'shortBios': bios})
    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({'error': 'Failed to generate bios'}, 500)

@app.route('/api/current-date')
def current_date():
    return jsonify({'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')})

@app.route('/contact')
def contact():
    return send_from_directory('.', 'contact.html')

@app.route('/privacy')
def privacy():
    return send_from_directory('.', 'privacy.html')

@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))
