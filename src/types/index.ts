export interface Timer {
  id: string;
  duration: number; // in seconds
  isRunning: boolean;
  remainingTime: number;
}

export interface Step {
  id: string;
  recipeId: string;
  title: string;
  instructions: string[];
  timer?: Timer;
  images: string[];
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