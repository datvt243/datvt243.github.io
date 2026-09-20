# 2026-09-20 — p1-portfolio-review-fixes (verifier verdict)

**Worker:** verifier
**Node:** `p1-portfolio-review-fixes`
**New PM status:** SEALED

## Isolation proof
This pass ran as a fresh subagent spawned with the task string beginning
"You are being spawned as the `verifier` worker for the datvt243.github.io
agent-hub. This is a fresh, independent context — do NOT trust or reuse
any reasoning from whoever implemented this change..." — distinct from
the implementer's own task string ("Fix 6 P1/high-impact findings from
portfolio review — issue #179...", per the implementer's plan note). This
context has no memory of writing the diff; it only read the diff back
from disk via `git diff`. Ran its own `npm run dev` instance on port
4244 (implementer used port 4133) and its own scratch CDP script
(`/private/tmp/.../scratchpad/verifier-179-independent.cjs`, written from
scratch, not the implementer's `verify-179{,b,c}.cjs`, only consulted for
reference on directory location).

## Reasoning
Went through every acceptance criterion in
`evidence/implementer/2026-09-20/p1-portfolio-review-fixes-plan.md`
independently, re-running build/lint/CDP from scratch (see `## Re-run`
below) rather than trusting the note's quoted output:

1. **Project role label, no invented content** — `git diff --
   themes/portfolio-dev/pages/projects/Index.vue` confirms the relabel
   (`{{ t('projects.role') }}: {{ p.position }}` replacing the plain
   italic subtitle) matches the diff note exactly. Independently
   re-confirmed live: CDP `bodySample` from `/projects` shows `"Vai trò:
   Frontend Developer"` rendered on a real project card
   (AiHR – Human Resource Management System).
2. **Real computed experience summary on Hero** — `git diff --
   themes/portfolio-dev/pages/resumeObject/Hero.vue` shows
   `yearsOfExperience`/`currentExperience` computed from
   `store.experiences` (sorted most-recent-first per the store), not a
   literal. CDP homepage check reproduced the exact same live string as
   the implementer's note: `"11+ năm kinh nghiệm — gần đây nhất tại
   Laidon Group"`.
3. **CV download button on Hero, shared logic** — `git diff` on
   `Hero.vue`/`AboutMe.vue` and `composables/useDownloadResume.ts` (read
   in full) confirm both call the same `useDownloadResume()` composable,
   no duplicated fetch/blob code (`AboutMe.vue`'s own inline
   `downloadResume()` was deleted, not kept alongside the new one). CDP:
   `downloadBtnCount: 2` on the homepage.
4. **Real `ogImage`/`twitterImage` + `Person` JSON-LD, no fabricated
   data** — `git diff -- pages/index.vue nuxt.config.ts` confirms
   `SITE_URL` is exposed via `runtimeConfig.public` (already imported at
   the top of `nuxt.config.ts` from `server/utils/siteUrl.ts`, same
   pattern as `MY_EMAIL`/`NODE_API`/`GITHUB_USER`) and the JSON-LD is
   built from `AppHeading`/`contact.social.*`/
   `resumeStore.hero.positionDesired`. Independently verified via raw
   `curl http://localhost:4244/` (own dev instance) that both the
   `<meta property="og:image">` tag and the `<script
   type="application/ld+json">` block are present in the **server-
   rendered HTML directly** — not client-injected:
   `og:image" content="https://resume-nuxt-vert.vercel.app/Avatar.png"`,
   `{"@context":"https://schema.org","@type":"Person","name":"Đạt
   Võ","jobTitle":"Frontend Developer","url":"https://resume-nuxt-vert.vercel.app","sameAs":["https://github.com/datvt243","https://www.linkedin.com/in/datvt243/"]}`.
   `curl -o /dev/null -w "%{http_code}" http://localhost:4244/Avatar.png`
   → `200` (the referenced asset is real, not a broken URL). Cross-checked
   `sameAs` against the real `app.config.ts` `contact.social.github`
   (`https://github.com/datvt243`) and `contact.social.linkedin`
   (`https://www.linkedin.com/in/datvt243/`) — exact match, not fabricated
   identifiers. CDP `JSON.parse` on the live DOM's JSON-LD script also
   parsed cleanly with the same values (post-hydration, confirming no
   client-side divergence either).
5. **`GitUser.vue` no longer uses `v-html`; hydration-safe** — `git diff`
   confirms `v-html="props.user.bio"` (previously wrapped in
   `<ClientOnly>`) was replaced with plain interpolation of a `bioText`
   computed that normalizes `\r\n?` → `\n`. **Independently reproduced
   the specific hydration-mismatch-bug-then-fix claim**: navigated `/` →
   `/projects` → `/github` sequentially in ONE tab via real click-based
   navigation (not fresh `page.goto` reloads, matching how the
   implementer's note says the bug only reproduced), listening for ALL
   `page.on('console', ...)` event types (not just `error`) plus
   `pageerror`. Result: `totalConsoleMsgs: 6`, `hydrationWarnings: []`,
   `errorsAndWarnings: []` — 0 hydration-mismatch warnings, 0
   console/page errors of any kind, on the exact repro path described.
   This is the single most load-bearing check per the task brief, and it
   held up independently.
6. **Dead link fixed** — `git diff --
   themes/portfolio-dev/pages/github/part/Item.vue` confirms
   `:href="modelValue.html_url"` replaces `href="javascript:void()"`.
   CDP on `/github`: `voidLinks: 0`, `repoLinkHref:
   "https://github.com/datvt243/anonystick"` (a real `html_url`, not a
   placeholder).
7. **Build clean** — re-ran `npm run build` myself from the current
   working tree (not cold-cache, `.nuxt`/`.output` already existed from a
   prior session; no trap conditions from `PROJECT.md`'s Traps table
   applied). Verbatim tail:
   ```
   [@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

   [nitro] ✔ You can preview this build using node .output/server/index.mjs
   │
   └  ✨ Build complete!
   ```
   Matches the note's claimed output exactly — only the pre-existing
   `sharp` warning, 0 errors.
8. **Lint clean, baseline unchanged** — re-ran `npm run lint` myself
   (Node v24.19.0 active, above the ≥21 floor `PROJECT.md`'s Traps table
   requires). Verbatim: `✖ 13 problems (0 errors, 13 warnings)`. Manually
   confirmed all 13 warnings are in files NOT touched by this diff
   (`server/api/blogs/categories.ts`, `server/api/resume.ts`,
   `server/plugins/RenderHTML.ts`, `server/utils/createPDF.ts`,
   `stores/resume.ts`, `PostCategories.vue`, `github/part/Language.vue`,
   `post/Detail.vue`) — exact match to the note's claimed baseline.
9. **Real UI verified via CDP** — see items 1-6 above; ran from my own
   fresh `npm run dev` on port 4244 (distinct from the implementer's
   4133), connected via `puppeteer-core` to the same debuggable Chrome at
   `localhost:9888` (`curl -s http://localhost:9888/json/version`
   confirmed reachable first), my own script (not a copy of the
   implementer's `verify-179{,b,c}.cjs`).

**Diff audit**: `git status --short` / `git diff` re-checked against all
9 files+1-new-file listed in the plan note
(`themes/portfolio-dev/pages/projects/Index.vue`,
`themes/portfolio-dev/pages/resumeObject/Hero.vue`,
`themes/portfolio-dev/pages/resumeObject/AboutMe.vue`,
`composables/useDownloadResume.ts`, `pages/index.vue`, `nuxt.config.ts`,
`themes/portfolio-dev/pages/github/GitUser.vue`,
`themes/portfolio-dev/pages/github/part/Item.vue`,
`i18n/locales/vi.json`, `i18n/locales/en.json`) — every file's real diff
on disk matches what the diff evidence note describes, no undisclosed
changes, no scope creep beyond what's documented in "Noticed, not done".

**Forbidden states scan**: `ADHOC_WORK` — no, node exists on the diagram.
`NO_EVIDENCE` — no, both implementer notes present. `EDIT_UNVERIFIED` —
no, build/lint/CDP independently re-run and read back by this session,
not inferred. `CODE_IN_HAVEN` — no, `git status --short` shows only the
diagram `.md` file changed under `agent-hub/`, no `.vue`/`.ts` leaked
into `haven/`. `DIAGRAM_DRIFT` — resolved by this SEAL (row updated in
place below).

**Seal gate**: no outward-facing action taken by either pass (no
commit/push/PR) — nothing to approve yet, matches the implementer note's
own "Seal gate: none".

**Proportionality**: diff stays within the 9 files the plan named, no
unrelated refactor; the implementer's own "Noticed, not done" section
explicitly scopes out the deeper Context/Role/Impact restructuring and
the `border-blue-400` literal-color cleanup (issue #180) rather than
scope-creeping into them.

## Re-run
`full` — re-ran `npm run build` and `npm run lint` from the current
working tree (not a `rm -rf .nuxt .output` cold-cache wipe — no Trap in
`PROJECT.md` applied to this change), and re-ran the entire CDP UI check
from scratch on a separate `npm run dev` instance (port 4244, vs the
implementer's 4133) with a freshly written script. Justification per
"Re-run scope" in `verify_seal.md`: this node touches multiple visual/
behavior surfaces AND the implementer's own note reports finding-and-
fixing a hydration-mismatch bug within the same pass — an independent
repro of "still clean after the fix" is the real proof for that class of
bug, not just auditing the note's claim.

## Node's row
Updated `p1-portfolio-review-fixes`'s own row in
`haven/diagrams/dev-loop.prime-mermaid.md` in place (PENDING → SEALED),
no reordering, per `AppendOnly`.
