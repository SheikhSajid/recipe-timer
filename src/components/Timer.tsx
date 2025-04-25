import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer as TimerType } from '../types';
import { timerService, TIMER_SOUND } from '../services/timer';

interface TimerProps {
  timer: TimerType; // TimerType now includes 'name'
  onTimerUpdate: (timer: TimerType) => void;
}

export const Timer: React.FC<TimerProps> = ({ timer, onTimerUpdate }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remainingTime);
  const [isCompleted, setIsCompleted] = useState(timer.remainingTime === 0 && timer.duration > 0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingTime(timer.remainingTime);
    setIsCompleted(timer.remainingTime === 0 && timer.duration > 0 && !timer.isRunning);
    if (!timer.isRunning && !timer.isPaused && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timer.remainingTime, timer.duration, timer.isRunning, timer.isPaused]);

  const handleTimerComplete = useCallback(() => {
    TIMER_SOUND.play();
    const completedTimer = { ...timer, isRunning: false, isPaused: false, remainingTime: 0 };
    onTimerUpdate(completedTimer);
    setIsCompleted(true);
  }, [timer, onTimerUpdate]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timer.isRunning && !timer.isPaused) {
      let currentRemainingTime = remainingTime;

      if (currentRemainingTime <= 0) {
        handleTimerComplete();
        return;
      }

      intervalRef.current = setInterval(() => {
        if (currentRemainingTime > 1) {
          currentRemainingTime--;
          setRemainingTime(currentRemainingTime);
        } else {
          setRemainingTime(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          handleTimerComplete();
        }
      }, 1000) as unknown as number;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timer.isRunning, timer.isPaused, timer.id, remainingTime, handleTimerComplete]);

  const handleStart = () => {
    setIsCompleted(false);
    const startState = timerService.startTimer(timer);
    setRemainingTime(startState.remainingTime);
    onTimerUpdate(startState);
  };

  const handlePause = () => {
    const pauseState = timerService.pauseTimer(timer);
    onTimerUpdate(pauseState);
  };

  const handleResume = () => {
    const resumeState = timerService.resumeTimer(timer);
    onTimerUpdate(resumeState);
  };

  const handleStop = () => {
    const resetState = timerService.resetTimer(timer);
    setRemainingTime(resetState.remainingTime);
    setIsCompleted(false);
    onTimerUpdate(resetState);
  };

  return (
    <div className={`timer ${isCompleted ? 'completed' : ''}`}>
      {/* Add timer name display */}
      <div className="timer-name">{timer.name || 'Timer'}</div>
      <div className="timer-display">{timerService.formatTime(remainingTime)}</div>
      <div className="timer-controls">
        {!timer.isRunning && !timer.isPaused ? (
          <button onClick={handleStart} disabled={timer.duration <= 0}>Start</button>
        ) : timer.isPaused ? (
          <button onClick={handleResume}>Resume</button>
        ) : (
          <button onClick={handlePause}>Pause</button>
        )}
        <button onClick={handleStop} disabled={timer.duration <= 0}>Stop</button>
      </div>
    </div>
  );
};