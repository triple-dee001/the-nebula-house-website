const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`Status for ${url}: ${res.statusCode}`);
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.log(`Error for ${url}: ${e.message}`);
      resolve(null);
    });
  });
}

async function run() {
  await check('https://the-nebula-house-website-git-chapter-room-triple-dee001s-projects.vercel.app');
  await check('https://thenebulahouse.com');
}

run();
