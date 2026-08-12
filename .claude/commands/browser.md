---
description: Ensure a Chrome instance with the remote debugger (port 9888) is running, reusing it instead of relaunching
---

Make sure a debuggable Chrome instance is available for UI checks, in order:

1. **Check if it's already running**: `curl -s http://localhost:9888/json/version`.
   - If this returns JSON, it's already up — report that it's ready and stop.
     Do **not** launch a second instance (a running Chrome ignores
     `--remote-debugging-port` on its default profile, and a duplicate
     `--user-data-dir` instance just adds clutter — this is exactly the
     "opening/closing repeatedly" the user wants to avoid).

2. **If not running, launch it** with a dedicated profile (so it doesn't
   collide with the user's regular Chrome window/profile):
   ```bash
   open -na "Google Chrome" --args \
     --remote-debugging-port=9888 \
     --user-data-dir="$HOME/.chrome-debug-profile"
   ```

3. **Verify it came up**: poll `curl -s http://localhost:9888/json/version`
   (a short retry loop — it can take a second or two to bind the port) until it
   returns JSON.

4. Report that it's ready. For actual navigation/interaction/screenshots
   against it, connect via `puppeteer-core`'s
   `puppeteer.connect({ browserURL: 'http://localhost:9888' })` (already a
   project dependency — reuse it rather than adding a new tool) from a script
   run inside the project directory (needed for `node_modules` resolution).

This command only ensures the browser is *up* — it does not navigate anywhere
or start the dev server. Reuse this same instance for every check in the
session instead of calling this again or opening new Chrome windows.

$ARGUMENTS
