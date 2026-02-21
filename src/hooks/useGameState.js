import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing game timers
 */
export default function useGameState(timeControl = null) {
  const [timers, setTimers] = useState({
    w: timeControl ? timeControl.initial : Infinity,
    b: timeControl ? timeControl.initial : Infinity,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [activeSide, setActiveSide] = useState('w');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timers[activeSide] !== Infinity) {
      intervalRef.current = setInterval(() => {
        setTimers((prev) => {
          const newTime = prev[activeSide] - 1;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return { ...prev, [activeSide]: 0 };
          }
          return { ...prev, [activeSide]: newTime };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activeSide, timers]);

  const startTimer = useCallback(() => setIsRunning(true), []);
  const stopTimer = useCallback(() => setIsRunning(false), []);

  const switchSide = useCallback(
    (side) => {
      setActiveSide(side);
      if (timeControl && timeControl.increment) {
        setTimers((prev) => ({
          ...prev,
          [side === 'w' ? 'b' : 'w']: prev[side === 'w' ? 'b' : 'w'] + timeControl.increment,
        }));
      }
    },
    [timeControl]
  );

  const resetTimers = useCallback(() => {
    setIsRunning(false);
    setTimers({
      w: timeControl ? timeControl.initial : Infinity,
      b: timeControl ? timeControl.initial : Infinity,
    });
    setActiveSide('w');
  }, [timeControl]);

  return {
    timers,
    isRunning,
    activeSide,
    startTimer,
    stopTimer,
    switchSide,
    resetTimers,
  };
}
