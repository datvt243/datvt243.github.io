# 2026-08-19 — giscus-live-fix (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `giscus-live-fix`
- Issue: #81, branch `bug/81`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/post/Comments.vue` | `onMounted(() => loadGiscus())` → `onMounted(async () => { await nextTick(); loadGiscus() })`, with a comment explaining why (`<ClientOnly>`'s slot isn't rendered yet on the same tick) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node `giscus-live-fix`: PENDING → IN_PROGRESS (will be SEALED by the verifier). `giscus-comment` row left untouched (LAI-13 — a regression is a new node, never edit an old SEAL) |

## Real bug (disclosed with reproduction, not just a claim)
Before this fix, live CDP against `/blogs/<id>` with the operator's real
`.env` values already in place (`GISCUS_CATEGORY=Announcements`,
`GISCUS_CATEGORY_ID=DIC_kwDOM3bPGs4DDqo8`, `GISCUS_REPO_ID=R_kgDOM3bPGg`)
showed:
```json
{"iframeSrc": null, "requests": [], "consoleErrors": []}
```
0 requests to any `giscus` URL — the script element was never appended,
confirming `loadGiscus()`'s early-return guard (`!containerRef.value`)
was the actual blocker, not a network/config issue. Root cause: `<div
ref="containerRef">` lives inside `<ClientOnly>`, which renders nothing
on the client for one tick after the wrapping component mounts (Nuxt 3's
documented `<ClientOnly>` behavior) — so at the exact moment this
component's own `onMounted` ran, `containerRef.value` was still `null`.

## Command
```
npm run build
```
```
npm run lint
```

## Output
`npm run build` — clean, verbatim tail:
```
Σ Total size: 28.5 MB (10.3 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```
Exit code 0.

`npm run lint` — verbatim tail, exact match to session baseline:
```
✖ 34 problems (0 errors, 34 warnings)
```
`Comments.vue` does not appear in the problem list (0 new warnings).

## Browser verification
Chrome CDP port 9888 (already running). Built + ran a real preview server
(`node .output/server/index.mjs`), with the operator's real `.env` values
already present (not a synthetic/fake config — this is the actual
production credential set). Connected via `puppeteer-core`, navigated
with real `page.goto` + `waitUntil: 'networkidle2'`, then polled (giscus
does async work after its script loads) for `iframe.giscus-frame`:

```json
{
  "iframeSrc": "https://giscus.app/vi/widget?origin=...&repo=datvt243%2Fdatvt243.github.io&repoId=R_kgDOM3bPGg&category=Announcements&categoryId=DIC_kwDOM3bPGs4DDqo8&...",
  "requests": [
    {"url": "https://giscus.app/client.js", "status": 200},
    {"url": "https://giscus.app/default.css", "status": 200}
  ],
  "consoleErrors": []
}
```
The iframe's `src` query string contains the EXACT `repoId`/`categoryId`
values from the operator's real `.env` (not placeholder/fake values) —
confirms this is genuinely the live, correctly-configured embed, not a
coincidental non-error state. Preview server + temp script cleaned up
after verification.

## Acceptance
| # | Criterion | Evidence |
|---|---|---|
| 1 | `onMounted` awaits `nextTick()` before `loadGiscus()` | Diff cited |
| 2 | Build/lint clean | Cited above |
| 3 | Real iframe appears with correct repo/category IDs, 0 console errors | Cited above, exact JSON with real IDs |

## Seal gate
None — no outward-facing action (no commit/push/PR) in this implementer
pass.
