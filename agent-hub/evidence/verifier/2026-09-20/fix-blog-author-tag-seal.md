# 2026-09-20 — fix-blog-author-tag (verifier verdict)

**Worker:** verifier
**Node:** `fix-blog-author-tag`
**New PM status:** SEALED

## Isolation proof
This verifier pass was spawned as a fresh, independent subagent context
via the Agent tool with the task string: `verify node fix-blog-author-tag,
evidence at agent-hub/evidence/implementer/2026-09-20/fix-blog-author-tag-
{plan,diff}.md` — a distinct task string from whatever spawned the
implementer pass (this context has no memory of writing the implementer's
diff, plan note, or diff note; it only read them as files from disk in
this session). This context did not write `themes/portfolio-dev/pages/
post/Author.vue` or `Detail.vue` — confirmed by reading `git diff` fresh
in this session and finding it consistent with, not authored by, this
pass. Ran its own separate `npm run dev` instance on port **4222**
(implementer used port 4111 per its own diff note) and its own separate
CDP script (`/private/tmp/claude-501/.../scratchpad/verify-178-
independent.cjs`, not the implementer's `verify-178.cjs`).

## Reasoning
Read `agent-hub/evidence/implementer/2026-09-20/fix-blog-author-tag-
{plan,diff}.md`. Checked each acceptance criterion from the plan note
against independently reproduced evidence:

1. **`Author.vue` no longer renders hardcoded fake name/job/photo, no new
   fetch.** Confirmed via `git diff` (`themes/portfolio-dev/pages/post/
   Author.vue`): `useAppConfig()` destructure only (no `useFetch`/
   `useAsyncData`/store call added), `UAvatar` now `src="/Avatar.png"`
   (local asset, already used elsewhere in the theme), `alt="AppHeading"`,
   author link now `:href="contact.social.github"` with real text
   `{{ AppHeading }}`. The "Author Job" `<p>` line is gone entirely, not
   replaced with another guess. Independently re-ran a fresh CDP check
   (own dev instance, port 4222) on both real live posts:
   `authorName: "Đạt Võ"`, `authorHref: "https://github.com/datvt243"`,
   `hasFlowbite: false`, `hasAuthorNamePlaceholder: false`,
   `hasAuthorJobPlaceholder: false` on both. Rendered `<address>` HTML
   captured verbatim: `<a href="https://github.com/datvt243"
   target="_blank" rel="author noopener" ...>Đạt Võ</a>` next to
   `<img alt="Đạt Võ" src="/Avatar.png">`. Matches the note's claims.

2. **`Detail.vue` tag binding bug fixed (`:to`, not literal string), fake
   `#tag` replaced by real `Post.tags`, no dead/misleading link.**
   Confirmed via `git diff`: the old `<NuxtLink to="'/blogs'">` block
   (a literal 10-char string, not a route, wrapping a hardcoded `#tag`) is
   gone, replaced by `<span v-for="tag in modelValue.tags" :key="tag">
   #{{ tag }}</span>` — plain spans, not links, so no dead/misleading
   route. The whole tags block is now gated `v-if="modelValue.tags?.
   length"`. Independently re-ran CDP: tagged post
   (`671240459c6e9bcf4f7bf00d`, live API confirms `tags:["vue"]`) →
   `tagSpans: ["#vue"]`, `headings: ["Thẻ", "Bình luận"]` (Thẻ = i18n
   "Tags" heading, correctly present); untagged post
   (`67123bdf9c6e9bcf4f7bf006`, live API confirms `tags:[]`) →
   `tagSpans: []`, `headings: ["Bình luận"]` only — the Tags heading is
   correctly absent, and `bodyHasHash` search found no leftover fake
   `#tag` text anywhere on either page.

3. **`npm run build` clean, `npm run lint` clean, warning count not
   increased.** Independently re-ran both from the current working tree
   (not cold-cache, see Re-run section) myself, verbatim:
   - `npm run build` tail: `[@nuxt/image] WARN sharp binaries for
     darwin-arm64 cannot be found...` (pre-existing, unrelated to this
     diff) then `[nitro] ✔ You can preview this build using node
     .output/server/index.mjs` / `✨ Build complete!` — 0 build errors.
   - `npm run lint` full output ends `✖ 13 problems (0 errors, 13
     warnings)` — exact match to the note's claimed baseline. Confirmed
     the one warning inside a touched file,
     `themes/portfolio-dev/pages/post/Detail.vue:11 'props' is assigned
     a value but never used`, is present in my own re-run's output too
     (pre-existing `defineProps` binding, not newly introduced — the
     diff didn't touch line 11's `defineProps<{...}>()` declaration).

4. **Real UI check via CDP on a tagged post AND an untagged post.** Done
   independently, see items 1-2 above and the `## Re-run` section below.
   0 console errors, 0 page errors on either page in my own script's
   output.

No forbidden-state hits: not `ADHOC_WORK` (traces to node
`fix-blog-author-tag`, plan+diff notes exist), not `NO_EVIDENCE`
(evidence notes present and read), not `EDIT_UNVERIFIED` (build/lint/CDP
were actually independently re-run and read back, not inferred), not
`CODE_IN_HAVEN` (no code under `haven/`), not `DIAGRAM_DRIFT` (diagram row
updated to SEALED in this same pass, matching the real code state).
Proportionality: the diff touches exactly the 2 files the plan named, no
unrelated changes — `SmallestDiff` respected. Seal gate: no
outward-facing action (no commit/push/PR) was taken by the implementer or
by me; note correctly records "Seal gate: none".

One discrepancy worth recording (does not affect the verdict): the
verifier task prompt handed to me named the untagged post ID as
`671240459c6e9bcf4f7bf006`, but the real live untagged post (confirmed via
direct `curl` against `https://blog-api-nodejs-express.onrender.com/api/
v1/post/?page=1&perPage=5`) is `67123bdf9c6e9bcf4f7bf006` — the ID the
implementer's own evidence note actually used and the one this pass
re-verified against. Likely a typo in the task prompt (digit sequence
resembling the tagged post's ID `671240459c6e9bcf4f7bf00d`), not a defect
in the implementer's work.

## Re-run
**Partial-to-full, self-declared as `full` for the parts the recipe's
"Re-run scope" names as exceptions worth paying for**: this node is
visual/behavior-facing (blog byline + tags render on every post) and the
implementer's own note already used a real CDP check, so per
`recipes/verify_seal.md`'s "Re-run scope" 2nd exception ("outward-facing
or higher risk than an ordinary diff") this warranted independent
reproduction rather than an audit-only pass:
- Re-ran `npm run build` and `npm run lint` myself from the current
  working tree (not a `.nuxt`/`.output`/cache wipe — the implementer's own
  run was also not stated as cold-cache, and the "Traps" table's
  cold-cache-flake entries are about post-wipe first-build/lint quirks,
  not something this ordinary re-run needed to reproduce) and read the
  verbatim output back myself (quoted above) — did not just trust the
  note's quoted output.
- Re-ran the CDP check from a completely separate `npm run dev` instance
  on port 4222 (implementer used 4111) with my own script
  (`verify-178-independent.cjs`, separate from the implementer's
  `verify-178.cjs`), against the same real live blog API and the same 2
  real post IDs, and got matching results independently.
- Did NOT do a `rm -rf .nuxt .output node_modules/.cache` cold-cache wipe
  before rebuilding — the recipe's default re-run scope doesn't require
  that unless there's a specific reason to suspect cache staleness, and
  there wasn't one here.

## Hub bytes
`hub_bytes_before` (from the implementer's note): 105848
`hub_bytes_after` (this hub's own `/hub-tokens` per-session-total formula,
measured immediately after updating the diagram row's PM status to
SEALED): 107955
