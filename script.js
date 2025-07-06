document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const bioPurpose = document.getElementById('bioPurpose');
  const platform = document.getElementById('platform');
  const tone = document.getElementById('tone');
  const location = document.getElementById('location');
  const emojiStyle = document.getElementById('emojiStyle');
  const generateBio = document.getElementById('generateBio');
  const bioOutput = document.getElementById('bioOutput');
  const keywordSuggestions = document.getElementById('keywordSuggestions');
  const feedbackSection = document.getElementById('feedbackSection');
  const contactForm = document.getElementById('contactForm');
  const response = document.getElementById('response');

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
  });

  // Real-time keyword suggestions
  bioPurpose.addEventListener('input', debounce(() => {
    fetch('/api/suggest-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bioPurpose: bioPurpose.value })
    })
    .then(res => res.json())
    .then(data => {
      keywordSuggestions.textContent = data.keywords.length ? `Suggestions: ${data.keywords.join(', ')}` : 'No suggestions';
    })
    .catch(err => console.error('Error:', err));
  }, 300));

  // Bio generation with 3D animation
  generateBio.addEventListener('click', () => {
    const data = {
      theme: 'premium',
      bioPurpose: bioPurpose.value,
      location: location.value,
      platform: platform.value,
      tone: tone.value,
      keywords: null,
      emojiStyle: emojiStyle.value
    };
    fetch('/api/generate-bios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      bioOutput.innerHTML = data.shortBios.map(bio => `
        <div class="bg-white/20 p-4 rounded-lg shadow-md transform hover:rotate-2 transition-transform duration-300 animate-slide-up">
          ${bio.text} (${bio.length} chars)
        </div>
      `).join('');
    })
    .catch(err => console.error('Error:', err));
  });

  // Automated comments with diverse names
  const names = [
    'Arjun Sharma', 'Priya Patel', 'Rajesh Singh', 'Neha Gupta', 'Aarav Desai',
    'John Smith', 'Emma Wilson', 'Michael Brown', 'Sophie Laurent', 'Lucas Müller'
  ];
  setInterval(() => {
    const comment = [
      'Amazing bio design!', 'Love the creativity!', 'Try a bold tone next!', 'Perfect for Instagram!',
      'Inspirational vibe!', 'Great work!', 'Elegant and stylish!', 'Fantastic choice!'
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    feedbackSection.innerHTML = `<p class="bg-white/20 p-3 rounded-lg shadow-md animate-pulse">${comment[Math.floor(Math.random() * comment.length)]} - ${name}</p>`;
  }, 5000);

  // Contact form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => response.textContent = data.message)
    .catch(err => response.textContent = 'Error sending message');
  });
});

// Debounce function for input
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from { transform: translateY(20px) rotate(0); opacity: 0; }
    to { transform: translateY(0) rotate(0); opacity: 1; }
  }
  .animate-slide-up {
    animation: slideUp 0.6s ease-out;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
`;
document.head.appendChild(styleSheet);
