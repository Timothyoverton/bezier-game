import { useEffect, useRef, useState } from 'react';
import { buildRidePath, pointAtS, sAtBezierT, totalRideLength } from '../ride.js';

const BASE_SPEED = 320; // px/sec on flat ground
const SLOPE_INFLUENCE = 0.65; // how much a slope speeds up/slows down the ride
const MIN_MULTIPLIER = 0.35;
const MAX_MULTIPLIER = 1.9;

// Uphill (screen y decreasing while moving forward) slows the bike down;
// downhill speeds it up — same idea as coasting a real bike.
function speedMultiplier(dx, dy) {
  const climb = -dy;
  const angle = Math.atan2(climb, Math.abs(dx) || 1);
  const raw = 1 - SLOPE_INFLUENCE * Math.sin(angle);
  return Math.min(MAX_MULTIPLIER, Math.max(MIN_MULTIPLIER, raw));
}

// Renders the bike and rides it along the full path (grass → curve → grass
// → off-screen), or only up to `crashT` if this attempt is a crash. Mount
// with a fresh `key` per ride attempt so it always restarts from the start
// of the grass.
function BikeRider({ level, p0, p1, p2, p3, crashT, onDone }) {
  const samplesRef = useRef(null);
  if (!samplesRef.current) samplesRef.current = buildRidePath(level, p0, p1, p2, p3);
  const samples = samplesRef.current;
  const endS = crashT != null ? sAtBezierT(samples, crashT) : totalRideLength(samples);

  const [pos, setPos] = useState(() => ({ ...pointAtS(samples, 0), dx: 1, dy: 0 }));

  useEffect(() => {
    let raf;
    let last = null;
    let s = 0;

    function frame(now) {
      if (last === null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const here = pointAtS(samples, s);
      const mult = speedMultiplier(here.dx, here.dy);
      s = Math.min(endS, s + BASE_SPEED * mult * dt);
      setPos(pointAtS(samples, s));

      if (s < endS) {
        raf = requestAnimationFrame(frame);
      } else {
        onDone();
      }
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // Deliberately run once per mount (per ride attempt) — see the `key` prop
    // where this is used.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const angleDeg = (Math.atan2(pos.dy, pos.dx) * 180) / Math.PI;
  return <Bike x={pos.x} y={pos.y} angle={angleDeg} />;
}

export function Bike({ x, y, angle, crashed }) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${crashed ? angle + 100 : angle})`}
      className={`bike ${crashed ? 'bike--crashed' : ''}`}
    >
      <g transform="translate(-22, -22)">
        <circle cx="7" cy="32" r="9" className="bike-wheel" />
        <circle cx="37" cy="32" r="9" className="bike-wheel" />
        <path d="M7 32 L21 13 L37 32 M21 13 L26 5 L32 6 M21 13 L15 32" className="bike-frame" />
        <circle cx="26" cy="3" r="4.5" className="bike-rider" />
      </g>
    </g>
  );
}

export default BikeRider;
