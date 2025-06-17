document.getElementById('theme').addEventListener('change', (e) => {
  const form = document.getElementById('bioForm');
  form.classList.remove('theme-vibrant', 'theme-elegant');
  form.classList.add(`theme-${e.target.value}`);
});

document.getElementById('suggestKeywords').addEventListener('click', async () => {
  const bioPurpose = document.getElementById('bioPurpose').value.trim();
  if (!bioPurpose) {
    alert('Please enter a Bio Purpose (e.g., Dating Coach).');
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
      alert(data.error);
    } else {
      const select = document.getElementById('keywords');
      select.innerHTML = '<option value="" disabled selected>Select a Keyword</option>';
      data.keywords.forEach(keyword => {
        const option = document.createElement('option');
        option.value = keyword;
        option.textContent = keyword;
        select.appendChild(option);
      });
      select.focus();
    }
  } catch (err) {
    alert(`Failed to suggest keywords: ${err.message}. Using fallback keywords.`);
    console.error('Keyword Error:', err);
    const select = document.getElementById('keywords');
    select.innerHTML = '<option value="" disabled selected>Select a Keyword</option>';
    ['love wizard', 'romance pro', 'heart expert'].forEach(keyword => {
      const option = document.createElement('option');
      option.value = keyword;
      option.textContent = keyword;
      select.appendChild(option);
    });
  }
});

document.getElementById('bioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    theme: document.getElementById('theme').value,
    bioPurpose: document.getElementById('bioPurpose').value.trim(),
    location: document.getElementById('location').value.trim(),
    platform: document.getElementById('platform').value,
    tone: document.getElementById('tone').value,
    keywords: document.getElementById('keywords').value,
    emojiStyle: document.getElementById('emojiStyle').value
  };

  if (!formData.keywords) {
    alert('Please select a keyword from the suggested list.');
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
    const maxChars = 500;
    document.getElementById('maxChars').textContent = maxChars;
    if (data.error) {
      output.innerHTML = `<div class="p-4 text-red-500">${data.error}</div>`;
    } else {
      output.innerHTML = data.bios.map((bio, index) => `
        <div class="bio-box bg-white/95 p-6 rounded-xl shadow-lg border-2 border-teal-600/40 backdrop-blur-sm overflow-auto max-h-64 sm:max-h-56 md:max-h-72 theme-${formData.theme} animate-fade-in">
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
          navigator.clipboard.writeText(data.bios[index].text).then(() => alert('Copied to clipboard! 💖'));
        });
      });
    }
  } catch (err) {
    console.error('Generate Error:', err);
    const output = document.getElementById('bioOutput');
    const maxChars = 500;
    const fallbackBios = [
      { text: `${formData.bioPurpose} sparking ${formData.tone} connections in ${formData.location || 'the world'}. ${formData.keywords} #LoveSpark`, length: 0 },
      { text: `${formData.bioPurpose} with ${formData.tone} charm on Tinder. ${formData.keywords} #LoveSpark`, length: 0 },
      { text: `${formData.bioPurpose} igniting ${formData.keywords} in ${formData.location || 'global'} vibes. #LoveSpark`, length: 0 }
    ].map(bio => {
      const length = bio.text.length;
      return { text: bio.text.length > maxChars ? bio.text.substring(0, maxChars - 3) + '...' : bio.text, length: Math.min(length, maxChars) };
    });
    output.innerHTML = fallbackBios.map((bio, index) => `
      <div class="bio-box bg-white/95 p-6 rounded-xl shadow-lg border-2 border-teal-600/40 backdrop-blur-sm overflow-auto max-h-64 sm:max-h-56 md:max-h-72 theme-${formData.theme} animate-fade-in">
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
        navigator.clipboard.writeText(fallbackBios[index].text).then(() => alert('Copied to clipboard! 💖'));
      });
    });
  }
});

document.getElementById('bioPurpose').addEventListener('input', () => {
  const charCount = document.getElementById('charCount');
  charCount.textContent = `Characters: ${document.getElementById('bioPurpose').value.length}/500`;
});

fetch('https://sparkvibe-1.onrender.com/api/current-date')
  .then(res => res.json())
  .then(data => {
    document.getElementById('currentDate').textContent = data.date;
  })
  .catch(err => {
    document.getElementById('currentDate').textContent = 'Date unavailable';
  });
