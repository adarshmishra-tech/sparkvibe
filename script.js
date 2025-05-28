document.addEventListener('DOMContentLoaded', () => {
  // Particle Background
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('particle-bg').appendChild(renderer.domElement);

  const particleCount = 500; // Increased for density
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount); // For varied particle sizes

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 300; // Wider spread
    positions[i3 + 1] = (Math.random() - 0.5) * 300;
    positions[i3 + 2] = (Math.random() - 0.5) * 300;
    velocities[i3] = (Math.random() - 0.5) * 0.006; // Smooth movement
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.006;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.006;
    const colorChoice = Math.random();
    colors[i3] = colorChoice < 0.33 ? 0 : colorChoice < 0.66 ? 1 : 0.5; // Cyan, pink, purple
    colors[i3 + 1] = colorChoice < 0.33 ? 1 : colorChoice < 0.66 ? 0 : 0.5;
    colors[i3 + 2] = colorChoice < 0.33 ? 1 : colorChoice < 0.66 ? 1 : 1;
    sizes[i] = 0.2 + Math.random() * 0.3; // Varied sizes for depth
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending, // Neon glow
    sizeAttenuation: true // Size variation based on distance
  });

  const particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  const lines = [];
  function updateLines() {
    lines.forEach(line => scene.remove(line));
    lines.length = 0;
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const i3 = i * 3, j3 = j * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < 25) { // Increased connection range
          const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]),
            new THREE.Vector3(positions[j3], positions[j3 + 1], positions[j3 + 2])
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          scene.add(line);
          lines.push(line);
        }
      }
    }
  }

  camera.position.z = 70;

  function animate() {
    requestAnimationFrame(animate);
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      if (Math.abs(positions[i]) > 150) velocities[i] *= -1;
      if (Math.abs(positions[i + 1]) > 150) velocities[i + 1] *= -1;
      if (Math.abs(positions[i + 2]) > 150) velocities[i + 2] *= -1;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.rotation.y += 0.0002;
    updateLines();
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
    max: 5,
    speed: 1000,
    glare: true,
    'max-glare': 0.3
  });

  // Theme Toggle
  const themeSelect = document.getElementById('themeSelect');
  const themeToggle = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    document.body.className = '';
    document.body.classList.add(theme);
    themeToggle.textContent = theme === 'dark-theme' ? '🌙 Dark Theme' : `🌟 ${theme.split('-')[0]} Theme`;
  };

  themeToggle.addEventListener('click', () => {
    const currentTheme = themeSelect.value;
    applyTheme(currentTheme);
  });

  themeSelect.addEventListener('change', () => {
    const newTheme = themeSelect.value;
    applyTheme(newTheme);
  });

  applyTheme(themeSelect.value);

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
    charCount.style.color = bioPurposeInput.value.length > max ? '#ff4d4d' : '#00e6ff';
  }

  // Form Submission
  const bioForm = document.getElementById('bioForm');
  const bioOutput = document.getElementById('bioOutput');
  const loading = document.getElementById('loading');
  const copyBio = document.getElementById('copyBio');
  const shareTwitter = document.getElementById('shareTwitter');

  bioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loading.classList.add('visible');
    bioOutput.textContent = '';
    copyBio.classList.remove('visible');
    shareTwitter.style.display = 'none';

    const bioPurpose = bioPurposeInput.value.trim();
    const location = document.getElementById('location').value.trim();
    const tone = document.getElementById('tone').value;
    const platform = platformSelect.value;

    if (!bioPurpose) {
      bioOutput.textContent = 'Please enter a bio purpose.';
      loading.classList.remove('visible');
      return;
    }

    try {
      const response = await fetch('https://sparkvibe-1.onrender.com/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bioPurpose, location, tone, platform })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.bio) {
        throw new Error('No bio returned from server');
      }

      bioOutput.textContent = data.bio;
      loading.classList.remove('visible');
      copyBio.classList.add('visible');
      shareTwitter.style.display = 'inline-block';

      const history = JSON.parse(localStorage.getItem('bioHistory') || '[]');
      history.unshift({ bio: data.bio, platform, purpose: bioPurpose, timestamp: new Date().toLocaleString() });
      localStorage.setItem('bioHistory', JSON.stringify(history.slice(0, 5)));
      updateHistory();

      copyBio.onclick = () => {
        navigator.clipboard.writeText(data.bio);
        copyBio.textContent = '✅ Copied!';
        setTimeout(() => { copyBio.textContent = '📋 Copy Bio'; }, 2000);
      };

      shareTwitter.onclick = () => {
        const tweet = encodeURIComponent(`Check out my SEO-optimized ${platform} bio from SparkVibe’s AI bio generator! ${data.bio} Try it: https://sparkvibe-1.onrender.com #AIBioGenerator`);
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
      };
    } catch (error) {
      console.error('Error:', error.message);
      bioOutput.textContent = `Failed to generate bio: ${error.message}. Please try again or check your API key.`;
      loading.classList.remove('visible');
    }
  });

  function updateHistory() {
    const history = JSON.parse(localStorage.getItem('bioHistory') || '[]');
    const bioHistory = document.getElementById('bioHistory') || document.createElement('div');
    bioHistory.id = 'bioHistory';
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
