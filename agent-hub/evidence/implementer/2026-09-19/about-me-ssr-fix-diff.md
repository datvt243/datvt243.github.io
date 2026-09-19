# 2026-09-19 — about-me-ssr-fix (implementer diff)

- Worker: implementer
- Node: `about-me-ssr-fix`

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/pages/resumeObject/AboutMe.vue` | Removed the `<ClientOnly>` wrapper (+ its Vietnamese comment explaining the now-confirmed-wrong assumption) around `<ThemeCodeBlock :lines="bioLines">`. See the plan note's investigation for why this is safe. |

```diff
-    <ClientOnly>
-      <!-- v-html chỉ chạy ở client, server ko render ra đc -> tạm thời xài clientOnly -->
-      <ThemeCodeBlock :lines="bioLines" class="mb-4" />
-    </ClientOnly>
+    <ThemeCodeBlock :lines="bioLines" class="mb-4" />
```

## Command
`npm run build` then `npm run lint` (verbatim from `doctrine/MEMORY.md`).

## Output
Verified together with the other 3 nodes in this same session — final
combined re-run (after all 4 nodes' changes were in place):
`npm run build`: exit 0, `✨ Build complete!`, same pre-existing
darwin-arm64 `sharp` warning. `npm run lint`: `✖ 30 problems (0 errors, 30
warnings)`, exact baseline match.

## Browser verification
Real UI check via Chrome CDP (port 9888, already running — confirmed via
`/browser`'s own `curl http://localhost:9888/json/version` check, not
relaunched), against a real `npm run dev` instance (port 4011, started
fresh after `rm -rf .nuxt` to clear the documented stale-cache trap).

1. **Raw SSR HTML** (`curl http://localhost:4011/` — no JS execution,
   proves server-rendering, not just post-hydration DOM): `grep -o "Giới
   thiệu" /tmp/home.html` → 1 match. Before this fix, this text would not
   appear in the raw response at all (per the audit's own live check,
   independently re-confirmed here by inspecting `AboutMe.vue`'s prior
   `ClientOnly` wrapper and the SSR-safety investigation above).
2. **Post-hydration DOM via CDP**: `document.body.innerText.includes('Giới
   thiệu')` → `true`.
3. **No new hydration warnings**: full `console`/`pageerror` listener
   attached before `page.goto`, page settled 1.5s after `networkidle0` —
   0 log entries matching `/hydrat|mismatch|warn|error/i`.

## Acceptance
| # | Criterion | Evidence | Met? |
|---|---|---|---|
| 1 | Bio ships in initial SSR HTML | `grep` on raw `curl` output, 1 match | ✅ |
| 2 | Investigated before removing (not a blind delete) | Plan note's investigation (Detail.vue + 3 sibling tabs precedent) | ✅ |
| 3 | No hydration-mismatch regression | 0 console/page errors after full settle | ✅ |
| 4 | Build clean | `✨ Build complete!` | ✅ |
| 5 | Lint clean | `30 problems (0 errors, 30 warnings)`, baseline match | ✅ |

## Noticed, not done
Nothing new — single-purpose fix, single file.

## Seal gate
No outward-facing action taken (no commit/push/PR) — working tree left
dirty on the `staging` branch for the operator to review.
