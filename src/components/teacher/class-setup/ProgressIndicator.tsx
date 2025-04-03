
import React from "react";

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
};

const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, index) => (
          <div 
            key={index}
            className="flex flex-col items-center"
          >
            <div className={`flex items-center ${index !== 0 ? 'w-full' : 'ml-0'}`}>
              {index !== 0 && (
                <div 
                  className={`h-1 w-full ${
                    currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              {index !== stepLabels.length - 1 && (
                <div 
                  className={`h-1 w-full ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
            <span className="text-xs mt-1 text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
