import { useCallback, useMemo, useState } from 'react';
import { LEVELS } from './levels.js';
import { checkCurve } from './track.js';
import StartScreen from './components/StartScreen.jsx';
import CurveEditor from './components/CurveEditor.jsx';
import LevelPanel from './components/LevelPanel.jsx';
import Overlay from './components/Overlay.jsx';
import './App.css';

function freshPoints(level) {
  return {
    p0: { ...level.initial.p0 },
    p1: { ...level.initial.p1 },
    p2: { ...level.initial.p2 },
    p3: { ...level.initial.p3 },
  };
}

function App() {
  const [stage, setStage] = useState('start');
  const [levelIndex, setLevelIndex] = useState(0);
  const [points, setPoints] = useState(() => freshPoints(LEVELS[0]));
  const [feedback, setFeedback] = useState(null);
  const [rideAttempt, setRideAttempt] = useState(0);
  const [rideMeta, setRideMeta] = useState(null);

  const level = LEVELS[levelIndex];
  const check = useMemo(() => checkCurve(level, points.p0, points.p1, points.p2, points.p3), [level, points]);

  const handlePointChange = useCallback((id, newPoint) => {
    setPoints((prev) => ({ ...prev, [id]: newPoint }));
    setFeedback(null);
  }, []);

  const handleReset = useCallback(() => {
    setPoints(freshPoints(level));
    setFeedback(null);
  }, [level]);

  const handleRide = useCallback(() => {
    if (check.channelViolation) {
      setFeedback({ type: 'channel', point: check.channelViolation });
      return;
    }
    const outcome = check.angleViolation ? 'crash' : 'success';
    setFeedback(null);
    setRideMeta({
      p0: points.p0,
      p1: points.p1,
      p2: points.p2,
      p3: points.p3,
      crashT: check.angleViolation ? check.angleViolation.t : null,
      outcome,
      crashPoint: check.angleViolation || null,
    });
    setRideAttempt((n) => n + 1);
    setStage('riding');
  }, [check, points]);

  const handleRideDone = useCallback(() => {
    setStage(rideMeta?.outcome === 'crash' ? 'crashed' : 'success');
  }, [rideMeta]);

  const goToLevel = useCallback((index) => {
    setLevelIndex(index);
    setPoints(freshPoints(LEVELS[index]));
    setFeedback(null);
    setStage('editing');
  }, []);

  const handleStart = useCallback(() => goToLevel(0), [goToLevel]);
  const handleTryAgain = useCallback(() => setStage('editing'), []);
  const handleNextLevel = useCallback(() => {
    const next = levelIndex + 1;
    if (next >= LEVELS.length) {
      setStage('complete');
      return;
    }
    goToLevel(next);
  }, [levelIndex, goToLevel]);

  if (stage === 'start') {
    return (
      <div className="app">
        <StartScreen onStart={handleStart} />
      </div>
    );
  }

  const isLastLevel = levelIndex + 1 >= LEVELS.length;

  return (
    <div className="app">
      <div className="game-frame">
        <CurveEditor
          level={level}
          points={points}
          onPointChange={handlePointChange}
          editable={stage === 'editing'}
          check={check}
          feedback={stage === 'editing' ? feedback : null}
          ride={
            stage === 'riding' && rideMeta
              ? {
                  key: rideAttempt,
                  p0: rideMeta.p0,
                  p1: rideMeta.p1,
                  p2: rideMeta.p2,
                  p3: rideMeta.p3,
                  crashT: rideMeta.crashT,
                  onDone: handleRideDone,
                }
              : null
          }
          staticBike={
            stage === 'crashed' && rideMeta?.crashPoint
              ? { x: rideMeta.crashPoint.x, y: rideMeta.crashPoint.y, angle: 0, crashed: true }
              : null
          }
        />

        {stage === 'crashed' && (
          <Overlay
            variant="crashed"
            title="💥 Crash!"
            message={`Too steep there — this bike can't handle more than ${level.maxAngle}°. Adjust your handles and try again.`}
            buttonLabel="Try Again"
            onButtonClick={handleTryAgain}
          />
        )}

        {stage === 'success' && (
          <Overlay
            variant="success"
            title="🎉 You made it!"
            message={isLastLevel ? "You bridged every gap — that's the whole game!" : 'Great curve — the gap is bridged!'}
            buttonLabel={isLastLevel ? 'Finish' : 'Next Level'}
            onButtonClick={handleNextLevel}
          />
        )}

        {stage === 'complete' && (
          <Overlay
            variant="complete"
            title="🏆 All Levels Complete!"
            message="You've mastered bezier curves — gentle arcs, tight S-curves, narrow tunnels, and steep drop-offs."
            buttonLabel="Play Again"
            onButtonClick={handleStart}
          />
        )}
      </div>

      {stage !== 'complete' && (
        <LevelPanel
          level={level}
          levelIndex={levelIndex}
          totalLevels={LEVELS.length}
          check={check}
          feedback={feedback}
          onReset={handleReset}
          onRide={handleRide}
          interactive={stage === 'editing'}
        />
      )}
    </div>
  );
}

export default App;
