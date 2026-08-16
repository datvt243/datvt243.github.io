# BOOT.md — 5 orienting truths

> Read by the `/boot` command. Does NOT replace `doctrine/` — it's just a
> 60-second launchpad so you don't have to re-read everything every session.

1. Doctrine (`doctrine/`) holds verified truth — the model resets every
   session, doctrine doesn't.
2. Recipes (`haven/workers/*/recipes/`) are saved reasoning — replay them
   instead of re-deriving from scratch.
3. A worker's actions must be really observable (build/lint output,
   screenshots via Chrome CDP), not "imagined." This project has no test
   suite — don't imagine test results.
4. Every outward-facing action (commit/push/PR/delete file) needs operator
   approval — no exceptions, even when `/todo` runs both passes automatically.
5. Evidence or it didn't happen. Confidence is not output.
