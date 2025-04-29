
import { CheckCircle } from "lucide-react";

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completionStatus?: boolean[];
  onStepClick?: (step: number) => void;
};

const ProgressIndicator = ({ 
  currentStep, 
  totalSteps, 
  stepLabels, 
  completionStatus = [], 
  onStepClick 
}: ProgressIndicatorProps) => {
  const handleStepClick = (stepIndex: number) => {
    if (onStepClick) {
      onStepClick(stepIndex + 1); // Convert to 1-indexed
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2 overflow-x-auto">
        <div className="w-full flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = currentStep > index + 1;
            const isCurrent = currentStep === index + 1;
            
            return (
              <div 
                key={index}
                className="flex flex-col items-center"
              >
                <div className={`flex items-center ${index !== 0 && index !== totalSteps - 1 ? 'w-full' : ''}`}>
                  {index !== 0 && (
                    <div 
                      className={`h-1 w-full max-w-12 sm:max-w-16 md:max-w-24 ${
                        currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    onClick={() => handleStepClick(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      currentStep > index + 1 
                        ? 'bg-green-500 text-white cursor-pointer' 
                        : currentStep === index + 1 
                        ? 'bg-blue-500 text-white border-2 border-blue-300 cursor-default' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200 ${onStepClick ? 'hover:opacity-80' : ''}`}
                  >
                    {currentStep > index + 1 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  {index !== totalSteps - 1 && (
                    <div 
                      className={`h-1 w-full max-w-12 sm:max-w-16 md:max-w-24 ${
                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <span 
                  onClick={() => handleStepClick(index)}
                  className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                    isCompleted 
                      ? 'text-green-600 cursor-pointer' 
                      : isCurrent 
                      ? 'text-blue-600' 
                      : 'text-gray-500'
                  }`}
                >
                  {stepLabels[index]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full mt-4">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
