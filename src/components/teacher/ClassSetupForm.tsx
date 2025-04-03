
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ProgressIndicator from "./class-setup/ProgressIndicator";
import StepNavigation from "./class-setup/StepNavigation";
import PlatformStep from "./class-setup/PlatformStep";
import ToolsStep from "./class-setup/ToolsStep";
import ScheduleStep from "./class-setup/ScheduleStep";

type ClassSetupFormProps = {
  onComplete: () => void;
  onCancel: () => void;
};

const ClassSetupForm = ({ onComplete, onCancel }: ClassSetupFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("zoom");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  
  const totalSteps = 3;
  const stepLabels = ["Platform", "Tools", "Schedule"];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // This is a mockup, so we'll just simulate a successful submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Class settings saved",
        description: "Your class settings have been successfully saved.",
      });
      onComplete();
    }, 1000);
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Choose Your Teaching Platform";
      case 2: return "Select Teaching Tools";
      case 3: return "Set Your Teaching Schedule";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Select the online platform you'll use to conduct your classes";
      case 2: return "Choose tools to enhance your virtual classroom experience";
      case 3: return "Set your availability for teaching";
      default: return "";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: 
        return <PlatformStep 
                 selectedPlatform={selectedPlatform} 
                 setSelectedPlatform={setSelectedPlatform} 
               />;
      case 2: 
        return <ToolsStep 
                 selectedTools={selectedTools} 
                 toggleTool={toggleTool} 
               />;
      case 3: 
        return <ScheduleStep />;
      default: 
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          stepLabels={stepLabels} 
        />
        <div className="space-y-4">
          {renderCurrentStep()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <StepNavigation 
          currentStep={currentStep}
          totalSteps={totalSteps}
          isSubmitting={isSubmitting}
          onNext={handleNext}
          onBack={handleBack}
          onCancel={onCancel}
        />
      </CardFooter>
    </Card>
  );
};

export default ClassSetupForm;
