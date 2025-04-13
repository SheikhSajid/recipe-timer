import React from 'react';
import { Recipe as RecipeType, Step } from '../types';
import { Step as StepComponent } from './Step';

interface RecipeProps {
  recipe: RecipeType;
  onRecipeUpdate: (recipe: RecipeType) => void;
}

export const Recipe: React.FC<RecipeProps> = ({ recipe, onRecipeUpdate }) => {
  const handleStepUpdate = (updatedStep: Step) => {
    const updatedSteps = recipe.steps.map(step =>
      step.id === updatedStep.id ? updatedStep : step
    );
    const updatedRecipe = { ...recipe, steps: updatedSteps };
    onRecipeUpdate(updatedRecipe);
  };

  return (
    <div className="recipe">
      <div className="recipe-header">
        {recipe.coverImage && (
          <img src={recipe.coverImage} alt={recipe.title} className="recipe-cover" />
        )}
        <h2>{recipe.title}</h2>
        <p className="recipe-description">{recipe.description}</p>
      </div>
      <div className="recipe-steps">
        {recipe.steps
          .sort((a, b) => a.order - b.order)
          .map(step => (
            <StepComponent
              key={step.id}
              step={step}
              onStepUpdate={handleStepUpdate}
            />
          ))}
      </div>
    </div>
  );
}; 