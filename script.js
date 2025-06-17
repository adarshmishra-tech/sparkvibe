// script.js
// Keyword suggestion dropdown
document.getElementById('suggestKeywords').addEventListener('click', async () => {
  const bioPurpose = document.getElementById('bioPurpose').value;
  if (!bioPurpose) {
    alert('Please enter a Bio Purpose first.');
    return;
  }
  try {
    const res = await fetch('/api/suggest-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bioPurpose })
    });
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
    alert('Failed to suggest keywords. Check connection.');
  }
});

// Bio form submission with three options
document.getElementById('bioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    theme: document.getElementById('theme').value,
    bioPurpose: document.getElementById('bioPurpose').value,
    location: document.getElementById('location').value,
    platform: document.getElementById('platform').value,
    tone: document.getElementById('tone').value,
    keywords: document.getElementById('keywords').value,
    useEmoji: document.getElementById('useEmoji').value === 'true'
  };

  try {
    const res = await fetch('/api/generate-bios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    const output = document.getElementById('bioOutput');
    const maxChars = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[formData.platform] || 200;
    document.getElementById('maxChars').textContent = maxChars;
    if (data.error) {
      output.innerHTML = `<div class="p-4 text-red-500">${data.error}</div>`;
    } else {
      output.innerHTML = data.bios.map((bio, index) => `
        <div class="bg-white/80 p-6 rounded-xl shadow-lg border-2 border-teal-500/50 backdrop-blur-sm overflow-auto max-h-72 sm:max-h-64 md:max-h-80">
          <p class="text-gray-900 break-words">${bio.text}</p>
          <div class="mt-4 flex justify-between">
            <button class="copy-btn bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-all duration-300" data-index="${index}">Copy 📋</button>
            <button class="download-btn bg-coral-500 text-white px-4 py-2 rounded-lg hover:bg-coral-600 transition-all duration-300" data-index="${index}">Download 💾</button>
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
      document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = btn.getAttribute('data-index');
          const blob = new Blob([data.bios[index].text], { type: 'text/plain' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bio_option_${index + 1}_${new Date().toISOString().split('T')[0]}.txt`;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      });
    }
  } catch (err) {
    document.getElementById('bioOutput').innerHTML = '<div class="p-4 text-red-500">Network error. Please try again.</div>';
    console.error('Network Error:', err);
  }
});

// Character counter
document.getElementById('bioPurpose').addEventListener('input', () => {
  const charCount = document.getElementById('charCount');
  charCount.textContent = `Characters: ${document.getElementById('bioPurpose').value.length}/150`;
});

// Dynamic date
fetch('/api/current-date')
  .then(res => res.json())
  .then(data => {
    document.getElementById('currentDate').textContent = data.date;
  })
  .catch(err => {
    document.getElementById('currentDate').textContent = 'Date unavailable';
  });
