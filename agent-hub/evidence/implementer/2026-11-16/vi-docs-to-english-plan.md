# 2026-11-16 - vi-docs-to-english

- Worker: implementer
- Version: 0.1.0
- Node: `vi-docs-to-english` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): "kiểm tra các file skill md, agent-hub và các file md ở root, nếu content là tiếng Việt, hãy đưa về tiếng Anh" — issue #459 https://github.com/datvt243/datvt243.github.io/issues/459, branch `feature/459`

## Hub bytes before
95193

## Feature doc
none — docs/tooling-only task, touches no product feature.

## Scope decision
Scanned with the Vietnamese-diacritic class
`[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]`
over root `*.md`, `.claude/**/*.md`, `agent-hub/**/*.md` minus `evidence/`
and `histories/`.
- Translated (Vietnamese prose): `.claude/skills/todo/SKILL.md` (103/166
  lines), `.claude/skills/worker/SKILL.md` (53/86), `README.md` (58/103).
- Kept as-is, deliberately:
  - `agent-hub/haven/diagrams/dev-loop-archive.md` (35 lines): every hit is a
    verbatim operator quote (e.g. "tách link github ra 1 dòng riêng") or a real
    `vi` locale/UI string (e.g. "Đang tìm việc", `Địa chỉ:`). The archive's own
    contract is "each row's full original text verbatim" — translating would
    falsify quotes.
  - 1-line hits in `CLAUDE.md`, `agent-hub/{README,NORTHSTAR,CLAUDE}.md`,
    `doctrine/domains/PROJECT.md`, `doctrine/features/{error-page,contact,resume-home,seo-feeds}.md`:
    proper names (Võ Tấn Đạt, Tân Bình, Hồ Chí Minh) or real UI strings
    ("Trang này không tồn tại", "Đạt Võ - Blog").
  - `agent-hub/evidence/**` and `agent-hub/histories/**`: audit trail
    (`evidence/README.md` "VERBATIM, ALWAYS"/"NEVER DELETE"; CLAUDE.md: histories "keep, don't write to it").

## Diff
| File | Why |
|---|---|
| `.claude/skills/todo/SKILL.md` | Vietnamese → English; frontmatter keys, step numbering (1.1–1.6, 1b, 2–5), commands, report templates unchanged |
| `.claude/skills/worker/SKILL.md` | Vietnamese → English; sections 1–8 + both callouts kept |
| `README.md` | Vietnamese → English; TOC anchors rewritten to match the new English headings |
| `haven/diagrams/dev-loop.prime-mermaid.md` | New PENDING node row (NodeBeforeCode) |

Not part of this diff: `.claude/skills/issues-ls/SKILL.md` was already modified
(uncommitted) on `staging` before this task started and carried onto the branch.

## Command
`npm run build` · `npm run lint` · `npx nuxi typecheck` · `npm test` (repo root, from `doctrine/MEMORY.md`)

## Output
```
◆ ✨ Build complete in 16.8s!
> nuxt-app@1.13.2 lint
> eslint .
lint exit=0
typecheck exit=0
 Test Files  10 passed (10)
      Tests  28 passed (28)
```
Post-diff scan (file: count of lines with a diacritic):
```
1 ./README.md          (line 3: "**Võ Tấn Đạt**" — name)
1 ./CLAUDE.md
1 agent-hub/README.md
1 agent-hub/NORTHSTAR.md
1 agent-hub/CLAUDE.md
35 agent-hub/haven/diagrams/dev-loop-archive.md
1 agent-hub/doctrine/domains/PROJECT.md
1 agent-hub/doctrine/features/error-page.md
1 agent-hub/doctrine/features/contact.md
1 agent-hub/doctrine/features/resume-home.md
1 agent-hub/doctrine/features/seo-feeds.md
```
`.claude/skills/todo/SKILL.md` and `.claude/skills/worker/SKILL.md` no longer appear.

## Acceptance
| Criterion | Evidence |
|---|---|
| (1) No Vietnamese prose left in scope | Post-diff scan above: the only hits are names/UI strings/archive quotes listed under Scope decision |
| (2) Skills keep step numbers, cross-refs, commands, frontmatter keys | `head` of both files: `name:`/`description:`/`argument-hint:`/`disable-model-invocation:` intact; harness re-listed `worker` with the new English description |
| (3) build+lint+typecheck+test clean | `Build complete`, `lint exit=0`, `typecheck exit=0`, `Tests  28 passed (28)` |
| comments per code-comments.md | n/a — no code touched |

## Supersedes
none

## Review
skipped — docs

## Noticed, not done
- `todo`/`worker` skills are synced from the agent-hub kit (`chore(agent-hub): sync kit …` commits). If the kit upstream is still Vietnamese, the next kit sync may reintroduce it — translate upstream too.
- Recipes elsewhere reference "`/todo` step 1.2 type rules" (`implement.md` step 6c), but step 1.2 only holds branch-naming rules — a pre-existing mismatch, unchanged here.

## REOPEN round 1 — criterion 2 evidence (re: `evidence/verifier/2026-11-16/vi-docs-to-english-reopen.md`)
Old = `git show HEAD:<file>`, new = working tree. Real outputs:

Frontmatter keys (new):
```
todo:   name: description: argument-hint: disable-model-invocation:
worker: name: description:
keys: IDENTICAL (4 items)   # todo, old vs new
keys: IDENTICAL (2 items)   # worker
```
Headings / step-number markers:
```
todo   heads: IDENTICAL (5 items)   steps: IDENTICAL (14 items)
worker heads: DIFF
< ## 5. Đọc trước khi claim     > ## 5. Read before you claim
< ## 7. Phán quyết — sau đó     > ## 7. Verdict — then
worker steps: IDENTICAL (1 items)
```
(worker heading diff = wording only, numbers 5/7 unchanged.)

Inline code spans (wrapped lines joined first) — first run found a REAL defect:
`worker` had lost `` `## Isolation proof` `` (I had split it across a line wrap)
and `todo` had split `` `/worker implementer` `` the same way. Both fixed, then:
```
todo   code spans: old 80 new 80 only-old ['`gh issue create --title "<dòng đầu của task, rút gọn>" --body "<toàn bộ task text>"`', '`gh issue develop <number> --checkout --base <base> --name <branch từ bước 2>`'] only-new ['`gh issue create --title "<first line of the task, shortened>" --body "<the full task text>"`', '`gh issue develop <number> --checkout --base <base> --name <branch from step 2>`']
worker code spans: old 36 new 36 only-old [] only-new []
```
(todo's 2 differences = translated placeholder text inside the command only; flags unchanged.)

Fenced blocks (todo, 2 report templates):
```
-   issue #<n> <url> · branch <branch>   (omit if bước 1 failed)
+   issue #<n> <url> · branch <branch>   (omit if step 1 failed)
```
(other fence identical; worker has none.)

Step/pass cross-refs, case-insensitive, `bước`/`lượt` ≡ step/pass:
```
refs old: [('X 0', 2), ('X 1', 2), ('X 4', 2), ('x 1', 9), ('x 1.2', 1), ('x 2', 6), ('x 3', 2), ('x 4', 1), ('x 5', 2)]
refs new: [('X 0', 2), ('X 1', 12), ('X 1.2', 1), ('X 2', 6), ('X 3', 2), ('X 4', 3), ('X 5', 2)]
```
Old totals: 0→2, 1→11, 1.2→1, 2→6, 3→2, 4→3, 5→2. New: 1→12. The +1 is new
line 83 "pass 1's reasoning" — old text "lượt\n   1 vào phán quyết" was split across a
line so the old-side grep missed it (`grep -noiE` listing: old 12 lines incl. 152×2,
new 13 incl. 83). All other counts equal.

README TOC anchors vs headings (GitHub slug):
```
links:    quick-start environment-variables pages keyboard-shortcuts tech-stack contributing--git-workflow credits license
headings: contents quick-start environment-variables pages keyboard-shortcuts tech-stack contributing--git-workflow credits license
```
Every link has a matching heading (`contents` is the TOC itself).

Re-run after the fix:
```
◆ ✨ Build complete in 14.3s!
lint exit=0
typecheck exit=0
 Test Files  10 passed (10)
      Tests  28 passed (28)
```

## Seal gate
none — no outward-facing action (issue + branch creation were `/todo` step 1, not part of this diff).
