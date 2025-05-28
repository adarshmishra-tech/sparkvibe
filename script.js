document.addEventListener('DOMContentLoaded', () => {
  // Particle Background (Optimized for Render)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('particle-bg').appendChild(renderer.domElement);

  const particles = new THREE.BufferGeometry();
  const particleCount = 50; // Reduced for Render performance
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 50;
    velocities[i] = (Math.random() - 0.5) * 0.01;
    velocities[i + 1] = (Math.random() - 0.5) * 0.01;
    velocities[i + 2] = (Math.random() - 0.5) * 0.01;
  }
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x00e6ff, size: 0.1, transparent: true, opacity: 0.5 });
  const particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);
  camera.position.z = 25;

  function animate() {
    requestAnimationFrame(animate);
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2;
      if (Math.abs(positions[i]) > 25) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 25) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 25) velocities[i + 2] *= -1;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.0002;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // 3D Tilt Effect
  VanillaTilt.init(document.querySelector('.container'), {
    max: 3,
    speed: 1500,
    glare: true,
    'max-glare': 0.2
  });

  // Theme Toggle
  const themeSelect = document.getElementById('themeSelect');
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const currentTheme = themeSelect.value;
    document.body.className = currentTheme;
    themeToggle.textContent = currentTheme === 'dark-theme' ? '🌙 Dark Theme' : `🌟 ${currentTheme.split('-')[0]} Theme`;
  });

  themeSelect.addEventListener('change', () => {
    document.body.className = themeSelect.value;
    themeToggle.textContent = `🌟 ${themeSelect.value.split('-')[0]} Theme`;
  });

  // Character Counter
  const platformSelect = document.getElementById('platform');
  const bioPurposeInput = document.getElementById('bioPurpose');
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

  bioPurposeInput.addEventListener('input', updateCharCount);

  function updateCharCount() {
    charCount.textContent = bioPurposeInput.value.length;
    const max = platformCharLimits[platformSelect.value] || 150;
    charCount.style.color = bioPurposeInput.value.length > max ? '#ff4d4d' : '#b0e0e6';
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
    const bioPurpose = document.getElementById('bioPurpose').value;
    const location = document.getElementById('location').value;
    const tone = document.getElementById('tone').value;
    const platform = platformSelect.value;

    try {
      const response = await fetch('/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bioPurpose, location, tone, platform })
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
      history.unshift({ bio: data.bio, platform, purpose: bioPurpose, timestamp: new Date().toLocaleString() });
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
        const tweet = encodeURIComponent(`Check out my SEO-optimized ${platform} bio from SparkVibe’s AI bio generator! ${data.bio} Try it: https://your-app-name.onrender.com #AIBioGenerator`);
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
      };
    } catch (error) {
      console.error('Error:', error.message);
      bioOutput.innerText = 'Failed to generate bio. Please try again.';
      loading.classList.remove('visible');
    }
  });

  // Load History
  function updateHistory() {
    const history = JSON.parse(localStorage.getItem('bioHistory') || '[]');
    bioHistory.innerHTML = history.map(item => `<li>${item.bio}<br><small>${item.platform} - ${item.purpose} - ${item.timestamp}</small></li>`).join('');
    bioHistory.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        navigator.clipboard.writeText(item.textContent.split('\n')[0]);
        alert('Bio copied to clipboard!');
      });
    });
  }
  updateHistory();
});
