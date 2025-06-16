const platformLimits = {
  Instagram: 150,
  LinkedIn: 2000,
  TikTok: 80,
  Twitter: 160
};

let userTier = 'Free';
let bioCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSlider();
  initPricingChart();
  initForm();
  initThemeSelector();
  initCountdown();
  initAnimations();
});

function initParticles() {
  const canvas = document.createElement('canvas');
  const particleBg = document.getElementById('particle-bg');
  particleBg.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 0.3 - 0.15,
      vy: Math.random() * 0.3 - 0.15,
      radius: Math.random() * 1.5 + 0.5
    });
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
      ctx.stroke();
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
  const nextBtn = document.querySelector('.slider-next');
  const prevBtn = document.querySelector('.slider-prev');
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      gsap.fromTo(slide, { x: index > current ? 100 : -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
    });
    current = index;
  }
  nextBtn.addEventListener('click', () => {
    showSlide((current + 1) % slides.length);
  });
  prevBtn.addEventListener('click', () => {
    showSlide((current - 1 + slides.length) % slides.length);
  });
  setInterval(() => showSlide((current + 1) % slides.length), 5000); // Auto-slide every 5s
}

function initPricingChart() {
  const ctx = document.getElementById('pricingChart').getContext('2d');
  const gradientFree = ctx.createLinearGradient(0, 0, 0, 350);
  gradientFree.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
  gradientFree.addColorStop(1, 'rgba(255, 215, 0, 0.4)');
  const gradientElite = ctx.createLinearGradient(0, 0, 0, 350);
  gradientElite.addColorStop(0, 'rgba(26, 26, 46, 0.8)');
  gradientElite.addColorStop(1, 'rgba(26, 26, 46, 0.4)');
  const gradientDiamond = ctx.createLinearGradient(0, 0, 0, 350);
  gradientDiamond.addColorStop(0, 'rgba(10, 15, 46, 0.8)');
  gradientDiamond.addColorStop(1, 'rgba(10, 15, 46, 0.4)');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Free', 'Elite', 'Diamond'],
      datasets: [{
        label: 'Features',
        data: [4, 8, 12],
        backgroundColor: [gradientFree, gradientElite, gradientDiamond],
        borderColor: ['#FFD700', '#1A1A3D', '#0A0F2E'],
        borderWidth: 2,
        borderRadius: 10,
        hoverBackgroundColor: [gradientFree, gradientElite, gradientDiamond],
        hoverBorderColor: ['#FFD700', '#1A1A3D', '#0A0F2E']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 20
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 15, 46, 0.95)',
          titleColor: '#F5F5F5',
          bodyColor: '#F5F5F5',
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: context => {
              const labels = {
                Free: '3 Bios/Day, STX-Basic AI, Dark Theme, Professional Tone',
                Elite: 'Unlimited Bios, STX-Advanced AI, All Themes & Tones, Analytics',
                Diamond: 'All Elite + STX-Ultra AI, Custom Templates, Branding Consultation'
              };
              return labels[context.label];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Feature Count', color: '#F5F5F5', font: { size: 14 } },
          grid: { color: 'rgba(255, 215, 0, 0.15)', lineWidth: 1 },
          ticks: { color: '#F5F5F5', font: { size: 12 } }
        },
        x: {
          title: { display: true, text: 'Plan', color: '#F5F5F5', font: { size: 14 } },
          ticks: { color: '#F5F5F5', font: { size: 12 } },
          grid: { display: false }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      }
    }
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

  platformSelect.addEventListener('change', () => {
    maxChars.textContent = platformLimits[platformSelect.value];
    charCount.textContent = bioOutput.textContent.length;
    gsap.to('#charCount', { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (userTier === 'Free' && bioCount >= 3) {
      gsap.to('#bioForm', { x: 10, duration: 0.1, repeat: 3, yoyo: true });
      alert('Free tier limit reached. Upgrade for unlimited bios!');
      return;
    }
    document.getElementById('loading').style.display = 'block';
    const purpose = document.getElementById('bioPurpose').value;
    const location = document.getElementById('location').value;
    const platform = platformSelect.value;
    const tone = document.getElementById('tone').value;
    try {
      const response = await fetch('/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, location, platform, tone, fingerprint: navigator.userAgent + screen.width + screen.height })
      });
      const data = await response.json();
      bioOutput.textContent = data.bio;
      charCount.textContent = data.bio.length;
      bioCount++;
      gsap.fromTo('#bioOutput', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      if (userTier === 'Free') alert('Upgrade to Elite for unlimited bios!');
    } catch (err) {
      alert('Error generating bio. Try again later.');
    } finally {
      document.getElementById('loading').style.display = 'none';
    }
  });

  copyBio.addEventListener('click', () => {
    navigator.clipboard.writeText(bioOutput.textContent);
    copyBio.textContent = 'Copied!';
    gsap.to(copyBio, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
    setTimeout(() => { copyBio.textContent = '📋 Copy Bio'; }, 2000);
  });

  downloadBio.addEventListener('click', () => {
    const blob = new Blob([bioOutput.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sparkvibe_bio.txt';
    a.click();
    URL.revokeObjectURL(url);
    gsap.to(downloadBio, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
  });

  saveBioBtn.addEventListener('click', async () => {
    const email = document.getElementById('saveEmail').value;
    if (!email || !bioOutput.textContent) {
      gsap.to('#saveBio', { x: 10, duration: 0.1, repeat: 3, yoyo: true });
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
      gsap.to(saveBioBtn, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
    } catch (err) {
      alert('Error saving bio. Try again later.');
    }
  });
}

function initThemeSelector() {
  const themeSelect = document.getElementById('themeSelect');
  const themeToggle = document.getElementById('themeToggle');
  themeSelect.value = document.body.className || 'cosmic-theme';
  themeToggle.addEventListener('click', () => {
    const themes = ['cosmic-theme', 'dark-theme', 'light-theme', 'ocean-theme', 'forest-theme'];
    const current = themes.indexOf(document.body.className);
    const nextTheme = themes[(current + 1) % themes.length];
    document.body.className = nextTheme;
    themeSelect.value = nextTheme;
    gsap.fromTo('body', { opacity: 0.5 }, { opacity: 1, duration: 0.5 });
  });
  themeSelect.addEventListener('change', () => {
    if (userTier === 'Free' && !['dark-theme', 'cosmic-theme'].includes(themeSelect.value)) {
      gsap.to('#themeSelect', { x: 10, duration: 0.1, repeat: 3, yoyo: true });
      alert('Premium themes require Elite or Diamond upgrade!');
      themeSelect.value = 'cosmic-theme';
      document.body.className = 'cosmic-theme';
      return;
    }
    document.body.className = themeSelect.value;
    gsap.fromTo('body', { opacity: 0.5 }, { opacity: 1, duration: 0.5 });
  });
}

function initCountdown() {
  const timer = document.getElementById('timer');
  let timeLeft = 23 * 60 * 60 + 44 * 60 + 44;
  setInterval(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeLeft--;
    if (timeLeft < 0) timeLeft = 24 * 60 * 60;
    gsap.to('#timer', { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1 });
  }, 1000);
}

function initAnimations() {
  gsap.from('.hero-logo', { y: -60, opacity: 0, duration: 1.2, ease: 'power3.out' });
  gsap.from('h1, .tagline, .social-proof, .cta-btn, .countdown-timer, .early-user-badge', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.25,
    ease: 'power3.out'
  });
  gsap.from('.pricing-card', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.3,
    scrollTrigger: {
      trigger: '.pricing-section',
      start: 'top 75%'
    }
  });
  gsap.from('.tool-card', {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.recommended-tools',
      start: 'top 75%'
    }
  });
}
