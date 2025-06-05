import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, CheckCircle, Loader2, Info } from "lucide-react";
import { ProfileJourneyProvider, useProfileJourney } from "./ProfileJourneyContext";
import TeacherJourneySteps from "./TeacherJourneySteps";
import ProfileStepRenderer from "./ProfileStepRenderer";
import { cn } from "@/lib/utils";

interface ProfileJourneyProps {
  onComplete: () => void;
  onCancel: () => void;
}

// Inner component using context
const ProfileJourneyInner = ({ onComplete, onCancel }: ProfileJourneyProps) => {
  const { 
    currentStep, 
    stepsInfo,
    nextStep, 
    prevStep, 
    isFirstStep, 
    isLastStep,
    isLoading,
    isSubmitting,
    completeProfile
  } = useProfileJourney();
  
  // Handler for final submission
  const handleComplete = async () => {
    const success = await completeProfile();
    if (success) {
      onComplete();
    }
  };
  
  return (
    <div className="w-full fade-in">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-20 px-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-t-[#fc9323] border-r-[#5c64d4] border-b-[#fc9323] border-l-[#5c64d4] animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-2 border-t-[#fc9323] border-r-[#5c64d4] border-b-[#fc9323] border-l-[#5c64d4] animate-spin animate-ping"></div>
            </div>
            <p className="text-base font-medium text-gray-600 animate-pulse">Loading your profile...</p>
            <p className="text-sm text-gray-500">Please wait while we personalize your experience</p>
          </div>
        </div>
      ) : (
        <TeacherJourneySteps />
      )}
    </div>
  );
};

// Wrapper component providing context
const ProfileJourney = (props: ProfileJourneyProps) => {
  return (
    <ProfileJourneyProvider>
      <ProfileJourneyInner {...props} />
    </ProfileJourneyProvider>
  );
};

export default ProfileJourney;