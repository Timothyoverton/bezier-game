import { useCallback, useEffect, useState } from 'react';
import { clamp } from '../bezier.js';

function ControlPoint({ id, point, bounds, kind, toSvgPoint, onDrag, disabled }) {
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    },
    [disabled],
  );

  useEffect(() => {
    if (!dragging) return undefined;

    function handleMove(e) {
      const raw = toSvgPoint(e.clientX, e.clientY);
      onDrag(id, {
        x: clamp(raw.x, bounds.xMin, bounds.xMax),
        y: clamp(raw.y, bounds.yMin, bounds.yMax),
      });
    }
    function handleUp() {
      setDragging(false);
    }

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging, toSvgPoint, onDrag, id, bounds]);

  const radius = kind === 'anchor' ? 13 : 10;

  return (
    <circle
      className={`control-point control-point--${kind} ${dragging ? 'control-point--dragging' : ''} ${disabled ? 'control-point--disabled' : ''}`}
      cx={point.x}
      cy={point.y}
      r={radius}
      onPointerDown={handlePointerDown}
    />
  );
}

export default ControlPoint;
