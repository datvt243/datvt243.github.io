# 2026-10-26 - content-lang-en-routes (plan)

- Worker: implementer · Version: 0.1.0
- Node: `content-lang-en-routes` (`haven/diagrams/dev-loop.prime-mermaid.md`, appended last row; slug grepped in both diagram files → 0 hits)
- Task: issue #289 "`lang=\"vi\"` on English content" (operator chose "lang=\"en\" cho vùng nội dung", AskUserQuestion 2026-10-26), branch `bug/289` off `staging` cb60738. Folded in: the `/en` routeRules gap the `blog-isr-fallback` verifier recorded (`/en/blogs` had no ISR rule) — same class of problem (the `/en` twin of a route missing), announced to the operator.

## Hub bytes before: 77905

## Plan
1. `app.config.ts`: `resumeContentLang: 'en'` (one place to change if the owner ever writes the data in Vietnamese).
2. `:lang` on the elements that render API content: the resume tab content wrapper (`resumeObject/Index.vue`), the hero `positionDesired` line (`Hero.vue`), each project `<article>` (`projects/Index.vue`). `<html lang>` keeps following the UI locale.
3. `nuxt.config.ts`: add `/en/github` isr 60, `/en/contact` prerender, `/en/blogs` isr 60, `/en/blogs/**` isr true.

## Acceptance criteria
1. `/`, `/en`, `/projects`, `/en/projects`: CV content (position, experience, projects) resolves to `lang="en"`; UI chrome resolves to the locale's lang.
2. Vercel build output has ISR routes for `/en/github`, `/en/blogs`, `/en/blogs/**`; `/en/contact` prerendered.
3. build/lint/typecheck; comments per code-comments.md.
