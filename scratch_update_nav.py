import os
import re

base_dir = r"c:\Users\Triple D\Desktop\The Nebula House"

count = 0
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.html'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            if 'nav-account-icon' in content:
                continue # Already updated
            
            # calculate relative path
            rel_path = os.path.relpath(filepath, base_dir)
            depth = rel_path.count('\\') + rel_path.count('/')
            prefix = '../' * depth
            
            # Replacement block
            nav_appendix = f"""<a href="{prefix}the-writers-room.html" class="navbar__link" style="color: var(--accent-color);">Write</a>
        <a href="{prefix}the-admin-room.html" class="navbar__link" id="nav-account-icon" title="Account" style="display:flex; align-items:center;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </a>
      </div>"""
            
            new_content = re.sub(r'</div>(\s*<div class="navbar__toggle" id="menuToggle">)', nav_appendix + r'\1', content)
            
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            count += 1
            print(f"Updated {filepath}")

print(f"Total files updated: {count}")
