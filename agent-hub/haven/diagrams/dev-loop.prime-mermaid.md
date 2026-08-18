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
| Node | State | Notes |
|---|---|---|
| `light-theme-elevation` | SEALED | Light mode: `--theme-canvas` → pure white; `ThemeHeader`/`ThemeFooter` keep `bg-theme-panel` (`248 250 252`); `ThemePanel` (editor) gets its own `--theme-editor` (`226 232 240`) + `shadow-md` to stand out more. Verified: `npm run build`/`npm run lint` clean + Chrome CDP computed style. Evidence: `evidence/implementer/2026-08-16/light-theme-elevation-{plan,diff}.md`, `evidence/verifier/2026-08-16/light-theme-elevation-seal.md`. |
| `centralize-color-tokens` | SEALED | Centralized where color codes are declared into one easy-to-find/edit place: renamed `themes/portfolio-dev/tokens/` → `themes/portfolio-dev/settings-colors-theme/` (kept `dark.css`/`light.css` as-is, kept the RGB-triplet format since the `<alpha-value>` opacity modifier needs it). Verified: build/lint clean + grepped directly on the built CSS. Evidence: `evidence/implementer/2026-08-16/centralize-color-tokens-{plan,diff}.md`, `evidence/verifier/2026-08-16/centralize-color-tokens-seal.md`. |
| `light-theme-code-syntax-contrast` | SEALED | Real bug: `utils/tsCodeLines.ts` (Skills), `utils/jsonCodeLines.ts` (Educations), `themes/portfolio-dev/pages/resumeObject/Experiences.vue` (scoped style) used literal Tailwind colors instead of theme tokens. Fix: 10 new `--theme-code-*` tokens (dark = the exact old literal values, light = a darker shade of the same hue). Verified: build/lint clean + CDP computed style + screenshots of 3 sections. Evidence: `evidence/implementer/2026-08-16/light-theme-code-syntax-contrast-{plan,diff}.md`, `evidence/verifier/2026-08-16/light-theme-code-syntax-contrast-seal.md`. |
| `editor-dracula-scope` | SEALED | A separate theme for the file-tree + editor (`<ThemePanel>` and everything inside it) — does NOT touch header/footer/the rest of the page. Dark = standard Dracula, 11 canonical colors; light = a derived Dracula-light palette (Foreground↔Background swapped, accents darkened). Rides the existing dark/light toggle, no new toggle added. Mechanism: `themes/portfolio-dev/settings-colors-theme/editor-dracula.css` overrides every `--theme-*`/`--theme-code-*` inside the `.editor-scope` class (`Panel.vue`'s root) — 0 changes to Folder/NavItem/FilterFolder/CodeBlock/PostCategories. Verified: build/lint clean + CDP computed style in both modes + the verifier independently recomputed hex→rgb. Evidence: `evidence/implementer/2026-08-16/editor-dracula-scope-{plan,diff}.md`, `evidence/verifier/2026-08-16/editor-dracula-scope-seal.md`. |
| `resume-data-models` | SEALED | Typed resume data models (Prototype pattern: prototype instance + `.clone()` via `Object.create`+`cloneDeep`) for Experience/Education/Skill/Language/Project/Hero/SocialMedia, each with an adapter mapping raw API shape → model instance. Wired into `stores/resume.ts` getters + all consuming components, unifying 3x-duplicated HTML-strip/date-format logic; removed confirmed-dead `contact` store getter. Issue #71, branch `feature/71`. Server-side `server/utils/createPDF.ts` (independent fetch, no Pinia store) out of scope. Verified: build/lint clean + CDP (0 console errors, 6 screenshots pixel-matched against pre-refactor) + verifier independently re-grepped build log/dead-code claims. Evidence: `evidence/implementer/2026-08-16/resume-data-models-{plan,diff}.md`, `evidence/verifier/2026-08-16/resume-data-models-seal.md`. |
| `resume-adapter-class` | SEALED | Consolidated the 7 standalone `adapt*` functions (one per `models/*.ts` file) into a single `ResumeAdapter` class in `utils/ResumeAdapter.ts`, per user's explicit choice (1 class, placed in `/utils` despite the domain-awareness tradeoff). Plan called for `static` methods, but a real caught `@typescript-eslint/no-extraneous-class` lint error forced a switch to instance arrow-function fields + a shared singleton (`resumeAdapter`) — disclosed deviation, also structurally avoids the `this`-binding pitfall the plan had flagged as a discipline to remember. `stores/resume.ts` calls `resumeAdapter.toX(...)`. Deliberately NOT added to `utils/index.ts`'s barrel export, avoiding a `utils/index.ts` ⇄ `models/index.ts` circular import. Verified: build/lint clean (independently re-run by verifier) + CDP pixel-identical to sealed `resume-data-models` + 0 console errors on every bare-callback call site. Issue #71, branch `feature/71`. Evidence: `evidence/implementer/2026-08-16/resume-adapter-class-{plan,diff}.md`, `evidence/verifier/2026-08-16/resume-adapter-class-seal.md`. |
| `rss-sitemap-feed` | SEALED | New `server/routes/rss.xml.ts` (RSS 2.0, 20 most recent posts) and `server/routes/sitemap.xml.ts` (5 static routes + one `<url>` per post at `/blogs/<_id>`), both hand-built XML strings (no new dependency), sourced from the existing `cacheGetPosts` util. Real bug caught during runtime verification: `cacheGetPosts` is typed `Post[]` but the actual blog API returns `{data: Post[], total, page, perPage}` — worked around defensively in both new files (`Array.isArray(...) ? ... : (...).data`), matching the same unwrap `themes/portfolio-dev/pages/blogs/Index.vue` already does; `server/utils/cacheGetPost.ts` itself left untouched (out of scope for issue #73). Verified: build/lint clean (independently re-run by verifier) + real `curl`+`xmllint` against a `node .output/server/index.mjs` preview showing 200 + well-formed XML for both routes (no CDP needed — non-visual XML endpoints). Issue #73, branch `feature/73`. Evidence: `evidence/implementer/2026-08-19/rss-sitemap-feed-{plan,diff}.md`, `evidence/verifier/2026-08-19/rss-sitemap-feed-seal.md`. |
| `i18n-foundation` | SEALED | Foundation node for issue #75 (i18n VI/EN) — full-site scope split per `SmallestDiff`, operator confirmed via `AskUserQuestion` before implementing: (1) route prefix per locale, (2) UI-chrome-only (dynamic resume/blog content from external APIs stays as-is, no multi-locale API support), (3) `@nuxtjs/i18n`. Installed `@nuxtjs/i18n@9.5.6` (NOT latest `10.x` — real build error caught: `10.x` bundles a Nuxt-4-targeted `@nuxt/kit`/`jiti`, incompatible with this repo's Nuxt `3.13.2`, threw `Cannot use 'import.meta' outside a module`). Config: `locales: [vi, en]`, `defaultLocale: 'vi'`, `strategy: 'prefix_except_default'` (disclosed deviation from a literal "/vi/... and /en/..." reading — `vi`, the site's original/100%-of-traffic language, keeps unprefixed URLs to avoid breaking every existing link/bookmark/SEO index on this real production site; only `en` gets `/en/*`). `detectBrowserLanguage` explicitly disabled — its default auto-redirects `/` to `/en` for English-browser visitors, a real behavior caught live via CDP that wasn't asked for. Translated only site-wide chrome visible on every page: `ThemeHeader` (aria-labels + new language-switcher button) and `ThemeFooter` ("find me in:"); nav tab labels (`_resume.ts` etc from `app.config.ts`) deliberately NOT translated — they're filename-style per the code-editor metaphor, not prose. Fixed a real bug caught via CDP: plain `<NuxtLink to="...">` doesn't auto-localize under `prefix_except_default` — nav links dropped the `/en` prefix on click; fixed via `useLocalePath()` on every `menuPrimary`-driven link + the logo link + `isActive()`'s comparison. Verified: build/lint clean + CDP (root loads `vi` unprefixed with no auto-redirect, switcher toggles `/` ⇄ `/en` with correct text, nav clicks preserve the active locale's prefix, 0 console errors throughout). Per-page content translation (resumeObject/projects/blogs/post/contact/github) explicitly OUT of scope — follow-up nodes. Issue #75, branch `feature/75`. Independently re-verified by the verifier: build/lint clean from a cold cache + CDP bit-for-bit reproduced. Evidence: `evidence/implementer/2026-08-19/i18n-foundation-{plan,diff}.md`, `evidence/verifier/2026-08-19/i18n-foundation-seal.md`. |

Any regression must be a **new node** (LAI-13) — never edit an old node's
PM status directly to "undo" an existing SEAL.
