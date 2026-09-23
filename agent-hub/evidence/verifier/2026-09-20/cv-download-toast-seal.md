# 2026-09-20 — cv-download-toast (verifier verdict)

**Worker:** verifier
**Node:** `cv-download-toast`
**New PM status:** SEALED

## Isolation proof
This pass was spawned as a fresh subagent with the task string beginning
"You are being spawned as the `verifier` worker for the datvt243.github.io
agent-hub. This is a fresh, independent context — do NOT trust or reuse any
reasoning from whoever implemented this change; verify from scratch against
real evidence." It explicitly instructed: "Start your OWN fresh `npm run
dev` instance on a different port than the implementer used (4900) — e.g.
4977" — a spawn-specific instruction the implementer pass never saw (its own
evidence note only ever references port 4900). I have no memory of writing
the diff under review; my only inputs were the evidence notes, the diagram
row, the doctrine files, and the real repo/`node_modules` state read fresh
in this session.

## Reasoning
Went through `verify_seal.md` steps 2-11 in full, choosing `full` re-run
(not the default `none`/audit) because this is an outward-facing UI-behavior
change touching a production button, matching the recipe's re-run exception
"the node is outward-facing... higher risk than an ordinary diff."

1. **`git diff` matches the note** — ran `git diff` on all 6 changed files
   myself; the diff is exactly what `cv-download-toast-diff.md` describes:
   `<UNotifications />` added to `app.vue`; `useDownloadResume.ts` gains
   `isLoading`, a `useToast()` call, a `toast.add()` before the fetch, and
   `toast.update()`/try-catch/finally around it; `Hero.vue`/`AboutMe.vue`
   both add `isLoading` to `:disabled` and swap the label; `vi.json`/
   `en.json` gain the 3 new i18n keys. No extra changes, no unrelated diff.

2. **`useToast.js` claim independently confirmed** — read
   `node_modules/@nuxt/ui/dist/runtime/composables/useToast.js` myself:
   `add()` returns `{id: Date.now().toString(), ...notification}` (has
   `.id`, as claimed); `update(id, notification)` does
   `notifications.value.splice(index, 1, {...previous, ...notification})`
   (a real merge, as claimed). Went one step further than the implementer's
   note: also read `Notifications.vue` and confirmed it reads the *same*
   `useState("notifications", ...)` key and only renders
   `v-if="notifications.length"` inside a `<Teleport to="body">` — so the
   "nothing renders unless `<UNotifications>` is mounted" claim is
   structurally correct, not just asserted. Grepped `app.vue` +
   `themes/portfolio-dev` for `Notifications` — `app.vue`'s new line is the
   only match anywhere, confirming it genuinely was never mounted before.

3. **Build** — ran `npm run build` myself from this session: clean, ends
   `✨ Build complete!`, `Σ Total size: 99.2 MB (80.7 MB gzip)` — matches
   the prior sealed baseline (`fix-generate-pdf-vercel-chromium`'s ~99MB),
   confirming no regression from this diff.

4. **Lint** — ran `npm run lint` myself (Node v24.19.0, already ≥21, no
   `nvm` switch needed): `✖ 13 problems (0 errors, 13 warnings)` — verbatim
   exact match to the note's claimed baseline.

5. **CDP — happy path** — started my own fresh `npm run dev` on port 4977
   (separate from the implementer's 4900). First attempt
   (`waitUntil:'load'` + 500ms before click) saw NOTHING for 20s straight —
   traced this to Vue hydration not having attached the `@click` handler
   yet at 500ms (confirmed via a debug script with console/response
   listeners: raw DOM `.click()` on an unhydrated button is a no-op).
   Fixed by using `waitUntil:'networkidle0'` + 2s before clicking. Re-ran:
   `PDF response status: 200`, page text `t+1s: ["Đã tải xong CV"]`, total
   elapsed 1028ms. This run's cold-launch was fast (~1s) rather than
   "several seconds" — a real, disclosed difference from the implementer's
   run, not a contradiction: local Puppeteer cold-launch speed varies by
   machine state, and the "several seconds" concern is specifically about
   Vercel's serverless cold start (per issue #193's context), not a
   guaranteed local timing. The mechanism under test — loading toast on
   click, updating to a real-200-driven success toast — is confirmed either
   way.
6. **CDP — error path** — same dev instance, fresh page,
   `page.setRequestInterception(true)` forcing a 500 on `/api/generate-pdf`
   only (all other requests passed through). `t+500ms: ["Không thể tải
   CV"]`; button state after: `{"disabled":true,"text":"Tải CV"}` — the
   `isDisabled` fallback fires correctly (label reverts to normal text
   since `isLoading` cleared in `finally`, but the button stays disabled
   via `isDisabled`). Matches criterion 3 exactly.
7. Scanned the 5 forbidden states — none hit: went through implementer with
   a real node + evidence note (`ADHOC_WORK`/`NO_EVIDENCE` clear); every
   claim in the note is independently reproduced above
   (`EDIT_UNVERIFIED` clear); no code under `haven/` (`CODE_IN_HAVEN`
   clear); diagram row now updated to match (`DIAGRAM_DRIFT` being fixed by
   this same pass).
8. Seal gate — note correctly records "none", no commit/push/PR has
   happened; this verdict does not authorize one either.
9. Proportionality — diff touches exactly the 5 files the plan named, no
   scope creep.

All 6 acceptance criteria from `cv-download-toast-plan.md` have real,
independently-reproduced evidence (cited above, not inferred from the
implementer's note).

## Re-run
`full` — build, lint, and both CDP paths independently re-executed from
this session (own dev server on a different port, own scripts), per the
recipe's "outward-facing" re-run exception given this changes a real
production button's user-visible behavior.
