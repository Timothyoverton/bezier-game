import { useCallback, useRef } from 'react';
import { pathD } from '../bezier.js';
import { CANVAS_H, CANVAS_W, anchorBounds, handleBounds } from '../levels.js';
import ControlPoint from './ControlPoint.jsx';
import BikeRider, { Bike } from './BikeRider.jsx';

function channelPathD(level) {
  const wp = level.channel;
  const top = wp.map((w) => `${w.x},${w.minY}`).join(' L ');
  const bottomRev = [...wp].reverse().map((w) => `${w.x},${w.maxY}`).join(' L ');
  return `M ${top} L ${bottomRev} Z`;
}

function curveStatusClass(check) {
  if (check.channelViolation) return 'curve--invalid';
  if (check.angleViolation) return 'curve--steep';
  return 'curve--valid';
}

function CurveEditor({ level, points, onPointChange, editable, check, feedback, ride, staticBike }) {
  const svgRef = useRef(null);

  const toSvgPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }, []);

  const { p0, p1, p2, p3 } = points;
  const leftBounds = anchorBounds(level, 'left');
  const rightBounds = anchorBounds(level, 'right');

  return (
    <svg
      ref={svgRef}
      className="scene"
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe4ff" />
          <stop offset="100%" stopColor="#eef8ff" />
        </linearGradient>
        <linearGradient id="chasm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={CANVAS_W} height={CANVAS_H} fill="url(#sky)" />

      {/* bottomless chasm behind the gap */}
      <rect x={level.gapStart} y="0" width={level.gapEnd - level.gapStart} height={CANVAS_H} fill="url(#chasm)" />

      {/* safe flight corridor */}
      <path d={channelPathD(level)} className="channel" />

      {/* cliffs */}
      <g className="cliff">
        <rect x="0" y={level.groundYLeft} width={level.gapStart} height={CANVAS_H - level.groundYLeft} />
        <rect x="0" y={level.groundYLeft} width={level.gapStart} height="6" className="cliff-top" />
      </g>
      <g className="cliff">
        <rect x={level.gapEnd} y={level.groundYRight} width={CANVAS_W - level.gapEnd} height={CANVAS_H - level.groundYRight} />
        <rect x={level.gapEnd} y={level.groundYRight} width={CANVAS_W - level.gapEnd} height="6" className="cliff-top" />
      </g>

      {/* handle guide lines */}
      <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} className="guide-line" />
      <line x1={p3.x} y1={p3.y} x2={p2.x} y2={p2.y} className="guide-line" />

      {/* the curve itself */}
      <path d={pathD(p0, p1, p2, p3)} className={`curve ${curveStatusClass(check)}`} />

      {feedback?.type === 'channel' && (
        <g className="marker" transform={`translate(${feedback.point.x}, ${feedback.point.y})`}>
          <circle r="14" className="marker-ring" />
          <text y="6" textAnchor="middle" className="marker-glyph">
            !
          </text>
        </g>
      )}

      {editable && (
        <>
          <ControlPoint id="p1" point={p1} bounds={handleBounds} kind="handle" toSvgPoint={toSvgPoint} onDrag={onPointChange} disabled={!editable} />
          <ControlPoint id="p2" point={p2} bounds={handleBounds} kind="handle" toSvgPoint={toSvgPoint} onDrag={onPointChange} disabled={!editable} />
          <ControlPoint id="p0" point={p0} bounds={leftBounds} kind="anchor" toSvgPoint={toSvgPoint} onDrag={onPointChange} disabled={!editable} />
          <ControlPoint id="p3" point={p3} bounds={rightBounds} kind="anchor" toSvgPoint={toSvgPoint} onDrag={onPointChange} disabled={!editable} />
        </>
      )}

      {ride && <BikeRider key={ride.key} p0={ride.p0} p1={ride.p1} p2={ride.p2} p3={ride.p3} endT={ride.endT} length={ride.length} onDone={ride.onDone} />}
      {staticBike && <Bike x={staticBike.x} y={staticBike.y} angle={staticBike.angle} crashed={staticBike.crashed} />}
    </svg>
  );
}

export default CurveEditor;
