const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../chapter-room');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('Removing noindex tags for production launch...');
let count = 0;

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('<meta name="robots" content="noindex, nofollow">')) {
    content = content.replace(/\s*<meta name="robots" content="noindex, nofollow">\s*/g, '\n  ');
    fs.writeFileSync(p, content, 'utf8');
    count++;
    console.log('Removed noindex from ' + f);
  }
});

console.log(`Removed noindex from ${count} files. Chapter Room is now ready for public search indexing!`);
