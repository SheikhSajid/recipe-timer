export interface Timer {
  id: string;
  name: string; // Added timer name
  duration: number; // Total duration in seconds
  remainingTime: number; // Remaining time in seconds
  isRunning: boolean;
  isPaused: boolean;
}

export interface Step {
  id: string;
  order: number;
  title: string;
  instructions: string[];
  images: string[]; // Array of base64 encoded images or URLs
  timers: Timer[];
}