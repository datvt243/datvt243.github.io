# 2026-09-20 — p1-portfolio-review-fixes (diff)

**Worker:** implementer
**Node:** `p1-portfolio-review-fixes`

## Diff

| File | Why |
|---|---|
| `themes/portfolio-dev/pages/projects/Index.vue` | Relabeled the position line `Vai trò/Role: {{ p.position }}` instead of an ambiguous italic subtitle. **Scope note**: confirmed via `models/Project.ts`, `utils/ResumeAdapter.ts`, and `types/resume-document.ts`'s real `Project` interface that no company/client/challenge/result field exists anywhere in the real data — the review's own instruction ("check whether the backend resume data has an unused richer field before adding UI for one that doesn't exist... do not invent a result/impact") means the honest scope here is this relabel only, not a full Context/Role/Technical-contribution/Impact restructuring. Recorded under "Noticed, not done" below. |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | Added a computed `yearsOfExperience`/`currentExperience` summary line under the position line, and a CV-download button next to the existing contact/open-to-work pills, using the new `useDownloadResume()` composable. |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Replaced its own inline `downloadResume()`/`isDisabled` with the shared `useDownloadResume()` composable — same behavior, no duplicated fetch/blob logic between Hero and AboutMe. |
| `composables/useDownloadResume.ts` (new) | Extracted the CV fetch/blob/download flow so both Hero and AboutMe call the same code. |
| `pages/index.vue` | Added `ogImage`/`twitterImage` (pointing at the existing `/Avatar.png` asset — no new image created) and a `Person` JSON-LD `<script>` via `useHead`, built only from real data already shown elsewhere on the site (`AppHeading`, `contact.social.github/linkedin`, `resumeStore.hero.positionDesired`, `SITE_URL`). |
| `nuxt.config.ts` | Exposed `SITE_URL` under `runtimeConfig.public` (it was already imported for the i18n `baseUrl`) so `pages/index.vue` (a client-shipped page) can read it for the absolute `ogImage`/JSON-LD `url` - matches the existing pattern of `MY_EMAIL`/`NODE_API`/`GITHUB_USER` already being public runtime config, not a new boundary. |
| `themes/portfolio-dev/pages/github/GitUser.vue` | Replaced `v-html="props.user.bio"` (wrapped in `<ClientOnly>`) with plain interpolation of a new `bioText` computed. GitHub bios are plain text (confirmed via the GitHub API), so `v-html` had no benefit while keeping an open XSS vector. Removed the now-unnecessary `<ClientOnly>` wrapper too (same class of SSR-visibility fix as the prior `about-me-ssr-fix` node) - **this surfaced a real hydration-mismatch bug** (see Browser verification): the raw bio text contains `\r\n` line endings; a browser's HTML parser silently normalizes those to `\n` when parsing the server-rendered HTML, but the client's freshly computed interpolation string still has the raw `\r\n`, so Vue's hydration compared mismatched text. Fixed by normalizing `\r\n?` to `\n` in the `bioText` computed itself, so server and client compute the identical string before the browser ever touches it. |
| `themes/portfolio-dev/pages/github/part/Item.vue` | Repo-name link now uses `:href="modelValue.html_url"` (already fetched, already used elsewhere in the same file) instead of `href="javascript:void()"`, plus `target="_blank" rel="noopener noreferrer"` matching the other external links in the same file. |
| `i18n/locales/vi.json`, `i18n/locales/en.json` | New keys: `resume.experienceSummary` (`{years}`/`{company}` interpolation, same named-placeholder style already used by `contact.seoDescription`), `projects.role`. |

## Command
```
npm run build
npm run lint
```

## Output

`npm run build` (verbatim tail, after the hydration fix):
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

[nitro] ✔ You can preview this build using node .output/server/index.mjs
│
└  ✨ Build complete!
```

`npm run lint` (verbatim):
```
✖ 13 problems (0 errors, 13 warnings)
```
Exact match to the current baseline (13 warnings, unchanged) — none of the pre-existing warnings are in any file touched by this diff.

## Browser verification
Visual/behavior change across 3 pages — checked via Chrome CDP (port 9888, `puppeteer-core`) against a real `npm run dev` instance (port 4133).

**First pass caught a real bug**: sequential navigation `/` → `/projects` → `/github` produced a real Vue hydration warning on `/github`:
```
[Vue warn]: Hydration text content mismatch on <GitUser>
  - rendered on server: Roses are red,\nViolets are blue,\nunexpected '; ' on line 243
  - expected on client: Roses are red,\r\nViolets are blue,\r\nunexpected '; ' on line 243
```
Root cause: removing `<ClientOnly>`/`v-html` exposed the browser's automatic `\r\n`→`\n` normalization during server-HTML parsing, which the client's raw-string interpolation didn't share. Fixed (see Diff table above) by normalizing newlines in the `bioText` computed itself. Re-ran the exact same 3-page sequential navigation after the fix — 0 hydration warnings, 0 console errors of any kind.

Second (post-fix) pass, full check:
- **Homepage** (`/`): `ogImage`/`twitterImage` = `https://resume-nuxt-vert.vercel.app/Avatar.png`; JSON-LD parsed cleanly: `{"@context":"https://schema.org","@type":"Person","name":"Đạt Võ","jobTitle":"Frontend Developer","url":"https://resume-nuxt-vert.vercel.app","sameAs":["https://github.com/datvt243","https://www.linkedin.com/in/datvt243/"]}`; summary line rendered: `"11+ năm kinh nghiệm — gần đây nhất tại Laidon Group"` (a real computed value from the live resume data, not fabricated); 2 "Download CV"-labeled buttons found (Hero + About tab).
- **Raw SSR HTML** (`curl http://localhost:4133/`): confirmed both the `<meta property="og:image">` tag and the `<script type="application/ld+json">` block render server-side, not only after client hydration.
- **`/projects`**: `Vai trò: Frontend Developer` label confirmed rendered on a real project card.
- **`/github`**: 0 remaining `javascript:void()` links; the first repo-name link's real `href` confirmed as `https://github.com/datvt243/anonystick`.
- **Console errors across all 3 pages, post-fix**: `[]` (empty).

Scripts: `/private/tmp/claude-501/-Users--david-Workspace-Project-resume-datvt243-github-io/3010f9ae-4713-4cd2-8a1a-3217fd3407e6/scratchpad/verify-179{,b,c}.cjs` (scratch, not committed).

## Acceptance

| Criterion | Evidence |
|---|---|
| Project role label clarified, no invented content | `projects/Index.vue` diff; confirmed no richer field exists in `ResumeAdapter.ts`/`types/resume-document.ts` |
| Real, computed experience summary on Hero | CDP: `"11+ năm kinh nghiệm — gần đây nhất tại Laidon Group"` |
| CV button on Hero, shared logic | CDP: `downloadBtnCount: 2`; `composables/useDownloadResume.ts` used by both `Hero.vue` and `AboutMe.vue` |
| Real `ogImage`/JSON-LD, no fabricated data | CDP + raw `curl` SSR HTML both show the real tags; JSON-LD fields traced to `AppHeading`/`contact.social.*`/`resumeStore.hero.positionDesired`/`SITE_URL` |
| `GitUser.vue` no longer uses `v-html`; hydration-safe | `GitUser.vue` diff; CDP re-run after the fix shows 0 hydration warnings (was 1 before the fix, caught and fixed in this same pass) |
| Dead link fixed | CDP: `deadLinksRemaining: 0`, real `html_url` confirmed |
| Build clean | `npm run build` tail: `✨ Build complete!`, only the pre-existing `sharp` warning |
| Lint clean, baseline unchanged | `npm run lint`: `✖ 13 problems (0 errors, 13 warnings)` |
| Real UI verified, 0 console errors | CDP scripts above, post-fix run: `[]` |

## Noticed, not done
- A deeper "Context / Role / Technical contribution / Impact" restructuring of project cards (as the review's ideal structure describes) is NOT done — no real data source exists for challenge/contribution/impact fields in the resume API today. Adding such fields would require a content/data change on the operator's side (a new field in the resume backend), not something this implementer pass can safely fabricate. The relabel done here is the honest subset of the ask.
- `border-blue-400` on the same `GitUser.vue` bio paragraph (a literal, non-theme color) was deliberately left untouched — that's issue #180's scope (P2 literal colors), not #179's, to keep this diff scoped to its own issue.
- The rest of the review's P2/P3 findings are tracked separately in issues #180/#181.

## Seal gate
None — no outward-facing action taken (no commit/push/PR). Working tree has the diff on branch `179-fix-6-p1-high-impact`, uncommitted, awaiting verifier then operator's own `/ship` step.
