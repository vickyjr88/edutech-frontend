import React from 'react';
import { CheckCircle, Circle, BookOpen, UserPlus, Star, Award, ChevronRight, User, MapPin, GraduationCap, Briefcase, Video, PaintBucket, CheckSquare } from 'lucide-react';
import { useProfileJourney } from './ProfileJourneyContext';
import { cn } from "@/lib/utils";

const TeacherJourneySteps = () => {
  const { 
    steps, 
    stepsInfo, 
    currentStep, 
    completedSteps, 
    stepProgress,
    overallProgress,
    setCurrentStep 
  } = useProfileJourney();
  
  // Count completed steps
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;
  
  // Get the right icon for each step
  const getStepIcon = (step: string, isCompleted: boolean) => {
    const iconType = mapStepToIconType(step);
    const colorClass = isCompleted ? "text-emerald-500" : "text-gray-400";
    const fillClass = isCompleted ? "fill-emerald-100" : "fill-none";
    
    switch(iconType) {
      case 'profile':
        return <User className={`w-6 h-6 ${colorClass}`} />;
      case 'location':
        return <MapPin className={`w-6 h-6 ${colorClass}`} />;
      case 'education':
        return <GraduationCap className={`w-6 h-6 ${colorClass}`} />;
      case 'experience':
        return <Briefcase className={`w-6 h-6 ${colorClass}`} />;
      case 'classroom':
        return <BookOpen className={`w-6 h-6 ${colorClass}`} />;
      case 'expertise':
        return <svg className={`w-6 h-6 ${colorClass}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill={fillClass}>
          <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>;
      case 'teaching-style':
        return <PaintBucket className={`w-6 h-6 ${colorClass}`} />;
      case 'verification':
        return <CheckSquare className={`w-6 h-6 ${colorClass}`} />;
      case 'platform':
        return <Video className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <Circle className={`w-6 h-6 ${colorClass}`} />;
    }
  };
  
  // Map step to icon type
  const mapStepToIconType = (step: string): string => {
    const iconMapping: Record<string, string> = {
      'personal': 'profile',
      'location': 'location',
      'education': 'education',
      'experience': 'experience',
      'expertise': 'expertise',
      'teaching-style': 'teaching-style',
      'verification': 'verification',
      'platform': 'platform'
    };
    
    return iconMapping[step] || step;
  };
  
  // Check if this is the next step the user should work on
  const isNextIncompleteStep = (step: string) => {
    const currentIndex = steps.indexOf(currentStep);
    
    // Get the first incomplete step after the current one
    for (let i = currentIndex; i < steps.length; i++) {
      if (!completedSteps[steps[i]]) {
        return steps[i] === step;
      }
    }
    
    // If we're at the last step or all steps after current are complete,
    // find the first incomplete step from the beginning
    if (currentIndex !== 0) {
      for (let i = 0; i < currentIndex; i++) {
        if (!completedSteps[steps[i]]) {
          return steps[i] === step;
        }
      }
    }
    
    return false;
  };
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Teaching Journey</h2>
        <p className="text-gray-600">Complete these steps to create your profile and start connecting with students.</p>
        
        {/* Progress indicator */}
        <div className="mt-5 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedStepsCount / steps.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {completedStepsCount} of {steps.length} steps completed
        </p>
      </div>
      
      {/* Steps Cards */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const info = stepsInfo[step];
          const isActive = step === currentStep;
          const isCompleted = completedSteps[step];
          const isPriority = !isCompleted && isNextIncompleteStep(step);
          const progress = stepProgress[step];
          
          return (
            <div
              key={step}
              className={cn(
                "rounded-lg border transition-all shadow-sm hover:shadow cursor-pointer",
                isActive ? 'bg-white border-blue-200' :
                  isCompleted ? 'bg-white border-emerald-200' :
                    isPriority ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
                      'bg-white border-gray-200'
              )}
              onClick={() => setCurrentStep(step)}
            >
              <div className="p-5 flex items-center">
                <div className={cn(
                  "flex-shrink-0 mr-4 rounded-full p-2",
                  isActive ? 'bg-blue-50' :
                    isCompleted ? 'bg-emerald-50' :
                      isPriority ? 'bg-blue-50' :
                        'bg-gray-50'
                )}>
                  {isCompleted ?
                    <CheckCircle className="w-8 h-8 text-emerald-500" /> :
                    getStepIcon(step, isCompleted)
                  }
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={cn(
                        "font-semibold",
                        isActive ? 'text-blue-700' :
                          isPriority ? 'text-blue-700' :
                            'text-gray-800'
                      )}>
                        Step {index + 1}: {info.title}
                      </h3>
                      <p className="text-sm text-gray-600">{info.description}</p>
                      
                      {/* Progress bar for incomplete steps */}
                      {!isCompleted && progress > 0 && (
                        <div className="mt-2 w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              isActive ? "bg-blue-500" : "bg-amber-500"
                            )}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    {isPriority && !isActive && (
                      <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full font-medium">
                        Next Step
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  className={cn(
                    "ml-4 flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium flex items-center",
                    isCompleted ?
                      'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50' :
                      isActive || isPriority ?
                        'bg-blue-600 text-white hover:bg-blue-700' :
                        'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentStep(step);
                  }}
                >
                  {isCompleted ? 'Edit' : isPriority ? 'Complete Now' : isActive ? 'Continue' : 'Start'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {isCompleted && (
                <div className="px-5 py-2 bg-emerald-50 rounded-b-lg border-t border-emerald-100">
                  <p className="text-sm text-emerald-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete! You've set up {info.title.toLowerCase()}.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Completion Progress Card */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-blue-700 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Profile Completion Status
          </h3>
          <span className="text-blue-700 font-medium">{Math.round(overallProgress)}%</span>
        </div>
        
        <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        
        {overallProgress < 100 ? (
          <div>
            <p className="text-sm text-blue-700 mt-2 flex items-center">
              <Star className="w-4 h-4 mr-2 flex-shrink-0" />
              Complete all steps to maximize your visibility to students.
            </p>
            
            {/* Show which steps are pending */}
            <div className="mt-3 flex flex-wrap gap-2">
              {steps.map((step) => !completedSteps[step] && (
                <span 
                  key={step} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentStep(step);
                  }}
                >
                  {mapStepToIconType(step) === 'profile' && <User className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'location' && <MapPin className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'education' && <GraduationCap className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'experience' && <Briefcase className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'expertise' && <BookOpen className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'teaching-style' && <PaintBucket className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'verification' && <CheckSquare className="h-3 w-3 mr-1" />}
                  {mapStepToIconType(step) === 'platform' && <Video className="h-3 w-3 mr-1" />}
                  {stepsInfo[step].title}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-blue-700 mt-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Excellent! Your profile is complete and ready for students to discover.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeacherJourneySteps;