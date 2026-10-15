const fs = require('fs');
const path = require('path');
const { newDb } = require('../../../backend/node_modules/pg-mem');

const db = newDb();

console.log('Testing pg-mem with Chapter Room migration & seed...');

const migrationSql = fs.readFileSync(path.join(__dirname, '../pass-4/migration.sql'), 'utf8');
const seedSql = fs.readFileSync(path.join(__dirname, '../pass-4/seed.sql'), 'utf8');

try {
  // Create base users table so foreign keys resolve
  db.public.none('CREATE TABLE IF NOT EXISTS "users" ("id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT \'USER\');');
  db.public.none('INSERT INTO "users" (id, name, email) VALUES (\'persona-new-reader\', \'Maya Lin\', \'maya@example.com\'), (\'persona-ch3-reader\', \'Marcus Vance\', \'marcus@example.com\'), (\'persona-finished-reader\', \'Dr. Elena Rostova\', \'elena@example.com\');');

  // Execute migration
  db.public.none(migrationSql);
  console.log('[PASS] migration.sql applied successfully in local in-memory Postgres!');

  // Execute seed
  db.public.none(seedSql);
  console.log('[PASS] seed.sql applied successfully in local in-memory Postgres!');

  const books = db.public.many('SELECT id, title, author, "isBotm" FROM "cr_books"');
  console.log('Seeded books count:', books.length, books.map(b => b.title));

  const chapters = db.public.many('SELECT id, number, title FROM "cr_chapters"');
  console.log('Seeded chapters count:', chapters.length);

  const progress = db.public.many('SELECT id, "userId", "currentChapter", "completedChapters" FROM "cr_reading_progress"');
  console.log('Seeded progress personas count:', progress.length, progress.map(p => p.userId + ' (Ch ' + p.currentChapter + ')'));

  console.log('\nPG-MEM FULLY FUNCTIONAL FOR STAGING TESTING!');
} catch (err) {
  console.error('Error applying to pg-mem:', err);
  process.exit(1);
}
