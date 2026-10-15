# The Nebula House: Chapter Room Launch Package

This runbook defines the exact sequence of operational steps to deploy, migrate, verify, and launch Chapter Room (`/chapter-room/`) on the live production environment (`thenebulahouse.com`).

---

## 1. Pre-Launch Backups (Mandatory)

Before executing any commands against production:

1. **Database Snapshot:**
   - Log into your Railway or AWS RDS PostgreSQL dashboard.
   - Trigger a manual point-in-time snapshot of the production database (`postgres`).
   - Alternatively, dump the schema and data via `pg_dump`:
     ```bash
     pg_dump "$DATABASE_URL" --format=custom --file="nebula_pre_chapter_room_backup_$(date +%Y%m%d_%H%M%S).dump"
     ```
2. **Environment Verification:**
   - Confirm backend environment variables are set:
     - `JWT_SECRET`
     - `SUPER_ADMIN_EMAILS`
     - `DATABASE_URL`

---

## 2. Database Migration

The Chapter Room migration is **additive only**. It creates 8 dedicated `cr_*` tables with `IF NOT EXISTS` guards and modifies zero existing tables.

### Execution Command:
Using PostgreSQL CLI:
```bash
psql "$DATABASE_URL" -f review/pass-4/migration.sql
```

Or using Prisma in the backend repository:
```bash
npx prisma db push --schema=prisma/schema.prisma
```

### Staging Seed Data (Optional for Staging / QA Environments):
```bash
psql "$DATABASE_URL" -f review/pass-4/seed.sql
```

---

## 3. Rollback Plan

If any critical issue arises during deployment:

### Immediate Application Kill-Switch (Zero Downtime, < 10 Seconds):
In [`js/chapter-room-config.js`](file:///c:/Users/Triple%20D/Desktop/The%20Nebula%20House/js/chapter-room-config.js), change:
```javascript
window.CHAPTER_ROOM_CONFIG = {
  enabled: false, // <-- Takes Chapter Room offline immediately
```
This instantly renders a branded maintenance notice to anyone visiting `/chapter-room/*` while keeping the rest of The Nebula House operating normally.

### Complete Schema Rollback SQL:
To cleanly remove all Chapter Room database objects without touching existing site tables:
```sql
DROP TABLE IF EXISTS "cr_reports" CASCADE;
DROP TABLE IF EXISTS "cr_reactions" CASCADE;
DROP TABLE IF EXISTS "cr_comments" CASCADE;
DROP TABLE IF EXISTS "cr_reading_plans" CASCADE;
DROP TABLE IF EXISTS "cr_shelf_items" CASCADE;
DROP TABLE IF EXISTS "cr_reading_progress" CASCADE;
DROP TABLE IF EXISTS "cr_chapters" CASCADE;
DROP TABLE IF EXISTS "cr_books" CASCADE;
```

---

## 4. Backend Deployment (Railway / Node API)

1. Merge `chapter-room` branch into `master` on `the-nebula-house-backend` (or deploy branch directly).
2. Railway will trigger the build pipeline:
   - `npm install`
   - `npx prisma generate`
   - `node server.js`
3. Verify backend health endpoint:
   ```bash
   curl -I https://api.thenebulahouse.com/api/chapter-room/books
   ```
   Should return `HTTP/1.1 200 OK`.

---

## 5. Frontend Deployment (Vercel)

1. Push or merge branch `chapter-room` to `the-nebula-house-website`.
2. Vercel automatically deploys the static files.

---

## 6. Post-Launch Smoke Tests (Run immediately on Live Site)

Verify each of these 6 critical paths:

1. **Homepage Load:**
   - Navigate to `https://thenebulahouse.com/chapter-room/index.html`.
   - Verify Book of the Month (*Notes from Underground*) hero displays with photographic 2:3 cover.
2. **Server-Enforced Spoiler Protection:**
   - Open Chapter 1: loads 200 OK with reading panel, summary, and key ideas.
   - Open Chapter 2 directly via URL: verify server returns **403 Forbidden** with message: *"Chapter 2 is locked. Complete Chapter 1 to unlock."* Zero summary or discussion leaked.
3. **Sequential Unlocking:**
   - Mark Chapter 1 Complete.
   - Refresh Chapter 2: verify Chapter 2 is now unlocked and accessible.
4. **Discussions & Thoughtful Reactions:**
   - Post a thought on Chapter 1.
   - Tap "Interesting" or "Made me think": verify reaction counter increments and persists.
5. **Theme Switching:**
   - Tap "Cream Theme": verify background switches to `#F0EBE0` with `#1A1A1A` ink.
   - Refresh the page: verify theme choice persists in `localStorage`.
6. **Admin Moderation Queue:**
   - Log into `the-admin-room.html#cr-moderation` with an admin account.
   - Verify report queue loads and moderation actions (Hide/Dismiss) work.

---

## 7. Flipping the Public Launch Flag

When smoke tests pass and you are ready to reveal Chapter Room to all readers:

1. **Remove Robots Noindex:**
   Remove `<meta name="robots" content="noindex, nofollow">` from `chapter-room/*.html`.
2. **Connect Marketing Landing Page:**
   In `the-chapter-room.html`, update the primary CTA button from anchor to:
   ```html
   <a href="chapter-room/index.html" class="btn btn--filled">Enter Chapter Room</a>
   ```
3. **Add to Site Header:**
   In `js/components.js`, add `The Chapter Room` link to the primary site navigation dropdown.
