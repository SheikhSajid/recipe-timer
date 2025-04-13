import React, { useState, useEffect } from 'react';
import { Timer as TimerType } from '../types';
import { timerService } from '../services/timer';

interface TimerProps {
  timer: TimerType;
  onTimerUpdate: (timer: TimerType) => void;
}

export const Timer: React.FC<TimerProps> = ({ timer, onTimerUpdate }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);

  useEffect(() => {
    if (timer.isRunning) {
      const newTimer = timerService.startTimer(
        timer,
        (time) => setRemainingTime(time),
        () => {
          const updatedTimer = timerService.stopTimer(timer);
          onTimerUpdate(updatedTimer);
        }
      );
      onTimerUpdate(newTimer);
    }
  }, [timer.isRunning]);

  const handleStart = () => {
    const newTimer = timerService.startTimer(
      timer,
      (time) => setRemainingTime(time),
      () => {
        const updatedTimer = timerService.stopTimer(timer);
        onTimerUpdate(updatedTimer);
      }
    );
    onTimerUpdate(newTimer);
  };

  const handleStop = () => {
    const newTimer = timerService.stopTimer(timer);
    onTimerUpdate(newTimer);
  };

  const handleReset = () => {
    const newTimer = timerService.resetTimer(timer);
    setRemainingTime(newTimer.remainingTime);
    onTimerUpdate(newTimer);
  };

  return (
    <div className="timer">
      <div className="timer-display">{timerService.formatTime(remainingTime)}</div>
      <div className="timer-controls">
        {!timer.isRunning ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}; 