const platformLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
let userTier = 'Free', bioCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initForm();
  initThemeSelector();
  initCountdown();
  initAnimations();
  checkUserTier();
});

function checkUserTier() {
  userTier = localStorage.getItem('userTier') || 'Free';
  if (userTier !== 'Elite' && userTier !== 'Diamond') {
    document.getElementById('themeSelect').value = 'cosmic-theme';
    document.getElementById('themeToggle').disabled = true;
    const options = document.querySelectorAll('#themeSelect option');
    options.forEach(opt => opt.disabled = opt.value !== 'cosmic-theme');
  } else {
    document.getElementById('themeToggle').disabled = false;
    document.querySelectorAll('#themeSelect option').forEach(opt => opt.disabled = false);
  }
  applyTheme(document.getElementById('themeSelect').value);
}

function initParticles() {
  const canvas = document.createElement('canvas');
  document.getElementById('particle-bg').appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const particles = Array(100).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    radius: Math.random() * 2 + 1
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

function initForm() {
  const form = document.getElementById('bioForm');
  const platformSelect = document.getElementById('platform');
  const charCount = document.getElementById('charCount');
  const maxChars = document.getElementById('maxChars');
  const bioOutput = document.getElementById('bioOutput');
  const copyBio = document.getElementById('copyBio');
  const downloadBio = document.getElementById('downloadBio');
  const saveBioBtn = document.getElementById('saveBio');
  const modal = document.getElementById('comparisonModal');
  const closeBtn = document.querySelector('.close-btn');

  platformSelect.addEventListener('change', () => {
    maxChars.textContent = platformLimits[platformSelect.value];
    charCount.textContent = bioOutput.textContent.length || 0;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (userTier === 'Free' && bioCount >= 3) {
      modal.classList.remove('hidden');
      return;
    }
    document.getElementById('loading').classList.remove('hidden');
    const purpose = document.getElementById('bioPurpose').value;
    const location = document.getElementById('location').value;
    const platform = platformSelect.value;
    const tone = document.getElementById('tone').value;
    if (!purpose || !platform || !tone) return;
    try {
      const response = await fetch('/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, location, platform, tone })
      });
      const data = await response.json();
      bioOutput.innerHTML = `<p class="text-gray-100 drop-shadow-md">${data.bio1}</p><p class="text-gray-100 drop-shadow-md mt-1">${data.bio2}</p>`;
      charCount.textContent = Math.max(data.bio1.length, data.bio2.length);
      if (userTier === 'Free') bioCount++;
    } catch (err) {
      alert('Error generating bios.');
    } finally {
      document.getElementById('loading').classList.add('hidden');
    }
  });

  copyBio.addEventListener('click', () => {
    navigator.clipboard.writeText(bioOutput.textContent);
    copyBio.textContent = 'Copied!';
    setTimeout(() => copyBio.textContent = '📋 Copy', 1500);
  });

  downloadBio.addEventListener('click', () => {
    const blob = new Blob([bioOutput.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sparkvibe_bios.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  saveBioBtn.addEventListener('click', async () => {
    const email = document.getElementById('saveEmail').value;
    if (!email || !bioOutput.textContent) return alert('Enter email and generate a bio.');
    try {
      const response = await fetch('/save-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, bio: bioOutput.textContent })
      });
      alert((await response.json()).message);
    } catch (err) {
      alert('Error saving bio.');
    }
  });

  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
}

function initThemeSelector() {
  const themeSelect = document.getElementById('themeSelect');
  const themeToggle = document.getElementById('themeToggle');
  themeSelect.value = 'cosmic-theme';
  applyTheme('cosmic-theme');

  themeToggle.addEventListener('click', () => {
    if (userTier === 'Elite' || userTier === 'Diamond') {
      const themes = ['cosmic-theme', 'neon-pulse', 'aurora-blaze', 'stellar-gold', 'crystal-dawn'];
      const current = themes.indexOf(document.body.className);
      const nextTheme = themes[(current + 1) % themes.length];
      themeSelect.value = nextTheme;
      applyTheme(nextTheme);
    }
  });

  themeSelect.addEventListener('change', (e) => {
    if (userTier === 'Elite' || userTier === 'Diamond' || e.target.value === 'cosmic-theme') {
      applyTheme(e.target.value);
    }
  });

  function applyTheme(theme) {
    document.body.className = theme;
  }
}

function initCountdown() {
  const timer = document.getElementById('timer');
  let timeLeft = Math.floor((new Date('2025-06-17T09:15:00+0545') - new Date()) / 1000);
  setInterval(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${hours}:${minutes}:${seconds}`.replace(/\b\d\b/g, '0$&');
    if (timeLeft-- <= 0) timeLeft = 0;
  }, 1000);
}

function initAnimations() {
  gsap.from('.hero-logo', { y: -30, opacity: 0, duration: 1, ease: 'power2.out' });
  gsap.from('h1, .cta-btn, .countdown-timer', { opacity: 0, y: 10, duration: 0.8, stagger: 0.2, ease: 'power2.out' });
}
