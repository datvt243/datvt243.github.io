# 2026-10-24 - deps-i18n-10 (diff)

- Worker: implementer · Version: 0.1.0
- Node: `deps-i18n-10` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #261 (Phase 3.4 of #266), branch `feature/261`
- Status: `sealed_pending_verifier`

## Hub bytes before
77958

## Diff
| File | Why |
|---|---|
| `package.json` | `"@nuxtjs/i18n": "^9.5.6"` → `"^10.6.0"` (via `npm install @nuxtjs/i18n@^10.6.0`) |
| `package-lock.json` | same install (vue-i18n 11.4.16) |
| `agent-hub/evidence/implementer/2026-10-24/deps-nuxt-image-2-diff.md` | appended `## Correction` — that note missed the `nuxt/server` warning #259 introduced (found while checking this node's build); NEVER-DELETE rule → correction added, nothing removed |
| `haven/diagrams/dev-loop.prime-mermaid.md` | node row |

No config or source change (see plan).

## Command
`npm install @nuxtjs/i18n@^10.6.0` · `npm ls vue-i18n @nuxtjs/i18n` · `npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm audit` · `scratchpad/i18n/head.sh` (prod 4062) · `scratchpad/i18n/cdp-switch.cjs` / `cdp-text.cjs` / `cdp-switch-req.cjs` (dev)

## Output
- `npm ls`: `@nuxtjs/i18n@10.6.0`, `vue-i18n@11.4.16` (+ a nested `vue-i18n@10.0.8` under `@intlify/unplugin-vue-i18n@11.2.7`'s own tree)
- **#75 error did NOT recur**: `npm run build` → rc=0, `└  ✨ Build complete!`; `grep -i "import.meta"` → none. The `optimizeTranslationDirective` warning is gone (option removed in v10): count 1 → 0.
- Remaining build warnings: 12 × `nuxt/server` from `@nuxt/image` — identical count (12) in the pre-change staging build (`b0.log`), so not from this node (introduced by #259, see Correction).
- lint rc=0, 0 problems; typecheck rc=0, 0 `error TS`
- audit: `52` → `49 vulnerabilities (1 low, 2 moderate, 43 high, 3 critical)`

## Browser / HTML verification
**SSR head, 10 routes** (`/`, `/en`, `/blogs`, `/en/blogs`, `/github`, `/en/github`, `/contact`, `/en/contact`, `/projects`, `/en/projects`): raw `diff` v9 vs v10 differs only in (a) v10 adds `id="i18n-alt-…"`/`i18n-can`/`i18n-xd`/`i18n-og…` attributes, (b) tag order. Normalized (strip `id="i18n-*"`, sort per route) → `routes: 10 semantically identical (ignoring i18n id attr, order): 10`. Same `lang`, hreflang set (incl. `x-default`), canonical, og:locale, titles.

**Switcher** (dev 4063, real click on the header VI/EN button, 1440×900):
```
start {"path":"/github","lang":"vi-VN",...,"btn":"vi"}  ->  {"path":"/en/github","lang":"en-US",...,"btn":"en"}  ->  {"path":"/github","lang":"vi-VN",...}
start {"path":"/blogs","lang":"vi-VN",...}               ->  {"path":"/en/blogs","lang":"en-US",...}          ->  {"path":"/blogs","lang":"vi-VN",...}
hydration msgs: 0 []
console issues: none
/ cv button: Tải CV d   →   /en cv button: Download CV d
```
**Dev-server log `Cache write error. ENOENT ... '/cache/nitro/handlers/api-resume/apipost….json'`** (×18 during the browser run): A/B proved pre-existing — same CDP script on i18n 9.5.6 (staging package files swapped in, `npm ls` confirmed) → identical `/api` requests (`2 × GET /api/blogs/posts?page=1&perPage=20&category`, `1 × GET /api/github`) and the same 18 errors; with plain curl both versions → 0. Cause: `nuxt.config.ts` `$development.nitro.storage.PostDetail = { driver: 'fs', base: '/cache' }` (absolute root path). Restored afterwards: `npm ls` → `@nuxtjs/i18n@10.6.0`.

## Acceptance
| Criterion | Evidence |
|---|---|
| i18n 10.6.x | `npm ls` |
| build/lint/typecheck clean, #75 error absent | rc=0 ×3; no `import.meta` error |
| SSR head of 10 routes identical to v9 | semantically identical 10/10; raw diff only adds `id` attrs + order (disclosed — not literally byte-identical as the row says) |
| switcher vi→en→vi keeps route + translates | switcher output + `Tải CV` → `Download CV` |
| 0 hydration (dev) | `hydration msgs: 0 []` |
| audit before/after | 52 → 49 |
| Comments per code-comments.md | N/A |

## Supersedes: none
## Noticed, not done
- Dev-only `PostDetail` fs storage at absolute `/cache` fails every write (pre-existing) — should be a relative path like `.cache/` or `./.data/cache`. Not this node.
- v10 deprecates function `baseUrl` (string still fine) and `types` other than `composition` — repo uses neither.

## Seal gate
none.

---

## Rework 1 (after REOPEN `evidence/verifier/2026-10-24/deps-i18n-10-reopen.md`)
- Node row criterion clarified in place (dated): head values compared after stripping `id="i18n-*"` and sorting per route.
- `## Acceptance criteria clarified`: "byte-identical to the v9 baseline" → "identical after stripping v10's `id="i18n-*"` attributes and sorting tags per route".
- Missing command, recorded: `sed -E 's/ id="i18n-[^"]*"//' v10-head.txt > v10s.txt`, then `python3 -I - v9-head.txt v10s.txt` (groups lines by `== <route>` header, sorts each block, compares per route) → `routes: 10 semantically identical (ignoring i18n id attr, order): 10`. All artifacts in `scratchpad/i18n/`.
