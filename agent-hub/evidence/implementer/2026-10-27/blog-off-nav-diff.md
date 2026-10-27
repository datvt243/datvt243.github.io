# 2026-10-27 - blog-off-nav (diff)

- Worker: implementer · Version: 0.1.0
- Node: `blog-off-nav` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #293, branch `feature/293` off `staging` ae783ff
- Status: `sealed_pending_verifier`

## Hub bytes before
80060

## Diff
| File | Why |
|---|---|
| `app.config.ts` | `_blogs` entry removed from `menuPrimary`, replaced by a `/** */` WHY (API sleeps ~1 min, 4 posts from 2024; route kept until fresh content) |
| `README.md` | (REOPEN 1) keyboard table row `gr gp gh gb gc` → `gr gp gh gc` |
| `.claude/rules/theme.md` | Global keys list r/p/h/b/c → r/p/h/c, notes /blogs is off the nav |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree; build/server env = `scratchpad/p0/mockenv.sh`)
```
npm run build → rc=0
npm run lint → rc=0
npx nuxi typecheck → rc=0
npm test → Tests 7 passed (7)
```

## Browser (prod build :4180, CDP :9888 incognito; server log grep -c onrender → 0)
```
1280 header tabs: ["_resumegr","_projectsgp","_githubgh","_contactgc"]
press g,b on /en → url stays http://localhost:4180/en
? overlay kbd: ["gr","gp","gh","gc","j","k","gg","G","?","c","d","1","2","3","4","5"]   (no gb)
press g,h → http://localhost:4180/en/github
390 mobile menu links: ["_resume","_projects","_github","_contact"]
curl /en/blogs → 503 after 13.6s (blog API asleep at test time; 5xx-on-failure is #287's design, route still routed)
```

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. no tab/shortcut | tabs/overlay/mobile lists above; gb no-op; gh works |
| 2. route kept | /en/blogs routed (503 = blog API asleep, same as before this change) |
| 3. checks | above |
| 4. comments per code-comments.md | One `/** */` in `menuPrimary` stating why the tab is absent; no `(#N)` refs |

## Supersedes
REOPEN 1 (`evidence/verifier/2026-10-27/blog-off-nav-reopen.md`): `README.md:75` still listed `gb`. Fixed; `grep -rn '`gb`'` over README.md, agent-hub/README.md, agent-hub/doctrine, .claude, CLAUDE.md → only that README line before the fix, 0 after. Re-run output:
```
npm run build → ◆ ✨ Build complete in 13.2s!
npx eslint . → (no output) rc=0
npx nuxi typecheck → [nuxt:icon] ✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons (no "error TS"), rc=0
npm test → Test Files  3 passed (3) · Tests  7 passed (7)
```

## Still open
- #291 (unsanitized blog HTML) is no longer linked from the nav but still reachable at /blogs/[id]; left for if the blog comes back.

## Seal gate
none.
