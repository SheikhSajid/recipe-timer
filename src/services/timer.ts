import { Timer } from '../types';

const TIMER_SOUND = new Audio('/timer-sound.mp3');

export const timerService = {
  createTimer: (duration: number): Timer => ({
    id: crypto.randomUUID(),
    duration,
    isRunning: false,
    remainingTime: duration
  }),

  startTimer: (timer: Timer, onTick: (remainingTime: number) => void, onComplete: () => void): Timer => {
    const newTimer = { ...timer, isRunning: true };
    let remainingTime = timer.remainingTime;

    const interval = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        onTick(remainingTime);
      } else {
        clearInterval(interval);
        TIMER_SOUND.play();
        onComplete();
      }
    }, 1000);

    return newTimer;
  },

  stopTimer: (timer: Timer): Timer => ({
    ...timer,
    isRunning: false
  }),

  resetTimer: (timer: Timer): Timer => ({
    ...timer,
    remainingTime: timer.duration,
    isRunning: false
  }),

  formatTime: (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}; 