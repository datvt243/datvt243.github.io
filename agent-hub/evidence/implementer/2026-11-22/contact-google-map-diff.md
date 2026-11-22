# 2026-11-22 - contact-google-map (diff)
- Worker: implementer · Version: 0.1.0
- Node: `contact-google-map` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: "#437 Contact: remove the unused `contact.google_map` config — app.config.ts has contact.google_map but nothing renders it. Expected: remove it. (branch feature/437 already checked out)"
- Plan: `evidence/implementer/2026-11-22/contact-google-map-plan.md`

## Hub bytes before: 93668
## Feature doc changed: doctrine/features/contact.md — removed Out-of-scope bullet "The `google_map` value in `app.config.ts` (not rendered anywhere)" (the value no longer exists); Changelog row 2026-11-22. Behavior unchanged; this is the operator's OQ2 answer.

## Diff
| File | Why |
|---|---|
| `app.config.ts` | Delete `contact.google_map` (2 lines). Nothing else. |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | New node row `contact-google-map` (IN_PROGRESS). |
| `agent-hub/doctrine/features/contact.md` | See Feature doc changed. |

```
--- a/app.config.ts
+++ b/app.config.ts
@@ -43,8 +43,6 @@ export default defineAppConfig({
       linkedin: 'https://www.linkedin.com/in/datvt243/',
       website: 'https://resume-nuxt-vert.vercel.app',
     },
-    google_map:
-      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31028.537744975543!2d106.63287150003738!3d10.803360191242497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293818af3a73%3A0xcd8d16d1180acc8b!2zVMOibiBCw6xuaCwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1727518723765!5m2!1svi!2s',
   },
```

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (verbatim from `doctrine/MEMORY.md`, repo root)

## Output
Exit codes: `build exit 0` · `lint exit 0` · `tc exit 0` · `test exit 0`

build (tail):
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 216ms · modules 655ms · app 594ms · types 403ms · client 2.85s · server 1.82s · nitro 9.23s
◆ ✨ Build complete in 15.7s!
```
lint (full):
```
> nuxt-app@1.13.2 lint
> eslint .
```
typecheck (full):
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```
`grep -ci "error TS"` on typecheck output → `0`

test (tail):
```
 Test Files  10 passed (10)
      Tests  28 passed (28)
   Start at  19:03:46
```

grep (post-diff, excl. node_modules/.nuxt/.output/.git/.vercel/evidence/histories):
```
agent-hub/doctrine/features/contact.md:49:2. `contact.google_map` exists in `app.config.ts` but nothing renders it.
agent-hub/doctrine/features/contact.md:60:| 2026-11-22 | Removed the unused `contact.google_map` config; ... |
```
(Pre-diff the only non-doc hit was `app.config.ts:46`.)

Prerendered output (`grep -o … | sort | uniq -c`):
```
.output/public/contact/index.html:     4 0385262510 · 3 Tân Bình, Hồ Chí Minh · 6 votan.it@gmail.com
.output/public/en/contact/index.html:  4 0385262510 · 3 Tan Binh, Ho Chi Minh · 6 votan.it@gmail.com
google.com/maps → 0 hits in both
```

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. No code/config `google_map` hit | post-diff grep: only contact.md OQ2 + Changelog (historical) |
| 2. No rendered change (Behavior #1-#2) | both prerendered pages still carry phone/email/locale-correct address |
| 3. build + lint + typecheck + test clean | all exit 0, `Build complete`, eslint silent, 0 `error TS`, `Tests 28 passed (28)` |
| comments per code-comments.md | Diff adds no comment |

No browser check: config-only removal of a value nothing read; prerendered HTML above covers the page.

## Supersedes: none
`grep -n "#437" haven/diagrams/dev-loop.prime-mermaid.md` → only this node's row.
## Still open: none

## Review
`/code-review medium` done inline (2-line config deletion): touched file in full + every reader of `useAppConfig().contact` (grep `google_map` pre-diff: 0 readers). No correctness/security findings; no cleanup findings.

## Noticed, not done
- #438 (`keyboard-drop-c-shortcut`) was asked in the same /todo run but is already SEALED + merged to staging (#467); the issue stays open until `main` gets it via /release. Not re-done.

## Seal gate: none (no outward-facing action)
