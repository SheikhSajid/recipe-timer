import { User, Recipe, Step, Timer } from '../types';

const STORAGE_KEY = 'recipe_timer_app';

export const storageService = {
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  addRecipe: (recipe: Recipe): void => {
    const user = storageService.getUser() || { id: '1', recipes: [] };
    user.recipes.push(recipe);
    storageService.saveUser(user);
  },

  updateRecipe: (recipe: Recipe): void => {
    const user = storageService.getUser();
    if (!user) return;

    const index = user.recipes.findIndex(r => r.id === recipe.id);
    if (index !== -1) {
      user.recipes[index] = recipe;
      storageService.saveUser(user);
    }
  },

  deleteRecipe: (recipeId: string): void => {
    const user = storageService.getUser();
    if (!user) return;

    user.recipes = user.recipes.filter(r => r.id !== recipeId);
    storageService.saveUser(user);
  },

  getRecipe: (recipeId: string): Recipe | null => {
    const user = storageService.getUser();
    if (!user) return null;

    return user.recipes.find(r => r.id === recipeId) || null;
  },

  getAllRecipes: (): Recipe[] => {
    const user = storageService.getUser();
    return user?.recipes || [];
  }
}; 