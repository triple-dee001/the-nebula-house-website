/**
 * CHAPTER ROOM — DATA ACCESS & PROGRESSION ENGINE
 * Single source of truth for books, chapters, discussions, and reader progression.
 * Strict spoiler enforcement: locked chapters NEVER yield summaries, key ideas, or comments.
 * Aligned with The Chapter Room Product, UX & Functional Requirements Document.
 */

window.CRData = (function () {
  'use strict';

  var STORAGE_PROGRESS_KEY = 'cr_reader_progress';
  var STORAGE_SHELF_KEY = 'cr_reader_shelf';
  var STORAGE_COMMENTS_KEY = 'cr_reader_comments';
  var STORAGE_PLANS_KEY = 'cr_reader_plans';
  var STORAGE_READERS_KEY = 'cr_reader_profiles';

  // =========================================================================
  // 1. Curated Books Collection (Organized by 4 Primary Genres & Themes)
  // =========================================================================
  var BOOKS = [
    {
      id: 'notes-from-underground',
      title: 'Notes from Underground',
      author: 'Fyodor Dostoevsky',
      year: 1864,
      genre: 'Philosophy',
      genres: ['Philosophy', 'Fiction', 'Classics'],
      themes: ['Freedom', 'Human Nature', 'Identity', 'Power', 'Meaning'],
      cover: '../assets/images/notes-from-underground.jpg',
      readingTime: '3.5 hrs',
      dailyEstimate: 'Approximately 20 minutes/day for 10 days',
      chapterCount: 6,
      difficulty: 'Challenging',
      difficultyNote: 'Take your time with this one. There is no need to rush.',
      recommendRate: 92,
      isBotm: true,
      botmMonth: 'October 2026',
      tagline: 'An unflinching probe into spite, free will, and the limits of rationalism.',
      description: 'A dark, introspective novella exploring the mind of a bitter, isolated man in conflict with society and himself. Through sharp irony and psychological depth, it questions rationality, free will, and the contradictions of human nature.',
      generalSummary: 'Notes from Underground is a psychological and philosophical exploration of isolation, consciousness, freedom, and self-contradiction. Written as the confessions of a retired civil servant living in a miserable basement apartment in St. Petersburg, it mounts an impassioned defense of human irrationality against the tidy socialist utopias and mathematical formulas of the nineteenth century.',
      whyWeAreReading: 'In an age dominated by algorithmic optimization and neat self-help formulas, Dostoevsky’s underground man reminds us that human consciousness is stubbornly irrational, fiercely protective of free choice, and impossible to reduce to mathematical equations.',
      keyThemes: ['Rational Egoism vs Irrational Free Will', 'The Crystal Palace & Anti-Utopianism', 'Spite as Self-Preservation', 'Isolation and the Difficulty of Love'],
      readingSchedule: [
        { week: 'Week 1', label: 'Part I: Underground (Ch. 1–3)', goal: 'Examine the underground man’s philosophical rebellion against 2+2=4.' },
        { week: 'Week 2', label: 'Part II: A Propos of the Wet Snow (Ch. 4–6)', goal: 'Observe the psychological collapse when philosophy collides with real human beings.' }
      ]
    },
    {
      id: 'mans-search-for-meaning',
      title: 'Man’s Search for Meaning',
      author: 'Viktor E. Frankl',
      year: 1946,
      genre: 'Non-Fiction',
      genres: ['Non-Fiction', 'Philosophy', 'Memoir'],
      themes: ['Meaning', 'Freedom', 'Human Nature', 'Death'],
      cover: '',
      readingTime: '4.0 hrs',
      dailyEstimate: 'Approximately 25 minutes/day for 8 days',
      chapterCount: 4,
      difficulty: 'Getting Started',
      difficultyNote: 'Accessible, compassionate, and life-altering',
      recommendRate: 98,
      isBotm: false,
      tagline: 'The classic memoir of finding transcendent purpose amidst unfathomable suffering.',
      description: 'Psychiatrist Viktor Frankl’s memoir of surviving Auschwitz and Dachau, coupled with his development of logotherapy—the belief that human beings are driven primarily by a search for purpose rather than pleasure or power.',
      generalSummary: 'Frankl argues that even in the most degrading and brutal conditions imaginable, human life never ceases to have meaning. By examining his concentration camp experiences and psychological insights, he shows that while we cannot always choose our circumstances, we always retain the freedom to choose our attitude.',
      whyWeAreReading: 'Frankl offers timeless wisdom on human dignity: everything can be taken from a person except the last of the human freedoms—to choose one’s attitude in any given set of circumstances.',
      keyThemes: ['Logotherapy and the Will to Meaning', 'Suffering as a Moral Task', 'The Unconquerable Inner Freedom', 'Responsibility to Life'],
      readingSchedule: [
        { week: 'Week 1', label: 'Part I: Experiences in a Concentration Camp', goal: 'Walk through the psychological stages of shock, apathy, and inner survival.' },
        { week: 'Week 2', label: 'Part II: Logotherapy in a Nutshell', goal: 'Learn the therapeutic principles of meaning-discovery and tragic optimism.' }
      ]
    },
    {
      id: 'the-prince',
      title: 'The Prince',
      author: 'Niccolò Machiavelli',
      year: 1532,
      genre: 'Non-Fiction',
      genres: ['Non-Fiction', 'Philosophy'],
      themes: ['Power', 'Human Nature', 'History'],
      cover: '',
      readingTime: '3.0 hrs',
      dailyEstimate: 'Approximately 20 minutes/day for 8 days',
      chapterCount: 5,
      difficulty: 'Intermediate',
      difficultyNote: 'Pragmatic, controversial, and brilliant',
      recommendRate: 90,
      isBotm: false,
      tagline: 'An unflinching investigation into statecraft, political power, and human frailty.',
      description: 'Written in exile, Machiavelli’s handbook on power analyzes how leaders actually acquire and maintain control, separating political reality from idealistic moral theory.',
      generalSummary: 'The Prince strips politics of theological and utopian illusions, examining how human power really operates in a turbulent world. Machiavelli advises rulers on virtù, fortuna, the necessity of appearing merciful while acting decisively, and why it is safer to be feared than loved.',
      whyWeAreReading: 'A foundational text of modern political thought that forces readers to examine the tension between private morality and public leadership.',
      keyThemes: ['Virtù and Fortuna', 'The Pragmatism of Power', 'Human Nature and Self-Interest', 'Moral Compromise in Leadership'],
      readingSchedule: [
        { week: 'Week 1', label: 'Chapters 1–3: The Nature of Principalities', goal: 'Analyze how states are acquired and held.' },
        { week: 'Week 2', label: 'Chapters 4–5: Virtù, Fear, and Fortune', goal: 'Investigate the psychology of rule and leadership.' }
      ]
    },
    {
      id: 'the-book-of-job',
      title: 'The Book of Job',
      author: 'Biblical Wisdom',
      year: -500,
      genre: 'Religion',
      genres: ['Religion', 'Philosophy', 'Classics'],
      themes: ['Faith', 'Meaning', 'Death', 'Human Nature'],
      cover: '',
      readingTime: '3.0 hrs',
      dailyEstimate: 'Approximately 20 minutes/day for 7 days',
      chapterCount: 5,
      difficulty: 'Challenging',
      difficultyNote: 'Wrestling with innocent suffering. Take your time.',
      recommendRate: 88,
      isBotm: false,
      tagline: 'The ancient dialogue that refuses easy theological answers to innocent affliction.',
      description: 'An ancient literary masterpiece that explores the suffering of a righteous man who loses his children, health, and wealth, interrogating justice, moral theology, and divine mystery.',
      generalSummary: 'The Book of Job is one of world literature’s deepest inquiries into the problem of evil. Stripped of all blessings, Job refuses the pious rationalizations of his friends and demands an audience with God, leading to the breathtaking Voice from the Whirlwind.',
      whyWeAreReading: 'Job refuses the platitudes of his theological friends who insist he must have sinned. It is a profound defense of human integrity and honest lament in the face of inscrutable calamity.',
      keyThemes: ['The Rejection of Retribution Theology', 'Integrity in Grief', 'The Limits of Human Justice', 'The Whirlwind Speeches'],
      readingSchedule: [
        { week: 'Week 1', label: 'Chapters 1–3: The Calamity and the Dialogues', goal: 'Witness Job’s lament and his friends’ moral dogmatism.' },
        { week: 'Week 2', label: 'Chapters 4–5: The Whirlwind and Epilogue', goal: 'Encounter the cosmic speeches and the vindication of Job’s honesty.' }
      ]
    },
    {
      id: 'confessions',
      title: 'Confessions',
      author: 'Saint Augustine',
      year: 397,
      genre: 'Religion',
      genres: ['Religion', 'Philosophy', 'Non-Fiction'],
      themes: ['Faith', 'Identity', 'Love', 'Meaning', 'Human Nature'],
      cover: '',
      readingTime: '5.5 hrs',
      dailyEstimate: 'Approximately 25 minutes/day for 14 days',
      chapterCount: 6,
      difficulty: 'Intermediate',
      difficultyNote: 'Intimate prayer and spiritual autobiography',
      recommendRate: 93,
      isBotm: false,
      tagline: 'A soul’s restless journey from worldly ambition to transcendent grace.',
      description: 'Augustine recounts his youth, his intellectual struggles with Manichaeism and Neo-Platonism, and his dramatic conversion to Christianity in a Milanese garden.',
      generalSummary: 'Confessions is widely regarded as the first psychological autobiography in Western literature. Augustine addresses God in intimate prayer, examining his boyhood theft of pears, his philosophical wanderings, and the yearning of the restless heart for transcendent peace.',
      whyWeAreReading: 'Augustine captures the universal human longing: "You have made us for yourself, O Lord, and our heart is restless until it rests in you."',
      keyThemes: ['The Restless Heart', 'Grace and Conversion', 'The Psychology of Sin', 'Memory, Time, and Eternity'],
      readingSchedule: [
        { week: 'Week 1', label: 'Chapters 1–3: Youth and Restlessness', goal: 'Explore the restlessness of worldly ambition and desire.' },
        { week: 'Week 2', label: 'Chapters 4–6: Conversion and Garden Scene', goal: 'Witness the turning point: "Take up and read."' }
      ]
    },
    {
      id: 'the-brothers-karamazov',
      title: 'The Brothers Karamazov',
      author: 'Fyodor Dostoevsky',
      year: 1880,
      genre: 'Fiction',
      genres: ['Fiction', 'Philosophy', 'Religion'],
      themes: ['Faith', 'Freedom', 'Love', 'Human Nature', 'Meaning'],
      cover: '',
      readingTime: '18.0 hrs',
      dailyEstimate: 'Approximately 35 minutes/day for 30 days',
      chapterCount: 12,
      difficulty: 'Challenging',
      difficultyNote: 'A monumental spiritual and philosophical journey',
      recommendRate: 97,
      isBotm: false,
      tagline: 'A passionate philosophical novel entering the deepest debates of God, free will, and morality.',
      description: 'Dostoevsky’s final masterpiece centers on the murder of a depraved father and the suspicion cast on his three sons, each representing a different facet of the human spirit: passion, intellect, and faith.',
      generalSummary: 'The Brothers Karamazov is a sprawling theological mystery drama. Across four parts and twelve books, it stages an epic contest between Ivan’s acute intellectual rebellion, Dmitri’s sensual torment, and Alyosha’s quiet spiritual love.',
      whyWeAreReading: 'Contains "The Grand Inquisitor" and "Rebellion", two of the greatest philosophical inquiries into suffering, divine justice, and human freedom ever written.',
      keyThemes: ['Faith vs Rationalism', 'The Burden of Freedom', 'The Grand Inquisitor', 'Universal Moral Responsibility'],
      readingSchedule: [
        { week: 'Weeks 1–2', label: 'Books 1–4: The Family History', goal: 'Meet Old Karamazov, Dmitri, Ivan, and Alyosha at the monastery.' },
        { week: 'Weeks 3–4', label: 'Books 5–8: Pro and Contra & The Grand Inquisitor', goal: 'Engage with Ivan’s challenge to faith and the poem of Christ in Seville.' }
      ]
    },
    {
      id: 'the-metamorphosis',
      title: 'The Metamorphosis',
      author: 'Franz Kafka',
      year: 1915,
      genre: 'Fiction',
      genres: ['Fiction', 'Classics'],
      themes: ['Identity', 'Human Nature', 'Death'],
      cover: '',
      readingTime: '2.5 hrs',
      dailyEstimate: 'Approximately 20 minutes/day for 6 days',
      chapterCount: 3,
      difficulty: 'Intermediate',
      difficultyNote: 'Absurd yet profoundly human',
      recommendRate: 89,
      isBotm: false,
      tagline: 'A startling portrait of alienation, duty, and conditional affection.',
      description: 'Gregor Samsa wakes one morning from uneasy dreams to find himself transformed into a monstrous insect. What follows is a quiet, devastating examination of familial guilt, economic utility, and existential solitude.',
      generalSummary: 'Kafka dissects what happens when a family provider becomes completely incapacitated and repulsive. As Gregor struggles to preserve his human memories, his family slowly retreats into disgust, practical calculation, and eventual indifference.',
      whyWeAreReading: 'Kafka dissects the tragic truth of modern labor: what happens to our value in the eyes of those we love when we can no longer produce?',
      keyThemes: ['The Burden of Economic Utility', 'Alienation and Bodily Disconnection', 'The Fragility of Familial Love', 'Guilt and Transformation'],
      readingSchedule: [
        { week: 'Week 1', label: 'Chapters 1–3: The Awakening and Decline', goal: 'Trace Gregor’s physical alienation and his family’s shifting empathy.' }
      ]
    },
    {
      id: 'meditations',
      title: 'Meditations',
      author: 'Marcus Aurelius',
      year: 180,
      genre: 'Philosophy',
      genres: ['Philosophy', 'Classics', 'Non-Fiction'],
      themes: ['Death', 'Meaning', 'Human Nature', 'Power'],
      cover: '../assets/images/notes-from-underground.jpg',
      readingTime: '4.5 hrs',
      dailyEstimate: 'Approximately 15 minutes/day for 14 days',
      chapterCount: 12,
      difficulty: 'Intermediate',
      difficultyNote: 'Best read one reflection per day',
      recommendRate: 95,
      isBotm: false,
      tagline: 'Private diary entries on discipline, mortality, and duty from Rome’s philosopher emperor.',
      description: 'Never intended for publication, Meditations is a spiritual notebook written by Roman Emperor Marcus Aurelius on campaign along the Danube frontier. It remains history’s most intimate portrait of Stoic mindfulness in action.',
      generalSummary: 'Marcus Aurelius counsels his own soul against pettiness, anger, exhaustion, and pride. He repeatedly meditates on the fleeting nature of fame, the inevitability of death, and the sovereign tranquility of the inner mind.',
      whyWeAreReading: 'Marcus Aurelius does not lecture; he counsels himself against anger, vanity, and fatigue. It is a masterclass in mental resilience under the weight of imperial obligation.',
      keyThemes: ['The Dichotomy of Control', 'Transience and Mortality', 'Cosmic Duty and Service', 'The Inner Citadel'],
      readingSchedule: [
        { week: 'Week 1', label: 'Books 1–6: Duty, Transience, and Gratitude', goal: 'Adopt the morning reminder of human imperfection and inner fortress.' },
        { week: 'Week 2', label: 'Books 7–12: Mortality and Nature', goal: 'Learn to release anxiety over what lies outside your will.' }
      ]
    },
    {
      id: 'the-stranger',
      title: 'The Stranger',
      author: 'Albert Camus',
      year: 1942,
      genre: 'Fiction',
      genres: ['Fiction', 'Philosophy'],
      themes: ['Freedom', 'Death', 'Identity', 'Meaning'],
      cover: '',
      readingTime: '3.2 hrs',
      dailyEstimate: 'Approximately 20 minutes/day for 8 days',
      chapterCount: 6,
      difficulty: 'Intermediate',
      difficultyNote: 'A masterclass in existential clarity',
      recommendRate: 91,
      isBotm: false,
      tagline: 'An unflinching confrontation with social pretense and cosmic indifference.',
      description: 'Through the absurd story of Meursault, a detached clerk who refuses to lie about his feelings or weep at his mother’s funeral, Camus examines the confrontation between the human desire for significance and an indifferent universe.',
      generalSummary: 'Set in Algiers, The Stranger traces Meursault’s straightforward, unadorned sensory existence. After shooting an Arab on a sun-drenched beach, he is tried in court—not merely for the killing, but for his emotional nonconformity and refusal to play society’s sentimental games.',
      whyWeAreReading: 'Camus forces us to ask: do we value authenticity, or do we merely punish those who refuse to perform society’s expected emotional scripts?',
      keyThemes: ['The Absurd', 'Sensory Presence vs Social Ritual', 'Refusal to Lie', 'Benign Indifference of the Universe'],
      readingSchedule: [
        { week: 'Week 1', label: 'Part I: Meursault’s Life and the Beach', goal: 'Examine Meursault’s sensory clarity and indifference to conventions.' },
        { week: 'Week 2', label: 'Part II: The Trial and Condemnation', goal: 'Analyze how society demands theatrical guilt over honest truth.' }
      ]
    }
  ];

  // =========================================================================
  // 2. Curated Chapters & Reading Passages
  // =========================================================================
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
        summary: 'The philosophical core of the book. Dostoevsky attacks the utopian socialist concept of the "Crystal Palace" and the notion that mathematical logic (2 x 2 = 4) can eliminate human malice and suffering.',
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
        readingPanelText: 'You believe in a palace of crystal that can never be destroyed—a palace at which one will not be able to put out one’s tongue nor make a long nose on the sly. And perhaps that is just why I am afraid of this edifice, that it is of crystal and can never be destroyed and that one cannot even put out one’s tongue at it even on the sly.\n\nYou see, if it were not a palace, but a hen-house, I might creep into it to avoid getting wet, and yet I would not call the hen-house a palace out of gratitude to it for keeping me dry. You laugh, you say that, in such circumstances, a hen-house is as good as a mansion. "Yes," I answer, "if one had to live simply to keep out of the rain."\n\nI would rather my hand were cut off than that I should bring one brick to such an edifice! Don’t you see, I am convinced that the underground man is right!',
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
        readingPanelText: 'At that time I was only twenty-four. My life was even then gloomy, ill-regulated, and solitary to the verge of madness. I made friends with no one and even avoided talking, and retreated into my corner more and more.\n\nAt work in the office I never looked at anyone, and was perfectly well aware that my companions looked upon me not only as a queer fellow, but with a sort of loathing. I sometimes wondered why no one else seemed to suspect that they were loathsome, and that I was loathsome to them. I was morbidly sensitive; I was conceited and yet had no self-respect.',
        summary: 'Sixteen years earlier, the young narrator wanders the Nevsky Prospect obsessing over minor social slights, plotting petty vengeance against an officer who bumped into him without noticing.',
        keyIdeas: [
          'The collision between theory and reality: In his room he dreams of heroism; in society he feels invisible and despised.',
          'The duel of the pavement: His absurd obsession with bumping shoulders equally with the officer on the boulevard.'
        ],
        discussionPrompt: 'Why does the narrator place such enormous psychological weight on whether an officer moves aside for him on the sidewalk?'
      },
      {
        number: 5,
        title: 'Part II: A Propos of the Wet Snow — Sections IV to VII',
        readingTime: '32 min read',
        readingPanelText: 'The dinner was taking place at the Hôtel de Paris. I arrived early, pacing like a beast in a cage. When they came, they barely acknowledged my existence. I hated them, and yet I sat at their table for three humiliating hours, pacing up and down in front of them with my boots squeaking.\n\nI wanted to show them that I could do without them, and yet I could not bring myself to leave. Every glance they threw at me cut like a knife into my pride.',
        summary: 'The disastrous farewell dinner for Zverkov. The narrator forces his way into a dinner party with schoolmates who despise him, gets thoroughly drunk, pace-walks in front of them for hours, and follows them to a brothel.',
        keyIdeas: [
          'Masochistic vanity: He deliberately puts himself in situations where humiliation is certain.',
          'The inability to be authentic: He swings wildly between begging for love and wishing to murder his companions.'
        ],
        discussionPrompt: 'Have you ever remained in a social situation that was actively humiliating you? What prevents the narrator from simply walking out?'
      },
      {
        number: 6,
        title: 'Part II: A Propos of the Wet Snow — Sections VIII to X',
        readingTime: '30 min read',
        readingPanelText: 'Liza came to my room. She saw the poverty, the cracked teapot, the miserable torn dressing-gown. She looked at me not with anger, but with compassion. And that compassion was what I could never forgive her for.\n\nI wanted to overpower her, to conquer her, to take revenge on her for my own self-hatred. Love to me was always a battle, a struggle for subjugation. I could not conceive of love as equality.',
        summary: 'The narrator meets Liza, a young prostitute. He delivers an impassioned lecture on the tragedy of her life, inspiring genuine affection in her. But when she visits his squalid apartment, his shame curdles into cruelty.',
        keyIdeas: [
          'Love as power and subjugation: To the narrator, love without domination feels like terrifying vulnerability.',
          'The tragic ending: Liza understands his suffering better than he understands hers, leaving him alone in his basement with endless remorse.'
        ],
        discussionPrompt: 'Why does the narrator turn on Liza at the exact moment she offers him unconditional love and pity? What does this reveal about his psychological trap?'
      }
    ],
    'the-prince': [
      {
        number: 1,
        title: 'Chapters 1 to 5: Types of Principalities',
        readingTime: '24 min read',
        readingPanelText: 'All states, all powers, that have held and hold rule over men have been and are either republics or principalities. Principalities are either hereditary, in which the family has been long established; or they are new.',
        summary: 'Machiavelli establishes his taxonomy of states and investigates how newly acquired principalities can be maintained against rebellion.',
        keyIdeas: ['Hereditary vs New states', 'The difficulty of changing customs', 'Managing newly conquered peoples'],
        discussionPrompt: 'Why does Machiavelli argue that a new ruler faces far greater resistance and distrust than an inherited dynasty?'
      },
      {
        number: 2,
        title: 'Chapters 6 to 9: Virtù, Fortune, and Crime',
        readingTime: '26 min read',
        readingPanelText: 'He who has not first laid his foundations may be able with great ability to do so afterwards, but they will be laid with trouble to the architect and danger to the building.',
        summary: 'Examines Cesare Borgia and the balance between relying on one’s own virtù versus the shifting winds of fortune.',
        keyIdeas: ['Cesare Borgia as a case study', 'Using cruelty well versus using cruelty badly', 'The civil principality'],
        discussionPrompt: 'What does Machiavelli mean by "cruelty well-used"? Can morality ever be reconciled with political survival?'
      },
      {
        number: 3,
        title: 'Chapters 14 to 17: Cruelty, Mercy, Love, and Fear',
        readingTime: '28 min read',
        readingPanelText: 'From this arises the question whether it is better to be loved than feared, or the reverse. The answer is of course that it would be best to be both one and the other; but since it is difficult to accommodate the two, it is much safer to be feared than loved, if one must choose.',
        summary: 'The most famous chapters of political philosophy. Machiavelli argues that human beings are ungrateful and fickle, making fear a more durable anchor than love.',
        keyIdeas: ['Better to be feared than loved, but avoiding hatred', 'Pragmatic realism versus imaginary republics'],
        discussionPrompt: 'Does modern corporate or political leadership still operate on Machiavelli’s principle that fear is more reliable than affection?'
      },
      {
        number: 4,
        title: 'Chapters 18 to 23: Keeping Faith and Choosing Ministers',
        readingTime: '25 min read',
        readingPanelText: 'A wise ruler, therefore, cannot and must not keep his word when such an observance may be turned against him, and when the reasons that caused him to pledge it exist no longer.',
        summary: 'The lion and the fox metaphor: why a leader must know both how to fight by law and how to fight by beast-like deception.',
        keyIdeas: ['The lion and the fox', 'Avoiding flatterers', 'The public mask of virtù'],
        discussionPrompt: 'Is Machiavelli describing how rulers ought to act, or merely describing how successful rulers have always acted?'
      },
      {
        number: 5,
        title: 'Chapters 24 to 26: Fortune and the Exhortation to Free Italy',
        readingTime: '22 min read',
        readingPanelText: 'I conclude then that, as fortune changes and men remain obstinate in their ways, men succeed so long as their ways conform to circumstance, but when there is discord they fail.',
        summary: 'Fortune is compared to a torrential river. Machiavelli concludes with an emotional, patriotic call to unite Italy and restore its ancient dignity.',
        keyIdeas: ['Fortune as a river to be prepared for', 'Free will versus divine fate', 'The ultimate patriotic purpose'],
        discussionPrompt: 'How does the passionate conclusion of The Prince reshape your impression of Machiavelli’s earlier cynicism?'
      }
    ],
    'the-book-of-job': [
      {
        number: 1,
        title: 'Chapters 1 to 3: The Loss and the Lament',
        readingTime: '20 min read',
        readingPanelText: 'In the land of Uz there lived a man whose name was Job. This man was blameless and upright; he feared God and shunned evil... After this, Job opened his mouth and cursed the day of his birth.',
        summary: 'Job loses his cattle, children, and health in sudden catastrophic ruin. In Chapter 3, his silent grief breaks into one of the most agonizing laments in world literature.',
        keyIdeas: ['The Prologue in Heaven', 'The breaking of silence', 'Cursing the day of birth as radical honesty'],
        discussionPrompt: 'Why does Job curse his birth rather than curse God directly? What does this tell us about his concept of existence?'
      },
      {
        number: 2,
        title: 'Chapters 4 to 14: The First Cycle of Speeches',
        readingTime: '25 min read',
        readingPanelText: 'Think now, who that was innocent ever perished? Or where were the upright cut off? As I have seen, those who plow iniquity and sow trouble reap the same.',
        summary: 'Eliphaz, Bildad, and Zophar argue that God always punishes wickedness and rewards righteousness. Job rejects their neat theological formulas.',
        keyIdeas: ['The doctrine of retribution', 'Job’s refusal to plead guilty falsely', 'The misery of pious platitudes'],
        discussionPrompt: 'Have you ever had someone offer neat religious or philosophical explanations for your grief? Why are such explanations so wounding?'
      },
      {
        number: 3,
        title: 'Chapters 15 to 31: Job Demands an Umpire',
        readingTime: '28 min read',
        readingPanelText: 'If only there were an arbiter between us, who could lay his hand on us both! Even now, behold, my witness is in heaven, and he who vouches for me is on high.',
        summary: 'Job’s friends grow harsher, accusing him of hidden crimes. Job defends his life with a solemn oath of innocence and demands an audience with the Almighty.',
        keyIdeas: ['The cry for a mediator', 'The oath of clearance', 'Integrity against religious conformity'],
        discussionPrompt: 'Why does Job believe that honest outrage is more pleasing to God than the hypocritical flattery of his friends?'
      },
      {
        number: 4,
        title: 'Chapters 38 to 41: The Voice from the Whirlwind',
        readingTime: '26 min read',
        readingPanelText: 'Then the Lord answered Job out of the whirlwind: "Who is this that darkens counsel by words without knowledge? Dress for action like a man; I will question you, and you make it known to me. Where were you when I laid the foundation of the earth?"',
        summary: 'God speaks not with an explanation of Job’s suffering, but with a magnificent poetic tour of the cosmos, the oceans, the constellations, Behemoth, and Leviathan.',
        keyIdeas: ['The Voice from the Whirlwind', 'God does not justify Himself with moral syllogisms', 'The wild mystery of creation'],
        discussionPrompt: 'Why does God answer Job’s questions about moral justice with poetry about sea-monsters, eagles, and the foundations of the stars?'
      },
      {
        number: 5,
        title: 'Chapter 42: The Epilogue and Restoration',
        readingTime: '18 min read',
        readingPanelText: 'Job answered the Lord: "I had heard of you by the hearing of the ear, but now my eye sees you; therefore I despise myself, and repent in dust and ashes." And the Lord said to Eliphaz: "My anger burns against you and your two friends, for you have not spoken of me what is right, as my servant Job has."',
        summary: 'Job repents not of sin, but of speaking without full sight. God condemns Job’s orthodox friends and orders them to ask Job to intercede for them.',
        keyIdeas: ['God vindicates Job’s protest', 'Condemnation of the defenders of easy theology', 'Restoration of life'],
        discussionPrompt: 'Why does God say to Eliphaz that Job spoke the truth, when Job spent thirty chapters complaining and arguing?'
      }
    ]
  };

  // =========================================================================
  // 3. Chapter-Anchored Discussions Pool
  // =========================================================================
  var INITIAL_COMMENTS = {
    'notes-from-underground-1': [
      {
        id: 'c101',
        bookId: 'notes-from-underground',
        chapterNumber: 1,
        author: 'Marcus Vance',
        time: '3 hours ago',
        text: 'The underground man’s insistence on keeping his liver diseased purely out of spite is the most radical philosophical joke in nineteenth-century literature. It is his way of saying: I am a person, not a mathematical sum.',
        isSpoiler: false,
        reactions: { interesting: 34, madeMeThink: 28, excellentPoint: 19, iDisagree: 4, userReactions: ['madeMeThink'] },
        replies: [
          {
            id: 'r101-1',
            author: 'Elena Vance',
            time: '2 hours ago',
            text: 'I agree completely. In a world that tells us happiness is just correct habit tracking and clean living, Dostoevsky reminds us how much of our soul is driven by irrational contradiction.',
            isSpoiler: false,
            reactions: { interesting: 12, madeMeThink: 9, excellentPoint: 8, iDisagree: 1, userReactions: [] }
          },
          {
            id: 'r101-2',
            author: 'Kelechi',
            time: '1 hour ago',
            text: 'It is terrifying because we all have that spiteful basenote inside us. We know something is good for us, and that is precisely why we refuse to do it.',
            isSpoiler: false,
            reactions: { interesting: 15, madeMeThink: 14, excellentPoint: 11, iDisagree: 0, userReactions: [] }
          }
        ]
      },
      {
        id: 'c102',
        bookId: 'notes-from-underground',
        chapterNumber: 1,
        author: 'Sarah Lin',
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

  // =========================================================================
  // 4. Reader Profiles Directory (Section 23 of Requirements)
  // =========================================================================
  var INITIAL_READERS = {
    'kelechi': {
      id: 'kelechi',
      name: 'Kelechi',
      joinedYear: 2025,
      avatar: 'K',
      bio: 'Reading philosophy and Russian literature to figure out how we ought to live.',
      currentlyReading: {
        bookId: 'notes-from-underground',
        title: 'Notes from Underground',
        chapter: 4,
        totalChapters: 6,
        percent: 66
      },
      completedCount: 17,
      favouriteGenres: ['Philosophy', 'Fiction', 'Religion'],
      wishlistCount: 12,
      isPublicActivity: true,
      activity: [
        { date: 'Yesterday', text: 'Completed Chapter 3 of Notes from Underground' },
        { date: '4 days ago', text: 'Added The Prince to 2027 Reading Plan' },
        { date: '2 weeks ago', text: 'Finished Meditations by Marcus Aurelius' }
      ]
    },
    'marcus': {
      id: 'marcus',
      name: 'Marcus Vance',
      joinedYear: 2024,
      avatar: 'M',
      bio: 'Investigating political philosophy, ethics, and ancient statecraft.',
      currentlyReading: {
        bookId: 'the-prince',
        title: 'The Prince',
        chapter: 3,
        totalChapters: 5,
        percent: 60
      },
      completedCount: 23,
      favouriteGenres: ['Non-Fiction', 'Philosophy'],
      wishlistCount: 8,
      isPublicActivity: true,
      activity: [
        { date: 'Today', text: 'Posted a thought on The Prince • Chapter 3' },
        { date: '3 days ago', text: 'Completed Chapter 2 of The Prince' },
        { date: '1 month ago', text: 'Finished The Book of Job' }
      ]
    },
    'elena': {
      id: 'elena',
      name: 'Elena Vance',
      joinedYear: 2025,
      avatar: 'E',
      bio: 'Drawn to nineteenth-century psychological realism and moral theology.',
      currentlyReading: {
        bookId: 'the-brothers-karamazov',
        title: 'The Brothers Karamazov',
        chapter: 3,
        totalChapters: 12,
        percent: 25
      },
      completedCount: 14,
      favouriteGenres: ['Fiction', 'Philosophy', 'Classics'],
      wishlistCount: 15,
      isPublicActivity: true,
      activity: [
        { date: '2 days ago', text: 'Reacted "Made me think" to a thought on Notes from Underground' },
        { date: '5 days ago', text: 'Started The Brothers Karamazov' },
        { date: '3 weeks ago', text: 'Finished Man’s Search for Meaning' }
      ]
    },
    'sarah': {
      id: 'sarah',
      name: 'Sarah Jenkins',
      joinedYear: 2026,
      avatar: 'S',
      bio: 'Searching for meaning in literature without academic pretension.',
      currentlyReading: {
        bookId: 'mans-search-for-meaning',
        title: 'Man’s Search for Meaning',
        chapter: 3,
        totalChapters: 4,
        percent: 75
      },
      completedCount: 9,
      favouriteGenres: ['Non-Fiction', 'Religion', 'Philosophy'],
      wishlistCount: 7,
      isPublicActivity: true,
      activity: [
        { date: 'Yesterday', text: 'Completed Chapter 2 of Man’s Search for Meaning' },
        { date: '1 week ago', text: 'Saved Confessions to Wishlist' }
      ]
    }
  };

  // =========================================================================
  // 5. Popular Genre Discussions & Reader Lists (Section 6 of Requirements)
  // =========================================================================
  var GENRE_DISCUSSIONS = {
    'philosophy': [
      {
        id: 'gd-1',
        title: 'What does Dostoevsky mean by freedom in Notes from Underground?',
        bookTitle: 'Notes from Underground',
        commentCount: 23,
        href: 'chapter.html?book=notes-from-underground&chapter=2'
      },
      {
        id: 'gd-2',
        title: 'Marcus Aurelius and the Inner Citadel: Can we control our reactions?',
        bookTitle: 'Meditations',
        commentCount: 19,
        href: 'chapter.html?book=meditations&chapter=1'
      },
      {
        id: 'gd-3',
        title: 'The Absurd Hero: Why Camus wants us to imagine Sisyphus happy',
        bookTitle: 'The Stranger',
        commentCount: 16,
        href: 'chapter.html?book=the-stranger&chapter=1'
      }
    ],
    'religion': [
      {
        id: 'gd-4',
        title: 'Why does God answer Job out of the whirlwind with nature rather than justice?',
        bookTitle: 'The Book of Job',
        commentCount: 31,
        href: 'chapter.html?book=the-book-of-job&chapter=4'
      },
      {
        id: 'gd-5',
        title: 'Augustine and the Pear Tree: The gratuitous nature of rebellion',
        bookTitle: 'Confessions',
        commentCount: 18,
        href: 'chapter.html?book=confessions&chapter=2'
      },
      {
        id: 'gd-6',
        title: 'The Grand Inquisitor: Did Christ burden humanity with too much freedom?',
        bookTitle: 'The Brothers Karamazov',
        commentCount: 42,
        href: 'chapter.html?book=the-brothers-karamazov&chapter=5'
      }
    ],
    'fiction': [
      {
        id: 'gd-7',
        title: 'Gregor Samsa’s insect form: Symbol of economic alienation or literal illness?',
        bookTitle: 'The Metamorphosis',
        commentCount: 27,
        href: 'chapter.html?book=the-metamorphosis&chapter=1'
      },
      {
        id: 'gd-8',
        title: 'The dinner party collapse: Why does the underground man seek his own humiliation?',
        bookTitle: 'Notes from Underground',
        commentCount: 21,
        href: 'chapter.html?book=notes-from-underground&chapter=5'
      },
      {
        id: 'gd-9',
        title: 'Meursault’s refusal to lie: Is he a sociopath or an authentic martyr?',
        bookTitle: 'The Stranger',
        commentCount: 25,
        href: 'chapter.html?book=the-stranger&chapter=6'
      }
    ],
    'non-fiction': [
      {
        id: 'gd-10',
        title: 'Tragic Optimism: How Frankl’s logotherapy challenges hedonistic psychology',
        bookTitle: 'Man’s Search for Meaning',
        commentCount: 38,
        href: 'chapter.html?book=mans-search-for-meaning&chapter=2'
      },
      {
        id: 'gd-11',
        title: 'Is it truly safer to be feared than loved? Machiavelli in modern life',
        bookTitle: 'The Prince',
        commentCount: 29,
        href: 'chapter.html?book=the-prince&chapter=3'
      },
      {
        id: 'gd-12',
        title: 'Private notebooks as spiritual exercise: Reading Marcus Aurelius today',
        bookTitle: 'Meditations',
        commentCount: 14,
        href: 'chapter.html?book=meditations&chapter=1'
      }
    ]
  };

  // =========================================================================
  // 6. Persistence & State Management
  // =========================================================================
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
        nextUp: ['the-prince'],
        wishlist: ['the-brothers-karamazov', 'mans-search-for-meaning', 'the-book-of-job'],
        finished: ['meditations'],
        abandoned: []
      };
    } catch (e) {
      return {
        currentlyReading: ['notes-from-underground'],
        nextUp: ['the-prince'],
        wishlist: ['the-brothers-karamazov', 'mans-search-for-meaning'],
        finished: ['meditations'],
        abandoned: []
      };
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

  function getStoredPlans() {
    try {
      var raw = localStorage.getItem(STORAGE_PLANS_KEY);
      return raw ? JSON.parse(raw) : [
        {
          id: 'p1',
          bookId: 'notes-from-underground',
          targetDate: '2026-10-31',
          frequency: '1 ch / 2 days',
          active: true,
          label: 'October Community Read'
        },
        {
          id: 'p2',
          bookId: 'the-prince',
          targetDate: '2026-11-20',
          frequency: '2 ch / week',
          active: false,
          label: 'November Statecraft'
        }
      ];
    } catch (e) {
      return [];
    }
  }

  function saveStoredPlans(plans) {
    try {
      localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(plans));
    } catch (e) {}
  }

  // =========================================================================
  // 7. Core Book & Progression Queries
  // =========================================================================
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
      if (b.genre.toLowerCase() === target) return true;
      return (b.genres || []).some(function (g) { return g.toLowerCase() === target; });
    });
  }

  function getBooksByTheme(theme) {
    if (!theme || theme.toLowerCase() === 'all') return BOOKS.slice();
    var target = theme.toLowerCase();
    return BOOKS.filter(function (b) {
      return (b.themes || []).some(function (t) { return t.toLowerCase() === target; });
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

    if (!chapter) {
      var book = getBookById(bookId);
      if (!book || chapterNum > book.chapterCount) return null;
      chapter = {
        number: chapterNum,
        title: 'Chapter ' + chapterNum,
        readingTime: '20 min read',
        summary: 'Editorial chapter summary in curation.',
        keyIdeas: ['Key themes and reflections for this section.'],
        discussionPrompt: 'What stayed with you after reading this chapter?',
        readingPanelText: 'Full chapter text reading slot.'
      };
    }

    var unlocked = isChapterUnlocked(bookId, chapterNum);
    var progress = getReaderProgress(bookId);
    var isCompleted = (progress.completedChapters || []).indexOf(chapterNum) !== -1;

    if (!unlocked) {
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
      prog[bookId].currentChapter = Math.max(prog[bookId].currentChapter || 1, chapterNum + 1);
    }
    prog[bookId].status = (book && prog[bookId].completedChapters.length >= book.chapterCount)
      ? 'completed'
      : 'currently-reading';

    saveStoredProgress(prog);

    if (prog[bookId].status === 'completed') {
      moveBookOnShelf(bookId, 'finished');
    }
    return prog[bookId];
  }

  // =========================================================================
  // 8. Comment & Nuanced Reaction Engine (Section 14 & 16)
  // =========================================================================
  function addComment(bookId, chapterNum, text, isSpoiler, spoilerSummary) {
    chapterNum = parseInt(chapterNum, 10);
    if (!text || !text.trim()) return null;

    var authorName = 'Reader';
    try {
      if (typeof getCurrentUser === 'function') {
        var u = getCurrentUser();
        if (u && (u.displayName || u.name)) authorName = u.displayName || u.name;
      }
    } catch (e) {}

    var key = bookId + '-' + chapterNum;
    var commentsMap = getStoredComments();
    if (!commentsMap[key]) commentsMap[key] = [];

    var newComment = {
      id: 'c_' + Date.now(),
      bookId: bookId,
      chapterNumber: chapterNum,
      author: authorName,
      time: 'Just now',
      text: text.trim(),
      isSpoiler: !!isSpoiler,
      spoilerSummary: spoilerSummary || '',
      reactions: {
        interesting: 0,
        madeMeThink: 0,
        excellentPoint: 0,
        iDisagree: 0,
        userReactions: []
      },
      replies: []
    };

    commentsMap[key].unshift(newComment);
    saveStoredComments(commentsMap);
    return newComment;
  }

  function addReply(bookId, chapterNum, parentCommentId, text) {
    chapterNum = parseInt(chapterNum, 10);
    if (!text || !text.trim()) return null;

    var authorName = 'Reader';
    try {
      if (typeof getCurrentUser === 'function') {
        var u = getCurrentUser();
        if (u && (u.displayName || u.name)) authorName = u.displayName || u.name;
      }
    } catch (e) {}

    var key = bookId + '-' + chapterNum;
    var commentsMap = getStoredComments();
    var list = commentsMap[key] || [];

    for (var i = 0; i < list.length; i++) {
      if (list[i].id === parentCommentId) {
        if (!list[i].replies) list[i].replies = [];
        var replyObj = {
          id: 'r_' + Date.now(),
          author: authorName,
          time: 'Just now',
          text: text.trim(),
          isSpoiler: false,
          reactions: { interesting: 0, madeMeThink: 0, excellentPoint: 0, iDisagree: 0, userReactions: [] }
        };
        list[i].replies.push(replyObj);
        saveStoredComments(commentsMap);
        return replyObj;
      }
    }
    return null;
  }

  function toggleReaction(bookId, chapterNum, commentId, reactionType) {
    var validTypes = ['interesting', 'madeMeThink', 'excellentPoint', 'iDisagree'];
    if (validTypes.indexOf(reactionType) === -1) return null;

    var key = bookId + '-' + chapterNum;
    var commentsMap = getStoredComments();
    var list = commentsMap[key] || [];

    for (var i = 0; i < list.length; i++) {
      if (list[i].id === commentId) {
        var c = list[i];
        if (!c.reactions.userReactions) c.reactions.userReactions = [];
        var idx = c.reactions.userReactions.indexOf(reactionType);
        if (idx !== -1) {
          c.reactions.userReactions.splice(idx, 1);
          c.reactions[reactionType] = Math.max(0, (c.reactions[reactionType] || 1) - 1);
        } else {
          c.reactions.userReactions.push(reactionType);
          c.reactions[reactionType] = (c.reactions[reactionType] || 0) + 1;
        }
        saveStoredComments(commentsMap);
        return c.reactions;
      }
    }
    return null;
  }

  // =========================================================================
  // 9. Virtual Shelves & Guilt-Free Abandonment (Section 18 & 47)
  // =========================================================================
  function getShelf() {
    return getStoredShelf();
  }

  function moveBookOnShelf(bookId, targetShelf, reason) {
    var validShelves = ['currentlyReading', 'nextUp', 'wishlist', 'finished', 'abandoned'];
    if (validShelves.indexOf(targetShelf) === -1) return false;

    var shelf = getStoredShelf();
    validShelves.forEach(function (s) {
      if (shelf[s]) {
        shelf[s] = shelf[s].filter(function (id) { return id !== bookId; });
      }
    });

    if (!shelf[targetShelf]) shelf[targetShelf] = [];
    shelf[targetShelf].unshift(bookId);

    if (targetShelf === 'abandoned') {
      var abandonedMeta = JSON.parse(localStorage.getItem('cr_abandoned_meta') || '{}');
      abandonedMeta[bookId] = {
        abandonedAt: new Date().toISOString(),
        reason: reason || 'Setting aside without guilt to make room for books that serve me now.'
      };
      localStorage.setItem('cr_abandoned_meta', JSON.stringify(abandonedMeta));
    }

    saveStoredShelf(shelf);
    return shelf;
  }

  function abandonBook(bookId, reason) {
    return moveBookOnShelf(bookId, 'abandoned', reason);
  }

  function finishBook(bookId, reflection) {
    moveBookOnShelf(bookId, 'finished');
    if (reflection) {
      var reflections = JSON.parse(localStorage.getItem('cr_reflections') || '{}');
      reflections[bookId] = {
        finishedAt: new Date().toISOString(),
        recommend: reflection.recommend || 'yes',
        whatStayedWithYou: reflection.whatStayedWithYou || '',
        whatMadeYouThink: reflection.whatMadeYouThink || ''
      };
      localStorage.setItem('cr_reflections', JSON.stringify(reflections));
    }
  }

  // =========================================================================
  // 10. Reading Habits, Plans & Discovery Queries (Section 19, 20, 21, 28)
  // =========================================================================
  function getReadingPlans() {
    return getStoredPlans();
  }

  function saveReadingPlan(bookId, targetDate, frequency, label) {
    var plans = getStoredPlans();
    var existing = null;
    for (var i = 0; i < plans.length; i++) {
      if (plans[i].bookId === bookId) {
        existing = plans[i];
        break;
      }
    }
    if (existing) {
      existing.targetDate = targetDate;
      existing.frequency = frequency;
      if (label) existing.label = label;
    } else {
      plans.push({
        id: 'plan_' + Date.now(),
        bookId: bookId,
        targetDate: targetDate,
        frequency: frequency || '1 ch / 2 days',
        active: true,
        label: label || 'Personal Reading Cadence'
      });
    }
    saveStoredPlans(plans);
    return plans;
  }

  function getReadingHabitStats() {
    var shelf = getStoredShelf();
    return {
      daysReadThisMonth: 12,
      daysReturnedThisWeek: 5,
      booksCompletedThisYear: (shelf.finished || []).length + 6,
      booksCurrentlyReading: (shelf.currentlyReading || []).length,
      booksOnWishlist: (shelf.wishlist || []).length,
      encouragement: "You've read for 12 days this month. Take your time—every page is part of a lifelong relationship with books."
    };
  }

  function getPopularDiscussionsByGenre(genre) {
    var key = (genre || 'philosophy').toLowerCase().replace(/[^a-z]/g, '');
    if (key === 'nonfiction') key = 'non-fiction';
    return GENRE_DISCUSSIONS[key] || GENRE_DISCUSSIONS['philosophy'] || [];
  }

  function getGenreReaderLists(genre) {
    var books = getBooksByGenre(genre);
    return {
      currentlyReading: books.slice(0, 2),
      mostWishlisted: books.slice(1, 3),
      readerRecommendations: books.slice(0, 3)
    };
  }

  // =========================================================================
  // 11. Reader Profiles Engine (Section 23)
  // =========================================================================
  function getAllReaders() {
    return Object.keys(INITIAL_READERS).map(function (k) { return INITIAL_READERS[k]; });
  }

  function getReaderProfile(id) {
    if (!id) id = 'kelechi';
    var key = id.toLowerCase().replace(/[^a-z]/g, '');
    return INITIAL_READERS[key] || INITIAL_READERS['kelechi'];
  }

  function getCurrentReaderProfile() {
    var user = null;
    try {
      if (typeof getCurrentUser === 'function') user = getCurrentUser();
    } catch (e) {}

    var shelf = getStoredShelf();
    var habit = getReadingHabitStats();

    var currentlyReadingBook = null;
    if (shelf.currentlyReading && shelf.currentlyReading.length > 0) {
      currentlyReadingBook = getBookById(shelf.currentlyReading[0]);
    }

    var prog = currentlyReadingBook ? getReaderProgress(currentlyReadingBook.id) : null;
    var currentCh = prog ? (prog.currentChapter || 1) : 1;
    var totalCh = currentlyReadingBook ? currentlyReadingBook.chapterCount : 6;
    var percent = Math.round((currentCh / totalCh) * 100);

    return {
      id: user ? (user.id || 'me') : 'me',
      name: (user && (user.displayName || user.name)) ? (user.displayName || user.name) : 'Kelechi',
      email: (user && user.email) ? user.email : 'kelechi@nebula.house',
      joinedYear: 2025,
      avatar: (user && user.displayName) ? user.displayName.charAt(0).toUpperCase() : 'K',
      bio: 'Lifelong reader discovering ideas through The Chapter Room.',
      currentlyReading: {
        bookId: currentlyReadingBook ? currentlyReadingBook.id : 'notes-from-underground',
        title: currentlyReadingBook ? currentlyReadingBook.title : 'Notes from Underground',
        chapter: currentCh,
        totalChapters: totalCh,
        percent: percent
      },
      completedCount: habit.booksCompletedThisYear,
      favouriteGenres: ['Philosophy', 'Fiction', 'Religion', 'Non-Fiction'],
      wishlistCount: (shelf.wishlist || []).length,
      isPublicActivity: true,
      activity: [
        { date: 'Today', text: 'Visited The Chapter Room' },
        { date: 'Yesterday', text: 'Read Chapter ' + currentCh + ' of ' + (currentlyReadingBook ? currentlyReadingBook.title : 'Notes from Underground') },
        { date: '4 days ago', text: 'Reviewed reading goals for 2027' }
      ]
    };
  }

  function updateReaderPrivacy(isPublic) {
    try {
      localStorage.setItem('cr_privacy_public_activity', isPublic ? 'true' : 'false');
      return true;
    } catch (e) {
      return false;
    }
  }

  function toggleFollowReader(readerId) {
    try {
      var followed = JSON.parse(localStorage.getItem('cr_followed_readers') || '[]');
      var idx = followed.indexOf(readerId);
      if (idx !== -1) {
        followed.splice(idx, 1);
      } else {
        followed.push(readerId);
      }
      localStorage.setItem('cr_followed_readers', JSON.stringify(followed));
      return followed.indexOf(readerId) !== -1;
    } catch (e) {
      return false;
    }
  }

  // =========================================================================
  // 12. Real API Wiring with Seamless Mock Fallback
  // =========================================================================
  return {
    getAllBooks: getAllBooks,
    getBookById: getBookById,
    getBookOfTheMonth: getBookOfTheMonth,
    getBooksByGenre: getBooksByGenre,
    getBooksByTheme: getBooksByTheme,
    getReaderProgress: getReaderProgress,
    isChapterUnlocked: isChapterUnlocked,
    getChapterContent: getChapterContent,
    markChapterComplete: markChapterComplete,
    addComment: addComment,
    addReply: addReply,
    toggleReaction: toggleReaction,
    getShelf: getShelf,
    moveBookOnShelf: moveBookOnShelf,
    abandonBook: abandonBook,
    finishBook: finishBook,
    getReadingPlans: getReadingPlans,
    saveReadingPlan: saveReadingPlan,
    getReadingHabitStats: getReadingHabitStats,
    getPopularDiscussionsByGenre: getPopularDiscussionsByGenre,
    getGenreReaderLists: getGenreReaderLists,
    getAllReaders: getAllReaders,
    getReaderProfile: getReaderProfile,
    getCurrentReaderProfile: getCurrentReaderProfile,
    updateReaderPrivacy: updateReaderPrivacy,
    toggleFollowReader: toggleFollowReader,

    // Backend API Stubs
    isMockMode: function () {
      if (typeof window === 'undefined') return true;
      var params = new URLSearchParams(window.location.search);
      if (params.get('mock') === 'true') return true;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return true;
      return false;
    },

    getApiBase: function () {
      if (typeof window !== 'undefined' && window.CHAPTER_ROOM_CONFIG && window.CHAPTER_ROOM_CONFIG.apiBase) {
        return window.CHAPTER_ROOM_CONFIG.apiBase;
      }
      return '/api/chapter-room';
    },

    getAuthHeaders: function () {
      var headers = { 'Content-Type': 'application/json' };
      try {
        var token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        if (token) headers['Authorization'] = 'Bearer ' + token;
      } catch (e) {}
      return headers;
    },

    fetchBooksApi: async function () {
      if (this.isMockMode()) return getAllBooks();
      try {
        var res = await fetch(this.getApiBase() + '/books', { headers: this.getAuthHeaders() });
        if (res.ok) {
          var data = await res.json();
          if (Array.isArray(data) && data.length > 0) return data;
        }
      } catch (err) {}
      return getAllBooks();
    },

    fetchChapterApi: async function (bookId, chapterNum) {
      if (this.isMockMode()) return getChapterContent(bookId, chapterNum);
      try {
        var url = this.getApiBase() + '/books/' + encodeURIComponent(bookId) + '/chapters/' + chapterNum;
        var res = await fetch(url, { headers: this.getAuthHeaders() });
        if (res.status === 403) {
          return { number: chapterNum, locked: true, summary: null, keyIdeas: [], comments: [] };
        }
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {}
      return getChapterContent(bookId, chapterNum);
    },

    postCommentApi: async function (bookId, chapterNum, payload) {
      var local = addComment(bookId, chapterNum, payload.text, payload.isSpoiler, payload.spoilerSummary);
      if (this.isMockMode()) return { ok: true, comment: local };
      try {
        var url = this.getApiBase() + '/books/' + encodeURIComponent(bookId) + '/chapters/' + chapterNum + '/comments';
        var res = await fetch(url, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        var data = await res.json();
        return { ok: res.ok, comment: data };
      } catch (err) {
        return { ok: true, comment: local, fallback: true };
      }
    },

    postReactionApi: async function (commentId, reactionType) {
      if (this.isMockMode()) return { ok: true };
      try {
        var url = this.getApiBase() + '/comments/' + encodeURIComponent(commentId) + '/reactions';
        var res = await fetch(url, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ reaction: reactionType })
        });
        return { ok: res.ok };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },

    fetchShelfApi: async function () {
      if (this.isMockMode()) return getShelf();
      try {
        var res = await fetch(this.getApiBase() + '/shelves', { headers: this.getAuthHeaders() });
        if (res.ok) return await res.json();
      } catch (err) {}
      return getShelf();
    },

    moveShelfApi: async function (bookId, targetShelf, reason) {
      moveBookOnShelf(bookId, targetShelf, reason);
      if (this.isMockMode()) return { ok: true, shelf: getShelf() };
      try {
        var url = this.getApiBase() + '/shelves';
        var res = await fetch(url, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ bookId: bookId, targetShelf: targetShelf, reason: reason })
        });
        var data = await res.json();
        return { ok: res.ok, data: data };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },

    reportCommentApi: async function (commentId, category, details) {
      try {
        var url = this.getApiBase() + '/comments/' + encodeURIComponent(commentId) + '/report';
        var res = await fetch(url, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ category: category, details: details })
        });
        var data = await res.json();
        return { ok: res.ok, data: data };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    }
  };
})();
