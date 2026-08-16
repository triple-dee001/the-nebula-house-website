/* ============================================
   THE NEBULA HOUSE — Shared Components
   Announcement Banner + Newsletter Popup
   ============================================ */

// ─── ANNOUNCEMENT BANNER CONFIG ──────────────
// Edit this object to change the announcement
const ANNOUNCEMENT = {
  active: true,
  text: '🎓 The Nebula Academy: Term 2 is out!!',
  link: 'the-nebula-academy.html',
  linkText: 'Enrol Now →',
  bgColor: '#ffffff',
  accentColor: '#7928ca',
  id: 'nebula-announcement-v2', // change this id to force re-show after dismissal
};

// ─── INJECT ANNOUNCEMENT BANNER ──────────────
function injectAnnouncementBanner() {
  if (!ANNOUNCEMENT.active) return;
  if (sessionStorage.getItem('nebula-banner-' + ANNOUNCEMENT.id)) return;

  const style = document.createElement('style');
  style.textContent = `
    #nebula-announcement {
      background: ${ANNOUNCEMENT.bgColor};
      border-bottom: 2px solid #000000;
      padding: 0.6rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 10000;
      overflow: hidden;
      width: 100%;
    }
    #nebula-announcement .banner-marquee-container {
      display: flex;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      padding-right: 45px;
    }
    #nebula-announcement .banner-marquee-text {
      display: inline-block;
      padding-left: 100%;
      animation: banner-marquee-scroll 30s linear infinite;
      font-size: 0.85rem;
      font-weight: 800;
      color: #000000;
      font-family: var(--font-secondary, 'Inter', sans-serif);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    #nebula-announcement .banner-link {
      color: ${ANNOUNCEMENT.accentColor};
      font-weight: 900;
      text-decoration: underline;
      margin-left: 1.5rem;
      font-size: 0.85rem;
      transition: opacity 0.2s;
      white-space: nowrap;
    }
    #nebula-announcement .banner-link:hover { opacity: 0.8; }
    #nebula-announcement .banner-close {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: #ffffff;
      border: 1px solid #000000;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000000;
      cursor: pointer;
      font-size: 0.8rem;
      line-height: 1;
      transition: all 0.2s;
      z-index: 10001;
    }
    #nebula-announcement .banner-close:hover { background: #000000; color: #ffffff; }
    body { padding-top: 0; }
    
    @keyframes banner-marquee-scroll {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-100%, 0, 0); }
    }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.id = 'nebula-announcement';
  banner.innerHTML = `
    <div class="banner-marquee-container">
      <div class="banner-marquee-text">
        <span>${ANNOUNCEMENT.text}</span>
        <a href="${ANNOUNCEMENT.link}" class="banner-link">${ANNOUNCEMENT.linkText}</a>
      </div>
    </div>
    <button class="banner-close" id="banner-close-btn" aria-label="Dismiss">✕</button>
  `;

  document.body.insertBefore(banner, document.body.firstChild);

  document.getElementById('banner-close-btn').addEventListener('click', () => {
    banner.style.transition = 'opacity 0.3s, max-height 0.3s';
    banner.style.opacity = '0';
    banner.style.maxHeight = '0';
    banner.style.overflow = 'hidden';
    setTimeout(() => banner.remove(), 350);
    sessionStorage.setItem('nebula-banner-' + ANNOUNCEMENT.id, '1');
  });
}

// ─── NEWSLETTER POPUP ─────────────────────────
function injectNewsletterPopup() {
  // Don't show if already subscribed or dismissed this session
  if (localStorage.getItem('nebula_newsletter_subscribed') === 'true') return;
  if (sessionStorage.getItem('nebula-popup-dismissed')) return;
  // Don't show on profile, admin, write pages
  const path = window.location.pathname;
  if (path.includes('user-profile') || path.includes('admin-room') || path.includes('write') || path.includes('clear-session')) return;

  const style = document.createElement('style');
  style.textContent = `
    #nebula-popup-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px); z-index: 99998;
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; opacity: 0; transition: opacity 0.4s;
    }
    #nebula-popup-overlay.visible { opacity: 1; }
    #nebula-popup-card {
      background: #0d0d0d;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      max-width: 440px;
      width: 100%;
      position: relative;
      transform: translateY(20px);
      transition: transform 0.4s;
      text-align: center;
    }
    #nebula-popup-overlay.visible #nebula-popup-card { transform: translateY(0); }
    #nebula-popup-card .popup-close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none; color: rgba(255,255,255,0.35);
      font-size: 1.1rem; cursor: pointer; line-height: 1;
      transition: color 0.2s;
    }
    #nebula-popup-card .popup-close:hover { color: #fff; }
    #nebula-popup-card .popup-icon { font-size: 2.5rem; margin-bottom: 1rem; }
    #nebula-popup-card .popup-title {
      font-family: var(--font-primary, 'Cormorant Garamond', Georgia, serif);
      font-size: 1.85rem; color: #fff; margin-bottom: 0.5rem; line-height: 1.2;
    }
    #nebula-popup-card .popup-sub {
      color: rgba(255,255,255,0.5); font-size: 0.9rem;
      margin-bottom: 1.5rem; line-height: 1.6;
    }
    #nebula-popup-card .popup-input {
      width: 100%; padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; color: #fff; font-size: 0.95rem;
      font-family: inherit; outline: none; box-sizing: border-box;
      margin-bottom: 0.75rem; transition: border-color 0.2s;
    }
    #nebula-popup-card .popup-input:focus { border-color: rgba(255,255,255,0.3); }
    #nebula-popup-card .popup-btn {
      width: 100%; padding: 0.8rem;
      background: #fff; color: #000;
      border: none; border-radius: 8px;
      font-size: 0.95rem; font-weight: 700;
      font-family: inherit; cursor: pointer;
      transition: opacity 0.2s; margin-bottom: 0.75rem;
    }
    #nebula-popup-card .popup-btn:hover { opacity: 0.9; }
    #nebula-popup-card .popup-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    #nebula-popup-card .popup-skip {
      background: none; border: none; color: rgba(255,255,255,0.3);
      font-size: 0.82rem; cursor: pointer; font-family: inherit;
      transition: color 0.2s;
    }
    #nebula-popup-card .popup-skip:hover { color: rgba(255,255,255,0.6); }
    #nebula-popup-card .popup-success {
      color: #4caf50; font-size: 0.88rem; margin-top: 0.5rem; display: none;
    }
    #nebula-popup-card .popup-error {
      color: #f87171; font-size: 0.85rem; margin-top: 0.5rem; display: none;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'nebula-popup-overlay';
  overlay.innerHTML = `
    <div id="nebula-popup-card">
      <button class="popup-close" id="popup-close-btn" aria-label="Close">✕</button>
      <div class="popup-icon">✦</div>
      <h2 class="popup-title">Join The Nebula House</h2>
      <p class="popup-sub">Stories, essays, book discussions and creative insights — delivered straight to your inbox.</p>
      <input type="text" class="popup-input" id="popup-name" placeholder="Your first name" autocomplete="given-name">
      <input type="email" class="popup-input" id="popup-email" placeholder="Your email address" autocomplete="email">
      <button class="popup-btn" id="popup-submit-btn">Subscribe — It's Free</button>
      <div class="popup-success" id="popup-success">🎉 You're in! Welcome to The Nebula House.</div>
      <div class="popup-error" id="popup-error"></div>
      <button class="popup-skip" id="popup-skip-btn">No thanks, maybe later</button>
    </div>
  `;
  document.body.appendChild(overlay);

  function closePopup() {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 400);
    sessionStorage.setItem('nebula-popup-dismissed', '1');
  }

  document.getElementById('popup-close-btn').addEventListener('click', closePopup);
  document.getElementById('popup-skip-btn').addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });

  document.getElementById('popup-submit-btn').addEventListener('click', async () => {
    const name = document.getElementById('popup-name').value.trim();
    const email = document.getElementById('popup-email').value.trim();
    const btn = document.getElementById('popup-submit-btn');
    const successEl = document.getElementById('popup-success');
    const errorEl = document.getElementById('popup-error');

    if (!email) { errorEl.textContent = 'Please enter your email.'; errorEl.style.display = 'block'; return; }

    btn.disabled = true; btn.textContent = 'Subscribing...';
    errorEl.style.display = 'none';

    try {
      if (typeof nebulaSubscribeNewsletter === 'function') {
        await nebulaSubscribeNewsletter(email, name);
      }
      localStorage.setItem('nebula_newsletter_subscribed', 'true');
      successEl.style.display = 'block';
      btn.style.display = 'none';
      document.getElementById('popup-skip-btn').textContent = 'Close';
      setTimeout(closePopup, 3000);
    } catch (err) {
      errorEl.textContent = err.message || 'Could not subscribe. Please try again.';
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Subscribe — It\'s Free';
    }
  });

  // Show popup after 4 seconds
  setTimeout(() => {
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('visible'));
    });
  }, 4000);
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectAnnouncementBanner();
  injectNewsletterPopup();
});
