// Pure math helpers for a cubic bezier defined by 4 points: p0 (start anchor),
// p1 (start handle), p2 (end handle), p3 (end anchor).

export function bezierPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

// Sample the curve at `steps` evenly spaced t values (inclusive of both ends).
export function sampleBezier(p0, p1, p2, p3, steps = 160) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const { x, y } = bezierPoint(p0, p1, p2, p3, t);
    points.push({ t, x, y });
  }
  return points;
}

export function pathD(p0, p1, p2, p3) {
  return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
}

// Steepness of a segment relative to horizontal, in degrees (0 = flat, 90 = vertical).
export function segmentAngleDeg(a, b) {
  return (Math.atan2(Math.abs(b.y - a.y), Math.abs(b.x - a.x)) * 180) / Math.PI;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
