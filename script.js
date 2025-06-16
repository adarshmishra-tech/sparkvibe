const platformLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
let userTier = 'Free', bioCount = 0, isPremiumTrial = false;

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSlider();
  initForm();
  initThemeSelector();
  initCountdown();
  initAnimations();
  checkUserTier();
});

function checkUserTier() {
  userTier = localStorage.getItem('userTier') || 'Free';
  isPremiumTrial = localStorage.getItem('trialEnd') > new Date().toISOString() || false;
  if (userTier === 'Elite' || userTier === 'Diamond' || isPremiumTrial) enablePremiumFeatures();
}

function enablePremiumFeatures() {
  const themeSelect = document.getElementById('themeSelect');
  themeSelect.querySelectorAll('option').forEach(opt => opt.disabled = false);
  applyTheme(themeSelect.value);
}

function initParticles() {
  const canvas = document.createElement('canvas');
  document.getElementById('particle-bg').appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const particles = Array(150).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 3 + 1
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
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

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  document.querySelector('.slider-next').addEventListener('click', () => showSlide((current + 1) % slides.length));
  document.querySelector('.slider-prev').addEventListener('click', () => showSlide((current - 1 + slides.length) % slides.length));
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? '1' : '0';
      if (i === index) gsap.fromTo(slide, { x: 100 }, { x: 0, duration: 0.8, ease: 'power2.out' });
    });
    current = index;
  }
  showSlide(0);
  setInterval(() => showSlide((current + 1) % slides.length), 6000);
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
    gsap.to(charCount, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (userTier === 'Free' && bioCount >= 3) {
      modal.classList.remove('hidden');
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      return;
    }
    document.getElementById('loading').classList.remove('hidden');
    const purpose = document.getElementById('bioPurpose').value || 'Elevate Your Brand';
    const location = document.getElementById('location').value || '';
    const platform = platformSelect.value;
    const tone = document.getElementById('tone').value;
    try {
      const response = await fetch('/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, location, platform, tone })
      });
      const data = await response.json();
      bioOutput.innerHTML = `<h3 class="text-amber-300 mb-3 drop-shadow-md">Bio 1:</h3><p class="mb-4 text-gray-100 drop-shadow-md">${data.bio1}</p><h3 class="text-amber-300 mb-3 drop-shadow-md">Bio 2:</h3><p class="text-gray-100 drop-shadow-md">${data.bio2}</p>`;
      charCount.textContent = Math.max(data.bio1.length, data.bio2.length);
      if (userTier === 'Free') bioCount++;
      gsap.fromTo(bioOutput, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    } catch (err) {
      console.error('Bio generation error:', err);
      alert('Error generating bios. Please try again.');
    } finally {
      document.getElementById('loading').classList.add('hidden');
    }
  });

  copyBio.addEventListener('click', () => {
    navigator.clipboard.writeText(bioOutput.textContent);
    copyBio.textContent = 'Copied!';
    gsap.to(copyBio, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
    setTimeout(() => { copyBio.textContent = '📋 Copy Bio'; }, 2000);
  });

  downloadBio.addEventListener('click', () => {
    const blob = new Blob([bioOutput.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sparkvibe_bios.txt';
    a.click();
    URL.revokeObjectURL(url);
    gsap.to(downloadBio, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
  });

  saveBioBtn.addEventListener('click', async () => {
    const email = document.getElementById('saveEmail').value;
    if (!email || !bioOutput.textContent) {
      alert('Please enter an email and generate a bio first.');
      return;
    }
    try {
      const response = await fetch('/save-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, bio: bioOutput.textContent })
      });
      const data = await response.json();
      alert(data.message);
      gsap.to(saveBioBtn, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });
    } catch (err) {
      console.error('Save bio error:', err);
      alert('Error saving bio. Please try again.');
    }
  });

  closeBtn.addEventListener('click', () => {
    gsap.to(modal, { opacity: 0, duration: 0.6, onComplete: () => modal.classList.add('hidden') });
  });
}

function initThemeSelector() {
  const themeSelect = document.getElementById('themeSelect');
  const themeToggle = document.getElementById('themeToggle');
  themeSelect.value = 'cosmic-theme';
  applyTheme('cosmic-theme');

  themeToggle.addEventListener('click', () => {
    const themes = ['cosmic-theme', 'neon-pulse', 'aurora-blaze', 'stellar-gold', 'crystal-dawn'];
    const current = themes.indexOf(document.body.className);
    const nextTheme = themes[(current + 1) % themes.length];
    themeSelect.value = nextTheme;
    applyTheme(nextTheme);
  });

  themeSelect.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });

  function applyTheme(theme) {
    document.body.className = theme;
    gsap.fromTo('body', { opacity: 0.5 }, { opacity: 1, duration: 0.6, ease: 'power2.out' });
  }
}

function initCountdown() {
  const timer = document.getElementById('timer');
  let timeLeft = Math.floor((new Date('2025-06-17T09:15:00+0545') - new Date()) / 1000);
  setInterval(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft-- <= 0) timeLeft = 0;
    gsap.to(timer, { scale: 1.05, duration: 0.4, yoyo: true, repeat: 1 });
  }, 1000);
}

function initAnimations() {
  gsap.from('.hero-logo', { y: -50, opacity: 0, duration: 1.2, ease: 'power3.out' });
  gsap.from('h1, .tagline, .social-proof, .cta-btn, .countdown-timer', {
    opacity: 0, y: 20, duration: 1, stagger: 0.3, ease: 'power3.out'
  });
  gsap.from('.tool-card', {
    opacity: 0, y: 30, duration: 1.2, stagger: 0.3, scrollTrigger: { trigger: '.recommended-tools', start: 'top 80%' }
  });
}
