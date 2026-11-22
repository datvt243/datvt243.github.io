# 2026-11-22 - error-legacy-block (plan)
- Worker: implementer · Version: 0.1.0
- Node: `error-legacy-block` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#427 error.vue: remove the commented-out legacy block — Problem: error.vue keeps a large commented-out legacy block. Expected: Delete it (git history keeps it). Feature doc: agent-hub/doctrine/features/error-page.md. Branch feature/427 already checked out off staging."

## Hub bytes before: 93694
## Feature doc: doctrine/features/error-page.md (verified; Open question 1 answered "Change: remove — #427", no unanswered question)

## Acceptance (copied onto the node)
1. The commented-out `<div class="error-page …">` block (error.vue lines 63-72 on staging) is gone; `grep -n "error-page\|Clear errors" error.vue` → 0 hits.
2. No rendered change: `/does-not-exist` still 404 + contains "Trang này không tồn tại" (Behavior #1-#2).
3. build + lint + typecheck + `npm test` clean.

## Files
- `error.vue` (only file; no callers — it's Nuxt's error entry).
