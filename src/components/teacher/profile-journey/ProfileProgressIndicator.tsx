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
    const iconClass = isCompleted ? "text-kidato-purple-500" : "text-gray-500";
    
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
          <span className="font-medium text-kidato-purple-600">{Math.round(overallProgress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-kidato-orange-500 to-kidato-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 flex items-center">
          {overallProgress >= 70 ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1 text-kidato-purple-500" />
              Almost there! Complete the remaining steps to finish your profile.
            </>
          ) : (
            <>
              <span className="h-4 w-4 mr-1 rounded-full bg-kidato-orange-100 border border-kidato-orange-300" />
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
                isActive && "bg-gradient-to-r from-kidato-orange-50 to-kidato-purple-50 border-kidato-orange-200",
                isCompleted && !isActive && "bg-white border-kidato-purple-200",
                isPriority && !isActive && "bg-gradient-to-r from-kidato-orange-50 to-kidato-purple-50 border-kidato-orange-200",
                !isActive && !isCompleted && !isPriority && "bg-white border-gray-200"
              )}
            >
              <div className="p-4 flex items-center">
                {/* Step icon */}
                <div className={cn(
                  "flex-shrink-0 mr-4 rounded-full p-2",
                  isActive && "bg-kidato-purple-50",
                  isCompleted && !isActive && "bg-kidato-purple-50",
                  isPriority && !isActive && "bg-kidato-orange-50",
                  !isActive && !isCompleted && !isPriority && "bg-gray-50"
                )}>
                  {isCompleted ? 
                    <CheckCircle className="w-7 h-7 text-kidato-purple-500" /> : 
                    getStepIcon(step, isCompleted)
                  }
                </div>
                
                {/* Step content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={cn(
                        "font-semibold",
                        isActive && "text-kidato-purple-700",
                        isCompleted && !isActive && "text-gray-800",
                        isPriority && !isActive && "text-kidato-orange-700",
                        !isActive && !isCompleted && !isPriority && "text-gray-800"
                      )}>
                        Step {index + 1}: {info.title}
                      </h3>
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                    
                    {isPriority && !isActive && (
                      <span className="bg-kidato-orange-100 text-kidato-orange-800 text-xs py-1 px-2 rounded-full font-medium">
                        Next Step
                      </span>
                    )}
                  </div>
                  
                  {/* Progress indicator for the step */}
                  {!isCompleted && (
                    <>
                      <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-300 ease-out",
                            isActive ? "bg-kidato-purple-500" : "bg-kidato-orange-500"
                          )}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {step === 'personal' && (
                          <span>{progress < 100 ? 'Pending: Profile photo and info' : ''}</span>
                        )}
                        {step === 'location' && (
                          <span>{progress < 100 ? 'Pending: Location & availability details' : ''}</span>
                        )}
                        {step === 'education' && (
                          <span>{progress < 100 ? 'Pending: Add education credentials' : ''}</span>
                        )}
                        {step === 'experience' && (
                          <span>{progress < 100 ? 'Pending: Add teaching experience' : ''}</span>
                        )}
                        {step === 'expertise' && (
                          <span>{progress < 100 ? 'Pending: Add subject expertise' : ''}</span>
                        )}
                        {step === 'teaching-style' && (
                          <span>{progress < 100 ? 'Pending: Define teaching methodology' : ''}</span>
                        )}
                        {step === 'verification' && (
                          <span>{progress < 100 ? 'Pending: Upload verification documents' : ''}</span>
                        )}
                        {step === 'platform' && (
                          <span>{progress < 100 ? 'Pending: Connect teaching platform' : ''}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Action button */}
                <button
                  className={cn(
                    "ml-4 flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium flex items-center",
                    isActive && "bg-kidato-purple-600 text-white hover:bg-kidato-purple-700",
                    isCompleted && !isActive && "bg-white text-kidato-purple-700 border border-kidato-purple-200 hover:bg-kidato-purple-50",
                    isPriority && !isActive && "bg-kidato-orange-600 text-white hover:bg-kidato-orange-700",
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
              
              {/* Status indicator - either completed or pending details */}
              {isCompleted ? (
                <div className="px-5 py-2 bg-kidato-purple-50 rounded-b-lg border-t border-kidato-purple-100">
                  <p className="text-sm text-kidato-purple-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete! You've set up your {info.title.toLowerCase()}.
                  </p>
                </div>
              ) : progress > 0 && (
                <div className="px-5 py-2 bg-kidato-orange-50 rounded-b-lg border-t border-kidato-orange-100">
                  <p className="text-sm text-kidato-orange-700 flex items-start">
                    <span className="bg-kidato-orange-200 text-kidato-orange-800 rounded-full h-4 w-4 inline-flex items-center justify-center mr-2 mt-0.5 text-xs font-bold">!</span>
                    {step === 'personal' && 'Please add a profile photo and complete your personal details'}
                    {step === 'location' && 'Add your teaching location and available time slots'}
                    {step === 'education' && 'Include your degrees, certifications, and academic history'}
                    {step === 'experience' && 'Add details about your teaching background'}
                    {step === 'expertise' && 'Specify the subjects and grade levels you teach'}
                    {step === 'teaching-style' && 'Share your teaching philosophy and methodology'}
                    {step === 'verification' && 'Upload your government ID and background check'}
                    {step === 'platform' && 'Connect your Zoom account for online teaching'}
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