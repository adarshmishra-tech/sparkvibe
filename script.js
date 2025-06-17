// script.js
document.getElementById('suggestKeywords').addEventListener('click', async () => {
  const bioPurpose = document.getElementById('bioPurpose').value.trim();
  if (!bioPurpose) {
    alert('Enter a Bio Purpose (e.g., love).');
    return;
  }
  const select = document.getElementById('keywords');
  try {
    const res = await fetch('https://sparkvibe-1.onrender.com/api/suggest-keywords', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bioPurpose })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    select.innerHTML = '<option value="">Select Keyword</option>';
    data.keywords.forEach(k => {
      const option = document.createElement('option');
      option.value = k;
      option.textContent = k;
      select.appendChild(option);
    });
  } catch (err) {
    alert('Suggest failed: ' + err.message);
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
    alert('Select a keyword.');
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
    if (!res.ok) throw new Error('Network issue');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    const maxChars = { Instagram: 150, LinkedIn: 200 }[formData.platform] || 150;
    output.innerHTML = data.bios.map((bio, i) => `
      <div class="p-2 border rounded">
        <p>${bio.text}</p>
        <button class="mt-2 bg-teal-600 text-white p-1 rounded copy-btn" data-index="${i}">Copy</button>
        <p>Chars: ${bio.length}/${maxChars}</p>
      </div>
    `).join('');
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        navigator.clipboard.writeText(data.bios[index].text).then(() => alert('Copied!'));
      });
    });
    charCount.textContent = `Chars: 0/${maxChars}`;
  } catch (err) {
    output.innerHTML = `<p class="text-red-500">Error: ${err.message}. Try again.</p>`;
  }
});
