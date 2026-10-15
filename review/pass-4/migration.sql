-- ========================================================================
-- THE NEBULA HOUSE — CHAPTER ROOM ADDITIVE MIGRATION SQL
-- Safe, additive migration for PostgreSQL / Prisma
-- Does not touch, alter, or drop any existing table columns
-- ========================================================================

-- 1. Create Books Table
CREATE TABLE IF NOT EXISTS "cr_books" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "year" INTEGER,
    "genre" TEXT NOT NULL,
    "genres" TEXT,
    "coverImage" TEXT,
    "readingTime" TEXT NOT NULL,
    "chapterCount" INTEGER NOT NULL DEFAULT 1,
    "difficulty" TEXT NOT NULL,
    "difficultyNote" TEXT,
    "recommendRate" INTEGER NOT NULL DEFAULT 90,
    "isBotm" BOOLEAN NOT NULL DEFAULT false,
    "botmMonth" TEXT,
    "tagline" TEXT,
    "description" TEXT NOT NULL,
    "whyWeAreReading" TEXT,
    "keyThemes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_books_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "cr_books_slug_key" ON "cr_books"("slug");

-- 2. Create Chapters Table
CREATE TABLE IF NOT EXISTS "cr_chapters" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "readingTime" TEXT NOT NULL,
    "readingPanelText" TEXT,
    "summary" TEXT NOT NULL,
    "keyIdeas" TEXT,
    "discussionPrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_chapters_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_chapters_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "cr_books"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "cr_chapters_bookId_number_key" ON "cr_chapters"("bookId", "number");

-- 3. Create Reading Progress Table (Sequential Unlocking State)
CREATE TABLE IF NOT EXISTS "cr_reading_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "currentChapter" INTEGER NOT NULL DEFAULT 1,
    "completedChapters" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'currently-reading',
    "abandonReason" TEXT,
    "reflection" TEXT,
    "wouldRecommend" BOOLEAN,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_reading_progress_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_reading_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cr_reading_progress_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "cr_books"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "cr_reading_progress_userId_bookId_key" ON "cr_reading_progress"("userId", "bookId");

-- 4. Create Shelf Items Table (5 Categories)
CREATE TABLE IF NOT EXISTS "cr_shelf_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "shelf" TEXT NOT NULL, -- 'currentlyReading', 'nextUp', 'wishlist', 'finished', 'abandoned'
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_shelf_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_shelf_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cr_shelf_items_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "cr_books"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "cr_shelf_items_userId_bookId_key" ON "cr_shelf_items"("userId", "bookId");

-- 5. Create Reading Plans Table
CREATE TABLE IF NOT EXISTS "cr_reading_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "frequency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_reading_plans_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_reading_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cr_reading_plans_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "cr_books"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Create Comments Table (Strictly Chapter-Bound)
CREATE TABLE IF NOT EXISTS "cr_comments" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "authorId" TEXT,
    "guestName" TEXT,
    "text" TEXT NOT NULL,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "spoilerSummary" TEXT,
    "parentId" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_comments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_comments_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "cr_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cr_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cr_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "cr_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cr_comments_chapterId_idx" ON "cr_comments"("chapterId");

-- 7. Create Reactions Table (No vanity likes; 4 thoughtful reactions)
CREATE TABLE IF NOT EXISTS "cr_reactions" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT,
    "guestId" TEXT,
    "type" TEXT NOT NULL, -- 'interesting', 'madeMeThink', 'excellentPoint', 'iDisagree'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cr_reactions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_reactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "cr_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cr_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "cr_reactions_commentId_userId_type_key" ON "cr_reactions"("commentId", "userId", "type");
CREATE UNIQUE INDEX IF NOT EXISTS "cr_reactions_commentId_guestId_type_key" ON "cr_reactions"("commentId", "guestId", "type");

-- 8. Create Moderation Reports Table (6 categories)
CREATE TABLE IF NOT EXISTS "cr_reports" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "reporterId" TEXT,
    "category" TEXT NOT NULL, -- 'Spoilers without tag', 'Harassment or hate speech', 'Off-topic / Spam', 'Inappropriate content', 'Plagiarism', 'Low-effort trolling'
    "details" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'WARNED', 'HIDDEN', 'DELETED', 'SUSPENDED', 'BANNED', 'DISMISSED'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "cr_reports_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "cr_reports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "cr_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cr_reports_status_idx" ON "cr_reports"("status");
