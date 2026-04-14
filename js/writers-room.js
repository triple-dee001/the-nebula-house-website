/* ============================================
   THE NEBULA HOUSE — The Writer's Room
   ============================================ */

/* 
  FIREBASE CONFIGURATION
  ======================
  To use a real backend, paste your Firebase config below and set `useFirebase = true;`
*/
const useFirebase = false;

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if requested
let db = null;
let auth = null;
if (useFirebase && typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    console.log("Firebase initialized");
  } catch (e) {
    console.warn("Firebase initialization failed. Make sure your config is correct. Falling back to local storage.", e);
  }
}

// Global UI State
let currentUser = null; // { name, email, uid }
let editorInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initWritersRoom();
});

function initWritersRoom() {
  // DOM Elements
  const btnLoginModal = document.getElementById('btn-login-modal');
  const authModal = document.getElementById('auth-modal');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  
  const authSection = document.getElementById('auth-section');
  const userDashboard = document.getElementById('user-dashboard');
  const userDisplayName = document.getElementById('user-display-name');
  
  const btnNewPost = document.getElementById('btn-new-post');
  const editorModal = document.getElementById('editor-modal');
  const btnCloseEditor = document.getElementById('btn-close-editor');
  const btnPublish = document.getElementById('btn-publish');
  const btnLogout = document.getElementById('btn-logout');

  // Input Elements
  const authName = document.getElementById('auth-name');
  const authEmail = document.getElementById('auth-email');
  const btnSubmitLogin = document.getElementById('btn-submit-login');
  const btnSubmitSignup = document.getElementById('btn-submit-signup');

  // Initialize Quill Editor if the container exists
  if (document.getElementById('quill-editor')) {
    editorInstance = new Quill('#quill-editor', {
      theme: 'snow',
      placeholder: 'Write your story here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    });
  }

  // --- Auth Flow ---
  
  // Check existing session
  const savedUser = localStorage.getItem('nebula_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateAuthUI();
  } else {
    updateAuthUI();
  }

  function updateAuthUI() {
    if (currentUser) {
      authSection.style.display = 'none';
      userDashboard.style.display = 'block';
      userDisplayName.textContent = currentUser.name;
    } else {
      authSection.style.display = 'block';
      userDashboard.style.display = 'none';
    }
    loadFeed();
  }

  // Modal Toggles
  if (btnLoginModal && authModal) {
    btnLoginModal.addEventListener('click', () => {
      authModal.classList.add('active');
    });
    btnCloseAuth.addEventListener('click', () => {
      authModal.classList.remove('active');
    });
  }

  if (btnNewPost && editorModal) {
    btnNewPost.addEventListener('click', () => {
      editorModal.classList.add('active');
      // Reset editor
      document.getElementById('editor-title').value = '';
      document.getElementById('editor-tags').value = '';
      editorInstance.setContents([{ insert: '\n' }]);
    });
    btnCloseEditor.addEventListener('click', () => {
      editorModal.classList.remove('active');
    });
  }

  // Login / Signup Logic (Prototype LocalStorage)
  if (btnSubmitLogin) {
    btnSubmitLogin.addEventListener('click', () => {
      const email = authEmail.value.trim();
      if (!email) { alert("Please enter an email"); return; }
      
      // Look up user by email in local accounts (prototype feature)
      const users = JSON.parse(localStorage.getItem('nebula_users')) || [];
      const user = users.find(u => u.email === email);
      
      if (user) {
        currentUser = user;
        localStorage.setItem('nebula_user', JSON.stringify(currentUser));
        authModal.classList.remove('active');
        updateAuthUI();
      } else {
        // Just create a guest ad-hoc if not found to make testing seamless
        const name = authName.value.trim() || email.split('@')[0];
        currentUser = { uid: 'u_'+Date.now(), name, email };
        localStorage.setItem('nebula_user', JSON.stringify(currentUser));
        authModal.classList.remove('active');
        updateAuthUI();
      }
    });
  }

  if (btnSubmitSignup) {
    btnSubmitSignup.addEventListener('click', () => {
      const name = authName.value.trim();
      const email = authEmail.value.trim();
      if (!email || !name) { alert("Name and email are required for sign up."); return; }
      
      const users = JSON.parse(localStorage.getItem('nebula_users')) || [];
      const newUser = { uid: 'u_'+Date.now(), name, email };
      users.push(newUser);
      localStorage.setItem('nebula_users', JSON.stringify(users));
      
      currentUser = newUser;
      localStorage.setItem('nebula_user', JSON.stringify(currentUser));
      authModal.classList.remove('active');
      updateAuthUI();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('nebula_user');
      updateAuthUI();
    });
  }

  // --- Publishing Flow ---
  if (btnPublish) {
    btnPublish.addEventListener('click', () => {
      const title = document.getElementById('editor-title').value.trim();
      const tagsInput = document.getElementById('editor-tags').value.trim();
      const contentHtml = editorInstance.root.innerHTML;
      const contentText = editorInstance.getText().trim();
      
      if (!title || !contentText) {
        alert("Please provide both a title and article content.");
        return;
      }

      if (!currentUser) {
        alert("You must be logged in to publish.");
        return;
      }

      const newPost = {
        id: 'post_' + Date.now(),
        authorId: currentUser.uid,
        authorName: currentUser.name,
        title: title,
        tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : [],
        excerpt: contentText.substring(0, 150) + '...',
        content: contentHtml,
        timestamp: new Date().toISOString()
      };

      // Save to localStorage DB
      const posts = JSON.parse(localStorage.getItem('nebula_posts')) || [];
      posts.unshift(newPost); // Add to beginning
      localStorage.setItem('nebula_posts', JSON.stringify(posts));

      editorModal.classList.remove('active');
      loadFeed();
      
      // Small success indication
      btnNewPost.innerHTML = 'Published! ✓';
      setTimeout(() => { btnNewPost.innerHTML = 'Write a Story'; }, 2000);
    });
  }
}

// --- Feed Rendering ---
function loadFeed() {
  const feedContainer = document.getElementById('article-feed');
  if (!feedContainer) return;

  // For prototype, pull from localStorage
  const posts = JSON.parse(localStorage.getItem('nebula_posts')) || [];
  
  if (posts.length === 0) {
    feedContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); background: rgba(255,255,255,0.02); border-radius: 4px;">No stories published yet. Be the first to write!</div>';
    return;
  }

  feedContainer.innerHTML = '';
  
  posts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    
    // Format date
    const dateStr = new Date(post.timestamp).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    
    // Calculate read time roughly
    const wordCount = post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    let tagsHtml = '';
    if (post.tags && post.tags.length > 0) {
      tagsHtml = post.tags.slice(0, 2).map(tag => `<span class="article-tag" style="padding: 2px 8px; font-size: 0.7rem;">${tag}</span>`).join('');
    }

    card.innerHTML = `
      <div style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${tagsHtml}
      </div>
      <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
        by <span style="color:var(--text-primary);">${escapeHtml(post.authorName)}</span> · ${dateStr} · ${readTime} min read
      </p>
      <p class="post-card__excerpt">${escapeHtml(post.excerpt)}</p>
      <button class="btn" onclick="alert('In a full backend setup, this would load the full article page.')" style="margin-top: 1rem; padding: 6px 12px; font-size: 0.8rem; background:transparent; border: 1px solid rgba(255,255,255,0.2);">Read More →</button>
    `;
    
    feedContainer.appendChild(card);
  });
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
