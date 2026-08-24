/* ============================================
   THE NEBULA HOUSE — Dynamic Story Reader
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const storyId = urlParams.get('id') || urlParams.get('slug');

  if (!storyId) {
    showError('No story ID or slug specified in the URL.');
    return;
  }

  await loadStory(storyId);
});

let currentStory = null;

async function loadStory(id) {
  const loadingEl = document.getElementById('story-loading');
  const contentEl = document.getElementById('story-content');
  
  try {
    // 1. Fetch story details from backend (automatically increments view count)
    const post = await nebulaGetPost(id);
    currentStory = post;

    const storySlug = getStorySlug(post);
    window.history.replaceState({}, '', `/story/${storySlug}`);
    document.title = `${post.title} | The Nebula House`;

    // 2. Hide loader, show content container
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // 3. Inject fields
    document.getElementById('story-title').textContent = post.title;
    document.getElementById('breadcrumb-title').textContent = post.title;
    document.getElementById('story-author').textContent = post.author?.name || 'Anonymous';
    
    // Date
    const dateObj = new Date(post.createdAt);
    document.getElementById('story-date').textContent = dateObj.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    // Read time calculation
    const wordCount = (post.body || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    document.getElementById('story-read-time').textContent = `${readTime} min read`;

    // Cover Image (Only display top header image if it's NOT already embedded inside article body)
    const imgContainer = document.getElementById('story-image-container');
    const imgEl = document.getElementById('story-image');
    let coverUrl = post.coverImage;
    const bodyHasImage = post.body && coverUrl && post.body.includes(coverUrl);

    if (coverUrl && !bodyHasImage) {
      function formatImageUrl(url) {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
        if (url.startsWith('/')) return url;
        if (url.startsWith('assets/')) return '/' + url;
        return 'https://the-nebula-house-backend.onrender.com/' + url;
      }
      imgEl.src = formatImageUrl(coverUrl);
      imgContainer.style.display = 'block';
    } else {
      if (imgContainer) imgContainer.style.display = 'none';
    }

    // Body formatting
    document.getElementById('story-body').innerHTML = formatContent(post.body);

    // Tags
    const tagsContainer = document.getElementById('story-tags');
    tagsContainer.innerHTML = '';
    if (post.tags) {
      post.tags.split(',').forEach(tag => {
        const span = document.createElement('span');
        span.className = 'article-tag';
        span.textContent = tag.trim();
        tagsContainer.appendChild(span);
      });
    }

    // Views
    document.getElementById('post-views').textContent = `${post.views || 0} views`;

    // Breadcrumb adjustment
    const breadcrumbParent = document.getElementById('breadcrumb-parent');
    const isOwnerPost = post.author?.email === 'kelechioji@thenebulahouse.com' || post.author?.email === 'danieldurojaiye42@gmail.com';
    if (isOwnerPost) {
      breadcrumbParent.textContent = 'My Thoughts';
      breadcrumbParent.href = 'my-thoughts.html';
    } else {
      breadcrumbParent.textContent = "The Writer's Room";
      breadcrumbParent.href = 'the-writers-room.html';
    }

    // 4. Initialize interactions
    initInteractions(post);

  } catch (err) {
    console.error('Failed to load story:', err);
    showError(err.message || 'Could not retrieve the story from the backend.');
  }
}

function formatContent(content) {
  if (!content) return '';
  if (content.includes('<p>') || content.includes('<div>') || content.includes('<br>')) {
    return content; // already has html tags
  }
  return content
    .split(/\n\s*\n/)
    .map(para => `<p>${para.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function showError(msg) {
  const loadingEl = document.getElementById('story-loading');
  const errorEl = document.getElementById('story-error');
  const errorMsgEl = document.getElementById('error-message');
  
  if (loadingEl) loadingEl.style.display = 'none';
  if (errorEl) {
    errorEl.style.display = 'block';
    errorMsgEl.textContent = msg;
  }
}

// ─── LIKES & COMMENTS ──────────────────────────

function initInteractions(post) {
  const likeBtn = document.getElementById('like-btn');
  const likeCountEl = document.getElementById('like-count');
  
  let likeCount = post._count?.likes || 0;
  let hasLiked = post.liked || false;

  function updateLikeUI() {
    likeCountEl.textContent = likeCount;
    if (hasLiked) {
      likeBtn.classList.add('liked');
      likeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    } else {
      likeBtn.classList.remove('liked');
      likeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    }
  }

  updateLikeUI();

  likeBtn.onclick = async () => {
    const user = getCurrentUser();
    if (!user || !getToken()) {
      openAuthModal();
      return;
    }

    // Optimistic UI toggle
    if (hasLiked) {
      hasLiked = false;
      likeCount = Math.max(0, likeCount - 1);
    } else {
      hasLiked = true;
      likeCount++;
    }
    updateLikeUI();
    likeBtn.style.transform = 'scale(1.25)';
    setTimeout(() => { likeBtn.style.transform = 'scale(1)'; }, 150);

    try {
      await nebulaToggleLike(post.id);
    } catch (err) {
      // Revert if API call fails
      hasLiked = !hasLiked;
      likeCount = hasLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
      updateLikeUI();
      alert(err.message);
    }
  };

  // --- Share Post ---
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      const storySlug = getStorySlug(post);
      const cleanUrl = `${window.location.origin}/story/${storySlug}`;

      const shareData = {
        title: post.title,
        text: post.excerpt || `Read "${post.title}" on The Nebula House.`,
        url: cleanUrl
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('Error sharing:', err);
        }
      } else {
        // Fallback: Copy link
        try {
          await navigator.clipboard.writeText(cleanUrl);
          const shareLabel = document.getElementById('share-label');
          if (shareLabel) {
            shareLabel.textContent = 'Link Copied!';
            shareBtn.style.color = '#4caf50';
            setTimeout(() => {
              shareLabel.textContent = 'Share';
              shareBtn.style.color = 'var(--text-muted)';
            }, 2000);
          }
        } catch (err) {
          alert('Could not copy link to clipboard.');
        }
      }
    };
  }

  // --- Comments ---
  const form = document.getElementById('comment-form');
  const input = document.getElementById('comment-input');
  const list = document.getElementById('comments-list');
  const countEl = document.getElementById('comment-count');

  function renderComments(comments) {
    if (countEl) {
      countEl.textContent = `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`;
    }
    
    list.innerHTML = '';
    if (comments.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No comments yet. Be the first to share your thoughts.</p>';
      return;
    }

    // Render in chronological order
    comments.forEach(c => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment';
      
      const dateStr = new Date(c.createdAt).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      commentDiv.innerHTML = `
        <div class="comment__header">
          <span class="comment__author">${escapeHtml(c.author?.name || 'Anonymous Reader')}</span>
          <span class="comment__date">${dateStr}</span>
        </div>
        <div class="comment__body">${escapeHtml(c.body)}</div>
      `;
      list.appendChild(commentDiv);
    });
  }

  // Load comments initially
  renderComments(post.comments || []);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const user = getCurrentUser();
    if (!user || !getToken()) {
      openAuthModal();
      return;
    }

    if (!user.emailVerified) {
      alert('Please verify your email before posting a comment. Check your inbox for the verification link.');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    
    try {
      const savedComment = await nebulaAddComment(post.id, text);
      
      // Push new comment directly to array and re-render
      post.comments = post.comments || [];
      // Backend returns the comment object with author fields
      post.comments.unshift({
        ...savedComment,
        author: { name: user.name, photo: user.photo }
      });
      
      input.value = '';
      renderComments(post.comments);
    } catch (err) {
      alert(err.message || 'Failed to submit comment.');
    } finally {
      btn.disabled = false;
    }
  };
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

function getStorySlug(post) {
  if (!post) return '';
  if (post.slug) return post.slug;
  if (post.title) {
    const generated = post.title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (generated) return generated;
  }
  return post.id || '';
}
