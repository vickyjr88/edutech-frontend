
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type StepNavigationProps = {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
};

const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  isSubmitting, 
  onNext, 
  onBack, 
  onCancel 
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={currentStep === 1 ? onCancel : onBack}
      >
        {currentStep === 1 ? 'Cancel' : (
          <>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        )}
      </Button>
      <Button 
        onClick={onNext}
        disabled={isSubmitting}
      >
        {currentStep === totalSteps ? (
          isSubmitting ? 'Saving...' : 'Complete Setup'
        ) : (
          <>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default StepNavigation;
