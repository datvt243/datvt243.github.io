# 2026-10-27 - blog-off-nav (verifier: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `blog-off-nav` (#293), worktree `feature/293` off `staging` ae783ff, uncommitted
- Notes graded: `evidence/implementer/2026-10-27/blog-off-nav-{plan,diff}.md`

## Verdict: REOPEN

## Missing
- **Docs consistent (operator criterion): FAIL.** `README.md:75` still lists
  the removed shortcut:
  `| \`gr\` \`gp\` \`gh\` \`gb\` \`gc\` | Sang Resume / Projects / GitHub / Blogs / Contact |`.
  The diff updated `.claude/rules/theme.md` but not the README, and the diff
  note never mentions the README. Found by
  `grep -rnE "r/p/h/b|\bgb\b|g\+b|_blogs"` across the repo (excl. node_modules,
  .output, .nuxt, evidence, histories).
- Smallest fix: README.md:75 → `| \`gr\` \`gp\` \`gh\` \`gc\` | Sang Resume / Projects / GitHub / Contact |`
  (the `/blogs` rows in the README routes table stay, the route is kept).
- Minor, same pass: the note's command block is `rc=0` summaries, not the
  verbatim tail recipe step 5 asks for; quote the real output next time.

## Cited (independent re-run, all green)
Env `scratchpad/p0/mockenv.sh` sourced for build and server.
```
npm run build      → rc=0 "◆ ✨ Build complete in 13.7s!"
npm run lint       → "> eslint ." rc=0, no findings
npx nuxi typecheck → rc=0, no errors
npm test           → "Test Files  3 passed (3) / Tests  7 passed (7)"
```
Browser: prod build on :4179, CDP :9888, incognito context.
```
1280 header nav links: ["/en","/en","/en/projects","/en/github","/en/contact"]
any a[href*=blogs] on /en: 0
after g,b url: http://localhost:4179/en            (gb no-op)
overlay kbd: ["gr","gp","gh","gc","j","k","gg","G","?","c","d","1","2","3","4","5"]  (no gb)
g,p -> /en/projects OK | g,h -> /en/github OK | g,c -> /en/contact OK | g,r -> /en OK
390 mobile menu open, visible links: ["/en","/en","/en/projects","/en/github","/en/contact"]
390 any a[href*=blogs]: 0
screenshot scratchpad/v293-mobile.png: menu = _resume/_projects/_github/_contact
curl /en/blogs → 200 in 0.99s (route still served; blog API was awake)
server log: grep -c onrender → 0
```
Remaining `/blogs` links in the UI are only inside the blog itself
(`pages/post/Detail.vue` back link, `PostCategories.vue` category filter), not
nav entries. That's fine.

## Criteria
| Criterion | Result |
|---|---|
| 1. no tab / mobile entry / `gb` / overlay `gb`; other shortcuts work | PASS (above) |
| 2. /blogs route kept | PASS (200) |
| 3. build/lint/typecheck/test | PASS (re-run above) |
| 4. comments per code-comments.md | PASS. One `/** */` (> 1 sentence) in `menuPrimary`, gives the WHY, no `(#N)` ref |
| Docs consistent (operator) | **FAIL**: README.md:75 |

## Forbidden states / seal gate / proportionality
No forbidden state hit beyond the doc miss. The change doesn't face outward
beyond the site nav, so no approval is needed. The diff is proportionate
(3 files, one config entry).

## Isolation proof
Spawned as a separate verifier subagent with the task string "You are the
agent-hub **verifier** for ... node `blog-off-nav` (GitHub issue #293)" and
worktree `scratchpad/wt293`. This context didn't write the diff.

## Re-run
full. The operator's spawn prompt explicitly ordered running build/lint/
typecheck/test and the CDP checks myself. The note's command output also
wasn't verbatim (step 5).

## PM status
Not updated (REOPEN). Row `blog-off-nav` stays IN_PROGRESS.
