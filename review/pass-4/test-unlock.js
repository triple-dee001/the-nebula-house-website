/**
 * AUTOMATED TEST SUITE: SERVER-SIDE SEQUENTIAL UNLOCKING & SPOILER PROTECTION
 *
 * Verifies Pass 4 Non-Negotiables:
 * 1. Sequential chapter unlocking enforced server-side.
 * 2. Strict spoiler protection: Locked chapter returns 403 Forbidden and NO leaked summary/keyIdeas/comments.
 * 3. Mark Chapter complete unlocks the next chapter.
 * 4. Comments cannot be posted to locked chapters.
 * 5. Reactions & Report Queue behavior.
 */

const express = require('express');
const request = require('http');

// Setup express app with the Chapter Room routes
const app = express();
app.use(express.json());

// Mock minimal auth middleware if needed
const chapterRoomRoutes = require('../../../backend/src/routes/chapter-room.routes.js');
app.use('/api/chapter-room', chapterRoomRoutes);

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/chapter-room`;

  console.log('===============================================================');
  console.log('RUNNING CHAPTER ROOM PASS 4 AUTOMATED SPOILER & UNLOCK TESTS');
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

  async function apiGet(path, headers = {}) {
    return new Promise((resolve, reject) => {
      const u = new URL(baseUrl + path);
      const req = request.get(u, { headers }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
    });
  }

  async function apiPost(path, body = {}, headers = {}) {
    return new Promise((resolve, reject) => {
      const u = new URL(baseUrl + path);
      const payload = JSON.stringify(body);
      const req = request.request(u, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch(e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  try {
    const testUser = 'user-test-' + Date.now();
    const guestHeader = { 'x-guest-id': testUser };

    // TEST 1: Chapter 1 is accessible to anyone
    console.log('TEST 1: Request Chapter 1 (Default Unlocked)');
    const ch1 = await apiGet('/books/notes-from-underground/chapters/1', guestHeader);
    assert(ch1.status === 200, 'Chapter 1 returns HTTP 200 OK');
    assert(ch1.body.locked === false, 'Chapter 1 is not locked');
    assert(Array.isArray(ch1.body.keyIdeas) && ch1.body.keyIdeas.length > 0, 'Chapter 1 contains key ideas');
    assert(typeof ch1.body.summary === 'string' && ch1.body.summary.length > 0, 'Chapter 1 contains summary');

    // TEST 2: Request Chapter 2 before completing Chapter 1 -> MUST 403 Forbidden with zero spoilers
    console.log('\nTEST 2: Request Chapter 2 without completing Chapter 1 (Spoiler Defense)');
    const ch2Locked = await apiGet('/books/notes-from-underground/chapters/2', guestHeader);
    assert(ch2Locked.status === 403, 'Chapter 2 returns HTTP 403 Forbidden');
    assert(ch2Locked.body.locked === true, 'Response payload explicitly states locked: true');
    assert(ch2Locked.body.summary === undefined, 'ZERO summary leaked in response payload');
    assert(ch2Locked.body.keyIdeas === undefined, 'ZERO keyIdeas leaked in response payload');
    assert(ch2Locked.body.comments === undefined, 'ZERO comments leaked in response payload');
    assert(ch2Locked.body.readingPanelText === undefined, 'ZERO reading text leaked in response payload');
    assert(typeof ch2Locked.body.message === 'string', 'Helpful sequential unlock instructions provided');

    // TEST 3: Attempting to post a comment to locked Chapter 2 -> MUST 403
    console.log('\nTEST 3: Post comment to locked Chapter 2');
    const commentBlocked = await apiPost('/books/notes-from-underground/chapters/2/comments', {
      text: 'Sneaking a comment in advance!'
    }, guestHeader);
    assert(commentBlocked.status === 403, 'Posting comment to locked chapter rejected with HTTP 403');

    // TEST 4: Mark Chapter 1 Complete
    console.log('\nTEST 4: Mark Chapter 1 Complete');
    const markCh1 = await apiPost('/books/notes-from-underground/chapters/1/complete', {}, guestHeader);
    assert(markCh1.status === 200, 'Marking chapter 1 complete returns HTTP 200 OK');
    assert(markCh1.body.success === true, 'Completion acknowledged successfully');

    // TEST 5: Request Chapter 2 again -> MUST NOW BE 200 OK Unlocked
    console.log('\nTEST 5: Request Chapter 2 after completing Chapter 1');
    const ch2Unlocked = await apiGet('/books/notes-from-underground/chapters/2', guestHeader);
    assert(ch2Unlocked.status === 200, 'Chapter 2 now returns HTTP 200 OK');
    assert(ch2Unlocked.body.locked === false, 'Chapter 2 is now unlocked');
    assert(ch2Unlocked.body.summary !== undefined, 'Summary is now accessible');
    assert(ch2Unlocked.body.keyIdeas !== undefined, 'Key ideas are now accessible');

    // TEST 6: Report Queue with 6 Allowed Categories
    console.log('\nTEST 6: Submitting thought report for moderation');
    const reportRes = await apiPost('/comments/c101/report', {
      category: 'Spoilers without tag',
      details: 'Disclosed plot details from section 4 without checking the spoiler box'
    }, guestHeader);
    assert(reportRes.status === 201, 'Report submitted successfully with HTTP 201');

    console.log('\n===============================================================');
    console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================\n');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  }
});
