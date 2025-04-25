export interface Timer {
  name: string;
  id: string;
  duration: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  remainingTime: number;
}

export interface Step {
  id: string;
  recipeId: string;
  title: string;
  instructions: string[];
  timer?: Timer;
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