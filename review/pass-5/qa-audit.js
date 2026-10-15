const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../chapter-room');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('Auditing ' + files.length + ' Chapter Room HTML files for Pass 5 QA...');
let allOk = true;

const results = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const hasViewport = content.includes('name="viewport"');
  const hasStylesCss = content.includes('styles.css');
  const hasChapterCss = content.includes('chapter-room.css');
  const hasTokens = content.includes('tokens.js');
  const hasData = content.includes('data.js');
  const hasComponents = content.includes('components.js');

  const idxStyles = content.indexOf('styles.css');
  const idxChapter = content.indexOf('chapter-room.css');
  const stylesOrderOk = idxStyles !== -1 && idxChapter !== -1 && idxStyles < idxChapter;

  // Check for foreign brass hex #C4975A or #D4A362
  const hasBrass = /#c4975a|#d4a362/i.test(content);
  // Check for foreign cream #faf6f0
  const hasForeignCream = /#faf6f0/i.test(content);

  const checks = {
    file: f,
    hasViewport,
    hasStylesCss,
    hasChapterCss,
    stylesOrderOk,
    hasTokens,
    hasData,
    hasComponents,
    noBrass: !hasBrass,
    noForeignCream: !hasForeignCream
  };

  const isFileValid = hasViewport && hasStylesCss && hasChapterCss && stylesOrderOk &&
                      hasTokens && hasData && hasComponents && !hasBrass && !hasForeignCream;

  if (!isFileValid) {
    allOk = false;
    console.error('FAIL in ' + f + ':', checks);
  } else {
    results.push(f + ': PASS');
  }
});

console.log(results.join('\n'));
if (allOk) {
  console.log('\nALL ' + files.length + ' CHAPTER ROOM PAGES PASSED ARCHITECTURE & PALETTE AUDIT!');
} else {
  console.error('\nSOME CHECKS FAILED');
  process.exit(1);
}
