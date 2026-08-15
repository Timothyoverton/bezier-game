# Bezier Bridge

An educational bezier-curve game built with React — shape a cubic bezier curve to bridge a gap, then watch your bike ride across it!

## Play Now

🚲 **Play the game:** https://timothyoverton.github.io/bezier-game/

## How to Play

1. Open the game in your browser (click the link above!)
2. Each level is a gap between two cliffs, with a glowing "safe zone" corridor stretched across it
3. **Drag all 4 points** of the bezier curve — the two round green **anchors** sit on the cliffs, and the two orange **handles** pull the curve's shape toward them
4. Keep the whole curve inside the safe zone, and keep it gentle enough for the bike to climb (each level has a steepest angle it can handle before it flips)
5. Press **Ride!** — if your curve is good, the bike crosses the gap and you move to the next level

There are 6 levels, each introducing a new bezier concept: handle distance controls how sharply the curve bends, pulling handles in opposite directions makes an S-curve, and a handle's direction from its anchor sets the curve's takeoff/landing angle.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes for the Next Game

This one follows the same **React + Vite** pattern as `noughts-and-crosses`
(copied its boilerplate directly: package.json deps, oxlint config,
`.claude/launch.json` + `run-dev.sh`, `gh-pages` deploy script).

- **Game structure**: `src/bezier.js` holds pure cubic-bezier math (point/
  tangent/sampling), `src/track.js` holds the level-validation logic (channel
  fit + max-slope check), `src/levels.js` holds all level data as plain
  objects. Keeping curve math, validation, and level data in separate files
  from the React components made it easy to unit-test with a throwaway Node
  script before ever opening a browser.
- **Verifying level solvability without a browser**: wrote a small
  random-restart hill-climbing script (Node, importing the actual
  `src/levels.js` / `src/track.js` — they're plain ESM with no JSX, so Node
  can import them directly) that searches for a valid point configuration
  within the same drag-bounds the UI enforces. Ran this against all 6 levels
  before ever touching a browser to prove every level is actually
  completable. Cheap and very worth doing for any game with hand-tuned
  numeric levels.
- **Testing with Playwright**: `npm install playwright` in a **scratch
  directory outside the repo** (`/tmp/pw-test` this round) rather than adding
  it to the game's own `package.json` — it's a dev-only testing tool, not
  something the deployed game needs. `npx playwright install chromium`
  downloads the browser (~300MB, takes a minute). Drove full playthroughs via
  raw `page.mouse` down/move/up sequences to simulate dragging (the SVG
  control points use Pointer Events, which Chromium synthesizes correctly
  from simulated mouse input) — just add small `waitForTimeout` gaps between
  down/move/up so React's event listeners have a chance to attach before the
  next event fires, otherwise fast synthetic drags can silently no-op.
- **`vite preview` does NOT apply `base` from `vite.config.js` by default** —
  if your config only sets `base` when `command === 'build'` (the standard
  pattern for GitHub Pages project sites), then `vite preview` serves assets
  at `/` while the built `index.html` references `/repo-name/`-prefixed
  paths, so nothing loads and you get silent 404s. Fix: run
  `npx vite preview --base /repo-name/` explicitly when locally previewing a
  production build.
- **No Node/npm on this machine's normal PATH.** Same as last time — a Node
  install was fetched to `/tmp/node-v22.12.0-linux-x64/bin` and used via the
  `.claude/launch.json` + `.claude/run-dev.sh` wrapper. That `/tmp` install
  does not persist across machine resets; check early next time.
- **GitHub token**: per the last two games' notes, paste a fresh personal
  access token directly in chat when repo creation comes up (`repo` scope,
  `workflow` scope too for an Actions-based deploy) — don't expect one to be
  reused automatically from another repo's `.git/config`, even with
  permission.
