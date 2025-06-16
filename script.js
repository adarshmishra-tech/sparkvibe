const platformLimits = { Instagram: 150, LinkedIn: 2000, TikTok: 80, Twitter: 160 };
let bioCount = 0, ipLimit = 2;
const ratings = [
  { name: "Aarav Kapoor", rating: "★★★★★", comment: "Revolutionized my career!" },
  { name: "Sophia Miller", rating: "★★★★☆", comment: "Perfect for branding" },
  { name: "Deepika Reddy", rating: "★★★★★", comment: "Exceptional quality" },
  { name: "James Wilson", rating: "★★★★☆", comment: "Highly effective" },
  { name: "Karan Singh", rating: "★★★★★", comment: "Elite toolset" },
  { name: "Olivia Brown", rating: "★★★★☆", comment: "Great support" },
  { name: "Shalini Mehta", rating: "★★★★★", comment: "Top-tier design" },
  { name: "Thomas Clark", rating: "★★★★☆", comment: "Very reliable" },
  { name: "Rohan Desai", rating: "★★★★★", comment: "Game-changer" },
  { name: "Emma Taylor", rating: "★★★★☆", comment: "Excellent results" }
];

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initForm();
  initThemeSelector();
  initCountdown();
  initAnimations();
  initRatingCarousel();
  initChart();
});

function initParticles() {
  const canvas = document.createElement('canvas');
  document.getElementById('particle-bg').appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const particles = Array(120).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
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
  const buyNow = document.getElementById('buyNow');

  platformSelect.addEventListener('change', () => {
    maxChars.textContent = platformLimits[platformSelect.value];
    charCount.textContent = bioOutput.textContent.length || 0;
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (bioCount >= ipLimit) {
      buyNow.classList.remove('hidden');
      alert('Free limit (2 bios) reached. Upgrade to Premium.');
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
        body: JSON.stringify({ purpose, location, platform, tone, ip: getIP() })
      });
      const data = await response.json();
      bioOutput.textContent = `${data.bio1}\n${data.bio2}`;
      charCount.textContent = Math.max(data.bio1.length, data.bio2.length);
      bioCount++;
      if (bioCount === 2) buyNow.classList.remove('hidden');
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

  function getIP() {
    return '127.0.0.1'; // Placeholder; replace with actual IP service in production
  }
}

function initThemeSelector() {
  const themeSelect = document.getElementById('themeSelect');
  const themeToggle = document.getElementById('themeToggle');
  themeSelect.value = 'cosmic-theme';
  applyTheme('cosmic-theme');

  themeToggle.addEventListener('click', () => {
    const userTier = localStorage.getItem('userTier') || 'Free';
    if (userTier === 'Elite' || userTier === 'Diamond') {
      const themes = ['cosmic-theme', 'neon-pulse', 'aurora-blaze', 'stellar-gold', 'crystal-dawn'];
      const current = themes.indexOf(document.body.className);
      const nextTheme = themes[(current + 1) % themes.length];
      themeSelect.value = nextTheme;
      applyTheme(nextTheme);
    }
  });

  themeSelect.addEventListener('change', (e) => {
    const userTier = localStorage.getItem('userTier') || 'Free';
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
    timer.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timeLeft-- <= 0) timeLeft = 0;
  }, 1000);
}

function initAnimations() {
  gsap.from('.hero-logo', { y: -40, opacity: 0, duration: 1.2, ease: 'power2.out' });
  gsap.from('h1, .cta-btn, .countdown-timer', { opacity: 0, y: 20, duration: 1, stagger: 0.3, ease: 'power2.out' });
}

function initRatingCarousel() {
  const carousel = document.getElementById('ratingCarousel');
  const slides = carousel.getElementsByClassName('rating-slide');
  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.add('hidden');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.remove('hidden');
  }, 5000);
}

function initChart() {
  const ctx = document.getElementById('premiumChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Unlimited Bios', 'All Themes', 'Analytics', 'Custom Templates'],
      datasets: [{
        label: 'Premium Benefits',
        data: [90, 85, 70, 60],
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
        borderColor: 'rgba(255, 215, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 100, ticks: { color: 'rgba(255, 215, 0, 0.9)' } } },
      plugins: { legend: { labels: { color: 'rgba(255, 215, 0, 0.9)' } } }
    }
  });
}
