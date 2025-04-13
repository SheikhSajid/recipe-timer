import React, { useState, useEffect, useCallback } from 'react';
import { Timer as TimerType } from '../types';
import { timerService } from '../services/timer';

interface TimerProps {
  timer: TimerType;
  onTimerUpdate: (timer: TimerType) => void;
}

export const Timer: React.FC<TimerProps> = ({ timer, onTimerUpdate }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleTimerComplete = useCallback(() => {
    const updatedTimer = timerService.stopTimer(timer);
    onTimerUpdate(updatedTimer);
    setIsCompleted(true);
  }, [timer, onTimerUpdate]);

  useEffect(() => {
    setRemainingTime(timer.remainingTime);
    setIsCompleted(timer.remainingTime === 0);
  }, [timer.remainingTime]);

  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      const newTimer = timerService.startTimer(
        timer,
        (time) => setRemainingTime(time),
        handleTimerComplete
      );
      onTimerUpdate(newTimer);
    }
  }, [timer.isRunning, timer.isPaused, timer, onTimerUpdate, handleTimerComplete]);

  const handleStart = () => {
    setIsCompleted(false);
    const newTimer = timerService.startTimer(
      timer,
      (time) => setRemainingTime(time),
      handleTimerComplete
    );
    onTimerUpdate(newTimer);
  };

  const handlePause = () => {
    const newTimer = timerService.pauseTimer(timer);
    onTimerUpdate(newTimer);
  };

  const handleResume = () => {
    const newTimer = timerService.resumeTimer(
      timer,
      (time) => setRemainingTime(time),
      handleTimerComplete
    );
    onTimerUpdate(newTimer);
  };

  const handleStop = () => {
    const newTimer = timerService.stopTimer(timer);
    setRemainingTime(newTimer.remainingTime);
    setIsCompleted(false);
    onTimerUpdate(newTimer);
  };

  return (
    <div className={`timer ${isCompleted ? 'completed' : ''}`}>
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