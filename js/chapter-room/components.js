/**
 * CHAPTER ROOM — REUSABLE UI COMPONENTS
 * Pure, typed component generator functions for The Chapter Room.
 * Reconciled with The Nebula House design system (Pass 1).
 */

window.CRComponents = (function () {
  'use strict';

  /**
   * Safe HTML string escaping utility
   */
  function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * 1. Top Navigation Component
   * Tier 1: Real Site Header (Logo, Home, About, My Rooms dropdown, Account)
   * Tier 2: Slim Chapter Room Sub-navigation (Explore | Book of the Month | My Reading | Community, plus search & theme toggle)
   */
  function renderNav(activePath, opts) {
    if (!activePath) activePath = 'home';
    if (!opts) opts = {};
    var rootPath = opts.rootPath !== undefined ? opts.rootPath : '../';
    var crPath = opts.crPath !== undefined ? opts.crPath : '';

    var subLinks = [
      { id: 'explore', label: 'Explore', href: crPath + 'explore.html' },
      { id: 'botm', label: 'Book of the Month', href: crPath + 'book-of-the-month.html' },
      { id: 'shelf', label: 'My Reading', href: crPath + 'my-reading.html' },
      { id: 'community', label: 'Community', href: crPath + 'community.html' }
    ];

    var subLinkItems = subLinks.map(function(link) {
      var activeClass = activePath === link.id ? 'is-active' : '';
      return '<li><a href="' + link.href + '" class="cr-subnav__link ' + activeClass + '">' + link.label + '</a></li>';
    }).join('');

    return '<!-- TIER 1: SITE HEADER -->' +
      '<nav class="navbar" id="navbar">' +
        '<div class="navbar__inner">' +
          '<div class="navbar__logo">' +
            '<a href="' + rootPath + 'index.html">' +
              '<img src="' + rootPath + 'assets/images/room-icon.png" alt="The Nebula House" class="navbar__logo-img">' +
            '</a>' +
          '</div>' +
          '<div class="navbar__links">' +
            '<a href="' + rootPath + 'index.html" class="navbar__link">Home</a>' +
            '<a href="' + rootPath + 'about.html" class="navbar__link">About</a>' +
            '<div class="navbar__dropdown">' +
              '<span class="navbar__link navbar__dropdown-trigger">My Rooms <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>' +
              '<div class="navbar__dropdown-menu">' +
                '<a href="' + rootPath + 'the-chapter-room.html" class="navbar__dropdown-item">The Chapter Room</a>' +
                '<a href="' + rootPath + 'the-writers-room.html" class="navbar__dropdown-item">The Writer\'s Room</a>' +
                '<a href="' + rootPath + 'the-publishing-room.html" class="navbar__dropdown-item">The Publishing Room</a>' +
                '<a href="' + rootPath + 'the-opinion-yard.html" class="navbar__dropdown-item">The Opinion Yard</a>' +
                '<a href="' + rootPath + 'the-nebula-academy.html" class="navbar__dropdown-item">The Nebula Academy</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<a href="#" class="navbar__account" id="nav-account-icon" title="Account" aria-label="Account">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' +
          '</a>' +
          '<div class="navbar__toggle" id="menuToggle" aria-label="Toggle navigation" role="button" tabindex="0"><span></span><span></span><span></span></div>' +
        '</div>' +
      '</nav>' +
      '<!-- SITE MOBILE MENU -->' +
      '<div class="mobile-menu" id="mobileMenu">' +
        '<a href="' + rootPath + 'index.html" class="mobile-menu__link">Home</a>' +
        '<a href="' + rootPath + 'about.html" class="mobile-menu__link">About</a>' +
        '<div class="mobile-menu__divider"></div>' +
        '<a href="' + rootPath + 'the-chapter-room.html" class="mobile-menu__link">The Chapter Room</a>' +
        '<a href="' + rootPath + 'the-writers-room.html" class="mobile-menu__link">The Writer\'s Room</a>' +
        '<a href="' + rootPath + 'the-publishing-room.html" class="mobile-menu__link">The Publishing Room</a>' +
        '<a href="' + rootPath + 'the-opinion-yard.html" class="mobile-menu__link">The Opinion Yard</a>' +
        '<a href="' + rootPath + 'the-nebula-academy.html" class="mobile-menu__link">The Nebula Academy</a>' +
      '</div>' +
      '<!-- TIER 2: SLIM CHAPTER ROOM SUB-NAVIGATION -->' +
      '<div class="cr-subnav" role="navigation" aria-label="Chapter Room Subnavigation">' +
        '<div class="cr-subnav__inner">' +
          '<ul class="cr-subnav__links">' + subLinkItems + '</ul>' +
          '<div class="cr-subnav__actions">' +
            '<div class="cr-search-box" role="search">' +
              '<svg class="cr-search-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
              '<input type="search" class="cr-search-box__input" placeholder="Search books, authors..." aria-label="Search library">' +
            '</div>' +
            '<button class="cr-theme-btn" data-cr-theme-toggle type="button" aria-label="Toggle Reading Theme (Cream Paper or Night Ink)" title="Toggle Reading Theme">' +
              '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' +
              '<span>Theme</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  /**
   * 2. Mobile Bottom Tab Bar Component (Home / Explore / My Reading / Community)
   * 44px+ touch targets
   */
  function renderTabBar(activePath, opts) {
    if (!activePath) activePath = 'home';
    if (!opts) opts = {};
    var crPath = opts.crPath !== undefined ? opts.crPath : '';
    var homeHref = opts.homeHref || (crPath + 'index.html');

    var tabs = [
      {
        id: 'home',
        label: 'Home',
        href: homeHref,
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
      },
      {
        id: 'explore',
        label: 'Explore',
        href: crPath + 'explore.html',
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
      },
      {
        id: 'botm',
        label: 'This Month',
        href: crPath + 'book-of-the-month.html',
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
      },
      {
        id: 'shelf',
        label: 'My Reading',
        href: crPath + 'my-reading.html',
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>'
      },
      {
        id: 'community',
        label: 'Community',
        href: crPath + 'community.html',
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'
      }
    ];

    var tabsHtml = tabs.map(function(tab) {
      var activeClass = activePath === tab.id ? 'is-active' : '';
      return '<a href="' + tab.href + '" class="cr-tabbar__item ' + activeClass + '" aria-label="' + tab.label + '">' +
        tab.icon +
        '<span class="cr-tabbar__label">' + tab.label + '</span>' +
      '</a>';
    }).join('');

    return '<nav class="cr-tabbar" role="navigation" aria-label="Mobile Navigation">' + tabsHtml + '</nav>';
  }

  /**
   * 3. Book Cover Presentation (Photographic or Typographic Fallback)
   */
  function renderBookCover(opts) {
    if (!opts) opts = {};
    var title = opts.title || 'Untitled';
    var author = opts.author || 'Unknown Author';
    var genre = opts.genre || 'Literature';
    var cover = opts.cover || '';
    var isFallback = !!opts.fallback || !cover;

    if (isFallback) {
      return '<div class="cr-book-cover cr-book-cover--fallback" role="img" aria-label="Cover of ' + escapeHTML(title) + ' by ' + escapeHTML(author) + '">' +
        '<div class="cr-book-cover__fallback-top">' + escapeHTML(genre) + '</div>' +
        '<div>' +
          '<h4 class="cr-book-cover__fallback-title">' + escapeHTML(title) + '</h4>' +
          '<p class="cr-book-cover__fallback-author">by ' + escapeHTML(author) + '</p>' +
        '</div>' +
        '<div class="cr-book-cover__fallback-bottom">The Chapter Room &bull; Edition</div>' +
      '</div>';
    }

    return '<div class="cr-book-cover">' +
      '<img src="' + escapeHTML(cover) + '" alt="Cover of ' + escapeHTML(title) + ' by ' + escapeHTML(author) + '" loading="lazy">' +
    '</div>';
  }

  /**
   * 4. Book Card Component (Standard & Horizontal variants)
   */
  function renderBookCard(opts) {
    if (!opts) opts = {};
    var id = escapeHTML(opts.id || 'book-1');
    var title = escapeHTML(opts.title || 'Notes from Underground');
    var author = escapeHTML(opts.author || 'Fyodor Dostoevsky');
    var genre = escapeHTML(opts.genre || 'Philosophy');
    var desc = escapeHTML(opts.desc || 'A dark, introspective novella questioning rationality, free will, and human consciousness.');
    var readingTime = escapeHTML(opts.readingTime || '3.5 hrs');
    var difficulty = escapeHTML(opts.difficulty || 'Challenging');
    var difficultyNote = escapeHTML(opts.difficultyNote || 'Take your time with this one');
    var isWishlisted = !!opts.isWishlisted;
    var horizontal = !!opts.horizontal;
    var bookPath = escapeHTML(opts.bookPath || ('book.html?id=' + id));
    var isFallback = !!opts.fallback || !opts.cover;

    var coverMarkup = renderBookCover({
      title: opts.title,
      author: opts.author,
      genre: opts.genre,
      cover: opts.cover,
      fallback: isFallback
    });

    return '<article class="cr-book-card ' + (horizontal ? 'cr-book-card--horizontal' : '') + '" data-book-id="' + id + '">' +
      '<div class="cr-book-card__cover-wrap">' +
        '<span class="cr-chip cr-chip--genre cr-book-card__badge">' + genre + '</span>' +
        '<button class="cr-book-card__wishlist ' + (isWishlisted ? 'is-active' : '') + '" type="button" aria-label="' + (isWishlisted ? 'Remove from shelf' : 'Save to shelf') + '" title="' + (isWishlisted ? 'On your shelf' : 'Save to shelf') + '">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + (isWishlisted ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>' +
        '</button>' +
        coverMarkup +
      '</div>' +
      '<div class="cr-book-card__body">' +
        '<div class="cr-book-card__meta-top">' +
          '<span class="cr-chip" title="' + difficultyNote + '">' + difficulty + '</span>' +
          '<span style="font-size:var(--cr-text-xs); color:var(--cr-text-secondary);">' + readingTime + '</span>' +
        '</div>' +
        '<h3 class="cr-book-card__title"><a href="' + bookPath + '">' + title + '</a></h3>' +
        '<p class="cr-book-card__author">by ' + author + '</p>' +
        '<p class="cr-book-card__desc">' + desc + '</p>' +
        '<div class="cr-book-card__footer">' +
          '<span style="font-style:italic; font-size:var(--cr-text-xs); color:var(--cr-text-secondary);">' + difficultyNote + '</span>' +
          '<a href="' + bookPath + '" class="btn" style="padding:0.45rem 0.9rem; font-size:var(--cr-text-xs);">' +
            '<span><span class="btn__label-full">Read Chapter 1</span><span class="btn__label-short">Start</span></span>' +
            '<span class="arrow">&rarr;</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /**
   * 5. Chapter Row Component (Available, Completed, Locked)
   */
  function renderChapterRow(opts) {
    if (!opts) opts = {};
    var number = parseInt(opts.number, 10) || 1;
    var title = escapeHTML(opts.title || 'Part I: Underground');
    var readingTime = escapeHTML(opts.readingTime || '22 min read');
    var commentCount = opts.commentCount !== undefined ? parseInt(opts.commentCount, 10) : 14;
    var state = opts.state || 'available';
    var unlockRequirement = escapeHTML(opts.unlockRequirement || ('Complete Chapter ' + (number - 1) + ' to unlock'));
    var href = escapeHTML(opts.href || '#');
    var formattedNum = number < 10 ? '0' + number : number;

    if (state === 'locked') {
      return '<div class="cr-chapter-row cr-chapter-row--locked" aria-disabled="true" role="group" aria-label="Chapter ' + number + ' Locked">' +
        '<div class="cr-chapter-row__left">' +
          '<span class="cr-chapter-row__num">CH. ' + formattedNum + '</span>' +
          '<div class="cr-chapter-row__content">' +
            '<h4 class="cr-chapter-row__title">' + title + '</h4>' +
            '<div class="cr-chapter-row__meta"><span>' + readingTime + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="cr-chapter-row__right">' +
          '<span class="cr-chapter-row__lock-badge">' +
            '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle; margin-right:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' +
            unlockRequirement +
          '</span>' +
        '</div>' +
      '</div>';
    }

    var isCompleted = state === 'completed';

    return '<div class="cr-chapter-row ' + (isCompleted ? 'cr-chapter-row--completed' : 'cr-chapter-row--available') + '">' +
      '<div class="cr-chapter-row__left">' +
        '<span class="cr-chapter-row__num">CH. ' + formattedNum + '</span>' +
        '<div class="cr-chapter-row__content">' +
          '<h4 class="cr-chapter-row__title"><a href="' + href + '">' + title + '</a></h4>' +
          '<div class="cr-chapter-row__meta"><span>' + readingTime + '</span><span>&bull;</span><span>' + commentCount + ' reader notes</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="cr-chapter-row__right">' +
        (isCompleted
          ? '<span class="cr-chip" style="color:var(--cr-state-completed); background:var(--cr-state-completed-bg); border-color:transparent;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Completed</span><a href="' + href + '" class="btn" style="padding:0.35rem 0.75rem; font-size:var(--cr-text-xs);"><span>Revisit</span> <span class="arrow">&rarr;</span></a>'
          : '<a href="' + href + '" class="btn" style="padding:0.4rem 0.85rem; font-size:var(--cr-text-xs);"><span><span class="btn__label-full">Start Chapter</span><span class="btn__label-short">Start</span></span> <span class="arrow">&rarr;</span></a>') +
      '</div>' +
    '</div>';
  }

  /**
   * 6. Conversational Reaction Set Component
   * Strictly line SVGs + text labels (no emoji chrome)
   * Reactions: Interesting / Made me think / Excellent point / I disagree
   */
  function renderReactions(opts) {
    if (!opts) opts = {};
    var interesting = opts.interesting !== undefined ? opts.interesting : 12;
    var madeMeThink = opts.madeMeThink !== undefined ? opts.madeMeThink : 8;
    var excellentPoint = opts.excellentPoint !== undefined ? opts.excellentPoint : 5;
    var iDisagree = opts.iDisagree !== undefined ? opts.iDisagree : 2;
    var userReactions = opts.userReactions || [];

    var reactions = [
      {
        id: 'interesting',
        label: 'Interesting',
        count: interesting,
        svg: '<svg class="cr-reaction-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"></path></svg>'
      },
      {
        id: 'madeMeThink',
        label: 'Made me think',
        count: madeMeThink,
        svg: '<svg class="cr-reaction-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
      },
      {
        id: 'excellentPoint',
        label: 'Excellent point',
        count: excellentPoint,
        svg: '<svg class="cr-reaction-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg>'
      },
      {
        id: 'iDisagree',
        label: 'I disagree',
        count: iDisagree,
        svg: '<svg class="cr-reaction-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
      }
    ];

    var buttonsHtml = reactions.map(function(r) {
      var active = userReactions.indexOf(r.id) !== -1;
      return '<button type="button" class="cr-reaction-btn ' + (active ? 'is-reacted' : '') + '" data-reaction="' + r.id + '" aria-pressed="' + active + '" aria-label="' + r.label + ' (' + r.count + ')">' +
        r.svg +
        '<span>' + r.label + '</span>' +
        '<span class="cr-reaction-btn__count">' + r.count + '</span>' +
      '</button>';
    }).join('');

    return '<div class="cr-reactions" role="group" aria-label="Reader reactions">' + buttonsHtml + '</div>';
  }

  /**
   * 7. Comment Item & Thread Component with Spoiler Protection
   */
  function renderComment(opts) {
    if (!opts) opts = {};
    var id = escapeHTML(opts.id || 'c1');
    var author = escapeHTML(opts.author || 'Elena Vance');
    var time = escapeHTML(opts.time || '2 hours ago');
    var text = escapeHTML(opts.text || 'The narrator’s rejection of the "crystal palace" reveals the central paradox: humanity would rather suffer irrational agony than surrender free will to mathematical determinism.');
    var isSpoiler = !!opts.isSpoiler;
    var spoilerSummary = escapeHTML(opts.spoilerSummary || 'Discusses narrator’s rebellion against 2+2=4 in Section IX');
    var reactions = opts.reactions || {};
    var isNested = !!opts.isNested;

    var bodyHtml = isSpoiler
      ? '<div class="cr-spoiler-box" role="region" aria-label="Spoiler protected reader thought">' +
          '<div class="cr-spoiler-box__guard">' +
            '<span class="cr-spoiler-box__warning"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Contains Chapter Spoilers</span>' +
            '<p class="cr-spoiler-box__caption">' + spoilerSummary + '</p>' +
            '<button type="button" class="btn" style="padding:0.35rem 0.75rem; font-size:var(--cr-text-xs);" data-cr-reveal-spoiler><span>Reveal Thought</span> <span class="arrow">&rarr;</span></button>' +
          '</div>' +
          '<div class="cr-spoiler-box__hidden-content">' + text + '</div>' +
        '</div>'
      : '<p class="cr-comment__body">' + text + '</p>';

    return '<article class="cr-comment ' + (isNested ? 'cr-comment--nested' : '') + '" id="' + id + '">' +
      '<div class="cr-comment__header">' +
        '<div class="cr-comment__author-meta">' +
          '<div class="cr-comment__avatar" aria-hidden="true">' + author.charAt(0) + '</div>' +
          '<span class="cr-comment__name">' + author + '</span>' +
          '<span class="cr-comment__time">&bull; ' + time + '</span>' +
        '</div>' +
        '<button type="button" class="cr-btn cr-btn--ghost cr-btn--sm" aria-label="Report thought" style="border:none; padding:0.2rem;"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></button>' +
      '</div>' +
      '<div class="cr-comment__content">' + bodyHtml + '</div>' +
      '<div class="cr-comment__footer">' +
        renderReactions(reactions) +
        '<div class="cr-comment__actions"><button type="button" class="cr-link" style="font-size:var(--cr-text-xs); background:none; border:none; cursor:pointer;">Reply to thread</button></div>' +
      '</div>' +
    '</article>';
  }

  /**
   * 8. Progress Indicator Component
   */
  function renderProgress(opts) {
    if (!opts) opts = {};
    var current = parseInt(opts.current, 10) || 0;
    var total = parseInt(opts.total, 10) || 1;
    var label = escapeHTML(opts.label || 'Reading Progress');
    var percent = Math.min(100, Math.round((current / total) * 100));

    return '<div class="cr-progress" role="progressbar" aria-valuenow="' + current + '" aria-valuemin="0" aria-valuemax="' + total + '" aria-label="' + label + '">' +
      '<div class="cr-progress__header">' +
        '<span class="cr-progress__fraction">Chapter ' + current + ' of ' + total + '</span>' +
        '<span class="cr-progress__percent">' + percent + '% complete</span>' +
      '</div>' +
      '<div class="cr-progress__bar">' +
        '<div class="cr-progress__fill" style="width: ' + percent + '%;"></div>' +
      '</div>' +
    '</div>';
  }

  /**
   * 9. Empty State Component
   */
  function renderEmptyState(opts) {
    if (!opts) opts = {};
    var title = escapeHTML(opts.title || 'No books started yet');
    var desc = escapeHTML(opts.desc || 'Your reading shelf is waiting. Select a book from Explore or begin with this month’s community read.');
    var actionLabel = escapeHTML(opts.actionLabel || 'Explore the Library');
    var actionHref = escapeHTML(opts.actionHref || 'explore.html');

    return '<div class="cr-empty-state">' +
      '<svg class="cr-empty-state__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>' +
      '<h3 class="cr-empty-state__title">' + title + '</h3>' +
      '<p class="cr-empty-state__desc">' + desc + '</p>' +
      (actionLabel ? '<a href="' + actionHref + '" class="btn"><span>' + actionLabel + '</span> <span class="arrow">&rarr;</span></a>' : '') +
    '</div>';
  }

  /**
   * 10. Quiet Skeleton Loaders (Book Card, Chapter Row, Comment)
   * Shimmer is restrained, grey to slightly lighter grey in dark; cream to subtle cream in light.
   */
  function renderSkeleton(type) {
    if (type === 'chapter') {
      return '<div class="cr-chapter-row cr-skeleton" style="padding:1.25rem;" aria-hidden="true">' +
        '<div class="cr-chapter-row__left" style="width:65%;">' +
          '<div class="cr-skeleton cr-skeleton-text" style="width:48px; height:16px;"></div>' +
          '<div style="flex:1;">' +
            '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--title"></div>' +
            '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--sub"></div>' +
          '</div>' +
        '</div>' +
        '<div class="cr-chapter-row__right">' +
          '<div class="cr-skeleton cr-skeleton-text" style="width:80px; height:36px; border-radius:2px;"></div>' +
        '</div>' +
      '</div>';
    }

    if (type === 'comment') {
      return '<article class="cr-comment cr-skeleton" style="padding:1.5rem;" aria-hidden="true">' +
        '<div class="cr-comment__header" style="margin-bottom:1rem;">' +
          '<div class="cr-comment__author-meta" style="display:flex; align-items:center; gap:0.75rem;">' +
            '<div class="cr-skeleton cr-skeleton-circle"></div>' +
            '<div>' +
              '<div class="cr-skeleton cr-skeleton-text" style="width:120px; height:14px; margin-bottom:4px;"></div>' +
              '<div class="cr-skeleton cr-skeleton-text" style="width:70px; height:11px; margin:0;"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="cr-comment__content">' +
          '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--body"></div>' +
          '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--body" style="width:85%;"></div>' +
          '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--body" style="width:55%;"></div>' +
        '</div>' +
        '<div class="cr-comment__footer" style="margin-top:1rem; display:flex; gap:0.5rem;">' +
          '<div class="cr-skeleton cr-skeleton-text--pill"></div>' +
          '<div class="cr-skeleton cr-skeleton-text--pill"></div>' +
        '</div>' +
      '</article>';
    }

    // Default: Book Card Skeleton
    return '<article class="cr-book-card cr-skeleton" aria-hidden="true">' +
      '<div class="cr-book-card__cover-wrap cr-skeleton" style="aspect-ratio:2/3; height:220px;"></div>' +
      '<div class="cr-book-card__body">' +
        '<div class="cr-skeleton cr-skeleton-text--pill" style="margin-bottom:0.75rem;"></div>' +
        '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--title"></div>' +
        '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--sub"></div>' +
        '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--body"></div>' +
        '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--body" style="width:75%;"></div>' +
        '<div style="margin-top:auto; padding-top:1rem;">' +
          '<div class="cr-skeleton cr-skeleton-text" style="height:36px; width:110px;"></div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /**
   * 11. Footer Component (Reconciled with The Nebula House)
   */
  function renderFooter(opts) {
    if (!opts) opts = {};
    var rootPath = opts.rootPath !== undefined ? opts.rootPath : '../';
    var crPath = opts.crPath !== undefined ? opts.crPath : '';
    var year = new Date().getFullYear();

    return '<footer class="footer" role="contentinfo">' +
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div class="footer__brand">' +
            '<div class="footer__logo">' +
              '<img src="' + rootPath + 'assets/images/room-icon.png" alt="The Nebula House" class="footer__logo-img">' +
              '<span class="footer__logo-text">The Nebula House</span>' +
            '</div>' +
            '<p class="footer__tagline">The Chapter Room &mdash; A literary institution. Guilt-free reading, sequential unlocking, and thoughtful conversation.</p>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Chapter Room</h4>' +
            '<a href="' + crPath + 'index.html" class="footer__link">Home</a>' +
            '<a href="' + crPath + 'explore.html" class="footer__link">Explore Books</a>' +
            '<a href="' + crPath + 'book-of-the-month.html" class="footer__link">Book of the Month</a>' +
            '<a href="' + crPath + 'my-reading.html" class="footer__link">My Reading Shelf</a>' +
            '<a href="' + crPath + 'community.html" class="footer__link">Community</a>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Rooms</h4>' +
            '<a href="' + rootPath + 'the-chapter-room.html" class="footer__link">The Chapter Room</a>' +
            '<a href="' + rootPath + 'the-writers-room.html" class="footer__link">The Writer\'s Room</a>' +
            '<a href="' + rootPath + 'the-publishing-room.html" class="footer__link">The Publishing Room</a>' +
            '<a href="' + rootPath + 'the-opinion-yard.html" class="footer__link">The Opinion Yard</a>' +
            '<a href="' + rootPath + 'the-nebula-academy.html" class="footer__link">The Nebula Academy</a>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Connect</h4>' +
            '<a href="https://www.instagram.com/the_nebula_house" target="_blank" rel="noopener" class="footer__link">Instagram</a>' +
            '<a href="https://youtube.com/@kelechi_oji" target="_blank" rel="noopener" class="footer__link">YouTube</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<p>&copy; ' + year + ' The Nebula House. All Rights Reserved.</p>' +
          '<div class="footer__social">' +
            '<a href="https://www.instagram.com/the_nebula_house" target="_blank" rel="noopener">Instagram</a>' +
            '<a href="https://youtube.com/@kelechi_oji" target="_blank" rel="noopener">YouTube</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  return {
    escapeHTML: escapeHTML,
    renderNav: renderNav,
    renderTabBar: renderTabBar,
    renderBookCover: renderBookCover,
    renderBookCard: renderBookCard,
    renderChapterRow: renderChapterRow,
    renderReactions: renderReactions,
    renderComment: renderComment,
    renderProgress: renderProgress,
    renderEmptyState: renderEmptyState,
    renderSkeleton: renderSkeleton,
    renderFooter: renderFooter
  };
})();