-- ========================================================================
-- THE NEBULA HOUSE — CHAPTER ROOM STAGING SEED DATA
-- Pre-populates Books, Chapters, and Three Reader Personas
-- ========================================================================

-- 1. Insert Book: Notes from Underground
INSERT INTO "cr_books" (
    "id", "slug", "title", "author", "year", "genre", "genres",
    "coverImage", "readingTime", "chapterCount", "difficulty", "difficultyNote",
    "recommendRate", "isBotm", "botmMonth", "tagline", "description", "whyWeAreReading"
) VALUES (
    'b100-notes-from-underground',
    'notes-from-underground',
    'Notes from Underground',
    'Fyodor Dostoevsky',
    1864,
    'Philosophy',
    'Philosophy, Fiction, Classics',
    '../assets/images/notes-from-underground.jpg',
    '3.5 hrs',
    6,
    'Challenging',
    'Take your time with this one',
    92,
    true,
    'October 2026',
    'An unflinching probe into spite, free will, and the limits of rationalism.',
    'A dark, introspective novella questioning rationality, free will, and the contradictions of human nature.',
    'In an age of algorithmic certainty, Dostoevsky reminds us that human consciousness is stubbornly irrational and refuses mathematical reduction.'
) ON CONFLICT ("id") DO NOTHING;

-- 2. Insert Chapters for Notes from Underground
INSERT INTO "cr_chapters" ("id", "bookId", "number", "title", "readingTime", "readingPanelText", "summary", "keyIdeas", "discussionPrompt")
VALUES
(
    'ch-nfu-1',
    'b100-notes-from-underground',
    1,
    'Part I: Underground — Sections I to IV',
    '22 min read',
    'I am a sick man... I am a spiteful man. I am an unattractive man. I believe my liver is diseased...',
    'The narrator introduces himself from his basement, waging war against rational egoism.',
    '["Spite as an existential assertion of free will", "Hyper-consciousness as paralysis", "The critique of the man of action"]',
    'Why does the narrator refuse medical treatment even knowing it harms him?'
),
(
    'ch-nfu-2',
    'b100-notes-from-underground',
    2,
    'Part I: Underground — Sections V to IX',
    '26 min read',
    'You see, gentlemen, reason is an excellent thing... but reason is nothing but reason...',
    'The philosophical core: Dostoevsky attacks the Crystal Palace and 2+2=4.',
    '["The Crystal Palace as rational utopia", "Human right to choose chaos", "The limits of mathematical certainty"]',
    'Do you agree that people will deliberately ruin their lives just to prove they are free?'
),
(
    'ch-nfu-3',
    'b100-notes-from-underground',
    3,
    'Part I: Underground — Sections X to XI',
    '18 min read',
    'I have been living like this a long time—twenty years. Now I am forty...',
    'The intellectual dead end and transition to memories of youth.',
    '["Longing for the unattainable ideal", "Memory as psychological proof"]',
    'Why does the underground man remain in his basement rather than compromise?'
)
ON CONFLICT ("id") DO NOTHING;

-- 3. Persona 1: New Reader (On Chapter 1; Chapters 2-6 locked)
-- ID: persona-new-reader
INSERT INTO "cr_reading_progress" ("id", "userId", "bookId", "currentChapter", "completedChapters", "status")
VALUES ('prog-p1', 'persona-new-reader', 'b100-notes-from-underground', 1, '[]', 'currently-reading')
ON CONFLICT ("userId", "bookId") DO NOTHING;

-- 4. Persona 2: Reader on Chapter 3 (Completed Chapters 1 & 2; Chapter 3 unlocked; 4-6 locked)
-- ID: persona-ch3-reader
INSERT INTO "cr_reading_progress" ("id", "userId", "bookId", "currentChapter", "completedChapters", "status")
VALUES ('prog-p2', 'persona-ch3-reader', 'b100-notes-from-underground', 3, '[1, 2]', 'currently-reading')
ON CONFLICT ("userId", "bookId") DO NOTHING;

-- 5. Persona 3: Finished Reader (Completed all chapters with recorded reflection)
-- ID: persona-finished-reader
INSERT INTO "cr_reading_progress" ("id", "userId", "bookId", "currentChapter", "completedChapters", "status", "wouldRecommend", "reflection")
VALUES (
    'prog-p3',
    'persona-finished-reader',
    'b100-notes-from-underground',
    6,
    '[1, 2, 3, 4, 5, 6]',
    'finished',
    true,
    'The narrator’s confrontation with Liza broke my heart. Intellectual vanity is the loneliest disease in the world.'
)
ON CONFLICT ("userId", "bookId") DO NOTHING;
