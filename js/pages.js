/* ============================================
   THE NEBULA HOUSE — Page-Specific JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Detect current page and run page-specific init
  const path = window.location.pathname;

  // Initialize 3D book tilt on any page with a book
  initBook3DTilt();

  if (path.includes('the-chapter-room')) {
    initChapterRoom();
  } else if (path.includes('the-nebula-academy')) {
    initAcademy();
  } else if (path.includes('my-thoughts')) {
    initMyThoughts();
  } else if (path.includes('blog')) {
    initBlogGrid();
  } else if (
    path.includes('the-writers-room') ||
    path.includes('the-opinion-yard') ||
    path.includes('the-publishing-room')
  ) {
    initComingSoon();
  }
});

/* --- Blog Grid: Dynamic Metrics --- */
function initBlogGrid() {
  const cards = document.querySelectorAll('.blog-card');
  
  // Wait slightly to ensure auth.js has loaded Firebase
  setTimeout(() => {
    cards.forEach(async (card) => {
      const postId = card.getAttribute('data-post-id');
      if (!postId) return;
      
      if (typeof getPostMetrics === 'function') {
        const metrics = await getPostMetrics(postId);
        
        const viewsEl = card.querySelector('.card-views');
        const commentsEl = card.querySelector('.card-comments');
        const likesEl = card.querySelector('.card-likes');
        
        if (viewsEl) viewsEl.textContent = `${metrics.views} view${metrics.views !== 1 ? 's' : ''}`;
        if (commentsEl) commentsEl.textContent = `${metrics.commentsCount} comment${metrics.commentsCount !== 1 ? 's' : ''}`;
        if (likesEl) likesEl.textContent = metrics.likes;
      }
    });
  }, 100);
}


/* --- 3D Book: Mouse-tracking tilt effect --- */
function initBook3DTilt() {
  const bookCovers = document.querySelectorAll('.featured-book__cover');

  bookCovers.forEach(cover => {
    const book = cover.querySelector('.book-3d');
    if (!book) return;

    const defaultRotateY = -12;
    const maxTilt = 25;        // max rotation in degrees
    const maxTiltX = 8;        // subtle vertical tilt

    cover.addEventListener('mousemove', (e) => {
      const rect = cover.getBoundingClientRect();
      // Mouse position as -1 to 1 (center = 0)
      const xPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yPercent = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      // Map mouse X → Y rotation (hover right = positive rotation, hover left = negative)
      const rotateY = defaultRotateY + (xPercent * maxTilt);
      const rotateX = -(yPercent * maxTiltX);

      book.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    cover.addEventListener('mouseleave', () => {
      // Reset to default angle
      book.style.transform = `rotateY(${defaultRotateY}deg) rotateX(0deg)`;
    });
  });
}


/* --- Chapter Room: Removed expanding text, now direct links --- */

/* --- Academy: Animated stat counters --- */
function initAcademy() {
  const statValues = document.querySelectorAll('.term-card__stat-value');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-value'));
        animateCounter(el, targetValue);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 30;
  const duration = 1000;
  const stepTime = duration / 30;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.round(current);
  }, stepTime);
}


/* --- My Thoughts: Post card hover --- */
function initMyThoughts() {
  const postCards = document.querySelectorAll('.post-card');

  postCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      postCards.forEach(other => {
        if (other !== card) {
          other.style.opacity = '0.5';
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      postCards.forEach(other => {
        other.style.opacity = '1';
      });
    });
  });
}


/* --- Coming Soon: Particle animation on canvas --- */
function initComingSoon() {
  const canvas = document.querySelector('.coming-soon__canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 8000);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });

    // Draw connection lines between nearby particles
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}
