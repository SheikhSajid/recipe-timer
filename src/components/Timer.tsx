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
    setRemainingTime(timer.remainingTime);
  }, [timer.remainingTime]);

  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
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
  }, [timer.isRunning, timer.isPaused]);

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

  const handlePause = () => {
    const newTimer = timerService.pauseTimer(timer);
    onTimerUpdate(newTimer);
  };

  const handleResume = () => {
    const newTimer = timerService.resumeTimer(timer);
    onTimerUpdate(newTimer);
  };

  const handleStop = () => {
    const newTimer = timerService.stopTimer(timer);
    setRemainingTime(newTimer.remainingTime);
    onTimerUpdate(newTimer);
  };

  return (
    <div className="timer">
      <div className="timer-display">{timerService.formatTime(remainingTime)}</div>
      <div className="timer-controls">
        {!timer.isRunning ? (
          <button onClick={handleStart}>Start</button>
        ) : timer.isPaused ? (
          <button onClick={handleResume}>Resume</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleStop}>Stop</button>
      </div>
    </div>
  );
}; 