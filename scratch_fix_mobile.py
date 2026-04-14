import os
import re

base_dir = r"c:\Users\Triple D\Desktop\The Nebula House"

count = 0
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.html'):
            filepath = os.path.join(root, f)
            # Skip admin room, write page, user profile (they have custom navs or none)
            if f in ('the-admin-room.html', 'write.html'):
                continue
            
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()

            if 'nav-account-icon' not in content:
                continue

            original = content

            # Step 1: Remove the account icon from inside navbar__links
            # It sits right before </div> that closes navbar__links
            content = re.sub(
                r'\s*<a[^>]*id="nav-account-icon"[^>]*>.*?</a>\s*(?=\s*</div>\s*\n?\s*<div class="navbar__toggle")',
                '\n',
                content,
                flags=re.DOTALL
            )

            # Step 2: Insert account icon BETWEEN </div> (closing navbar__links) and <div class="navbar__toggle">
            # Place it as a sibling in navbar__inner so it's always visible
            content = re.sub(
                r'(</div>\s*\n?\s*)(<div class="navbar__toggle" id="menuToggle">)',
                r'\1<!-- Account Icon (always visible) -->\n      <a href="#" class="navbar__account" id="nav-account-icon" title="Account">\n        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>\n      </a>\n      \2',
                content
            )

            if content != original:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal: {count}")
