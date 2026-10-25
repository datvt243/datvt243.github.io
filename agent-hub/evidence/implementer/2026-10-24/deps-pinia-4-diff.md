# 2026-10-24 - deps-pinia-4 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-pinia-4` (`haven/diagrams/dev-loop.prime-mermaid.md`, last row)
- Task: issue #265 "chore(deps): Phase 3.1 — pinia 2→4 + @pinia/nuxt 0.5→1" (Phase 3.1 of #266), branch `feature/265`
- Status: `sealed_pending_verifier`

## Hub bytes before
76703

## Diff
| File | Why |
|---|---|
| `package.json` | `"@pinia/nuxt": "^0.5.4"` → `"^1.0.3"`, `"pinia": "^2.2.2"` → `"^4.1.0"` (via `npm install pinia@^4.1.0 @pinia/nuxt@^1.0.3`, no hand edit) |
| `package-lock.json` | Lockfile update from the same `npm install` |
| `haven/diagrams/dev-loop.prime-mermaid.md` | New node row appended |

No source change needed: `stores/resume.ts` (options-API `defineStore`, getters using `this.*`) and all 9 `useResumeStore()` consumers compile and typecheck unchanged against pinia 4.

## Command
```
npm install pinia@^4.1.0 @pinia/nuxt@^1.0.3
npm ls pinia @pinia/nuxt @vue/devtools-api
npm run build
npm run lint
npx nuxi typecheck
npm audit
```

## Output
- `npm ls`: `@pinia/nuxt@1.0.3` → `pinia@4.1.0 deduped`; `pinia@4.1.0` → `@vue/devtools-api@8.2.1` (peer satisfied; `vue-router`/`vue-i18n` keep their own `@vue/devtools-api@6.6.4`)
- `npm install` tail: `npm warn allow-scripts   sharp@0.32.6 (install: node-gyp rebuild)` / `unrs-resolver@1.12.2 (postinstall ...)` — npm's install-script gate, not related to pinia (see Noticed)
- `npm run build` → rc=0, `└  ✨ Build complete!`. Only warning: `[@nuxtjs/i18n]  WARN  bundle.optimizeTranslationDirective is enabled by default...` — present verbatim in the pre-change builds too (`grep -c optimizeTranslationDirective` = 1 in both earlier build logs this session)
- `npm run lint` → rc=0, no problems (baseline also 0)
- `npx nuxi typecheck` → rc=0, `grep -c "error TS"` = `0` (baseline 0)
- `npm audit` → `60 vulnerabilities (1 low, 3 moderate, 52 high, 4 critical)` (baseline identical — 60 → 60; pinia was not an audit source)

## Browser verification
Production build (`node .output/server/index.mjs`, PORT 3997, `.env` loaded) driven over Chrome CDP :9888 (`Chrome/155.0.8059.85`) with `puppeteer-core`, viewport 1440×900. Script: `scratchpad/cdp-pinia.cjs`.
```
/ -> {"h1":"Võ Tấn Đạt","textLen":1198,"hasPinia":23}
projects link found: true
/projects (click) -> {"path":"/projects","textLen":1141,"sample":"... PROJECTS Gitlap Laravel Mongo Pinia Typescript SAPUI5 Vue3 Dự án 1 // _simplemdg SimpleMDG Vai trò: Frontend "}
/en -> {"lang":"en-US","textLen":1200}
console issues: none
```
- `hasPinia: 23` = `window.__NUXT__.pinia.resume.resume` has 23 keys → SSR-serialized store state hydrated.
- `/projects` reached by a real `click()` on the visible header link (SPA nav), projects rendered from `store.projects`.
- Console filter excluded exactly one pre-existing error class: `VisitTracker.client.ts`'s `POST .../api/me/<email>/visit` CORS failure (+ its `Failed to load resource`). Proven unrelated: the plugin doesn't touch pinia, is unchanged on this branch (`git diff --stat staging -- plugins` empty, last touched `a02d772` 2026-10-04), and the backend's preflight returns no `Access-Control-Allow-Origin` for ANY origin — `curl -X OPTIONS -H "Origin: https://resume-nuxt-vert.vercel.app"` → `HTTP/2 200` with no ACAO header, same as for localhost.
- Hydration warnings: a production build does not print Vue hydration-mismatch warnings, so "0 hydration warnings" is not provable from this run — not claimed. Verified instead: SSR state present + client nav works + 0 page errors.

## Acceptance
| Criterion | Evidence |
|---|---|
| pinia 4.1.x / @pinia/nuxt 1.0.x installed | `npm ls` lines above |
| build clean | rc=0, `✨ Build complete!`, only pre-existing i18n warning |
| lint clean | rc=0, 0 problems |
| typecheck clean | rc=0, 0 `error TS` |
| npm audit before/after | 60 → 60 |
| `/`, `/projects`, `/en` render store data, real click-nav, 0 console errors | CDP output above (with the one documented pre-existing CORS exclusion) |
| 0 hydration warnings | NOT provable on a prod build — see Browser verification; not claimed |
| Comments per code-comments.md | N/A — no source comments added/changed |

## Supersedes: none
(grep `#265` in active diagram → only this row)

## Noticed, not done
- Backend `POST /api/me/:email/visit` CORS preflight has no `Access-Control-Allow-Origin` for the production origin either → visit tracking likely failing in production. Backend repo issue, out of scope here.
- `npm install` now prints `allow-scripts` warnings (`sharp@0.32.6`, `unrs-resolver`): npm is gating install scripts. `sharp`'s native build not running matches the Phase 2 note (ipx JS fallback). Relevant for #259 (@nuxt/image 2), not this node.

## Seal gate
none — no commit/push/PR in this pass.

---

## Rework 1 (after REOPEN `evidence/verifier/2026-10-24/deps-pinia-4-reopen.md`)
REOPEN reason: "0 hydration warnings" criterion had no evidence (prod build can't show them).

### Hydration check — dev server
`npx nuxi dev --port 3998` (pinia 4.1.0 / @pinia/nuxt 1.0.3), same CDP script + a `/hydrat/i` counter on every console message (`scratchpad/cdp-pinia-dev.cjs`), viewport 1440×900, same CORS exclusion:
```
/ -> {"h1":"Võ Tấn Đạt","textLen":1184,"hasPinia":23}
projects link found: true
/projects (click) -> {"path":"/projects", ... "PROJECTS Gitlap Laravel Mongo Pinia Typescript SAPUI5 Vue3 Dự án 1 // _simplemdg SimpleMDG ..."}
/en -> {"lang":"en-US","textLen":1200}
hydration msgs: 0 []
console issues: [
  'warn: [nuxt] [useAsyncData] Incompatible options detected for "api-resume" (used at http://localhost:3998/_nuxt/themes/portfolio-dev/pages/projects/Index.vue:25:55):\n- different handler\n...'
]
```

### The one dev warning — A/B proves it pre-exists
- Source: two `useAsyncData('api-resume', ...)` calls with different arrow handlers — `pages/index.vue:18` and `themes/portfolio-dev/pages/projects/Index.vue:11` (last touched `19fc36c` 2026-10-04); fires on SPA nav `/` → `/projects`. No `.vue`/`.ts` changed on this branch (`git diff --stat staging -- '*.vue' '*.ts'` empty).
- A/B: restored `staging`'s `package.json` + `package-lock.json`, `npm install` → `npm ls` showed `pinia@2.2.4`; same dev server + same script → `hydration msgs: 0 []` and the **identical** `api-resume` "different handler" warning. Then restored this branch's files + `npm install` → `npm ls` back to `pinia@4.1.0`, `git diff --stat package.json` = `2 insertions(+), 2 deletions(-)` (same diff as before).

### Typecheck, verbatim last line (non-blocking ask)
`npx nuxi typecheck` → last line `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`, exit code `0` (vue-tsc prints nothing when there are 0 errors).

### Acceptance row update
| Criterion | Evidence |
|---|---|
| 0 hydration warnings | dev server: `hydration msgs: 0 []` on `/`, `/projects` (click), `/en`; same 0 on pinia 2 baseline |

### Noticed, not done (added)
- Duplicate `useAsyncData` key `api-resume` with different handlers (`pages/index.vue:18` vs `projects/Index.vue:11`) — pre-existing Nuxt dev warning; would become a real data-sharing issue under Nuxt 4 (#263). Fix = move to one composable. Out of scope here.
