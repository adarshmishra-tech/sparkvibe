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

# Word dictionaries for dynamic bio generation
power_words = {
    'vibrant': ['radiant', 'bold', 'vivid', 'energetic', 'lively', 'sparkling', 'thriving', 'vibrant', 'dazzling', 'charismatic'],
    'elegant': ['sophisticated', 'refined', 'graceful', 'timeless', 'exquisite', 'classy', 'elegant', 'chic', 'poised', 'alluring'],
    'general': ['guru', 'visionary', 'maestro', 'pro', 'innovator', 'master', 'trailblazer', 'icon', 'expert', 'legend']
}

tone_styles = {
    'professional': {'adjective': 'polished', 'action': 'delivering', 'vibe': 'excellence', 'focus': 'expertise'},
    'witty': {'adjective': 'clever', 'action': 'sprinkling', 'vibe': 'charm', 'focus': 'wit'},
    'bold': {'adjective': 'fearless', 'action': 'igniting', 'vibe': 'passion', 'focus': 'intensity'},
    'friendly': {'adjective': 'warm', 'action': 'sharing', 'vibe': 'connection', 'focus': 'approachability'},
    'inspirational': {'adjective': 'uplifting', 'action': 'inspiring', 'vibe': 'motivation', 'focus': 'drive'},
    'romantic': {'adjective': 'passionate', 'action': 'weaving', 'vibe': 'romance', 'focus': 'heart'},
    'casual': {'adjective': 'chill', 'action': 'bringing', 'vibe': 'vibes', 'focus': 'ease'}
}

platform_context = {
    'Tinder': {'focus': 'sparking connections', 'style': 'flirty', 'hashtag': '#LoveSpark', 'limit': 500}
}

emojis = {
    'minimal': ['✨', '🌟', '💖'],
    'vibrant': ['🌈', '🚀', '🎉', '🔥', '💥'],
    'none': ['']
}

# Keyword suggestion logic
def suggest_keywords(bio_purpose):
    keyword_base = {
        'dating': ['love wizard', 'romance guru', 'flirt maestro', 'heart innovator', 'connection pro', 'charm legend', 'passion expert'],
        'coach': ['dating mentor', 'relationship guru', 'love strategist', 'connection master', 'romance pro', 'heart guide'],
        'fitness': ['fitness cupid', 'health charmer', 'wellness flirt', 'strength icon', 'vitality pro'],
        'travel': ['adventure romantic', 'wanderlust guru', 'journey charmer', 'explorer heart', 'pathfinder pro'],
        'fashion': ['style seducer', 'trend charmer', 'fashion flirt', 'chic icon', 'glam pro']
    }
    words = re.findall(r'\w+', bio_purpose.lower())
    relevant = [kw for word in words for kw in keyword_base.get(word, [])]
    custom = [f"{word} {random.choice(power_words['general'])}" for word in words][:5]
    keywords = list(set(custom + relevant + power_words['general'][:3]))[:10]
    return keywords if keywords else ['love wizard', 'romance pro', 'heart expert']

# Dynamic bio generation for Tinder
def generate_bios(theme, bio_purpose, location, tone, keywords, emoji_style):
    char_limit = platform_context['Tinder']['limit']
    tone_data = tone_styles.get(tone, tone_styles['romantic'])
    platform_data = platform_context['Tinder']
    location_part = f"in {location}" if location else "wherever sparks fly"
    theme_words = power_words.get(theme, power_words['vibrant'])
    emoji = random.choice(emojis[emoji_style]) if emoji_style != 'none' else ''

    # Sentence components for flirty, professional Tinder bios
    intros = [
        f"{random.choice(theme_words).capitalize()} {tone_data['adjective']} {bio_purpose}",
        f"{tone_data['vibe'].capitalize()}-driven {bio_purpose}",
        f"{bio_purpose} with {random.choice(theme_words)} {tone_data['focus']}"
    ]
    actions = [
        f"{tone_data['action']} {keywords} {platform_data['focus']}",
        f"crafting {keywords} with {tone_data['vibe']}",
        f"sparking {keywords} through {tone_data['focus']}"
    ]
    closers = [
        f"{location_part} with {tone_data['vibe']}{emoji}",
        f"on Tinder {location_part}{emoji}",
        f"chasing {tone_data['focus']} {location_part}{emoji}"
    ]

    bios = []
    used_phrases = set()
    for _ in range(3):
        intro = random.choice(intros)
        action = random.choice([a for a in actions if a not in used_phrases])
        closer = random.choice([c for c in closers if c not in used_phrases])
        used_phrases.update([action, closer])
        bio = f"{intro} {action} {closer} {platform_data['hashtag']}".replace('\s+', ' ').strip()
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
            return jsonify({'error': 'Please enter a Bio Purpose (e.g., Dating Coach).'}, 400)
        keywords = suggest_keywords(bio_purpose)
        return jsonify({'keywords': keywords})
    except Exception as e:
        print(f"Keyword Suggestion Error: {e}")
        return jsonify({'error': 'Failed to suggest keywords. Please try again.'}, 500)

@app.route('/api/generate-bios', methods=['POST'])
def generate_bios_route():
    try:
        data = request.get_json()
        required_fields = ['theme', 'bioPurpose', 'tone']
        if not all(data.get(field) for field in required_fields):
            return jsonify({'error': 'Theme, Bio Purpose, and Tone are required.'}, 400)
        bios = generate_bios(
            data.get('theme'),
            data.get('bioPurpose'),
            data.get('location', ''),
            data.get('tone'),
            data.get('keywords', ''),
            data.get('emojiStyle', 'none')
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
