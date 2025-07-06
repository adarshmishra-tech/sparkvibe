<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SPARKVIBE - Elite Bio Creator</title>
  <title>SPARKVIBE - Elite Bio Master</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Orbitron:wght@700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <style>
    body { 
      background: linear-gradient(to bottom right, #0A0F2E, #1A1A3D, #000000) !important; 
      background-attachment: fixed !important; 
    }
    .starfield { background: none !important; }
  </style>
</head>
<body class="bg-gradient-to-br from-gray-900 to-black text-white font-poppins min-h-screen overflow-x-hidden">
  <div id="particle-bg" class="fixed inset-0 -z-10"></div>
  <div class="container mx-auto px-6 py-8 max-w-xl">
    <header class="text-center py-12">
      <div class="hero-logo w-28 h-28 bg-gradient-to-r from-yellow-500 to-orange-600 border-4 border-yellow-400 rounded-full mx-auto animate-pulse"></div>
      <h1 class="text-5xl font-orbitron uppercase tracking-wider text-yellow-400 drop-shadow-2xl">SPARKVIBE</h1>
      <p class="text-2xl text-yellow-300 mt-3 drop-shadow-lg">Elite Bio Creator</p>
      <p class="text-lg text-gray-300 mt-2 drop-shadow-md">Unleash Your Professional Edge</p>
      <a href="#bioForm" class="cta-btn mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-gray-900 font-bold rounded-lg shadow-xl hover:shadow-2xl hover:bg-orange-500 transition-all duration-300">Craft Your Bio</a>
      <p class="countdown-timer text-sm text-gray-300 mt-3 bg-gray-800 bg-opacity-70 px-4 py-2 rounded-lg shadow-md drop-shadow-md">20% Off Ends in <span id="timer">13:46:00</span></p>
<body class="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-poppins min-h-screen overflow-x-hidden">
  <div class="starfield fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
    <canvas id="starCanvas"></canvas>
  </div>
  <div class="container mx-auto px-6 py-10 max-w-2xl">
    <header class="text-center py-14">
      <div class="hero-logo w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-700 border-4 border-amber-400 rounded-full mx-auto animate-pulse-smooth"></div>
      <h1 class="text-5xl font-orbitron uppercase tracking-widest text-amber-400 drop-shadow-xl">SPARKVIBE</h1>
      <p class="text-2xl text-amber-300 mt-4 drop-shadow-md">Elite Bio Master</p>
      <p class="text-lg text-gray-300 mt-2 drop-shadow-sm">Elevate Your Digital Presence</p>
      <a href="#bioForm" class="cta-btn mt-6 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-gray-900 font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 ease-in-out">Create Bio Now</a>
      <p class="countdown-timer text-sm text-gray-300 mt-3 bg-gray-800/60 px-4 py-2 rounded-xl shadow-md drop-shadow-md">20% Off Ends in <span id="timer">13:33:00</span></p>
</header>

    <section class="theme-controls text-center py-5">
    <section class="theme-controls text-center py-6">
<div class="theme-selector mb-8">
<label for="themeSelect" class="mr-4 text-gray-300 text-lg drop-shadow-md">Theme:</label>
<div class="relative inline-block">
          <select id="themeSelect" class="px-5 py-2 bg-gray-800 bg-opacity-60 text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none cursor-pointer w-52 drop-shadow-lg">
          <select id="themeSelect" class="px-5 py-2 bg-gray-800/70 text-gray-300 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out w-56 drop-shadow-lg">
<option value="cosmic-theme">Cosmic (Free)</option>
<option value="neon-pulse" disabled>Neon (Premium)</option>
<option value="aurora-blaze" disabled>Aurora (Premium)</option>
@@ -38,83 +47,62 @@ <h1 class="text-5xl font-orbitron uppercase tracking-wider text-yellow-400 drop-
</svg>
</div>
</div>
        <button id="themeToggle" class="theme-btn ml-4 px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-orange-500 transition-all duration-300 drop-shadow-lg" disabled>Unlock Themes</button>
        <button id="themeToggle" class="theme-btn ml-4 px-6 py-2 bg-amber-500 text-gray-900 font-semibold rounded-xl hover:bg-amber-600 transition duration-300 ease-in-out drop-shadow-lg" disabled>Unlock Themes</button>
</div>
</section>

    <div class="bio-generator-wrapper max-w-lg mx-auto bg-gray-800/70 rounded-xl p-6 mb-10 backdrop-blur-sm border-2 border-yellow-500/40 shadow-2xl">
      <form id="bioForm" class="grid gap-5">
        <label for="bioPurpose" class="text-xl text-gray-300 font-semibold drop-shadow-lg">Your Professional Vision</label>
        <input type="text" id="bioPurpose" class="px-5 py-2 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 drop-shadow-lg" required>
        <label for="location" class="text-xl text-gray-300 font-semibold drop-shadow-lg">Location (Optional)</label>
        <input type="text" id="location" class="px-5 py-2 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 drop-shadow-lg">
        <label for="platform" class="text-xl text-gray-300 font-semibold drop-shadow-lg">Platform</label>
        <select id="platform" class="px-5 py-2 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 drop-shadow-lg" required>
    <div class="bio-generator-wrapper max-w-lg mx-auto bg-gray-800/70 rounded-2xl p-7 mb-12 backdrop-blur-sm border border-amber-500/30 shadow-2xl">
      <form id="bioForm" class="grid gap-6">
        <label for="bioPurpose" class="text-xl text-gray-200 font-semibold drop-shadow-lg">Your Vision Statement</label>
        <input type="text" id="bioPurpose" class="px-5 py-3 bg-gray-900/80 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out drop-shadow-lg" required>
        <label for="location" class="text-xl text-gray-200 font-semibold drop-shadow-lg">Location (Optional)</label>
        <input type="text" id="location" class="px-5 py-3 bg-gray-900/80 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out drop-shadow-lg">
        <label for="platform" class="text-xl text-gray-200 font-semibold drop-shadow-lg">Select Platform</label>
        <select id="platform" class="px-5 py-3 bg-gray-900/80 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out drop-shadow-lg" required>
<option value="Instagram">📸 Instagram (150 chars)</option>
<option value="LinkedIn">💼 LinkedIn (2000 chars)</option>
<option value="TikTok">🎥 TikTok (80 chars)</option>
<option value="Twitter">🐦 Twitter (160 chars)</option>
</select>
        <label for="tone" class="text-xl text-gray-300 font-semibold drop-shadow-lg">Tone</label>
        <select id="tone" class="px-5 py-2 bg-gray-900 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 drop-shadow-lg" required>
        <label for="tone" class="text-xl text-gray-200 font-semibold drop-shadow-lg">Choose Tone</label>
        <select id="tone" class="px-5 py-3 bg-gray-900/80 text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-300 ease-in-out drop-shadow-lg" required>
<option value="Professional">💼 Professional</option>
<option value="Friendly">😄 Friendly</option>
<option value="Luxury">✨ Luxury</option>
<option value="Witty">😎 Witty</option>
</select>
        <div class="char-counter text-right text-base text-gray-300 drop-shadow-lg">Chars: <span id="charCount">0</span>/<span id="maxChars">150</span></div>
        <button type="submit" class="generate-btn w-full max-w-md mx-auto mt-5 px-7 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-gray-900 font-bold rounded-lg shadow-xl hover:shadow-2xl hover:bg-orange-500 transition-all duration-300">Generate Elite Bio</button>
        <div class="char-counter text-right text-base text-gray-200 drop-shadow-lg">Chars: <span id="charCount">0</span>/<span id="maxChars">150</span></div>
        <button type="submit" class="generate-btn w-full max-w-md mx-auto mt-6 px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-gray-900 font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:from-amber-600 hover:to-orange-700 transition duration-300 ease-in-out">Generate Elite Bio</button>
</form>

      <div id="loading" class="loading hidden text-center py-3 text-yellow-400 drop-shadow-lg">
        <span class="spinner inline-block w-7 h-7 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></span> Crafting...
      <div id="loading" class="loading hidden text-center py-3 text-amber-400 drop-shadow-lg">
        <span class="spinner inline-block w-7 h-7 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></span> Crafting Your Bio...
</div>

      <div id="bioOutput" class="max-w-md mx-auto p-4 bg-gray-900 bg-opacity-70 rounded-lg shadow-md text-center text-xl text-gray-300 drop-shadow-lg mt-5"></div>
      <div id="bioOutput" class="max-w-md mx-auto p-4 bg-gray-900/80 rounded-xl shadow-md text-center text-xl text-gray-200 drop-shadow-lg mt-6"></div>

      <div class="bio-actions flex flex-wrap justify-center gap-4 mt-4">
        <button id="copyBio" class="share-btn px-5 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-yellow-500 transition-all duration-300 drop-shadow-lg">📋 Copy</button>
        <button id="downloadBio" class="share-btn px-5 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-yellow-500 transition-all duration-300 drop-shadow-lg">📥 Download</button>
      <div class="bio-actions flex flex-wrap justify-center gap-4 mt-5">
        <button id="copyBio" class="share-btn px-5 py-2 bg-gray-900/80 text-gray-200 rounded-xl hover:bg-amber-500 transition duration-300 ease-in-out drop-shadow-lg">📋 Copy</button>
        <button id="downloadBio" class="share-btn px-5 py-2 bg-gray-900/80 text-gray-200 rounded-xl hover:bg-amber-500 transition duration-300 ease-in-out drop-shadow-lg">📥 Download</button>
</div>
</div>

    <div class="ratings-section text-center py-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl mb-10 border-2 border-yellow-500/40">
      <h2 class="text-2xl font-semibold text-yellow-400 drop-shadow-2xl">Premium User Testimonials</h2>
      <div id="ratingCarousel" class="mt-5 text-gray-300 drop-shadow-lg overflow-hidden">
        <div class="rating-slide flex flex-col items-center">
          <p>Aarav Kapoor: ★★★★★ (Revolutionized my career!)</p>
          <p>Sophia Miller: ★★★★☆ (Perfect for branding)</p>
        </div>
        <div class="rating-slide flex flex-col items-center hidden">
          <p>Deepika Reddy: ★★★★★ (Exceptional quality)</p>
          <p>James Wilson: ★★★★☆ (Highly effective)</p>
        </div>
        <div class="rating-slide flex flex-col items-center hidden">
          <p>Karan Singh: ★★★★★ (Elite toolset)</p>
          <p>Olivia Brown: ★★★★☆ (Great support)</p>
        </div>
        <div class="rating-slide flex flex-col items-center hidden">
          <p>Shalini Mehta: ★★★★★ (Top-tier design)</p>
          <p>Thomas Clark: ★★★★☆ (Very reliable)</p>
        </div>
        <div class="rating-slide flex flex-col items-center hidden">
          <p>Rohan Desai: ★★★★★ (Game-changer)</p>
          <p>Emma Taylor: ★★★★☆ (Excellent results)</p>
        </div>
      </div>
    <div class="ratings-section text-center py-8 bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-2xl shadow-2xl mb-12 border border-amber-500/30">
      <h2 class="text-2xl font-semibold text-amber-400 drop-shadow-xl">Elite Testimonials</h2>
      <div id="ratingDisplay" class="mt-5 text-gray-200 drop-shadow-lg text-lg"></div>
</div>

    <div class="premium-benefits text-center py-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl border-2 border-yellow-500/40">
      <h2 class="text-2xl font-semibold text-yellow-400 drop-shadow-2xl">Elevate with Premium</h2>
    <div class="premium-benefits text-center py-8 bg-gradient-to-r from-gray-800/70 to-gray-900/70 rounded-2xl shadow-2xl border border-amber-500/30">
      <h2 class="text-2xl font-semibold text-amber-400 drop-shadow-xl">Go Premium</h2>
<div class="chart-container mt-5">
<canvas id="premiumChart" width="400" height="200"></canvas>
</div>
      <p class="text-base text-gray-300 mt-3 drop-shadow-lg">Special Offer: <span class="text-yellow-400">$7.99/mo</span> (20% Off)</p>
      <button id="buyNow" class="buy-btn mt-5 px-7 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg shadow-xl hover:shadow-2xl hover:bg-orange-500 transition-all duration-300 drop-shadow-lg hidden">Buy Now</button>
      <p class="text-base text-gray-200 mt-3 drop-shadow-lg">Exclusive Offer: <span class="text-amber-400">$7.99/mo</span> (20% Off)</p>
      <button id="buyNow" class="buy-btn mt-5 px-7 py-3 bg-amber-500 text-gray-900 font-bold rounded-xl shadow-2xl hover:shadow-3xl hover:bg-amber-600 transition duration-300 ease-in-out drop-shadow-lg hidden">Buy Now</button>
</div>

    <footer class="text-center py-5 bg-gray-800/70 rounded-xl shadow-xl mt-10">
      <p class="text-base text-gray-300 drop-shadow-md">© 2025 SparkVibe | All Rights Reserved</p>
    <footer class="text-center py-5 bg-gray-800/70 rounded-2xl shadow-xl mt-10">
      <p class="text-base text-gray-200 drop-shadow-md">© 2025 SparkVibe | All Rights Reserved</p>
</footer>
</div>
<script src="script.js"></script>
