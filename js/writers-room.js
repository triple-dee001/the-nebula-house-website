/* ============================================
   THE NEBULA HOUSE — The Writer's Room JavaScript
   Handles main feed, challenges tabs, mentorship requests, and admin deletion
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWritersRoom();
});

let selectedMentorId = null;

async function initWritersRoom() {
  // ─── Write Button Auth Guard ───
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
              alert('Please verify your email before writing. Check your inbox for the verification link.');
              return;
            }
            window.location.href = 'write.html';
          }
        });
        return;
      }
      if (!user.emailVerified) {
        alert('Please verify your email before writing. Check your inbox for the verification link.');
        return;
      }
      window.location.href = 'write.html';
    });
  }

  // ─── Load Initial Feed ───
  await loadFeed();

  // ─── Trending Topics Tag Filtering ───
  let activeTag = '';
  document.querySelectorAll('.wr-sidebar__topic').forEach(tagEl => {
    tagEl.addEventListener('click', async (e) => {
      e.preventDefault();
      const tagText = tagEl.textContent.trim();
      
      // Toggle active tag state
      if (activeTag === tagText) {
        activeTag = '';
        tagEl.style.background = '';
        tagEl.style.color = '';
      } else {
        document.querySelectorAll('.wr-sidebar__topic').forEach(el => {
          el.style.background = '';
          el.style.color = '';
        });
        activeTag = tagText;
        tagEl.style.background = '#ffffff';
        tagEl.style.color = '#000000';
      }
      
      // Switch back to community feed tab if on another tab
      const feedTab = document.querySelector('.wr-tab[data-tab="feed"]');
      if (feedTab && !feedTab.classList.contains('active')) {
        document.querySelectorAll('.wr-tab').forEach(t => t.classList.remove('active'));
        feedTab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
        const target = document.getElementById('cnt-feed');
        if (target) target.style.display = 'block';
      }

      await loadFeed(activeTag);
    });
  });

  // ─── Tab Switching ───
  document.querySelectorAll('.wr-tab').forEach(tab => {
    tab.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Reset active tabs
      document.querySelectorAll('.wr-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all contents
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

      // Show targeted content
      const targetId = 'cnt-' + tab.dataset.tab;
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';

      // Load tab-specific content
      if (tab.dataset.tab === 'challenges') {
        await loadChallengesTab();
      } else if (tab.dataset.tab === 'mentorship') {
        await loadMentorshipTab();
      } else if (tab.dataset.tab === 'feed') {
        await loadFeed();
      } else if (tab.dataset.tab === 'writers') {
        await loadWritersTab();
      }
    });
  });

  // ─── Mentorship Modal Wire-up ───
  const btnCloseModal = document.getElementById('btn-close-mentor-modal');
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      document.getElementById('mentorship-request-modal').classList.remove('open');
    });
  }

  const btnCloseModalX = document.getElementById('btn-close-mentor-modal-x');
  if (btnCloseModalX) {
    btnCloseModalX.addEventListener('click', () => {
      document.getElementById('mentorship-request-modal').classList.remove('open');
    });
  }

  const btnSubmitReq = document.getElementById('btn-submit-mentor-request');
  if (btnSubmitReq) {
    btnSubmitReq.addEventListener('click', async () => {
      const mentorId = document.getElementById('mentor-req-id').value;
      const message = document.getElementById('mentor-req-message').value.trim();
      if (!mentorId) return;

      btnSubmitReq.disabled = true;
      btnSubmitReq.textContent = 'Sending...';

      try {
        await nebulaRequestMentorship(mentorId, message);
        document.getElementById('mentorship-request-modal').classList.remove('open');
        document.getElementById('mentor-req-message').value = '';
        alert('Mentorship request successfully sent!');
        await loadMentorshipRequests();
      } catch (err) {
        alert(err.message);
      }
      btnSubmitReq.disabled = false;
      btnSubmitReq.textContent = 'Send Request';
    });
  }

  // ─── Mentorship sub-tabs ───
  const btnBrowse = document.getElementById('btn-browse-mentors');
  const btnMyReq = document.getElementById('btn-my-requests');

  if (btnBrowse && btnMyReq) {
    btnBrowse.addEventListener('click', () => {
      btnBrowse.style.background = '#fff';
      btnBrowse.style.color = '#000';
      btnMyReq.style.background = 'rgba(255,255,255,0.08)';
      btnMyReq.style.color = '#fff';
      document.getElementById('mentorship-browse').style.display = 'block';
      document.getElementById('mentorship-requests').style.display = 'none';
    });

    btnMyReq.addEventListener('click', async () => {
      btnMyReq.style.background = '#fff';
      btnMyReq.style.color = '#000';
      btnBrowse.style.background = 'rgba(255,255,255,0.08)';
      btnBrowse.style.color = '#fff';
      document.getElementById('mentorship-browse').style.display = 'none';
      document.getElementById('mentorship-requests').style.display = 'block';
      await loadMentorshipRequests();
    });
  }

  // ─── Newsletter Form ───
  const newsletterForm = document.getElementById('wr-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        try {
          await nebulaSubscribeNewsletter(input.value);
          input.value = '';
          const msg = document.getElementById('wr-newsletter-success');
          if (msg) {
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
          }
        } catch (err) {
          alert(err.message || 'Newsletter subscription failed');
        }
      }
    });
  }

  // ─── Load Featured Writers Sidebar ───
  const sidebarWriters = document.getElementById('featured-writers-sidebar');
  if (sidebarWriters) {
    try {
      const writers = await nebulaGetWriters();
      const featured = writers.filter(w => w._count?.posts > 0).sort((a, b) => (b._count?.posts || 0) - (a._count?.posts || 0)).slice(0, 3);
      if (featured.length > 0) {
        sidebarWriters.innerHTML = featured.map(w => {
          const initial = (w.name || 'U')[0].toUpperCase();
          const avatarUrl = w.photo ? (w.photo.startsWith('http') || w.photo.startsWith('data:') ? w.photo : `https://the-nebula-house-backend.onrender.com${w.photo}`) : '';
          const avatarHtml = avatarUrl 
            ? `<img src="${avatarUrl}" alt="${w.name}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;display:block;">` 
            : `<div class="wr-sidebar__writer-avatar">${initial}</div>`;
          const count = w._count?.posts || 0;
          const roleLabel = w.role === 'ADMIN' || w.role === 'SUPER_ADMIN' ? 'Founder' : 'Writer';
          const linkTarget = w.slug ? `writer.html?slug=${w.slug}` : `writer.html?id=${w.id}`;
          return `
            <a href="${linkTarget}" class="wr-sidebar__writer" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem; cursor:pointer;">
              ${avatarHtml}
              <div>
                <div class="wr-sidebar__writer-name" style="font-weight:600;">${w.name}</div>
                <div class="wr-sidebar__writer-desc" style="font-size:0.8rem; color:var(--text-muted);">${roleLabel} · ${count} ${count === 1 ? 'article' : 'articles'}</div>
              </div>
            </a>
          `;
        }).join('');
      }
    } catch (e) {
      console.error('Error loading featured writers sidebar:', e);
    }
  }
}

// ─── FEED TAB ────────────────────────────────
async function loadFeed(tag = '') {
  const feed = document.getElementById('wr-feed');
  const empty = document.getElementById('wr-empty-state');
  if (!feed) return;

  try {
    const data = await nebulaGetPosts(1, 40, tag);
    const posts = data.posts || [];
    const user = getCurrentUser();
    const userIsAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

    if (posts.length === 0) {
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    feed.innerHTML = posts.map(p => {
      const initial = (p.author?.name || 'A')[0].toUpperCase();
      const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const wordCount = (p.excerpt || '').split(/\s+/).length * 10;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      return `
        <div class="wr-article">
          <div style="flex:1;">
            <div class="wr-article__meta">
              <div class="wr-article__avatar">
                ${p.author?.photo ? `<img src="${p.author.photo.startsWith('http') || p.author.photo.startsWith('data:') ? p.author.photo : 'https://the-nebula-house-backend.onrender.com' + p.author.photo}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;display:block;">` : initial}
              </div>
              <span style="cursor:pointer;" onclick="window.location.href='${p.author?.slug ? 'writer.html?slug=' + p.author.slug : 'writer.html?id=' + p.author?.id}'">${p.author?.name || 'Anonymous'}</span>
            </div>
            <a href="story.html?id=${p.id}" class="wr-article__title" style="text-decoration:none;color:#fff;display:block;cursor:pointer;">${escapeHtml(p.title)}</a>
            ${p.subtitle ? `<div style="color:rgba(255,255,255,0.6);font-size:0.95rem;margin-bottom:0.4rem;">${escapeHtml(p.subtitle)}</div>` : ''}
            <div class="wr-article__excerpt">${escapeHtml(p.excerpt || '')}</div>
            <div class="wr-article__footer">
              <span>${date}</span>
              <span>·</span>
              <span>${readTime} min read</span>
              ${p.tags ? p.tags.split(',').slice(0,2).map(t => `<span style="background:rgba(255,255,255,0.06);padding:0.15rem 0.5rem;border-radius:12px;font-size:0.75rem;">${t.trim()}</span>`).join('') : ''}
              <span style="margin-left:auto; color:var(--text-muted);">
                ♥ ${p._count?.likes || 0} · 💬 ${p._count?.comments || 0}
              </span>
              ${userIsAdmin ? `<button class="wr-article__delete" style="margin-left:1rem;" onclick="handleDeletePost('${p.id}')">Delete</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Feed load error:', err);
    if (empty) {
      empty.style.display = 'block';
      empty.textContent = 'Could not load feed stories. Please try again.';
    }
  }
}

// ─── CHALLENGES TAB ──────────────────────────
async function loadChallengesTab() {
  const activeSection = document.getElementById('challenges-active');
  const feed = document.getElementById('challenges-feed');
  if (!activeSection) return;

  try {
    const challenges = await nebulaGetChallenges(true);
    const active = challenges?.[0]; // Get the latest active challenge

    if (!active) {
      activeSection.innerHTML = `
        <div class="challenge-hero">
          <div class="challenge-hero__theme">No Active Challenge</div>
          <div class="challenge-hero__title">Resting the Quill</div>
          <div class="challenge-hero__desc">There is no writing challenge running this month. Spend some time reading or write a regular essay!</div>
        </div>
      `;
      if (feed) feed.innerHTML = '<div class="wr-empty">No active challenge submissions.</div>';
      return;
    }

    const startDateStr = new Date(active.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDateStr = new Date(active.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    activeSection.innerHTML = `
      <div class="challenge-hero">
        <div class="challenge-hero__theme">Active Monthly Challenge</div>
        <div class="challenge-hero__title">${escapeHtml(active.title)}</div>
        <div style="font-size:0.85rem; color:#bb86fc; font-weight:600; margin-bottom:1rem; text-transform:uppercase;">Theme: ${escapeHtml(active.theme)} · ${startDateStr} to ${endDateStr}</div>
        <div class="challenge-hero__desc">${escapeHtml(active.description)}</div>
        <a href="write.html?challengeId=${active.id}" class="wr-header__write-btn" style="background:#bb86fc; color:#000; font-weight:600; border-color:#bb86fc;">
          ✨ Write for this Challenge
        </a>
      </div>
    `;

    // Load submissions for this challenge
    const fullChallenge = await nebulaGetChallenge(active.id);
    const submissions = fullChallenge.posts || [];

    if (submissions.length === 0) {
      if (feed) feed.innerHTML = '<div class="wr-empty">No stories submitted for this challenge yet. Be the first!</div>';
      return;
    }

    if (feed) {
      feed.innerHTML = submissions.map(p => {
        const initial = (p.author?.name || 'A')[0].toUpperCase();
        const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const wordCount = (p.excerpt || '').split(/\s+/).length * 10;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        return `
          <div class="wr-article">
            <div style="flex:1;">
              <div class="wr-article__meta">
                <div class="wr-article__avatar">
                  ${p.author?.photo ? `<img src="${p.author.photo.startsWith('http') ? p.author.photo : 'https://the-nebula-house-backend.onrender.com' + p.author.photo}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;display:block;">` : initial}
                </div>
                <span style="cursor:pointer;" onclick="window.location.href='${p.author?.slug ? 'writer.html?slug=' + p.author.slug : 'writer.html?id=' + p.author?.id}'">${p.author?.name || 'Anonymous'}</span>
              </div>
              <a href="story.html?id=${p.id}" class="wr-article__title" style="text-decoration:none;color:#fff;display:block;cursor:pointer;">${escapeHtml(p.title)}</a>
              <div class="wr-article__excerpt">${escapeHtml(p.excerpt || '')}</div>
              <div class="wr-article__footer">
                <span>${date}</span>
                <span>·</span>
                <span>${readTime} min read</span>
                <span style="margin-left:auto; color:var(--text-muted);">
                  ♥ ${p._count?.likes || 0} · 💬 ${p._count?.comments || 0}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Error loading challenges tab:', err);
    activeSection.innerHTML = '<div class="wr-empty">Error loading monthly challenges.</div>';
  }
}

// ─── MENTORSHIP TAB ──────────────────────────
async function loadMentorshipTab() {
  const list = document.getElementById('mentors-list');
  if (!list) return;

  try {
    list.innerHTML = '<div class="wr-empty">Loading mentors...</div>';
    const mentors = await nebulaGetMentors();

    if (mentors.length === 0) {
      list.innerHTML = '<div class="wr-empty" style="grid-column: 1/-1;">No mentors available at this time.</div>';
      return;
    }

    list.innerHTML = mentors.map(m => {
      const initial = (m.name || m.email)[0].toUpperCase();
      return `
        <div class="mentor-card">
          <div class="mentor-card__header">
            ${m.photo 
              ? `<img class="mentor-card__avatar" src="${m.photo.startsWith('http') ? m.photo : 'https://the-nebula-house-backend.onrender.com' + m.photo}" alt="${m.name}">` 
              : `<div class="mentor-card__avatar" style="display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1.2rem;">${initial}</div>`
            }
            <div>
              <div class="mentor-card__name">${escapeHtml(m.name)}</div>
              <div style="font-size:0.8rem; color:#bb86fc; font-weight:600;">Writer & Mentor</div>
            </div>
          </div>
          <p class="mentor-card__bio" style="font-style:italic;">"${escapeHtml(m.bio || 'Nebula writer')}"</p>
          <div class="mentor-card__m-bio">${escapeHtml(m.mentorBio || 'I am ready to help writers improve their tone, storytelling structure, and formatting. Send me a request!')}</div>
          <button class="mentor-card__btn" onclick="openRequestMentorship('${m.id}', '${m.name.replace(/'/g, "\\'")}')">Request Mentorship</button>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading mentors:', err);
    list.innerHTML = '<div class="wr-empty" style="grid-column: 1/-1;">Error loading mentor profiles.</div>';
  }
}

function openRequestMentorship(mentorId, mentorName) {
  const user = getCurrentUser();
  if (!user || !getToken()) {
    openAuthModal();
    return;
  }
  if (!user.emailVerified) {
    alert("Please verify your email before requesting mentorship.");
    return;
  }
  
  document.getElementById('mentor-req-id').value = mentorId;
  document.getElementById('mentor-req-title').textContent = `Request Mentorship from ${mentorName}`;
  document.getElementById('mentorship-request-modal').classList.add('open');
}

async function loadMentorshipRequests() {
  const tbody = document.getElementById('my-requests-list');
  const empty = document.getElementById('requests-empty');
  if (!tbody) return;

  try {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem;">Loading requests...</td></tr>';
    const requests = await nebulaGetMentorshipRequests();
    const user = getCurrentUser();

    if (requests.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = requests.map(r => {
      // Determine if logged-in user is mentor or mentee
      const isUserMentor = r.mentorId === user.id;
      const counterpart = isUserMentor ? r.mentee : r.mentor;
      const roleLabel = isUserMentor ? 'Mentee' : 'Mentor';
      const date = new Date(r.createdAt).toLocaleDateString();
      const statusLabel = `<span class="badge badge--${r.status.toLowerCase()}">${r.status}</span>`;

      let actions = '';
      if (isUserMentor && r.status === 'PENDING') {
        actions = `
          <div style="display:flex; gap:0.4rem;">
            <button class="btn-approve" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="respondRequest('${r.id}', 'ACCEPTED')">Accept</button>
            <button class="btn-reject" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="respondRequest('${r.id}', 'DECLINED')">Decline</button>
          </div>
        `;
      } else {
        actions = '<span style="color:#6b7280; font-size:0.8rem;">None</span>';
      }

      return `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:0.8rem 1.25rem; font-weight:500;">${escapeHtml(counterpart?.name || counterpart?.email)}</td>
          <td style="padding:0.8rem 1.25rem;">${roleLabel}</td>
          <td style="padding:0.8rem 1.25rem; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${r.message||''}">${escapeHtml(r.message || 'No message')}</td>
          <td style="padding:0.8rem 1.25rem;">${statusLabel}</td>
          <td style="padding:0.8rem 1.25rem;">${actions}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading mentorship requests:', err);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:red;">Error loading requests.</td></tr>';
  }
}

async function respondRequest(requestId, status) {
  if (!confirm(`Are you sure you want to mark this mentorship request as ${status.toLowerCase()}?`)) return;
  try {
    await nebulaRespondMentorshipRequest(requestId, status);
    alert(`Request ${status.toLowerCase()}!`);
    await loadMentorshipRequests();
  } catch (err) {
    alert(err.message);
  }
}

// ─── ADMIN DELETION ──────────────────────────
async function handleDeletePost(postId) {
  if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) return;
  try {
    await adminDeletePost(postId);
    await loadFeed();
  } catch (err) {
    alert(err.message);
  }
}

// ─── HELPERS ─────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function loadWritersTab() {
  const grid = document.getElementById('writers-list-grid');
  const empty = document.getElementById('writers-empty');
  if (!grid) return;

  grid.innerHTML = '<div style="text-align:center; padding:2rem; width:100%; color:#aaa;">Loading writers...</div>';
  empty.style.display = 'none';

  try {
    const writers = await nebulaGetWriters();
    if (!writers || writers.length === 0) {
      grid.innerHTML = '';
      empty.style.display = 'block';
      return;
    }

    grid.innerHTML = writers.map(w => {
      const photoUrl = w.photo || '';
      let avatarHtml = '';
      if (photoUrl) {
        const imgSrc = photoUrl.startsWith('http') || photoUrl.startsWith('data:') ? photoUrl : `https://the-nebula-house-backend.onrender.com${photoUrl}`;
        avatarHtml = `<img src="${imgSrc}" alt="${w.name}" class="mentor-card__avatar">`;
      } else {
        const initial = (w.name || 'U')[0].toUpperCase();
        avatarHtml = `<div class="mentor-card__avatar" style="display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:1.2rem; background:rgba(255,255,255,0.08);">${initial}</div>`;
      }

      const bio = w.bio || 'This writer hasn\'t written a bio yet.';
      const roleText = w.role === 'ADMIN' || w.role === 'SUPER_ADMIN' ? 'Owner / Editor' : 'Writer';
      const postCount = w._count?.posts || 0;

      return `
        <div class="mentor-card">
          <div class="mentor-card__header">
            ${avatarHtml}
            <div>
              <div class="mentor-card__name">${w.name}</div>
              <div style="font-size:0.8rem; color:#bb86fc; font-weight:600; text-transform:uppercase;">${roleText}</div>
            </div>
          </div>
          <div class="mentor-card__bio" style="margin-bottom:0.5rem; color:#aaa; font-style:italic;">Joined ${new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
          <div class="mentor-card__m-bio" style="font-size:0.9rem; color:#ddd; margin-bottom:1.2rem; line-height:1.5; flex:1;">
            ${bio}
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem; display:flex; align-items:center; gap:0.4rem;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>${postCount} stories published</span>
          </div>
          <a href="writer.html?id=${w.id}" class="mentor-card__btn" style="text-decoration:none;">View Profile</a>
        </div>
      `;
    }).join('');

  } catch (err) {
    grid.innerHTML = '';
    grid.innerHTML = `<div style="text-align:center; padding:2rem; width:100%; color:#e55;">Error loading directory: ${err.message}</div>`;
  }
}
