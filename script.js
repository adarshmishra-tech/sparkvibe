// Keyword suggestion dropdown
document.getElementById('suggestKeywords').addEventListener('click', async () => {
  const bioPurpose = document.getElementById('bioPurpose').value.trim();
  if (!bioPurpose) {
    alert('Please enter a Bio Purpose (e.g., Dating Coach, Tech Innovator).');
    return;
  }
  try {
    const res = await fetch('https://sparkvibe-1.onrender.com/api/suggest-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bioPurpose }),
      timeout: 5000
    });
    if (!res.ok) throw new Error(`Server response not OK: ${res.status}`);
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
    }
  } catch (err) {
    alert(`Failed to suggest keywords: ${err.message}. Using fallback keywords.`);
    console.error('Suggest Error:', err);
    // Fallback keywords
    const select = document.getElementById('keywords');
    select.innerHTML = '<option value="" disabled selected>Select a Keyword</option>';
    ['expert', 'guru', 'innovator'].forEach(keyword => {
      const option = document.createElement('option');
      option.value = keyword;
      option.textContent = keyword;
      select.appendChild(option);
    });
  }
});

// Bio form submission with three options
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
    if (!res.ok) throw new Error(`Server response not OK: ${res.status}`);
    const data = await res.json();
    const output = document.getElementById('bioOutput');
    const maxChars = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[formData.platform] || 200;
    document.getElementById('maxChars').textContent = maxChars;
    if (data.error) {
      output.innerHTML = `<div class="p-4 text-red-500">${data.error}</div>`;
    } else {
      output.innerHTML = data.bios.map((bio, index) => `
        <div class="bg-white/80 p-6 rounded-xl shadow-lg border-2 border-teal-500/50 backdrop-blur-sm overflow-auto max-h-72 sm:max-h-60 md:max-h-80">
          <p class="text-gray-900 break-words">${bio.text}</p>
          <div class="mt-4 flex justify-between">
            <button class="copy-btn bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-300" data-index="${index}">Copy 📋</button>
          </div>
          <p class="mt-2 text-sm text-gray-600">Chars: ${bio.length}/${maxChars}</p>
        </div>
      `).join('');
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.getAttribute('data-index');
          navigator.clipboard.writeText(data.bios[index].text).then(() => alert('Copied to clipboard! 🎉'));
        });
      });
    }
  } catch (err) {
    console.error('Generate Error:', err);
    // Fallback bio generation
    const maxChars = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[formData.platform] || 200;
    const fallbackBios = [
      { text: `${formData.bioPurpose} crafting excellence in ${formData.location || 'the world'}.`, length: 0 },
      { text: `${formData.bioPurpose} with ${formData.tone} vibes, ${formData.keywords}.`, length: 0 },
      { text: `${formData.bioPurpose} shining in ${formData.platform}, ${formData.keywords}.`, length: 0 }
    ].map(bio => {
      const length = bio.text.length;
      return { text: bio.text.length > maxChars ? bio.text.substring(0, maxChars - 3) + '...' : bio.text, length: Math.min(length, maxChars) };
    });
    document.getElementById('bioOutput').innerHTML = fallbackBios.map((bio, index) => `
      <div class="bg-white/80 p-6 rounded-xl shadow-lg border-2 border-teal-500/50 backdrop-blur-sm overflow-auto max-h-72 sm:max-h-60 md:max-h-80">
        <p class="text-gray-900 break-words">${bio.text}</p>
        <div class="mt-4 flex justify-between">
          <button class="copy-btn bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-300" data-index="${index}">Copy 📋</button>
        </div>
        <p class="mt-2 text-sm text-gray-600">Chars: ${bio.length}/${maxChars}</p>
      </div>
    `).join('');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        navigator.clipboard.writeText(fallbackBios[index].text).then(() => alert('Copied to clipboard! 🎉'));
      });
    });
  }
});

// Character counter
document.getElementById('bioPurpose').addEventListener('input', () => {
  const charCount = document.getElementById('charCount');
  charCount.textContent = `Characters: ${document.getElementById('bioPurpose').value.length}/150`;
});

// Dynamic date
fetch('https://sparkvibe-1.onrender.com/api/current-date')
  .then(res => res.json())
  .then(data => {
    document.getElementById('currentDate').textContent = data.date;
  })
  .catch(err => {
    document.getElementById('currentDate').textContent = 'Date unavailable';
  });
