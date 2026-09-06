# 2026-09-06 — blog-api-runtime-validation (verifier seal)

- Worker: verifier
- Node: `blog-api-runtime-validation` (`haven/diagrams/dev-loop.prime-mermaid.md`)
- Note graded: `evidence/implementer/2026-09-06/blog-api-runtime-validation-{plan,diff}.md`

## Verdict: SEAL

## Isolation proof
This verify pass ran as a separate spawned subagent, given the distinct
task string "Verify node `blog-api-runtime-validation` (issue #141, 'Add
runtime schema validation (zod) for blog API responses')" by the
orchestrator for this specific verify pass — not the implementer's own
task string (`/todo #141`, cited in the implementer's plan note). This
pass's first real actions were reading
`agent-hub/haven/workers/verifier/manifest.yaml` → `SOUL.md` →
`recipes/verify_seal.md` (only file present in `recipes/`, `MEMORY.md`
absent, confirmed via directory listing, not skipped) →
`doctrine/standards/recipes.md` → `doctrine/MEMORY.md`, then the
implementer's plan + diff notes, then the real repo files the diff
touches, then independent build/lint/curl/schema re-verification below —
never wrote any part of the graded diff in this session. Confirmed I did
not author this diff (`NeverVerifyOwnWork`).

## Bundle read
`agent-hub/haven/workers/verifier/manifest.yaml`, `SOUL.md`,
`recipes/verify_seal.md` (only file in `recipes/`) read in full.
`MEMORY.md` does not exist for this worker (confirmed via `cat` returning
nothing / not found, not skipped). Also read `doctrine/standards/
recipes.md` and `doctrine/MEMORY.md` per the task's required process.
`agent-hub/CLAUDE.md` was NOT auto-injected as a nested system-reminder
during this session (checked — no such reminder appeared after touching
`agent-hub/` files via `Read`/`Bash cat`), so per the recipe's step-3
guard I read it directly myself (confirmed present at
`agent-hub/CLAUDE.md`, all 5 forbidden states + seal-gate rule read from
it directly, not duplicated from a phantom injection).

## Deviation from the recipe's default Re-run scope (declared up front)
`recipes/verify_seal.md`'s "Re-run scope" section defaults to auditing the
note without re-running build/lint/curl. This pass deviated from that
default and re-ran build, lint, and — going beyond even a normal
re-run — independently `curl`'d the real live external API and fed the
real responses through the actual zod schema exports, per this task's
explicit instructions from the orchestrator. This is consistent with (not
a violation of) the recipe's own named exception #2: "The node is
outward-facing or a `/release` gate — higher risk than an ordinary diff,
worth the independent-confirmation cost" — a runtime validation boundary
against a real, changeable external API, where a wrong schema either lets
bad data leak into the theme layer or 502s good data in production,
qualifies as higher-risk than an ordinary diff. Declared honestly as
`rerun=partial` below (not `none`), per step 13b.

## Cross-check: diff note vs real files on disk
Read every file the diff note claims to touch directly off disk (not
trusting the diff note's prose):
- `server/utils/blogSchemas.ts` — matches the diff note's "New file"
  section verbatim (all 3 leaf schemas, the `apiFormatResponseSchema`
  wrapper, `parseBlogApiResponse` throwing `createError({statusCode: 502,
  ...})`).
- `server/api/blogs/categories.ts` — matches: `parseBlogApiResponse(categoriesResponseSchema, raw, 'categories')`, old `APIFormatResponse<string[]>` type-only import gone.
- `server/api/blogs/detail/[id].ts` — matches: `parseBlogApiResponse(postResponseSchema, raw, \`post detail ${id}\`)`.
- `server/utils/cacheGetPost.ts` — matches: `parseBlogApiResponse(paginatedPostsResponseSchema, raw, 'posts list')`.
- `types/blog.ts` — matches: `isPublic?: boolean` (was required), with an
  inline comment citing the same live-API finding.
- `package.json`/`package-lock.json` — `zod: "^3.25.76"` present in
  `dependencies`; resolved version `3.25.76` confirmed in
  `package-lock.json`.
- `git status --short` at the start of this pass showed exactly the 7
  files the plan note's Files table lists, plus the diagram row and the
  2 new implementer evidence files, plus one pre-existing unrelated
  untracked file (`light-mode-elevation-contrast-plan.md`, an earlier
  #139 pass in the same implementer session, correctly disclosed as
  out-of-scope in the diff note's own "Scope check" section) — no
  surprise files.

## Independent re-run: build + lint
Ran myself, from repo root, exact commands from `doctrine/MEMORY.md`
(never `npm test` — this project has no test suite):

```
npm run build > /tmp/build_check.log 2>&1; echo "EXIT_CODE=$?"
EXIT_CODE=0
... [nitro] ✔ You can preview this build using node .output/server/index.mjs
✨ Build complete!
```
Same pre-existing `[@nuxt/image] WARN sharp binaries for darwin-arm64
cannot be found` warning, not new. Real exit code captured separately
from a piped `tail` to avoid exit-code masking.

```
npm run lint > /tmp/lint_check.log 2>&1; echo "LINT_EXIT=$?"
LINT_EXIT=0
✖ 30 problems (0 errors, 30 warnings)
```
Exact match to the implementer's cited `30 problems (0 errors, 30
warnings)` — confirmed the `categories.ts` `event`-unused warning is
still present (pre-existing, unrelated) and the 2 warnings the note says
disappeared (`errors`/`message` unused-var in `categories.ts`) are indeed
absent from my own fresh run's output.

## Independent re-verification: the core external-API-shape claim
This node's central claim is "the real external blog API's response
shape differs from the old hand-written TS types." Verified this myself,
NOT by re-reading the implementer's cited curl output — fresh `curl`s run
by this pass just now:

### `GET https://blog-api-nodejs-express.onrender.com/api/v1/post/?page=1&per_page=3`
Real response's first post object (verbatim keys):
```
_id, title, slug, status, content, excerpt, authorId, tags, createdAt, updatedAt, __v
```
No `isPublic` key anywhere on any of the 3 real posts returned. Instead
each has `status: "publish"` and a Mongoose `__v` field — neither declared
on the old `Post` TS type. This independently reproduces the implementer's
claim with my own fresh request, not theirs.

### `GET https://blog-api-nodejs-express.onrender.com/api/v1/post/detail/67123bdf9c6e9bcf4f7bf006`
Same shape: `status`, `message`, `errors`, `data` wrapper; `data` has the
same key set as above (`status: "publish"`, `__v`, no `isPublic`).

### `GET https://blog-api-nodejs-express.onrender.com/api/v1/categories`
Real response: full category objects (`_id`, `name`, `slug`,
`description`, `createdAt`, `updatedAt`, `__v`), NOT `string[]` —
independently reproduces the note's claim that the old
`APIFormatResponse<string[]>` cast on this endpoint was already wrong.

### Schema-level proof (not just eyeballing JSON — ran the actual zod exports)
Wrote a throwaway script (`.tmp_verify_schemas.mjs`, deleted immediately
after, never committed) that used `jiti` (already an installed
transitive dependency, used only to `import()` the real
`server/utils/blogSchemas.ts` TS file directly under Node, without a
Nuxt runtime) to load the actual `postSchema`, `paginatedPostsResponseSchema`,
`postResponseSchema`, `categoriesResponseSchema` exports and fed them the
same 3 fresh `curl` responses above via `.safeParse()`:

```
--- posts list vs paginatedPostsResponseSchema ---
success: true
--- post detail vs postResponseSchema ---
success: true
--- categories vs categoriesResponseSchema ---
success: true
```
All 3 succeed on real, live data — confirms the new schemas do NOT
false-positive 502 on real traffic. Then ran a sanity check: took
`postSchema` and forced `isPublic` to be REQUIRED (simulating the OLD,
un-fixed `Post` TS type) and re-parsed the same real post payload:

```
--- sanity: strict variant (isPublic required) would reject real data ---
strict success (should be false): false
[{"code":"invalid_type","expected":"boolean","received":"undefined","path":["isPublic"],"message":"Required"}]
```
This is the concrete, independently-produced proof of the node's core
claim: the OLD required-`isPublic` shape really does reject real live
API data, and the NEW optional shape (the actual shipped schema) accepts
it. Not inferred, not trusted from the note — reproduced with my own
fresh HTTP requests and the actual shipped schema code.

## Acceptance criteria — one by one
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | Runtime schema check (zod) at the external blog API boundary | `server/utils/blogSchemas.ts` read directly off disk; wired into all 3 call sites, confirmed by reading each file | ✅ |
| 2 | Shape mismatch fails loudly, not silently | `parseBlogApiResponse` throws `createError({statusCode: 502, statusMessage: ..., data: result.error.issues})` on `safeParse` failure — read directly in the file | ✅ |
| 3 | Applies to all 3 boundary points (posts list, post detail, categories) | Confirmed by reading `cacheGetPost.ts`, `detail/[id].ts`, `categories.ts` — all 3 call `parseBlogApiResponse` | ✅ |
| 4 | Real live data validates without false 502s | My own fresh `curl`s fed through the real schema exports via `safeParse` — all 3 succeed (see above) | ✅ |
| 5 | Old TS type really was wrong vs. real API (the node's core claim) | My own fresh `curl` shows no `isPublic` on real posts (`status`/`__v` instead); my own sanity re-parse shows a required-`isPublic` variant rejects real data | ✅ |
| 6 | Build clean | Independently re-run: exit 0, `✨ Build complete!`, no new errors | ✅ |
| 7 | Lint clean | Independently re-run: exit 0, `30 problems (0 errors, 30 warnings)`, exact match | ✅ |

## Forbidden-states scan
| State | Hit? | Why |
|---|---|---|
| `ADHOC_WORK` | No | Traces to the `blog-api-runtime-validation` node, appended per `pick_next.md`'s "no diagram match yet" branch (per implementer's plan note) |
| `NO_EVIDENCE` | No | Plan + diff notes exist, this seal note now exists |
| `EDIT_UNVERIFIED` | No | build/lint independently re-run; external API shape independently re-curled and re-parsed through the real schema code, not just reasoned about |
| `CODE_IN_HAVEN` | No | Only `haven/diagrams/dev-loop.prime-mermaid.md` (a status/notes row, not code) touched under `haven/`; all real code lives under `server/`/`types/` |
| `DIAGRAM_DRIFT` | No (fixed by this seal) | Row updated IN_PROGRESS → SEALED below, in place |

No "tests pass" claim anywhere in either note — this project has no test
suite; both notes correctly say "build clean"/"lint clean" instead.

## Proportionality (`SmallestDiff`)
Diff is exactly the 7 files the plan note's Files table lists (1 new
schema file + 3 call-site rewires + 1 type fix + `package.json`/
`package-lock.json` for the new `zod` dependency) plus the diagram row —
confirmed via `git status --short`, no unrelated file touched. The
`types/blog.ts` `isPublic` optional fix and the `categorySchema` shape
(matching real objects, not the stale `string[]` cast) are in-scope, not
scope creep: a schema built on the old (wrong) required/`string[]`
shapes would 502 on every real request, so both fixes were necessary
preconditions for the schema to be correct at all — independently
confirmed via my own live curl, not just accepted from the note's
reasoning.

## Seal gate
No outward-facing action taken by this pass — no `commit`/`push`/PR. This
note only updates the diagram's PM status (an allowed verifier action)
and appends one `worker-runs.log` line, both within
`haven/workers/verifier/manifest.yaml`'s `writes:` scope. Per the diff
note, this node itself has no branch yet either (evidence-only pass,
branching happens at PR time per this repo's `/todo` flow) — consistent,
no outward-facing action was needed from either pass.

## PM status update
`haven/diagrams/dev-loop.prime-mermaid.md`'s `blog-api-runtime-validation`
row updated in place (`AppendOnly` — not moved/reordered) from
`IN_PROGRESS` to `SEALED`, with this verifier pass's independent
re-verification summary appended to the same row's notes cell (pointing
back to this evidence file).

## Re-run
`partial` — independently re-ran `npm run build` (cold-cache state from
whatever was on disk at session start, not an explicit `rm -rf .nuxt
.output` wipe) and `npm run lint`, both verbatim-matching the implementer's
cited output. Additionally, went beyond a normal "re-run" and
independently re-curled all 3 live external API endpoints fresh
(not reusing the implementer's cited curl output) and fed the real
responses through the actual shipped zod schema exports via a throwaway
`jiti`-loaded script (deleted after use, never committed) to directly
prove both that real data validates and that the OLD required-`isPublic`
shape would have rejected it. Reason: per `recipes/verify_seal.md`'s
"Re-run scope" exception #2 (higher-risk/outward-facing-adjacent
boundary) and this task's explicit orchestrator instructions — this
node's core claim is specifically about live external API shape drift,
which cannot be honestly confirmed by auditing the note's prose alone.

## Hub bytes before / after
- `hub_bytes_before` (reused from the implementer's plan note's own
  `## Hub bytes before` line, per step 14's "reuse, don't re-read"
  instruction): 79297
- `hub_bytes_after` (measured via the exact script in
  `.claude/skills/hub-tokens/SKILL.md`, run AFTER the PM status update
  above): 83191

## Cleanup
The throwaway `.tmp_verify_schemas.mjs` script (used for the schema
safeParse cross-check) was deleted immediately after use — confirmed via
`git status --short` showing no stray file. `.output`/build artifacts
from the independent `npm run build` re-run are gitignored, not
committed; no dev/preview server was started by this pass (no CDP/browser
check re-run — the implementer's own CDP evidence for `/blogs` and the
post-detail page was concrete/citable — specific selectors, specific
counts, specific URLs — not a vague "looks fine", so per the recipe's
step 6 it did not need independent re-verification). `git status --short`
after this pass's writes shows only: this node's own already-existing
diff (unchanged by this pass), the diagram + `worker-runs.log` edits made
by this seal, and this new evidence file — nothing else.
