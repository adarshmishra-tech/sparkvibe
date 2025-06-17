// script.js
const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY'); // Replace with your Stripe publishable key

// Bio form submission
document.getElementById('bioForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    name: document.getElementById('name').value,
    role: document.getElementById('role').value,
    industry: document.getElementById('industry').value,
    tone: document.getElementById('tone').value,
    platform: document.getElementById('platform').value,
    length: document.getElementById('length').value,
  };

  try {
    const res = await fetch('/api/generate-bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    const output = document.getElementById('bioOutput');
    if (data.error) {
      output.classList.remove('hidden');
      output.textContent = data.error;
      output.classList.add('text-red-500');
    } else {
      output.classList.remove('hidden', 'text-red-500');
      output.textContent = data.bio;
    }
  } catch (err) {
    document.getElementById('bioOutput').classList.remove('hidden');
    document.getElementById('bioOutput').textContent = 'Error generating bio';
    document.getElementById('bioOutput').classList.add('text-red-500');
  }
});

// Stripe premium checkout
document.getElementById('goPremium').addEventListener('click', async () => {
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const { id } = await res.json();
    await stripe.redirectToCheckout({ sessionId: id });
  } catch (err) {
    alert('Error initiating checkout');
  }
});

// Sliding reviews animation
const reviews = document.querySelectorAll('.review');
let currentReview = 0;
setInterval(() => {
  document.getElementById('reviews').style.transform = `translateX(-${currentReview * 336}px)`;
  currentReview = (currentReview + 1) % reviews.length;
}, 3000);
