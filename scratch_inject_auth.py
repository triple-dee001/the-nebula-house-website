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

            # Skip if already has auth.js
            if 'auth.js' in content:
                continue

            # Skip admin room (it has its own setup)
            if 'the-admin-room' in f:
                continue

            # Calculate relative prefix
            rel_path = os.path.relpath(filepath, base_dir)
            depth = rel_path.count('\\') + rel_path.count('/')
            prefix = '../' * depth

            # Firebase SDKs + auth.js — inject before </body>
            firebase_block = f'''  <!-- Firebase SDKs -->
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>
  <script src="{prefix}js/auth.js"></script>
'''
            # Insert before </body>
            content = content.replace('</body>', firebase_block + '</body>')

            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
            count += 1
            print(f"Injected auth: {filepath}")

print(f"\nTotal: {count}")
