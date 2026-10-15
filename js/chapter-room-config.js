/**
 * THE NEBULA HOUSE — CHAPTER ROOM GLOBAL CONFIG & FEATURE FLAG
 *
 * One-step control to take Chapter Room offline or toggle preview mode.
 */

window.CHAPTER_ROOM_CONFIG = {
  // Feature flag: set to false to instantly take Chapter Room offline
  enabled: true,

  // Backend API URL (defaults to window.API_BASE or relative)
  apiUrl: (window.API_BASE || '') + '/api/chapter-room',

  // Offline / private preview fallback screen
  takeOffline: function () {
    this.enabled = false;
    this.enforceFlag();
  },

  bringOnline: function () {
    this.enabled = true;
  },

  enforceFlag: function () {
    if (!this.enabled && typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.innerHTML = [
          '<div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000000; color:#ffffff; text-align:center; padding:2rem; font-family:\'Inter\',sans-serif;">',
          '  <h1 style="font-family:\'Cormorant Garamond\',serif; font-size:3rem; font-weight:500; margin-bottom:1rem; letter-spacing:-0.02em;">The Chapter Room</h1>',
          '  <p style="color:#9e9e9e; max-width:480px; font-size:1.1rem; line-height:1.6; margin-bottom:2.5rem;">The Chapter Room is currently in private preview and undergoing scheduled maintenance. Please check back soon.</p>',
          '  <a href="../index.html" style="display:inline-block; padding:0.8rem 1.8rem; background:#ffffff; color:#000000; font-weight:600; text-decoration:none; border-radius:2px;">Return to The Nebula House</a>',
          '</div>'
        ].join('\n');
      });
    }
  }
};

// Immediate execution check
if (window.CHAPTER_ROOM_CONFIG && !window.CHAPTER_ROOM_CONFIG.enabled) {
  window.CHAPTER_ROOM_CONFIG.enforceFlag();
}
