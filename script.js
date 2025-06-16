const platformLimits = {
  Instagram: 150,
  LinkedIn: 2000,
  TikTok: 80,
  Twitter: 160
};

let userTier = 'Free';
let bioCount = 0;
let fingerprint;

document.addEventListener('DOMContentLoaded', () => {
  try {
    initFingerprint();
    initParticles();
    initSlider();
    initTestimonials();
    initPricingChart();
    initForm();
    initThemeSelector();
    initCountdown();
  } catch (err) {
    console.error('Initialization error:', err);
  }
});

function initFingerprint() {
  try {
    Fingerprint2.get(components => {
      fingerprint = Fingerprint2.x64hash128(components.map(c => c.value).join(''), 31);
      checkBioLimit();
    });
  } catch (err) {
    console.error('Fingerprint error:', err);
    fingerprint = 'default';
    checkBioLimit();
  }
}

function checkBioLimit() {
  try {
    const storedData = JSON.parse(localStorage.getItem('sparkvibe_data') || '{}');
    const today = new Date().toISOString().split('T')[0];
    if (storedData.date !== today) {
      storedData.date = today;
      storedData.count = 0;
      bioCount = 0;
    } else {
      bioCount = storedData.count || 0;
    }
    localStorage.setItem('sparkvibe_data', JSON.stringify(storedData));
    if (userTier === 'Free' && bioCount >= 3) {
      alert('Free tier limit reached (3 bios/day). Upgrade to Elite or Diamond!');
      document.querySelector('#bioForm button').disabled = true;
    }
  } catch (err) {
    console.error('Bio limit check error:', err);
  }
}

function initParticles() {
  try {
    const canvas = document.createElement('canvas');
    const particleBg = document.getElementById('particle-bg');
    if (!particleBg) return;
    particleBg.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        radius: Math.random() * 1.5 + 1
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
        ctx.fillStyle = 'rgba(0, 230, 255, 0.5)';
        ctx.fill();
        particles.forEach(other => {
          const dist = Math.hypot(p.x - other.x, p.y - other.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = 'rgba(255, 0, 204, 0.1)';
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    }
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    animate();
  } catch (err) {
    console.error('Particle animation error:', err);
  }
}

function initSlider() {
  try {
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    if (!nextBtn || !prevBtn) return;
    nextBtn.addEventListener('click', () => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    });
    prevBtn.addEventListener('click', () => {
      slides[current].classList.remove('active');
      current = (current - 1 + slides.length) % slides.length;
      slides[current].classList.add('active');
    });
  } catch (err) {
    console.error('Slider error:', err);
  }
}

function initTestimonials() {
  try {
    const cards = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.carousel-dots');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    if (!dotsContainer || !nextBtn || !prevBtn) return;
    let current = 0;
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.toggle('active', i === 0);
      dot.addEventListener('click', () => {
        cards[current].removeAttribute('aria-selected');
        cards[current].style.transform = 'translateX(-100%)';
        current = i;
        cards[current].setAttribute('aria-selected', 'true');
        cards[current].style.transform = 'translateX(0)';
        dotsContainer.querySelector('.active').classList.remove('active');
        dot.classList.add('active');
      });
      dotsContainer.appendChild(dot);
    });
    nextBtn.addEventListener('click', () => {
      cards[current].removeAttribute('aria-selected');
      cards[current].style.transform = 'translateX(-100%)';
      current = (current + 1) % cards.length;
      cards[current].setAttribute('aria-selected', 'true');
      cards[current].style.transform = 'translateX(0)';
      dotsContainer.querySelector('.active').classList.remove('active');
      dotsContainer.children[current].classList.add('active');
    });
    prevBtn.addEventListener('click', () => {
      cards[current].removeAttribute('aria-selected');
      cards[current].style.transform = 'translateX(100%)';
      current = (current - 1 + cards.length) % cards.length;
      cards[current].setAttribute('aria-selected', 'true');
      cards[current].style.transform = 'translateX(0)';
      dotsContainer.querySelector('.active').classList.remove('active');
      dotsContainer.children[current].classList.add('active');
    });
  } catch (err) {
    console.error('Testimonials error:', err);
  }
}

function initPricingChart() {
  try {
    const ctx = document.getElementById('pricingChart').getContext('2d');
    if (!ctx) return;
    const gradientFree = ctx.createLinearGradient(0, 0, 0, 200);
    gradientFree.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
    gradientFree.addColorStop(1, 'rgba(255, 215, 0, 0.2)');
    const gradientElite = ctx.createLinearGradient(0, 0, 0, 200);
    gradientElite.addColorStop(0, '#00E6FF');
    gradientElite.addColorStop(1, '#FF00CC');
    const gradientDiamond = ctx.createLinearGradient(0, 0, 0, 200);
    gradientDiamond.addColorStop(0, '#FF00CC');
    gradientDiamond.addColorStop(1, '#FFD700');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Free', 'Elite', 'Diamond'],
        datasets: [{
          label: 'Features',
          data: [4, 8, 12],
          backgroundColor: [gradientFree, gradientElite, gradientDiamond],
          borderColor: ['#FFD700', '#00E6FF', '#FF00CC'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(10, 0, 31, 0.9)',
            borderColor: '#00E6FF',
            borderWidth: 1,
            bodyColor: '#FFD700',
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
            title: { display: true, text: 'Feature Count', color: '#FFD700', font: { size: 12 } },
            grid: { color: 'rgba(0, 230, 255, 0.1)' },
            ticks: { color: '#E0E0E0', font: { size: 10 } }
          },
          x: {
            title: { display: true, text: 'Plan', color: '#FFD700', font: { size: 12 } },
            ticks: { color: '#E0E0E0', font: { size: 10 } }
          }
        }
      }
    });
  } catch (err) {
    console.error('Pricing chart error:', err);
  }
}

function initForm() {
  try {
    const form = document.getElementById('bioForm');
    const platformSelect = document.getElementById('platform');
    const charCount = document.getElementById('charCount');
    const maxChars = document.getElementById('maxChars');
    const bioOutput = document.getElementById('bioOutput');
    const copyBio = document.getElementById('copyBio');
    const downloadBio = document.getElementById('downloadBio');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareLinkedIn = document.getElementById('shareLinkedIn');
    const saveBioBtn = document.getElementById('saveBio');
    if (!form || !platformSelect || !charCount || !maxChars || !bioOutput || !copyBio || !downloadBio || !shareTwitter || !shareLinkedIn || !saveBioBtn) return;

    platformSelect.addEventListener('change', () => {
      maxChars.textContent = platformLimits[platformSelect.value];
      charCount.textContent = bioOutput.textContent.length;
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (userTier === 'Free' && bioCount >= 3) {
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
          body: JSON.stringify({ purpose, location, platform, tone, fingerprint })
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        if (data.error) {
          alert(data.error);
          return;
        }
        bioOutput.textContent = data.bio;
        charCount.textContent = data.bio.length;
        bioCount++;
        const storedData = JSON.parse(localStorage.getItem('sparkvibe_data') || '{}');
        storedData.count = bioCount;
        localStorage.setItem('sparkvibe_data', JSON.stringify(storedData));
        checkBioLimit();
        shareTwitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.bio + ' Created with SparkVibe! https://sparkvibe.ai')}`;
        shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://sparkvibe.ai')}&title=${encodeURIComponent('Check out my new bio created with SparkVibe!')}`;
      } catch (err) {
        console.error('Bio generation error:', err);
        alert('Error generating bio. Try again later.');
      } finally {
        document.getElementById('loading').style.display = 'none';
      }
    });

    copyBio.addEventListener('click', () => {
      try {
        navigator.clipboard.writeText(bioOutput.textContent);
        copyBio.textContent = 'Copied!';
        copyBio.style.transform = 'scale(1.1)';
        setTimeout(() => {
          copyBio.textContent = '📋 Copy Bio';
          copyBio.style.transform = 'scale(1)';
        }, 2000);
      } catch (err) {
        console.error('Copy error:', err);
        alert('Failed to copy bio.');
      }
    });

    downloadBio.addEventListener('click', () => {
      try {
        const blob = new Blob([bioOutput.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sparkvibe_bio.txt';
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Download error:', err);
        alert('Failed to download bio.');
      }
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
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        alert(data.message);
      } catch (err) {
        console.error('Save bio error:', err);
        alert('Error saving bio. Try again later.');
      }
    });
  } catch (err) {
    console.error('Form initialization error:', err);
  }
}

function initThemeSelector() {
  try {
    const themeSelect = document.getElementById('themeSelect');
    const themeToggle = document.getElementById('themeToggle');
    if (!themeSelect || !themeToggle) return;
    if (userTier !== 'Free') {
      themeSelect.disabled = false;
      themeToggle.disabled = false;
    }
    themeSelect.addEventListener('change', () => {
      document.body.className = themeSelect.value;
    });
    themeToggle.addEventListener('click', () => {
      const themes = ['dark-theme', 'light-theme', 'cosmic-theme', 'ocean-theme', 'forest-theme'];
      const current = themes.indexOf(document.body.className);
      document.body.className = themes[(current + 1) % themes.length];
      themeSelect.value = document.body.className;
    });
  } catch (err) {
    console.error('Theme selector error:', err);
  }
}

function initCountdown() {
  try {
    const timer = document.getElementById('timer');
    if (!timer) return;
    let timeLeft = 24 * 60 * 60;
    setInterval(() => {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timeLeft--;
      if (timeLeft < 0) timeLeft = 24 * 60 * 60;
    }, 1000);
  } catch (err) {
    console.error('Countdown error:', err);
  }
}
