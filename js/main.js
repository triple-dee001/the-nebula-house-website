/* ============================================
   THE NEBULA HOUSE — Main JavaScript
   Navigation, scroll animations, shared logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initHeroTextReveal();
  initStarField();
  initNewsletterForm();
  initPageTransition();
});


/* --- Navbar scroll behavior --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Set active nav link
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.navbar__link, .navbar__dropdown-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPath = new URL(href, window.location.origin).pathname.replace(/\/$/, '') || '/';

    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}


/* --- Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu on link click
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}


/* --- Scroll-triggered Animations --- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}


/* --- Hero Text Reveal (word by word) --- */
function initHeroTextReveal() {
  const heroTitle = document.querySelector('.hero__title');
  if (!heroTitle) return;

  const text = heroTitle.textContent.trim();
  heroTitle.innerHTML = '';

  const words = text.split(' ');
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = word;
    span.style.animationDelay = `${0.3 + i * 0.12}s`;
    heroTitle.appendChild(span);

    // Add space between words
    if (i < words.length - 1) {
      heroTitle.appendChild(document.createTextNode(' '));
    }
  });
}


/* --- Star Field for Hero --- */
function initStarField() {
  const starContainer = document.querySelector('.hero__stars');
  if (!starContainer) return;

  const starCount = 80;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'hero__star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
    star.style.setProperty('--max-opacity', `${0.2 + Math.random() * 0.5}`);
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.width = `${1 + Math.random() * 2}px`;
    star.style.height = star.style.width;
    starContainer.appendChild(star);
  }
}


/* --- Newsletter Form (Mailchimp Ready) --- */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter__form, .coming-soon__form');

  // Check if already subscribed to hide form visually
  if (localStorage.getItem('nebula_newsletter_subscribed') === 'true') {
    forms.forEach(form => {
      const parent = form.closest('.newsletter__content') || form.parentElement;
      if (parent) {
        parent.innerHTML = '<p style="color: #4caf50; font-size: 1.1rem; font-family: var(--font-secondary); padding: 1rem 0;">You are subscribed to the Nebula newsletter. Thank you.</p>';
      }
    });
    return;
  }

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // If we are wired to Mailchimp (form has action), we DO NOT prevent default.
      // We let it submit, but we flag the local storage.
      const action = form.getAttribute('action');
      const input = form.querySelector('input[type="email"]');
      const successMsg = form.parentElement.querySelector('.newsletter__success');
      
      if (input && input.value) {
        // Save via auth.js locally & Firebase (if enabled)
        if (typeof saveNewsletterEmail === 'function') {
          saveNewsletterEmail(input.value);
        }

        // Set the hidden flag
        localStorage.setItem('nebula_newsletter_subscribed', 'true');

        if (!action || action === '#') {
          // If no Mailchimp action yet, block submission and just show JS message
          e.preventDefault();
          input.value = '';
          if (successMsg) {
            successMsg.classList.add('visible');
            setTimeout(() => {
              successMsg.classList.remove('visible');
            }, 4000);
          }
        }
        // If action exists, browser will POST to Mailchimp and redirect user properly.
      }
    });
  });
}


/* --- Page entry transition --- */
function initPageTransition() {
  document.body.classList.add('page-transition');
}


/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
