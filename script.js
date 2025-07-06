```javascript
const { useState, useEffect } = React;

const names = [
  "Aarav Sharma", "Priya Patel", "Vikram Singh", "Ananya Gupta", "Rohan Desai",
  "Emma Johnson", "Liam Brown", "Sophia Davis", "Noah Wilson", "Olivia Taylor"
];

const platforms = [
  { name: "Twitter", maxLength: 160 },
  { name: "LinkedIn", maxLength: 2000 },
  { name: "Instagram", maxLength: 150 },
  { name: "Facebook", maxLength: 250 },
  { name: "Personal Website", maxLength: 500 }
];

const generateBio = (name, profession, platform) => {
  const templates = {
    Twitter: `${name} | ${profession} 🚀 Passionate about innovation & impact! #AI #Tech`,
    LinkedIn: `${name} | ${profession} | Experienced professional driving change through technology and leadership. Connect with me to collaborate! 🌟`,
    Instagram: `${name} | ${profession} ✨ Sharing my journey in tech & life! DM for collabs!`,
    Facebook: `${name} | ${profession} | Love creating and connecting. Join my journey! 😎`,
    "Personal Website": `${name} | ${profession} | Welcome to my world of creativity and innovation. Explore my projects and get in touch! 🌐`
  };
  return templates[platform] || "Select a platform to generate a bio!";
};

const generateComment = () => {
  const comments = [
    "You're unstoppable! Keep shining! 🌟",
    "Your vibe is electric! ⚡️",
    "Inspiring the world, one bio at a time! 🚀",
    "Your future is neon bright! ✨",
    "Keep sparking vibes everywhere! 😎"
  ];
  return comments[Math.floor(Math.random() * comments.length)];
};

const App = () => {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [platform, setPlatform] = useState("");
  const [bio, setBio] = useState("");
  const [footerComment, setFooterComment] = useState(generateComment());

  useEffect(() => {
    const interval = setInterval(() => setFooterComment(generateComment()), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = () => {
    if (name && profession && platform) {
      const generatedBio = generateBio(name, profession, platform);
      setBio(generatedBio);
    } else {
      setBio("Please fill all fields! 😅");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bio);
    alert("Bio copied to clipboard! 📋");
  };

  const handleShare = (platform) => {
    const urls = {
      Twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(bio)}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(bio)}`,
      Instagram: `https://www.instagram.com/`
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center neon-glow mb-8">SparkVibe AI Bio Generator 🌟</h1>

      <div className="slider-container mb-8">
        <div className="slider">
          {[...names, ...names].map((name, index) => (
            <span key={index} className="inline-block mx-4 text-lg text-white neon-glow">{name}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <input
            type="text"
            placeholder="Your Name 😊"
            className="input-field w-full mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Profession 💼"
            className="input-field w-full mb-4"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
          />
          <select
            className="input-field w-full mb-4"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">Select Platform 📱</option>
            {platforms.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <button
            className="share-button w-full"
            onClick={handleGenerate}
          >
            Generate Bio 🚀
          </button>
        </div>

        <div className="vision-box">
          <h2 className="text-2xl font-semibold mb-4">Generated Bio ✨</h2>
          <p className="mb-4">{bio || "Your bio will appear here! 😎"}</p>
          {bio && (
            <div className="flex space-x-4">
              <button className="share-button" onClick={handleCopy}>Copy 📋</button>
              <button className="share-button" onClick={() => handleShare("Twitter")}>Share on Twitter 🐦</button>
              <button className="share-button" onClick={() => handleShare("LinkedIn")}>Share on LinkedIn 💼</button>
              <button className="share-button" onClick={() => handleShare("Instagram")}>Share on Instagram 📸</button>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 p-4 text-center">
        <p className="text-lg neon-glow">{footerComment}</p>
        <p className="mt-2">
          <a href="contact.html" className="text-cyan-400 hover:text-pink-400">Contact Us 📧</a> | 
          <a href="privacy.html" className="text-cyan-400 hover:text-pink-400"> Privacy Policy 🔒</a>
        </p>
      </footer>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```
