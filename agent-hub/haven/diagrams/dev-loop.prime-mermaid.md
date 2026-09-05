<!-- Diagram: dev-loop -->
<!-- Dev loop: plan - implement - verify - seal -->
DNA: 'smallest_diff / edit_x_read_back_proof_x_independent_verdict'
Auth: 65537 | Version: 1.0.0
Law: LAI-13 - monotonic ratchet (PENDING -> IN_PROGRESS -> SEALED, never demote)

> Every change to the repo's code enters here and leaves as SEALED or
> REOPENED — no state in between.

```mermaid
flowchart TD
    task[Task] --> pick[implementer: pick_next]
    pick --> exist{Node exists on diagram?}
    exist -- no --> draft[DRAFT node<br/>diagram-first: no node, no code]
    draft --> pick
    exist -- yes --> impl[implementer: implement<br/>smallest diff]
    impl --> outward{Touches outward-facing?}
    outward -- yes --> gate[SEAL GATE<br/>show diff, wait for approval]
    gate --> build
    outward -- no --> build[npm run build + npm run lint<br/>from doctrine/MEMORY.md]
    build --> visual{Changes visual/behavior?}
    visual -- yes --> cdp[Check real UI via Chrome CDP :9888]
    visual -- no --> readback
    cdp --> readback{Output actually<br/>read back?}
    readback -- no --> unverified[EDIT_UNVERIFIED]
    unverified --> impl
    readback -- yes --> evidence[Write evidence note]
    evidence --> verifier[verifier: verify_seal]
    verifier --> verdict{Meets every<br/>acceptance criterion?}
    verdict -- no --> reopen[REOPEN + specific reason]
    reopen --> impl
    verdict -- yes --> seal[SEAL<br/>update PM status]

    classDef gate fill:#f5c518,color:#000
    classDef bad fill:#e05555,color:#fff
    classDef good fill:#2fa84f,color:#fff
    class gate gate
    class unverified,reopen bad
    class seal good
```

## PM status
> Older SEALED nodes (2026-08-16 through 2026-08-19, then a 2nd pass
> 2026-08-31 covering 5 more nodes dated 2026-08-25/2026-08-29) moved to
> `haven/diagrams/dev-loop-archive.md` to keep this file small — every
> worker session reads this file in full. Nothing deleted: the archive
> has each row's full original text verbatim. The compact rows below
> point to it; open the archive only when you need the full story
> behind an old node. `pick_next` only needs non-archived rows. Run
> `/hub-tokens` periodically — if this file flags >15KB again, repeat
> this archiving pass for nodes older than the current work session.

| Node | State | Notes |
|---|---|---|
| `i18n-page-content` | SEALED | 2026-08-25 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-25/i18n-page-content-{plan,diff}.md`. |
| `open-to-work-badge` | SEALED | 2026-08-29 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-29/open-to-work-badge-{plan,diff}.md`. |
| `open-to-work-badge-i18n` | SEALED | 2026-08-29 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-29/open-to-work-badge-i18n-{plan,diff}.md`. |
| `blog-posts-shape-fix` | SEALED | 2026-08-29 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-29/blog-posts-shape-fix-{plan,diff}.md`. |
| `remove-dead-related-articles` | SEALED | Dead-code cleanup (issue #88): deleted `themes/portfolio-dev/pages/post/RelatedArticles.vue` — 0 references anywhere in the codebase (`grep -rn "RelatedArticles"` and `grep -rn "ThemePostRelatedArticles"` both 0 matches, confirmed before deleting). Was leftover placeholder markup from a Flowbite example ("Volosoft", `href="#"` links, hardcoded `gray-50`/`gray-800` not using any `--theme-*` token — would have broken light/dark mode if it were ever rendered). First flagged in `giscus-comment`'s (issue #74) "Noticed, not done". Verified: build/lint clean (32 problems, 0 errors, unchanged — independently re-run by the verifier from a cold cache, exact match) + CDP independently re-verified with a fresh script/port on a real `/blogs/<id>` page — real content still renders, no trace of the deleted placeholder ("Volosoft" absent), 0 console errors. Issue #88, branch `feature/88`. Evidence: `evidence/implementer/2026-08-30/remove-dead-related-articles-{plan,diff}.md`, `evidence/verifier/2026-08-30/remove-dead-related-articles-seal.md`. |
| `dependency-upgrade-plan` | SEALED | Audit + plan only (issue #91): confirmed `npm audit`'s real `53 vulnerabilities (4 low, 8 moderate, 35 high, 6 critical)`, confirmed `npm audit fix` (no `--force`) resolves nothing. Classified root cause: only `unhead`/`@unhead/vue` (moderate, XSS bypass in `useHeadSafe`) is genuinely runtime-reachable (direct from `nuxt`, used via `useHead`/`useSeoMeta`) — the rest (`undici`, `koa`, `tar`, `vite`/`esbuild`/`rollup`, `@nuxt/devtools`, etc.) trace to Nuxt's own build/dev tooling, never shipped in `.output/server`. Key finding: `npm outdated`'s cached `nuxt` numbers were stale (showed `3.17.7`, live `npm view "nuxt@^3.13.0" version` shows the true range-max is `3.21.11`) — cross-checked `@nuxt/ui`/`@nuxt/image` and found those accurate, so it was `nuxt`-specific, not systemic. Wrote `DEPENDENCY-UPGRADE-PLAN.md` (repo root): Phase 1 (same-major patch/minor, `nuxt`→3.21.11 as the highest-value single bump since it fixes the one real-runtime advisory), Phase 2 (same-major, re-verify live first: `@nuxt/icon`/`@nuxt/image`/`@nuxt/ui`), Phase 3 (majors, one issue per row: `@nuxtjs/i18n` 10.x flagged as the already-failed trap from #75, `@nuxt/ui`+`tailwindcss` v4 bundled together, `pinia`+`@pinia/nuxt`, `puppeteer-core` needing its own research since `npm audit`'s own suggestion is a downgrade, `vue-router` deferred to a future Nuxt 4 migration). No dependency was actually bumped — pure audit + plan, exactly as issue #91 scoped it ("không làm gộp 1 lần"). Verified: build/lint clean (32 problems, 0 errors, 32 warnings, unchanged baseline — independently re-run by the verifier from a cold cache + fresh `.nvmrc`-resolved shell) + every cited number (audit count, live `nuxt` version) independently re-confirmed. No CDP needed — docs-only, no runtime/visual change. Issue #91, branch `feature/91`. Evidence: `evidence/implementer/2026-08-30/dependency-upgrade-plan-{plan,diff}.md`, `evidence/verifier/2026-08-30/dependency-upgrade-plan-seal.md`. |
| `add-nvmrc` | SEALED | Dev-tooling fix (issue #89): added `.nvmrc` (content `24`) at the repo root so a bare `nvm use` resolves to a Node version that satisfies `eslint-flat-config-utils@3.2.0`'s `Object.groupBy` requirement, instead of relying on manually remembering `nvm use 24` every session (the trap already recorded in `doctrine/domains/PROJECT.md`'s Traps table). `24` chosen over `lts/*` because it's already installed locally and matches the exact version prior verifier passes used. No `engines` field added — issue only asked for `.nvmrc` (`SmallestDiff`), tracked as a possible follow-up. Verified: cold-cache build clean (exit 0) + lint clean under the `.nvmrc`-resolved version (`✖ 32 problems (0 errors, 32 warnings)`, unchanged baseline — independently re-run by the verifier in a fresh shell, exact match). No CDP needed — `.nvmrc` is local dev tooling, no runtime/visual behavior changed. Issue #89, branch `feature/89`. Evidence: `evidence/implementer/2026-08-30/add-nvmrc-{plan,diff}.md`, `evidence/verifier/2026-08-30/add-nvmrc-seal.md`. |
| `readme-refresh` | SEALED | 2026-08-29 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-29/readme-refresh-{plan,diff}.md`. |
| `centralize-color-tokens` | SEALED | 2026-08-16 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-16/centralize-color-tokens-{plan,diff}.md`. |
| `editor-dracula-scope` | SEALED | 2026-08-16 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-16/editor-dracula-scope-{plan,diff}.md`. |
| `light-theme-code-syntax-contrast` | SEALED | 2026-08-16 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-16/light-theme-code-syntax-contrast-{plan,diff}.md`. |
| `light-theme-elevation` | SEALED | 2026-08-16 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-16/light-theme-elevation-{plan,diff}.md`. |
| `resume-adapter-class` | SEALED | 2026-08-16 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-16/resume-adapter-class-{plan,diff}.md`. |
| `resume-data-models` | SEALED | 2026-08-16 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-16/resume-data-models-{plan,diff}.md`. |
| `giscus-comment` | SEALED | 2026-08-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-19/giscus-comment-{plan,diff}.md`. |
| `giscus-live-fix` | SEALED | 2026-08-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-19/giscus-live-fix-{plan,diff}.md`. |
| `i18n-foundation` | SEALED | 2026-08-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-19/i18n-foundation-{plan,diff}.md`. |
| `rss-sitemap-feed` | SEALED | 2026-08-19 — archived, see `haven/diagrams/dev-loop-archive.md`. Evidence: `evidence/implementer/2026-08-19/rss-sitemap-feed-{plan,diff}.md`. |
| `dependency-upgrade-phase1` | SEALED | Executes Phase 1 of `DEPENDENCY-UPGRADE-PLAN.md` (issue #129): same-major patch/minor bumps to `nuxt` (3.13.2→3.21.11 — the highest-value bump, closes the one real-runtime advisory, `unhead`/`@unhead/vue`'s XSS bypass in `useHeadSafe`), plus `postcss`, `@iconify-json/fe`, `@iconify-json/grommet-icons`, `@nuxt/eslint`, `@vue/runtime-core`, `autoprefixer`, `dotenv`, `sass`+`sass-embedded` (matched pair), `typescript`, `vue-tsc`. Live-verified every target version via `npm view <pkg>@<range> version` immediately before bumping (not trusting a cached `npm outdated`). `npm audit`: 53 → 25 vulnerabilities; `unhead` no longer appears in the report at all, confirmed via `npm ls unhead @unhead/vue` (now `@unhead/vue@2.1.17`, brought in transitively by `nuxt`). `puppeteer-core` deliberately excluded (its only `npm audit fixAvailable` suggestion is a downgrade — tracked separately in Phase 3). Verified: build + lint independently re-run clean from cold cache (`npm run build` exit 0 no errors; `npm run lint` → `32 problems (0 errors, 32 warnings)`, exact match to baseline) + `npm audit`/`npm ls unhead @unhead/vue` independently reproduced verbatim + CDP independently re-verified with a fresh script/port (3993, different route than the implementer's check) — 0 console errors, 0 hydration warnings, real click-nav confirmed. Evidence: `evidence/implementer/2026-09-02/dependency-upgrade-phase1-{plan,diff}.md`, `evidence/verifier/2026-09-02/dependency-upgrade-phase1-seal.md`. |
| `visit-tracking-client-call` | SEALED | New client-only plugin (`plugins/VisitTracker.client.ts`) POSTs to the backend's new `POST /api/me/:email/visit` endpoint (resume-nodejs-api's `add-visit-tracking` node, branch `feat/visit-tracking`, not yet merged/deployed) on real page load, so the backend sees the real visitor IP/geo. Fire-and-forget, never blocks rendering; independently confirmed via CDP that a real SPA nav click doesn't re-fire the request. Verified: build/lint clean (32 problems, 0 errors, unchanged — independently re-run by the verifier from a cold cache) + CDP independently re-verified with a fresh script/port, plus a stronger real-click SPA-nav check. Production backend doesn't have the route live yet (branch not merged/deployed) — expected 404s, disclosed, not a bug here. Evidence: `evidence/implementer/2026-09-01/visit-tracking-client-call-{plan,diff}.md`, `evidence/verifier/2026-09-01/visit-tracking-client-call-seal.md`. |
| `dependency-upgrade-phase2` | SEALED | Issue #135: Phase 2 of `DEPENDENCY-UPGRADE-PLAN.md` — same-major bumps `@nuxt/icon` (`^1.5.6`→`^1.15.0`), `@nuxt/image` (`^1.8.0`→`^1.11.0`), `@nuxt/ui` (`^2.18.6`→`^2.22.3`), live-verified against the registry immediately before bumping (no drift from the 2026-08-30 plan doc). `#136` was found already resolved beforehand — no node created for it, per `pick_next`'s "no PENDING node" branch. `npm audit`: 25→18 vulnerabilities (side effect of transitive movement, not targeted). New `sharp` darwin-arm64 binary warning at build time (pulled in transitively by the `@nuxt/image` bump) confirmed via A/B not to break real image rendering — `ipx`'s JS fallback still serves both local and remote images correctly. Verified: build + lint independently re-run clean from a cold cache (`npm run build` exit 0, same `sharp` warning reproduced verbatim; `npm run lint` → `32 problems (0 errors, 32 warnings)`, exact baseline match) + `npm audit` count independently reproduced (`18 vulnerabilities (1 low, 2 moderate, 14 high, 1 critical)`, exact match) + CDP independently re-verified with a fresh script/port (3995, different from the implementer's 3994) — real click-based SPA nav to `/github` and `/blogs` confirmed working, `@nuxt/icon` icons rendering (25 `.iconify` spans on `/`), `@nuxt/ui`'s `UPagination` rendering on `/blogs` (numbered nav button), local `Avatar.png` via `ipx` and the remote GitHub avatar both loaded (`complete: true`), 0 console errors. Issue #135, no branch yet (evidence-only pass, per this repo's `/todo` flow — branching happens at PR time, not verify time). Evidence: `evidence/implementer/2026-09-05/dependency-upgrade-phase2-{plan,diff}.md`, `evidence/verifier/2026-09-05/dependency-upgrade-phase2-seal.md`. |


Any regression must be a **new node** (LAI-13) — never edit an old node's
PM status directly to "undo" an existing SEAL.
