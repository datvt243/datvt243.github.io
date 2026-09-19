# p3-type-tightening — verifier seal note

**Caveat, disclosed not silently assumed**: same-session verification, not a separate blank-context pass (see `p2-polish-sweep-seal.md` for the full disclosure).

## Independently re-checked
- `npm run lint` re-run clean: `13 problems (0 errors, 13 warnings)`, and independently confirmed 0 of the remaining 13 are `no-explicit-any` (all are `no-unused-vars`/`no-console`, out of this node's scope) by re-grepping the lint output.
- Independently re-derived each type from its real consumers rather than trusting the implementer note's claims at face value:
  - `types/github.ts`'s `language`/`topics`/`homepage` — re-read `themes/portfolio-dev/pages/github/part/Item.vue` and `Index.vue` directly, confirmed every usage is template-guarded (`v-if`/`!!`) before being dereferenced, so the `string | null` / `string[]` types don't introduce a real runtime mismatch risk even though this repo doesn't run a full `vue-tsc` type-check as part of its verification bar.
  - `types/resume-document.ts`'s `personalSkills`/`images` — re-read `server/utils/createPDF.ts`'s `Skill` alias and `themes/portfolio-dev/pages/projects/Index.vue:59` + `utils/ResumeAdapter.ts:87` directly, confirmed the new `ProfessionalSkill[]`/`string[]` types match what's actually produced/consumed at runtime, not just what the note claims.
  - `utils/fetchWithRetry.ts`'s generic conversion — confirmed its one real caller (`PostCategories.vue:17`) already supplies `useAsyncData<Category[]>(...)`, so the signature change is additive, not breaking.
- Confirmed the 2 deliberately-unfixed `any`s in `server/utils/createPDF.ts` (lines 26, 70) are real, still present, and match the stated reasoning (`Record<string, any>` destructured across dozens of fields in a ~330-line file) — not silently dropped from the count without explanation.
- `npm run build`: clean, exit 0 (type-only changes, `typescript.typeCheck: false` confirmed in `nuxt.config.ts:123` so this doesn't mask a real `tsc` failure — it simply isn't run, consistent with how every other node in this repo's history has verified).

**Verdict: SEAL.**
