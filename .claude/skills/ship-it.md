---
name: ship-it
description: Commit all changes and push to main branch on GitHub
user_invocable: true
---

# Ship It

When the user says "ship it" or invokes `/ship-it`, perform these steps:

1. Run `git status` and `git diff --stat` to review all changes
2. Run `git log --oneline -5` to match the repo's commit message style
3. Stage all relevant changed and new files (exclude secrets, .env files, credentials)
4. Write a concise commit message summarizing the changes (conventional commit style: `feat:`, `fix:`, `chore:`, etc.)
5. Commit with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
6. Push to `origin main`

Do NOT ask for confirmation — the user already said "ship it".
