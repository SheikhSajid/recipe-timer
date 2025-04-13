import React, { useState, useEffect } from 'react';
import { Recipe as RecipeType } from './types';
import { Recipe as RecipeComponent } from './components/Recipe';
import RecipeForm from './components/RecipeForm';
import { storageService } from './services/storage';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

  useEffect(() => {
    const loadedRecipes = storageService.getAllRecipes();
    setRecipes(loadedRecipes);
  }, []);

  const handleRecipeUpdate = (updatedRecipe: RecipeType) => {
    storageService.updateRecipe(updatedRecipe);
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const handleRecipeAdded = (newRecipe: RecipeType) => {
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
    setSelectedRecipe(newRecipe);
    setShowNewRecipeForm(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Recipe Timer</h1>
      </header>
      <main className="app-content">
        <div className="recipe-list">
          <div className="recipe-list-header">
            <h2>My Recipes</h2>
            <button 
              className="new-recipe-button"
              onClick={() => setShowNewRecipeForm(true)}
            >
              New Recipe
            </button>
          </div>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <div
                key={recipe.id}
                className="recipe-card"
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setShowNewRecipeForm(false);
                }}
              >
                {recipe.coverImage && (
                  <img src={recipe.coverImage} alt={recipe.title} />
                )}
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="recipe-detail">
          {showNewRecipeForm ? (
            <RecipeForm onRecipeAdded={handleRecipeAdded} />
          ) : selectedRecipe ? (
            <RecipeComponent
              recipe={selectedRecipe}
              onRecipeUpdate={handleRecipeUpdate}
            />
          ) : (
            <div className="no-recipe-selected">
              <p>Select a recipe to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
