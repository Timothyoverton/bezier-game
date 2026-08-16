// Builds the full ride path a "Ride!" attempt animates along: starting at
// the very start of the left cliff's grass, along the ground to the curve's
// start anchor, across the bezier itself, back down to the ground at the
// end anchor, along the right cliff's grass, and off the edge of the screen.
// Represented as a dense list of {x, y, s, bezierT?} samples, `s` being
// cumulative distance from the start — an arc-length parametrization that
// lets the bike move at a non-constant (slope-dependent) speed.

import { bezierPoint } from './bezier.js';
import { CANVAS_W } from './levels.js';

const OFFSCREEN_MARGIN = 140;
const GRASS_STEPS = 24;
const BEZIER_STEPS = 220;
const EXIT_STEPS = 10;

function pushSample(samples, x, y, extra) {
  const prev = samples[samples.length - 1];
  const s = prev ? prev.s + Math.hypot(x - prev.x, y - prev.y) : 0;
  samples.push({ x, y, s, ...extra });
}

function pushLine(samples, from, to, steps) {
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    pushSample(samples, from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
  }
}

export function buildRidePath(level, p0, p1, p2, p3) {
  const grassLeft = { x: 0, y: level.groundYLeft };
  const grassRight = { x: CANVAS_W, y: level.groundYRight };
  const offscreen = { x: CANVAS_W + OFFSCREEN_MARGIN, y: level.groundYRight };

  const samples = [{ x: grassLeft.x, y: grassLeft.y, s: 0 }];
  pushLine(samples, grassLeft, p0, GRASS_STEPS);
  for (let i = 1; i <= BEZIER_STEPS; i++) {
    const t = i / BEZIER_STEPS;
    const pt = bezierPoint(p0, p1, p2, p3, t);
    pushSample(samples, pt.x, pt.y, { bezierT: t });
  }
  pushLine(samples, p3, grassRight, GRASS_STEPS);
  pushLine(samples, grassRight, offscreen, EXIT_STEPS);

  return samples;
}

export function totalRideLength(samples) {
  return samples[samples.length - 1].s;
}

// Translates a bezier-t violation point (from track.js's checkCurve) into a
// distance-along-the-full-path value, so a crash can cut the ride short at
// the right spot.
export function sAtBezierT(samples, targetT) {
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i];
    const b = samples[i + 1];
    if (a.bezierT == null || b.bezierT == null) continue;
    if (targetT >= a.bezierT && targetT <= b.bezierT) {
      const span = b.bezierT - a.bezierT || 1;
      return a.s + (b.s - a.s) * ((targetT - a.bezierT) / span);
    }
  }
  return samples[samples.length - 1].s;
}

// Position and local direction at a given distance along the path.
export function pointAtS(samples, s) {
  const clamped = Math.max(0, Math.min(s, samples[samples.length - 1].s));
  let i = 1;
  while (i < samples.length - 1 && samples[i].s < clamped) i++;
  const a = samples[i - 1];
  const b = samples[i];
  const span = b.s - a.s || 1;
  const frac = (clamped - a.s) / span;
  return {
    x: a.x + (b.x - a.x) * frac,
    y: a.y + (b.y - a.y) * frac,
    dx: b.x - a.x,
    dy: b.y - a.y,
  };
}
