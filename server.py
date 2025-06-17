from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import re
import spacy
from datetime import datetime
import os
from dotenv import load_dotenv
from functools import lru_cache

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "https://sparkvibe-1.onrender.com"}})
load_dotenv()

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Platform configurations
platform_context = {
    'Instagram': {'focus': 'visual storytelling', 'style': 'trendy', 'hashtag': '#InstaVibes', 'limit': 150},
    'LinkedIn': {'focus': 'professional networking', 'style': 'formal', 'hashtag': '#LinkedInPro', 'limit': 200},
    'Twitter/X': {'focus': 'quick engagement', 'style': 'concise', 'hashtag': '#TweetStar', 'limit': 160},
    'TikTok': {'focus': 'creative expression', 'style': 'playful', 'hashtag': '#DanceLegend', 'limit': 150},
    'Facebook': {'focus': 'community connection', 'style': 'friendly', 'hashtag': '#FBConnect', 'limit': 250}
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

# NLP-based keyword extraction
@lru_cache(maxsize=100)
def extract_keywords(text):
    doc = nlp(text.lower())
    keywords = []
    for ent in doc.ents:
        if ent.label_ in ['PERSON', 'ORG', 'GPE', 'NORP']:
            keywords.append(ent.text)
    for token in doc:
        if token.pos_ in ['NOUN', 'ADJ'] and not token.is_stop and len(token.text) > 3:
            keywords.append(token.text)
    return list(set(keywords))[:10] or ['pro', 'expert']

# Short bio generation
def generate_short_bios(theme, bio_purpose, location, platform, tone, keywords, emoji_style):
    char_limit = platform_context[platform]['limit']
    tone_data = tone_styles.get(tone.lower(), tone_styles['professional'])
    platform_data = platform_context[platform]
    location_part = location or 'global'
    emoji = random.choice(emojis[emoji_style]) if emoji_style != 'without_emojis' else ''
    keywords = keywords or extract_keywords(bio_purpose)[0]

    bios = []
    used_structures = set()
    target_length = char_limit * 0.9

    for _ in range(5):
        adj = random.choice(tone_data['adjectives']).capitalize()
        verb = random.choice(tone_data['verbs'])
        structure = random.choice([
            f"{adj} {bio_purpose}, {verb} {keywords} {platform_data['focus']}, in {location_part}{emoji} {platform_data['hashtag']}",
            f"{bio_purpose}, {verb} {keywords} with {platform_data['style']} flair, ruling {platform} from {location_part}{emoji} {platform_data['hashtag']}",
            f"{location_part}'s {bio_purpose}, {verb} {keywords} {tone_data['focus']}, dazzling {platform}{emoji} {platform_data['hashtag']}"
        ])
        bio = re.sub(r'\s+', ' ', structure).strip()
        struct_key = (structure.split()[0], verb, structure.split()[-2])

        if struct_key in used_structures or len(bio) > char_limit:
            continue
        used_structures.add(struct_key)

        if len(bio) > char_limit:
            bio = bio[:char_limit - 3] + '...'
        elif len(bio) < target_length * 0.8:
            bio = re.sub(r'\s+', ' ', f"{bio} with {random.choice(['epic', 'vivid', 'blazing'])} {tone_data['focus']}").strip()
            if len(bio) > char_limit:
                bio = bio[:char_limit - 3] + '...'

        bios.append({'text': bio, 'length': len(bio)})
        if len(bios) == 3:
            break

    while len(bios) < 3:
        bio = re.sub(r'\s+', ' ', f"{random.choice(tone_data['adjectives']).capitalize()} {bio_purpose}, {random.choice(tone_data['verbs'])} {keywords} {platform_data['focus']}, in {location_part}{emoji} {platform_data['hashtag']}").strip()
        if len(bio) > char_limit:
            bio = bio[:char_limit - 3] + '...'
        bios.append({'text': bio, 'length': len(bio)})

    return bios

# Long bio generation
def generate_long_bio(prompt, platform, tone, word_count):
    doc = nlp(prompt)
    name = next((ent.text for ent in doc.ents if ent.label_ == 'PERSON'), 'Aadarsh Mishra')
    profession = next((token.text for token in doc if token.pos_ == 'NOUN' and not token.is_stop), 'professional')
    tone_data = tone_styles.get(tone.lower(), tone_styles['professional'])
    platform_data = platform_context[platform]

    sections = {
        'intro': f"{name}, a {random.choice(tone_data['adjectives'])} {profession}, thrives on {platform_data['focus']}. With a passion for {tone_data['focus']}, {name} has carved a unique path in {platform_data['style']} spaces.",
        'body': [
            f"From early beginnings, {name} embraced {profession}, driven by {random.choice(['curiosity', 'ambition', 'creativity'])}. Through {random.choice(tone_data['verbs'])} innovative solutions, {name} has earned recognition for {random.choice(['impactful work', 'bold ideas', 'authentic connections'])}.",
            f"Whether {random.choice(tone_data['verbs'])} {platform_data['focus']} or collaborating with others, {name} brings {tone_data['focus']} to every endeavor. Key achievements include {random.choice(['leading projects', 'inspiring teams', 'creating trends'])} that resonate deeply."
        ],
        'closer': f"Looking ahead, {name} aims to {random.choice(tone_data['verbs'])} {platform_data['focus']} further, fueled by {tone_data['focus']}. Connect with {name} on {platform} to join the journey! {platform_data['hashtag']}"
    }

    bio = f"{sections['intro']} {' '.join(sections['body'])} {sections['closer']}"
    words = bio.split()
    current_count = len(words)

    if current_count < word_count:
        filler = f" {name}'s approach combines {random.choice(tone_data['adjectives'])} vision with practical expertise, making a lasting impact. By {random.choice(tone_data['verbs'])} {platform_data['focus']}, {name} continues to inspire and innovate."
        bio += filler * ((word_count - current_count) // len(filler.split()))
        words = bio.split()
        if len(words) > word_count:
            bio = ' '.join(words[:word_count - 3]) + '...'
        elif len(words) < word_count:
            bio += ' ' + ' '.join(['Innovation drives progress.'] * (word_count - len(words)))
    elif current_count > word_count:
        bio = ' '.join(words[:word_count - 3]) + '...'

    return {'text': re.sub(r'\s+', ' ', bio).strip(), 'length': len(bio.split())}

@app.route('/api/suggest-keywords', methods=['POST'])
def suggest_keywords_route():
    try:
        data = request.get_json()
        bio_purpose = data.get('bioPurpose')
        if not bio_purpose:
            return jsonify({'error': 'Bio Purpose is required.'}, 400)
        keywords = extract_keywords(bio_purpose)
        return jsonify({'keywords': keywords})
    except Exception as e:
        print(f"Keyword Error: {e}")
        return jsonify({'error': 'Failed to suggest keywords.'}, 500)

@app.route('/api/generate-bios', methods=['POST'])
def generate_bios_route():
    try:
        data = request.get_json()
        required = ['theme', 'bioPurpose', 'platform', 'tone']
        if not all(data.get(field) for field in required):
            return jsonify({'error': 'All fields are required.'}, 400)
        
        if data.get('wordCount'):  # Long bio
            bio = generate_long_bio(
                data['bioPurpose'], data['platform'], data['tone'], data.get('wordCount', 300)
            )
            return jsonify({'longBio': bio})
        else:  # Short bios
            bios = generate_short_bios(
                data['theme'], data['bioPurpose'], data.get('location', ''),
                data['platform'], data['tone'], data.get('keywords', 'pro'), data.get('emojiStyle', 'without_emojis')
            )
            return jsonify({'shortBios': bios})
    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({'error': 'Failed to generate bios.'}, 500)

@app.route('/contact')
def contact():
    return send_from_directory('.', 'contact.html')

@app.route('/privacy')
def privacy():
    return send_from_directory('.', 'privacy.html')

@app.route('/api/current-date')
def current_date():
    return jsonify({'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')})

@app.route('/')
@app.route('/<path:path>')
def serve_static(path='index.html'):
    try:
        return send_from_directory('.', path)
    except FileNotFoundError:
        return send_from_directory('.', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)
