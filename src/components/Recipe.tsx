import React, { useState } from 'react';
import { Recipe as RecipeType, Step } from '../types';
import { Step as StepComponent } from './Step';
import { AddStepForm } from './AddStepForm';
import { storageService } from '../services/storage';
import './Recipe.css';

interface RecipeProps {
  recipe: RecipeType;
  onRecipeUpdate: (updatedRecipe: RecipeType) => void;
}

export const Recipe: React.FC<RecipeProps> = ({ recipe, onRecipeUpdate }) => {
  const [showAddStepForm, setShowAddStepForm] = useState(false);

  const handleStepUpdate = (updatedStep: Step) => {
    const updatedSteps = recipe.steps.map(step =>
      step.id === updatedStep.id ? updatedStep : step
    );
    const updatedRecipe = { ...recipe, steps: updatedSteps };
    storageService.updateRecipe(updatedRecipe);
    onRecipeUpdate(updatedRecipe);
  };

  const handleAddStep = (newStep: Step) => {
    const updatedSteps = [...recipe.steps, newStep];
    const updatedRecipe = { ...recipe, steps: updatedSteps };
    storageService.updateRecipe(updatedRecipe);
    onRecipeUpdate(updatedRecipe);
    setShowAddStepForm(false);
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

      {showAddStepForm ? (
        <AddStepForm
          recipeId={recipe.id}
          currentStepCount={recipe.steps.length}
          onAddStep={handleAddStep}
          onCancel={() => setShowAddStepForm(false)}
        />
      ) : (
        <button
          className="add-step-button"
          onClick={() => setShowAddStepForm(true)}
        >
          Add New Step
        </button>
      )}
    </div>
  );
}; 