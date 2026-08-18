# 2026-08-19 — giscus-live-fix (plan)

- Worker: implementer
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `giscus-live-fix` (NEW — regression fix per LAI-13, `giscus-comment` stays SEALED, never demoted)
- Issue: #81 (`bug: Giscus embed never loads - containerRef null inside ClientOnly`)

## Task
Operator finished the manual Giscus setup from #74 (GitHub Discussions
enabled, Giscus GitHub App installed, real `GISCUS_CATEGORY=Announcements`/
`GISCUS_CATEGORY_ID=DIC_kwDOM3bPGs4DDqo8`/`GISCUS_REPO_ID=R_kgDOM3bPGg`
filled into `.env`). Live CDP verification (this session, before this
node) showed the placeholder correctly disappeared (`isConfigured` is
now `true`) but the real iframe never appeared: `iframeSrc: null`,
`requests: []` (0 network requests to any `giscus` URL), `consoleErrors:
[]` — a silent bug, not a crash.

## Root cause
`themes/portfolio-dev/pages/post/Comments.vue`'s `onMounted()` calls
`loadGiscus()` synchronously, but `containerRef` is bound to a `<div>`
inside `<ClientOnly>`. `<ClientOnly>` renders nothing (or its fallback)
during SSR and for exactly one tick after the wrapping component mounts
on the client, then swaps in its real slot content. At the moment the
outer component's own `onMounted` fires, `<ClientOnly>`'s internal state
hasn't flipped yet, so `containerRef.value` is `null` — `loadGiscus()`'s
own guard (`if (!isConfigured || !containerRef.value) return`) silently
returns early, and the `<script src="https://giscus.app/client.js">`
element is never appended to the DOM. This is why 0 console errors AND 0
network requests were observed: the code never even tried.

## Fix
Await `nextTick()` in `onMounted` before calling `loadGiscus()`, giving
`<ClientOnly>` one microtask/render cycle to mount its real slot content
first.

## Acceptance criteria
1. `onMounted` awaits `nextTick()` before `loadGiscus()`.
2. `npm run build` + `npm run lint` clean.
3. CDP on a real `/blogs/<id>` page with the real `.env` values already
   in place: the `iframe.giscus-frame` element actually appears (poll,
   since giscus's own script does its own async work after injection),
   its `src` points to `https://giscus.app/...`, 0 console errors.

## Files
- `themes/portfolio-dev/pages/post/Comments.vue`
- `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` (new node row)

## Blockers
None — `.env` already has real values (confirmed present, not touching
`.env` itself in this diff since it's gitignored and operator-owned).
