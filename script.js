const platform_context = {
  Instagram: { limit: 150 },
  LinkedIn: { limit: 200 },
  Twitter: { limit: 160 },
  TikTok: { limit: 150 },
  Tinder: { limit: 300 }
};

document.getElementById('theme').addEventListener('change', (e) => {
  const form = document.getElementById('bioForm');
  form.classList.remove('theme-cosmic_glow', 'theme-neon_pulse');
  form.classList.add(`theme-${e.target.value}`);
});

const suggestBtn = document.getElementById('suggestKeywords');
const keywordDropdown = document.getElementById('keywordDropdown');
const bioPurposeInput = document.getElementById('bioPurpose');
const keywordsInput = document.getElementById('keywords');

suggestBtn.addEventListener('click', async () => {
  const bioPurpose = bioPurposeInput.value.trim();
  keywordDropdown.classList.toggle('hidden');
  if (!bioPurpose) {
    keywordDropdown.innerHTML = '<div class="p-2 text-gray-400 text-center">Enter Bio Purpose to see suggestions</div>';
    return;
  }
  try {
    const res = await fetch('https://sparkvibe-1.onrender.com/api/suggest-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bioPurpose }),
      timeout: 5000
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    if (data.error) {
      keywordDropdown.innerHTML = `<div class="p-2 text-red-400 text-center">${data.error}</div>`;
    } else {
      keywordDropdown.innerHTML = data.keywords.map(kw => `
        <div class="p-2 hover:bg-gray-600 text-white cursor-pointer transition-all duration-200" onclick="document.getElementById('keywords').value='${kw.replace(/'/g, "\\'")}'; document.getElementById('keywordDropdown').classList.add('hidden');">${kw}</div>
      `).join('');
    }
  } catch (err) {
    console.error('Keyword Error:', err);
    keywordDropdown.innerHTML = '<div class="p-2 text-red-400 text-center">Failed to load keywords. Try again.</div>';
  }
});

bioPurposeInput.addEventListener('input', () => {
  keywordDropdown.classList.add('hidden');
  keywordDropdown.innerHTML = '<div class="p-2 text-gray-400 text-center">Enter Bio Purpose to see suggestions</div>';
});

document.getElementById('bioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    theme: document.getElementById('theme').value,
    bioPurpose: document.getElementById('bioPurpose').value.trim(),
    location: document.getElementById('location').value.trim(),
    platform: document.getElementById('platform').value,
    tone: document.getElementById('tone').value,
    keywords: document.getElementById('keywords').value.trim() || 'pro',
    emojiStyle: document.getElementById('emojiStyle').value
  };

  if (!formData.bioPurpose) {
    alert('Please enter a Bio Purpose (e.g., Dancing Coach).');
    return;
  }

  try {
    const res = await fetch('https://sparkvibe-1.onrender.com/api/generate-bios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      timeout: 5000
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    const output = document.getElementById('bioOutput');
    const maxChars = platform_context[formData.platform].limit;
    document.getElementById('maxChars').textContent = maxChars;
    if (data.error) {
      output.innerHTML = `<div class="p-4 text-red-400">${data.error}</div>`;
    } else {
      output.innerHTML = data.shortBios.map((bio, index) => `
        <div class="bio-box p-6 rounded-xl shadow-lg border-2 border-indigo-600/50 backdrop-blur-sm overflow-auto theme-${formData.theme} animate-slide-up">
          <p class="text-white break-words font-medium">${bio.text}</p>
          <div class="mt-4 flex justify-between items-center">
            <button class="copy-btn text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm" data-index="${index}">
              <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8"/></svg>
              Copy
            </button>
            <span class="text-sm text-gray-400">Chars: ${bio.length}/${maxChars}</span>
          </div>
        </div>
      `).join('');
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.getAttribute('data-index');
          navigator.clipboard.writeText(data.shortBios[index].text).then(() => alert('Copied to clipboard! 🌟'));
        });
      });
    }
  } catch (err) {
    console.error('Generate Error:', err);
    const maxChars = platform_context[formData.platform].limit;
    const fallbackBios = [
      { text: `${formData.bioPurpose} shining in ${formData.location || 'the world'} with ${formData.tone} energy. ${formData.keywords} #SparkVibe`, length: 0 },
      { text: `${formData.bioPurpose} crafting ${formData.tone} stories on ${formData.platform}. ${formData.keywords} #SparkVibe`, length: 0 },
      { text: `${formData.bioPurpose} leading with ${formData.keywords} in ${formData.location || 'global'} vibes. #SparkVibe`, length: 0 }
    ].map(bio => {
      const length = bio.text.length;
      return { text: bio.text.length > maxChars ? bio.text.substring(0, maxChars - 3) + '...' : bio.text, length: Math.min(length, maxChars) };
    });
    document.getElementById('bioOutput').innerHTML = fallbackBios.map((bio, index) => `
      <div class="bio-box p-6 rounded-xl shadow-lg border-2 border-indigo-600/50 backdrop-blur-sm overflow-auto theme-${formData.theme} animate-slide-up">
        <p class="text-white break-words font-medium">${bio.text}</p>
        <div class="mt-4 flex justify-between items-center">
          <button class="copy-btn text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm" data-index="${index}">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8"/></svg>
            Copy
          </button>
          <span class="text-sm text-gray-400">Chars: ${bio.length}/${maxChars}</span>
        </div>
      </div>
    `).join('');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        navigator.clipboard.writeText(fallbackBios[index].text).then(() => alert('Copied to clipboard! 🌟'));
      });
    });
  }
});

document.getElementById('bioPurpose').addEventListener('input', updateCharCount);
document.getElementById('platform').addEventListener('change', updateCharCount);

function updateCharCount() {
  const charCount = document.getElementById('charCount');
  const platform = document.getElementById('platform').value;
  const maxChars = platform_context[platform].limit;
  const currentLength = document.getElementById('bioPurpose').value.length;
  charCount.textContent = `Characters: ${currentLength}/${maxChars}`;
  document.getElementById('maxChars').textContent = maxChars;
}

fetch('https://sparkvibe-1.onrender.com/api/current-date')
  .then(res => res.json())
  .then(data => {
    document.getElementById('currentDate').textContent = data.date;
  })
  .catch(err => {
    document.getElementById('currentDate').textContent = 'Date unavailable';
  });
