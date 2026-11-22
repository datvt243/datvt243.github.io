# 2026-11-22 - resume-view-url (plan)

- Worker: implementer · Version: 0.1.0
- Node: `resume-view-url` on `haven/diagrams/dev-loop.prime-mermaid.md` (new row, IN_PROGRESS)
- Task (verbatim, via `/todo #422 #435`, issue #422): "HR view: make it linkable with `?view=hr`" — The Dev/HR view is in-memory only (`useResumeView.ts`): a reload returns to Dev and a recruiter can't share an HR link. Expected: `?view=hr` selects HR after mount (client only, like `?tab=`, so ISR still renders Dev); the toggle updates the query (`dev` removes it).
- Branch: `feature/422` (off `staging`, synced: `Already up to date.`)

## Hub bytes before: 93656

## Feature doc: agent-hub/doctrine/features/resume-view-toggle.md
Written by the analyst this run (`evidence/analyst/2026-11-22/resume-view-toggle-spec.md`, `spec_ready`), open question 3 answered by the operator "(a) State wins". No unanswered open question.

## Slug check
`grep -c "resume-view-url"` → archive `0`, active diagram `0`. No not-yet-SEALED row for `#422` (`grep -n "#422\|#435"` on the active diagram → no output).

## Acceptance (copied from the feature doc)
1. On `/`, clicking `dev/hr` shows the HR card and hides the editor tabs; clicking again restores the tabs.
2. On `/projects`, clicking `dev/hr` lands on `/?view=hr` in HR view.
3. On `/`, clicking `dev/hr` → `/?view=hr`; again → `/` (no `view`). History length does not grow.
4. Opening `/?view=hr` in a fresh tab shows HR after load; `curl -s <origin>/?view=hr` returns HTML containing `experiences.pug` (Dev).
5. Reloading `/?view=hr` shows HR; reloading `/` shows Dev.
6. HR on `/` → `/projects` via header tab → back via header `/` tab (or `gr`): HR shown, URL `/?view=hr`.
7. HR on `/`, switch language: HR stays, other locale's home URL ends in `?view=hr`.
8. `/?tab=skills&view=hr`: HR shown; toggling back to Dev keeps `tab=skills` and opens the skills tab.
9. `npm run build`, `npm run lint`, `npx nuxi typecheck` clean; `npm test` passes.
Self-check (pick_next step 5): every criterion has a concrete pass/fail observation and points at `Index.vue`/`Header.vue`; no rewrite needed.

## Code anchors
`composables/useResumeView.ts:6` (state), `themes/portfolio-dev/pages/resumeObject/Index.vue:36-43` (`?tab` mount/watch pattern to mirror), `themes/portfolio-dev/layout/Header.vue:20-25` (toggle; navigates to `/` when off-home). `grep -rn "useResumeView" themes composables pages app.vue stores layouts` → only `Header.vue:20`, `resumeObject/Index.vue:14`, `composables/useResumeView.ts:6`.

## Plan
Sync lives in `Index.vue` (the only component mounted on `/`): on mount, `?view=hr` → state HR; else state already HR → `router.replace` adds `view=hr` (Behavior 11); watch state → replace query (toggle on `/`, Behavior 9); watch `route.query.view` → state (Back/Forward, Behavior 10). `Header.vue` unchanged: off-home it already sets state + navigates to `/`, and the mount rule then adds `?view=hr`.
