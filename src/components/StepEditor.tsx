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
  const [timersInput, setTimersInput] = useState<{ name: string; minutes: number; seconds: number }[]>(() => {
    const initialTimers = (step.timers || []).map(timer => ({
      name: timer.name || 'Timer',
      minutes: Math.floor(timer.duration / 60),
      seconds: timer.duration % 60
    }));
    return initialTimers.length > 0 ? initialTimers : [{ name: 'Timer', minutes: 0, seconds: 0 }];
  });

  const [images, setImages] = useState<string[]>(step.images || []);

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
            setImages(prev => [...prev, reader.result as string]);
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

  const handleAddTimerInput = () => {
    setTimersInput(currentInputs => [...currentInputs, { name: 'Timer', minutes: 0, seconds: 0 }]);
  };

  const handleRemoveTimerInput = (index: number) => {
    const newTimersInput = [...timersInput];
    newTimersInput.splice(index, 1);
    if (newTimersInput.length === 0) {
      setTimersInput([{ name: 'Timer', minutes: 0, seconds: 0 }]);
    } else {
      setTimersInput(newTimersInput);
    }
  };

  const handleUpdateTimerInput = (index: number, field: 'name' | 'minutes' | 'seconds', value: string | number) => {
    const newTimersInput = [...timersInput];
    const processedValue = field === 'name' ? String(value) : Math.max(0, parseInt(String(value)) || 0);
    if (field === 'seconds') {
      newTimersInput[index] = { ...newTimersInput[index], [field]: Math.min(59, processedValue as number) };
    } else {
      newTimersInput[index] = { ...newTimersInput[index], [field]: processedValue };
    }
    setTimersInput(newTimersInput);
  };

  const handleSave = () => {
    const validTimersInput = timersInput.filter(input =>
      typeof input.name === 'string' &&
      typeof input.minutes === 'number' &&
      typeof input.seconds === 'number'
    );

    const updatedTimers: Timer[] = validTimersInput
      .map(input => ({
        name: input.name.trim() || 'Timer',
        duration: timerService.parseTime(input.minutes, input.seconds)
      }))
      .filter(timerData => timerData.duration > 0)
      .map((timerData) => {
        const existingTimer = (step.timers || []).find(t => t.duration === timerData.duration && t.name === timerData.name);
        return existingTimer ? { ...existingTimer } : timerService.createTimer(timerData.duration, timerData.name);
      });

    const updatedStep: Step = {
      ...step,
      title,
      instructions: instructions.filter(i => i.trim() !== ''),
      images,
      timers: updatedTimers
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
        <label>Timers</label>
        {timersInput.map((timerInput, index) => (
          <div key={index} className="timer-input-group">
            <div className="timer-input timer-name-input">
              <input
                type="text"
                value={timerInput.name}
                onChange={(e) => handleUpdateTimerInput(index, 'name', e.target.value)}
                placeholder="Timer Name (e.g., Boil)"
              />
            </div>
            <div className="timer-inputs">
              <div className="timer-input">
                <input
                  type="number"
                  value={timerInput.minutes}
                  onChange={(e) => handleUpdateTimerInput(index, 'minutes', e.target.value)}
                  min="0"
                  placeholder="Minutes"
                />
                <span>minutes</span>
              </div>
              <div className="timer-input">
                <input
                  type="number"
                  value={timerInput.seconds}
                  onChange={(e) => handleUpdateTimerInput(index, 'seconds', e.target.value)}
                  min="0"
                  max="59"
                  placeholder="Seconds"
                />
                <span>seconds</span>
              </div>
            </div>
            {timersInput.length > 1 && (
              <button
                onClick={() => handleRemoveTimerInput(index)}
                className="remove-button remove-timer-button"
              >
                Remove Timer
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddTimerInput} className="add-button add-timer-button">
          Add Another Timer
        </button>
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