# 2026-11-22 - projects-tech-url (plan)

- Worker: implementer · Version: 0.1.0
- Node: `projects-tech-url` on `haven/diagrams/dev-loop.prime-mermaid.md` (new row, IN_PROGRESS)
- Task (verbatim, via `/todo #435`, issue #435): "Projects: keep the technology filter in the URL" — The technology filter on `/projects` is local state only, so a filtered view can't be shared or survive a reload. Expected: Selected technologies in the query (e.g. `?tech=vue,pinia`), applied after mount; clearing removes it. Needs `allowQuery` on the `/projects` ISR rule (same trap as #415).
- Branch: `feature/435` (off `staging`, synced: `Already up to date.`)

## Hub bytes before: 93562

## Feature doc: agent-hub/doctrine/features/projects.md
Status verified; open question 4 answered by operator 2026-11-07 "Change: keep it in the URL — #435". No unanswered open question. The doc has no #435-specific acceptance criterion and lists "filter in the URL" under Out of scope → doc gets updated by this diff (operator decision Q4 is the explicit answer, pick_next 5b).

## Operator decision (AskUserQuestion, this pass)
Q: issue asks for both "applied after mount" and `allowQuery` on the `/projects` ISR rule — with client-only application the server HTML never depends on `tech`, so allowQuery would only add one identical cache entry per tech combination. Answer: **"Client-only, no allowQuery (Recommended)"** — `nuxt.config.ts` stays `isr: 60` (same as home `?view`/`?tab`).

## Slug check
`grep -c "projects-tech-url"` → active `0`, archive `0`. `grep -n "#435"` on the active diagram → no output.

## Acceptance (node's, written here; doc gets matching Behavior 8)
1. On `/projects`, selecting `A` then `B` → URL `?tech=A,B`, list = projects using A or B; `history.length` unchanged (replace).
2. Clicking × → URL has no `tech`, all projects shown.
3. Fresh load / reload of `/projects?tech=A` shows the A-filtered list after mount; unknown tech names stay selected (match nothing) and × clears them.
4. `curl -s <origin>/projects?tech=A` SSR HTML lists all projects (unfiltered) — ISR can't depend on the query.
5. `nuxt.config.ts` `/projects` rule unchanged (operator decision).
6. `npm run build`, `npm run lint`, `npx nuxi typecheck` clean; `npm test` passes.
Self-check (pick_next 5): each has a concrete observation, all point at `themes/portfolio-dev/pages/projects/Index.vue`.

## Code anchors
`themes/portfolio-dev/pages/projects/Index.vue:36` (`selected` ref) / `:52` (`v-model="selected"`); pattern to mirror: `themes/portfolio-dev/pages/resumeObject/Index.vue:33-53` (`?tab` replace + onMounted watcher). `ThemeFilterFolder` emits a new array per change (`FilterFolder.vue:18-23`, × emits `[]`).

## Plan
Keep `selected` as the rendered state (server = `[]`). v-model goes through a computed whose setter `router.replace`s `tech` (empty → removed). On mount: read `route.query.tech` → `selected`, and watch it (one-way URL → state, covers Back/Forward and the setter).
