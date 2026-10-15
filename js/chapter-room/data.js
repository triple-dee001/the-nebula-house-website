/**
 * CHAPTER ROOM — DATA ACCESS & PROGRESSION ENGINE
 * Single source of truth for books, chapters, discussions, and reader progression.
 * Strict spoiler enforcement: locked chapters NEVER yield summaries, key ideas, or comments.
 */

window.CRData = (function () {
  'use strict';

  var STORAGE_PROGRESS_KEY = 'cr_reader_progress';
  var STORAGE_SHELF_KEY = 'cr_reader_shelf';
  var STORAGE_COMMENTS_KEY = 'cr_reader_comments';

  // 1. Curated Books Collection
  var BOOKS = [
    {
      id: 'notes-from-underground',
      title: 'Notes from Underground',
      author: 'Fyodor Dostoevsky',
      year: 1864,
      genre: 'Philosophy',
      genres: ['Philosophy', 'Fiction', 'Classics'],
      cover: '../assets/images/notes-from-underground.jpg',
      readingTime: '3.5 hrs',
      chapterCount: 6,
      difficulty: 'Challenging',
      difficultyNote: 'Take your time with this one',
      recommendRate: 92,
      isBotm: true,
      botmMonth: 'October 2026',
      tagline: 'An unflinching probe into spite, free will, and the limits of rationalism.',
      description: 'A dark, introspective novella that explores the mind of a bitter, isolated man in conflict with society and himself. Through sharp irony and psychological depth, it questions rationality, free will, and the contradictions of human nature.',
      whyWeAreReading: 'In an age dominated by algorithmic optimization and neat self-help formulas, Dostoevsky’s underground man reminds us that human consciousness is stubbornly irrational, fiercely protective of free choice, and impossible to reduce to mathematical equations.',
      keyThemes: ['Rational Egoism vs Irrational Free Will', 'The Crystal Palace & Anti-Utopianism', 'Spite as Self-Preservation', 'Isolation and Inability to Love'],
      readingSchedule: [
        { week: 'Week 1', label: 'Part I: Underground (Ch. 1–3)', goal: 'Examine the underground man’s philosophical rebellion against 2+2=4.' },
        { week: 'Week 2', label: 'Part II: Wet Snow (Ch. 4–6)', goal: 'Observe the psychological collapse when philosophy collides with real people.' }
      ]
    },
    {
      id: 'the-metamorphosis',
      title: 'The Metamorphosis',
      author: 'Franz Kafka',
      year: 1915,
      genre: 'Fiction',
      genres: ['Fiction', 'Classics'],
      cover: '',
      readingTime: '2.5 hrs',
      chapterCount: 3,
      difficulty: 'Intermediate',
      difficultyNote: 'Absurd yet profoundly human',
      recommendRate: 89,
      isBotm: false,
      tagline: 'A startling portrait of alienation, duty, and human conditional affection.',
      description: 'Gregor Samsa wakes one morning from uneasy dreams to find himself transformed into a monstrous insect. What follows is a quiet, devastating examination of familial guilt, economic utility, and existential solitude.',
      whyWeAreReading: 'Kafka dissects the tragic truth of modern labor: what happens to our value in the eyes of those we love when we can no longer produce?',
      keyThemes: ['The Burden of Economic Utility', 'Alienation and Bodily Disconnection', 'The Fragility of Familial Love', 'Guilt and Transformation']
    },
    {
      id: 'mans-search-for-meaning',
      title: 'Man’s Search for Meaning',
      author: 'Viktor E. Frankl',
      year: 1946,
      genre: 'Memoir',
      genres: ['Memoir', 'Philosophy', 'Non-Fiction'],
      cover: '',
      readingTime: '4.0 hrs',
      chapterCount: 4,
      difficulty: 'Getting Started',
      difficultyNote: 'Accessible and deeply moving',
      recommendRate: 98,
      isBotm: false,
      tagline: 'The classic memoir of finding transcendent purpose amidst unfathomable suffering.',
      description: 'Psychiatrist Viktor Frankl’s memoir of surviving Auschwitz and Dachau, coupled with his development of logotherapy—the belief that human beings are driven primarily by a search for purpose rather than pleasure or power.',
      whyWeAreReading: 'Frankl offers timeless wisdom on human dignity: everything can be taken from a person except the last of the human freedoms—to choose one’s attitude in any given set of circumstances.',
      keyThemes: ['Logotherapy and Meaning', 'Suffering as a Task', 'The Unconquerable Inner Freedom', 'Responsibility to Life']
    },
    {
      id: 'meditations',
      title: 'Meditations',
      author: 'Marcus Aurelius',
      year: 180,
      genre: 'Philosophy',
      genres: ['Philosophy', 'Classics', 'Non-Fiction'],
      cover: '../assets/images/notes-from-underground.jpg',
      readingTime: '4.5 hrs',
      chapterCount: 12,
      difficulty: 'Intermediate',
      difficultyNote: 'Best read one reflection per day',
      recommendRate: 95,
      isBotm: false,
      tagline: 'Private diary entries on discipline, mortality, and duty from Rome’s philosopher emperor.',
      description: 'Never intended for publication, Meditations is a spiritual notebook written by Roman Emperor Marcus Aurelius on campaign along the Danube frontier. It remains history’s most intimate portrait of Stoic mindfulness in action.',
      whyWeAreReading: 'Marcus Aurelius does not lecture; he counsels himself against anger, vanity, and fatigue. It is a masterclass in mental resilience under the weight of imperial obligation.',
      keyThemes: ['The Dichotomy of Control', 'Transience and Mortality', 'Cosmic Duty and Service', 'Inner Citadel']
    },
    {
      id: 'the-book-of-job',
      title: 'The Book of Job',
      author: 'Biblical Wisdom',
      year: -500,
      genre: 'Classics',
      genres: ['Classics', 'Philosophy', 'Religion'],
      cover: '',
      readingTime: '3.0 hrs',
      chapterCount: 5,
      difficulty: 'Challenging',
      difficultyNote: 'Wrestling with unjust suffering',
      recommendRate: 88,
      isBotm: false,
      tagline: 'The ancient dialogue that refuses easy answers to innocent affliction.',
      description: 'An ancient literary masterpiece that explores the suffering of a righteous man who loses his children, health, and wealth, interrogating justice, moral theology, and the mystery of divine order beyond human comprehension.',
      whyWeAreReading: 'Job refuses the platitudes of his theological friends who insist he must have sinned. It is a profound defense of human integrity and honest lament in the face of inscrutable calamity.',
      keyThemes: ['The Rejection of Retribution Theology', 'Integrity in Grief', 'The Limits of Human Justice', 'The Whirlwind Speeches']
    },
    {
      id: 'the-stranger',
      title: 'The Stranger',
      author: 'Albert Camus',
      year: 1942,
      genre: 'Philosophy',
      genres: ['Philosophy', 'Fiction'],
      cover: '',
      readingTime: '3.2 hrs',
      chapterCount: 6,
      difficulty: 'Intermediate',
      difficultyNote: 'A masterclass in existential clarity',
      recommendRate: 91,
      isBotm: false,
      tagline: 'An unflinching confrontation with social pretense and cosmic indifference.',
      description: 'Through the absurd story of Meursault, a detached clerk who refuses to lie about his feelings or weep at his mother’s funeral, Camus examines the confrontation between the human desire for significance and an indifferent universe.',
      whyWeAreReading: 'Camus forces us to ask: do we value authenticity, or do we merely punish those who refuse to perform society’s expected emotional scripts?',
      keyThemes: ['The Absurd', 'Sensory Presence vs Social Ritual', 'Refusal to Lie', 'Benign Indifference of the Universe']
    }
  ];

  // 2. Curated Chapters for "Notes from Underground"
  var CHAPTERS = {
    'notes-from-underground': [
      {
        number: 1,
        title: 'Part I: Underground — Sections I to IV',
        readingTime: '22 min read',
        readingPanelText: 'I am a sick man... I am a spiteful man. I am an unattractive man. I believe my liver is diseased. However, I know nothing at all about my disease, and do not know for certain what ails me. I don’t consult a doctor for it, and never have, though I have a respect for medicine and doctors.\n\nBesides, I am extremely superstitious, sufficiently so to respect medicine, anyway (I am well-educated enough not to be superstitious, but I am superstitious). No, I refuse to consult a doctor from spite. That you probably will not understand. Well, I understand it, though. Of course, I can’t explain who it is precisely that I am mortifying in this case by my spite: I am perfectly well aware that I cannot "pay out" the doctors by not consulting them; I know better than any one that by all this I am only injuring myself and no one else. But still, if I don’t consult a doctor it is from spite. My liver is bad, well—let it get worse!\n\nI have been living like this a long time—twenty years. Now I am forty. I used to be in the government service, but am no longer. I was a spiteful civil servant. I was rude and took pleasure in being so. I did not take bribes, you see, so I was bound to find a recompense in that, at least.',
        summary: 'The narrator introduces himself from his solitary basement dwelling in St. Petersburg. He dissects his deliberate self-sabotage, refusing medical care out of sheer spite, and establishes his war against nineteenth-century utilitarianism.',
        keyIdeas: [
          'Spite as an existential assertion: The narrator chooses physical suffering over rational obedience to doctors.',
          'Hyper-consciousness as paralysis: The overly self-aware person thinks through every consequence and becomes incapable of simple action.',
          'The critique of the "man of action": Active people act only because they mistake secondary causes for primary foundations.'
        ],
        discussionPrompt: 'Why does the narrator insist on refusing medical treatment even though he admits it only harms himself? Is his spite childish, or an extreme defense of human freedom?'
      },
      {
        number: 2,
        title: 'Part I: Underground — Sections V to IX',
        readingTime: '26 min read',
        readingPanelText: 'You see, gentlemen, reason is an excellent thing, there’s no disputing that, but reason is nothing but reason and satisfies only the rational side of man’s nature, while will is a manifestation of the whole life, that is, of the whole human life, including reason and all the impulses.\n\nAnd although our life, in this manifestation of it, is often worthless, yet it is life and not simply extracting square roots. Here I, for instance, quite naturally want to live, in order to satisfy all my capacities for life, and not simply my capacity for reasoning, that is, not simply one-twentieth of my capacity for life.\n\nWhat does reason know? Reason only knows what it has succeeded in learning (some things, perhaps, it will never learn; this is a poor comfort, but why not say so frankly?) and human nature acts as a whole, with everything that is in it, consciously or unconsciously, and, even if it goes wrong, it lives.',
        summary: 'The philosophical core of the book. Dostoevsky attacks the utopian socialist concept of the "Crystal Palace" and the notion that mathematical logic ($2 \\times 2 = 4$) can eliminate human malice and suffering.',
        keyIdeas: [
          'The Crystal Palace: An architectural metaphor for a completely rationalized, predictable, and engineered human utopia.',
          'The right to irrationality: Humanity will choose destruction and chaos simply to prove it is not an organ stop or piano key.',
          'The tyranny of 2+2=4: Mathematical certainty is the beginning of death because it leaves no room for human will.'
        ],
        discussionPrompt: 'Do you agree with Dostoevsky that people will deliberately ruin their own lives just to prove they are free agents rather than predictable machines?'
      },
      {
        number: 3,
        title: 'Part I: Underground — Sections X to XI',
        readingTime: '18 min read',
        summary: 'The narrator reflects on the despair of his own intellectual dead end. He concludes that while he hates the Crystal Palace, he has nothing better to offer than his spiteful underground cell.',
        keyIdeas: [
          'The longing for an impossible ideal: The narrator admits he wants something higher than his basement, but refuses any counterfeit utopia.',
          'Transition to narrative memory: He decides to record real events from sixteen years earlier when he was twenty-four.'
        ],
        discussionPrompt: 'If the narrator recognizes his basement is miserable, why does he remain there rather than compromise with the imperfect world outside?'
      },
      {
        number: 4,
        title: 'Part II: A Propos of the Wet Snow — Sections I to III',
        readingTime: '28 min read',
        summary: 'Flashback to his youth. The narrator recounts his obsession with an officer who shoved him in a tavern, and his ridiculous, months-long planning to bump shoulders with him on the Nevsky Prospect.',
        keyIdeas: [
          'The humiliation of social invisibility: The narrator is tormented not by physical injury, but by being treated like an inanimate obstacle.',
          'Literary vanity: His fantasies of vengeance are drawn entirely from Romantic literature, clashing pathetically with mundane reality.'
        ],
        discussionPrompt: 'Why does the narrator expend so much energy on someone who doesn’t even remember him?'
      },
      {
        number: 5,
        title: 'Part II: A Propos of the Wet Snow — Sections IV to VI',
        readingTime: '32 min read',
        summary: 'The narrator forces his way into a farewell dinner for an acquaintance named Zverkov. He insults the guests, paces silently for hours in sullen humiliation, and ends up following them to a brothel.',
        keyIdeas: [
          'Social masochism: He stays at a dinner where he is openly despised because leaving would grant his hosts relief.',
          'The collision between intellectual pride and social awkwardness.'
        ],
        discussionPrompt: 'What drives the underground man to torment both himself and others in social settings?'
      },
      {
        number: 6,
        title: 'Part II: A Propos of the Wet Snow — Sections VII to X',
        readingTime: '35 min read',
        summary: 'The climax with Liza. After delivering a theatrical sermon on her degradation, she arrives at his impoverished apartment out of genuine love. Incapable of vulnerability, he abuses and expels her.',
        keyIdeas: [
          'Tyranny over intimacy: For the underground man, love cannot exist as mutual care; it can only exist as domination or submission.',
          'The ultimate tragedy: Liza understands his misery and pities him, which deals the fatal wound to his intellectual vanity.'
        ],
        discussionPrompt: 'Why is Liza’s compassionate embrace more terrifying to the narrator than all the insults of his former schoolmates?'
      }
    ]
  };

  // 3. Discussion Comments Dataset (Tagged strictly to chapters)
  var INITIAL_COMMENTS = {
    'notes-from-underground-1': [
      {
        id: 'c101',
        bookId: 'notes-from-underground',
        chapterNumber: 1,
        author: 'Marcus Vance',
        time: '3 hours ago',
        text: 'Notice how the underground man explicitly refuses to be seen by a doctor out of spite. His illness is not purely bodily; it is an existential assertion against the medicalized rationality of 19th-century positivism.',
        isSpoiler: false,
        reactions: { interesting: 14, madeMeThink: 9, excellentPoint: 7, iDisagree: 1, userReactions: ['madeMeThink'] },
        replies: [
          {
            id: 'c101-r1',
            bookId: 'notes-from-underground',
            chapterNumber: 1,
            author: 'Elena Vance',
            time: '1 hour ago',
            text: 'Exactly. If he allows the doctor to cure him, he admits that he is an organic machine that can be tuned by science, rather than a free soul.',
            isSpoiler: false,
            reactions: { interesting: 8, madeMeThink: 4, excellentPoint: 6, iDisagree: 0, userReactions: [] }
          }
        ]
      },
      {
        id: 'c102',
        bookId: 'notes-from-underground',
        chapterNumber: 1,
        author: 'Dr. Sarah Lin',
        time: 'Yesterday',
        text: 'The distinction he draws between the "man of acute consciousness" and the "man of action" is brilliant. Action requires blind faith in a simple premise; deep reflection reveals infinite regress.',
        isSpoiler: false,
        reactions: { interesting: 21, madeMeThink: 15, excellentPoint: 12, iDisagree: 2, userReactions: [] },
        replies: []
      }
    ],
    'notes-from-underground-2': [
      {
        id: 'c201',
        bookId: 'notes-from-underground',
        chapterNumber: 2,
        author: 'Gabriel Osei',
        time: '5 hours ago',
        text: 'The rejection of 2x2=4 is Dostoevsky’s finest paragraph. Utopias fail because human beings would rather stick gold pins into themselves than surrender the unpredictability of their own desires.',
        isSpoiler: false,
        reactions: { interesting: 29, madeMeThink: 18, excellentPoint: 22, iDisagree: 3, userReactions: ['interesting'] },
        replies: []
      },
      {
        id: 'c202',
        bookId: 'notes-from-underground',
        chapterNumber: 2,
        author: 'Sophia Chen',
        time: 'Yesterday',
        text: 'The Crystal Palace was London’s 1851 Great Exhibition building. Dostoevsky visited it and was horrified: he saw human beings worshiping the machine.',
        isSpoiler: false,
        reactions: { interesting: 16, madeMeThink: 11, excellentPoint: 14, iDisagree: 0, userReactions: [] },
        replies: []
      }
    ]
  };

  // 4. Persistence Helpers
  function getStoredProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
      return raw ? JSON.parse(raw) : {
        'notes-from-underground': {
          currentChapter: 2,
          completedChapters: [1],
          status: 'currently-reading',
          startedAt: '2026-10-10'
        }
      };
    } catch (e) {
      return {};
    }
  }

  function saveStoredProgress(progress) {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {}
  }

  function getStoredShelf() {
    try {
      var raw = localStorage.getItem(STORAGE_SHELF_KEY);
      return raw ? JSON.parse(raw) : {
        currentlyReading: ['notes-from-underground'],
        nextUp: ['the-metamorphosis'],
        wishlist: ['mans-search-for-meaning', 'meditations'],
        finished: ['the-stranger'],
        abandoned: []
      };
    } catch (e) {
      return { currentlyReading: [], nextUp: [], wishlist: [], finished: [], abandoned: [] };
    }
  }

  function saveStoredShelf(shelf) {
    try {
      localStorage.setItem(STORAGE_SHELF_KEY, JSON.stringify(shelf));
    } catch (e) {}
  }

  function getStoredComments() {
    try {
      var raw = localStorage.getItem(STORAGE_COMMENTS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_COMMENTS;
    } catch (e) {
      return INITIAL_COMMENTS;
    }
  }

  function saveStoredComments(comments) {
    try {
      localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(comments));
    } catch (e) {}
  }

  // 5. Public API Methods
  function getAllBooks() {
    return BOOKS.slice();
  }

  function getBookById(id) {
    for (var i = 0; i < BOOKS.length; i++) {
      if (BOOKS[i].id === id) return BOOKS[i];
    }
    return null;
  }

  function getBookOfTheMonth() {
    for (var i = 0; i < BOOKS.length; i++) {
      if (BOOKS[i].isBotm) return BOOKS[i];
    }
    return BOOKS[0];
  }

  function getBooksByGenre(genre) {
    if (!genre || genre.toLowerCase() === 'all') return BOOKS.slice();
    var target = genre.toLowerCase();
    return BOOKS.filter(function (b) {
      return b.genres.some(function (g) { return g.toLowerCase() === target; });
    });
  }

  function getReaderProgress(bookId) {
    var prog = getStoredProgress();
    return prog[bookId] || { currentChapter: 1, completedChapters: [], status: 'not-started' };
  }

  /**
   * Sequential Chapter Unlock Check:
   * Chapter 1 is always unlocked.
   * Chapter N is unlocked ONLY if Chapter N-1 is in completedChapters.
   */
  function isChapterUnlocked(bookId, chapterNum) {
    chapterNum = parseInt(chapterNum, 10);
    if (chapterNum <= 1) return true;
    var progress = getReaderProgress(bookId);
    var completed = progress.completedChapters || [];
    return completed.indexOf(chapterNum - 1) !== -1;
  }

  /**
   * Safe Chapter Content Delivery:
   * If chapter is locked, STRICT SPOILER DEFENSE:
   * Summary, key ideas, and comments are NULLIFIED.
   */
  function getChapterContent(bookId, chapterNum) {
    chapterNum = parseInt(chapterNum, 10);
    var bookChapters = CHAPTERS[bookId] || [];
    var chapter = null;
    for (var i = 0; i < bookChapters.length; i++) {
      if (bookChapters[i].number === chapterNum) {
        chapter = bookChapters[i];
        break;
      }
    }

    if (!chapter) return null;

    var unlocked = isChapterUnlocked(bookId, chapterNum);
    var progress = getReaderProgress(bookId);
    var isCompleted = (progress.completedChapters || []).indexOf(chapterNum) !== -1;

    if (!unlocked) {
      // Locked: Return title and number only! No leak.
      return {
        number: chapter.number,
        title: chapter.title,
        readingTime: chapter.readingTime,
        locked: true,
        completed: false,
        summary: null,
        keyIdeas: [],
        discussionPrompt: null,
        comments: [],
        readingPanelText: null
      };
    }

    // Unlocked: Return full payload
    var key = bookId + '-' + chapterNum;
    var commentsMap = getStoredComments();
    var chapterComments = commentsMap[key] || [];

    return {
      number: chapter.number,
      title: chapter.title,
      readingTime: chapter.readingTime,
      locked: false,
      completed: isCompleted,
      summary: chapter.summary,
      keyIdeas: chapter.keyIdeas || [],
      discussionPrompt: chapter.discussionPrompt,
      comments: chapterComments,
      readingPanelText: chapter.readingPanelText
    };
  }

  /**
   * Mark Chapter Complete: Unlocks Chapter N+1 sequentially.
   */
  function markChapterComplete(bookId, chapterNum) {
    chapterNum = parseInt(chapterNum, 10);
    var prog = getStoredProgress();
    if (!prog[bookId]) {
      prog[bookId] = { currentChapter: 1, completedChapters: [], status: 'currently-reading' };
    }
    if (prog[bookId].completedChapters.indexOf(chapterNum) === -1) {
      prog[bookId].completedChapters.push(chapterNum);
    }
    var book = getBookById(bookId);
    if (book && chapterNum < book.chapterCount) {
      prog[bookId].currentChapter = Math.max(prog[bookId].currentChapter, chapterNum + 1);
    }
    saveStoredProgress(prog);

    // Update shelf if not present
    var shelf = getStoredShelf();
    if (shelf.currentlyReading.indexOf(bookId) === -1 && shelf.finished.indexOf(bookId) === -1) {
      shelf.currentlyReading.push(bookId);
      saveStoredShelf(shelf);
    }
    return prog[bookId];
  }

  /**
   * Post Comment to Chapter (Strict Chapter-belonging)
   */
  function addComment(bookId, chapterNum, text, isSpoiler, spoilerSummary) {
    chapterNum = parseInt(chapterNum, 10);
    if (!isChapterUnlocked(bookId, chapterNum)) {
      throw new Error('Cannot comment on a locked chapter.');
    }
    var key = bookId + '-' + chapterNum;
    var commentsMap = getStoredComments();
    if (!commentsMap[key]) commentsMap[key] = [];

    var newComment = {
      id: 'c_' + Date.now(),
      bookId: bookId,
      chapterNumber: chapterNum,
      author: 'You (Reader)',
      time: 'Just now',
      text: text,
      isSpoiler: !!isSpoiler,
      spoilerSummary: spoilerSummary || '',
      reactions: { interesting: 0, madeMeThink: 0, excellentPoint: 0, iDisagree: 0, userReactions: [] },
      replies: []
    };

    commentsMap[key].unshift(newComment);
    saveStoredComments(commentsMap);
    return newComment;
  }

  /**
   * Post Reply to a Comment Thread
   */
  function addReply(bookId, chapterNum, parentCommentId, text) {
    var key = bookId + '-' + chapterNum;
    var commentsMap = getStoredComments();
    var list = commentsMap[key] || [];

    for (var i = 0; i < list.length; i++) {
      if (list[i].id === parentCommentId) {
        var reply = {
          id: 'r_' + Date.now(),
          bookId: bookId,
          chapterNumber: chapterNum,
          author: 'You (Reader)',
          time: 'Just now',
          text: text,
          isSpoiler: false,
          reactions: { interesting: 0, madeMeThink: 0, excellentPoint: 0, iDisagree: 0, userReactions: [] }
        };
        list[i].replies.push(reply);
        saveStoredComments(commentsMap);
        return reply;
      }
    }
    throw new Error('Parent comment not found.');
  }

  /**
   * Toggle Reaction on a Comment or Reply
   */
  function toggleReaction(commentId, reactionId) {
    var commentsMap = getStoredComments();
    for (var key in commentsMap) {
      var list = commentsMap[key];
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === commentId) {
          return applyReaction(list[i], reactionId, commentsMap);
        }
        for (var j = 0; j < (list[i].replies || []).length; j++) {
          if (list[i].replies[j].id === commentId) {
            return applyReaction(list[i].replies[j], reactionId, commentsMap);
          }
        }
      }
    }
    return null;
  }

  function applyReaction(item, reactionId, map) {
    if (!item.reactions) {
      item.reactions = { interesting: 0, madeMeThink: 0, excellentPoint: 0, iDisagree: 0, userReactions: [] };
    }
    var ur = item.reactions.userReactions = item.reactions.userReactions || [];
    var idx = ur.indexOf(reactionId);
    if (idx === -1) {
      ur.push(reactionId);
      item.reactions[reactionId] = (item.reactions[reactionId] || 0) + 1;
    } else {
      ur.splice(idx, 1);
      item.reactions[reactionId] = Math.max(0, (item.reactions[reactionId] || 1) - 1);
    }
    saveStoredComments(map);
    return item.reactions;
  }

  /**
   * Shelf Operations (Currently Reading, Next Up, Wishlist, Finished, Abandoned)
   */
  function getShelf() {
    return getStoredShelf();
  }

  function moveBookOnShelf(bookId, targetShelf) {
    var shelf = getStoredShelf();
    var lists = ['currentlyReading', 'nextUp', 'wishlist', 'finished', 'abandoned'];
    lists.forEach(function (listKey) {
      shelf[listKey] = (shelf[listKey] || []).filter(function (id) { return id !== bookId; });
    });
    if (shelf[targetShelf]) {
      shelf[targetShelf].unshift(bookId);
    }
    saveStoredShelf(shelf);
    return shelf;
  }

  /**
   * Abandon a book with compassion ("You are allowed to abandon a book.")
   */
  function abandonBook(bookId, reason) {
    var shelf = moveBookOnShelf(bookId, 'abandoned');
    var prog = getStoredProgress();
    if (prog[bookId]) {
      prog[bookId].status = 'abandoned';
      prog[bookId].abandonReason = reason || 'Not for me right now';
      prog[bookId].abandonedAt = new Date().toISOString();
      saveStoredProgress(prog);
    }
    return {
      success: true,
      message: 'You are allowed to abandon a book. Life is short, and your shelf is for books that serve you now.',
      shelf: shelf
    };
  }

  /**
   * Finish a book and receive 3 recommendations
   */
  function finishBook(bookId, wouldRecommend, reflection) {
    var shelf = moveBookOnShelf(bookId, 'finished');
    var prog = getStoredProgress();
    var book = getBookById(bookId);
    if (!prog[bookId]) {
      prog[bookId] = { currentChapter: book ? book.chapterCount : 1, completedChapters: [] };
    }
    prog[bookId].status = 'finished';
    prog[bookId].finishedAt = new Date().toISOString();
    prog[bookId].wouldRecommend = !!wouldRecommend;
    prog[bookId].reflection = reflection || '';
    saveStoredProgress(prog);

    // Three handpicked recommendations
    var recs = BOOKS.filter(function (b) { return b.id !== bookId; }).slice(0, 3);

    return {
      book: book,
      wouldRecommend: wouldRecommend,
      reflection: reflection,
      recommendations: recs
    };
  }

  return {
    getAllBooks: getAllBooks,
    getBookById: getBookById,
    getBookOfTheMonth: getBookOfTheMonth,
    getBooksByGenre: getBooksByGenre,
    getReaderProgress: getReaderProgress,
    isChapterUnlocked: isChapterUnlocked,
    getChapterContent: getChapterContent,
    markChapterComplete: markChapterComplete,
    addComment: addComment,
    addReply: addReply,
    toggleReaction: toggleReaction,
    getShelf: getShelf,
    moveBookOnShelf: moveBookOnShelf,
    // Backend API Sync Integration (Pass 4)
    syncWithBackend: async function () {
      try {
        var base = (window.API_BASE || '') + '/api/chapter-room';
        var res = await fetch(base + '/books');
        if (res.ok) {
          var data = await res.json();
          return { online: true, books: data.books };
        }
      } catch (err) {
        // Graceful offline fallback
      }
      return { online: false, books: getAllBooks() };
    },

    fetchChapterApi: async function (bookId, chapterNumber) {
      try {
        var base = (window.API_BASE || '') + '/api/chapter-room';
        var token = localStorage.getItem('token');
        var headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;
        var res = await fetch(base + '/books/' + encodeURIComponent(bookId) + '/chapters/' + chapterNumber, { headers: headers });
        var data = await res.json();
        return { status: res.status, data: data };
      } catch (err) {
        return { status: 500, error: err.message };
      }
    }
  };
})();

