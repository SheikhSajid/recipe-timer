import React, { useState } from 'react';
import { Step, Timer } from '../types';
import { timerService } from '../services/timer';

interface StepEditorProps {
  step: Step;
  onSave: (updatedStep: Step) => void;
  onCancel: () => void;
}

export const StepEditor: React.FC<StepEditorProps> = ({ step, onSave, onCancel }) => {
  const [title, setTitle] = useState(step.title);
  const [instructions, setInstructions] = useState(step.instructions);
  const [timerDuration, setTimerDuration] = useState(step.timer?.duration || 0);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
      const newImages = Array.from(files);
      setImages([...images, ...newImages]);
      
      // Create preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Clean up the preview URL
    URL.revokeObjectURL(previewUrls[index]);
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSave = () => {
    const updatedStep: Step = {
      ...step,
      title,
      instructions: instructions.filter(i => i.trim() !== ''),
      images: previewUrls, // Store the preview URLs as image sources
      timer: timerDuration > 0 ? timerService.createTimer(timerDuration) : undefined
    };
    onSave(updatedStep);
  };

  return (
    <div className="step-editor">
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
        <label>Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="image-upload"
        />
        <div className="image-previews">
          {previewUrls.map((url, index) => (
            <div key={index} className="image-preview">
              <img src={url} alt={`Preview ${index + 1}`} />
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
        <button onClick={handleSave} className="save-button">
          Save
        </button>
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  );
}; 