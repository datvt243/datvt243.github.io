# 2026-10-26 - content-lang-en-routes (verdict: REOPEN)

- Worker: verifier · Version: 0.1.0
- Node: `content-lang-en-routes` (issue #289 + the `/en` routeRules gap from `evidence/verifier/2026-10-26/blog-isr-fallback-seal.md`, branch `bug/289`)
- New PM status: unchanged (IN_PROGRESS). Nothing is archived on a REOPEN.
- Notes audited: `evidence/implementer/2026-10-26/content-lang-en-routes-plan.md`, `evidence/implementer/2026-10-26/content-lang-en-routes-diff.md`

## Isolation proof
This pass ran as a separate subagent, spawned through the Agent tool with the task "You are the agent-hub **verifier** ... Node `content-lang-en-routes` ... You did not write this change." The implementer's task string was issue #289 with the operator's choice "lang=\"en\" cho vùng nội dung" (plan note). This context did not write the diff. I read `git diff` of the 5 code files only to check comments and proportionality (steps 7 and 10).

## Reasoning
| Check | Result |
|---|---|
| Step 4: commands match `doctrine/MEMORY.md` | `npm run build`, `npm run lint`, `npx nuxi typecheck`. No "tests pass". |
| Step 5: truncation | Key lines quoted. My re-run reproduces them (below). |
| Step 6: behavior evidence | Concrete, but it only checked which `[lang]` ancestor wraps the position line, one experience entry and one article. It never checked what language the text inside those regions is in. |
| **AC1: declared language matches the content** (issue #289's only acceptance: "Ngôn ngữ khai báo khớp ngôn ngữ nội dung trên `/` và `/en`") | **Not met.** The plan assumes the resume API content is English. It is not. The API returns most of the CV in Vietnamese. **Live production** (`curl https://resume-nuxt-vert.vercel.app/`, `/en`, `/en/projects`, all 200; I did not call the resume backend): the SSR payload has experience description "Sản phẩm: SimpleMDG — nền tảng Master Data Governance ...", "Thiết kế OData Service Layer dùng chung ...", school "Trường Cao đẳng Kỹ thuật Cao Thắng", major "Công nghệ Thông tin". `/en` (`<html lang="en-US">`) serves the same Vietnamese strings. "Designed"/"Built" are not found. **Mock `:4199`, my CDP run on `:4153`:** inside the new `lang="en"` regions on `/`, these Vietnamese text nodes appear: the introduction ("Frontend Developer với hơn 4 năm kinh ng…"), every experience bullet ("Thiết kế OData Service Layer…", "Khắc phục vấn đề hiệu năng…", "Xây dựng thư viện component Vue.js…" and others), the education entries ("Trường Cao đẳng Kỹ thuật Cao Thắng", "Cao đẳng, Công nghệ Thông tin"), plus the UI labels "Giới thiệu", "Tải CV" and "Nghỉ việc tạm thời". On `/projects`, every `<article lang="en">` holds Vietnamese project descriptions ("Nền tảng Master Data Governance giúp doa…", "Hệ thống SaaS quản lý nhân sự…") plus "Dự án 1", "Vai trò:" and "Xem dự án". On `/` before this diff, the Vietnamese content sat under `lang="vi-VN"`, which was correct. After the diff it is declared English, so this is a regression on the default route. The diff note's "Noticed, not done" says "the content dominates those regions", which is wrong for the data the API serves today. Only the position title, company names and skill names are English. |
| AC2: `/en` route rules | **Met (my re-run).** `NITRO_PRESET=vercel npm run build` rc=0. The `.vercel/output/config.json` routes include `/en/github -> /en/github-isr`, `/en/blogs -> /en/blogs-isr`, `/en/blogs/(?:.*) -> /en/blogs/[...]-isr`, and the `_payload.json` twins for github/blogs. `functions/en/github-isr.prerender-config.json` = `{"expiration": 60}`. The prerender log has `├─ /en/contact (4ms)`, and `static/en/contact` exists. I deleted `.vercel/` afterwards and rebuilt with the default preset (rc=0). |
| AC3: build/lint/typecheck | Re-run clean: build "◆ ✨ Build complete in 13.0s!" (exit 0), plus the 1 pre-existing Rollup WARN (`components-*.js ... A comment`); lint exit 0, no output; typecheck 0 "error TS". |
| Comments per code-comments.md | The `app.config.ts` `/** */` WHY and the extended routeRules `/** */` follow the format, with no `(#N)` refs. But the app.config comment states a false fact ("English whatever the UI locale"). The comment falls with AC1. |
| Step 7b: Supersedes / Still open | No other #289 row on the active diagram. |
| Step 8: forbidden states | ADHOC_WORK: no, the row exists. NO_EVIDENCE: no. EDIT_UNVERIFIED: no, all three commands are present. CODE_IN_HAVEN: no. DIAGRAM_DRIFT: no, the row stays IN_PROGRESS. |
| Step 9: seal gate | No outward-facing action. |
| Step 10: proportionality | The `/en` routeRules are a disclosed fold-in of the same class, and they are proportionate. The `lang` half is small but wrong (AC1). |

## Missing
1. **AC1.** The resume content's real language is mostly Vietnamese (live production and mock both show this), so a hardcoded `resumeContentLang: 'en'` mis-declares it on `/` (a regression) and on `/projects`. The issue's premise ("toàn bộ nội dung CV là tiếng Anh") is stale. This needs an operator decision before re-implementing. Options:
   - (a) Close #289 as obsolete for `/`. `/` is already correct with `html lang="vi-VN"`. The real mismatch is now `/en` serving Vietnamese content under `en-US`, which is either a data/translation issue or needs `lang="vi"` on the content for `/en`.
   - (b) Set the content-region `lang` to the data's actual language, `vi`, which fixes `/en` and is a no-op on `/`.
   - (c) Mark only the genuinely English fields, such as `positionDesired`.

   Any re-implementation must check the text language inside the region, not just the `[lang]` ancestor.
2. The `/en` routeRules half (`nuxt.config.ts`) is verified and good. It can be kept as-is in the next pass, or split out as its own node if #289 is closed.

## Re-run
full (build, lint, typecheck, Vercel-preset build, CDP on a fresh `:4153` server against mock `:4199`). This was the operator-requested exception: the node is outward-facing (SEO/a11y on production routes plus Vercel caching rules). I ran from a warm cache and did not delete `.nuxt` or `.output`. CDP scripts: `scratchpad/v289/cdp.cjs`, `scratchpad/v289/vi.cjs`. The `:4153` server was stopped afterwards. The mock `:4199` was left running because it is shared.

## Raw
```
CDP (closest [lang] ancestor):
/            200 html vi-VN | header vi-VN | position en | experience en | lang els P=en,DIV=en
/en          200 html en-US | header en-US | position en | experience en
/projects    200 html vi-VN | header vi-VN | article en «Dự án 1 // _simplemdg … Vai trò: F»
/en/projects 200 html en-US | header en-US | article en «Project 1 // _simplemdg … Role: Fr»
Vietnamese text nodes inside [lang="en"]: / 23 distinct (of 580 text nodes) incl. intro + all experience bullets + education;
  /projects 9 distinct (of 36) incl. all 3 project descriptions
Live: / and /en and /en/projects SSR payload contain "Thiết kế OData", "Nền tảng Master Data", "Cao Thắng"; "Designed"/"Built" absent
```
