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
    <div className="w-full max-w-5xl mx-auto fade-in">
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-20 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-kidato-orange-500 border-r-kidato-purple-500 border-b-kidato-orange-400 border-l-kidato-purple-400 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-t-kidato-orange-400 border-r-kidato-purple-400 border-b-kidato-orange-300 border-l-kidato-purple-300 animate-spin animate-ping"></div>
          </div>
          <p className="text-base font-medium text-gray-600 animate-pulse">Loading your profile...</p>
          <p className="text-sm text-gray-500">Please wait while we personalize your experience</p>
        </div>
      ) : (
        <>
          <Card className="shadow-sm mb-6 bg-gradient-to-r from-kidato-orange-50 to-kidato-purple-50 border-kidato-orange-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-kidato-purple-800 flex items-center">
                {stepsInfo[currentStep].title}
              </CardTitle>
              <CardDescription className="text-kidato-orange-600 text-base">
                {stepsInfo[currentStep].description}
              </CardDescription>
            </CardHeader>
          
            <CardFooter className="pt-0 pb-4 border-t-0">
              <div className="text-sm bg-kidato-purple-100 rounded-lg p-3 text-kidato-purple-700 flex items-start w-full">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  {isFirstStep 
                    ? "Welcome to your teacher profile setup! Complete these steps to create a professional profile that attracts students."
                    : isLastStep 
                    ? "You're at the final step! Once complete, your profile will be visible to students searching for teachers."
                    : "Fill in each section with care. A well-crafted profile significantly increases your chances of connecting with students."}
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Teacher Journey Steps */}
            <div className="lg:col-span-5">
              <TeacherJourneySteps />
            </div>
            
            {/* Right side: Step Content */}
            <div className="lg:col-span-7">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-2 bg-gray-50 border-b">
                  <CardTitle className="text-lg">
                    {stepsInfo[currentStep].title}
                  </CardTitle>
                  <CardDescription>
                    {stepsInfo[currentStep].description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6 pb-6">
                  <ProfileStepRenderer />
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4 border-t bg-gray-50">
                  <Button 
                    variant="outline" 
                    onClick={isFirstStep ? onCancel : prevStep}
                    disabled={isSubmitting}
                    className="border-gray-300"
                  >
                    {isFirstStep ? 'Cancel' : (
                      <>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={isLastStep ? handleComplete : nextStep}
                    disabled={isSubmitting}
                    className={cn(
                      "px-5",
                      isLastStep ? "bg-emerald-600 hover:bg-emerald-700" : "bg-kidato-purple-600 hover:bg-kidato-purple-700"
                    )}
                  >
                    {isLastStep ? (
                      isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing Profile...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Complete Profile
                        </>
                      )
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              {/* Quick Help */}
              <Card className="mt-6 bg-kidato-orange-50 border-kidato-orange-100 shadow-sm">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-kidato-orange-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    Need help with your profile?
                  </h3>
                  <p className="text-sm text-kidato-orange-600 mt-1">
                    Watch our quick tutorial videos or contact our support team for personalized assistance.
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <Button 
                      className="text-sm bg-white text-kidato-orange-700 py-2 px-4 rounded border border-kidato-orange-200 hover:bg-kidato-orange-50">
                      Watch Tutorials
                    </Button>
                    <Button 
                      className="text-sm bg-white text-kidato-orange-700 py-2 px-4 rounded border border-kidato-orange-200 hover:bg-kidato-orange-50">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
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