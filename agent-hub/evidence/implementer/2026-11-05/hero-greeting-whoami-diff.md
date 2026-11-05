# 2026-11-05 - hero-greeting-whoami (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `hero-greeting-whoami` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #383, created by `/todo` from the operator's request "câu "Hi there! I am _" hãy xem xét giúp tôi câu khác nghe "dev" hơn". The operator picked `$ whoami` from 4 options via AskUserQuestion; the preview they chose was `$ whoami_` above the name. Branch `feature/383` is off `staging` 296d2b4, created with `gh issue develop`.
- Status: `sealed_pending_verifier`

## Hub bytes before
79739 (measured before the node row was appended)

## Diff
| File | Change |
|---|---|
| `i18n/locales/en.json:25` | `"greeting": "Hi there! I am"` → `"$ whoami"` |
| `i18n/locales/vi.json:25` | `"greeting": "Xin chào! Tôi là"` → `"$ whoami"` (same text in both locales, as the operator chose) |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue:35` | dropped the space between `{{ t('resume.greeting') }}` and the `_` span, so it renders `$ whoami_` like a prompt cursor |
| `haven/diagrams/dev-loop.prime-mermaid.md` | node row appended |

`grep -rn "resume.greeting"` → only `Hero.vue:35` uses the key.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (from `doctrine/MEMORY.md`), from the repo root.

## Output
```
build=0   ◆ ✨ Build complete in 14.9s!  (only WARN: the pre-existing components-*.js "A comment" / @__NO_SIDE_EFFECTS__ one)
lint=0
typecheck=0 ts_errors=0
test=0    Test Files  8 passed (8) /      Tests  20 passed (20)
```

## UI (criterion 2)
- **Setup:** prod build on :4188 with `node --import redirect.mjs`. `NODE_API`/`NUXT_PUBLIC_NODE_API`/`NUXT_NODE_API` pointed at the mock on :4199, which is a copy of the 2026-11-05 csp mock in this session's scratchpad `m/`.
- **SSR:** `curl` returned:
  ```
  /: <p class="text-theme-accent-soft mb-4">$ whoami<span class="text-theme-text">_</span></p>
  /en: <p class="text-theme-accent-soft mb-4">$ whoami<span class="text-theme-text">_</span></p>
  ```
- **Browser (Playwright MCP):** loaded `/en`, clicked `button[aria-label*="Switch language"]`, then waited 2.5s.
  ```
  {"vis":"hidden","before":"$ whoami_","afterSwitch":"$ whoami_","lang":"vi-VN","url":"http://localhost:4188/"}
  ```
  The tab was hidden, but the switch still completed (lang and url changed), so the client-side vue-i18n render of `$` is confirmed.
  Console: `Total messages: 0 (Errors: 0, Warnings: 0)`.
- **Mock:** server log `onrender=0`, so the real backend was never called.
- Not checked: light mode, and how it looks visually (screenshot). Only text and markup were changed, and the classes are unchanged.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 `resume.greeting` = `$ whoami` in en + vi | Diff table rows 1–2 |
| 2 `$ whoami_` on `/` and `/en`, real browser | UI block (SSR curl, browser before/after the switch, 0 console messages) |
| 3 build + lint + typecheck + test clean | Output block |
| comments per code-comments.md | No comments added or changed |

## Supersedes: none
## Still open: none
## Noticed, not done
- Hero's `<p>` reads as `$ whoami_` to screen readers, the same way "Hi there! I am _" did before. No a11y change was asked for.

## Seal gate
none (commit/push left to `/ship`)
