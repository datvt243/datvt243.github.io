# 2026-11-22 - contact-google-map (plan)
- Worker: implementer · Version: 0.1.0
- Node: `contact-google-map` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#437 Contact: remove the unused `contact.google_map` config — app.config.ts has contact.google_map but nothing renders it. Expected: remove it. (branch feature/437 already checked out)"

## Hub bytes before: 93668
## Feature doc: doctrine/features/contact.md (verified; OQ2 answered "Change: remove — #437", no unanswered question)

## Acceptance (copied onto the node)
1. `grep -rn google_map` over the repo (excl. node_modules/.nuxt/.output/.git/evidence/histories) → no code/config hit; only historical lines in contact.md OQ2/Changelog.
2. No rendered change: prerendered `/contact` + `/en/contact` still show phone/email/address (Behavior #1-#2).
3. build + lint + typecheck + `npm test` clean.

## Files
- `app.config.ts` (only code file; pre-diff grep showed 0 readers of `google_map`).
- `doctrine/features/contact.md` (drop the now-stale Out-of-scope bullet, add Changelog row).
