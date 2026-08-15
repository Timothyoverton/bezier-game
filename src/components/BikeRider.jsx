import { useEffect, useState } from 'react';
import { bezierPoint, bezierTangent } from '../bezier.js';

const SPEED_PX_PER_SEC = 240;

// Renders the bike and animates it along the curve from t=0 to t=endT at a
// roughly constant speed, then calls onDone. Mount with a fresh `key` per
// ride attempt so the animation always restarts cleanly from t=0.
function BikeRider({ p0, p1, p2, p3, endT, length, onDone }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    let raf;
    let start = null;
    const durationMs = Math.max(500, ((length * endT) / SPEED_PX_PER_SEC) * 1000);

    function frame(now) {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / durationMs);
      setT(progress * endT);
      if (progress < 1) {
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

  const pos = bezierPoint(p0, p1, p2, p3, t);
  const tangent = bezierTangent(p0, p1, p2, p3, t);
  const angleDeg = (Math.atan2(tangent.dy, tangent.dx) * 180) / Math.PI;

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
