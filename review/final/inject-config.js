const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../chapter-room');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('chapter-room-config.js')) {
    content = content.replace(
      '<script src="../js/chapter-room/tokens.js"></script>',
      '<script src="../js/chapter-room-config.js"></script>\n  <script src="../js/chapter-room/tokens.js"></script>'
    );
    fs.writeFileSync(p, content, 'utf8');
    console.log('Included chapter-room-config.js in ' + f);
  }
});
console.log('Finished updating chapter-room-config.js inclusions.');
