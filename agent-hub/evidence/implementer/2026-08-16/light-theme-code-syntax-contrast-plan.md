# 2026-08-16 — light-theme-code-syntax-contrast (plan)

- Worker: implementer
- Version: 0.1.0
- Node: `haven/diagrams/dev-loop.prime-mermaid.md` → `light-theme-code-syntax-contrast`
- Task (verbatim): "on the _resume page, the Skills, Experiences,
  Educations sections... the text color against the background is very
  hard to read, please check it, light theme"

## Root cause (read before writing)
`ThemeResumeObjectSkills`/`Educations` render through `<ThemeCodeBlock>`
(which already correctly uses theme tokens: `text-theme-faint`,
`text-theme-text-soft`), but the HTML content inside it (`v-html`) is
built by 2 helper functions, and BOTH use literal Tailwind colors — NOT
theme tokens:
- `utils/tsCodeLines.ts` (used by `Skills.vue`): `text-blue-400` (keyword),
  `text-sky-300` (type), `text-orange-300` (string), `text-slate-500`
  (punct), `text-slate-600 italic` (comment).
- `utils/jsonCodeLines.ts` (used by `Educations.vue`): `text-slate-500`
  (punct), `text-blue-300` (key), `text-orange-300` (value).
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue` — `<style
  scoped lang="scss">`: `.code-line { color: theme('colors.slate.300') }`
  (background text), `.code-line::before { color:
  theme('colors.slate.600') }` (line number — this component draws its
  OWN line numbers, doesn't share `ThemeCodeBlock`), `.title { color:
  white }` (job title), `.comment { color: theme('colors.slate.600') }`,
  `:deep(.tag-name) { color: theme('colors.pink.400') }`,
  `:deep(.class-name) { color: theme('colors.sky.300') }`.

Already tried a build + grepped the real CSS: these classes ARE generated
by Tailwind (not purged, even though `utils/` isn't in
`tailwind.config.js`'s `content` glob — the `@nuxtjs/tailwindcss` module
adds its own broader default content paths). Confirmed:
`.text-blue-300{color:rgb(147 197 253/...)}`,
`.text-orange-300{color:rgb(253 186 116/...)}` are present in the real
built CSS.

This is exactly the class of bug already recorded in
`doctrine/domains/PROJECT.md`'s Invariants: a literal color instead of a
theme token invisibly breaks light mode — just this time it's not
`RenderHTML.ts` (already fixed) but 3 other files that never got migrated
when light mode was introduced.

All the literal colors above are "300"/"400" shades (pastel, light) —
designed for text on a dark background. On the light theme (white canvas,
`slate-200` editor), these colors have very low contrast → exactly matches
the user's report of "very hard to read".

## Plan (smallest diff, correctness-driven)
Add 10 new syntax-highlight color tokens to
`themes/portfolio-dev/settings-colors-theme/{dark,light}.css` — dark keeps
the EXACT current literal Tailwind values (not a single pixel of dark mode
changes), light picks a darker shade of the same hue, dark enough for
contrast on white/`slate-200`:

| Token | Role | Dark (unchanged) | Light (new) |
|---|---|---|---|
| `--theme-code-text` | default body text in `Experiences.vue` | `203 213 225` (slate-300) | `51 65 85` (slate-700) |
| `--theme-code-line-number` | self-drawn line numbers in `Experiences.vue` | `71 85 105` (slate-600) | `100 116 139` (slate-500) |
| `--theme-code-keyword` | TS keyword (`enum`/`const`) | `96 165 250` (blue-400) | `37 99 235` (blue-600) |
| `--theme-code-key` | JSON object key | `147 197 253` (blue-300) | `29 78 216` (blue-700) |
| `--theme-code-type` | TS type name + Experiences `.class-name` (same original sky-300 value) | `125 211 252` (sky-300) | `3 105 161` (sky-700) |
| `--theme-code-string` | TS string + JSON value (same original orange-300 value) | `253 186 116` (orange-300) | `194 65 12` (orange-700) |
| `--theme-code-punct` | punctuation (`{`, `,`, `:`...) | `100 116 139` (slate-500) | `71 85 105` (slate-600) |
| `--theme-code-comment` | `// N+ years` comments + Experiences `.comment` | `71 85 105` (slate-600) | `100 116 139` (slate-500) — stays lighter than punct, keeping the "comment is more muted" relationship |
| `--theme-code-tag` | Experiences `.tag-name` (pug `<tag>`) | `244 114 182` (pink-400) | `190 24 93` (pink-700) |
| `--theme-code-title` | Experiences job title (`h3`) | `255 255 255` (white) | `15 23 42` (slate-900, = light `--theme-text`) |

Map into `tailwind.config.js` (`theme.colors.theme['code-text']`, ...)
following the same pattern as the other tokens (`themeColor('--theme-code-text')`)
→ generating the classes `text-theme-code-text`, etc.

Fix the 3 files using literal colors:
1. `utils/tsCodeLines.ts`: `text-blue-400`→`text-theme-code-keyword`,
   `text-sky-300`→`text-theme-code-type`, `text-orange-300`→
   `text-theme-code-string`, `text-slate-500`→`text-theme-code-punct`,
   `text-slate-600 italic`→`text-theme-code-comment italic`.
2. `utils/jsonCodeLines.ts`: `text-slate-500`→`text-theme-code-punct`,
   `text-blue-300`→`text-theme-code-key`, `text-orange-300`→
   `text-theme-code-string`.
3. `themes/portfolio-dev/pages/resumeObject/Experiences.vue`: replace
   `theme('colors.X')`/`color: white` with `rgb(var(--theme-code-x))`
   directly in `<style scoped lang="scss">` (do NOT use
   `theme('colors.theme.x')` — the `theme()` function doesn't substitute
   the `<alpha-value>` placeholder when called outside a utility-class
   context, producing broken CSS; `rgb(var(--x))` reads the custom
   property directly, safe and matches how these tokens were designed to
   be consumed).

## Acceptance criteria
| # | Criterion |
|---|---|
| 1 | Dark mode: every `--theme-code-*` value in `dark.css` matches the old literal Tailwind color VERBATIM (not a single pixel changed) |
| 2 | Light mode: `Skills`/`Educations`/`Experiences` no longer have pastel/light (300/400-shade) text on a light background — verify via computed style through CDP |
| 3 | `npm run build` clean |
| 4 | `npm run lint` clean |
| 5 | No remaining literal Tailwind color class (`text-blue-*`, `text-sky-*`, `text-orange-*`, `text-slate-500`, `text-slate-600`, `text-pink-*`) or `theme('colors.<literal>')`/`color: white` in the 3 fixed files |
| 6 | Chrome CDP: capture/read the real computed style of `/` (the resume page) in light mode for all 3 sections (Skills/Experiences/Educations), confirming the colors changed to match the token table above |

## Files
- `themes/portfolio-dev/settings-colors-theme/dark.css`
- `themes/portfolio-dev/settings-colors-theme/light.css`
- `tailwind.config.js`
- `utils/tsCodeLines.ts`
- `utils/jsonCodeLines.ts`
- `themes/portfolio-dev/pages/resumeObject/Experiences.vue`

## Blocked by
None.
