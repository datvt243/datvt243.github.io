# 2026-11-22 - keyboard-drop-c-shortcut (diff)
- Worker: implementer · Version: 0.1.0
- Node: `keyboard-drop-c-shortcut` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: #438 Keyboard: drop the `c` shortcut, use `gc` for contact — remove `data-shortcut="c"` from the hero "Contact me" link (and its `<kbd>` badge); the help dialog no longer lists `c`.
- Branch: `feature/438` (off `staging`, linked to #438)

## Hub bytes before: 93880
## Feature doc: doctrine/features/keyboard-navigation.md
## Feature doc changed (2): resume-home.md Behavior #6 "(shortcut `c`)" → "(no page shortcut; global `gc`)" — same operator answer (keyboard-navigation.md Q2, #438)
## Feature doc changed: Behavior #6 "Current ones: `1`–`4` resume tabs and `c` Contact me, `D` download CV (home)" → "Current ones: `1`–`4` resume tabs and `D` download CV (home); contact is only `gc` (no page-level `c`)" + Changelog row — operator: open question 2 answer (2026-11-07) "Change: keep only `gc`, drop the `c` shortcut — #438"

## Diff
| file | why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | removed `data-shortcut="c"`, `:data-shortcut-label`, `<ThemeKbd>c</ThemeKbd>` from the Contact me link (−3 lines) |
| `.claude/rules/theme.md` | "Existing:" page-shortcut list no longer names `c` contact (stale doc otherwise) |
| `agent-hub/doctrine/features/keyboard-navigation.md` | Behavior #6 + Changelog (above) |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new PENDING node row |
| `README.md` | shortcut table row `c` / `d` contact/download → `D` download (review finding 1; `d`→`D` fixed in the same row since `D` is the real key, `data-shortcut="D"`) |
| `agent-hub/doctrine/features/resume-home.md` | Behavior #6 "(shortcut `c`)" → "(no page shortcut; global `gc`)" + Changelog row (review finding 2) |

## Command (verbatim from doctrine/MEMORY.md, repo root)
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test`
Typecheck row = standalone `npx nuxi typecheck` → run.

## Output
```
build exit 0
lint exit 0
typecheck exit 0
test exit 0
config 441ms · modules 857ms · app 625ms · types 359ms · client 2.65s · server 1.64s · nitro 8.93s
◆ ✨ Build complete in 15.5s!
--- lint

> nuxt-app@1.13.2 lint
> eslint .

--- typecheck (tail)
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
--- test (tail)
 Test Files  10 passed (10)
      Tests  28 passed (28)
   Start at  18:45:53
   Duration  219ms (import 38%, transform 33%, tests 19%, worker 9%)

```
Note: `.claude/rules/theme.md` edit came after these runs; it is a markdown rule file, not read by build/lint/typecheck/test.

## Runtime check (UI)
Prod build rebuilt with `NODE_API`+`NUXT_PUBLIC_NODE_API=http://localhost:4199` (minimal scratchpad resume mock), server `PORT=4188` same env. `build 0`.
SSR `curl -s http://localhost:4188/ | grep -o 'data-shortcut="[^"]*"' | sort | uniq -c`:
```
   1 data-shortcut="1"
   1 data-shortcut="2"
   1 data-shortcut="3"
   1 data-shortcut="4"
   1 data-shortcut="D"
```
Browser: puppeteer-core `connect` to Chrome :9888, **incognito context** (`createBrowserContext()`, per PROJECT.md Vimium trap — the default context swallowed `?`/`g`, a first run there showed no dialog and no `gc` nav), viewport 1280×900, real `keyboard.press`/`type`:
```
{
 "vis": "visible",
 "afterC": "http://localhost:4188/",
 "dialog": [
  "Phím tắt Phím tắt Đi tới _resume gr Đi tới _projects gp Đi tới _github gh Đi tới _contact gc Cuộn xuống j Cuộn lên k Lên đầu trang gg Xuống cuối trang G Bật/tắt bảng trợ giúp ? Trên trang này Tải CV D experiences.pug 1 skills.ts 2 educations.json 3 languages.json 4 Đang dùng Vimium hoặc extension tương tự? ..."
 ],
 "dialogAfterClose": 0,
 "afterGC": "http://localhost:4188/contact",
 "h": "Liên hệ"
}
```
`grep -c onrender server.log` → `0`; mock log: `GET /api/me/<email>?lang=vi` only.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) No `data-shortcut="c"`/label/`c` kbd in Hero.vue | `grep -rn 'data-shortcut="c"' themes tests app.vue` → no output, exit 1; diff above (−3 lines) |
| (2a) `c` on `/` does nothing | `"afterC": "http://localhost:4188/"` |
| (2b) `?` dialog "On this page" has no `c`/Contact, still has `D` | dialog text: "Trên trang này Tải CV D experiences.pug 1 … 4" — no Contact entry; contact only as "Đi tới _contact gc" |
| (2c) `gc` still → `/contact` | `"afterGC": "http://localhost:4188/contact"`, `"h": "Liên hệ"` |
| (3) build+lint+typecheck+test clean | exits 0 ×4; `Build complete`; `Test Files 10 passed (10)`, `Tests 28 passed (28)` |
| (4) matches features/keyboard-navigation.md Behavior #6 | doc updated per operator answer; code now = new Behavior #6 |
| comments per code-comments.md | no comment added or changed (diff is deletions only) |
| Coverage: no other `c` page shortcut / hardcoded `c` in KeyNav | `grep -rn 'data-shortcut="c"' themes tests app.vue` → none; KeyNav "On this page" = `querySelectorAll('[data-shortcut]')` (`KeyNav.vue:27`), no literal `c` |

## Supersedes: none
`grep -n "#438" haven/diagrams/dev-loop.prime-mermaid.md` → only this node's row.
## Still open: none

## Review
`/code-review medium` (background fork): no correctness bug — "removal is complete and consistent with KeyNav.vue … plain `c` now matches nothing … `gc` still reaches `/contact` via menuPrimary `key: 'c'` … no tests reference `c`". 3 findings:
1. README.md:78 shortcut table still lists `c` → **fixed** (row now `D` download resume).
2. features/resume-home.md:36 still says "(shortcut `c`)" → **fixed** (+ Changelog row).
3. Hero.vue:57 Contact me has no key badge now; suggests a `gc` badge → **false positive**: the issue (#438) explicitly says remove the `<kbd>` badge; `gc` is shown in the header tab hint + `?` dialog (Behavior #8). Not re-adding.
Post-review edits are markdown only (README, agent-hub docs) — no rebuild needed; build/lint/typecheck/test outputs above still cover all code.

## Noticed, not done
- README.md shortcut table says tabs `1`–`5`; code/docs have `1`–`4` (pre-existing, out of #438 scope).

## Seal gate: none (no commit/push/external call in this pass)
