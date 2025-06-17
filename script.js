document.getElementById('theme').addEventListener('change', (e) => {
  const form = document.getElementById('bioForm');
  form.classList.remove('theme-vibrant', 'theme-elegant');
  form.classList.add(`theme-${e.target.value}`);
});

const suggestBtn = document.getElementById('suggestKeywords');
const keywordDropdown = document.getElementById('keywordDropdown');
const bioPurposeInput = document.getElementById('bioPurpose');
const keywordsInput = document.getElementById('keywords');

suggestBtn.addEventListener('click', async () => {
  const bioPurpose = bioPurposeInput.value.trim();
  if (!bioPurpose) {
    keywordDropdown.innerHTML = '<div class="p-2 text-gray-500 text-center">Enter Bio Purpose to see suggestions</div>';
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
      keywordDropdown.innerHTML = `<div class="p-2 text-red-500 text-center">${data.error}</div>`;
    } else {
      keywordDropdown.innerHTML = data.keywords.map(kw => `
        <div class="p-2 hover:bg-gray-200 text-gray-900 cursor-pointer transition-all duration-200" onclick="document.getElementById('keywords').value='${kw.replace(/'/g, "\\'")}'; document.getElementById('keywordDropdown').classList.add('hidden');">${kw}</div>
      `).join('');
    }
  } catch (err) {
    console.error('Keyword Error:', err);
    keywordDropdown.innerHTML = '<div class="p-2 text-red-500 text-center">Failed to load keywords. Try again.</div>';
  }
});

bioPurposeInput.addEventListener('input', () => {
  keywordDropdown.innerHTML = '<div class="p-2 text-gray-500 text-center">Enter Bio Purpose to see suggestions</div>';
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
      output.innerHTML = `<div class="p-4 text-red-500">${data.error}</div>`;
    } else {
      output.innerHTML = data.bios.map((bio, index) => `
        <div class="bio-box bg-white/95 p-6 rounded-xl shadow-lg border-2 border-teal-600/30 backdrop-blur-sm overflow-auto max-h-64 sm:max-h-56 md:max-h-72 theme-${formData.theme} animate-fade-in">
          <p class="text-gray-900 break-words">${bio.text}</p>
          <div class="mt-4 flex justify-between">
            <button class="copy-btn bg-teal-700 text-white px-3 py-1 rounded-lg hover:bg-teal-800 transition-all duration-300 text-sm" data-index="${index}">
              <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8"/></svg>
              Copy
            </button>
          </div>
          <p class="mt-2 text-sm text-gray-600">Chars: ${bio.length}/${maxChars}</p>
        </div>
      `).join('');
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.getAttribute('data-index');
          navigator.clipboard.writeText(data.bios[index].text).then(() => alert('Copied to clipboard! ✨'));
        });
      });
    }
  } catch (err) {
    console.error('Generate Error:', err);
    const maxChars = platform_context[formData.platform].limit;
    const fallbackBios = [
      { text: `${formData.bioPurpose} excelling in ${formData.location || 'the world'} with ${formData.tone} flair. ${formData.keywords} ${platform_context[formData.platform].hashtag}`, length: 0 },
      { text: `${formData.bioPurpose} crafting ${formData.tone} stories on ${formData.platform}. ${formData.keywords} ${platform_context[formData.platform].hashtag}`, length: 0 },
      { text: `${formData.bioPurpose} leading with ${formData.keywords} in ${formData.location || 'global'} scenes. ${platform_context[formData.platform].hashtag}`, length: 0 }
    ].map(bio => {
      const length = bio.text.length;
      return { text: bio.text.length > maxChars ? bio.text.substring(0, maxChars - 3) + '...' : bio.text, length: Math.min(length, maxChars) };
    });
    document.getElementById('bioOutput').innerHTML = fallbackBios.map((bio, index) => `
      <div class="bio-box bg-white/95 p-6 rounded-xl shadow-lg border-2 border-teal-600/30 backdrop-blur-sm overflow-auto max-h-64 sm:max-h-56 md:max-h-72 theme-${formData.theme} animate-fade-in">
        <p class="text-gray-900 break-words">${bio.text}</p>
        <div class="mt-4 flex justify-between">
          <button class="copy-btn bg-teal-700 text-white px-3 py-1 rounded-lg hover:bg-teal-800 transition-all duration-300 text-sm" data-index="${index}">
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8"/></svg>
            Copy
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-600">Chars: ${bio.length}/${maxChars}</p>
      </div>
    `).join('');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        navigator.clipboard.writeText(fallbackBios[index].text).then(() => alert('Copied to clipboard! ✨'));
      });
    });
  }
});

document.getElementById('bioPurpose').addEventListener('input', () => {
  const charCount = document.getElementById('charCount');
  const platform = document.getElementById('platform').value;
  const maxChars = { Instagram: 150, LinkedIn: 200, Twitter: 160, TikTok: 150, Tinder: 300 }[platform] || 150;
  charCount.textContent = `Characters: ${document.getElementById('bioPurpose').value.length}/${maxChars}`;
});

fetch('https://sparkvibe-1.onrender.com/api/current-date')
  .then(res => res.json())
  .then(data => {
    document.getElementById('currentDate').textContent = data.date;
  })
  .catch(err => {
    document.getElementById('currentDate').textContent = 'Date unavailable';
  });
