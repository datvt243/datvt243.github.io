# 2026-11-05 - resume-hr-emphasis (verdict, pass 2)

- Worker: verifier · Version: 0.1.0
- Node: `resume-hr-emphasis` (#397 follow-up, branch `feature/397`, uncommitted working tree)
- Note judged: `evidence/implementer/2026-11-05/resume-hr-emphasis-diff.md` (the "Pass 2" section, after `resume-hr-emphasis-reopen.md`)
- Verdict: **SEAL** · New PM status: SEALED (archived)

## Isolation proof
Separate Agent-tool subagent for a batch of 2 nodes, spawned with the task string "You are the VERIFIER worker of the agent-hub ... (`/worker verifier` semantics, batch mode; fresh context, separate from the implementer). ... Two nodes, both follow-ups on issue #397 ... a. `resume-hr-emphasis` ... b. `resume-hr-skills-table` ...". This batch-mode string differs from the implementer's task strings. Blank context, and I did not write either diff or open the source.

## Re-run
none. I audited the note and re-ran no build, lint, test or CDP check. Read-only confirmations only: `stat` mtimes (Hr.vue 19:46:49 < `.output/server/index.mjs` 19:47:11 < `final-light-1280.png` 19:47:35 … `final-dark-375.png` 19:48:05), so the build and screenshots postdate the last source edit. I also viewed the `final-light-375.png` and `final-dark-1280.png` screenshots.

## Reasoning
| Criterion (node row) | Verdict | Cited |
|---|---|---|
| (1) Section titles > 13px, ≥ 2px accent underline | met | `h2.hr-heading`: light 1280 `20px / 800 / 2px rgb(194, 65, 12)`, dark 1280 `20px / 800 / 2px rgb(251, 146, 60)`, light 375 `20px / 2px rgb(194, 65, 12)`. |
| (2) Job titles ≥ 18px, ≥ 700 | met | `h3.hr-title` light 1280 `18px / 700, rgb(30, 41, 59)`, dark 1280 `18px / 700, rgb(226, 232, 240)`, light 375 `18px`. |
| (3) Dark + light, 1280 + 375, no overflow | met | scrollWidth/clientWidth: light 1280 1265/1265, light 375 360/360, dark 1280 1265/1265, dark 375 360/360. All four runs were on the final build with `visibilityState: "visible"`. A hidden-tab run was discarded and re-run. Screenshots are `.playwright-mcp/final-{light,dark}-{1280,375}.png`. Mock backend: `grep -c onrender` → 0. |
| build + lint + typecheck + test | met | `build=0  ◆ ✨ Build complete in 14.6s!`, `lint=0`, `typecheck=0`, `Test Files  8 passed (8)` / `Tests  20 passed (20)`. These commands match `doctrine/MEMORY.md` and the output is not truncated. |
| Comments per code-comments.md | met | "no comments touched". |

The previous REOPEN asked for a light-375 screenshot showing the titles wrapping. `final-light-375.png` shows the Skills section, not a job title. Criterion 3, as written, asks for no overflow, and the cited 360/360 plus the h3 computed size at 375 prove that. The screenshot request was not an acceptance criterion, so it does not block the seal.

## Forbidden states
None hit.

## Seal gate
No outward action. OK.

## Proportionality
OK. Pass 2 added evidence only, with no extra code for this node.

## Supersedes
none
