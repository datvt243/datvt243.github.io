# 2026-09-09 — error-vue-theme-colors (implementer diff)

- Worker: implementer
- Node: `error-vue-theme-colors`
- Task: `/todo "#152"`

## Diff
| File | Why |
|---|---|
| `error.vue` | Line 31's button (`sm:w-full lg:w-auto my-2 border rounded md py-3 px-8 text-center ...`) had literal Tailwind colors (`bg-pink-500`, `text-white`, `hover:bg-orange-700`, `focus:ring-indigo-700`) instead of `--theme-*` tokens — replaced with `bg-theme-accent`, `text-theme-accent-contrast`, `hover:bg-theme-accent-soft`, `focus:ring-theme-accent`. Chose `theme-accent`/`theme-accent-soft`/`theme-accent-contrast` (already-defined tokens in `themes/portfolio-dev/settings-colors-theme/{dark,light}.css`) because this is a primary CTA button, the exact role `theme-accent` already serves elsewhere (e.g. `GitRepos.vue`'s `focus:ring-theme-accent` precedent). `text-theme-accent-contrast` replaces the literal `text-white` since accent-on-text contrast differs by mode (white on light's orange-600, near-black on dark's lighter orange-400) — a hardcoded white would have been unreadable in dark mode's accent color if the accent got any lighter. |

```diff
-                class="sm:w-full lg:w-auto my-2 border rounded md py-3 px-8 text-center bg-pink-500 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50"
+                class="sm:w-full lg:w-auto my-2 border rounded md py-3 px-8 text-center bg-theme-accent text-theme-accent-contrast hover:bg-theme-accent-soft focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-opacity-50"
```

Nothing else touched — `layouts/error.vue` (the wrapping layout) was checked
and has no literal colors (`<div class="container">` / `<main class="my-4">`
only). The commented-out dead markup at lines ~41-51 was deliberately left
alone, per issue #152's explicit "out of scope" note.

## Command
`npm run build` then `npm run lint` (verbatim from `doctrine/MEMORY.md`).

## Output
`npm run build`:
```
[@nuxt/image]  WARN  sharp binaries for darwin-arm64 cannot be found. Please report this as a bug with a reproduction at https://github.com/nuxt/image.

[nitro] ✔ You can preview this build using node .output/server/index.mjs
│
└  ✨ Build complete!
```
(pre-existing darwin-arm64 `sharp` warning, not new — same as every prior
sealed node since `dependency-upgrade-phase2`.)

`npm run lint`:
```
✖ 30 problems (0 errors, 30 warnings)
```
Exact match to the current baseline (unchanged from `cleanup-pdf-only-types`/
`blog-api-runtime-validation`'s 30-warning baseline) — this diff touches
only a `class` string, no lint-relevant code.

## Browser verification
Real UI check via Chrome CDP (port 9888, launched via `/browser`), against
a real `npm run dev` instance (port 4123, started fresh for this check,
stopped after). The error page isn't reachable through everyday
navigation, so it was forced by requesting an unknown route
(`http://localhost:4123/this-route-does-not-exist-xyz`), which Nuxt
renders through `error.vue` via `<NuxtLayout name="error">`.

Read the real rendered button's `getComputedStyle` + `className` in both
color modes (dark is default; light forced via `localStorage.setItem
('nuxt-color-mode', 'light')` + reload since this route doesn't expose the
header's toggle):

| Mode | `background-color` | `color` | Matches token |
|---|---|---|---|
| dark (default, `<html class="dark">`) | `rgb(251, 146, 60)` | `rgb(2, 6, 23)` | `--theme-accent` dark = `251 146 60` ✓, `--theme-accent-contrast` dark = `2 6 23` ✓ |
| light (`<html class="light">`) | `rgb(234, 88, 12)` | `rgb(255, 255, 255)` | `--theme-accent` light = `234 88 12` ✓, `--theme-accent-contrast` light = `255 255 255` ✓ |

Real rendered `className` in both checks: `...bg-theme-accent
text-theme-accent-contrast hover:bg-theme-accent-soft focus:outline-none
focus:ring-2 focus:ring-theme-accent focus:ring-opacity-50` — 0
`pink`/`orange-700`/`indigo-700`/`white` literal-color remnants.

Console: 2 entries, both `Failed to load resource: ... 404 (Page not
found: /this-route-does-not-exist-xyz)` — expected (that 404 is literally
what triggers the error page being checked), not a real error. 0 other
console/page errors.

## Acceptance
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | Literal colors replaced with theme tokens | Diff above; `className` on the real rendered button contains 0 literal-color classes | ✅ |
| 2 | Both color modes verified on a real error page via CDP | Table above — dark/light both match their respective `--theme-accent`/`--theme-accent-contrast` values exactly | ✅ |
| 3 | Build clean | `✨ Build complete!`, verbatim above | ✅ |
| 4 | Lint clean | `30 problems (0 errors, 30 warnings)`, verbatim above, baseline match | ✅ |
| 5 | Dead commented-out block left untouched | `git diff -- error.vue` above shows only line 31 changed | ✅ |

## Noticed, not done
Nothing new beyond what issue #152 itself already scoped out (the
commented-out dead markup, lines ~41-51) — single-purpose fix, single file.

## Seal gate
No outward-facing action taken (no commit/push/PR) — this pass only edited
`error.vue`, appended a new PM row to the diagram, and wrote these two
evidence notes.
