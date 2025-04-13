import React, { useState } from 'react';
import { Step } from '../types';
import { timerService } from '../services/timer';
import './AddStepForm.css';

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
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [images, setImages] = useState<string[]>([]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = () => {
    if (!title) return;

    const totalSeconds = timerService.parseTime(minutes, seconds);
    const newStep: Step = {
      id: crypto.randomUUID(),
      recipeId,
      title,
      instructions: instructions.filter(i => i.trim() !== ''),
      order: currentStepCount + 1,
      images,
      timer: totalSeconds > 0 ? timerService.createTimer(totalSeconds) : undefined
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
        <label>Timer Duration</label>
        <div className="timer-inputs">
          <div className="timer-input">
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              min="0"
              placeholder="Minutes"
            />
            <span>minutes</span>
          </div>
          <div className="timer-input">
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              min="0"
              max="59"
              placeholder="Seconds"
            />
            <span>seconds</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="image-upload"
        />
        <div className="image-previews">
          {images.map((imageData, index) => (
            <div key={index} className="image-preview">
              <img src={imageData} alt={`Preview ${index + 1}`} />
              <button
                onClick={() => handleRemoveImage(index)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
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