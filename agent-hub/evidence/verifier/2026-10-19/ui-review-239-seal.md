# 2026-10-19 - ui-review-239 (verifier verdict: SEAL)

- Worker: verifier · Version: 0.1.0
- Node: `ui-review-239` (`haven/diagrams/dev-loop.prime-mermaid.md`, issue #239), iteration 2 after `ui-review-239-reopen.md`
- Note graded: `evidence/implementer/2026-10-19/ui-review-239-diff.md` ("Rework after REOPEN #1" section), against `gh issue view 239` and `git diff` on `bug/239`
- New PM status: **SEALED** (row flipped in place, IN_PROGRESS → SEALED)

## Isolation proof
Separate subagent spawned via the Agent tool with the verifier task string "You are the **verifier** worker … Two nodes to verify … A) `ui-review-239` — iteration 2 after a REOPEN … B) `hero-contact-to-page` …". That is not the implementer's task string (issue #239's body / the operator's Vietnamese one-liner). This context wrote no part of the diff, so `NeverVerifyOwnWork` holds.

## Re-run
`partial`: `npm run build`, `npm run lint`, `npx nuxi typecheck` re-run on the working tree, plus my own browser script on `:3458`. Reason: the previous pass found the note had hidden a lint warning, and the caller asked for an independent re-run.

## Commands (Node v24.19.0, repo root)
- `npm run build`: exit 0, `└  ✨ Build complete!`. Only noise: the pre-existing `[@nuxtjs/i18n] WARN bundle.optimizeTranslationDirective` and `[@nuxt/image] WARN sharp binaries for darwin-arm64` lines.
- `npm run lint`: exit 0, full output:
  ```
  > nuxt-app@1.2.9 lint
  > eslint .
  ```
  No problems line (REOPEN #1 had `✖ 1 problem (0 errors, 1 warning)`).
- `npx nuxi typecheck`: exit 0, `error TS` count 0.

## REOPEN #1 reasons
| Reason | Now |
|---|---|
| 1. Lint warning `app.vue:8 vue/attributes-order` | Fixed: `class` now precedes `@click.prevent` on the skip link; lint output above has no problems |
| 2. Missing comments row + stale `h3` comments | Fixed: note's `## Acceptance` has the "comments per code-comments.md" row. `Experiences.vue` line 3 (`article/h2/p/…`) and the `.position` comment (`push the \`h2\` glyph`) now say `h2`. Added comments (`app.vue` skip-link block + theme-color `//`; `Index.vue` `//` on router.replace, onMounted, watch) are single-sentence WHY notes, no issue refs, none restate the code |
| 3. Tab/URL desync | Fixed: 26/26 `SYNC` assertions pass (active tab always matches `?tab`), on `/` and `/en` |

## Browser (own script)
- Script: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/verifier-239/v3.cjs` (base: my REOPEN #1 `v.cjs`, 404 skip-link/theme-color asserts dropped as accepted there, `gr` INFO turned into an assert) + `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/verifier-239/v3-extra.cjs` (new sync + hero checks). Output: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/909a3f24-74c6-4b9c-819a-fc85ca8e1ff7/scratchpad/verifier-239/run3.txt`.
- Prod build on `:3458`, headless Chrome, fresh `userDataDir`, wait for `#__nuxt.__vue_app__`.
- `TOTAL 246 pass / 2 fail`, `WARNINGS: 0` (no Vue warn / hydration / pageerror on any page, width or mode).
- The 2 fails are the same two triaged as non-bugs in REOPEN #1: `svg imgs 26, missing dims 17` (`Skills.vue` `.line-icon` imgs, not in the issue; Hero's tech imgs carry width/height) and `click tab 5 autoscroll {"top":392}` (scroll clamp at page bottom).

| Check | Result |
|---|---|
| Tab/URL sync | `/?tab=skills` → active 2. Keys 3,5,1,4 and clicks 2,5 → active always equals `?tab` (`key 1: active=1 url=/`). `gr` from `?tab=languages` → `{"a":"1","q":""}`. Header `_resume` from `?tab=education` → `{"a":"1","q":""}`. Back → `active=4 url=/?tab=education`, Forward → `active=1 url=/`. `gb` then Back → `?tab=experience` with tab 3. `?tab=nope` → active 1. Same on `/en` |
| Autoscroll | Skip link then key `3` → filetab `top=12`, `?tab=experience`, no hash. After Back from `/blogs`, key `2` → `top=12` (both locales) |
| Skip link | `/`, `/en`, `/contact`, `/github`, `/blogs` × 1280/360 × dark/light: hidden before focus, first Tab visible (`w=235 h=38`), Enter → `main-content` focused, `hash=""` |
| theme-color | `#020617` dark / `#ffffff` light on every `app.vue` page |
| rel=noopener | 24/24 page combos pass, incl. `/contact` and `/github` (were missing in REOPEN #1) |
| Rest of issue checklist | Unchanged from REOPEN #1 and still passing: no h-overflow (pages + 5 tabs at 360), `overflow-wrap: anywhere`, `aria-pressed` one-true per tab, `aria-expanded` toggles, headings `H1…H2` no skip, avatar `alt=""`, h1 `text-wrap: balance`, lang label-in-name, no header `<label>`, `translate=no` ≥10, contact focus ring `rgb(189, 147, 249) 0px 0px 0px 1px` |
| Shortcuts | `j`/`k`, `?`, `d` → `/api/generate-pdf`, `gp`, `gh`, `/` focuses search (`Tìm tên repo…`), Esc blurs |

## Forbidden states / gate / proportionality
- `ADHOC_WORK` no, `NO_EVIDENCE` no, `CODE_IN_HAVEN` no, `DIAGRAM_DRIFT` no, `EDIT_UNVERIFIED` no (lint/typecheck now verbatim clean).
- Seal gate: nothing outward-facing (no commit/push/PR).
- Proportionality: rework is the 3 REOPEN fixes plus `rel` on two links the REOPEN itself flagged as a one-attribute option. No "tests pass" claim.

## Doubts (non-blocking)
- `gr` from a tabbed URL resets the tab but does not scroll to top (`scrollY=328` after). Same-path query change; the watch deliberately doesn't scroll. Before this diff `gr` on `/` was a same-URL no-op, so not a regression.
- `?tab=nope` leaves the bogus query in the URL while showing the default tab (consistent with "unknown → default").
- Not checked: real screen readers, Safari/Firefox, toast `aria-live`.
