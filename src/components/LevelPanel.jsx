function statusLine(check, level) {
  if (check.channelViolation) {
    return { text: '🚧 Leaves the safe zone', tone: 'bad' };
  }
  if (check.angleViolation) {
    return { text: `⚠️ Too steep somewhere (limit ${level.maxAngle}°)`, tone: 'warn' };
  }
  return { text: '✅ Looks rideable!', tone: 'good' };
}

function LevelPanel({ level, levelIndex, totalLevels, check, feedback, onReset, onRide, interactive }) {
  const status = statusLine(check, level);

  return (
    <div className="level-panel">
      <div className="level-dots">
        {Array.from({ length: totalLevels }, (_, i) => (
          <span key={i} className={`level-dot ${i === levelIndex ? 'level-dot--current' : ''} ${i < levelIndex ? 'level-dot--done' : ''}`} />
        ))}
      </div>
      <h2>
        Level {level.id} — {level.title}
      </h2>
      <p className="tip">💡 {level.tip}</p>

      {interactive && (
        <>
          <p className={`status status--${status.tone}`}>{status.text}</p>
          {feedback?.type === 'channel' && <p className="banner banner--bad">That marker is where your curve leaves the safe zone — drag a point to fix it.</p>}
          <div className="button-row">
            <button className="btn btn--secondary" onClick={onReset}>
              Reset Curve
            </button>
            <button className="btn btn--primary" onClick={onRide}>
              Ride! 🚲
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LevelPanel;
