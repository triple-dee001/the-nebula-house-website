/* ============================================
   THE NEBULA HOUSE — Auth Module
   Firebase Authentication + Role Management
   ============================================ */

// ─── CONFIGURATION ───────────────────────────
// TODO: Replace with your actual Firebase config from console.firebase.google.com
const firebaseConfig = {
  apiKey: "AIzaSyB9Mg6HUbDHrHMef1dHRt_b1Rb64vQUXzA",
  authDomain: "the-nebula-house-14152.firebaseapp.com",
  projectId: "the-nebula-house-14152",
  storageBucket: "the-nebula-house-14152.firebasestorage.app",
  messagingSenderId: "702880167709",
  appId: "1:702880167709:web:1715cfef82a655316d13f4",
  measurementId: "G-EP5DPZYCGC"
};

// Admin emails — add more as needed
const ADMIN_EMAILS = [
  'danieldurojaiye42@gmail.com'
];

// Toggle this to true once you paste your real Firebase config above
const USE_FIREBASE = true;

// ─── FIREBASE INIT ───────────────────────────
let auth = null;
let db = null;

function initFirebase() {
  if (!USE_FIREBASE) return;
  try {
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.firestore();
    }
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }
}

// ─── AUTH STATE ──────────────────────────────
let currentUser = null;

function getCurrentUser() {
  if (USE_FIREBASE && auth) {
    return auth.currentUser ? {
      uid: auth.currentUser.uid,
      name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
      email: auth.currentUser.email,
      photo: auth.currentUser.photoURL
    } : null;
  }
  // localStorage fallback
  const stored = localStorage.getItem('nebula_current_user');
  return stored ? JSON.parse(stored) : null;
}

function isAdmin(user) {
  if (!user) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

// ─── SIGN UP ─────────────────────────────────
async function signUp(name, email, password) {
  if (USE_FIREBASE && auth) {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    // Store user profile in Firestore
    await db.collection('users').doc(cred.user.uid).set({
      name: name,
      email: email,
      role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user',
      joined: new Date().toISOString(),
      photo: null
    });
    return getCurrentUser();
  }

  // localStorage fallback
  const users = JSON.parse(localStorage.getItem('nebula_users')) || {};
  const existingUser = Object.values(users).find(u => u.email === email);
  if (existingUser) throw new Error('An account with this email already exists.');

  const uid = 'user_' + Date.now();
  const user = {
    uid, name, email,
    role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user',
    joined: new Date().toISOString(),
    photo: null
  };
  users[uid] = user;
  localStorage.setItem('nebula_users', JSON.stringify(users));
  localStorage.setItem('nebula_current_user', JSON.stringify(user));
  currentUser = user;
  onAuthChange(user);
  return user;
}

// ─── SIGN IN ─────────────────────────────────
async function signIn(email, password) {
  if (USE_FIREBASE && auth) {
    await auth.signInWithEmailAndPassword(email, password);
    return getCurrentUser();
  }

  // localStorage fallback
  const users = JSON.parse(localStorage.getItem('nebula_users')) || {};
  const user = Object.values(users).find(u => u.email === email);
  if (!user) throw new Error('No account found with this email.');
  // In local mode we skip password check (it's a prototype)
  localStorage.setItem('nebula_current_user', JSON.stringify(user));
  currentUser = user;
  onAuthChange(user);
  return user;
}

// ─── GOOGLE SIGN IN ──────────────────────────
async function signInWithGoogle() {
  if (USE_FIREBASE && auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const u = result.user;
    // Upsert user profile
    const doc = await db.collection('users').doc(u.uid).get();
    if (!doc.exists) {
      await db.collection('users').doc(u.uid).set({
        name: u.displayName,
        email: u.email,
        role: ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'admin' : 'user',
        joined: new Date().toISOString(),
        photo: u.photoURL
      });
    }
    return getCurrentUser();
  }
  // Fallback: just show a message
  throw new Error('Google Sign-In requires Firebase. Please set USE_FIREBASE = true and add your config.');
}

// ─── APPLE SIGN IN ───────────────────────────
async function signInWithApple() {
  if (USE_FIREBASE && auth) {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    const result = await auth.signInWithPopup(provider);
    const u = result.user;
    const doc = await db.collection('users').doc(u.uid).get();
    if (!doc.exists) {
      await db.collection('users').doc(u.uid).set({
        name: u.displayName || u.email.split('@')[0],
        email: u.email,
        role: ADMIN_EMAILS.includes(u.email.toLowerCase()) ? 'admin' : 'user',
        joined: new Date().toISOString(),
        photo: u.photoURL
      });
    }
    return getCurrentUser();
  }
  throw new Error('Apple Sign-In requires Firebase. Please set USE_FIREBASE = true and add your config.');
}

// ─── SIGN OUT ────────────────────────────────
async function signOut() {
  if (USE_FIREBASE && auth) {
    await auth.signOut();
  }
  localStorage.removeItem('nebula_current_user');
  currentUser = null;
  onAuthChange(null);
}

// ─── AUTH STATE LISTENER ─────────────────────
function onAuthChange(user) {
  currentUser = user;
  updateNavbarAuth(user);

  // Dispatch a custom event so other scripts can react
  window.dispatchEvent(new CustomEvent('nebula-auth-change', { detail: { user } }));
}

// ─── NAVBAR UI UPDATE ────────────────────────
function updateNavbarAuth(user) {
  const accountIcon = document.getElementById('nav-account-icon');
  if (!accountIcon) return;

  if (user) {
    // Calculate the correct path based on role
    const prefix = getPathPrefix();
    if (isAdmin(user)) {
      accountIcon.href = prefix + 'the-admin-room.html';
    } else {
      accountIcon.href = prefix + 'user-profile.html';
    }

    // Show avatar or initials
    const initial = (user.name || user.email)[0].toUpperCase();
    if (user.photo) {
      accountIcon.innerHTML = `<img src="${user.photo}" alt="${user.name}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;">`;
    } else {
      accountIcon.innerHTML = `<div style="width:28px;height:28px;border-radius:50%;background:var(--accent-color,#fff);color:#000;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:700;font-family:var(--font-secondary);">${initial}</div>`;
    }
    accountIcon.onclick = null;
  } else {
    // Not signed in — clicking opens auth modal
    accountIcon.href = '#';
    accountIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
    accountIcon.onclick = (e) => {
      e.preventDefault();
      openAuthModal();
    };
  }
}

function getPathPrefix() {
  const path = window.location.pathname;
  if (path.includes('/post/') || path.includes('/past-reads/')) return '../';
  if (path.includes('/the-nebula-academy/term-1/')) return '../../';
  return '';
}

// ─── AUTH MODAL ──────────────────────────────
function injectAuthModal() {
  if (document.getElementById('nebula-auth-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'nebula-auth-modal';
  modal.className = 'nebula-auth-overlay';
  modal.innerHTML = `
    <div class="nebula-auth-card">
      <button class="nebula-auth-close" id="nebula-auth-close">&times;</button>
      
      <div style="text-align:center; margin-bottom: 2rem;">
        <h2 style="font-family: var(--font-primary, 'Cormorant Garamond'); font-size: 2rem; margin-bottom: 0.5rem;" id="auth-modal-title">Welcome Back</h2>
        <p style="color: #888; font-size: 0.95rem;" id="auth-modal-subtitle">Sign in to The Nebula House</p>
      </div>
      
      <div id="auth-error" style="background:rgba(220,50,50,0.1); color:#e55; border-radius:4px; padding:0.75rem; margin-bottom:1rem; font-size:0.85rem; display:none;"></div>
      
      <div id="auth-name-group" style="display:none; margin-bottom: 1rem;">
        <input type="text" id="nebula-auth-name" placeholder="Full Name" class="nebula-auth-input">
      </div>
      <div style="margin-bottom: 1rem;">
        <input type="email" id="nebula-auth-email" placeholder="Email address" class="nebula-auth-input">
      </div>
      <div style="margin-bottom: 1.5rem;">
        <input type="password" id="nebula-auth-password" placeholder="Password" class="nebula-auth-input">
      </div>
      
      <button class="nebula-auth-btn nebula-auth-btn--primary" id="nebula-auth-submit">Sign In</button>
      
      <div style="display:flex; align-items:center; gap:1rem; margin: 1.5rem 0;">
        <div style="flex:1; height:1px; background:#333;"></div>
        <span style="color:#666; font-size:0.85rem;">or</span>
        <div style="flex:1; height:1px; background:#333;"></div>
      </div>
      
      <button class="nebula-auth-btn nebula-auth-btn--social" id="nebula-auth-google">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>
      
      <button class="nebula-auth-btn nebula-auth-btn--social" id="nebula-auth-apple">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
        Continue with Apple
      </button>
      
      <div style="text-align:center; margin-top:1.5rem;">
        <p style="color:#888; font-size:0.9rem;" id="auth-mode-toggle">
          Don't have an account? <a href="#" id="auth-switch-link" style="color:#fff; text-decoration:underline;">Sign Up</a>
        </p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // ─── Modal styles (scoped) ───
  if (!document.getElementById('nebula-auth-styles')) {
    const style = document.createElement('style');
    style.id = 'nebula-auth-styles';
    style.textContent = `
      .nebula-auth-overlay {
        position: fixed; inset: 0; z-index: 10000;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
        display: none; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.3s;
      }
      .nebula-auth-overlay.open {
        display: flex; opacity: 1;
      }
      .nebula-auth-card {
        background: #111; border: 1px solid #222; border-radius: 12px;
        padding: 2.5rem; width: 90%; max-width: 420px;
        position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      }
      .nebula-auth-close {
        position: absolute; top: 1rem; right: 1.25rem;
        background: none; border: none; color: #888; font-size: 1.75rem;
        cursor: pointer; line-height: 1; transition: color 0.2s;
      }
      .nebula-auth-close:hover { color: #fff; }
      .nebula-auth-input {
        width: 100%; padding: 0.85rem 1rem; background: #1a1a1a;
        border: 1px solid #333; border-radius: 6px; color: #fff;
        font-size: 1rem; font-family: inherit; outline: none;
        transition: border-color 0.2s; box-sizing: border-box;
      }
      .nebula-auth-input:focus { border-color: #fff; }
      .nebula-auth-input::placeholder { color: #666; }
      .nebula-auth-btn {
        width: 100%; padding: 0.85rem; border-radius: 6px;
        font-size: 1rem; font-family: inherit; cursor: pointer;
        transition: all 0.2s; display: flex; align-items: center;
        justify-content: center; gap: 0.75rem; border: none;
      }
      .nebula-auth-btn--primary {
        background: #fff; color: #000; font-weight: 600;
      }
      .nebula-auth-btn--primary:hover { background: #e0e0e0; }
      .nebula-auth-btn--social {
        background: transparent; color: #ccc;
        border: 1px solid #333; margin-top: 0.75rem;
      }
      .nebula-auth-btn--social:hover {
        border-color: #666; color: #fff; background: rgba(255,255,255,0.04);
      }
    `;
    document.head.appendChild(style);
  }

  // ─── Event Listeners ───
  let isSignUpMode = false;

  document.getElementById('nebula-auth-close').addEventListener('click', closeAuthModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAuthModal(); });

  document.getElementById('auth-switch-link').addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    document.getElementById('auth-modal-title').textContent = isSignUpMode ? 'Create Account' : 'Welcome Back';
    document.getElementById('auth-modal-subtitle').textContent = isSignUpMode ? 'Join The Nebula House community' : 'Sign in to The Nebula House';
    document.getElementById('auth-name-group').style.display = isSignUpMode ? 'block' : 'none';
    document.getElementById('nebula-auth-submit').textContent = isSignUpMode ? 'Create Account' : 'Sign In';
    document.getElementById('auth-mode-toggle').innerHTML = isSignUpMode
      ? 'Already have an account? <a href="#" id="auth-switch-link" style="color:#fff;text-decoration:underline;">Sign In</a>'
      : 'Don\'t have an account? <a href="#" id="auth-switch-link" style="color:#fff;text-decoration:underline;">Sign Up</a>';
    document.getElementById('auth-switch-link').addEventListener('click', arguments.callee);
    hideAuthError();
  });

  document.getElementById('nebula-auth-submit').addEventListener('click', async () => {
    const email = document.getElementById('nebula-auth-email').value.trim();
    const password = document.getElementById('nebula-auth-password').value;
    const name = document.getElementById('nebula-auth-name').value.trim();

    if (!email || !password) return showAuthError('Please fill in all fields.');
    if (isSignUpMode && !name) return showAuthError('Please enter your name.');

    try {
      if (isSignUpMode) {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
      closeAuthModal();
    } catch (err) {
      showAuthError(err.message);
    }
  });

  document.getElementById('nebula-auth-google').addEventListener('click', async () => {
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err) {
      showAuthError(err.message);
    }
  });

  document.getElementById('nebula-auth-apple').addEventListener('click', async () => {
    try {
      await signInWithApple();
      closeAuthModal();
    } catch (err) {
      showAuthError(err.message);
    }
  });
}

function openAuthModal() {
  const modal = document.getElementById('nebula-auth-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('nebula-auth-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    hideAuthError();
  }
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function hideAuthError() {
  const el = document.getElementById('auth-error');
  if (el) { el.style.display = 'none'; }
}

// ─── NEWSLETTER (Firestore storage) ─────────
async function saveNewsletterEmail(email) {
  if (USE_FIREBASE && db) {
    await db.collection('newsletter').add({
      email: email,
      subscribedAt: new Date().toISOString()
    });
  }
  // Always also save locally
  const subs = JSON.parse(localStorage.getItem('nebula_newsletter')) || [];
  if (!subs.find(s => s.email === email)) {
    subs.push({ email, subscribedAt: new Date().toISOString() });
    localStorage.setItem('nebula_newsletter', JSON.stringify(subs));
  }
}

// ─── POSTS (CRUD) ────────────────────────────
async function updateUserProfile(uid, data) {
  if (USE_FIREBASE && db) {
    await db.collection('users').doc(uid).update(data);
    // Also update current session
    Object.assign(currentUser, data);
    return currentUser;
  }
  const users = JSON.parse(localStorage.getItem('nebula_users')) || {};
  if (users[uid]) {
    Object.assign(users[uid], data);
    localStorage.setItem('nebula_users', JSON.stringify(users));
    Object.assign(currentUser, data);
    localStorage.setItem('nebula_current_user', JSON.stringify(currentUser));
  }
  return currentUser;
}

async function publishPost(post) {
  if (USE_FIREBASE && db) {
    const ref = await db.collection('posts').add(post);
    return ref.id;
  }
  const posts = JSON.parse(localStorage.getItem('nebula_posts')) || [];
  post.id = 'post_' + Date.now();
  posts.unshift(post);
  localStorage.setItem('nebula_posts', JSON.stringify(posts));
  return post.id;
}

async function getAllPosts() {
  if (USE_FIREBASE && db) {
    const snap = await db.collection('posts').orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  return JSON.parse(localStorage.getItem('nebula_posts')) || [];
}

async function deletePost(postId) {
  if (USE_FIREBASE && db) {
    await db.collection('posts').doc(postId).delete();
    return;
  }
  let posts = JSON.parse(localStorage.getItem('nebula_posts')) || [];
  posts = posts.filter(p => p.id !== postId);
  localStorage.setItem('nebula_posts', JSON.stringify(posts));
}

// ─── POST METRICS (Views, Likes, Ratings, Comments) ─────────
async function getPostMetrics(postId) {
  if (USE_FIREBASE && db) {
    const doc = await db.collection('post_metrics').doc(postId).get();
    if (doc.exists) return doc.data();
    return { views: 0, likes: 0, ratingsTotal: 0, ratingsCount: 0, commentsCount: 0 };
  }
  return {
    views: parseInt(localStorage.getItem(`${postId}_views`)) || 0,
    likes: parseInt(localStorage.getItem(`${postId}_likes_count`)) || 0,
    ratingsCount: 0, // Fallback doesn't aggregate
    ratingsTotal: 0,
    commentsCount: (JSON.parse(localStorage.getItem(`${postId}_comments`)) || []).length
  };
}

async function incrementPostView(postId) {
  if (USE_FIREBASE && db) {
    const ref = db.collection('post_metrics').doc(postId);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({ views: 1, likes: 0, ratingsTotal: 0, ratingsCount: 0, commentsCount: 0 });
    } else {
      await ref.update({ views: firebase.firestore.FieldValue.increment(1) });
    }
    return;
  }
  const key = `${postId}_views`;
  let v = parseInt(localStorage.getItem(key)) || 0;
  localStorage.setItem(key, v + 1);
}

async function togglePostLike(postId, userId, isLiking) {
  if (USE_FIREBASE && db) {
    const ref = db.collection('post_metrics').doc(postId);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({ views: 0, likes: isLiking ? 1 : 0, ratingsTotal: 0, ratingsCount: 0, commentsCount: 0 });
    } else {
      const increment = isLiking ? 1 : -1;
      // Prevent negative likes
      if (!isLiking && doc.data().likes <= 0) return;
      await ref.update({ likes: firebase.firestore.FieldValue.increment(increment) });
    }
    return;
  }
  const countKey = `${postId}_likes_count`;
  const likedKey = `${postId}_user_liked`;
  let v = parseInt(localStorage.getItem(countKey)) || 0;
  if (isLiking) {
    v++;
    localStorage.setItem(likedKey, 'true');
  } else {
    v = Math.max(0, v - 1);
    localStorage.setItem(likedKey, 'false');
  }
  localStorage.setItem(countKey, v);
}

async function submitPostRating(postId, userId, rating, previousRating = 0) {
  if (USE_FIREBASE && db) {
    const ref = db.collection('post_metrics').doc(postId);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({ views: 0, likes: 0, ratingsTotal: rating, ratingsCount: 1, commentsCount: 0 });
    } else {
      let incrementCount = previousRating > 0 ? 0 : 1;
      let incrementTotal = rating - previousRating;
      await ref.update({
        ratingsCount: firebase.firestore.FieldValue.increment(incrementCount),
        ratingsTotal: firebase.firestore.FieldValue.increment(incrementTotal)
      });
    }
    return;
  }
  localStorage.setItem(`${postId}_user_rating`, rating);
}

async function addPostComment(postId, comment) {
  if (USE_FIREBASE && db) {
    // Save the actual comment
    await db.collection('posts').doc(postId).collection('comments').add(comment);

    // Update the counter
    const ref = db.collection('post_metrics').doc(postId);
    const doc = await ref.get();
    if (!doc.exists) {
      await ref.set({ views: 0, likes: 0, ratingsTotal: 0, ratingsCount: 0, commentsCount: 1 });
    } else {
      await ref.update({ commentsCount: firebase.firestore.FieldValue.increment(1) });
    }
    return;
  }
  const key = `${postId}_comments`;
  const comments = JSON.parse(localStorage.getItem(key)) || [];
  comments.push(comment);
  localStorage.setItem(key, JSON.stringify(comments));
}

async function getPostComments(postId) {
  if (USE_FIREBASE && db) {
    const snap = await db.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'asc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  return JSON.parse(localStorage.getItem(`${postId}_comments`)) || [];
}


async function getAllUsers() {
  if (USE_FIREBASE && db) {
    const snap = await db.collection('users').orderBy('joined', 'desc').get();
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  }
  const users = JSON.parse(localStorage.getItem('nebula_users')) || {};
  return Object.values(users);
}

async function getNewsletterSubs() {
  if (USE_FIREBASE && db) {
    const snap = await db.collection('newsletter').orderBy('subscribedAt', 'desc').get();
    return snap.docs.map(d => d.data());
  }
  return JSON.parse(localStorage.getItem('nebula_newsletter')) || [];
}

// ─── NOMINATIONS (Book Suggestions) ────────────
async function submitBookNomination(nomination) {
  if (USE_FIREBASE && db) {
    const ref = await db.collection('nominations').add(nomination);
    return ref.id;
  }
  const noms = JSON.parse(localStorage.getItem('nebula_nominations')) || [];
  nomination.id = 'nom_' + Date.now();
  noms.unshift(nomination);
  localStorage.setItem('nebula_nominations', JSON.stringify(noms));
  return nomination.id;
}

async function getAllNominations() {
  if (USE_FIREBASE && db) {
    const snap = await db.collection('nominations').orderBy('submittedAt', 'desc').get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  return JSON.parse(localStorage.getItem('nebula_nominations')) || [];
}

// ─── INITIALIZATION ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  injectAuthModal();

  // Check existing session
  const user = getCurrentUser();
  if (user) {
    currentUser = user;
    onAuthChange(user);
  }

  // Firebase real-time auth listener
  if (USE_FIREBASE && auth) {
    auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const doc = await db.collection('users').doc(firebaseUser.uid).get();
        const userData = doc.exists ? doc.data() : {};
        currentUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || userData.name || firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || userData.photo,
          role: userData.role || 'user'
        };
        onAuthChange(currentUser);
      } else {
        onAuthChange(null);
      }
    });
  }
});
