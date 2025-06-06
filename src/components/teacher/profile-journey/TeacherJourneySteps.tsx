import React, { useState } from 'react';
import { CheckCircle, User, BookOpen, Star, Award, ChevronRight, Camera, Phone, MapPin, GraduationCap, X, LogOut } from 'lucide-react';
import { useProfileJourney } from './ProfileJourneyContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import { PersonalInformationForm } from './forms/PersonalInformationForm';
import { EducationForm } from './forms/EducationForm';
import { ExpertiseForm } from './forms/ExpertiseForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { Button } from '@/components/ui/button';

const TeacherJourneySteps = () => {
  const { 
    steps, 
    currentStep, 
    completedSteps, 
    stepProgress,
    overallProgress,
    setCurrentStep,
    nextStep
  } = useProfileJourney();
  
  const { signOut } = useAuth();
  
  // Page state
  const [showFormPage, setShowFormPage] = useState(false);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
  };
  
  // Count completed steps
  const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;

  // Visual step configurations for 4 steps
  const stepVisuals = {
    personal: {
      icon: User,
      gradient: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200", 
      emoji: "👋",
      subIcons: [Camera, Phone, MapPin],
      title: "Personal Info",
      subtitle: "Name, contact & photo"
    },
    education: {
      icon: GraduationCap,
      gradient: "from-[#5c64d4] to-[#acb4e4]", 
      bgColor: "bg-[#efebf0]",
      borderColor: "border-[#acb4e4]",
      emoji: "🎓",
      subIcons: [GraduationCap, BookOpen],
      title: "Education",
      subtitle: "Academic background"
    },
    expertise: {
      icon: BookOpen,
      gradient: "from-[#fc9323] to-[#acb4e4]", 
      bgColor: "bg-[#efebf0]",
      borderColor: "border-[#fc9323]",
      emoji: "💼",
      subIcons: [BookOpen, Star],
      title: "Experience & Expertise",
      subtitle: "Teaching & skills"
    },
    certifications: {
      icon: Award,
      gradient: "from-[#fc9323] to-[#5c64d4]",
      bgColor: "bg-[#efebf0]", 
      borderColor: "border-[#fc9323]",
      emoji: "🏆",
      subIcons: [Award, CheckCircle],
      title: "Certifications",
      subtitle: "Credentials & achievements"
    }
  };

  // Handle card click to show form page
  const handleCardClick = (step: string) => {
    setSelectedStep(step);
    setCurrentStep(step as any);
    setShowFormPage(true);
  };

  // Handle form completion and move to next
  const handleStepComplete = () => {
    setShowFormPage(false);
    // Auto-advance to next incomplete step
    const currentIndex = steps.indexOf(selectedStep! as any);
    const nextIncompleteStep = steps.find((step, index) => 
      index > currentIndex && !completedSteps[step]
    );
    
    if (nextIncompleteStep) {
      setTimeout(() => {
        setSelectedStep(nextIncompleteStep);
        setCurrentStep(nextIncompleteStep as any);
        setShowFormPage(true);
      }, 500);
    }
  };

  // Handle back to cards view
  const handleBackToCards = () => {
    setShowFormPage(false);
    setSelectedStep(null);
  };

  // Check if this is the next step the user should work on
  const isNextIncompleteStep = (step: string) => {
    const firstIncompleteStep = steps.find(s => !completedSteps[s]);
    return firstIncompleteStep === step;
  };
  
  // Simplified Top Navigation Bar Component
  const TopNavigationBar = () => (
    <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <img 
            src="/favicon.ico" 
            alt="Kidato Logo" 
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-gray-900">Kidato</h1>
        </div>

        {/* Logout Button */}
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );

  // Show form page if selected
  if (showFormPage && selectedStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Top Navigation */}
        <TopNavigationBar />
        
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToCards}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
              </button>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg",
                `bg-gradient-to-br ${stepVisuals[selectedStep as keyof typeof stepVisuals].gradient} text-white shadow-lg`
              )}>
                {steps.indexOf(selectedStep) + 1}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {stepVisuals[selectedStep as keyof typeof stepVisuals].title}
                </h1>
                <p className="text-gray-600">
                  {stepVisuals[selectedStep as keyof typeof stepVisuals].subtitle}
                </p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="text-sm text-gray-500">
              Step {steps.indexOf(selectedStep) + 1} of {steps.length}
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="max-w-4xl mx-auto p-6">
          {selectedStep === 'personal' && (
            <PersonalInformationForm onComplete={handleStepComplete} />
          )}
          {selectedStep === 'education' && (
            <EducationForm onComplete={handleStepComplete} />
          )}
          {selectedStep === 'expertise' && (
            <ExpertiseForm onComplete={handleStepComplete} />
          )}
    {selectedStep === 'certifications' && (
            <CertificationsForm onComplete={handleStepComplete} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <TopNavigationBar />
      
      <div className="flex flex-col items-center justify-center p-8 min-h-[calc(100vh-80px)]">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#5c64d4] to-[#fc9323] rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {completedStepsCount}/{steps.length}
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900">
                {completedStepsCount === steps.length ? "Welcome to Kidato! 🎉" : "Welcome to Kidato!"}
              </h1>
              <p className="text-xl text-gray-600">
                {completedStepsCount === steps.length 
                  ? "Your teaching profile is complete and ready to inspire students!" 
                  : "Let's build your amazing teaching profile together"
                }
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-[#5c64d4]">{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-[#efebf0] rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#5c64d4] to-[#fc9323] shadow-sm"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Getting Started</span>
              <span>Profile Complete</span>
            </div>
          </div>
        </div>

        {/* Centered Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {steps.map((step, index) => {
            const visual = stepVisuals[step as keyof typeof stepVisuals];
            const isCompleted = completedSteps[step];
            const isPriority = isNextIncompleteStep(step);
            const progress = stepProgress[step];
            
            return (
              <div
                key={step}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl",
                  isCompleted 
                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg"
                    : isPriority
                      ? `${visual.borderColor} ${visual.bgColor} shadow-lg ring-4 ring-blue-200`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl"
                )}
                onClick={() => handleCardClick(step)}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                  <div className={cn("w-full h-full rounded-full bg-gradient-to-br", visual.gradient)} />
                </div>
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {/* Step Number Badge */}
                      <div className={cn(
                        "w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-2xl transition-all duration-300",
                        isCompleted 
                          ? "bg-emerald-500 text-white shadow-xl"
                          : isPriority
                            ? `bg-gradient-to-br ${visual.gradient} text-white shadow-xl`
                            : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      )}>
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      
                      {/* Large Emoji */}
                      <div className="text-5xl filter drop-shadow-lg">
                        {visual.emoji}
                      </div>
                    </div>
                    
                    {/* Status Indicators */}
                    {isPriority && !isCompleted && (
                      <div className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                        Start Here
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="bg-emerald-500 text-white rounded-full p-3 shadow-xl">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  
                  {/* Title & Subtitle */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {visual.title}
                    </h3>
                    <p className="text-gray-600">
                      {visual.subtitle}
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  {!isCompleted && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-700 bg-gradient-to-r", visual.gradient)}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Sub Icons & Action */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      {visual.subIcons.slice(0, 3).map((SubIcon, idx) => (
                        <SubIcon 
                          key={idx} 
                          className={cn(
                            "w-6 h-6 transition-colors duration-300",
                            isCompleted 
                              ? "text-emerald-500"
                              : "text-gray-400"
                          )} 
                        />
                      ))}
                    </div>
                    
                    {/* Action Indicator */}
                    <div className={cn(
                      "px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2",
                      isCompleted 
                        ? "bg-emerald-100 text-emerald-700" 
                        : isPriority
                          ? `bg-gradient-to-r ${visual.gradient} text-white shadow-lg`
                          : "bg-gray-100 text-gray-600"
                    )}>
                      {isCompleted ? "Edit" : isPriority ? "Start Now" : "Begin"}
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status */}
        <div className="mt-16 text-center">
          {overallProgress === 100 ? (
            <div className="bg-emerald-100 text-emerald-800 px-8 py-4 rounded-2xl inline-flex items-center gap-3 shadow-lg">
              <CheckCircle className="w-8 h-8" />
              <span className="text-lg font-semibold">Profile Complete! Students can find you now.</span>
            </div>
          ) : (
            <div className="bg-blue-100 text-blue-800 px-8 py-4 rounded-2xl inline-flex items-center gap-3">
              <Star className="w-6 h-6" />
              <span className="font-medium">{Math.round(overallProgress)}% complete</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherJourneySteps;