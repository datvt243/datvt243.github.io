# 2026-10-19 - header-drop-brand-desktop (verifier SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `header-drop-brand-desktop` (IN_PROGRESS → SEALED)
- Implementer note: `evidence/implementer/2026-10-19/header-drop-brand-desktop-diff.md`
- Task (verbatim): "header có vẻ hơi chật rồi, hãy bỏ _datvt243"
- Verdict: **SEAL** (the scope call is flagged for the operator below)

## Isolation proof
Spawned as a separate verifier subagent with its own task string ("You are the **verifier** worker ... Node: `header-drop-brand-desktop` ... judge it independently"), scratch dir `scratchpad/verifier-hdr` and server port 3458. The implementer used `scratchpad/hdr` and port 3457.

## Re-run
`partial`: build, lint and typecheck were re-run, and an independent CDP script was used. The reason is that the operator's spawn instruction explicitly asked for an independent re-run. The implementer also left one gap (768px was not checked), and this pass covers it.

## Command / Output (Node v24.19.0, repo root)
- `npm run build`: exit 0, `[nitro] ✔ You can preview this build using node .output/server/index.mjs` / `└  ✨ Build complete!`
- `npm run lint`: `> eslint .`, exit 0, no output
- `npx nuxi typecheck`: exit 0, `error TS` count 0

## Browser verification
The script is `scratchpad/verifier-hdr/v.cjs`. It runs puppeteer-core with headless Chrome on a fresh temp profile against the prod build at `:3458/github` and waits for `#__nuxt.__vue_app__`. The matrix covers {dark, light} × {vi, /en} × {1440, 1024, 768, 390}.
Result: **76 pass / 0 fail**.
- The `html` class matches the forced color mode in all 16 combinations.
- The brand is hidden at 1440 and 1024 and visible at 768 and 390, in every mode and locale.
- Overflow (header row scrollWidth−clientWidth, and document) is 0 in all 16 combinations.
- Header height is 46px at lg+ and 45px below lg, so the header stays on one line everywhere.
- `gr` goes to `/` (vi) and `/en` (en) at 1440 and 1024, in both modes.
- At 390 the hamburger opens the slideover (`[role=dialog]` is present) in all 4 combinations.
- Screenshots are in `scratchpad/verifier-hdr/*.png` (14 files). In `dark-vi-1024.png` the tab bar starts at `_resume gr` and ends at `_contact gc | ? | VI | ☀`, with no brand and nothing cramped. `light-vi-390.png` reads `_datvt243 | VI | ☾ | ☰`.

## Acceptance criteria
| Criterion | Evidence |
|---|---|
| Brand is gone at lg+ | brand visible=false at 1440 and 1024 ×4 |
| Brand is kept below lg | visible=true at 768 and 390 ×4 |
| No header or document overflow | 0/0 in all 16 combinations |
| `gr` still reaches home | 8/8 |
| build + lint + typecheck clean | see above |
| Comments follow code-comments.md | The diff is a single class token with no comment added, and none is needed |

Forbidden states: none hit. The change is not outward-facing because it is uncommitted, so no seal-gate approval is needed. Proportionality is fine: the diff is one class token.

## Scope call (flagged for the operator)
The operator wrote "hãy bỏ _datvt243", which literally means remove it, with no breakpoint named. The motivation was "header có vẻ hơi chật", and the only crowded layout is the desktop tab bar. On mobile the brand sits alone beside VI, the theme toggle and the hamburger, and has plenty of room. I judge hiding it only at lg+ to be **defensible**, because it targets the stated reason. It is still **narrower than the literal words**. If the operator meant "everywhere", the fix is one word: `lg:hidden` → `hidden` (or delete the `<NuxtLink>`). Please confirm.
