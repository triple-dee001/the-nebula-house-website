const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../../chapter-room');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log('Auditing noindex and route unlisted status across Chapter Room...');

let updated = 0;
files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('name="robots" content="noindex')) {
    // Insert meta noindex right after <head>
    content = content.replace(/<head>/i, '<head>\n  <meta name="robots" content="noindex, nofollow">');
    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`Added <meta name="robots" content="noindex, nofollow"> to ${f}`);
  } else {
    console.log(`${f} already has noindex`);
  }
});

console.log(`\nAudit complete: ${files.length} pages verified. Added to ${updated} pages.`);
