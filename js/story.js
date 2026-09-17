/* ============================================
   THE NEBULA HOUSE — Dynamic Story Reader
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  let storyId = urlParams.get('slug') || urlParams.get('id');

  if (!storyId) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const storyIdx = pathParts.indexOf('story');
    if (storyIdx !== -1 && pathParts[storyIdx + 1]) {
      storyId = decodeURIComponent(pathParts[storyIdx + 1]);
    }
  }

  if (!storyId) {
    showError('No story ID or slug specified in the URL.');
    return;
  }

  await loadStory(storyId);
});

let currentStory = null;

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getStoryUrlPath(post) {
  if (!post) return '/story';
  const authorSlug = post.author?.slug || slugify(post.author?.name) || 'author';
  const postSlug = post.slug || slugify(post.title) || post.id;
  return `/story/${authorSlug}/${postSlug}`;
}

function isStorySaved(storyId) {
  try {
    const saved = JSON.parse(localStorage.getItem('nebula_saved_stories') || '[]');
    return saved.includes(storyId);
  } catch (e) { return false; }
}

function toggleSaveStory(event, storyId) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  try {
    let saved = JSON.parse(localStorage.getItem('nebula_saved_stories') || '[]');
    if (saved.includes(storyId)) {
      saved = saved.filter(id => id !== storyId);
    } else {
      saved.push(storyId);
    }
    localStorage.setItem('nebula_saved_stories', JSON.stringify(saved));
  } catch (e) {
    console.error('Save story error:', e);
  }
}

async function loadStory(id) {
  const loadingEl = document.getElementById('story-loading');
  const contentEl = document.getElementById('story-content');
  
  try {
    // 1. Fetch story details from backend (automatically increments view count)
    const post = await nebulaGetPost(id);
    currentStory = post;

    const cleanUrlPath = getStoryUrlPath(post);
    window.history.replaceState({}, '', cleanUrlPath);
    document.title = `${post.title} | The Nebula House`;

    // 2. Hide loader, show content container
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'block';

    // 3. Inject fields
    document.getElementById('story-title').textContent = post.title;
    document.getElementById('breadcrumb-title').textContent = post.title;
    document.getElementById('story-author').textContent = post.author?.name || 'Anonymous';

    // Subtitle
    const subtitleEl = document.getElementById('story-subtitle');
    if (subtitleEl) {
      if (post.subtitle) {
        subtitleEl.textContent = post.subtitle;
        subtitleEl.style.display = 'block';
      } else {
        subtitleEl.style.display = 'none';
      }
    }

    // Author Avatar
    const avatarContainer = document.getElementById('story-author-avatar-container');
    if (avatarContainer) {
      if (post.author?.photo) {
        const imgSrc = post.author.photo.startsWith('http') || post.author.photo.startsWith('data:') ? post.author.photo : 'https://the-nebula-house-backend.onrender.com' + post.author.photo;
        avatarContainer.innerHTML = `<img src="${imgSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else {
        const initial = (post.author?.name || 'A')[0].toUpperCase();
        avatarContainer.innerHTML = `<span id="story-author-initial">${initial}</span>`;
      }
    }

    const authorLink = document.getElementById('story-author-link');
    if (authorLink && post.author) {
      const authorTarget = post.author.slug ? `writer.html?slug=${post.author.slug}` : `writer.html?id=${post.author.id || post.authorId}`;
      authorLink.href = authorTarget;
    }

    // Follow Button
    const followBtn = document.getElementById('btn-follow-author');
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const authorId = post.author?.id || post.authorId;

    if (followBtn && authorId) {
      if (currentUser && currentUser.id === authorId) {
        followBtn.style.display = 'none';
      } else {
        followBtn.style.display = 'inline-block';
        let isFollowing = !!post.author?.following;

        function updateFollowBtnUI(following) {
          if (following) {
            followBtn.textContent = 'Following';
            followBtn.style.background = 'transparent';
            followBtn.style.color = '#fff';
            followBtn.style.borderColor = 'rgba(255,255,255,0.4)';
          } else {
            followBtn.textContent = 'Follow';
            followBtn.style.background = '#fff';
            followBtn.style.color = '#000';
            followBtn.style.borderColor = '#fff';
          }
        }

        updateFollowBtnUI(isFollowing);

        followBtn.onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (typeof getToken !== 'function' || !getToken() || !currentUser) {
            if (typeof openAuthModal === 'function') {
              openAuthModal();
            } else {
              alert('Please sign in to follow writers.');
            }
            return;
          }

          followBtn.disabled = true;
          try {
            const res = await nebulaToggleFollow(authorId);
            isFollowing = !!res.following;
            updateFollowBtnUI(isFollowing);
          } catch (err) {
            alert(err.message || 'Failed to update follow status');
          } finally {
            followBtn.disabled = false;
          }
        };
      }
    }
    
    // Date
    const dateObj = new Date(post.createdAt);
    document.getElementById('story-date').textContent = dateObj.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });

    // Read time calculation
    const wordCount = (post.body || '').split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    document.getElementById('story-read-time').textContent = `${readTime} min read`;

    // Stats Population (Top & Bottom Bars)
    const views = post.views || 0;
    const likes = post._count?.likes || 0;
    const commentsCount = post.comments?.length || 0;

    const viewsTop = document.getElementById('views-count-top');
    if (viewsTop) viewsTop.textContent = views;

    const postViews = document.getElementById('post-views');
    if (postViews) postViews.textContent = `${views} views`;

    const likeTop = document.getElementById('like-count-top');
    if (likeTop) likeTop.textContent = likes;

    const likeBottom = document.getElementById('like-count');
    if (likeBottom) likeBottom.textContent = likes;

    const commentTop = document.getElementById('comment-count-top');
    if (commentTop) commentTop.textContent = commentsCount;

    const commentBottom = document.getElementById('comment-count-bottom');
    if (commentBottom) commentBottom.textContent = commentsCount;

    // Save Story Bookmarks
    const saveTop = document.getElementById('btn-save-story-top');
    const saveBottom = document.getElementById('btn-save-story-bottom');
    
    function updateSaveBtnsUI() {
      const saved = isStorySaved(post.id);
      const color = saved ? '#bb86fc' : 'inherit';
      const fill = saved ? 'currentColor' : 'none';

      if (saveTop) {
        saveTop.style.color = color;
        const svg = saveTop.querySelector('svg');
        if (svg) svg.setAttribute('fill', fill);
      }
      if (saveBottom) {
        saveBottom.style.color = color;
        const svg = saveBottom.querySelector('svg');
        if (svg) svg.setAttribute('fill', fill);
      }
    }

    updateSaveBtnsUI();

    const handleSaveToggle = (e) => {
      toggleSaveStory(e, post.id);
      updateSaveBtnsUI();
    };

    if (saveTop) saveTop.onclick = handleSaveToggle;
    if (saveBottom) saveBottom.onclick = handleSaveToggle;

    // --- Audio Reader Engine (Web Speech API + Custom Voice Recording) ---
    const audioBtn = document.getElementById('btn-audio-listen');
    const audioLabel = document.getElementById('audio-btn-label');

    if (audioBtn) {
      audioBtn.onclick = () => {
        // If author uploaded custom narration audio URL:
        if (post.audioUrl) {
          let audioObj = window.currentStoryAudioObj;
          if (!audioObj) {
            audioObj = new Audio(post.audioUrl.startsWith('http') ? post.audioUrl : 'https://the-nebula-house-backend.onrender.com/' + post.audioUrl);
            window.currentStoryAudioObj = audioObj;
          }
          if (audioObj.paused) {
            audioObj.play();
            audioLabel.textContent = 'Pause';
          } else {
            audioObj.pause();
            audioLabel.textContent = 'Listen';
          }
          return;
        }

        // Native SpeechSynthesis (Web Speech API)
        if (!('speechSynthesis' in window)) {
          alert('Speech synthesis is not supported on your browser.');
          return;
        }

        if (window.speechSynthesis.speaking) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            audioLabel.textContent = 'Playing...';
          } else {
            window.speechSynthesis.pause();
            audioLabel.textContent = 'Paused';
          }
        } else {
          // Extract text from body
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = post.body || '';
          const plainText = `${post.title}. ${tempDiv.innerText || tempDiv.textContent}`;

          const speechSynthUtterance = new SpeechSynthesisUtterance(plainText);
          speechSynthUtterance.rate = 0.95;
          speechSynthUtterance.pitch = 1.0;

          speechSynthUtterance.onstart = () => {
            audioLabel.textContent = 'Playing...';
            audioBtn.style.background = 'rgba(187,134,252,0.2)';
            audioBtn.style.borderColor = '#bb86fc';
          };

          speechSynthUtterance.onend = () => {
            audioLabel.textContent = 'Listen';
            audioBtn.style.background = 'rgba(255,255,255,0.06)';
            audioBtn.style.borderColor = 'rgba(255,255,255,0.12)';
          };

          speechSynthUtterance.onerror = (err) => {
            console.error('Speech error:', err);
            audioLabel.textContent = 'Listen';
            audioBtn.style.background = 'rgba(255,255,255,0.06)';
          };

          window.speechSynthesis.cancel(); // Reset
          window.speechSynthesis.speak(speechSynthUtterance);
        }
      };
    }

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

    // Breadcrumb adjustment
    const breadcrumbParent = document.getElementById('breadcrumb-parent');
    if (breadcrumbParent) {
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
  const likeBtnTop = document.getElementById('like-btn-top');
  const likeCountTopEl = document.getElementById('like-count-top');
  
  let likeCount = post._count?.likes || 0;
  let hasLiked = post.liked || false;

  const filledSvg = `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  const outlineSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

  function updateLikeUI() {
    [likeBtn, likeBtnTop].forEach(btn => {
      if (!btn) return;
      if (hasLiked) {
        btn.classList.add('liked');
        btn.style.color = '#ff4757';
        btn.innerHTML = `${filledSvg}<span>${likeCount}</span>`;
      } else {
        btn.classList.remove('liked');
        btn.style.color = 'inherit';
        btn.innerHTML = `${outlineSvg}<span>${likeCount}</span>`;
      }
    });
  }

  updateLikeUI();

  const handleLikeToggle = async () => {
    // Optimistic UI toggle
    if (hasLiked) {
      hasLiked = false;
      likeCount = Math.max(0, likeCount - 1);
    } else {
      hasLiked = true;
      likeCount++;
    }
    updateLikeUI();

    [likeBtn, likeBtnTop].forEach(btn => {
      if (btn) {
        btn.style.transform = 'scale(1.25)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
      }
    });

    try {
      const res = await nebulaToggleLike(post.id);
      if (typeof res.count === 'number') {
        likeCount = res.count;
      }
      if (typeof res.liked === 'boolean') {
        hasLiked = res.liked;
      }
      updateLikeUI();
    } catch (err) {
      // Revert if API call fails
      hasLiked = !hasLiked;
      likeCount = hasLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
      updateLikeUI();
      alert(err.message || 'Failed to toggle like');
    }
  };

  if (likeBtn) likeBtn.onclick = handleLikeToggle;
  if (likeBtnTop) likeBtnTop.onclick = handleLikeToggle;

  // --- Share Post ---
  const shareBtn = document.getElementById('share-btn');
  const shareBtnTop = document.getElementById('share-btn-top');

  const handleShare = async () => {
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
          if (shareBtn) shareBtn.style.color = '#4caf50';
          if (shareBtnTop) shareBtnTop.style.color = '#4caf50';
          setTimeout(() => {
            shareLabel.textContent = 'Share';
            if (shareBtn) shareBtn.style.color = 'var(--text-muted)';
            if (shareBtnTop) shareBtnTop.style.color = 'inherit';
          }, 2000);
        } else {
          alert('Link copied to clipboard!');
        }
      } catch (err) {
        alert('Could not copy link to clipboard.');
      }
    }
  };

  if (shareBtn) shareBtn.onclick = handleShare;
  if (shareBtnTop) shareBtnTop.onclick = handleShare;

  // --- Comments ---
  const form = document.getElementById('comment-form');
  const input = document.getElementById('comment-input');
  const list = document.getElementById('comments-list');
  const countEl = document.getElementById('comment-count');
  const guestNameContainer = document.getElementById('guest-name-container');
  const guestNameInput = document.getElementById('guest-name-input');

  const currentUser = getCurrentUser();
  if (!currentUser && guestNameContainer) {
    guestNameContainer.style.display = 'block';
  }

  function renderComments(comments) {
    const total = comments.length;
    if (countEl) {
      countEl.textContent = `${total} Comment${total !== 1 ? 's' : ''}`;
    }

    // Also update top and bottom comment counts
    const commentTop = document.getElementById('comment-count-top');
    if (commentTop) commentTop.textContent = total;
    const commentBottom = document.getElementById('comment-count-bottom');
    if (commentBottom) commentBottom.textContent = total;
    
    list.innerHTML = '';
    if (total === 0) {
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

      const authorName = c.author?.name || c.guestName || 'Guest Reader';

      commentDiv.innerHTML = `
        <div class="comment__header">
          <span class="comment__author">${escapeHtml(authorName)}</span>
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
    const guestName = (!user && guestNameInput) ? guestNameInput.value.trim() : '';

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    
    try {
      const savedComment = await nebulaAddComment(post.id, text, guestName);
      
      // Push new comment directly to array and re-render
      post.comments = post.comments || [];
      const newCommentObj = {
        ...savedComment,
        author: savedComment.author || {
          name: user ? user.name : (guestName || 'Guest Reader'),
          photo: user ? user.photo : null
        }
      };
      post.comments.unshift(newCommentObj);
      
      input.value = '';
      if (guestNameInput) guestNameInput.value = '';
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
