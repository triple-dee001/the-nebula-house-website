/**
 * CHAPTER ROOM — DESIGN TOKENS & RUNTIME ENGINE
 * Manages theme switches (Cream Paper vs Night Ink), text scaling,
 * accessible keyboard navigability, and reusable component builders.
 */

(function () {
  'use strict';

  // 1. LocalStorage Keys
  const THEME_STORAGE_KEY = 'cr_theme_preference';
  const FONT_SIZE_STORAGE_KEY = 'cr_font_size_preference';

  // 2. Theme State Manager (Default is Site Dark Theme; Cream is opt-in reading theme)
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved;
    // Default to site dark theme as mandated by Pass 0
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-cr-theme', theme);
    if (document.body) document.body.setAttribute('data-cr-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update toggles on page if present
    document.querySelectorAll('[data-cr-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'cream');
      const label = btn.querySelector('.cr-theme-label');
      if (label) {
        label.textContent = theme === 'cream' ? 'Night Ink' : 'Cream Paper';
      }
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-cr-theme') || 'dark';
    const next = current === 'cream' ? 'dark' : 'cream';
    applyTheme(next);
  }

  // 3. Font Scaling Manager (Accessibility AA)
  function applyFontScale(scaleDelta) {
    const currentScale = parseFloat(localStorage.getItem(FONT_SIZE_STORAGE_KEY) || '1');
    const newScale = Math.min(Math.max(currentScale + scaleDelta, 0.9), 1.3);
    document.documentElement.style.setProperty('--cr-user-font-scale', newScale);
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, newScale.toString());
  }

  // 4. Mobile Drawer Manager
  function initMobileMenu() {
    const toggle = document.querySelector('#menuToggle') || document.querySelector('[data-cr-nav-toggle]');
    const drawer = document.querySelector('#mobileMenu') || document.querySelector('[data-cr-mobile-drawer]');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // 5. Spoiler Reveal Interactivity
  function initSpoilerReveals() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-cr-reveal-spoiler]');
      if (!trigger) return;
      const spoilerBox = trigger.closest('.cr-spoiler-box');
      if (spoilerBox) {
        spoilerBox.classList.add('is-revealed');
        spoilerBox.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // 6. Conversational Reactions Interactivity
  function initReactions() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.cr-reaction-btn');
      if (!btn) return;
      const isReacted = btn.classList.toggle('is-reacted');
      const countEl = btn.querySelector('.cr-reaction-btn__count');
      if (countEl) {
        let count = parseInt(countEl.textContent, 10) || 0;
        count = isReacted ? count + 1 : Math.max(0, count - 1);
        countEl.textContent = count;
      }
      btn.setAttribute('aria-pressed', isReacted);
    });
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());
    initMobileMenu();
    initSpoilerReveals();
    initReactions();

    document.querySelectorAll('[data-cr-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  // Global Chapter Room Namespace
  window.ChapterRoom = {
    toggleTheme,
    applyTheme,
    applyFontScale,
  };
})();
