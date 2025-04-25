import { Timer } from '../types';

// Keep the sound accessible if needed by components, or move it.
// For this refactor, the component will handle playing the sound.
export const TIMER_SOUND = new Audio('/timer-sound.mp3');

export const timerService = {
  createTimer: (duration: number, name: string = 'Timer'): Timer => ({ // Added name parameter
    id: crypto.randomUUID(),
    name, // Assign name
    duration,
    isRunning: false,
    isPaused: false,
    remainingTime: duration
  }),

  // Removed onTick and onComplete parameters
  startTimer: (timer: Timer): Timer => {
    // Returns the state for a newly started timer (starts from full duration)
    return {
      ...timer,
      isRunning: true,
      isPaused: false,
      remainingTime: timer.duration // Start from the beginning
    };
  },

  pauseTimer: (timer: Timer): Timer => {
    // Returns the state for a paused timer
    // Keeps the current remainingTime
    return {
      ...timer,
      isPaused: true,
      isRunning: false
    };
  },

  // Removed onTick and onComplete parameters
  resumeTimer: (timer: Timer): Timer => {
    // Returns the state for a resumed timer
    // Keeps the current remainingTime
    return {
      ...timer,
      isRunning: true,
      isPaused: false
    };
  },

  // Renamed from stopTimer, resets the timer completely
  resetTimer: (timer: Timer): Timer => {
    // Returns the state for a stopped/reset timer
    return {
      ...timer,
      remainingTime: timer.duration,
      isRunning: false,
      isPaused: false
    };
  },

  formatTime: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  parseTime: (minutes: number, seconds: number): number => {
    return minutes * 60 + seconds;
  },

  getMinutesAndSeconds: (totalSeconds: number): { minutes: number; seconds: number } => {
    return {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60
    };
  }
};