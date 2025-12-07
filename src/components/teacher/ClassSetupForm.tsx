
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { classSettingsService } from "@/integrations/api/services/class-settings.service";
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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("zoom");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  const totalSteps = 3;
  const stepLabels = ["Platform", "Tools", "Schedule"];

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await classSettingsService.getByTeacher(user.id);
        if (!error && data) {
          setSettingsId(data._id);
          setSelectedPlatform(data.platform);
          const tools: string[] = [];
          if (data.teachingTools.interactiveWhiteboard) tools.push('whiteboard');
          if (data.teachingTools.documentSharing) tools.push('documents');
          if (data.teachingTools.classRecordings) tools.push('recordings');
          if (data.teachingTools.pollsAndQuizzes) tools.push('polls');
          setSelectedTools(tools);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user?.id]);

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

  const handleSubmit = async () => {
    if (!user?.id) return;
    
    setIsSubmitting(true);
    try {
      const teachingTools = {
        interactiveWhiteboard: selectedTools.includes('whiteboard'),
        documentSharing: selectedTools.includes('documents'),
        classRecordings: selectedTools.includes('recordings'),
        pollsAndQuizzes: selectedTools.includes('polls'),
        customTools: []
      };

      const payload = {
        teacher: user.id,
        schedule: {
          timeSlots: [],
          classDuration: 60,
          syncWithCalendar: false
        },
        platform: selectedPlatform,
        teachingTools,
        automaticPlatformIntegration: false
      };

      const { error } = settingsId 
        ? await classSettingsService.update(settingsId, payload)
        : await classSettingsService.create(payload);

      if (error) throw error;

      toast({
        title: "Class settings saved",
        description: "Your class settings have been successfully saved.",
      });
      onComplete();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save class settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

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
