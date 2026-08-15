# Progress note — resume here

## Status: game is built, tested, and confirmed working. NOT yet deployed/pushed to GitHub.

### Update: Playwright verification complete
Ran a full headless Chromium playthrough (`/tmp/pw-test/test.mjs`, not part of
this repo) covering: start screen, level 1 (default-passes tutorial), level 2
blocked-Ride channel-violation banner + marker, dragging all 4 points to a
solved curve, riding to success, a deliberately-triggered crash on level 4
(too-steep), "Try Again" recovering into editing, solving all 6 levels in
order, and reaching the "All Levels Complete" screen. Zero console/page
errors throughout. Screenshots confirmed the visuals look right (channel
band, curve color-coding red/amber/blue, crash overlay, bike rendering).

One real bug was found and fixed **in the test harness, not the game**: `vite
preview` doesn't apply `base` from vite.config.js unless passed explicitly
via `--base /bezier-game/` on the CLI — worth remembering for any future
local-preview testing of this repo (`npx vite preview --base /bezier-game/`).
No code changes were needed in the actual app.

### What's done
- Full React + Vite app scaffolded (copied boilerplate/conventions from
  `../noughts-and-crosses`: same package.json deps, oxlint, `.claude/launch.json`
  + `run-dev.sh`, gh-pages deploy script).
- Gameplay implemented per the answers Tom gave (all recorded in this session):
  drag all 4 bezier points freely, "fit inside a channel" win condition, bike
  auto-rides and can crash on too-steep slopes, 6 hand-designed levels of
  increasing difficulty.
- Files: `src/bezier.js` (curve math), `src/track.js` (channel-fit + steepness
  checking), `src/levels.js` (6 level definitions), `src/components/*`
  (CurveEditor, ControlPoint, BikeRider, LevelPanel, Overlay, StartScreen),
  `src/App.jsx` (state machine: start → editing → riding → crashed/success →
  next level → complete).
- `npm run lint` clean, `npm run build` succeeds.
- Verified with a standalone Node script that every level is solvable within
  the same drag-bounds the UI enforces (random-restart hill-climbing found a
  valid curve for all 6 levels).

### In progress — was mid Playwright test run when asked to stop
Was scripting a full headless Playwright playthrough (drag points to known
solutions, ride every level, deliberately trigger a crash, reach the "all
complete" screen) to catch real interaction bugs before showing it to Tom.
Chromium is installed at `/home/tom/.cache/ms-playwright` and a test harness
lives at `/tmp/pw-test/test.mjs` (npm project with `playwright` installed
there, NOT part of the game repo). It was failing on the very first
`waitForSelector('h1:has-text("Bezier Bridge")')` — the vite preview server
was running (`http://localhost:4173/bezier-game/`) but the page didn't load
in time. Untriaged — could be the preview server not being fully up when the
test started, a base-path issue, or something real. **This needs
re-investigation before trusting the game is bug-free** — I have NOT
confirmed via a real browser that dragging/riding/crashing actually works,
only that math + build are sound. Node/npm are at
`/tmp/node-v22.12.0-linux-x64/bin` (not on PATH by default, not guaranteed to
survive a machine reset — same caveat as the other two game repos).

### Not started yet
- Git init + GitHub repo creation + gh-pages deploy. Per the breakout-game/
  noughts-and-crosses notes: need Tom to paste a fresh GitHub personal access
  token directly in chat when ready (repo scope, + workflow scope if he wants
  an Actions-based deploy instead of the gh-pages branch approach). Do NOT
  reuse any token found in another repo's `.git/config` — safety layer blocks
  that even with permission, must come fresh from Tom in chat.
- README.md for this repo (with play link once deployed).

### Next steps when resuming
1. ~~Re-run/fix the Playwright smoke test~~ — done, game verified working.
2. Ask Tom for a repo name confirmation (defaulting to `bezier-game`) and a
   fresh GitHub token, then git init / commit / push / enable Pages / deploy,
   same playbook as the other two games.
