import React, { useState } from 'react';
import { Recipe, Step } from '../types/index';
import { storageService } from '../services/storage';
import { timerService } from '../services/timer';

interface RecipeFormProps {
  onRecipeAdded: (recipe: Recipe) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onRecipeAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState({
    title: '',
    instructions: [''],
    timerDuration: 0,
    images: ['']
  });

  const handleAddStep = () => {
    if (!currentStep.title) return;

    const newStep: Step = {
      id: crypto.randomUUID(),
      recipeId: '', // Will be set when recipe is created
      title: currentStep.title,
      instructions: currentStep.instructions.filter(i => i.trim() !== ''),
      order: steps.length + 1,
      images: currentStep.images.filter(i => i.trim() !== ''),
      timers: currentStep.timerDuration > 0 ? [timerService.createTimer(currentStep.timerDuration)] : undefined
    };

    setSteps([...steps, newStep]);
    setCurrentStep({
      title: '',
      instructions: [''],
      timerDuration: 0,
      images: ['']
    });
  };

  const handleAddRecipe = () => {
    if (!title || steps.length === 0) return;

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      title,
      description,
      coverImage: coverImage || undefined,
      steps: steps.map(step => ({
        ...step,
        recipeId: crypto.randomUUID()
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    storageService.addRecipe(newRecipe);
    onRecipeAdded(newRecipe);
  };

  return (
    <div className="recipe-form">
      <h2>Add New Recipe</h2>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe title"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Recipe description"
        />
      </div>
      <div className="form-group">
        <label>Cover Image URL</label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="Image URL"
        />
      </div>

      <div className="steps-section">
        <h3>Steps</h3>
        {steps.map(step => (
          <div key={step.id} className="step-preview">
            <h4>{step.title}</h4>
            <p>{step.instructions.join(', ')}</p>
            {step.timers && <p>Timer: {timerService.formatTime(step.timers[0].duration)}</p>}
          </div>
        ))}

        <div className="step-form">
          <h4>Add Step</h4>
          <div className="form-group">
            <label>Step Title</label>
            <input
              type="text"
              value={currentStep.title}
              onChange={(e) => setCurrentStep({ ...currentStep, title: e.target.value })}
              placeholder="Step title"
            />
          </div>
          <div className="form-group">
            <label>Instructions</label>
            {currentStep.instructions.map((instruction, index) => (
              <div key={index} className="instruction-input">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => {
                    const newInstructions = [...currentStep.instructions];
                    newInstructions[index] = e.target.value;
                    setCurrentStep({ ...currentStep, instructions: newInstructions });
                  }}
                  placeholder="Instruction"
                />
                <button
                  onClick={() => {
                    const newInstructions = [...currentStep.instructions];
                    newInstructions.splice(index, 1);
                    setCurrentStep({ ...currentStep, instructions: newInstructions });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => setCurrentStep({ ...currentStep, instructions: [...currentStep.instructions, ''] })}>
              Add Instruction
            </button>
          </div>
          <div className="form-group">
            <label>Timer Duration (seconds)</label>
            <input
              type="number"
              value={currentStep.timerDuration}
              onChange={(e) => setCurrentStep({ ...currentStep, timerDuration: parseInt(e.target.value) || 0 })}
              placeholder="Timer duration in seconds"
            />
          </div>
          <div className="form-group">
            <label>Image URLs</label>
            {currentStep.images.map((image, index) => (
              <div key={index} className="image-input">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => {
                    const newImages = [...currentStep.images];
                    newImages[index] = e.target.value;
                    setCurrentStep({ ...currentStep, images: newImages });
                  }}
                  placeholder="Image URL"
                />
                <button
                  onClick={() => {
                    const newImages = [...currentStep.images];
                    newImages.splice(index, 1);
                    setCurrentStep({ ...currentStep, images: newImages });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => setCurrentStep({ ...currentStep, images: [...currentStep.images, ''] })}>
              Add Image
            </button>
          </div>
          <button onClick={handleAddStep}>Add Step</button>
        </div>
      </div>

      <button className="submit-button" onClick={handleAddRecipe}>
        Create Recipe
      </button>
    </div>
  );
};

export default RecipeForm; 