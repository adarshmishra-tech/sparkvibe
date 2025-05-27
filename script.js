document.addEventListener('DOMContentLoaded', () => {
  // Particle Background (Optimized and Simplified)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('particle-bg').appendChild(renderer.domElement);

  const particles = new THREE.BufferGeometry();
  const particleCount = 80; // Reduced for smoother experience
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x00e6ff, size: 0.15, transparent: true, opacity: 0.4 });
  const particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);
  camera.position.z = 25;

  function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.0005; // Slower rotation
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // 3D Tilt Effect (Reduced Intensity)
  VanillaTilt.init(document.querySelector('.container'), {
    max: 4, // Reduced tilt
    speed: 1200,
    glare: true,
    'max-glare': 0.3 // Reduced glare
  });

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    darkModeToggle.textContent = document.body.classList.contains('light-mode') ? '🌑 Dark Mode' : '🌙 Dark Mode';
  });

  // Character Counter
  const platformSelect = document.getElementById('platform');
  const businessTypeInput = document.getElementById('businessType');
  const charCount = document.getElementById('charCount');
  const maxCharsSpan = document.getElementById('maxChars');
  const platformCharLimits = {
    Instagram: 150,
    LinkedIn: 2000,
    TikTok: 80,
    Twitter: 160
  };

  platformSelect.addEventListener('change', () => {
    maxCharsSpan.textContent = platformCharLimits[platformSelect.value] || 150;
    updateCharCount();
  });

  businessTypeInput.addEventListener('input', updateCharCount);

  function updateCharCount() {
    charCount.textContent = businessTypeInput.value.length;
  }

  // Form Submission
  const bioForm = document.getElementById('bioForm');
  const bioOutput = document.getElementById('bioOutput');
  const loading = document.getElementById('loading');
  const copyBio = document.getElementById('copyBio');
  const shareTwitter = document.getElementById('shareTwitter');
  const bioHistory = document.getElementById('bioHistory');

  bioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loading.classList.add('visible');
    bioOutput.innerText = '';
    copyBio.classList.remove('visible');
    shareTwitter.style.display = 'none';
    const businessType = document.getElementById('businessType').value;
    const location = document.getElementById('location').value;
    const tone = document.getElementById('tone').value;
    const platform = platformSelect.value;

    try {
      const response = await fetch('http://localhost:3000/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, location, tone, platform })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!data.bio) throw new Error('No bio returned from API');
      bioOutput.innerText = data.bio.trim();
      loading.classList.remove('visible');
      copyBio.classList.add('visible');
      shareTwitter.style.display = 'inline-block';

      // Save to localStorage
      const history = JSON.parse(localStorage.getItem('bioHistory') || '[]');
      history.unshift({ bio: data.bio, platform, timestamp: new Date().toLocaleString() });
      localStorage.setItem('bioHistory', JSON.stringify(history.slice(0, 5)));
      updateHistory();

      // Copy Bio
      copyBio.onclick = () => {
        navigator.clipboard.writeText(data.bio);
        copyBio.textContent = '✅ Copied!';
        setTimeout(() => { copyBio.textContent = '📋 Copy Bio'; }, 2000);
      };

      // Twitter Share
      shareTwitter.onclick = () => {
        const tweet = encodeURIComponent(`Check out my ${platform} bio made with SparkVibe! ${data.bio} Try it: your-domain.com`);
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
      };
    } catch (error) {
      console.error('Error:', error.message);
      bioOutput.innerText = 'Failed to generate bio. Please check your API key or try again.';
      loading.classList.remove('visible');
    }
  });

  // Load History
  function updateHistory() {
    const history = JSON.parse(localStorage.getItem('bioHistory') || '[]');
    bioHistory.innerHTML = history.map(item => `<li>${item.bio} <br><small>${item.platform} - ${item.timestamp}</small></li>`).join('');
    bioHistory.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        navigator.clipboard.writeText(item.textContent.split('\n')[0]);
        alert('Bio copied to clipboard!');
      });
    });
  }
  updateHistory();
});