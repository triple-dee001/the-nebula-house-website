#!/usr/bin/env python3
"""Rebuild blog.html with Wix-matching card design"""

posts = [
    {"href": "post/no-man-left-behind.html", "img": "assets/images/blog-post-1.webp", "date": "Nov 19, 2025", "read": "4 min read", "title": "NO Man Left Behind.", "excerpt": "As International Men's Day approaches, I find myself reflecting not only on masculinity itself but also on the shifting lens through which it is viewed by society&mdash;a lens that too often distorts,...", "views": 17, "comments": 0, "likes": 2},
    {"href": "post/what-do-you-really-want.html", "img": "assets/images/blog-post-2.webp", "date": "Nov 8, 2025", "read": "3 min read", "title": "What Do You Really Want?", "excerpt": "As we look towards year-end, we need to be careful not to approach the coming year with spite and careless disregard for how far we have come...", "views": 19, "comments": 0, "likes": 1},
    {"href": "post/brothers-in-christ-draw-your-swords.html", "img": "assets/images/blog-post-3.webp", "date": "Oct 18, 2025", "read": "5 min read", "title": "Brothers in Christ, Draw your Swords", "excerpt": "Have we not had enough? Are our eyes not fixed upon what truly matters? We face one enemy &mdash; the devil &mdash; and have but one ruler and friend, God, strong and mighty...", "views": 25, "comments": 1, "likes": 0},
    {"href": "post/to-the-women-in-my-life-i-love-you.html", "img": "assets/images/thoughts-bg.jpg", "date": "Apr 6, 2025", "read": "7 min read", "title": "To the Women in My Life: I Love You", "excerpt": "I have come a long way in life. I have seen the depths of hell with all its cruelty, and I have tasted the blessings of heaven in their fullness...", "views": 12, "comments": 0, "likes": 3},
    {"href": "post/the-battle-cry-of-a-saint.html", "img": "assets/images/thoughts-bg.jpg", "date": "Mar 28, 2025", "read": "4 min read", "title": "The Battle Cry of A Saint", "excerpt": "What is the purpose of this life of faith, Lord? What gain is there in worshipping You? We face family struggles, life-threatening issues, and goals that seem forever unmet...", "views": 14, "comments": 0, "likes": 1},
    {"href": "post/the-struggles-of-the-christian-man.html", "img": "assets/images/thoughts-bg.jpg", "date": "Feb 28, 2025", "read": "5 min read", "title": "The Struggles of The Christian Man", "excerpt": "Oh, what a man that I am &mdash; full of malevolence, filth, greed, and lust for that which can only kill me. Oh, what a man that I am. Who will save me from myself?", "views": 18, "comments": 0, "likes": 2},
    {"href": "post/my-struggle-with-depression.html", "img": "assets/images/thoughts-bg.jpg", "date": "Sep 25, 2024", "read": "3 min read", "title": "My Struggle with Depression", "excerpt": "Over the last ten months, I fought and still fighting the greatest battle of my life; the struggle between who I am and who I want to be...", "views": 22, "comments": 0, "likes": 4},
    {"href": "post/utility-in-gratitude.html", "img": "assets/images/thoughts-bg.jpg", "date": "Sep 25, 2024", "read": "3 min read", "title": "Utility in Gratitude", "excerpt": "Life is a journey filled with events, goals, dreams, and pain. We are birthed into this very distasteful world with one sure destination, Death...", "views": 10, "comments": 0, "likes": 1},
    {"href": "post/you-are-more-likely-cain-than-abel.html", "img": "assets/images/thoughts-bg.jpg", "date": "Sep 25, 2024", "read": "4 min read", "title": "You Are More Likely Cain Than Abel.", "excerpt": "The story of Cain and Abel is archetypal to our current society. Abel offers a far greater and better sacrifice than his brother Cain...", "views": 15, "comments": 0, "likes": 2},
    {"href": "post/the-day-i-died.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 8, 2024", "read": "3 min read", "title": "The Day I Died,", "excerpt": "A cold day in hell. The earth stopped in its orbit. The sun couldn't give light. The stars lost their beauty. Death seemed peaceful...", "views": 20, "comments": 0, "likes": 3},
    {"href": "post/this-life-of-sin.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 8, 2024", "read": "5 min read", "title": "This Life of Sin.", "excerpt": "Life is beautiful, or at least I thought so. Maybe there is some truth to this overtly optimistic statement. It gives hope to the dying soul...", "views": 11, "comments": 0, "likes": 1},
    {"href": "post/impossible-love-save-me-from-this-snare.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 8, 2024", "read": "4 min read", "title": "Impossible Love: Save me from this snare.", "excerpt": "Love, what a strange concept! What a feeling! What a drug! Oh, love, how much are you worth? Who guards your gates?", "views": 13, "comments": 0, "likes": 2},
    {"href": "post/what-is-love.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "5 min read", "title": "What Is Love?", "excerpt": "\"I love you\"... what does that even mean? Is it an expression of our current feeling, or a pledge to responsibility, devotion, and honor?", "views": 16, "comments": 0, "likes": 1},
    {"href": "post/my-14th-reason-why-not.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "4 min read", "title": "My 14th Reason Why Not", "excerpt": "Rest in peace; the most common phrase on gravestones. Let's extrapolate that for a moment. The phrase suggests that there is no rest or peace in our current world...", "views": 14, "comments": 0, "likes": 2},
    {"href": "post/i-am-peter-but-the-rooster-hasn-t-crowed-yet.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "5 min read", "title": "I Am Peter but the Rooster Hasn't Crowed Yet", "excerpt": "Many times in my Christian life, I have continuously pondered whether any of these religious dictates are genuine and worthy of believing and following...", "views": 12, "comments": 0, "likes": 1},
    {"href": "post/without-god-man-is-dead.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "5 min read", "title": "Without God, Man is Dead", "excerpt": "Man is a creature with a creator, without which man has no soul, intent or purpose. God defines man, in all ramifications...", "views": 11, "comments": 0, "likes": 0},
    {"href": "post/know-pain.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "4 min read", "title": "Know Pain.", "excerpt": "Sometimes you must hurt in order to know, fail in order to grow, lose in order to gain because life's greatest lessons are learned through pain...", "views": 15, "comments": 0, "likes": 2},
    {"href": "post/forgive-yourself.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "4 min read", "title": "Forgive Yourself", "excerpt": "The image in the mirror has been and will always be by your side from birth to death. Forgiving oneself is the best long-term strategy...", "views": 9, "comments": 0, "likes": 1},
    {"href": "post/the-death-of-god.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "5 min read", "title": "The Death Of God", "excerpt": "God is dead. God remains dead, and we have killed him. How shall we comfort ourselves, the murderers of all murderers...", "views": 18, "comments": 0, "likes": 3},
    {"href": "post/death-the-value-in-life.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "4 min read", "title": "Death, The Value in Life", "excerpt": "Treat death not with contempt, for in it the value of living becomes priceless. Life is a journey of birth, happiness, laughter, pain, tears, joy...", "views": 10, "comments": 0, "likes": 1},
    {"href": "post/hell-is-empty-and-all-the-devils-are-here.html", "img": "assets/images/thoughts-bg.jpg", "date": "Jul 7, 2024", "read": "5 min read", "title": "Hell Is Empty and All the Devils Are Here", "excerpt": "Most of life's pain and suffering are due to man's malevolence, greed, and lust for power, money, and all whatnot...", "views": 14, "comments": 0, "likes": 2},
]

def make_card(p, i):
    # Extract post ID from href: "post/no-man-left-behind.html" -> "post_no-man-left-behind"
    raw_id = p["href"].split('/')[-1].replace('.html', '')
    post_id = f"post_{raw_id}"
    
    return f'''
        <!-- {i+1}. {p["title"]} -->
        <a href="{p["href"]}" class="blog-card" data-post-id="{post_id}">
          <div class="blog-card__image" style="background-image: url('{p["img"]}');"></div>
          <div class="blog-card__content">
            <div class="blog-card__author-row">
              <div class="blog-card__avatar">K</div>
              <div class="blog-card__author-info">
                <span class="blog-card__author-name">Kelechi Oji</span>
                <span class="blog-card__date">{p["date"]} &middot; {p["read"]}</span>
              </div>
              <span class="blog-card__menu">&#8942;</span>
            </div>
            <h3 class="blog-card__title">{p["title"]}</h3>
            <p class="blog-card__excerpt">{p["excerpt"]}</p>
            <div class="blog-card__footer">
              <div class="blog-card__stats">
                <span class="card-views">... views</span>
                <span class="card-comments">... comments</span>
              </div>
              <div class="blog-card__heart">
                <span class="card-likes">...</span>
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
            </div>
          </div>
        </a>'''

cards = "\n".join(make_card(p, i) for i, p in enumerate(posts))

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Posts — Kelechi Oji | The Nebula House</title>
  <meta name="description" content="Dive into Kelechi Oji's curated posts on The Nebula House — thoughtful reflections on life, gratitude, struggle, faith, and meaning.">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <nav class="navbar" id="navbar">
    <div class="navbar__inner">
      <div class="navbar__logo"><a href="index.html"><img src="assets/images/room-icon.png" alt="The Nebula House" class="navbar__logo-img"></a></div>
      <div class="navbar__links">
        <a href="index.html" class="navbar__link">Home</a><a href="about.html" class="navbar__link">About</a>
        <div class="navbar__dropdown"><span class="navbar__link navbar__dropdown-trigger">Our Rooms <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span><div class="navbar__dropdown-menu"><a href="the-chapter-room.html" class="navbar__dropdown-item">The Chapter Room</a><a href="my-thoughts.html" class="navbar__dropdown-item">My Thoughts</a><a href="the-writers-room.html" class="navbar__dropdown-item">The Writer's Room</a><a href="the-publishing-room.html" class="navbar__dropdown-item">The Publishing Room</a><a href="the-opinion-yard.html" class="navbar__dropdown-item">The Opinion Yard</a><a href="the-nebula-academy.html" class="navbar__dropdown-item">The Nebula Academy</a></div></div>
</div>
      <a href="#" class="navbar__account" id="nav-account-icon" title="Account">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </a>
      <div class="navbar__toggle" id="menuToggle"><span></span><span></span><span></span></div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu"><a href="index.html" class="mobile-menu__link">Home</a><a href="about.html" class="mobile-menu__link">About</a><div class="mobile-menu__divider"></div><a href="the-chapter-room.html" class="mobile-menu__link">The Chapter Room</a><a href="my-thoughts.html" class="mobile-menu__link">My Thoughts</a><a href="the-writers-room.html" class="mobile-menu__link">The Writer's Room</a><a href="the-publishing-room.html" class="mobile-menu__link">The Publishing Room</a><a href="the-opinion-yard.html" class="mobile-menu__link">The Opinion Yard</a><a href="the-nebula-academy.html" class="mobile-menu__link">The Nebula Academy</a></div>

  <!-- ===== HERO ===== -->
  <section class="hero hero--short">
    <div class="hero__content">
      <h1 class="hero__title reveal">All Posts</h1>
    </div>
  </section>

  <!-- ===== POSTS GRID ===== -->
  <section class="section section--blog-grid">
    <div class="container container--narrow">
      <div class="blog-grid">
{cards}

      </div>
    </div>
  </section>

  <footer class="footer"><div class="container"><div class="footer__grid"><div class="footer__brand"><a href="index.html"><img src="assets/images/room-icon.png" alt="The Nebula House" class="footer__logo-img"></a><p class="footer__brand-tagline">From Imagination to Infinity.</p><p class="footer__brand-tagline">A digital literary ecosystem.</p></div><div class="footer__rooms"><h4 class="footer__heading">Rooms</h4><a href="the-chapter-room.html" class="footer__link">The Chapter Room</a><a href="the-writers-room.html" class="footer__link">The Writer's Room</a><a href="the-nebula-academy.html" class="footer__link">The Nebula Academy</a><a href="the-publishing-room.html" class="footer__link">The Publishing Room</a><a href="the-opinion-yard.html" class="footer__link">The Opinion Yard</a><a href="my-thoughts.html" class="footer__link">My Thoughts</a></div><div class="footer__connect"><h4 class="footer__heading">Connect</h4><a href="mailto:kelechioji@thenebulahouse.com" class="footer__link">Email</a><a href="https://www.instagram.com/the_nebula_house" target="_blank" rel="noopener" class="footer__link">Instagram</a><a href="https://youtube.com/@kelechi_oji" target="_blank" rel="noopener" class="footer__link">YouTube</a></div></div><div class="footer__bottom"><p>&copy; 2026 The Nebula House. All Rights Reserved.</p></div></div></footer>
  <script src="js/main.js"></script><script src="js/pages.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>
  <script src="js/auth.js"></script>
</body>
</html>
'''

with open(r"c:\Users\Triple D\Desktop\The Nebula House\blog.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"DONE: blog.html rebuilt with {len(posts)} cards (Wix-matching design)")
print("Key changes:")
print("  - Removed 'reveal' class from blog-grid (fixes invisibility)")
print("  - Author name + date stacked in author-info div")
print("  - Three-dot menu icon (&#8942;)")
print("  - Footer with views/comments + heart icon")
print("  - Simplified hero (just title, no subtitle/label)")
