import React, { useState } from 'react';
import { Recipe as RecipeType, Step } from '../types/index';
import { Step as StepComponent } from './Step';
import { AddStepForm } from './AddStepForm';
import { storageService } from '../services/storage';
import './Recipe.css';

interface RecipeProps {
  recipe: RecipeType;
  onRecipeUpdate: (recipe: RecipeType) => void;
}

export const Recipe: React.FC<RecipeProps> = ({ recipe, onRecipeUpdate }) => {
  const [showAddStepForm, setShowAddStepForm] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recipe.title);
  const [resetStepsTrigger, setResetStepsTrigger] = useState(0);

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

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      const updatedRecipe = { ...recipe, title: editedTitle.trim() };
      storageService.updateRecipe(updatedRecipe);
      onRecipeUpdate(updatedRecipe);
      setIsEditingTitle(false);
    }
  };

  const handleTitleCancel = () => {
    setEditedTitle(recipe.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="recipe">
      <div className="recipe-header">
        {recipe.coverImage && (
          <img src={recipe.coverImage} alt={recipe.title} className="recipe-cover" />
        )}
        {isEditingTitle ? (
          <div className="title-edit">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="title-input"
              autoFocus
            />
            <div className="title-edit-buttons">
              <button onClick={handleTitleSave} className="save-button">Save</button>
              <button onClick={handleTitleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="title-display">
            <h2>{recipe.title}</h2>
            <button onClick={handleTitleEdit} className="edit-button primary">Edit Title</button>
            <button
              onClick={() => setResetStepsTrigger(t => t + 1)}
              className="reset-steps-button secondary"
              style={{ marginLeft: '0.5em' }}
            >
              Reset Steps
            </button>
          </div>
        )}
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
              resetTrigger={resetStepsTrigger}
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
          className="add-step-button primary"
          onClick={() => setShowAddStepForm(true)}
        >
          Add New Step
        </button>
      )}
    </div>
  );
}; 