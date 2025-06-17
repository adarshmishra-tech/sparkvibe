// script.js
document.getElementById('suggestKeywords').addEventListener('click', async () => {
  const bioPurpose = document.getElementById('bioPurpose').value.trim();
  if (!bioPurpose) {
    alert('Please enter a Bio Purpose (e.g., love, tech).');
    return;
  }
  const select = document.getElementById('keywords');
  try {
    const res = await fetch('https://sparkvibe-1.onrender.com/api/suggest-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bioPurpose })
    });
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    select.innerHTML = '<option value="">Select Keyword</option>';
    data.keywords.forEach(keyword => {
      const option = document.createElement('option');
      option.value = keyword;
      option.textContent = keyword;
      select.appendChild(option);
    });
  } catch (err) {
    alert('Suggest failed: ' + err.message);
    console.error(err);
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
    useEmoji: document.getElementById('useEmoji').value === 'true'
  };
  if (!formData.keywords) {
    alert('Please select a keyword.');
    return;
  }
  const output = document.getElementById('bioOutput');
  const charCount = document.getElementById('charCount');
  try {
    const res = await fetch('https://sparkvibe-1.onrender.com/api/generate-bios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    const maxChars = { Instagram: 150, Twitter: 160, LinkedIn: 200, TikTok: 150, Tinder: 500, Bumble: 300 }[formData.platform] || 150;
    output.innerHTML = data.bios.map((bio, index) => `
      <div class="p-3 border rounded-lg shadow-sm bg-white">
        <p class="break-words">${bio.text}</p>
        <button class="mt-2 bg-teal-600 text-white p-1 rounded copy-btn" data-index="${index}">Copy</button>
        <p class="mt-1 text-sm">Chars: ${bio.length}/${maxChars}</p>
      </div>
    `).join('');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        navigator.clipboard.writeText(data.bios[index].text).then(() => alert('Copied to clipboard!'));
      });
    });
    charCount.textContent = `Max Chars: ${maxChars}`;
    fetch('https://sparkvibe-1.onrender.com/api/current-date')
      .then(res => res.json())
      .then(data => document.getElementById('currentDate').textContent = data.date)
      .catch(() => document.getElementById('currentDate').textContent = 'Date unavailable');
  } catch (err) {
    output.innerHTML = `<p class="text-red-500 p-3">Error: ${err.message}. Please try again.</p>`;
    console.error(err);
  }
});
