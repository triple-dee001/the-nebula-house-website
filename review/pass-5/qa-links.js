const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../chapter-room');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let broken = 0;
let checked = 0;

files.forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  // Match href="path" and src="path"
  const linkRegex = /(?:href|src)="([^"#?]+)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('javascript:') || link.startsWith('data:') || link.includes("'") || link.includes('+') || link.includes('${')) continue;
    checked++;
    const resolved = path.resolve(dir, link);
    if (!fs.existsSync(resolved)) {
      // Don't flag root links if handled by server rewrite or standard anchor
      console.warn(`[WARN] In ${f}: link target not on local disk: ${link} (resolved: ${resolved})`);
      broken++;
    }
  }
});

console.log(`Audited ${checked} links across ${files.length} pages.`);
if (broken === 0) {
  console.log('ALL STATIC LINKS AND SCRIPT REFERENCES RESOLVE TO REAL FILES ON DISK!');
} else {
  console.log(`Found ${broken} missing references that need attention.`);
}
