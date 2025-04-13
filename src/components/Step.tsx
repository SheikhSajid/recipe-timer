import React, { useState } from 'react';
import { Step as StepType, Timer } from '../types';
import { Timer as TimerComponent } from './Timer';
import { StepEditor } from './StepEditor';

interface StepProps {
  step: StepType;
  onStepUpdate: (step: StepType) => void;
}

export const Step: React.FC<StepProps> = ({ step, onStepUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleTimerUpdate = (timer: Timer) => {
    const updatedStep = { ...step, timer };
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

  if (isEditing) {
    return <StepEditor step={step} onSave={handleSave} onCancel={handleCancel} />;
  }

  return (
    <div className="step">
      <div className="step-header">
        <h3>{step.title}</h3>
        <button onClick={handleEdit} className="edit-button">
          Edit
        </button>
      </div>
      <div className="step-content">
        <ol className="step-instructions">
          {step.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
        {step.images.length > 0 && (
          <div className="step-images">
            {step.images.map((imageData, index) => (
              <img key={index} src={imageData} alt={`Step ${step.order} - Image ${index + 1}`} />
            ))}
          </div>
        )}
        {step.timer && (
          <div className="step-timer">
            <TimerComponent timer={step.timer} onTimerUpdate={handleTimerUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}; 