import { Timer } from '../types';

const TIMER_SOUND = new Audio('/timer-sound.mp3');
const activeIntervals: { [key: string]: number } = {};

export const timerService = {
  createTimer: (duration: number): Timer => ({
    id: crypto.randomUUID(),
    duration,
    isRunning: false,
    isPaused: false,
    remainingTime: duration
  }),

  startTimer: (timer: Timer, onTick: (remainingTime: number) => void, onComplete: () => void): Timer => {
    const newTimer = { ...timer, isRunning: true, isPaused: false };
    let remainingTime = timer.remainingTime;

    // Clear any existing interval for this timer
    if (activeIntervals[timer.id]) {
      clearInterval(activeIntervals[timer.id]);
    }

    const tick = () => {
      if (remainingTime > 0) {
        remainingTime--;
        onTick(remainingTime);
      } else {
        clearInterval(activeIntervals[timer.id]);
        delete activeIntervals[timer.id];
        TIMER_SOUND.play();
        onComplete();
      }
    };

    activeIntervals[timer.id] = setInterval(tick, 1000) as unknown as number;

    return newTimer;
  },

  pauseTimer: (timer: Timer): Timer => {
    if (activeIntervals[timer.id]) {
      clearInterval(activeIntervals[timer.id]);
      delete activeIntervals[timer.id];
    }
    return {
      ...timer,
      isPaused: true,
      isRunning: false
    };
  },

  resumeTimer: (timer: Timer, onTick: (remainingTime: number) => void, onComplete: () => void): Timer => {
    const newTimer = { ...timer, isRunning: true, isPaused: false };
    let remainingTime = timer.remainingTime;

    // Clear any existing interval for this timer
    if (activeIntervals[timer.id]) {
      clearInterval(activeIntervals[timer.id]);
    }

    const tick = () => {
      if (remainingTime > 0) {
        remainingTime--;
        onTick(remainingTime);
      } else {
        clearInterval(activeIntervals[timer.id]);
        delete activeIntervals[timer.id];
        TIMER_SOUND.play();
        onComplete();
      }
    };

    activeIntervals[timer.id] = setInterval(tick, 1000) as unknown as number;

    return newTimer;
  },

  stopTimer: (timer: Timer): Timer => {
    if (activeIntervals[timer.id]) {
      clearInterval(activeIntervals[timer.id]);
      delete activeIntervals[timer.id];
    }
    return {
      ...timer,
      isRunning: false,
      isPaused: false
    };
  },

  resetTimer: (timer: Timer): Timer => {
    if (activeIntervals[timer.id]) {
      clearInterval(activeIntervals[timer.id]);
      delete activeIntervals[timer.id];
    }
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