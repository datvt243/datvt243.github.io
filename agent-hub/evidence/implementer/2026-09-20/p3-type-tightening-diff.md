# p3-type-tightening — implementer diff note

Issue: portfolio audit (`.claude/review.md`) P3 finding ("~16 scattered `any` usages" — the real count from `npm run lint`'s own `no-explicit-any` warnings, the authoritative list, was 17 across 6 files).

## Scope — fixed (17 `any`s, all with an obvious concrete/generic type, 0 downstream callers broken)
- `utils/fetchWithRetry.ts` — made generic: `fetchWithRetry<T = unknown>(...)`, `$fetch<T>(url)` instead of `const res: any`. The one real caller (`PostCategories.vue`) already supplies its own type via `useAsyncData<Category[]>(...)`, unaffected.
- `composables/debounceRef.ts` — `let timer: any` → `let timer: ReturnType<typeof setTimeout> | null`.
- `components/ListRender.vue` — `data: Record<string, any>[] | null` → `Record<string, unknown>[] | null`. Safe: the component only reads `.length` on this prop (`v-if="props.data?.length"`), never a specific property, so `unknown` doesn't break anything.
- `utils/cloneDeep.ts` — made generic: `cloneDeep<T>(obj: T): T`, `const copy = (...) as T` instead of 2×`any`. Return type now matches input type exactly (previously `any` in, `any` out — strictly worse than the new signature).
- `types/github.ts` (10 fields, real GitHub REST API shapes):
  - `GitUser`: `company`/`email`/`twitter_username` → `string | null`; `hireable` → `boolean | null`.
  - `GitRepos`: `homepage`/`language`/`mirror_url` → `string | null`; `license` → `{ key: string; name: string; spdx_id: string; url: string | null; node_id: string } | null`; `topics` → `string[]`; `temp_clone_token?` → `string`.
  - Cross-checked against real consumers before typing: `language` is read directly (`Item.vue`'s `modelValue.language`, `Index.vue`'s filter/map) and as a `Record<string,string>` key — `string | null` is correct since all 3 usages are already guarded by `v-if`/`!!` checks in the template. `topics` is rendered as a list (`v-for="topic in modelValue.topics"`) — `string[]` matches. `homepage` is rendered as a link href, guarded by `v-if` — `string | null` matches. `license`/`mirror_url`/`temp_clone_token` have 0 consumers anywhere in the repo (confirmed via grep) — typed to the real GitHub API shape anyway rather than left loose, since it doesn't risk breaking anything either way.
- `types/resume-document.ts`:
  - `GeneralInformation.personalSkills: any[]` → `ProfessionalSkill[]` — confirmed via `server/utils/createPDF.ts`'s own local `Skill = ProfessionalSkill` alias and its `getContent(title, skills: Skill[])` usage that this is the real, already-established shape.
  - `Project.images: any[]` → `string[]` — confirmed via `themes/portfolio-dev/pages/projects/Index.vue:59`'s `<NuxtImg v-if="p.images[0]" :src="p.images[0]">` (used directly as an image URL) and `utils/ResumeAdapter.ts:87`'s own runtime filter (`.filter((src): src is string => typeof src === 'string')`) that the real shape is already `string[]`, the type was just stale.

## Scope — deliberately NOT fixed, with reason
- `server/utils/createPDF.ts:26` (`pageRender(RECORD: Record<string, any>)`) and `:70` (`getDataCandidate(RECORD: Record<string, any>)`) — these type the raw top-level resume-API payload, destructured across dozens of fields through the whole file. Properly typing this means defining a full "raw resume API response" type (distinct from the already-adapted `Resume`/`GeneralInformation` types `ResumeAdapter.ts` produces) and threading it through every destructure in a ~330-line file — a materially larger, separate piece of work, not a P3 drive-by fix. Left as `any`, per the task directive's own carve-out ("skip and note any that genuinely need any... rather than laundering them into unknown everywhere and breaking callers") — switching these 2 to `unknown` would break every one of the dozens of destructures in this file without individually typing each field first.
- `server/utils/createPDF.ts:12`'s `no-console` warning and the handful of `no-unused-vars` warnings elsewhere (`server/api/categories.ts`, `resume.ts`, `RenderHTML.ts`, `stores/resume.ts`, `PostCategories.vue`, `Language.vue`, `Detail.vue`) are a different lint rule entirely, out of this node's scope (the audit's P3 item was specifically about `any`, not unused vars/console).

## Verified
- `npm run build`: clean, exit 0, `✨ Build complete!` (Nuxt build has `typescript.typeCheck: false`, so this doesn't run a full `tsc`/`vue-tsc` pass — consistent with `doctrine/MEMORY.md`'s stated verification bar for this repo).
- `npm run lint`: `13 problems (0 errors, 13 warnings)`, down from the 30-warning baseline — 17 fewer `no-explicit-any` warnings, exactly matching the 17 `any`s fixed above; 0 new warnings introduced.
- No visual/runtime behavior change (type-only edits + 2 generic-function signature changes with unchanged runtime bodies) — no CDP check needed for this node specifically; the `language`/`topics`/`homepage` type changes are exercised indirectly by the `/github` page CDP check already run for the `p3-github-avatar-alt` node on the same page (0 console errors there).

## Files changed
`utils/fetchWithRetry.ts`, `composables/debounceRef.ts`, `components/ListRender.vue`, `utils/cloneDeep.ts`, `types/github.ts`, `types/resume-document.ts`.
