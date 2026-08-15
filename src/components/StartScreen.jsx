function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>🚲 Bezier Bridge</h1>
      <p className="subtitle">Shape a cubic bezier curve to bridge each gap, then watch your bike ride across it.</p>
      <div className="instructions">
        <h2>How to play</h2>
        <ul>
          <li>
            <strong>Drag the 4 points.</strong> The two round <em>anchors</em> sit on the cliffs; the two small <em>handles</em>
            pull the curve toward them.
          </li>
          <li>
            <strong>Stay in the glowing safe zone.</strong> Your curve has to stay inside it the whole way across.
          </li>
          <li>
            <strong>Keep it rideable.</strong> Each level has a steepest angle the bike can climb — too sharp a slope and it flips.
          </li>
          <li>
            <strong>Press Ride</strong> once you're happy with the shape, and watch your bike cross the gap!
          </li>
        </ul>
      </div>
      <button className="btn btn--primary btn--large" onClick={onStart}>
        Start
      </button>
    </div>
  );
}

export default StartScreen;
