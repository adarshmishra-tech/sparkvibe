// script.js
// Theme toggle (simulated for now, only dark theme)
document.getElementById('themeToggle').addEventListener('click', () => {
  alert('Dark Theme is active! More themes coming soon.');
});

// Bio form submission
document.getElementById('bioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    theme: document.getElementById('theme').value,
    bioPurpose: document.getElementById('bioPurpose').value,
    location: document.getElementById('location').value,
    platform: document.getElementById('platform').value,
    tone: document.getElementById('tone').value
  };

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
    } else {
      output.classList.remove('hidden', 'text-red-500');
      output.textContent = data.bio;
      charCount.textContent = `Characters: ${data.characters}/150`;
    }
  } catch (err) {
    document.getElementById('bioOutput').classList.remove('hidden');
    document.getElementById('bioOutput').textContent = 'Network error. Please try again.';
    document.getElementById('bioOutput').classList.add('text-red-500');
    document.getElementById('charCount').textContent = 'Characters: 0/150';
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
