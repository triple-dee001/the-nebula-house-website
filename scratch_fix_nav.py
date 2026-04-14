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

            original = content

            # Remove the "Write" link from navbar (matches both with and without prefix)
            content = re.sub(
                r'\s*<a href="[^"]*the-writers-room\.html" class="navbar__link" style="color: var\(--accent-color\);">Write</a>\s*',
                '\n',
                content
            )

            # Fix metamorphosis image filename (code says metamorphosis.png, file is metamrphosis.png)
            content = content.replace('metamorphosis.png', 'metamrphosis.png')

            if content != original:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(content)
                count += 1
                print(f"Fixed: {filepath}")

print(f"\nTotal files updated: {count}")
