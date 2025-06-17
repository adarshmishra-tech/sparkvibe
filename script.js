// script.js
// Keyword suggestion with retry
document.getElementById('suggestKeywords').addEventListener('click', async () => {
  const bioPurpose = document.getElementById('bioPurpose').value;
  if (!bioPurpose) {
    alert('Please enter a Bio Purpose first.');
    return;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('/api/suggest-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bioPurpose })
      });
      const data = await res.json();
      if (data.error) {
        if (res.status === 429) {
          alert(`Quota exceeded. Attempt ${attempt}/3. Please add OpenAI credits.`);
          continue;
        }
        alert(data.error);
      } else {
        document.getElementById('keywords').value = data.keywords;
      }
      break;
    } catch (err) {
      if (attempt === 3) alert('Failed to suggest keywords after 3 attempts. Check connection.');
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
  }
});

// Bio form submission with retry
document.getElementById('bioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    theme: document.getElementById('theme').value,
    bioPurpose: document.getElementById('bioPurpose').value,
    location: document.getElementById('location').value,
    platform: document.getElementById('platform').value,
    tone: document.getElementById('tone').value,
    keywords: document.getElementById('keywords').value
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      const output = document.getElementById('bioOutput');
      const charCount = document.getElementById('charCount');
      if (data.error) {
        output.classList.remove('hidden');
        output.textContent = data.error;
        output.classList.add('text-red-500');
        charCount.textContent = 'Characters: 0/150';
        if (res.status === 429) {
          alert(`Quota exceeded. Attempt ${attempt}/3. Please add OpenAI credits.`);
          continue;
        }
      } else {
        output.classList.remove('hidden', 'text-red-500');
        output.textContent = data.bio;
        charCount.textContent = `Characters: ${data.characters}/150`;
      }
      break;
    } catch (err) {
      if (attempt === 3) {
        document.getElementById('bioOutput').classList.remove('hidden');
        document.getElementById('bioOutput').textContent = 'Network error after 3 attempts.';
        document.getElementById('bioOutput').classList.add('text-red-500');
        document.getElementById('charCount').textContent = 'Characters: 0/150';
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
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
