/**
 * CHAPTER ROOM — REUSABLE UI COMPONENTS
 * Pure, typed component generator functions for The Chapter Room.
 * Reconciled with The Nebula House design system.
 * Aligned with The Chapter Room Product, UX & Functional Requirements Document.
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
   * Tier 2: Chapter Room Sub-navigation (Home | Explore | Book of the Month | My Reading | Community | Profile)
   */
  function renderNav(activePath, opts) {
    if (!activePath) activePath = 'home';
    if (!opts) opts = {};
    var rootPath = (opts.rootPath && opts.rootPath !== '../') ? opts.rootPath : '/';
    var crPath = (opts.crPath && opts.crPath !== '') ? opts.crPath : '/chapter-room/';

    var subLinks = [
      { id: 'home', label: 'Chapter Room', href: crPath + 'index.html' },
      { id: 'explore', label: 'Explore', href: crPath + 'explore.html' },
      { id: 'botm', label: 'Book of the Month', href: crPath + 'book-of-the-month.html' },
      { id: 'shelf', label: 'My Reading', href: crPath + 'my-reading.html' },
      { id: 'community', label: 'Community', href: crPath + 'community.html' },
      { id: 'profile', label: 'Reader Profile', href: crPath + 'profile.html' }
    ];

    var subLinkItems = subLinks.map(function(link) {
      var activeClass = activePath === link.id ? 'is-active' : '';
      return '<li><a href="' + link.href + '" class="cr-subnav__link ' + activeClass + '">' + link.label + '</a></li>';
    }).join('');

    return '<header class="cr-header-stack" id="cr-header-stack">' +
      '<!-- TIER 1: SITE HEADER -->' +
      '<nav class="navbar navbar--cr" id="navbar">' +
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
                '<a href="' + crPath + 'index.html" class="navbar__dropdown-item">The Chapter Room</a>' +
                '<a href="' + rootPath + 'the-writers-room.html" class="navbar__dropdown-item">The Writer\'s Room</a>' +
                '<a href="' + rootPath + 'the-publishing-room.html" class="navbar__dropdown-item">The Publishing Room</a>' +
                '<a href="' + rootPath + 'the-opinion-yard.html" class="navbar__dropdown-item">The Opinion Yard</a>' +
                '<a href="' + rootPath + 'the-nebula-academy.html" class="navbar__dropdown-item">The Nebula Academy</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="navbar__actions-group" style="display:flex; align-items:center; gap:0.75rem;">' +
            '<a href="' + crPath + 'profile.html" class="navbar__account" id="nav-account-icon" title="Reader Account" aria-label="Reader Account">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' +
            '</a>' +
            '<div class="navbar__toggle" id="menuToggle" aria-label="Toggle navigation" role="button" tabindex="0"><span></span><span></span><span></span></div>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<!-- SITE MOBILE MENU -->' +
      '<div class="mobile-menu" id="mobileMenu">' +
        '<a href="' + rootPath + 'index.html" class="mobile-menu__link">Home</a>' +
        '<a href="' + rootPath + 'about.html" class="mobile-menu__link">About</a>' +
        '<div class="mobile-menu__divider"></div>' +
        '<a href="' + crPath + 'index.html" class="mobile-menu__link">The Chapter Room</a>' +
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
            '<form action="' + crPath + 'search.html" method="GET" class="cr-search-box" role="search" style="margin:0;">' +
              '<svg class="cr-search-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
              '<input type="search" name="q" class="cr-search-box__input" placeholder="Search library..." aria-label="Search library" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false">' +
            '</form>' +
            '<a href="' + crPath + 'notifications.html" class="cr-theme-btn" title="Reading & Discussion Notifications" aria-label="Notifications" style="text-decoration:none;">' +
              '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>' +
            '</a>' +
            '<button class="cr-theme-btn" data-cr-theme-toggle type="button" aria-label="Toggle Reading Theme (Cream Paper or Night Ink)" title="Toggle Reading Theme">' +
              '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' +
              '<span>Theme</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</header>';
  }

  /**
   * 2. Mobile Bottom Tab Bar Component (Home / Explore / This Month / My Reading / Community)
   * 44px+ touch targets
   */
  function renderTabBar(activePath, opts) {
    if (!activePath) activePath = 'home';
    if (!opts) opts = {};
    var crPath = (opts.crPath && opts.crPath !== '') ? opts.crPath : '/chapter-room/';
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
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
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
        icon: '<svg class="cr-tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>'
      }
    ];

    var tabItems = tabs.map(function(tab) {
      var activeClass = activePath === tab.id ? 'is-active' : '';
      return '<a href="' + tab.href + '" class="cr-tabbar__item ' + activeClass + '" aria-label="' + tab.label + '">' +
        tab.icon +
        '<span class="cr-tabbar__label">' + tab.label + '</span>' +
      '</a>';
    }).join('');

    return '<nav class="cr-tabbar" role="navigation" aria-label="Mobile Bottom Navigation">' + tabItems + '</nav>';
  }

  /**
   * 3. Typographic Fallback & Image Book Cover Component (2:3 Aspect Ratio)
   */
  function renderBookCover(opts) {
    if (!opts) opts = {};
    var title = escapeHTML(opts.title || 'Untitled');
    var author = escapeHTML(opts.author || 'Author');
    var genre = escapeHTML(opts.genre || 'Literature');
    var coverUrl = opts.cover;
    var isFallback = !!opts.fallback || !coverUrl;

    if (!isFallback && coverUrl) {
      return '<div class="cr-cover-wrap">' +
        '<img src="' + escapeHTML(coverUrl) + '" alt="' + title + ' by ' + author + '" class="cr-cover-img" loading="lazy" onerror="this.parentElement.outerHTML = CRComponents.renderBookCover({ title: \'' + title.replace(/'/g, "\\'") + '\', author: \'' + author.replace(/'/g, "\\'") + '\', genre: \'' + genre.replace(/'/g, "\\'") + '\', fallback: true });">' +
      '</div>';
    }

    return '<div class="cr-cover-fallback" role="img" aria-label="Book cover for ' + title + ' by ' + author + '">' +
      '<div class="cr-cover-fallback__inner">' +
        '<span class="cr-cover-fallback__genre">' + genre + '</span>' +
        '<h3 class="cr-cover-fallback__title">' + title + '</h3>' +
        '<p class="cr-cover-fallback__author">' + author + '</p>' +
        '<div class="cr-cover-fallback__publisher">The Chapter Room &bull; Archive</div>' +
      '</div>' +
    '</div>';
  }

  /**
   * 4. Editorial Book Card Component
   */
  function renderBookCard(opts) {
    if (!opts) opts = {};
    var id = escapeHTML(opts.id || 'notes-from-underground');
    var title = escapeHTML(opts.title || 'Notes from Underground');
    var author = escapeHTML(opts.author || 'Fyodor Dostoevsky');
    var genre = escapeHTML(opts.genre || 'Philosophy');
    var desc = escapeHTML(opts.desc || opts.description || '');
    var readingTime = escapeHTML(opts.readingTime || '3.5 hrs');
    var dailyEstimate = escapeHTML(opts.dailyEstimate || '');
    var difficulty = escapeHTML(opts.difficulty || 'Challenging');
    var difficultyNote = escapeHTML(opts.difficultyNote || 'Take your time with this one');
    var isWishlisted = !!opts.isWishlisted;
    var horizontal = !!opts.horizontal;
    var bookPath = escapeHTML(opts.bookPath || ('/chapter-room/book.html?id=' + id));
    var isFallback = !!opts.fallback || !opts.cover;

    var coverMarkup = renderBookCover({
      title: opts.title,
      author: opts.author,
      genre: opts.genre,
      cover: opts.cover,
      fallback: isFallback
    });

    var dailyBadge = dailyEstimate ? '<span style="font-size:var(--cr-text-xs); color:var(--cr-text-secondary);">&bull; ' + dailyEstimate + '</span>' : '';

    return '<article class="cr-book-card ' + (horizontal ? 'cr-book-card--horizontal' : '') + '" data-book-id="' + id + '">' +
      '<div class="cr-book-card__cover-wrap">' +
        '<span class="cr-chip cr-chip--genre cr-book-card__badge">' + genre + '</span>' +
        '<button class="cr-book-card__wishlist ' + (isWishlisted ? 'is-active' : '') + '" type="button" aria-label="' + (isWishlisted ? 'Remove from shelf' : 'Save to shelf') + '" title="' + (isWishlisted ? 'On your shelf' : 'Save to shelf') + '" onclick="CRData.moveBookOnShelf(\'' + id + '\', \'wishlist\'); this.classList.toggle(\'is-active\');">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="' + (isWishlisted ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>' +
        '</button>' +
        coverMarkup +
      '</div>' +
      '<div class="cr-book-card__body">' +
        '<div class="cr-book-card__meta-top">' +
          '<span class="cr-chip" title="' + difficultyNote + '">' + difficulty + '</span>' +
          '<span style="font-size:var(--cr-text-xs); color:var(--cr-text-secondary);">' + readingTime + '</span>' +
          dailyBadge +
        '</div>' +
        '<h3 class="cr-book-card__title"><a href="' + bookPath + '">' + title + '</a></h3>' +
        '<p class="cr-book-card__author">by ' + author + '</p>' +
        '<p class="cr-book-card__desc">' + desc + '</p>' +
        '<div class="cr-book-card__footer">' +
          '<span style="font-style:italic; font-size:var(--cr-text-xs); color:var(--cr-text-secondary);">' + difficultyNote + '</span>' +
          '<div style="display:flex; gap:0.5rem; align-items:center;">' +
            '<a href="' + bookPath + '" class="btn" style="padding:0.45rem 0.9rem; font-size:var(--cr-text-xs);">' +
              '<span><span class="btn__label-full">Read Book</span><span class="btn__label-short">Read</span></span>' +
              '<span class="arrow">&rarr;</span>' +
            '</a>' +
          '</div>' +
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
   * 6. Conversational Reaction Set Component (Interesting / Made me think / Excellent point / I disagree)
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
        svg: '<svg class="cr-reaction-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
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
        svg: '<svg class="cr-reaction-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>'
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
        '<div class="cr-comment__actions"><button type="button" class="cr-link" style="font-size:var(--cr-text-xs); background:none; border:none; cursor:pointer;" onclick="window.location.href=\'thread.html?id=' + id + '\';">Reply in Thread</button></div>' +
      '</div>' +
    '</article>';
  }

  /**
   * 8. Interactive Discovery Prompts Component (Section 28)
   */
  function renderDiscoveryPrompts(activeTheme) {
    if (!activeTheme) activeTheme = 'all';
    var themes = [
      'Meaning',
      'Faith',
      'Love',
      'Power',
      'Death',
      'Freedom',
      'Identity',
      'Human Nature',
      'History'
    ];

    var pills = themes.map(function(t) {
      var active = activeTheme.toLowerCase() === t.toLowerCase() ? 'is-active' : '';
      return '<button type="button" class="cr-chip ' + active + '" data-theme-filter="' + escapeHTML(t) + '">' +
        escapeHTML(t) +
      '</button>';
    }).join('');

    return '<div class="cr-discovery-prompts" style="background:var(--cr-bg-surface); border:1px solid var(--cr-border-subtle); border-radius:var(--cr-radius-xs, 2px); padding:var(--cr-space-6, 1.5rem); margin:var(--cr-space-6, 1.5rem) 0;">' +
      '<span class="cr-section-header__label" style="display:block; margin-bottom:0.25rem;">"I DON’T KNOW WHAT TO READ"</span>' +
      '<h3 class="cr-h3" style="margin-top:0; margin-bottom:0.5rem;">What are you interested in exploring?</h3>' +
      '<p style="font-size:var(--cr-text-sm); color:var(--cr-text-secondary); margin-bottom:var(--cr-space-4, 1rem);">' +
        'Choose an existential question or central human theme. We will find enduring books that wrestle with it.' +
      '</p>' +
      '<div class="cr-filter-bar" style="margin-bottom:0; flex-wrap:wrap; gap:0.5rem;">' + pills + '</div>' +
    '</div>';
  }

  /**
   * 9. Reader Card Component for Community Discovery (Section 23 & 25)
   */
  function renderReaderCard(reader) {
    if (!reader) return '';
    var name = escapeHTML(reader.name || 'Reader');
    var id = escapeHTML(reader.id || 'reader');
    var joined = escapeHTML(reader.joinedYear ? ('Reading since ' + reader.joinedYear) : 'Active Reader');
    var bio = escapeHTML(reader.bio || 'Engaging with enduring literature in The Chapter Room.');
    var avatar = escapeHTML(reader.avatar || name.charAt(0));
    var completed = reader.completedCount || 0;
    var currently = reader.currentlyReading ? escapeHTML(reader.currentlyReading.title) : 'Notes from Underground';
    var genres = (reader.favouriteGenres || ['Philosophy', 'Fiction']).map(function(g) {
      return '<span class="cr-chip" style="font-size:0.7rem; padding:0.15rem 0.5rem;">' + escapeHTML(g) + '</span>';
    }).join(' ');

    return '<div class="cr-reader-card" style="background:var(--cr-bg-surface); border:1px solid var(--cr-border-subtle); border-radius:var(--cr-radius-xs, 2px); padding:var(--cr-space-4, 1rem); display:flex; flex-direction:column; justify-content:space-between; gap:var(--cr-space-3, 0.75rem);">' +
      '<div style="display:flex; align-items:center; gap:0.75rem;">' +
        '<div style="width:44px; height:44px; border-radius:50%; background:var(--cr-bg-card); border:1px solid var(--cr-border-subtle); display:flex; align-items:center; justify-content:center; font-family:var(--cr-font-display); font-size:1.25rem; font-weight:700; color:var(--cr-text-primary); flex-shrink:0;">' + avatar + '</div>' +
        '<div style="min-width:0; flex:1;">' +
          '<h4 style="margin:0; font-family:var(--cr-font-sans); font-size:var(--cr-text-base); font-weight:600;"><a href="profile.html?user=' + id + '" style="color:var(--cr-text-primary); text-decoration:none;">' + name + '</a></h4>' +
          '<span style="font-size:var(--cr-text-xs); color:var(--cr-text-secondary);">' + joined + '</span>' +
        '</div>' +
      '</div>' +
      '<p style="font-size:var(--cr-text-xs); color:var(--cr-text-secondary); margin:0; line-height:1.5;">' + bio + '</p>' +
      '<div style="font-size:var(--cr-text-xs); color:var(--cr-text-secondary); border-top:1px solid var(--cr-border-subtle); padding-top:0.5rem;">' +
        '<div>Currently: <strong style="color:var(--cr-text-primary);">' + currently + '</strong></div>' +
        '<div>Completed: <strong style="color:var(--cr-text-primary);">' + completed + ' works</strong></div>' +
      '</div>' +
      '<div style="display:flex; flex-wrap:wrap; gap:0.25rem; align-items:center;">' + genres + '</div>' +
      '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.25rem;">' +
        '<a href="profile.html?user=' + id + '" class="cr-link" style="font-size:var(--cr-text-xs);">View Shelf &rarr;</a>' +
        '<button type="button" class="btn btn--outline btn--sm" onclick="CRData.toggleFollowReader(\'' + id + '\'); this.textContent = this.textContent === \'Follow\' ? \'Following\' : \'Follow\';">Follow</button>' +
      '</div>' +
    '</div>';
  }

  /**
   * 10. Progress Indicator Component
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
   * 11. Empty State Component
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
   * 12. Skeleton Loaders
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
      '</article>';
    }

    return '<article class="cr-book-card cr-skeleton" aria-hidden="true">' +
      '<div class="cr-book-card__cover-wrap cr-skeleton" style="aspect-ratio:2/3; height:220px;"></div>' +
      '<div class="cr-book-card__body">' +
        '<div class="cr-skeleton cr-skeleton-text--pill" style="margin-bottom:0.75rem;"></div>' +
        '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--title"></div>' +
        '<div class="cr-skeleton cr-skeleton-text cr-skeleton-text--sub"></div>' +
      '</div>' +
    '</article>';
  }

  /**
   * 13. Footer Component
   */
  function renderFooter(opts) {
    if (!opts) opts = {};
    var rootPath = (opts.rootPath && opts.rootPath !== '../') ? opts.rootPath : '/';
    var crPath = (opts.crPath && opts.crPath !== '') ? opts.crPath : '/chapter-room/';
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
            '<a href="' + crPath + 'profile.html" class="footer__link">Reader Profile</a>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h4 class="footer__title">Rooms</h4>' +
            '<a href="' + crPath + 'index.html" class="footer__link">The Chapter Room</a>' +
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

  // Delegated event listener for mobile menu toggle on Chapter Room pages
  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('#menuToggle, .navbar__toggle');
      if (toggle) {
        toggle.classList.toggle('active');
        var mobileMenu = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('active');
          document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        }
      }
      var mobileLink = e.target.closest('.mobile-menu__link');
      if (mobileLink) {
        var menu = document.getElementById('mobileMenu') || document.querySelector('.mobile-menu');
        var tog = document.getElementById('menuToggle') || document.querySelector('.navbar__toggle');
        if (menu) menu.classList.remove('active');
        if (tog) tog.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
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
    renderDiscoveryPrompts: renderDiscoveryPrompts,
    renderReaderCard: renderReaderCard,
    renderProgress: renderProgress,
    renderEmptyState: renderEmptyState,
    renderSkeleton: renderSkeleton,
    renderFooter: renderFooter
  };
})();