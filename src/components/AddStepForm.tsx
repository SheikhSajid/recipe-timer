import React, { useState } from 'react';
import { Step } from '../types';
import { timerService } from '../services/timer';

interface AddStepFormProps {
  recipeId: string;
  currentStepCount: number;
  onAddStep: (newStep: Step) => void;
  onCancel: () => void;
}

export const AddStepForm: React.FC<AddStepFormProps> = ({
  recipeId,
  currentStepCount,
  onAddStep,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState(['']);
  const [timerDuration, setTimerDuration] = useState(0);
  const [images, setImages] = useState(['']);

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleRemoveInstruction = (index: number) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  const handleUpdateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleUpdateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = () => {
    if (!title) return;

    const newStep: Step = {
      id: crypto.randomUUID(),
      recipeId,
      title,
      instructions: instructions.filter(i => i.trim() !== ''),
      order: currentStepCount + 1,
      images: images.filter(i => i.trim() !== ''),
      timer: timerDuration > 0 ? timerService.createTimer(timerDuration) : undefined
    };

    onAddStep(newStep);
  };

  return (
    <div className="add-step-form">
      <h3>Add New Step</h3>
      <div className="form-group">
        <label>Step Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Step title"
        />
      </div>

      <div className="form-group">
        <label>Instructions</label>
        {instructions.map((instruction, index) => (
          <div key={index} className="instruction-input">
            <input
              type="text"
              value={instruction}
              onChange={(e) => handleUpdateInstruction(index, e.target.value)}
              placeholder="Instruction"
            />
            <button
              onClick={() => handleRemoveInstruction(index)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddInstruction} className="add-button">
          Add Instruction
        </button>
      </div>

      <div className="form-group">
        <label>Timer Duration (seconds)</label>
        <input
          type="number"
          value={timerDuration}
          onChange={(e) => setTimerDuration(parseInt(e.target.value) || 0)}
          placeholder="Timer duration in seconds"
        />
      </div>

      <div className="form-group">
        <label>Image URLs</label>
        {images.map((image, index) => (
          <div key={index} className="image-input">
            <input
              type="text"
              value={image}
              onChange={(e) => handleUpdateImage(index, e.target.value)}
              placeholder="Image URL"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddImage} className="add-button">
          Add Image
        </button>
      </div>

      <div className="form-controls">
        <button onClick={handleSubmit} className="submit-button">
          Add Step
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
}; 