
import { CheckCircle } from "lucide-react";

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
};

const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2 overflow-x-auto">
        <div className="w-full flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => (
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    currentStep > index + 1 
                      ? 'bg-green-500 text-white' 
                      : currentStep === index + 1 
                      ? 'bg-blue-500 text-white border-2 border-blue-300' 
                      : 'bg-gray-200 text-gray-500'
                  } transition-colors duration-200`}
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
              <span className="text-[10px] mt-1.5 text-gray-500 font-medium whitespace-nowrap">{stepLabels[index]}</span>
            </div>
          ))}
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
