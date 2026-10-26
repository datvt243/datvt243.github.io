# 2026-10-27 - a11y-axe-serious (diff)

- Worker: implementer · Version: 0.1.0
- Node: `a11y-axe-serious` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #288, branch `bug/288` off `staging` d40caec
- Status: `sealed_pending_verifier`

## Hub bytes before
80026

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/settings-colors-theme/dark.css` | `--theme-faint` slate-500 → 117 131 152 (was 4.23:1 on canvas) |
| `themes/portfolio-dev/settings-colors-theme/light.css` | `--theme-faint` slate-400 → slate-500 (2.56:1 → 4.8:1 on white); `--theme-accent`/`--theme-kbd` orange-600 → orange-700 (3.4:1 → 4.9:1 on header); `--theme-accent-soft` orange-500 → orange-800 (2.8:1 on white) |
| `themes/portfolio-dev/settings-colors-theme/editor-dracula.css` | Dark: `faint` #6272a4 → 154 164 193 (2.45:1 on panel), `code-comment` → 134 146 183 (3.02:1 on Background). Light: `faint`/`code-comment`/`code-line-number` → 85 99 143, `code-keyword`/`code-tag` → 184 35 119, `code-type` → 13 110 137, `accent-soft` → 127 73 189 (all were 3.45–4.41:1). Each value's comment states the ratio it was moved to. |
| `themes/portfolio-dev/pages/github/part/Item.vue` | Repo icon links get `aria-label` ("{name} website" / "{name} on GitHub") — axe `link-name` ×36 |
| `i18n/locales/{en,vi}.json` | `github.repoWebsite`, `github.repoSource`, `header.mainNav` |
| `themes/portfolio-dev/pages/{github,contact,projects}/Index.vue` | `sr-only` `h1` from the existing `seoTitle` key (`page-has-heading-one`) |
| `themes/portfolio-dev/pages/blogs/Index.vue` | Per-page `USelect` labelled by its "Show:" text via `aria-labelledby` (`button-name`, critical) |
| `themes/portfolio-dev/pages/post/Item.vue` | Tag `UBadge` uses `accentBadgeUi` like every other badge; the default Nuxt UI primary green was 2.09:1 |
| `themes/portfolio-dev/layout/Header.vue` | Header `<nav>` gets `aria-label` (`landmark-unique`, moderate, two unnamed navs on /blogs) |
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Inline links `hover:underline` → `underline underline-offset-2` (`link-in-text-block` at 390); WHY added to the doc comment |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree; server env = `scratchpad/p0/mockenv.sh`, mock only)
```
npm run build → rc=0
npm run lint → rc=0
npx nuxi typecheck → rc=0
npm test → Tests 7 passed (7)
```

## Browser — axe-core 4.10.2 via CDP :9888, incognito (`scratchpad/p1/axepairs.cjs`; rules default + `target-size`)
Pages: `/`, `/?tab=about-me`, `/projects`, `/github`, `/blogs`, `/contact`, `/blogs/67123bdf9c6e9bcf4f7bf006` × dark/light, run for `/en` and `/` (vi) at 1280 and 390.
Before (staging d40caec, `/en` 1280; full output `scratchpad/p1/axe288-before.txt`): serious/critical = color-contrast on all 5 pages in both modes (#6272a4 on #363848 2.45:1; #64748b on #020617 4.23:1; #ea580c on #f8fafc 3.4:1; #f97316 on white 2.8:1; #db2a8e/#0891b2/#6272a4/#9b59e6 on #f8f8f2 3.45–4.41:1; #00c950 2.09:1), link-name ×36 (/github), button-name (/blogs, critical).
After (`scratchpad/p1/axe288-after.txt`), every combination:
```
dark|light heading-order(moderate) ×1   /blogs/67123bdf9c6e9bcf4f7bf006   (only remaining finding)
```
→ 0 serious / 0 critical across 7 pages × 2 modes × 2 widths × 2 locales. `page-has-heading-one`, `landmark-unique` (moderate) also gone.
Screenshots: `scratchpad/p1/e288-{light,dark}.png` (resume page, editor colors slightly stronger, layout unchanged).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. 0 serious/critical, light+dark | After block above; only `heading-order` (moderate) left |
| 2. No visual regression | e288 screenshots: same layout; faint/comment text a step stronger |
| 3. checks | above |
| 4. comments per code-comments.md | Token comments say why each value moved (the ratio it failed / reaches); AboutMe doc comment says why links are underlined; no WHAT comments, no `(#N)` refs |

## Supersedes
none

## Still open
- `heading-order` (moderate) on blog posts: the post body HTML comes from the blog backend (starts at `h3` under the page `h1`); backend data, operator updates it by hand.
- Footer touch targets: left as is. At 390 (`/en/contact`, touch emulation) the footer links measure `16x20, 16x20, 87x16` and axe `target-size` (WCAG 2.5.8) reports `pass: target-size:3, violations: none`: they pass through 2.5.8's spacing exception, not by size. Enlarging them would be a design choice beyond the issue's axe acceptance; say if wanted.

## Noticed, not done
- While measuring, `scratchpad/p0/env.sh` exports `NUXT_PUBLIC_NODE_API` (real backend), which overrides the build-time mock URL at runtime: the first two local servers (:4188 this node, :4198 for #298) called the real resume backend. Stopped; all runs above use `scratchpad/p0/mockenv.sh` (both vars → :4199), `grep -c onrender` on the server log = 0.

## Seal gate
none.
