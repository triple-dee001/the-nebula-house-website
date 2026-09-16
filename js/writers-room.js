/* ============================================
   THE NEBULA HOUSE — The Writer's Room JavaScript
   Handles main feed, challenges tabs, mentorship requests, and admin deletion
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWritersRoom();
});

function initWritersRoom() {
  // ─── TABS NAVIGATION ──────────────────────────
  const tabs = document.querySelectorAll('.wr-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

      const targetContent = document.getElementById(`cnt-${targetTab}`);
      if (targetContent) targetContent.style.display = 'block';

      if (targetTab === 'feed') {
        loadFeed();
      } else if (targetTab === 'writers') {
        loadWritersTab();
      } else if (targetTab === 'challenges') {
        loadChallengesTab();
      } else if (targetTab === 'mentorship') {
        loadMentorshipTab();
        loadMentorshipRequests();
      }
    });
  });

  // ─── MENTORSHIP SUB-TABS ──────────────────────
  const btnBrowseMentors = document.getElementById('btn-browse-mentors');
  const btnMyRequests = document.getElementById('btn-my-requests');
  const cntBrowse = document.getElementById('mentorship-browse');
  const cntRequests = document.getElementById('mentorship-requests');

  if (btnBrowseMentors && btnMyRequests && cntBrowse && cntRequests) {
    btnBrowseMentors.addEventListener('click', () => {
      cntBrowse.style.display = 'block';
      cntRequests.style.display = 'none';
      btnBrowseMentors.style.background = '#fff';
      btnBrowseMentors.style.color = '#000';
      btnMyRequests.style.background = 'rgba(255,255,255,0.08)';
      btnMyRequests.style.color = '#fff';
    });
    btnMyRequests.addEventListener('click', () => {
      cntBrowse.style.display = 'none';
      cntRequests.style.display = 'block';
      btnMyRequests.style.background = '#fff';
      btnMyRequests.style.color = '#000';
      btnBrowseMentors.style.background = 'rgba(255,255,255,0.08)';
      btnBrowseMentors.style.color = '#fff';
      loadMentorshipRequests();
    });
  }

  // ─── SIDEBAR TOPIC FILTERING ──────────────────
  document.querySelectorAll('.wr-sidebar__topic').forEach(topicBtn => {
    topicBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const tagText = topicBtn.textContent.trim();
      const feedTab = document.querySelector('.wr-tab[data-tab="feed"]');
      if (feedTab) feedTab.click();
      loadFeed(tagText);
    });
  });

  // ─── WRITE BUTTON HANDLER ──────────────────────
  const btnWrite = document.getElementById('btn-write');
  if (btnWrite) {
    btnWrite.addEventListener('click', (e) => {
      e.preventDefault();
      const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      if (!user || typeof getToken !== 'function' || !getToken()) {
        if (typeof openAuthModal === 'function') openAuthModal();
        return;
      }
      window.location.href = 'write.html';
    });
  }

  // ─── MENTORSHIP MODAL LISTENERS ───────────────
  const modal = document.getElementById('mentorship-request-modal');
  const btnCloseModal = document.getElementById('btn-close-mentor-modal');
  const btnCloseModalX = document.getElementById('btn-close-mentor-modal-x');
  if (modal) {
    if (btnCloseModal) btnCloseModal.addEventListener('click', () => modal.classList.remove('open'));
    if (btnCloseModalX) btnCloseModalX.addEventListener('click', () => modal.classList.remove('open'));
  }
  const btnSubmitReq = document.getElementById('btn-submit-mentor-request');
  if (btnSubmitReq) {
    btnSubmitReq.addEventListener('click', async () => {
      const mentorId = document.getElementById('mentor-req-id')?.value;
      const message = document.getElementById('mentor-req-message')?.value;
      if (!message || !message.trim()) {
        alert('Please enter a message explaining your goals.');
        return;
      }
      btnSubmitReq.disabled = true;
      btnSubmitReq.textContent = 'Sending...';
      try {
        if (typeof nebulaRequestMentorship === 'function') {
          await nebulaRequestMentorship(mentorId, message);
          alert('Mentorship request sent successfully!');
          if (modal) modal.classList.remove('open');
          const msgInput = document.getElementById('mentor-req-message');
          if (msgInput) msgInput.value = '';
          await loadMentorshipRequests();
        }
      } catch (err) {
        alert(err.message || 'Failed to send request');
      } finally {
        btnSubmitReq.disabled = false;
        btnSubmitReq.textContent = 'Send Request';
      }
    });
  }

  // ─── INITIAL LOAD ──────────────────────────────
  loadFeed();
  loadFeaturedWritersSidebar();
}

let selectedMentorId = null;

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getArticleLink(p) {
  if (!p) return '/the-writers-room.html';
  const authorSlug = p.author?.slug || slugify(p.author?.name) || 'author';
  const postSlug = p.slug || slugify(p.title) || p.id;
  return `/story/${authorSlug}/${postSlug}`;
}

function isStorySaved(storyId) {
  try {
    const saved = JSON.parse(localStorage.getItem('nebula_saved_stories') || '[]');
    return saved.includes(storyId);
  } catch (e) { return false; }
}

function toggleSaveStory(event, storyId) {
  event.preventDefault();
  event.stopPropagation();
  try {
    let saved = JSON.parse(localStorage.getItem('nebula_saved_stories') || '[]');
    const btn = event.currentTarget;
    if (saved.includes(storyId)) {
      saved = saved.filter(id => id !== storyId);
      if (btn) {
        btn.style.color = 'var(--text-muted)';
        btn.setAttribute('title', 'Save story');
      }
    } else {
      saved.push(storyId);
      if (btn) {
        btn.style.color = '#bb86fc';
        btn.setAttribute('title', 'Saved to reading list');
      }
    }
    localStorage.setItem('nebula_saved_stories', JSON.stringify(saved));
  } catch (e) {
    console.error('Save story error:', e);
  }
}

function toggleCardMenu(event, menuId) {
  event.preventDefault();
  event.stopPropagation();
  document.querySelectorAll('.wr-card-menu-dropdown').forEach(m => {
    if (m.id !== menuId) m.style.display = 'none';
  });
  const menu = document.getElementById(menuId);
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}

document.addEventListener('click', () => {
  document.querySelectorAll('.wr-card-menu-dropdown').forEach(m => m.style.display = 'none');
});

// ─── FEED TAB ────────────────────────────────
async function loadFeed(tag = '') {
  const feed = document.getElementById('wr-feed');
  const empty = document.getElementById('wr-empty-state');
  if (!feed) return;

  // Visual loading feedback
  if (empty) empty.style.display = 'none';
  if (!feed.children.length || !feed.innerHTML.trim() || feed.querySelector('.wr-empty-feed-loading')) {
    feed.innerHTML = `
      <div class="wr-empty-feed-loading" style="text-align: center; padding: 4rem 1rem; color: var(--text-muted); font-family: var(--font-secondary);">
        <div style="font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; color: #fff;">Loading Feed...</div>
        <div style="font-size: 0.85rem; opacity: 0.6;">Fetching stories from the Nebula community</div>
      </div>
    `;
  } else {
    feed.style.opacity = '0.4';
    feed.style.transition = 'opacity 0.15s ease';
  }

  try {
    const data = await nebulaGetPosts(1, 15, tag);
    feed.style.opacity = '1';
    const posts = data.posts || [];
    const user = getCurrentUser();
    const userIsAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

    if (posts.length === 0) {
      feed.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    feed.innerHTML = posts.map((p, idx) => {
      const initial = (p.author?.name || 'A')[0].toUpperCase();
      const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const wordCount = (p.excerpt || '').split(/\s+/).length * 10;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      let rawCover = p.coverImage;
      if (!rawCover && p.excerpt) {
        const m = (p.excerpt || '').match(/<img[^>]+src=["']([^"']+)["']/i);
        if (m) rawCover = m[1];
      }
      let coverSrc = 'assets/images/room-icon.png';
      if (rawCover) {
        if (rawCover.startsWith('http://') || rawCover.startsWith('https://') || rawCover.startsWith('data:')) {
          coverSrc = rawCover;
        } else if (rawCover.startsWith('/') || rawCover.startsWith('assets/')) {
          coverSrc = rawCover;
        } else {
          coverSrc = 'https://the-nebula-house-backend.onrender.com/' + rawCover;
        }
      }

      const articleUrl = getArticleLink(p);
      const authorUrl = p.author?.slug ? `writer.html?slug=${p.author.slug}` : `writer.html?id=${p.author?.id}`;
      const saved = isStorySaved(p.id);
      const menuId = `card-menu-${p.id}-${idx}`;

      return `
        <a href="${articleUrl}" class="wr-article" style="text-decoration:none; color:inherit; display:grid; position:relative;">
          <div style="flex:1; min-width:0;">
            <div class="wr-article__meta">
              <div class="wr-article__avatar">
                ${p.author?.photo ? `<img src="${p.author.photo.startsWith('http') || p.author.photo.startsWith('data:') ? p.author.photo : 'https://the-nebula-house-backend.onrender.com' + p.author.photo}" style="width:24px;height:24px;border-radius:50%;object-fit:cover;display:block;">` : `<div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${initial}</div>`}
              </div>
              <span style="cursor:pointer; position:relative; z-index:2; font-weight:500;" onclick="event.preventDefault(); event.stopPropagation(); window.location.href='${authorUrl}';">${escapeHtml(p.author?.name || 'Anonymous')}</span>
              <span>·</span>
              <span>${date}</span>
            </div>

            <div class="wr-article__title" style="color:#fff;font-weight:700;font-size:1.15rem;line-height:1.3;margin-bottom:0.4rem;">${escapeHtml(p.title)}</div>
            ${p.subtitle ? `<div style="color:rgba(255,255,255,0.65);font-size:0.92rem;margin-bottom:0.4rem;">${escapeHtml(p.subtitle)}</div>` : ''}
            <div class="wr-article__excerpt">${escapeHtml(p.excerpt || '')}</div>

            <div class="wr-article__footer" style="display:flex; align-items:center; gap:1.25rem; margin-top:1rem; font-size:0.82rem; color:var(--text-muted);">
              <span>${readTime} min read</span>
              ${p.tags ? p.tags.split(',').slice(0,1).map(t => `<span style="background:rgba(255,255,255,0.06);padding:0.15rem 0.55rem;border-radius:12px;font-size:0.75rem;">${t.trim()}</span>`).join('') : ''}
              
              <div style="margin-left:auto; display:flex; align-items:center; gap:1rem;">
                <span title="Views" style="display:inline-flex; align-items:center; gap:0.25rem;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ${p.views || 0}
                </span>

                <span title="Likes" style="display:inline-flex; align-items:center; gap:0.25rem;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ${p._count?.likes || 0}
                </span>

                <span title="Comments" style="display:inline-flex; align-items:center; gap:0.25rem;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  ${p._count?.comments || 0}
                </span>

                <button title="${saved ? 'Saved to reading list' : 'Save story'}" style="background:none; border:none; color:${saved ? '#bb86fc' : 'var(--text-muted)'}; cursor:pointer; padding:0.2rem; display:flex; align-items:center; position:relative; z-index:2;" onclick="toggleSaveStory(event, '${p.id}')">
                  <svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>

                <div style="position:relative; display:inline-block;">
                  <button title="More options" style="background:none; border:none; color:var(--text-muted); cursor:pointer; padding:0.2rem; display:flex; align-items:center; position:relative; z-index:2;" onclick="toggleCardMenu(event, '${menuId}')">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></svg>
                  </button>

                  <div id="${menuId}" class="wr-card-menu-dropdown" style="display:none; position:absolute; right:0; top:100%; z-index:100; background:#181818; border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:0.4rem 0; min-width:160px; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
                    <div style="padding:0.5rem 1rem; font-size:0.8rem; color:#fff; cursor:pointer; hover:background:rgba(255,255,255,0.05);" onclick="event.preventDefault(); event.stopPropagation(); window.location.href='${authorUrl}';">
                      Follow author
                    </div>
                    <div style="padding:0.5rem 1rem; font-size:0.8rem; color:#fff; cursor:pointer;" onclick="event.preventDefault(); event.stopPropagation(); navigator.clipboard.writeText(window.location.origin + '${articleUrl}'); alert('Story link copied to clipboard!');">
                      Copy story link
                    </div>
                    ${userIsAdmin ? `
                      <div style="padding:0.5rem 1rem; font-size:0.8rem; color:#e55; cursor:pointer; border-top:1px solid rgba(255,255,255,0.08);" onclick="event.preventDefault(); event.stopPropagation(); handleDeletePost('${p.id}');">
                        Delete story
                      </div>
                    ` : ''}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div style="flex-shrink:0;width:140px;height:100px;border-radius:6px;overflow:hidden;background:#111;">
            <img src="${coverSrc}" alt="${escapeHtml(p.title)}" style="width:100%;height:100%;object-fit:${p.coverImage ? 'cover' : 'contain'};padding:${p.coverImage ? '0' : '20px'};box-sizing:border-box;opacity:${p.coverImage ? '1' : '0.4'};" onerror="this.src='assets/images/room-icon.png';this.style.objectFit='contain';this.style.padding='20px';this.style.opacity='0.4';">
          </div>
        </a>
      `;
    }).join('');

  } catch (err) {
    feed.style.opacity = '1';
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
              <a href="${getArticleLink(p)}" class="wr-article__title" style="text-decoration:none;color:#fff;display:block;cursor:pointer;">${escapeHtml(p.title)}</a>
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
              ? `<img class="mentor-card__avatar" src="${m.photo.startsWith('http') || m.photo.startsWith('data:') ? m.photo : 'https://the-nebula-house-backend.onrender.com' + m.photo}" alt="${m.name}">` 
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


async function loadFeaturedWritersSidebar() {
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