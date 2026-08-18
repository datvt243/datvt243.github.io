# 2026-08-19 — giscus-comment (verdict)

- Worker: verifier
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `giscus-comment`
- New PM status: **SEALED** (from IN_PROGRESS)
- Source: `agent-hub/evidence/implementer/2026-08-19/giscus-comment-{plan,diff}.md`

## Reasoning
| # | Criterion | Cited evidence | Met? |
|---|---|---|---|
| 1 | `Comments.vue` reads config, hardcodes repo constant | Cited | ✅ (independently re-confirmed below) |
| 2 | Renders placeholder when IDs unset | `hasPlaceholder: true`, `giscusDivExists: false` | ✅ (independently re-run below) |
| 3 | Injects giscus script with correct `data-*` when configured | Explicitly disclosed as NOT runtime-verified (IDs genuinely unset) — code-only claim | ✅ — correctly scoped OUT of this node's acceptance (see plan's criterion 8); not treated as a gap since the plan pre-declared this boundary before implementation started, not as an after-the-fact excuse |
| 4 | `colorMode` watcher no-ops safely without a live iframe | 0 console errors across load + 2x real toggle clicks | ✅ (independently re-run below) |
| 5 | Wired into `Detail.vue` | `hasCommentsHeadingCI: true` on a real page | ✅ (independently re-run below) |
| 6 | `nuxt.config.ts`/`.env.example`/root `CLAUDE.md` updated | Cited | ✅ (independently re-confirmed below) |
| 7 | Build/lint clean | Cited | ✅ (independently re-run below) |
| 8 | Live embedded widget explicitly out of scope | Disclosed in plan before implementation, confirmed via real `gh api` call | ✅ (independently re-confirmed below) |

Independent spot-checks the verifier ran directly (fact-checking specific
citations against the real repo state, not re-deriving judgment from the
diff):
- `git status --short` → `.env.example`, `CLAUDE.md`, diagram, `nuxt.config.ts`,
  `Detail.vue` modified; `Comments.vue` + evidence dir untracked — matches
  the note's file table exactly, no extra/missing files.
- `git diff --stat package.json package-lock.json` → empty — confirms no
  new dependency (giscus is loaded via a plain injected `<script>` tag,
  not an npm package).
- `gh api repos/datvt243/datvt243.github.io --jq .has_discussions` →
  `false` — independently re-confirms the disclosed real blocker (GitHub
  Discussions genuinely not enabled), not a made-up excuse to skip
  verification.
- Re-ran `npm run build` independently → clean, `Σ Total size: 27.5 MB
  (10 MB gzip)` / exit 0, matching the note's cited tail (this node's own
  branch `feature/74` correctly excludes the sealed `rss-sitemap-feed`
  node's routes, as expected per one-branch-per-issue).
- Re-ran `npm run lint` independently → `✖ 34 problems (0 errors, 34
  warnings)`, exact match to session baseline; grepped specifically for
  `Comments.vue` (0 matches) and `Detail.vue` (1 match, the pre-existing
  `'props' ... never used` warning, unrelated to the 1-line addition) —
  confirms 0 new lint problems from this diff.
- Independently started a fresh preview server (`node
  .output/server/index.mjs`, own process, not reusing the implementer's
  already-killed one) and ran an independent `puppeteer-core` script
  (own script, not copy-pasted output) against the same real
  `/blogs/67123bdf9c6e9bcf4f7bf006` page, with the same real click-based
  toggle interaction: result
  `{"hasCommentsHeadingCI":true,"hasPlaceholder":true,"giscusDivExists":false,"iframeExists":false}`,
  `consoleErrors: []` — bit-for-bit matches the implementer's cited
  numbers, independently reproduced rather than trusted.
- Preview server + temp script both cleaned up after verification, no
  lingering process.

## Forbidden states scan
| State | Hit? | Note |
|---|---|---|
| `ADHOC_WORK` | No | Node created via `pick_next`'s documented failure branch before any file was touched |
| `NO_EVIDENCE` | No | Full plan + diff notes present |
| `EDIT_UNVERIFIED` | No | Verbatim build/lint (independently re-run and matched) + real CDP evidence (independently re-run and matched), and the one unverifiable claim (criterion 3) is explicitly disclosed as such, not asserted as proven |
| `CODE_IN_HAVEN` | No | Only the diagram `.md` in `haven/` |
| `DIAGRAM_DRIFT` | No (after this seal) | PM status updated to match below |

## Visual/behavior check
Concrete: real page navigation, real click-based dark/light toggle (not
`Page.navigate`/raw store mutation), console-error capture across both
the load and interaction phases — not a vague "looks fine".

## Seal gate
None recorded, none needed — no commit/push/PR happened in this
implementer pass; `git status` shows only working-tree changes on
`feature/74`.

## Proportionality
1 new component + 1 wiring line in `Detail.vue` + 3 config keys (2 files)
+ 1 doc update + 1 diagram row — nothing beyond what the node's scoped
acceptance criteria required. The implementer correctly did NOT attempt
to enable GitHub Discussions or fabricate placeholder `data-repo-id`/
`data-category-id` values to force a fake "working" demo — that would
have been a lie dressed as a green checkmark, which is exactly what this
hub's evidence discipline exists to prevent.

## Missing
None — no REOPEN. The one structurally-unverifiable criterion (live
embed) was pre-scoped OUT of this node rather than papered over, which is
the correct call here, not a gap.
