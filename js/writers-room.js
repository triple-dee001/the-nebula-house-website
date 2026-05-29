/* ============================================
   THE NEBULA HOUSE — The Writer's Room
   Uses custom backend via api.js
   ============================================ */

let editorInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initWritersRoom();
});

async function initWritersRoom() {
  // Initialize Quill Editor
  if (document.getElementById('quill-editor')) {
    editorInstance = new Quill('#quill-editor', {
      theme: 'snow',
      placeholder: 'Write your story here...',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link'], ['clean']
        ]
      }
    });
  }

  // Load the public feed
  await loadFeed();

  // Wire Write button
  const btnWrite = document.getElementById('btn-write');
  if (btnWrite) {
    btnWrite.addEventListener('click', () => {
      const user = getCurrentUser();
      if (!user || !getToken()) {
        openAuthModal();
        window.addEventListener('nebula-auth-change', function handler(e) {
          if (e.detail.user) {
            window.removeEventListener('nebula-auth-change', handler);
            if (!e.detail.user.emailVerified) {
              showWrMsg('⚠️ Please verify your email before writing.');
              return;
            }
            window.location.href = 'write.html';
          }
        });
        return;
      }
      if (!user.emailVerified) {
        showWrMsg('⚠️ Please verify your email before writing.');
        return;
      }
      window.location.href = 'write.html';
    });
  }
}

function showWrMsg(msg) {
  let el = document.getElementById('wr-msg');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wr-msg';
    el.style.cssText = 'background:rgba(255,200,0,0.1);border:1px solid rgba(255,200,0,0.3);color:#f5c518;padding:0.75rem 1rem;border-radius:6px;margin:1rem 0;font-size:0.9rem;';
    const feed = document.getElementById('wr-feed');
    if (feed) feed.before(el);
  }
  el.textContent = msg;
  setTimeout(() => el.remove(), 4000);
}

async function loadFeed() {
  const feed = document.getElementById('wr-feed');
  const empty = document.getElementById('wr-empty-state');
  if (!feed) return;

  try {
    const data = await nebulaGetPosts(1, 20);
    const posts = data.posts || [];

    if (posts.length === 0) {
      if (empty) empty.style.display = 'block';
      return;
    }

    if (empty) empty.style.display = 'none';
    feed.innerHTML = posts.map(p => {
      const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const wordCount = (p.excerpt || '').split(/\s+/).length * 10;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      return `
        <article class="feed-card reveal">
          <div class="feed-card__meta">
            <span>${p.author?.name || 'Anonymous'}</span>
            <span>·</span>
            <span>${date}</span>
            <span>·</span>
            <span>${readTime} min read</span>
          </div>
          <h3 class="feed-card__title">${escapeHtml(p.title)}</h3>
          ${p.subtitle ? `<p class="feed-card__subtitle">${escapeHtml(p.subtitle)}</p>` : ''}
          <p class="feed-card__excerpt">${escapeHtml(p.excerpt || '')}</p>
          <div class="feed-card__footer">
            ${p.tags ? p.tags.split(',').slice(0,2).map(t => `<span class="article-tag">${t.trim()}</span>`).join('') : ''}
            <span style="margin-left:auto; color:var(--text-muted); font-size:0.8rem;">
              ♥ ${p._count?.likes || 0} · 💬 ${p._count?.comments || 0}
            </span>
          </div>
        </article>
      `;
    }).join('');
  } catch (err) {
    console.error('Feed load error:', err);
    if (empty) {
      empty.style.display = 'block';
      empty.textContent = 'Could not load stories. Please try again later.';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
