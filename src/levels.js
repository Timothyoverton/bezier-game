export const CANVAS_W = 900;
export const CANVAS_H = 500;

// Drag bounds for each of the 4 control points. Anchors (p0/p3) are only
// free to slide along their own cliff — they stay "planted" on solid ground.
// Handles (p1/p2) can go almost anywhere, since they're what really shapes
// the curve.
export function anchorBounds(level, side) {
  const groundY = side === 'left' ? level.groundYLeft : level.groundYRight;
  return {
    xMin: side === 'left' ? 30 : level.gapEnd,
    xMax: side === 'left' ? level.gapStart : CANVAS_W - 30,
    yMin: groundY - 160,
    yMax: groundY,
  };
}

export const handleBounds = {
  xMin: 10,
  xMax: CANVAS_W - 10,
  yMin: 10,
  yMax: CANVAS_H - 10,
};

export const LEVELS = [
  {
    id: 1,
    title: 'First Arc',
    tip: 'Drag the two middle handles — they pull the curve toward them. Shape a nice arch, then hit Ride!',
    gapStart: 320,
    gapEnd: 580,
    groundYLeft: 380,
    groundYRight: 380,
    maxAngle: 85,
    channel: [
      { x: 0, minY: 40, maxY: 380 },
      { x: 320, minY: 40, maxY: 380 },
      { x: 450, minY: 40, maxY: 460 },
      { x: 580, minY: 40, maxY: 380 },
      { x: 900, minY: 40, maxY: 380 },
    ],
    initial: {
      p0: { x: 260, y: 380 },
      p1: { x: 370, y: 340 },
      p2: { x: 530, y: 340 },
      p3: { x: 640, y: 380 },
    },
  },
  {
    id: 2,
    title: 'Arch Higher',
    tip: 'The further a handle sits from its anchor, the more it bends the curve toward it — pull both middle handles UP to clear the overhang.',
    gapStart: 300,
    gapEnd: 600,
    groundYLeft: 380,
    groundYRight: 380,
    maxAngle: 80,
    channel: [
      { x: 0, minY: 40, maxY: 380 },
      { x: 300, minY: 40, maxY: 380 },
      { x: 450, minY: 230, maxY: 340 },
      { x: 600, minY: 40, maxY: 380 },
      { x: 900, minY: 40, maxY: 380 },
    ],
    initial: {
      p0: { x: 260, y: 380 },
      p1: { x: 360, y: 380 },
      p2: { x: 540, y: 380 },
      p3: { x: 640, y: 380 },
    },
  },
  {
    id: 3,
    title: 'S-Curve Valley',
    tip: 'Pull the two handles in OPPOSITE directions (one up, one down) to bend the curve into an S — dip into each valley, then rise for the ridge.',
    gapStart: 260,
    gapEnd: 680,
    groundYLeft: 380,
    groundYRight: 380,
    maxAngle: 75,
    channel: [
      { x: 0, minY: 40, maxY: 380 },
      { x: 260, minY: 40, maxY: 380 },
      { x: 380, minY: 40, maxY: 420 },
      { x: 470, minY: 180, maxY: 260 },
      { x: 560, minY: 40, maxY: 420 },
      { x: 680, minY: 40, maxY: 380 },
      { x: 900, minY: 40, maxY: 380 },
    ],
    initial: {
      p0: { x: 220, y: 380 },
      p1: { x: 340, y: 380 },
      p2: { x: 600, y: 380 },
      p3: { x: 720, y: 380 },
    },
  },
  {
    id: 4,
    title: 'Steep Drop-off',
    tip: "This bike can't handle slopes steeper than 50°. A handle's DIRECTION from its anchor sets the curve's takeoff/landing angle — keep it gentle, not vertical.",
    gapStart: 280,
    gapEnd: 620,
    groundYLeft: 300,
    groundYRight: 420,
    maxAngle: 50,
    channel: [
      { x: 0, minY: 40, maxY: 300 },
      { x: 280, minY: 40, maxY: 300 },
      { x: 450, minY: 160, maxY: 380 },
      { x: 620, minY: 40, maxY: 420 },
      { x: 900, minY: 40, maxY: 420 },
    ],
    initial: {
      p0: { x: 240, y: 300 },
      p1: { x: 330, y: 260 },
      p2: { x: 560, y: 460 },
      p3: { x: 660, y: 420 },
    },
  },
  {
    id: 5,
    title: 'Narrow Tunnel',
    tip: 'Tight squeeze — thread the curve through each window in turn. Short, precisely-aimed handles give you fine control.',
    gapStart: 250,
    gapEnd: 650,
    groundYLeft: 380,
    groundYRight: 380,
    maxAngle: 60,
    channel: [
      { x: 0, minY: 40, maxY: 380 },
      { x: 250, minY: 40, maxY: 380 },
      { x: 330, minY: 150, maxY: 260 },
      { x: 420, minY: 260, maxY: 370 },
      { x: 500, minY: 150, maxY: 260 },
      { x: 580, minY: 260, maxY: 370 },
      { x: 650, minY: 40, maxY: 380 },
      { x: 900, minY: 40, maxY: 380 },
    ],
    initial: {
      p0: { x: 210, y: 380 },
      p1: { x: 320, y: 380 },
      p2: { x: 580, y: 380 },
      p3: { x: 690, y: 380 },
    },
  },
  {
    id: 6,
    title: 'Final Crossing',
    tip: 'Everything you\'ve learned at once: a winding tunnel, a steep angle limit, and a landing far below your takeoff. Good luck!',
    gapStart: 220,
    gapEnd: 700,
    groundYLeft: 340,
    groundYRight: 420,
    maxAngle: 45,
    channel: [
      { x: 0, minY: 40, maxY: 340 },
      { x: 220, minY: 40, maxY: 340 },
      { x: 330, minY: 120, maxY: 260 },
      { x: 430, minY: 260, maxY: 400 },
      { x: 530, minY: 340, maxY: 460 },
      { x: 610, minY: 220, maxY: 340 },
      { x: 700, minY: 40, maxY: 420 },
      { x: 900, minY: 40, maxY: 420 },
    ],
    initial: {
      p0: { x: 180, y: 340 },
      p1: { x: 300, y: 340 },
      p2: { x: 620, y: 420 },
      p3: { x: 740, y: 420 },
    },
  },
];
