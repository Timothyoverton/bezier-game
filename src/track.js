import { sampleBezier, segmentAngleDeg } from './bezier.js';

// Piecewise-linear interpolation of a level's channel (the flight corridor
// the curve has to stay inside) at a given x. Waypoints must be sorted
// ascending by x and are expected to span the full canvas width.
export function channelAt(level, x) {
  const wp = level.channel;
  if (x <= wp[0].x) return wp[0];
  for (let i = 0; i < wp.length - 1; i++) {
    const a = wp[i];
    const b = wp[i + 1];
    if (x >= a.x && x <= b.x) {
      const t = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
      return {
        minY: a.minY + (b.minY - a.minY) * t,
        maxY: a.maxY + (b.maxY - a.maxY) * t,
      };
    }
  }
  return wp[wp.length - 1];
}

// Runs the full check a "Ride" attempt needs: does the curve stay inside the
// channel everywhere, and does it ever get steeper than the level allows?
// Returns { points, channelViolation, angleViolation } — both violations are
// the first sampled point (in ride order) where the rule breaks, or null.
export function checkCurve(level, p0, p1, p2, p3) {
  const points = sampleBezier(p0, p1, p2, p3, 200);

  let channelViolation = null;
  for (const p of points) {
    const { minY, maxY } = channelAt(level, p.x);
    if (p.y < minY || p.y > maxY) {
      channelViolation = p;
      break;
    }
  }

  let angleViolation = null;
  for (let i = 1; i < points.length; i++) {
    const angle = segmentAngleDeg(points[i - 1], points[i]);
    if (angle > level.maxAngle) {
      angleViolation = points[i];
      break;
    }
  }

  return { points, channelViolation, angleViolation };
}
