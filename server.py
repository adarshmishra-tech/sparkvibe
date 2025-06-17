from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import re
from datetime import datetime
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://sparkvibe-1.onrender.com"}})

# Word dictionaries for dynamic bio generation
power_words = {
    'vibrant': ['dynamic', 'radiant', 'bold', 'vivid', 'energetic', 'lively', 'sparkling', 'thriving', 'bustling', 'vibrant'],
    'elegant': ['sophisticated', 'refined', 'polished', 'graceful', 'timeless', 'exquisite', 'classy', 'cultivated', 'distinguished', 'chic'],
    'general': ['expert', 'guru', 'pioneer', 'visionary', 'maestro', 'oracle', 'pro', 'legend', 'innovator', 'master', 'authority', 'trailblazer']
}

tone_styles = {
    'professional': {'adjective': 'refined', 'action': 'delivering', 'vibe': 'excellence', 'focus': 'expertise'},
    'witty': {'adjective': 'clever', 'action': 'sprinkling', 'vibe': 'charm', 'focus': 'wit'},
    'bold': {'adjective': 'fearless', 'action': 'unleashing', 'vibe': 'impact', 'focus': 'strength'},
    'friendly': {'adjective': 'warm', 'action': 'sharing', 'vibe': 'connection', 'focus': 'approachability'},
    'inspirational': {'adjective': 'uplifting', 'action': 'igniting', 'vibe': 'inspiration', 'focus': 'motivation'},
    'romantic': {'adjective': 'passionate', 'action': 'weaving', 'vibe': 'romance', 'focus': 'heart'},
    'casual': {'adjective': 'relaxed', 'action': 'bringing', 'vibe': 'chill', 'focus': 'ease'}
}

platform_context = {
    'Instagram': {'focus': 'visual storytelling', 'style': 'trendy', 'hashtag': '#BioBlaze'},
    'LinkedIn': {'focus': 'professional networking', 'style': 'formal', 'hashtag': '#LinkedPro'},
    'Twitter': {'focus': 'quick engagement', 'style': 'concise', 'hashtag': '#TweetLegend'},
    'TikTok': {'focus': 'creative expression', 'style': 'playful', 'hashtag': '#TikTokIcon'},
    'Tinder': {'focus': 'personal connection', 'style': 'flirty', 'hashtag': '#LoveSpark'},
    'Bumble': {'focus': 'authentic relationships', 'style': 'engaging', 'hashtag': '#DateVibe'}
}

emojis = {
    'minimal': ['✨', '🌟', '💡', '⚡'],
    'vibrant': ['🌈', '🚀', '🎉', '🔥', '💥'],
    'none': ['']
}

# Keyword suggestion logic
def suggest_keywords(bio_purpose):
    keyword_base = {
        'marketing': ['SEO titan', 'digital guru', 'ad maestro', 'growth wizard', 'brand oracle', 'marketing pro', 'content legend'],
        'bakery': ['artisan titan', 'pastry guru', 'bread maestro', 'dessert wizard', 'cake oracle', 'baking pro', 'sweet innovator'],
        'branding': ['identity titan', 'self-growth guru', 'influence maestro', 'personal wizard', 'brand oracle', 'branding expert', 'image pro'],
        'business': ['entrepreneurial titan', 'corporate guru', 'startup maestro', 'growth wizard', 'business oracle', 'strategy pro', 'venture legend'],
        'fitness': ['fitness titan', 'health guru', 'workout maestro', 'wellness wizard', 'strength oracle', 'fitness pro', 'health innovator'],
        'photography': ['visual titan', 'photo guru', 'portrait maestro', 'landscape wizard', 'image oracle', 'photography pro', 'lens legend'],
        'travel': ['wanderer titan', 'journey guru', 'adventure maestro', 'cultural wizard', 'pathfinder oracle', 'travel pro', 'explorer legend'],
        'fashion': ['style titan', 'trend guru', 'design maestro', 'couture wizard', 'fabric oracle', 'fashion pro', 'trendsetter'],
        'technology': ['tech titan', 'innovation guru', 'code maestro', 'digital wizard', 'future oracle', 'tech pro', 'software legend'],
        'dating': ['romance titan', 'connection guru', 'flirt maestro', 'love wizard', 'charm oracle', 'dating pro', 'heart innovator']
    }
    words = re.findall(r'\w+', bio_purpose.lower())
    relevant = [kw for word in words for kw in keyword_base.get(word, [])]
    custom = [f"{word} {random.choice(power_words['general'])}" for word in words][:5]
    return list(set(custom + relevant + power_words['general'][:3]))[:10]

# Dynamic bio generation
def generate_bios(theme, bio_purpose, location, platform, tone, keywords, emoji_style):
    char_limit = {'Instagram': 150, 'Twitter': 160, 'LinkedIn': 200, 'TikTok': 150, 'Tinder': 500, 'Bumble': 300}.get(platform, 200)
    tone_data = tone_styles.get(tone, tone_styles['professional'])
    platform_data = platform_context.get(platform, platform_context['Instagram'])
    location_part = f"in {location}" if location else "worldwide"
    theme_words = power_words.get(theme, power_words['vibrant'])
    emoji = random.choice(emojis[emoji_style]) if emoji_style != 'none' else ''

    # Sentence structure components
    intros = [
        f"{random.choice(theme_words)} {tone_data['adjective']} {bio_purpose}",
        f"{tone_data['vibe'].capitalize()} {bio_purpose}",
        f"{bio_purpose} with {random.choice(theme_words)} {tone_data['focus']}"
    ]
    actions = [
        f"{tone_data['action']} {keywords}",
        f"crafting {platform_data['focus']} with {keywords}",
        f"leading {keywords} with {tone_data['vibe']}"
    ]
    closers = [
        f"{location_part}{emoji}",
        f"on {platform} {location_part}{emoji}",
        f"with {tone_data['focus']} {location_part}{emoji}"
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
    data = request.get_json()
    bio_purpose = data.get('bioPurpose')
    if not bio_purpose:
        return jsonify({'error': 'Please enter a Bio Purpose (e.g., Dating Coach).'}, status=400)
    try:
        keywords = suggest_keywords(bio_purpose)
        return jsonify({'keywords': keywords})
    except Exception as e:
        print(f"Keyword Suggestion Error: {e}")
        return jsonify({'error': 'Failed to suggest keywords. Please try again.'}, status=500)

@app.route('/api/generate-bios', methods=['POST'])
def generate_bios_route():
    data = request.get_json()
    required_fields = ['theme', 'bioPurpose', 'platform', 'tone']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Theme, Bio Purpose, Platform, and Tone are required.'}, status=400)
    try:
        bios = generate_bios(
            data.get('theme'),
            data.get('bioPurpose'),
            data.get('location', ''),
            data.get('platform'),
            data.get('tone'),
            data.get('keywords', ''),
            data.get('emojiStyle', 'none')
        )
        if not bios or len(bios) < 3:
            raise Exception('Failed to generate sufficient bios')
        return jsonify({'bios': bios})
    except Exception as e:
        print(f"Generation Error: {e}")
        return jsonify({'error': 'Failed to generate bios. Please try again later.'}, status=500)

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
    return send_from_directory('.', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
