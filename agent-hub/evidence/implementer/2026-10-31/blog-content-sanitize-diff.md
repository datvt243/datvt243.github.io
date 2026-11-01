# 2026-10-31 - blog-content-sanitize (plan + diff)

- Worker: implementer · Version: 0.1.0
- Node: `blog-content-sanitize` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #291 "investigate: unsanitized v-html renders third-party blog content". The 2026-10-27 investigation comment narrowed the risk to `themes/portfolio-dev/pages/post/Detail.vue:50` (`v-html="modelValue.content"`) and recommended sanitizing server-side before caching. #293 is closed with the blog kept (only taken off the nav, #331), so the route is still live. Branch `bug/291` off `staging` 7502e90.
- Status: `sealed_pending_verifier`

## Hub bytes before
80092 (measured before the node row was appended)

## Why a new dependency
`ultrahtml` is already in the tree (via nuxt), so it was tried first. Probe of its `sanitize` transformer, default and with an element allowlist:
```
in : <p onclick="a()">hi <img src=x onerror=alert(1)><a href="javascript:alert(1)">l</a><script>…</script><iframe src="//e"></iframe>…
out: <p onclick="a()">hi <img src=""><a href="javascript:alert(1)">l</a><iframe src="//e"></iframe>…
```
It keeps `onclick` and `javascript:` hrefs, so it isn't a sanitizer for this. Added `sanitize-html@2.18.1` (released 2026-10-14) + `@types/sanitize-html@2.16.2` (dev), installed under Node v24.19.0 (PROJECT.md npm trap).

## Acceptance criteria
1. Post `content` returned by `/api/blogs/detail/[id]` is sanitized before the cached handler stores it.
2. Scripts, event-handler attributes, `javascript:` URLs and iframes are stripped; ordinary formatting (headings, links, strong, pre/code with class, img) is kept — unit test.
3. `sanitize-html` is traced into the production bundle.
4. build + lint + typecheck + `npm test` clean.

## Diff
| File | Why |
|---|---|
| `server/utils/sanitizePostHtml.ts` (new) | `sanitize-html` with its default allowlist + `img`/`h1`/`h2`, `class` on `code`/`pre` |
| `server/api/blogs/detail/[id].ts` | `data.content` passed through `sanitizePostHtml` in the returned payload (inside the cached function, so the cache stores the clean version) |
| `tests/sanitizePostHtml.test.ts` (new) | 2 cases: XSS vectors stripped (exact output), formatting round-trips unchanged |
| `package.json`, `package-lock.json` | the 2 packages above |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Output
```
npm run lint → lint=0
npx nuxi typecheck → typecheck=0, `grep -c "error TS"` = 0
npm test → Test Files  5 passed (5) / Tests  13 passed (13)   (was 11; +2 new)
npm run build → ◆ ✨ Build complete in 14.0s!
ls .output/server/node_modules | grep sanitize → sanitize-html
grep -rl allowedTags .output/server/chunks → .output/server/chunks/routes/api/blogs/detail/_id_.mjs
```

## Browser verification
Not done. No visual change is intended; the only change is which tags survive. The handler fetches the external blog API (hardcoded URL), which I didn't call or mock, so the sanitized response wasn't observed end to end.

## Acceptance
| Criterion | Evidence |
|---|---|
| 1 sanitized before cache | diff: inside the `defineCachedEventHandler` function |
| 2 strip/keep | unit test 2/2 |
| 3 bundled | `.output` listing + chunk grep |
| 4 checks | Output block |
| comments per code-comments.md | one `/** */` WHY block on the util |

## Supersedes: none

## Still open
- The issue's checkbox "does the blog API let outsiders create/edit content" is unanswered (write endpoints not probed); this change makes the answer matter less.

## Noticed, not done
- Old cache entries: Nitro's cached handler keys integrity on the handler's code, so a deploy should invalidate pre-sanitize entries; not verified.
- Real post HTML wasn't inspected, so any tag/attribute outside the allowlist (e.g. inline `style`, `span` classes from the editor) would now be stripped — possible formatting loss on old posts.
- `npm install` reports 58 existing audit findings; unrelated, not touched.

## Seal gate
none (commit/push left to `/ship`)
