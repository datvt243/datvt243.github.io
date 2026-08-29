# 2026-08-30 — remove-dead-related-articles (diff)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `remove-dead-related-articles`
- Status: `sealed_pending_verifier`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/post/RelatedArticles.vue` | Deleted — 0 references anywhere, fake Flowbite placeholder content |

```
$ git rm themes/portfolio-dev/pages/post/RelatedArticles.vue
rm 'themes/portfolio-dev/pages/post/RelatedArticles.vue'
```
Single-file deletion, no other file changed.

## Command
```
rm -rf node_modules/.cache .nuxt .output && npm run build
```
Exit code `0`. No `error` lines. Tail:
```
Σ Total size: 28.5 MB (10.5 MB gzip)
[nitro] ✔ You can preview this build using node .output/server/index.mjs
```

```
nvm use 24 && npm run lint
```
Verbatim tail:
```
✖ 32 problems (0 errors, 32 warnings)
```
Unchanged from the current baseline — expected, since the deleted file
had 0 lint findings before removal (never appeared in any prior lint run's
warning list).

## Browser verification
Not a visual change to any REAL page (the deleted file was never
rendered), but it lived in `post/` alongside files that ARE rendered on
`/blogs/[id]` — verified that page still works after the deletion.

Chrome CDP: relaunched with `--remote-debugging-port=9888
--user-data-dir="$HOME/.chrome-debug-profile"` (previous instance from an
earlier session had exited), confirmed up via `curl -s
http://localhost:9888/json/version`.

Started a real preview server: `PORT=3960 node .output/server/index.mjs`.
Fetched a real post `_id` live: `curl "http://localhost:3960/api/blogs/
posts?page=1&perPage=1"` → `67123bdf9c6e9bcf4f7bf006`.

`puppeteer-core` script: real `page.goto('http://localhost:3960/blogs/
67123bdf9c6e9bcf4f7bf006')`, `waitUntil: 'networkidle0'`.

Verbatim result:
```json
{ "hasContent": true, "consoleErrors": [] }
```
Real post-detail page renders content, 0 console errors — confirms the
deletion of an unrelated dead file didn't break anything in the same
directory.

Cleanup: preview process + the earlier stray backgrounded preview process
(port 3960, leftover from a first attempt that hit a `curl` timeout
against the real external blog API's cold start) both killed. Temp script
(`.tmp-i88-check.mjs`) deleted. `git status --short` confirmed clean of
stray files after.

## Acceptance
| Criterion | Evidence | Met? |
|---|---|---|
| File deleted | `git rm` output above, `git status --short` shows `D` for the file | ✅ |
| Build clean | Tail above, exit 0 | ✅ |
| Lint clean, unchanged warning count | `✖ 32 problems (0 errors, 32 warnings)`, same as before deletion | ✅ |
| Real UI check, 0 console errors | CDP JSON above | ✅ |

## Noticed, not done
None beyond what issue #88 itself already scoped — single dead file,
single deletion.

## Seal gate
None — no commit/push/PR in this pass. `git status` shows only the
deletion on `feature/88`.
