# 2026-10-27 - mobile-experience-touch-kbd (diff)

- Worker: implementer · Version: 0.1.0
- Node: `mobile-experience-touch-kbd` (last row of `haven/diagrams/dev-loop.prime-mermaid.md`)
- Task: issue #298, branch `feature/298` rebased on `staging` d40caec
- Status: `sealed_pending_verifier`

## Hub bytes before
80026

## Diff
| File | Why |
|---|---|
| `themes/portfolio-dev/components/Kbd.vue` | `[@media(hover:none)]:aria-hidden:hidden` on the `<kbd>`: inline (aria-hidden) hints vanish on touch screens; KeyNav overlay badges (no aria-hidden) stay. Doc comment gains the WHY. |
| `themes/portfolio-dev/pages/resumeObject/Experiences.vue` | `@media (width < 48rem)`: hide gutter, tag labels, decorative aria-hidden lines (except the `// next experience` comment); no depth-1 indent; depth-2 gets a muted `- ` marker with a 2ch hanging indent; comment gets `margin-top: 1rem`. `/** */` WHY above the block, one-line WHY on the hanging indent. |
| `themes/portfolio-dev/components/Panel.vue` | (REOPEN 1) content padding `p-6` → `p-4 md:p-6`: on phones it matches the sidebar's `p-4`; the 24px each side alone kept list text under 85% of the panel. Every panel page gets it (checked below). |
| `haven/diagrams/dev-loop.prime-mermaid.md` | Node row appended |

## Commands + output (worktree, mock resume API :4199 with the captured data)
```
npm run build → rc=0
npm run lint → rc=0
npx nuxi typecheck → rc=0
npm test → Test Files 3 passed (3) · Tests 7 passed (7)
```

## Browser (prod build :4198 for the fix, staging d40caec build :4197 as baseline; CDP :9888 incognito; script `scratchpad/p1/m298.cjs` — `textWidthRatio` = (host right − leftmost visible `.tag-text` left) / host width, host = `.code-lines` parent)
```
staging  phone 390 touch: hover=none inlineKbdVisible=7/12 gutter=block textLeftOffset=123 textWidthRatio=0.663 hScroll=false
fix      phone 390 touch: hover=none inlineKbdVisible=0/12 gutter=none  textLeftOffset=24  textWidthRatio=0.934 hScroll=false
fix      desktop 1280:    hover=hover inlineKbdVisible=12/12 otherKbdVisible=1 gutter=block textLeftOffset=123 textWidthRatio=0.829 hScroll=false
```
List items start 2ch (the `- ` marker) right of the headings, ≈ 0.88 of the width. Screenshots: `scratchpad/p1/e298-phone.png`, `e298-desktop.png`, `e298-exp2.png` (phone Experience: `- ` bullets with hanging indent, `// next experience` separators, Vietnamese description text wraps cleanly).

## Acceptance
| Criterion | Evidence |
|---|---|
| 1. ≥ 85% width at 390 | list items `liTextRatio=0.861`, headings 0.907 of the panel (see Supersedes; the first measurement was wrong) |
| 2. Kbd hidden on touch only | phone `inlineKbdVisible=0/12` (was 7), desktop `12/12`; overlay badges have no `aria-hidden`, so the variant doesn't match them |
| 3. Desktop unchanged | desktop `gutter=block textLeftOffset=123` = staging's offset |
| 4. No h-scroll, semantics kept | `hScroll=false`; only CSS `display`/padding change, markup untouched |
| 5. checks | above |
| 6. comments per code-comments.md | `Kbd.vue` doc comment and the `/** */` above the media block say WHY (no keyboard on touch; decoration ate half the phone width); one-line WHY on the hanging indent; no `(#N)` refs |

## Supersedes
REOPEN 1 (`evidence/verifier/2026-10-27/mobile-experience-touch-kbd-reopen.md`): my 0.934 counted the panel's right padding as text and measured headings only. Re-measured with the verifier's own script (`scratchpad/v298/v.cjs`, copied to `scratchpad/p1/v298r.cjs`; ratio = text span / `.editor-scope` width), after `Panel.vue` `p-4 md:p-6`:
```
/ and /en × dark/light, phone 390 touch: panelW=366 liTextRatio=0.861 h2TextRatio=0.907 inlineKbd=0/12 gutter=none hScroll=false
/ and /en × dark/light, desktop 1280:    panelW=960 liTextRatio=0.595 (unchanged layout) inlineKbd=12/12 gutter=block tagLabelsVisible=46
keynav desktop: dialogKbdVisible=17/17 · keynav phone (opened programmatically): 17/17
```
Other panel pages at 390 (`/en/github`, `/en/contact`, `/en/projects`, `/en/blogs`): content padding 16px, hScroll=false; screenshots `scratchpad/p1/e298-{github,contact,projects,blogs}.png` — content now lines up with the sidebar's 16px inset.
Re-run: `npm run build` rc=0, `npm run lint` rc=0, `npx nuxi typecheck` rc=0, `npm test` → Tests 7 passed (7).

## Noticed, not done
- At 390 the personal-info sidebar still sits between the hero and the Experience content (from #295's note); out of #298's scope.

## Seal gate
none.
