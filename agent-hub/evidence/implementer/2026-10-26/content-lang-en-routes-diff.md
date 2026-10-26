# 2026-10-26 - content-lang-en-routes (diff)

- Worker: implementer · Version: 0.1.0
- Node: `content-lang-en-routes` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #289 (+ `/en` routeRules gap from `blog-isr-fallback-seal.md`), branch `bug/289` off `staging` cb60738
- Status: `sealed_pending_verifier`

## Hub bytes before
77905

## Diff (current, after REOPEN 2)
| File | Why |
|---|---|
| `app.config.ts` | `resumeContentLang: 'vi'` + `/** */` WHY (the data has one language whatever the UI locale; on `/en` it would otherwise be declared English). |
| `themes/portfolio-dev/pages/resumeObject/Hero.vue` | `:lang` on the name `<h1>` (from the API). |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | `:lang` on the description `<ul>` (the job bullets). Position/company/period/skills keep the page lang (titles, company names and tech terms are not Vietnamese prose; career-break title is a UI label). |
| `themes/portfolio-dev/pages/resumeObject/Educations.vue` (via `Index.vue`) | `:lang` on `<ThemeResumeObjectEducations>` (falls through to its root): school, major, description are all API text. |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Each introduction sentence wrapped in `<span lang>`; heading, social links, download line keep the page lang. |
| `themes/portfolio-dev/pages/projects/Index.vue` | `:lang` on the description `<p>` only (labels "Project 1", "Role:", "View project" keep the page lang). |
| `nuxt.config.ts` | `/en/github` isr 60, `/en/contact` prerender, `/en/blogs` isr 60, `/en/blogs/**` isr true; routeRules comment extended (why every rule needs its `/en` twin). Unchanged since the first pass. |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output
```
npm run build → rc=0, "◆ ✨ Build complete in 13.1s!", 1 pre-existing WARN; prerender log: "├─ /contact", "├─ /en/contact", both _payload.json
npm run lint → rc=0
npx nuxi typecheck → 0 "error TS"
NITRO_PRESET=vercel npm run build → rc=0; .vercel/output/config.json routes include
  /en/github -> /en/github-isr, /en/blogs -> /en/blogs-isr, /en/blogs/(?:.*) -> /en/blogs/[...]-isr (+ _payload.json twins)
  prerender log "├─ /en/contact"; .vercel/ deleted afterwards (not gitignored)
Production before (2026-10-26): /en/contact and /en/github → x-vercel-cache: MISS
```

## Browser — REOPEN 1 rework, superseded (prod build :4152 → mock :4199, CDP :9888; leaves in `<main>` with > 25 chars, grouped by closest `[lang]` and by whether the text has Vietnamese letters)
```
/            html vi-VN | vi-VN:viText 1 | vi:viText 22 | vi:nonViText 15
/en          html en-US | en-US:nonViText 1 | vi:viText 20 | vi:nonViText 17
/projects    html vi-VN | vi:viText 3 | vi:nonViText 4
/en/projects html en-US | vi:viText 3 | vi:nonViText 2
```
Every Vietnamese-text leaf now resolves to `vi`, including on `/en` (before: under `en-US`). `nonViText` under `vi` = skill names, job titles, code-styled lines (English tech terms in Vietnamese content).

## Browser — first pass, superseded (prod build :4152 → mock :4199, CDP :9888 incognito; closest `[lang]` ancestor)
```
/            html vi-VN | position en | experience entry en | header vi-VN
/en          html en-US | position en | experience entry en | header en-US
/projects    html vi-VN | article en | header vi-VN
/en/projects html en-US | article en | header en-US
```

## Supersedes
REOPEN 2 (`evidence/verifier/2026-10-26/content-lang-en-routes-reopen-2.md`): the `vi` wrapper/article also covered English UI labels on `/en`. Took the verifier's option (a): `lang` moved onto the API-text elements only (table above); the wrapper div and the article `:lang` removed. Checks re-run: build rc=0 "Build complete in 13.2s", lint rc=0, typecheck 0 "error TS".

Two-way check (`scratchpad/p1/lang-check.cjs`: every text node in `<main>`, hidden tabs included; Vietnamese text must resolve to `vi*`; on `/en` a text equal to / starting with an `en.json` label must resolve to `en*`):
```
fix:
/            html vi-VN | viOk 32 | labelOk 0 | bad []
/en          html en-US | viOk 22 | labelOk 9 | bad []
/projects    html vi-VN | viOk 10 | labelOk 0 | bad []
/en/projects html en-US | viOk 3  | labelOk 7 | bad []
base (staging, same mock data):
/en          viOk 0 | labelOk 9 | bad: 21 × vi-text-under-en-US ("Võ Tấn Đạt", "Frontend Developer với hơn 4 năm kinh ng…", …)
/en/projects viOk 0 | labelOk 7 | bad: 3 × vi-text-under-en-US (project descriptions)
```
(The first run of the fix still flagged the hero name on `/en` → `:lang` added to the name `<h1>`; second run above is clean.)

REOPEN 1:REOPEN 1 (`evidence/verifier/2026-10-26/content-lang-en-routes-reopen.md`): the resume data is now Vietnamese (operator updated it after the audit), so `lang="en"` mislabelled it. The issue's goal is "declared language matches content": kept the mechanism, value → `'vi'`, comment rewritten, Hero `:lang` dropped (the job title is English; it keeps the page lang). Route rules unchanged. Checks re-run: build rc=0 "Build complete in 13.5s", lint rc=0, typecheck 0 "error TS".

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. Declared language matches content | REOPEN 2 two-way check: 0 bad on all 4 pages (base: 24 bad on `/en` + `/en/projects`) |
| 2. `/en` route rules | vercel-preset config routes + prerender log |
| 3. checks; comments per code-comments.md | rc=0 / 0 TS errors; one new `/** */` WHY (app.config, rewritten in REOPEN 1), one extended `/** */` (routeRules: why the `/en` twins); no new comments in REOPEN 2; no `(#N)` refs |

## Noticed, not done
- English tech terms / job titles inside the Vietnamese bullets are declared `vi` with the rest of the sentence (normal for mixed prose).
- The PDF (`/api/generate-pdf?lang=en`) sets `<html lang="en">` over Vietnamese content — not in this issue's scope (pages only).
- `og:locale`/canonical unchanged (per operator's choice: keep the URLs and default locale).

## Seal gate
none.
