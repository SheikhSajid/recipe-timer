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
  recipeId: string;
  title: string;
  instructions: string[];
  timers?: Timer[];
  images: string[]; // Base64 encoded image data
  order: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  recipes: Recipe[];
} 