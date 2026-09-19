# p2-polish-sweep — implementer diff note

Issue: portfolio audit (`.claude/review.md`) Phase-3 polish items (P2), user-requested batch "làm tiếp" after P0/P1 rounds.

## Scope
4 small, related P2 fixes grouped as one node (all touch the theme's presentational chrome / app config, no shared file):

1. **Literal Tailwind colors in Hero.vue / AboutMe.vue** — replaced with existing `--theme-*` tokens:
   - `Hero.vue:19` `text-violet-400` (greeting) → `text-theme-accent-soft`
   - `Hero.vue:20` `text-pink-500` (name heading) → `text-theme-code-tag` (existing pink-hued token, exact hue preserved: dark `244 114 182`, light `190 24 93`)
   - `Hero.vue:25-27` `border-green-500/30 bg-green-500/10 text-green-400`/`bg-green-400` (open-to-work badge) → `border-theme-accent/30 bg-theme-accent/10 text-theme-accent`/`bg-theme-accent`. **No semantic "success/green" token exists anywhere in `settings-colors-theme/{dark,light}.css` or `tailwind.config.js`'s `theme-*` color list** — per the task directive, did not invent one; reused `--theme-accent` (closest existing semantic "highlight" token). **Tradeoff, disclosed not silently made**: the badge loses its distinct traffic-light-green "available" signal and now reads the same orange as every other accent/highlight element on the page. If this distinction matters, a real `--theme-success`/`--theme-positive` token pair should be added as its own follow-up (2 new CSS custom properties + 1 `tailwind.config.js` line + 2 new `theme-*-success` utility classes) rather than folded into this drive-by cleanup.
   - `Hero.vue:38` (was `:29`) `text-blue-400` (position line) → `text-theme-code-keyword` (existing token, byte-for-byte match to `blue-400`/`blue-600` — same precedent already used in the sealed `editor-dracula-github-item-fix` node)
   - `AboutMe.vue:76` `text-blue-400` (social link, inside the `markdownLink()` JS template-string helper) → `text-theme-code-keyword`, same token/reasoning
   - `AboutMe.vue:128`'s `text-blue-400` from the original audit no longer exists — already replaced when the CV button was fully restyled in the earlier P0/P1 round.

2. **Empty `public/robots.txt`** — deleted the 1-byte static file, replaced with `server/routes/robots.txt.ts` (new file) that imports the shared `SITE_URL` constant (`server/utils/siteUrl.ts`, same one `sitemap.xml.ts`/`rss.xml.ts` use) and emits `User-agent: *\nAllow: /\n\nSitemap: <SITE_URL>/sitemap.xml\n`. Chose the server-route approach over a static hardcoded URL specifically to avoid re-introducing a 5th independent hardcoded copy of the production domain — the exact class of bug the earlier `seo-canonical-domain-fix` node eliminated.

3. **No one-click contact affordance on the hero** — added a `mailto:` link next to the open-to-work badge in `Hero.vue`, using `useAppConfig().contact.email` (the same source `/contact` already uses) and the `fe:mail` icon (same icon already used on `/contact`). New i18n key `resume.contactMe` in both locales ("Contact me" / "Liên hệ"). Renders unconditionally (not gated behind `hero.openToWork`, unlike the badge next to it).

4. **Dead `ui.button.color.pink` config** — confirmed via `grep -rn "color=\"pink\"\|'pink'\|ui\.button\.color\.pink"` across `themes/`, `pages/`, `components/`, `layouts/`: 0 matches anywhere. Deleted the whole `button: { color: { pink: {...} } }` block from `app.config.ts` (lines 43-52 in the pre-edit file).

## Verified
- `rm -rf .nuxt .output && npm run build`: clean, exit 0, `✨ Build complete!`, same pre-existing darwin-arm64 `sharp` warning (not new), `robots.txt.mjs` route chunk present in output confirming the new server route compiled.
- `npm run lint`: `13 problems (0 errors, 13 warnings)` — down from the 30-warning baseline (17 `any` warnings resolved in the separate `p3-type-tightening` node below; this node's own 4 fixes introduce 0 new warnings/errors).
- Chrome CDP, real dev server (`npm run dev -- --port 4033`), connected via existing debug Chrome on :9888:
  - Dark mode: greeting `rgb(253, 186, 116)` (exact `--theme-accent-soft` dark value), heading `rgb(244, 114, 182)` (exact `--theme-code-tag` dark value), position line `rgb(96, 165, 250)` (exact `--theme-code-keyword` dark value), contact link `href="mailto:votan.it@gmail.com"` present and rendering.
  - Real click on the header's color-mode toggle (`[aria-label="Chuyển sang chế độ sáng"]`) → light mode: greeting `rgb(249, 115, 22)`, heading `rgb(190, 24, 93)`, position `rgb(37, 99, 235)` — all exact `--theme-*` light values, confirming the tokens actually swap with mode (the literal classes they replaced would not have).
  - `curl http://localhost:4033/robots.txt`: `User-agent: *\nAllow: /\n\nSitemap: https://resume-nuxt-vert.vercel.app/sitemap.xml\n` — correct.
  - 0 console errors captured across all checks.
  - **Not independently observed**: the open-to-work badge itself — the live resume API's `hero.openToWork` is currently `false`, so the badge doesn't render at all in this pass; its color-token wiring was verified by direct source read (identical literal-to-token substitution pattern as the 3 other confirmed elements on the same page), not by a live rendered pixel check. Flagging this rather than claiming a check that didn't happen.

## Files changed
`themes/portfolio-dev/pages/resumeObject/Hero.vue`, `themes/portfolio-dev/pages/resumeObject/AboutMe.vue`, `app.config.ts`, `i18n/locales/{en,vi}.json`, `public/robots.txt` (deleted), `server/routes/robots.txt.ts` (new).
