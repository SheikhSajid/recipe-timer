import React, { useState, useEffect } from 'react';
import { Step as StepType, Timer } from '../types/index';
import { Timer as TimerComponent } from './Timer';
import { StepEditor } from './StepEditor';

import './Step.css';

interface StepProps {
  step: StepType;
  onStepUpdate: (step: StepType) => void;
  resetTrigger?: number;
}

export const Step: React.FC<StepProps> = ({ step, onStepUpdate, resetTrigger }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [checkedInstructions, setCheckedInstructions] = useState<boolean[]>(
    step.instructions.map(() => false)
  );

  useEffect(() => {
    setCheckedInstructions(step.instructions.map(() => false));
  }, [resetTrigger, step.instructions.length]);

  const handleTimerUpdate = (updatedTimer: Timer) => {
    const updatedTimers = step.timers?.map(timer =>
      timer.id === updatedTimer.id ? updatedTimer : timer
    );
    const updatedStep = { ...step, timers: updatedTimers };
    onStepUpdate(updatedStep);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedStep: StepType) => {
    onStepUpdate(updatedStep);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleCheckboxChange = (index: number) => {
    setCheckedInstructions((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  if (isEditing) {
    return <StepEditor step={step} onSave={handleSave} onCancel={handleCancel} />;
  }

  return (
    <div className="step">
      <div className="step-header">
        <h3>{step.title}</h3>
        <button onClick={handleEdit} className="edit-button primary">
          Edit
        </button>
      </div>
      <div className="step-content">
        <ul className="step-instructions">
          {step.instructions.map((instruction, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={checkedInstructions[index]}
                onChange={() => handleCheckboxChange(index)}
                style={{ marginRight: '0.5em' }}
              />
              <span style={{ textDecoration: checkedInstructions[index] ? 'line-through' : 'none' }}>
                {instruction}
              </span>
            </li>
          ))}
        </ul>
        {step.images.length > 0 && (
          <div className="step-images">
            {step.images.map((imageData, index) => (
              <img key={index} src={imageData} alt={`Step ${step.order} - Image ${index + 1}`} />
            ))}
          </div>
        )}
        {step.timers && step.timers.length > 0 && (
          <div className="step-timers">
            {step.timers.map((timer) => (
              <div key={timer.id} className="step-timer">
                <TimerComponent timer={timer} onTimerUpdate={handleTimerUpdate} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};