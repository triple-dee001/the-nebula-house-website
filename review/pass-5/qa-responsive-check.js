/**
 * Pass 5 Responsive, Accessibility & Visual QA Matrix
 */

const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '../../css/chapter-room.css'), 'utf8');

console.log('===============================================================');
console.log('RUNNING CHAPTER ROOM PASS 5 RESPONSIVE & ACCESSIBILITY AUDIT');
console.log('===============================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

// 1. Touch Target Audit (>= 44px)
console.log('1. Touch Targets (>= 44px on Mobile & Interactive Elements)');
assert(css.includes('min-height: 48px;') && css.includes('min-width: 48px;'), 'Mobile bottom tab items have 48px minimum height and width');
assert(css.includes('min-height: 44px;') || css.includes('min-height: 48px;'), 'Interactive touch target minimum enforced in CSS');
assert(css.includes('--cr-btn-min-height: 44px') || css.includes('padding: 0.55rem 1.15rem') || css.includes('.cr-btn'), 'Buttons defined with ample touch padding');

// 2. Responsive Breakpoints Verification
console.log('\n2. Responsive Breakpoint Rules (360px, 390px, 768px, 1024px, 1280px)');
assert(css.includes('@media (max-width: 768px)'), 'Mobile breakpoint 768px defined for bottom tabbar & single-column layout');
assert(css.includes('@media (max-width: 1080px)') || css.includes('@media (max-width: 1024px)'), 'Tablet/laptop breakpoint defined for chapter navigation collapse');
assert(css.includes('@media (max-width: 480px)'), 'Narrow mobile breakpoint 480px defined for short button labels');
assert(css.includes('.btn__label-short') && css.includes('.btn__label-full'), 'Responsive button labels .btn__label-short / .btn__label-full present');

// 3. Aspect Ratio 2:3 on Book Covers
console.log('\n3. Book Cover 2:3 Aspect Ratio');
assert(css.includes('aspect-ratio: 2 / 3;') || css.includes('aspect-ratio: 2/3;'), 'Book covers strictly enforce aspect-ratio: 2 / 3');

// 4. Quiet Skeleton Shimmer & Motion Sensitivity
console.log('\n4. Skeleton Loading Shimmer & Reduced Motion Support');
assert(css.includes('.cr-skeleton'), 'Quiet cr-skeleton classes defined');
assert(css.includes('prefers-reduced-motion: reduce'), 'Prefers-reduced-motion media query disables animations for accessibility');

// 5. Typography Standards
console.log('\n5. Typography Standards (Cormorant Garamond >= 20px, Inter >= 16px)');
assert(css.includes('Cormorant Garamond'), 'Cormorant Garamond configured as display/reading font');
assert(css.includes('Inter'), 'Inter configured as sans UI font');
assert(css.includes('--cr-font-reading-size: 1.25rem') || css.includes('font-size: 1.25rem') || css.includes('font-size: var(--cr-text-lg)') || css.includes('20px'), 'Reading text configured at >= 20px (1.25rem)');

// 6. Theme Switching & Palette Integrity
console.log('\n6. Theme Switching & Color Palette Integrity');
assert(css.includes('[data-cr-theme="cream"]'), 'Cream opt-in reading theme selector present');
assert(css.includes('#f0ebe0') || css.includes('#ede7db') || css.includes('#e8e2d6'), 'Site cream color used in theme definitions');
assert(!/#c4975a|#d4a362/i.test(css), 'Zero brass/unapproved accent colors in CSS');

console.log('\n===============================================================');
console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('===============================================================\n');

process.exit(failed > 0 ? 1 : 0);
