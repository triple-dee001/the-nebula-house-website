/* ============================================
   THE NEBULA HOUSE — Blog Post Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Get post identifier from strict URL or fallback to pathname
  const pathParts = window.location.pathname.split('/');
  const rawId = pathParts[pathParts.length - 1].replace(/\.html$/, '') || 'default-post';
  const postId = `post_${rawId}`;

  // Wait a small bit for auth.js to init Firebase if it's there
  setTimeout(async () => {
    // 1. View Counter
    await incrementAndDisplayViews(postId);

    // 2. Likes
    await initLikes(postId);

    // 3. Ratings
    await initRating(postId);

    // 4. Comments
    await initComments(postId);
  }, 100);
});

/* --- 1. Views --- */
async function incrementAndDisplayViews(postId) {
  const viewsEl = document.getElementById('post-views');
  if (!viewsEl) return;

  // Wait for the view to increment, then fetch the updated metrics
  if (typeof incrementPostView === 'function') {
    await incrementPostView(postId);
    const metrics = await getPostMetrics(postId);
    viewsEl.textContent = `${metrics.views} view${metrics.views !== 1 ? 's' : ''}`;
  }
}

/* --- 2. Likes --- */
async function initLikes(postId) {
  const likeBtn = document.getElementById('like-btn');
  const likeCountEl = document.getElementById('like-count');
  if (!likeBtn || !likeCountEl) return;

  const likedKey = `${postId}_user_liked`;
  let hasLiked = localStorage.getItem(likedKey) === 'true';

  let metrics = await getPostMetrics(postId);
  let likeCount = metrics.likes;

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

  likeBtn.addEventListener('click', async () => {
    // Optimistic UI update
    if (hasLiked) {
      hasLiked = false;
      likeCount = Math.max(0, likeCount - 1);
    } else {
      hasLiked = true;
      likeCount++;
    }
    updateLikeUI();
    likeBtn.style.transform = 'scale(1.2)';
    setTimeout(() => { likeBtn.style.transform = 'scale(1)'; }, 200);

    // Update backend
    if (typeof togglePostLike === 'function') {
      const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
      await togglePostLike(postId, user ? user.uid : 'anonymous', hasLiked);
    }
  });
}

/* --- 3. Rating --- */
async function initRating(postId) {
  const stars = document.querySelectorAll('.star-rating .star');
  const ratingText = document.getElementById('rating-text');
  // We'll add a new element to display the general rating
  const ratingContainer = document.querySelector('.star-rating');
  let generalRatingEl = document.getElementById('general-rating');
  
  if (!generalRatingEl && ratingContainer) {
    generalRatingEl = document.createElement('div');
    generalRatingEl.id = 'general-rating';
    generalRatingEl.style.fontSize = '0.85rem';
    generalRatingEl.style.color = 'var(--text-secondary)';
    generalRatingEl.style.marginTop = '0.5rem';
    ratingContainer.appendChild(generalRatingEl);
  }

  if (stars.length === 0) return;

  const rateKey = `${postId}_user_rating`;
  let currentRating = parseInt(localStorage.getItem(rateKey)) || 0;

  async function fetchAndDisplayGeneralRating() {
    if (typeof getPostMetrics === 'function' && generalRatingEl) {
      const metrics = await getPostMetrics(postId);
      if (metrics.ratingsCount > 0) {
        const avg = (metrics.ratingsTotal / metrics.ratingsCount).toFixed(1);
        generalRatingEl.textContent = `General Rating: ${avg}/5 (${metrics.ratingsCount} review${metrics.ratingsCount !== 1 ? 's' : ''})`;
      } else {
        generalRatingEl.textContent = 'General Rating: No ratings yet';
      }
    }
  }

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
  fetchAndDisplayGeneralRating();

  stars.forEach((star, index) => {
    star.addEventListener('mouseover', () => updateStars(index + 1));
    star.addEventListener('mouseout', () => updateStars(currentRating));
    star.addEventListener('click', async () => {
      const previousRating = currentRating;
      currentRating = index + 1;
      updateStars(currentRating);
      
      if (typeof submitPostRating === 'function') {
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        await submitPostRating(postId, user ? user.uid : 'anonymous', currentRating, previousRating);
        fetchAndDisplayGeneralRating(); // Refresh aggregate rating
      }
    });
  });
}

/* --- 4. Comments --- */
async function initComments(postId) {
  const form = document.getElementById('comment-form');
  const input = document.getElementById('comment-input');
  const list = document.getElementById('comments-list');
  const countEl = document.getElementById('comment-count');
  if (!form || !list) return;

  async function loadComments() {
    let comments = [];
    if (typeof getPostComments === 'function') {
      comments = await getPostComments(postId);
    }
    
    list.innerHTML = '';
    
    if (countEl) {
      countEl.textContent = `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`;
    }

    if (comments.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No comments yet. Be the first to share your thoughts.</p>';
      return;
    }

    // Display newest first by reversing array
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

  await loadComments();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const authorName = user && user.name ? user.name : 'Guest Reader';

    const newComment = {
      author: authorName,
      text: text,
      timestamp: new Date().toISOString()
    };

    if (typeof addPostComment === 'function') {
      await addPostComment(postId, newComment);
    }
    
    input.value = '';
    await loadComments();
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
