import React from "react";
import { useProfileJourney } from "./ProfileJourneyContext";
import { 
  CheckCircle, 
  ArrowRight, 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  PaintBucket,
  CheckSquare,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileProgressIndicator = () => {
  const { 
    steps, 
    stepsInfo, 
    currentStep, 
    completedSteps, 
    stepProgress,
    overallProgress,
    setCurrentStep 
  } = useProfileJourney();
  
  // Get the right icon for each step
  const getStepIcon = (step: string, isCompleted: boolean) => {
    const iconClass = isCompleted ? "text-emerald-500" : "text-gray-500";
    
    switch(step) {
      case 'personal':
        return <User className={`h-5 w-5 ${iconClass}`} />;
      case 'location':
        return <MapPin className={`h-5 w-5 ${iconClass}`} />;
      case 'education':
        return <GraduationCap className={`h-5 w-5 ${iconClass}`} />;
      case 'experience':
        return <Briefcase className={`h-5 w-5 ${iconClass}`} />;
      case 'expertise':
        return <BookOpen className={`h-5 w-5 ${iconClass}`} />;
      case 'teaching-style':
        return <PaintBucket className={`h-5 w-5 ${iconClass}`} />;
      case 'verification':
        return <CheckSquare className={`h-5 w-5 ${iconClass}`} />;
      case 'platform':
        return <Video className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <CheckCircle className={`h-5 w-5 ${iconClass}`} />;
    }
  };
  
  // Find the next incomplete step
  const nextIncompleteStep = steps.find(step => !completedSteps[step]);
  
  return (
    <div className="mb-10">
      {/* Overall progress bar */}
      <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-800">Profile Completion</span>
          <span className="font-medium text-emerald-600">{Math.round(overallProgress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 flex items-center">
          {overallProgress >= 70 ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1 text-emerald-500" />
              Almost there! Complete the remaining steps to finish your profile.
            </>
          ) : (
            <>
              <span className="h-4 w-4 mr-1 rounded-full bg-blue-100 border border-blue-300" />
              {Math.round(overallProgress)}% complete. Keep going!
            </>
          )}
        </p>
      </div>
      
      {/* Steps cards */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const info = stepsInfo[step];
          const isActive = step === currentStep;
          const isCompleted = completedSteps[step];
          const progress = stepProgress[step];
          const isInProgress = progress > 0 && progress < 100;
          const isPriority = !isCompleted && step === nextIncompleteStep;
          
          return (
            <div 
              key={step}
              onClick={() => setCurrentStep(step)}
              className={cn(
                "rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow",
                isActive && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
                isCompleted && !isActive && "bg-white border-emerald-200",
                isPriority && !isActive && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
                !isActive && !isCompleted && !isPriority && "bg-white border-gray-200"
              )}
            >
              <div className="p-4 flex items-center">
                {/* Step icon */}
                <div className={cn(
                  "flex-shrink-0 mr-4 rounded-full p-2",
                  isActive && "bg-blue-50",
                  isCompleted && !isActive && "bg-emerald-50",
                  isPriority && !isActive && "bg-blue-50",
                  !isActive && !isCompleted && !isPriority && "bg-gray-50"
                )}>
                  {isCompleted ? 
                    <CheckCircle className="w-7 h-7 text-emerald-500" /> : 
                    getStepIcon(step, isCompleted)
                  }
                </div>
                
                {/* Step content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={cn(
                        "font-semibold",
                        isActive && "text-blue-700",
                        isCompleted && !isActive && "text-gray-800",
                        isPriority && !isActive && "text-blue-700",
                        !isActive && !isCompleted && !isPriority && "text-gray-800"
                      )}>
                        Step {index + 1}: {info.title}
                      </h3>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                    
                    {isPriority && !isActive && (
                      <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full font-medium">
                        Next Step
                      </span>
                    )}
                  </div>
                  
                  {/* Progress indicator for the step */}
                  {!isCompleted && (
                    <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300 ease-out",
                          isActive ? "bg-blue-500" : "bg-amber-500"
                        )}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                {/* Action button */}
                <button
                  className={cn(
                    "ml-4 flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium flex items-center",
                    isActive && "bg-blue-600 text-white hover:bg-blue-700",
                    isCompleted && !isActive && "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50",
                    isPriority && !isActive && "bg-blue-600 text-white hover:bg-blue-700",
                    !isActive && !isCompleted && !isPriority && "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentStep(step);
                  }}
                >
                  {isCompleted ? "Edit" : isActive ? "Continue" : "Complete"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {/* Completed status indicator */}
              {isCompleted && (
                <div className="px-5 py-2 bg-emerald-50 rounded-b-lg border-t border-emerald-100">
                  <p className="text-sm text-emerald-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete! You've set up your {info.title.toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileProgressIndicator;