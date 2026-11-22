# 2026-11-17 - claude-md-projects-isr (diff)
- Worker: implementer · Version: 0.1.0
- Node: `claude-md-projects-isr` in `haven/diagrams/dev-loop.prime-mermaid.md`
- Task: `/todo #434` — "CLAUDE.md: /projects is ISR 60s, not "no routeRule""
- Status: sealed_pending_verifier
- Plan: `evidence/implementer/2026-11-17/claude-md-projects-isr-plan.md`

## Hub bytes before
95190

## Feature doc
`doctrine/features/projects.md` (Behavior #1; Open question 1 answered "config is right; fix CLAUDE.md — #434"). Not edited.

## Diff
| File | Why |
|---|---|
| `CLAUDE.md` | line 43: `| \`/projects\` | none (no routeRule) | \`useResumeStore\` |` → `| \`/projects\` | ISR 60s | \`useResumeStore\` |` |
| `agent-hub/haven/diagrams/dev-loop.prime-mermaid.md` | new node row `claude-md-projects-isr` (IN_PROGRESS) |

```
-| `/projects` | none (no routeRule) | `useResumeStore` |
+| `/projects` | ISR 60s | `useResumeStore` |
```

## Command
From repo root (`doctrine/MEMORY.md` Commands table): `npm run build`, `npm run lint`, `npx nuxi typecheck`, `npm test`.
Plus: `grep -rn "no routeRule" . --exclude-dir=node_modules --exclude-dir=.nuxt --exclude-dir=.output | grep -v "agent-hub/evidence\|histories"`

## Output
build (exit 0), last lines:
```
[nitro] ✔ You can preview this build using node .output/server/index.mjs
config 262ms · modules 672ms · app 602ms · types 377ms · client 2.58s · server 1.68s · nitro 8.78s
◆ ✨ Build complete in 14.9s!
```
lint (exit 0):
```
> nuxt-app@1.13.2 lint
> eslint .
```
typecheck (exit 0; `grep -ciE "error"` on its log = 0), last lines:
```
ℹ Nuxt Icon server bundle mode is set to local
[nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons
```
test (exit 0):
```
 Test Files  10 passed (10)
      Tests  28 passed (28)
```
grep "no routeRule":
```
agent-hub/haven/diagrams/dev-loop.prime-mermaid.md:86:| `claude-md-projects-isr` | IN_PROGRESS | ... said "none (no routeRule)"; ...
agent-hub/doctrine/features/projects.md:51:1. Root `CLAUDE.md` says `/projects` has "none (no routeRule)", but
```
`git diff CLAUDE.md`:
```
@@ -40,7 +40,7 @@ UI changes (run `/browser` first).
 | `/` | ISR 60s | `/api/resume` |
 | `/github` | ISR 60s | `/api/github` |
 | `/contact` | prerender | `app.config.ts` |
-| `/projects` | none (no routeRule) | `useResumeStore` |
+| `/projects` | ISR 60s | `useResumeStore` |
 | `/blogs` | ISR 60s | `/api/blogs/posts` |
 | `/blogs/[id]` | ISR true | `/api/blogs/detail/[id]` |
```

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. `/projects` row reads `ISR 60s` | `git diff CLAUDE.md` `+| \`/projects\` | ISR 60s | \`useResumeStore\` |`; matches `nuxt.config.ts:156` `'/projects': { isr: 60 },` |
| 2. no stale "no routeRule" claim | grep output above: only the feature doc's answered question (historical) and this node's row |
| 3. build+lint+typecheck+test clean | "Build complete in 14.9s!" exit 0; eslint exit 0, no problems printed; typecheck exit 0, 0 error lines; "Tests  28 passed (28)" |
| comments per code-comments.md | n/a — no code comment added/changed (markdown table cell only) |

## Supersedes: none
`grep -n "#434" haven/diagrams/dev-loop.prime-mermaid.md` → only this node.

## Review: skipped — docs
Doc-only one-cell change (issue label `documentation`).

## Browser verification
n/a — no visual/behavior change.

## Noticed, not done
- Working tree also has pre-existing uncommitted changes NOT from this pass: `.claude/skills/issues-ls/SKILL.md`, `agent-hub/doctrine/features/INDEX.md` (+ "Visit tracking" row, #389), untracked `.vercel/`. Left untouched; `/ship` should stage only `CLAUDE.md`, the diagram row and this pass's evidence.
- Pages & Caching table lists only `/projects`, not `/en/projects` (same for other `/en` twins) — consistent with the rest of the table, not changed.

## Seal gate
none — no outward-facing action in this pass.
