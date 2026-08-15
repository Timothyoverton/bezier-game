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

// dP/dt at t — the curve's tangent direction (not yet normalized).
export function bezierTangent(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const dx = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return { dx, dy };
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

// Approximate arc length by summing the sampled polyline segments — good
// enough to pace the bike ride at a roughly constant speed.
export function approximateLength(points) {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return length;
}

// Steepness of a segment relative to horizontal, in degrees (0 = flat, 90 = vertical).
export function segmentAngleDeg(a, b) {
  return (Math.atan2(Math.abs(b.y - a.y), Math.abs(b.x - a.x)) * 180) / Math.PI;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
