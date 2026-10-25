# 2026-10-25 - deps-nuxt-4 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-nuxt-4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #263 "chore(deps): Phase 3.6 — Nuxt 3→4 migration (incl. vue-router 5)", branch `feature/263`
- Status: `sealed_pending_verifier`

## Hub bytes before
77921

## Diff
| File | Why |
|---|---|
| `package.json` / `package-lock.json` | `nuxt` ^3.21.11→^4.6.2, `vue-router` `latest`→`^5.4.0` (written by `npm install vue-router@latest`; a range instead of `latest` so a future v6 can't slip past Nuxt's `^5` dep), removed devDep `@nuxt/schema ~3.21.11` (#262's pin) |
| `composables/useResumeData.ts` (new) | One `useAsyncData('api-resume', …)` for `/` and `/projects` — Nuxt 4 shares a key's refs across callers and compares handlers by source-text hash (`node_modules/nuxt/dist/app/composables/asyncData.js:70`, `createHash` → `hashFunction(_handler)`); the two old handlers differed only in the variable name (`resumeStore` vs `store`) |
| `pages/index.vue`, `themes/portfolio-dev/pages/projects/Index.vue` | Call `useResumeData()`; dropped the now-unused `Resume` type import in `pages/index.vue` |
| `themes/portfolio-dev/pages/resumeObject/Index.vue`, `utils/htmlCodeLines.ts`, `utils/tsCodeLines.ts` | 6× `!` — Nuxt 4's generated tsconfig enables `noUncheckedIndexedAccess`; each index is provably defined (`sections` is a 5-item literal; `m[1]` is the regex's mandatory capture group; `ids = groups.map(...)` indexed by the same `groups.forEach` `i`) |
| Docs: `CLAUDE.md`, `README.md`, `agent-hub/{README,NORTHSTAR}.md`, `agent-hub/doctrine/{MEMORY,SOUL}.md`, `agent-hub/doctrine/domains/PROJECT.md` (lines 4, 13), `haven/workers/implementer/{manifest.yaml,SOUL.md}` | "Nuxt 3" → "Nuxt 4" |
| `agent-hub/doctrine/domains/PROJECT.md` Traps row `@nuxt/schema` | "What to do instead" → resolved in #263 (pin dropped; every module now dedupes to `@nuxt/schema@4.6.2`) |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

Directory layout: kept flat. No `app/` dir exists → Nuxt 4 uses the root as `srcDir` automatically; no `srcDir`/`dir` config needed (build output contains every page/layout/theme chunk: `chunks/build/{index,projects,github,blogs,contact,blog,default,error,Panel,Folder,NavItem,CodeBlock,FilterFolder,...}`). No codemod run — nothing it would change was needed once build/typecheck/SSR proved clean.

## Commands + output
```
npm uninstall @nuxt/schema && npm install nuxt@^4.6.2 vue-router@latest
npm ls nuxt vue vue-router  → nuxt@4.6.2, vue-router@5.4.0, vue@3.5.12; npm ls @nuxt/schema → every path @4.6.2 (deduped)
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0, "◆ ✨ Build complete in 14.9s!"; grep -c WARN = 0; grep -c nuxt/server = 0
npm run lint → rc=0, no output after "eslint ."
npx nuxi typecheck → rc=0, 0 "error TS"; last line "✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
npm audit → 43 vulnerabilities (1 moderate, 42 high)
```
- First typecheck before the `!` fixes: rc=2, 6 errors — `resumeObject/Index.vue(16,20)(24,64)(37,70)` TS2532, `htmlCodeLines.ts(14,5)` TS2532, `tsCodeLines.ts(52,32)(63,79)` TS2345.
- Baseline (staging, Nuxt 3): build rc=0 with 7 WARN (5× node-resolve `nuxt/server` + 1× `"nuxt/server" is imported by` from @nuxt/image, 1× chunk >500 kB); typecheck 0; audit `50 vulnerabilities (1 low, 1 moderate, 45 high, 3 critical)`. → All @nuxt/image `nuxt/server` warnings gone; chunk-size warning gone too.

## SSR comparison (prod build, `node .output/server/index.mjs`, `.env` loaded)
Baseline on staging :4100 vs this branch :4101, script `scratchpad/n4/head.cjs` (html lang, title, sorted alternate/canonical links, sorted og/description/twitter metas — `id="i18n-*"` and `data-v-*` stripped — visible text length, count of `class="…theme-…"` attributes):
```
_.html SAME  _en.html SAME  _github.html SAME  _en_github.html SAME  _contact.html SAME
_en_contact.html SAME  _projects.html SAME  _en_projects.html SAME  _blogs.html SAME  _en_blogs.html SAME
```
All 10 routes 200 on both. `/blogs/67123bdf9c6e9bcf4f7bf006` → 200, lang vi-VN, real post title, hreflang alternates present.
- Size drop (e.g. `/` 233501 → 84387 B): base had 8 `<style>` blocks / 166041 chars inline + 0 stylesheet links; Nuxt 4 has 4 `<style>` / 16141 chars + 1 `<link rel="stylesheet">` — Nuxt 4's `inlineStyles` default now inlines only Vue component styles; global CSS ships as one cacheable stylesheet in `<head>`. Accepted framework default (no flash: the link is render-blocking in head; visual parity confirmed in the browser run below).
- ISR: `.output/server/chunks/nitro/nitro.mjs` contains `isr": 60` ×6 and `isr": true` ×1.
- `/api/generate-pdf?lang=vi` → `200 application/pdf 160795` bytes, file starts `%PDF-`.

## Browser verification (dev, `npx nuxi dev --port 4102`, CDP :9888 Chrome/155.0.8059.85, 1440×900, script `scratchpad/n4/func.cjs`)
Loads `/`, `/github`, `/blogs`, `/blogs/<id>`, `/contact`, `/projects`, `/en`, then real `click()`s:
```
header links: [ '_resumegr', '_projectsgp', '_githubgh', '_blogsgb', '_contactgc' ]
click _resumegr -> / textLen=1198
click _projectsgp -> /projects textLen=1141
click _githubgh -> /github textLen=3100
click _blogsgb -> /blogs textLen=747
click _contactgc -> /contact textLen=434
keyNav dialog open: Phím tắt …Đi tới _resume gr…   (header ? button)
dialog after Esc: false
color class: dark -> light -> dark
before switch: /github lang=vi-VN
after switch 1: /en/github lang=en-US
after switch 2: /github lang=vi-VN
hydration msgs: 0 []
other: [ 'warn: Warning: Missing `Description` or `aria-describedby="undefined"` for DialogContent.' ]
```
(console filter excludes only the documented pre-existing visit-tracker CORS failure, as in #265's note.)

### A/B on the one warning
Same script against a `origin/staging` worktree (`npm ci`, nuxt@3.21.11, dev :4103):
```
hydration msgs: 0 []
warn: [nuxt] [useAsyncData] Incompatible options detected for "api-resume" (used at …/projects/Index.vue:26:55): - different handler
warn: Warning: Missing `Description` or `aria-describedby="undefined"` for DialogContent.
```
→ the reka-ui `Description` warning pre-exists (introduced with @nuxt/ui 3 in #262, reka-ui 2.6.0 on both); the `api-resume` warning is fixed by this diff.

## Acceptance
| Criterion | Evidence |
|---|---|
| nuxt 4.6.x / vue-router 5.x | `npm ls` above |
| `@nuxt/schema` pin dropped | package.json diff; `npm ls @nuxt/schema` all 4.6.2 |
| build/lint/typecheck clean vs baseline, `nuxt/server` warnings gone, no new | rc=0 ×3, 0 WARN (baseline 7), 0 TS errors |
| duplicate `api-resume` resolved | `useResumeData`; A/B warning present on staging, absent here |
| SSR parity on 10 routes + 1 post | SAME ×10, post 200 |
| ISR rules emitted | nitro.mjs grep |
| generate-pdf binary | 200 application/pdf, `%PDF-` |
| real browser: 5-tab click-nav, KeyNav, color mode, vi↔en, 0 console errors (new), 0 hydration | func.cjs output + A/B |
| npm audit before/after | 50 → 43 |

## Supersedes: none
(grep `#263` in active diagram → only this row)

## Still open
- Vercel runtime Node: Nuxt 4.6.2 engine `^22.22.3 || ^24.15.0 || >=26`; repo pins `engines.node ">=24"` + `.nvmrc` (CI). Could not read the project's Node setting: Vercel MCP `get_project prj_yggNGY8ImvrkSIOjIcMxJlPInFV0` → `403 forbidden … scope "david-vos-projects-7b8f3576"` (needs operator to grant team access). The issue's own acceptance "every route on a Vercel preview deploy" needs a pushed branch — outside this pass (no push without /ship).

## Noticed, not done
- `Missing Description` reka-ui warning on `ThemeKeyNav`'s `UModal` (pre-existing since #262): passing a `description` prop (or `:ui`/`aria-describedby`) would silence it — UI change, out of scope.
- `vue` stays at 3.5.12 despite `"vue": "latest"` + `overrides` (lockfile pin) — untouched.

## Seal gate
none — no commit/push/PR in this pass.

---

## Rework 1 (after REOPEN `evidence/verifier/2026-10-25/deps-nuxt-4-reopen.md`)
REOPEN reasons: (1) `npm ls` summarised, hid rc=1 `ELSPROBLEMS` on vue-router; (2) no "comments per code-comments.md" acceptance row.

### 1. `npm ls` — verbatim, and what it led to
`npm ls vue-router` (before rework):
```
├─┬ @nuxt/ui@3.3.7
│ └── vue-router@5.4.0 deduped invalid: "^4.5.0" from node_modules/@nuxt/ui
├─┬ @nuxtjs/i18n@10.6.0
│ └── vue-router@5.4.0 deduped invalid: "^4.5.0" from node_modules/@nuxt/ui
├─┬ nuxt@4.6.2
│ └── vue-router@5.4.0 deduped invalid: "^4.5.0" from node_modules/@nuxt/ui
└── vue-router@5.4.0 invalid: "^4.5.0" from node_modules/@nuxt/ui
npm error code ELSPROBLEMS
rc=1
```
Digging further found a second, hidden problem: `npm view nuxt@4.6.2 dependencies.vue` = `'^3.5.44'` (and vue-router 5 peer `vue: '^3.5.34 || ^4.0.0'`), but the lockfile pinned **vue 3.5.12** for every copy — `"overrides": { "vue": "latest" }` forces all consumers onto the root vue, so `npm ls` never flags it. Staging also ran 3.5.12 (`staging` lockfile `node_modules/vue` = 3.5.12) — pre-existing staleness, but Nuxt 4 is what raises the floor to 3.5.44.
- Fix: `npm update vue` (package.json untouched — it already says `latest`; `npm install vue@latest` refused: `Override for vue@3.5.44 conflicts with direct dependency`). Result: `node_modules/vue` 3.5.44; `npm ls vue --all` → 31× `vue@3.5.44`, no other vue version.

`npm ls --all` after rework, rc=1, `npm error invalid:` lines:
```
npm error invalid: vue-router@5.4.0 node_modules/vue-router
npm error invalid: magic-string@0.30.12 node_modules/magic-string
npm error invalid: unplugin@2.3.11 node_modules/@nuxt/ui/node_modules/unplugin
```
A/B: `origin/staging` worktree, `npm ci`, `npm ls --all` → rc=1 with:
```
npm error invalid: @nuxt/schema@3.21.11 node_modules/@nuxt/schema
npm error invalid: magic-string@0.30.12 node_modules/magic-string
npm error invalid: unplugin@2.3.11 node_modules/@nuxt/ui/node_modules/unplugin
npm error invalid: cac@7.0.0 node_modules/cac
```
→ `magic-string`/`unplugin` pre-exist; `@nuxt/schema`/`cac` fixed by this diff; **vue-router is the one new entry**.

### vue-router 5 vs @nuxt/ui 3's `^4.5.0` peer — accepted, with proof
- Unresolvable on this node: `nuxt@4.6.2` depends on `vue-router ^5.4.0`; there must be a single router copy (two copies = two injection keys, broken `useRoute`). @nuxt/ui 3.3.7 is the last 3.x (`npm view @nuxt/ui@3 version` → 3.3.7).
- @nuxt/ui's Nuxt-mode runtime never imports vue-router: `grep -rl vue-router node_modules/@nuxt/ui/dist/runtime --include='*.js' --include='*.vue' --include='*.mjs' | grep -v /runtime/vue/` → empty. Only `.d.ts` files and the standalone-Vue build (`runtime/vue/`, unused under Nuxt) reference it. Nuxt-mode `Link.vue:11`: `import { useRoute, useAppConfig } from "#imports";` — Nuxt's own router composable.
- Types: `npx nuxi typecheck` 0 errors against vue-router 5's `.d.ts`.
- Runtime: browser run below (UModal/USlideover/UPagination/USelect render; all header nav via NuxtLink; locale switch via router) — 0 errors.
- Follow-up: already tracked as #264 (`@nuxt/ui` 4.x accepts `vue-router ^4.5.0 || ^5`), which this node unblocks.

### Full re-run (vue 3.5.44 changes runtime, so everything was redone)
```
rm -rf .nuxt .output node_modules/.cache && npm run build → rc=0 "◆ ✨ Build complete in 15.4s!"; WARN 0; nuxt/server 0
npm run lint → rc=0
npx nuxi typecheck → rc=0, 0 "error TS", last line "✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons"
npm audit → 17 vulnerabilities (2 moderate, 15 high)   (baseline 50; first pass 43)
```
SSR (prod :4104 vs `scratchpad/n4/base`): all 10 routes 200, `head.cjs` → SAME ×10. `/blogs/67123bdf9c6e9bcf4f7bf006` → 200, `<title>Cài đặt iTerm2, Oh My Zsh, …`. `/api/generate-pdf?lang=vi` → `200 application/pdf 164689`, starts `%PDF-`.

Browser (dev :4102, `scratchpad/n4/func.cjs`):
- First run after the dep change: `pageerror: Failed to fetch dynamically imported module: …/nuxt/dist/app/entry.js` — dev log: `ℹ Vite discovered new dependencies at runtime: @vue/devtools-core ← …vue-devtools-client…` (Vite re-optimizes and reloads once; Nuxt devtools, dev-only).
- Second run hung (`Runtime.callFunctionOn timed out`) — debug Chrome had 6 stale localhost tabs from earlier runs; closed them (`/json/close/<id>`, left non-localhost tabs alone).
- Then two consecutive runs on a fresh dev server, both rc=0, identical:
```
click _resumegr -> / textLen=1198
click _projectsgp -> /projects textLen=1141
click _githubgh -> /github textLen=3100
click _blogsgb -> /blogs textLen=747
click _contactgc -> /contact textLen=434
keyNav dialog open: Phím tắt
dialog after Esc: false
color class: dark -> light -> dark
before switch: /github lang=vi-VN   after switch 1: /en/github lang=en-US   after switch 2: /github lang=vi-VN
hydration msgs: 0 []
other: [ 'warn: Warning: Missing `Description` or `aria-describedby="undefined"` for DialogContent.' ]   (pre-existing, A/B above)
discovered-at-runtime: 0
```

### 2. Comments
- Only comment added/changed: `composables/useResumeData.ts` `@file` block (new file). Rework removed its trailing `(#263)` — code-comments.md "Delete: Issue/PR refs". Now: "The one `api-resume` fetch for `/` and `/projects`. Nuxt 4 shares a key's data across callers and expects one handler per key." — WHY (non-obvious framework constraint), `/** */` for > 1 sentence, `@author`/`@see` after the prose matching sibling `composables/useDownloadResume.ts` (file-header opt-in is OFF; kept for consistency with the neighbour, not required).
- Other source diffs add/change no comments (`git diff -U0 -- '*.vue' '*.ts' | grep -E '^\+.*(//|/\*|\* )'` → empty).

### Acceptance rows (added/updated)
| Criterion | Evidence |
|---|---|
| `npm ls` | verbatim above; only new invalid = vue-router (accepted, proof above, follow-up #264); vue raised to 3.5.44 to meet nuxt's `^3.5.44` |
| comments per code-comments.md | `useResumeData.ts` `@file` block — WHY, no issue ref after rework; no other comments touched |
| everything else | re-run on vue 3.5.44: build/lint/typecheck rc=0, SSR SAME ×10, post 200, PDF ok, browser 0 hydration / 0 new console errors, audit 50 → 17 |

### Noticed, not done (added)
- `nuxt.config.ts` could pre-bundle `@vue/devtools-core` (`vite.optimizeDeps.include`) to avoid the one-time dev reload — dev-only, out of scope.
