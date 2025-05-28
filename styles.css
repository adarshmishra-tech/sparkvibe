body {
  font-family: 'Poppins', sans-serif;
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  background: #000;
  transition: background 0.5s ease, color 0.5s ease;
}

/* Theme-specific styles with high-contrast text */
.dark-theme {
  background: linear-gradient(135deg, #0a0a1f, #1c2526);
  color: #ffffff; /* Bright white for max visibility */
}
.light-theme {
  background: linear-gradient(135deg, #ffffff, #d4e4ff);
  color: #1a1a1a; /* Dark gray for contrast on light background */
}
.cosmic-theme {
  background: linear-gradient(135deg, #1a0033, #4b0082);
  color: #f0f0f5; /* Light purple for visibility on dark purple */
}
.ocean-theme {
  background: linear-gradient(135deg, #003087, #00c4ff);
  color: #ffffff; /* White for contrast on blue */
}
.forest-theme {
  background: linear-gradient(135deg, #1a3c34, #2e8b57);
  color: #f0f0e6; /* Off-white for visibility on green */

.light-theme .container,
.light-theme input,
.light-theme select,
.light-theme button,
.light-theme .loading,
.light-theme #bioOutput {
  background: rgba(255, 255, 255, 0.95); /* Opaque white for clarity */
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: #1a1a1a; /* Dark text for light theme */
}

#particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2; /* Behind container to avoid text overlap */
}

.container {
  background: rgba(20, 20, 50, 0.85); /* Higher opacity for text clarity */
  backdrop-filter: blur(15px); /* Reduced blur for sharper text */
  border: 2px solid rgba(0, 230, 255, 0.6);
  border-radius: 20px;
  padding: 40px;
  max-width: 95%;
  width: 700px;
  box-shadow: 0 0 50px rgba(0, 230, 255, 0.4), 0 0 20px rgba(255, 0, 204, 0.3);
  text-align: center;
  margin: 30px auto;
  z-index: 1; /* Above particles */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.container:hover {
  transform: scale(1.03);
  box-shadow: 0 0 70px rgba(0, 230, 255, 0.6), 0 0 30px rgba(255, 0, 204, 0.5);
}

h1 {
  font-size: 2.8rem;
  color: inherit; /* Inherit theme color for consistency */
  text-shadow: 0 0 5px rgba(0, 230, 255, 0.4); /* Subtle shadow */
  margin-bottom: 15px;
  letter-spacing: 1.5px;
  font-weight: 700; /* Bold for clarity */
}

.tagline {
  font-size: 1.3rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(255, 0, 204, 0.3);
  margin-bottom: 10px;
  font-weight: 500;
}

.social-proof {
  font-size: 1.1rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(0, 230, 255, 0.3);
  margin-bottom: 10px;
  font-weight: 500;
}

.free {
  font-size: 1rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(0, 230, 255, 0.3);
  margin-bottom: 25px;
  font-weight: 500;
}

.theme-btn, .glowing, .copy-btn, .share-btn {
  padding: 12px 30px;
  background: linear-gradient(45deg, #00e6ff, #ff00cc);
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 230, 255, 0.5);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.theme-btn:hover, .glowing:hover, .copy-btn:hover, .share-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(0, 230, 255, 0.7);
}
.theme-btn:focus, .glowing:focus, .copy-btn:focus, .share-btn:focus {
  outline: 2px solid #ff00cc;
  outline-offset: 2px;
}
.theme-btn::after, .glowing::after, .copy-btn::after, .share-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: 0.5s;
}
.theme-btn:hover::after, .glowing:hover::after, .copy-btn:hover::after, .share-btn:hover::after {
  left: 100%;
}

.theme-selector {
  margin: 20px 0;
}

label {
  display: block;
  font-size: 1rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(0, 230, 255, 0.3);
  text-align: left;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid rgba(0, 230, 255, 0.6);
  border-radius: 10px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  box-shadow: 0 0 10px rgba(0, 230, 255, 0.3);
  transition: all 0.3s ease;
  font-weight: 500;
}
input:focus, select:focus {
  outline: none;
  border-color: #ff00cc;
  box-shadow: 0 0 15px rgba(255, 0, 204, 0.5);
  background: rgba(255, 255, 255, 0.15);
}
select option {
  background: #0a0a1f;
  color: #ffffff;
  font-size: 1rem;
}

.char-counter {
  font-size: 1rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(0, 230, 255, 0.3);
  margin: 10px 0;
  font-weight: 500;
}

.loading {
  font-size: 1.1rem;
  color: inherit;
  text-shadow: 0 0 4px rgba(0, 230, 255, 0.4);
  margin-top: 20px;
  display: none;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}
.loading.visible {
  display: flex;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 4px solid #00e6ff;
  border-top: 4px solid #ff00cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

#bioOutput {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(0, 230, 255, 0.6);
  border-radius: 10px;
  color: inherit;
  font-size: 1rem;
  white-space: pre-wrap;
  text-align: left;
  box-shadow: 0 0 15px rgba(0, 230, 255, 0.3);
  transition: all 0.3s ease;
  font-weight: 500;
}

.copy-btn, .share-btn {
  margin-top: 12px;
  display: none;
}
.copy-btn.visible, .share-btn.visible {
  display: inline-block;
}

.seo-guide, .history, .testimonials {
  margin-top: 30px;
  text-align: left;
}
.seo-guide h2, .history h2, .testimonials h2 {
  font-size: 1.5rem;
  color: inherit;
  text-shadow: 0 0 4px rgba(0, 230, 255, 0.4);
  font-weight: 600;
}
.seo-guide ul, .history ul {
  list-style: none;
  padding: 0;
}
.seo-guide li, .history li {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  margin: 8px 0;
  border-radius: 10px;
  border: 1px solid rgba(0, 230, 255, 0.4);
  transition: background 0.3s ease, transform 0.2s ease;
  font-weight: 500;
}
.seo-guide li:hover, .history li:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}
.history li {
  cursor: pointer;
}
.testimonials p {
  font-size: 1rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(0, 230, 255, 0.3);
  font-weight: 500;
}

.footer {
  font-size: 1rem;
  color: inherit;
  text-shadow: 0 0 3px rgba(0, 230, 255, 0.3);
  margin-top: 30px;
  font-weight: 500;
}
.footer a {
  color: #00e6ff;
  text-decoration: none;
}
.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .container {
    padding: 20px;
    width: 90%;
    max-width: 100%;
  }
  h1 {
    font-size: 2rem;
  }
  .tagline {
    font-size: 1.1rem;
  }
  .social-proof, .free, .seo-guide p, .testimonials p {
    font-size: 0.9rem;
  }
  .theme-btn, .glowing, .copy-btn, .share-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  input, select {
    font-size: 0.9rem;
    padding: 10px;
  }
  .seo-guide h2, .history h2, .testimonials h2 {
    font-size: 1.3rem;
  }
}
