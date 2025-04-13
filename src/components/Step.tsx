import React from 'react';
import { Step as StepType, Timer } from '../types';
import { Timer as TimerComponent } from './Timer';

interface StepProps {
  step: StepType;
  onStepUpdate: (step: StepType) => void;
}

export const Step: React.FC<StepProps> = ({ step, onStepUpdate }) => {
  const handleTimerUpdate = (timer: Timer) => {
    const updatedStep = { ...step, timer };
    onStepUpdate(updatedStep);
  };

  return (
    <div className="step">
      <h3>{step.title}</h3>
      <div className="step-content">
        <div className="step-instructions">
          {step.instructions.map((instruction, index) => (
            <p key={index}>{instruction}</p>
          ))}
        </div>
        {step.images.length > 0 && (
          <div className="step-images">
            {step.images.map((image, index) => (
              <img key={index} src={image} alt={`Step ${step.order} - Image ${index + 1}`} />
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