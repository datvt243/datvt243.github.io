# 2026-10-21 - resume-api-error-standard (diff)

- Worker: implementer · Version: 0.1.0
- Node: `resume-api-error-standard` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Task (verbatim): `/todo #244` → issue #244 "Align resume API consumers with backend API Response & Error Standard"
- Branch: `bug/244`

## Hub bytes before
157755

## Diff
| File | Why |
|---|---|
| `server/utils/fetchResume.ts` (new) | One shared fetch of `${NODE_API}/api/me/${MY_EMAIL}`: non-2xx (`$fetch` throws) or `success:false`/no `data` → `throw createError({ statusCode: 502, statusMessage: 'Unable to load resume data' })` (original error kept as `cause`). Thrown, so the cached handler never stores it. |
| `server/api/resume.ts` | Uses `fetchResume()`; returns `{ success: true, resume }`. Unused `ResumeAPIResponse` import dropped. |
| `server/api/generate-pdf.ts` | Uses `fetchResume()` in place of the bare `$fetch` + inline `!success \|\| !data → 502` check (that check now lives in the helper). Import trimmed to `GeneralInformation`. |
| `types/resume-api.ts` | `ResumeAPIResponse` gets `error?: { code; message; details?: { field; message }[] }`; `errors` becomes optional. |
| `plugins/VisitTracker.client.ts` | Checked, unchanged: only `.catch`es, 201 is 2xx. |

## Command
```
npm run build
npm run lint
npx nuxi typecheck
```

## Output
- `npm run build` → exit 0, ends `[nitro] ✔ You can preview this build using node .output/server/index.mjs` / `✨ Build complete!`. The only "error" matches in the log are chunk filenames (`error-500.mjs`, `error-BkbwQrr8.mjs`). One pre-existing warning: `[@nuxt/image] WARN sharp binaries for darwin-arm64 cannot be found`.
- `npm run lint` → `> eslint .`, exit 0, no output.
- `npx nuxi typecheck` → exit 0, no diagnostics. Last lines: `✔ Nuxt Icon discovered local-installed 3 collections: fe, grommet-icons, heroicons`.

## Runtime verification (built server vs mock backend)
`node .output/server/index.mjs` with `NUXT_PUBLIC_NODE_API=http://localhost:4599`, against a mock that switches modes (scratchpad `mock.mjs`):
| Backend reply | Request | Result |
|---|---|---|
| 404 `{ success:false, error:{ code:'NOT_FOUND' } }` | `/api/resume` ×2 | `statusCode: 502, "Unable to load resume data"` `[502]` both times |
| same 404 | `/api/generate-pdf` | `statusCode: 502, "Unable to load resume data"` `[502]` |
| 200 `{ success:false }` | `/api/resume` | `[502]` |
| switched to 200 `{ success:true, data }`, no server restart | `/api/resume` | `{"success":true,"resume":{"email":"a@b.c","generalInformation":{}}} [200]` — so the earlier failures weren't cached |

## Browser verification
N/A — no visual change (server/API + type only). `pages/index.vue:18` already destructures `error` from `useAsyncData`. Before this change, the same failure path threw an uncaught 500.

## Acceptance
| Criterion | Evidence |
|---|---|
| Backend 400/404/5xx → `/api/resume` gives no uncaught 500, and the failure isn't cached for 12 days | Runtime table: 404 → `[502]` twice; `success:false` → `[502]`; switching to ok without a restart → `[200]` with real data |
| `/api/generate-pdf` returns a controlled 502 when the backend fails | Runtime table: `/api/generate-pdf` → `statusCode: 502, "Unable to load resume data"` |
| `ResumeAPIResponse` matches the new envelope, and the old field is optional | `types/resume-api.ts`: `error?: { code: string; message: string; details?: { field: string; message: string }[] }`, `errors?: string[]`; typecheck exit 0 |
| VisitTracker 201 handled | 201 is 2xx; the plugin only `.catch`es, so no change needed |
| build+lint+typecheck clean | Output section above |
| comments per code-comments.md | Three comments added, each one WHY/API doc in `/** */`, with no issue refs: the `fetchResume` JSDoc (why it throws rather than returning), the `error?` doc (a link to the standard by name), and the `errors?` doc (why it is kept optional) |

## Noticed, not done
- `server/api/generate-pdf.ts`: the `if (data) {` guard is now always true (`fetchResume` guarantees `data`). I left it in place (SmallestDiff).
- Issue item 5 (optional): adding `data: { code }` to the blog/github `createError`s. It's marked optional and isn't in the Acceptance list.
- VisitTracker does not send `referrer`/`profile` in its body. The issue says this is outside this standard.

## Seal gate
None. No commit, push or PR in this pass.
