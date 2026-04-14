/* ============================================
   THE NEBULA HOUSE — Blog Post Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Get post identifier from strict URL or fallback to pathname
  const pathParts = window.location.pathname.split('/');
  const rawId = pathParts[pathParts.length - 1].replace(/\.html$/, '') || 'default-post';
  const postId = `post_${rawId}`;

  // 1. View Counter
  incrementAndDisplayViews(postId);

  // 2. Likes
  initLikes(postId);

  // 3. Ratings
  initRating(postId);

  // 4. Comments
  initComments(postId);
});

/* --- 1. Views --- */
function incrementAndDisplayViews(postId) {
  const viewsEl = document.getElementById('post-views');
  if (!viewsEl) return;

  const storageKey = `${postId}_views`;
  // Simple view counter (increments on every load for prototype purposes)
  let views = parseInt(localStorage.getItem(storageKey)) || 0;
  views++;
  localStorage.setItem(storageKey, views);
  viewsEl.textContent = `${views} view${views !== 1 ? 's' : ''}`;
}

/* --- 2. Likes --- */
function initLikes(postId) {
  const likeBtn = document.getElementById('like-btn');
  const likeCountEl = document.getElementById('like-count');
  if (!likeBtn || !likeCountEl) return;

  const countKey = `${postId}_likes_count`;
  const likedKey = `${postId}_user_liked`;

  let likeCount = parseInt(localStorage.getItem(countKey)) || 0;
  let hasLiked = localStorage.getItem(likedKey) === 'true';

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

  likeBtn.addEventListener('click', () => {
    if (hasLiked) {
      hasLiked = false;
      likeCount = Math.max(0, likeCount - 1);
    } else {
      hasLiked = true;
      likeCount++;
    }
    localStorage.setItem(countKey, likeCount);
    localStorage.setItem(likedKey, hasLiked);
    updateLikeUI();
    likeBtn.style.transform = 'scale(1.2)';
    setTimeout(() => { likeBtn.style.transform = 'scale(1)'; }, 200);
  });
}

/* --- 3. Rating --- */
function initRating(postId) {
  const stars = document.querySelectorAll('.star-rating .star');
  const ratingText = document.getElementById('rating-text');
  if (stars.length === 0) return;

  const rateKey = `${postId}_user_rating`;
  let currentRating = parseInt(localStorage.getItem(rateKey)) || 0;

  function updateStars(rating) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });

    if (rating > 0) {
      ratingText.textContent = `You rated this ${rating} star${rating !== 1 ? 's' : ''}`;
    } else {
      ratingText.textContent = "Rate this post";
    }
  }

  updateStars(currentRating);

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => updateStars(index + 1));
    star.addEventListener('mouseout', () => updateStars(currentRating));
    star.addEventListener('click', () => {
      currentRating = index + 1;
      localStorage.setItem(rateKey, currentRating);
      updateStars(currentRating);
    });
  });
}

/* --- 4. Comments --- */
function initComments(postId) {
  const form = document.getElementById('comment-form');
  const input = document.getElementById('comment-input');
  const list = document.getElementById('comments-list');
  const countEl = document.getElementById('comment-count');
  if (!form || !list) return;

  const storageKey = `${postId}_comments`;

  function loadComments() {
    const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
    list.innerHTML = '';
    
    if (countEl) {
      countEl.textContent = `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`;
    }

    if (comments.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No comments yet. Be the first to share your thoughts.</p>';
      return;
    }

    comments.slice().reverse().forEach(comment => {
      const el = document.createElement('div');
      el.className = 'comment';
      
      const dateStr = new Date(comment.timestamp).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
      });

      el.innerHTML = `
        <div class="comment__header">
          <span class="comment__author">${escapeHtml(comment.author)}</span>
          <span class="comment__date">${dateStr}</span>
        </div>
        <div class="comment__body">${escapeHtml(comment.text)}</div>
      `;
      list.appendChild(el);
    });
  }

  loadComments();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
    const newComment = {
      id: Date.now(),
      author: 'Guest Reader', // Anonymous testing
      text: text,
      timestamp: new Date().toISOString()
    };

    comments.push(newComment);
    localStorage.setItem(storageKey, JSON.stringify(comments));
    
    input.value = '';
    loadComments();
  });
}

// Basic XSS escaping for prototype
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
