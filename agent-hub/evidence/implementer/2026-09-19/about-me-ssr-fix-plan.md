# 2026-09-19 — about-me-ssr-fix (implementer plan)

- Worker: implementer
- Node: `about-me-ssr-fix` (new)
- Task: fix item 3 of the 4 critical items from the `.claude/review.md` audit.

## Acceptance criteria
1. `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` wraps its bio/
   heading/social-links block (`<ThemeCodeBlock :lines="bioLines">`) in
   `<ClientOnly>` with no fallback — confirmed live, the section heading
   text is absent from the server-rendered HTML entirely. It's the
   default-active homepage tab.
2. Investigate why `<ClientOnly>` was added before removing it (per the
   directive — don't blindly delete a workaround without understanding it).
3. If there's no real SSR-hydration-mismatch reason, remove the wrapper so
   the bio ships in the initial HTML.
4. Verify via CDP that the heading text is now actually present in the raw
   SSR response, not just after hydration, and that there's no new
   hydration-mismatch warning.

## Investigation
`AboutMe.vue`'s own in-file comment (Vietnamese): "v-html chỉ chạy ở
client, server ko render ra đc -> tạm thời xài clientOnly" ("v-html only
runs on client, server can't render it -> temporarily using clientOnly").
This is a misconception — `v-html` IS fully SSR-safe in Vue. Confirmed two
ways:
1. `themes/portfolio-dev/pages/post/Detail.vue:51` uses
   `v-html="modelValue.content"` directly, with no `ClientOnly`, and this
   page works fine server-rendered (it's a sealed, previously-verified node).
2. `ThemeCodeBlock` (`themes/portfolio-dev/components/CodeBlock.vue`) — the
   exact component `AboutMe.vue` wraps — is also used unwrapped by
   `Skills.vue`, `Educations.vue`, and `Languages.vue` (`grep -n
   "ClientOnly\|ThemeCodeBlock"` on all 3: only `ThemeCodeBlock`, no
   `ClientOnly`). If `v-html` inside this component genuinely broke SSR,
   all 3 sibling tabs would have the same problem — they don't.

Conclusion: the `ClientOnly` wrapper was an unnecessary workaround, likely
added while debugging something unrelated, and never removed. Safe to
delete.

## Env vars
None needed.
