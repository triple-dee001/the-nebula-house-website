// ─── NEBULA HOUSE AUTH ────────────────────────
// Uses custom backend via api.js — no Firebase

// ─── NAVBAR UPDATE ────────────────────────────
function getPathPrefix() {
  const path = window.location.pathname;
  if (path.includes('/post/') || path.includes('/past-reads/')) return '../';
  if (path.includes('/the-nebula-academy/term-')) return '../../';
  return '';
}

function updateNavbarAuth(user) {
  const icon = document.getElementById('nav-account-icon');
  if (!icon) return;

  if (user) {
    const prefix = getPathPrefix();
    icon.href = isAdmin(user) ? prefix + 'the-admin-room.html' : prefix + 'user-profile.html';
    icon.onclick = null;
    // Show avatar or initial
    if (user.photo) {
      const imgSrc = user.photo.startsWith('http') || user.photo.startsWith('data:') ? user.photo : `https://the-nebula-house-backend.onrender.com${user.photo}`;
      icon.innerHTML = `<img src="${imgSrc}" alt="${user.name}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;display:block;">`;
    } else {
      const initial = (user.name || user.email || 'U')[0].toUpperCase();
      icon.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:#fff;">${initial}</div>`;
    }

    // Insert Notification Bell
    let bell = document.getElementById('nav-bell-icon');
    if (!bell) {
      bell = document.createElement('div');
      bell.id = 'nav-bell-icon';
      bell.style.cssText = 'position:relative; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-right:1.25rem; color:#fff;';
      bell.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <span id="nav-bell-badge" style="display:none; position:absolute; top:-4px; right:-4px; background:#ef4444; color:#fff; font-size:0.68rem; font-weight:800; border-radius:50%; min-width:14px; height:14px; padding:2px; display:flex; align-items:center; justify-content:center; border:2px solid #000; box-sizing:content-box; line-height:1;">0</span>
      `;
      icon.parentNode.insertBefore(bell, icon);
      injectNotificationsDropdown();
    }
    loadNotificationsList();

  } else {
    icon.href = '#';
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
    icon.onclick = (e) => { e.preventDefault(); openAuthModal(); };

    // Remove Notification Bell
    const bell = document.getElementById('nav-bell-icon');
    if (bell) bell.remove();
  }
}

// ─── AUTH MODAL ───────────────────────────────
function injectAuthModal() {
  if (document.getElementById('nebula-auth-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'nebula-auth-modal';
  modal.innerHTML = `
    <div class="nebula-auth-overlay" id="auth-overlay"></div>
    <div class="nebula-auth-card" id="auth-card">
      <button class="nebula-auth-close" id="auth-close" aria-label="Close">✕</button>

      <div id="auth-view-main">
        <h2 class="nebula-auth-title" id="auth-title">Welcome Back</h2>
        <p class="nebula-auth-sub" id="auth-sub">Sign in to your Nebula House account</p>
        <div id="auth-error" class="nebula-auth-error" style="display:none;"></div>

        <div id="auth-name-group" style="display:none; margin-bottom:1rem;">
          <input type="text" id="auth-name" class="nebula-auth-input" placeholder="Your name" autocomplete="name">
        </div>
        <div id="auth-writer-group" style="display:none; margin-bottom:1rem; flex-direction:column; gap:0.4rem; align-items:flex-start;">
          <div style="display:flex; align-items:center; gap:0.5rem; width:100%;">
            <input type="checkbox" id="auth-is-writer" style="width:auto; margin:0; cursor:pointer;">
            <label for="auth-is-writer" style="color:rgba(255,255,255,0.75); font-size:0.88rem; cursor:pointer; user-select:none;">Register as a Writer</label>
          </div>
          <a href="/how-to-become-a-writer" target="_blank" style="color:#bb86fc; font-size:0.78rem; text-decoration:none; margin-left:1.4rem;">View Writer Guide & Onboarding →</a>
        </div>
        <div style="margin-bottom:1rem;">
          <input type="email" id="auth-email" class="nebula-auth-input" placeholder="Email address" autocomplete="email">
        </div>
        <div style="margin-bottom:1.25rem;">
          <input type="password" id="auth-password" class="nebula-auth-input" placeholder="Password" autocomplete="current-password">
        </div>

        <button class="nebula-auth-btn nebula-auth-btn--primary" id="auth-submit">Sign In</button>

        <div class="nebula-auth-divider"><span>or</span></div>

        <button class="nebula-auth-btn nebula-auth-btn--google" id="auth-google">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.3 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.3 29 5 24 5 16.3 5 9.7 9 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5 0 9.5-1.9 12.9-5l-6-5.2C29.1 36.5 26.7 37.5 24 37.5c-5.3 0-9.7-3.5-11.3-8.2L6 34.5C9.3 40.6 16.1 45 24 45z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.5l6 5.2C41.3 36.1 44 31 44 25c0-1.3-.1-2.6-.4-3.9z"/></svg>
          Continue with Google
        </button>

        <p class="nebula-auth-switch">
          <span id="auth-switch-text">Don't have an account?</span>
          <a href="#" id="auth-switch-btn">Sign Up</a>
        </p>
        <p style="text-align:center; margin-top:0.5rem;">
          <a href="#" id="auth-forgot-link" style="font-size:0.82rem; color:rgba(255,255,255,0.4); text-decoration:none;">Forgot password?</a>
        </p>
      </div>

      <!-- Forgot password view -->
      <div id="auth-view-forgot" style="display:none;">
        <h2 class="nebula-auth-title">Reset Password</h2>
        <p class="nebula-auth-sub">Enter your email and we'll send a reset link</p>
        <div id="forgot-msg" style="display:none;"></div>
        <div style="margin-bottom:1rem;">
          <input type="email" id="forgot-email" class="nebula-auth-input" placeholder="Email address">
        </div>
        <button class="nebula-auth-btn nebula-auth-btn--primary" id="forgot-submit">Send Reset Link</button>
        <p style="text-align:center; margin-top:1rem;">
          <a href="#" id="forgot-back" style="font-size:0.85rem; color:rgba(255,255,255,0.5);">← Back to sign in</a>
        </p>
      </div>

      <!-- Success view -->
      <div id="auth-view-success" style="display:none; text-align:center; padding:1rem 0;">
        <div style="font-size:3rem; margin-bottom:1rem;" id="success-icon">📬</div>
        <h2 class="nebula-auth-title" id="success-title">Check Your Email</h2>
        <p class="nebula-auth-sub" id="success-body"></p>
        <button class="nebula-auth-btn nebula-auth-btn--primary" onclick="closeAuthModal()" style="margin-top:1rem;">Got it</button>
      </div>
    </div>
  `;

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #nebula-auth-modal { position:fixed; inset:0; z-index:9999; display:none; align-items:center; justify-content:center; padding:1rem; }
    #nebula-auth-modal.open { display:flex; }
    .nebula-auth-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(4px); }
    .nebula-auth-card { position:relative; background:#0f0f0f; border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:2rem; width:100%; max-width:400px; z-index:1; }
    .nebula-auth-close { position:absolute; top:1rem; right:1rem; background:none; border:none; color:rgba(255,255,255,0.4); font-size:1.1rem; cursor:pointer; line-height:1; padding:0.25rem; }
    .nebula-auth-close:hover { color:#fff; }
    .nebula-auth-title { font-family:var(--font-primary,'Cormorant Garamond'),Georgia,serif; font-size:1.75rem; color:#fff; margin-bottom:0.4rem; }
    .nebula-auth-sub { color:rgba(255,255,255,0.45); font-size:0.88rem; margin-bottom:1.5rem; }
    .nebula-auth-input { width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.95rem; font-family:inherit; outline:none; box-sizing:border-box; transition:border-color 0.2s; }
    .nebula-auth-input:focus { border-color:rgba(255,255,255,0.35); }
    .nebula-auth-btn { width:100%; padding:0.75rem; border-radius:8px; font-size:0.95rem; font-family:inherit; font-weight:600; cursor:pointer; border:none; transition:opacity 0.2s; margin-bottom:0.5rem; }
    .nebula-auth-btn--primary { background:#fff; color:#000; }
    .nebula-auth-btn--primary:hover { opacity:0.9; }
    .nebula-auth-btn--primary:disabled { opacity:0.5; cursor:not-allowed; }
    .nebula-auth-btn--google { background:transparent; border:1px solid rgba(255,255,255,0.15); color:#fff; display:flex; align-items:center; justify-content:center; gap:0.65rem; }
    .nebula-auth-btn--google:hover { background:rgba(255,255,255,0.05); }
    .nebula-auth-divider { text-align:center; color:rgba(255,255,255,0.25); font-size:0.8rem; margin:1rem 0; position:relative; }
    .nebula-auth-divider::before { content:''; position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(255,255,255,0.1); z-index:0; }
    .nebula-auth-divider span { background:#0f0f0f; padding:0 0.75rem; position:relative; z-index:1; }
    .nebula-auth-switch { text-align:center; font-size:0.85rem; color:rgba(255,255,255,0.4); margin-top:1rem; }
    .nebula-auth-switch a { color:#fff; text-decoration:underline; margin-left:0.3rem; }
    .nebula-auth-error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; border-radius:6px; padding:0.65rem 0.9rem; font-size:0.85rem; margin-bottom:1rem; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  // ─── Wire up modal events ───
  let isSignUp = false;

  document.getElementById('auth-overlay').onclick = closeAuthModal;
  document.getElementById('auth-close').onclick = closeAuthModal;

  // Toggle sign in / sign up
  document.getElementById('auth-switch-btn').addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    document.getElementById('auth-title').textContent = isSignUp ? 'Create Account' : 'Welcome Back';
    document.getElementById('auth-sub').textContent = isSignUp ? 'Join The Nebula House community' : 'Sign in to your Nebula House account';
    document.getElementById('auth-submit').textContent = isSignUp ? 'Create Account' : 'Sign In';
    document.getElementById('auth-switch-text').textContent = isSignUp ? 'Already have an account?' : "Don't have an account?";
    document.getElementById('auth-switch-btn').textContent = isSignUp ? 'Sign In' : 'Sign Up';
    document.getElementById('auth-name-group').style.display = isSignUp ? 'block' : 'none';
    document.getElementById('auth-writer-group').style.display = isSignUp ? 'flex' : 'none';
    document.getElementById('auth-forgot-link').style.display = isSignUp ? 'none' : 'inline';
    hideAuthError();
  });

  // Forgot password
  document.getElementById('auth-forgot-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-view-main').style.display = 'none';
    document.getElementById('auth-view-forgot').style.display = 'block';
  });

  document.getElementById('forgot-back').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-view-forgot').style.display = 'none';
    document.getElementById('auth-view-main').style.display = 'block';
  });

  document.getElementById('forgot-submit').addEventListener('click', async () => {
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) return;
    const btn = document.getElementById('forgot-submit');
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      await nebulaForgotPassword(email);
      const msg = document.getElementById('forgot-msg');
      msg.style.display = 'block';
      msg.style.cssText = 'display:block; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.3); color:#86efac; border-radius:6px; padding:0.65rem 0.9rem; font-size:0.85rem; margin-bottom:1rem;';
      msg.textContent = 'Reset link sent! Check your inbox.';
    } catch (err) {
      const msg = document.getElementById('forgot-msg');
      msg.style.cssText = 'display:block; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#fca5a5; border-radius:6px; padding:0.65rem 0.9rem; font-size:0.85rem; margin-bottom:1rem;';
      msg.textContent = err.message;
    }
    btn.disabled = false; btn.textContent = 'Send Reset Link';
  });

  // Main submit
  document.getElementById('auth-submit').addEventListener('click', async () => {
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const btn = document.getElementById('auth-submit');

    const isWriter = isSignUp ? document.getElementById('auth-is-writer').checked : false;

    if (!email || !password) return showAuthError('Please fill in all fields');
    if (isSignUp && !name) return showAuthError('Please enter your name');

    btn.disabled = true; btn.textContent = isSignUp ? 'Creating account...' : 'Signing in...';
    hideAuthError();

    try {
      if (isSignUp) {
        await nebulaRegister(name, email, password, isWriter);
        showSuccessView('📬', 'Check Your Email', `We've sent a verification link to ${email}. Please verify before signing in.`);
      } else {
        const user = await nebulaLogin(email, password);
        closeAuthModal();
        updateNavbarAuth(user);
        window.dispatchEvent(new CustomEvent('nebula-auth-change', { detail: { user } }));
      }
    } catch (err) {
      showAuthError(err.message);
    }

    btn.disabled = false; btn.textContent = isSignUp ? 'Create Account' : 'Sign In';
  });

  // Google sign in
  document.getElementById('auth-google').addEventListener('click', async () => {
    // Check if Google Client ID is configured
    if (!window.GOOGLE_CLIENT_ID) {
      showAuthError('Google sign-in is not configured yet. Please use email and password.');
      return;
    }
    try {
      if (!window.google) await loadGoogleScript();
      google.accounts.id.initialize({
        client_id: window.GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const user = await nebulaGoogleLogin(response.credential);
            closeAuthModal();
            updateNavbarAuth(user);
            window.dispatchEvent(new CustomEvent('nebula-auth-change', { detail: { user } }));
          } catch (err) {
            showAuthError(err.message);
          }
        },
      });
      google.accounts.id.prompt();
    } catch (err) {
      showAuthError('Google sign-in failed. Please use email and password.');
    }
  });

  // Enter key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAuthModal();
    if (e.key === 'Enter' && document.getElementById('nebula-auth-modal').classList.contains('open')) {
      document.getElementById('auth-submit').click();
    }
  });
}

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById('google-gsi')) return resolve();
    const s = document.createElement('script');
    s.id = 'google-gsi';
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function openAuthModal() {
  const modal = document.getElementById('nebula-auth-modal');
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeAuthModal() {
  const modal = document.getElementById('nebula-auth-modal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function hideAuthError() {
  const el = document.getElementById('auth-error');
  if (el) el.style.display = 'none';
}

function showSuccessView(icon, title, body) {
  document.getElementById('auth-view-main').style.display = 'none';
  document.getElementById('auth-view-success').style.display = 'block';
  document.getElementById('success-icon').textContent = icon;
  document.getElementById('success-title').textContent = title;
  document.getElementById('success-body').textContent = body;
}

// ─── SIGN OUT ─────────────────────────────────
async function signOut() {
  // Clear new backend session
  await nebulaLogout();
  // Clear any old Firebase/legacy keys
  ['nebula_current_user', 'nebula_posts', 'nebula_users', 'nebula_newsletter_subscribed'].forEach(k => localStorage.removeItem(k));
  updateNavbarAuth(null);
  window.dispatchEvent(new CustomEvent('nebula-auth-change', { detail: { user: null } }));
}

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectAuthModal();

  // Wire icon click
  const icon = document.getElementById('nav-account-icon');
  if (icon) {
    icon.addEventListener('click', (e) => {
      if (!icon.getAttribute('href') || icon.getAttribute('href') === '#') {
        e.preventDefault();
        openAuthModal();
      }
    });
  }

  // Show stored user immediately while API call resolves
  const stored = getCurrentUser();
  if (stored) updateNavbarAuth(stored);
  else updateNavbarAuth(null);

  // Refresh from server in background (api.js handles this via its IIFE)
});

function injectNotificationsDropdown() {
  if (document.getElementById('notifications-dropdown-container')) return;

  const style = document.createElement('style');
  style.id = 'notifications-dropdown-style';
  style.textContent = `
    #notifications-dropdown-container {
      position: absolute;
      top: 100%;
      right: 0;
      width: 320px;
      background: #0f0f0f;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      display: none;
      flex-direction: column;
      z-index: 10005;
      margin-top: 0.5rem;
      max-height: 400px;
      font-family: inherit;
    }
    #notifications-dropdown-container.open { display: flex; }
    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .notif-title { font-weight: 700; font-size: 0.95rem; color: #fff; }
    .notif-clear-btn { font-size: 0.78rem; color: #bb86fc; background: none; border: none; cursor: pointer; padding: 0; }
    .notif-clear-btn:hover { text-decoration: underline; }
    .notif-list { overflow-y: auto; flex: 1; min-height: 50px; max-height: 320px; }
    .notif-item {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      cursor: pointer;
      transition: background 0.2s;
      position: relative;
    }
    .notif-item:hover { background: rgba(255,255,255,0.03); }
    .notif-item.unread { background: rgba(187,134,252,0.03); }
    .notif-item.unread::before {
      content: '';
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 6px;
      background: #bb86fc;
      border-radius: 50%;
    }
    .notif-item-title { font-weight: 600; font-size: 0.85rem; color: #fff; margin-bottom: 0.2rem; }
    .notif-item-msg { font-size: 0.78rem; color: rgba(255,255,255,0.55); line-height: 1.4; }
    .notif-item-time { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-top: 0.3rem; }
    .notif-empty { text-align: center; padding: 2rem 1rem; color: rgba(255,255,255,0.4); font-size: 0.85rem; }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'notifications-dropdown-container';
  container.innerHTML = `
    <div class="notif-header">
      <span class="notif-title">Notifications</span>
      <button class="notif-clear-btn" id="notif-clear-all">Mark all as read</button>
    </div>
    <div class="notif-list" id="notif-list-el">
      <div class="notif-empty">Loading notifications...</div>
    </div>
  `;
  
  const bell = document.getElementById('nav-bell-icon');
  bell.appendChild(container);

  // Toggle open
  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    container.classList.toggle('open');
    if (container.classList.contains('open')) {
      loadNotificationsList();
    }
  });

  document.addEventListener('click', () => {
    container.classList.remove('open');
  });

  document.getElementById('notif-clear-all').addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      await apiRequest('/notifications/read-all', { method: 'PUT' });
      loadNotificationsList();
    } catch (err) {
      console.error(err);
    }
  });
}

async function loadNotificationsList() {
  const listEl = document.getElementById('notif-list-el');
  const badgeEl = document.getElementById('nav-bell-badge');
  if (!listEl) return;

  try {
    const notifs = await apiRequest('/notifications');
    const unread = notifs.filter(n => !n.isRead);
    
    if (badgeEl) {
      if (unread.length > 0) {
        badgeEl.textContent = unread.length;
        badgeEl.style.display = 'flex';
      } else {
        badgeEl.style.display = 'none';
      }
    }

    if (notifs.length === 0) {
      listEl.innerHTML = `<div class="notif-empty">No notifications yet.</div>`;
      return;
    }

    listEl.innerHTML = notifs.map(n => {
      const timeStr = new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
          <div class="notif-item-title">${escapeHtml(n.title)}</div>
          <div class="notif-item-msg">${escapeHtml(n.message)}</div>
          <div class="notif-item-time">${timeStr}</div>
        </div>
      `;
    }).join('');

    // Add click event for items
    listEl.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = item.dataset.id;
        try {
          await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
          item.classList.remove('unread');
          loadNotificationsList();
        } catch (err) {
          console.error(err);
        }
      });
    });

  } catch (err) {
    listEl.innerHTML = `<div class="notif-empty" style="color:#ef4444;">Failed to load notifications</div>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
