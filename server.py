from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import re
from datetime import datetime
import os
from dotenv import load_dotenv

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "https://sparkvibe-1.onrender.com"}})
load_dotenv()

# Enhanced word dictionaries
power_words = {
    'cosmic_glow': ['stellar', 'radiant', 'luminous', 'celestial', 'ethereal', 'galactic', 'cosmic', 'astral', 'shimmering', 'infinite'],
    'neon_pulse': ['electric', 'vibrant', 'neon', 'pulsing', 'dynamic', 'bold', 'striking', 'vivid', 'charged', 'radiant'],
    'general': ['guru', 'visionary', 'maestro', 'pro', 'innovator', 'pioneer', 'legend', 'icon', 'trailblazer', 'master']
}

tone_styles = {
    'professional': {'adjective': 'polished', 'action': 'delivering', 'vibe': 'excellence', 'focus': 'expertise'},
    'witty': {'adjective': 'clever', 'action': 'sprinkling', 'vibe': 'charm', 'focus': 'wit'},
    'bold': {'adjective': 'fearless', 'action': 'igniting', 'vibe': 'passion', 'focus': 'intensity'},
    'friendly': {'adjective': 'warm', 'action': 'sharing', 'vibe': 'connection', 'focus': 'approachability'},
    'inspirational': {'adjective': 'uplifting', 'action': 'inspiring', 'vibe': 'motivation', 'focus': 'drive'},
    'romantic': {'adjective': 'passionate', 'action': 'weaving', 'vibe': 'romance', 'focus': 'heart'},
    'engaging': {'adjective': 'captivating', 'action': 'sparking', 'vibe': 'energy', 'focus': 'engagement'},
    'casual': {'adjective': 'chill', 'action': 'bringing', 'vibe': 'vibes', 'focus': 'ease'}
}

platform_context = {
    'Instagram': {'focus': 'visual storytelling', 'style': 'trendy', 'hashtag': '#BioBlaze', 'limit': 150},
    'LinkedIn': {'focus': 'professional networking', 'style': 'formal', 'hashtag': '#LinkedPro', 'limit': 200},
    'Twitter': {'focus': 'quick engagement', 'style': 'concise', 'hashtag': '#TweetLegend', 'limit': 160},
    'TikTok': {'focus': 'creative expression', 'style': 'playful', 'hashtag': '#TikTokIcon', 'limit': 150},
    'Tinder': {'focus': 'personal connection', 'style': 'engaging', 'hashtag': '#LoveSpark', 'limit': 300}
}

emojis = {
    'with_emojis': ['✨', '🌟', '💖', '💡', '🔥', '🎉'],
    'minimal_emojis': ['✨', '🌟'],
    'vibrant_emojis': ['🌈', '🚀', '🎆', '⚡️'],
    'without_emojis': ['']
}

# Real-time keyword suggestion
def suggest_keywords(bio_purpose):
    keyword_base = {
        'dancing': ['dance icon', 'rhythm pioneer', 'movement maestro', 'choreography legend', 'dance visionary'],
        'marketing': ['SEO titan', 'digital master', 'brand strategist', 'growth innovator', 'marketing guru'],
        'photography': ['visual storyteller', 'lens legend', 'photo maestro', 'capture pro', 'image pioneer'],
        'technology': ['tech visionary', 'code master', 'innovation titan', 'digital pioneer', 'tech icon'],
        'dating': ['connection guru', 'romance maestro', 'heart pioneer', 'spark innovator', 'love legend']
    }
    words = re.findall(r'\w+', bio_purpose.lower())
    relevant = [kw for word in words for kw in keyword_base.get(word, [])]
    custom = [f"{word} {random.choice(power_words['general'])}" for word in words][:6]
    weighted = list(set(custom + relevant + random.sample(power_words['general'], 4)))[:12]
    return weighted if weighted else ['pro', 'icon', 'master']

# Advanced bio generation
def generate_bios(theme, bio_purpose, location, platform, tone, keywords, emoji_style):
    char_limit = platform_context[platform]['limit']
    tone_data = tone_styles.get(tone.lower(), tone_styles['professional'])
    platform_data = platform_context[platform]
    location_part = f" based in {location}" if location else " worldwide"
    theme_words = power_words.get(theme.lower(), power_words['cosmic_glow'])
    emoji = random.choice(emojis[emoji_style]) if emoji_style != 'without_emojis' else ''

    # Three-layer bio structure
    intros = [
        f"{random.choice(theme_words).capitalize()} {tone_data['adjective']} {bio_purpose}",
        f"{tone_data['vibe'].capitalize()}-driven {bio_purpose}",
        f"{bio_purpose} with {random.choice(theme_words)} {tone_data['focus']}",
        f"{random.choice(theme_words).capitalize()} {bio_purpose} {tone_data['action']} {tone_data['focus']}"
    ]
    actions = [
        f"{tone_data['action']} {keywords} {platform_data['focus']}",
        f"shaping {keywords} with {tone_data['vibe']}",
        f"amplifying {keywords} through {platform_data['focus']}",
        f"creating {keywords} moments with {tone_data['vibe']}"
    ]
    closers = [
        f"{location_part}{emoji} {platform_data['hashtag']}",
        f"on {platform}{location_part}{emoji} {platform_data['hashtag']}",
        f"pursuing {tone_data['focus']}{location_part}{emoji} {platform_data['hashtag']}",
        f"igniting {tone_data['vibe']}{location_part}{emoji} {platform_data['hashtag']}"
    ]

    bios = []
    used_phrases = set()
    target_length = char_limit * 0.85  # Aim for 85% of limit
    for _ in range(3):
        intro = random.choice(intros)
        action = random.choice([a for a in actions if a not in used_phrases])
        closer = random.choice([c for c in closers if c not in used_phrases])
        used_phrases.update([action, closer])
        bio = f"{intro}, {action}, {closer}".replace('\s+', ' ').strip()
        # Adjust length
        if len(bio) > char_limit:
            bio = bio[:char_limit - 3] + '...'
        elif len(bio) < target_length:
            bio = f"{intro}, {action}, {random.choice(theme_words)} {closer}".strip()
            if len(bio) > char_limit:
                bio = bio[:char_limit - 3] + '...'
        bios.append({'text': bio, 'length': len(bio)})
    
    return bios

@app.route('/api/suggest-keywords', methods=['POST'])
def suggest_keywords_route():
    try:
        data = request.get_json()
        bio_purpose = data.get('bioPurpose')
        if not bio_purpose:
            return jsonify({'error': 'Please enter a Bio Purpose (e.g., Dancing Coach).'}, 400)
        keywords = suggest_keywords(bio_purpose)
        return jsonify({'keywords': keywords})
    except Exception as e:
        print(f"Keyword Suggestion Error: {e}")
        return jsonify({'error': 'Failed to suggest keywords. Please try again.'}, 500)

@app.route('/api/generate-bios', methods=['POST'])
def generate_bios_route():
    try:
        data = request.get_json()
        required_fields = ['theme', 'bioPurpose', 'platform', 'tone', 'emojiStyle']
        if not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'Theme, Bio Purpose, Platform, Tone, and Emoji Style are required.'}, 400)
        bios = generate_bios(
            data.get('theme'),
            data.get('bioPurpose'),
            data.get('location', ''),
            data.get('platform'),
            data.get('tone'),
            data.get('keywords', 'pro'),
            data.get('emojiStyle')
        )
        if not bios or len(bios) < 3:
            raise Exception('Failed to generate sufficient bios')
        return jsonify({'bios': bios})
    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({'error': 'Failed to generate bios. Please try again later.'}, 500)

@app.route('/contact')
def contact():
    return send_from_directory('.', 'contact.html')

@app.route('/privacy')
def privacy():
    return send_from_directory('.', 'privacy.html')

@app.route('/api/current-date')
def current_date():
    date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'date': date})

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
