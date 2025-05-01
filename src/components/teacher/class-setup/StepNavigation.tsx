
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
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mx-[-24px]">
        <div>
          <Button 
            variant={currentStep === 1 ? "ghost" : "outline"} 
            onClick={currentStep === 1 ? onCancel : onBack}
            className="rounded-r-none border-r-0 pl-6 pr-4"
          >
            {currentStep === 1 ? 'Cancel' : (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            )}
          </Button>
        </div>
        <div>
          <Button 
            onClick={onNext}
            disabled={isSubmitting}
            className={`${currentStep === totalSteps ? 'bg-green-600 hover:bg-green-700' : ''} rounded-l-none border-l-0 pr-6 pl-4`}
          >
            {currentStep === totalSteps ? (
              isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                <>Complete Setup</>
              )
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
