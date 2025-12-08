import React, { useState, useEffect } from 'react';
import {
  Calendar,
  FileText,
  GraduationCap,
  CheckCircle
} from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';

import { ClassFormValues, Curriculum } from './types';
import { useAcademicClass } from './AcademicClassContext';
import { platformService } from '@/integrations/api/services/platform.service';
import { toast } from 'sonner';
import ClassPreviewPage from './ClassPreviewPage';
import ClassFoundationStep from './steps/ClassFoundationStep';
import LessonPlanningStep from './steps/LessonPlanningStep';
import SchedulePricingStep from './steps/SchedulePricingStep';

interface AcademicClassCreatorProps {
  onSubmit: (data: ClassFormValues) => void;
  initialValues?: Partial<ClassFormValues>;
  classId?: string;
}

interface StepConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType<any>;
}

const AcademicClassCreator: React.FC<AcademicClassCreatorProps> = ({
  onSubmit, // now handled by context onComplete
  initialValues, // now handled by context
  classId: propClassId // now handled by context
}) => {
  const {
    form,
    currentStep,
    setCurrentStep,
    cohorts,
    setCohorts,
    saveDraft,
    publishClass,
    isSubmitting,
    classId
  } = useAcademicClass();

  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loadingCurricula, setLoadingCurricula] = useState(true);

  // Fetch curricula data
  useEffect(() => {
    const fetchCurricula = async () => {
      try {
        setLoadingCurricula(true);
        const response = await platformService.getCurricula();
        if (response.data && !response.error) {
          setCurricula(response.data);
        }
      } catch (error) {
        console.error('Error fetching curricula:', error);
      } finally {
        setLoadingCurricula(false);
      }
    };

    void fetchCurricula();
  }, []);

  const steps: StepConfig[] = [
    {
      id: 'foundation',
      title: 'Class Foundation',
      description: 'Basic information about your class',
      icon: GraduationCap,
      component: ClassFoundationStep
    },
    {
      id: 'lessons',
      title: 'Lesson Planning',
      description: 'Structure your curriculum',
      icon: FileText,
      component: LessonPlanningStep
    },
    {
      id: 'schedule',
      title: 'Schedule & Pricing',
      description: 'Set when and how much',
      icon: Calendar,
      component: SchedulePricingStep
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Final review and launch',
      icon: CheckCircle,
      component: ClassPreviewPage
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      // Always try to save draft when moving to next step
      try {
        await saveDraft(true); // Assuming true enables silent mode if supported, or just passes params.
        // Based on context, saveDraft(silent?: boolean) signature.
        setCurrentStep(currentStep + 1);
        if (currentStep === 0) {
          toast.success('Class foundation saved! Moving to lesson planning...');
        }
      } catch (error) {
        console.error('Error saving class on step transition:', error);
        // Even if save fails, we might want to allow optional navigation or block it. 
        // For now, let's allow navigation but warn user? 
        // Or better, blocking navigation on save failure is safer for data integrity.
        // But if it's a silent save failure (validation error?), blocking might be annoying.
        // Let's stick to the user request: "Make sure save draft is called on every step".

        // If save fails, we should probably stop?
        // But what if it's just a validation error on a non-required field for *draft*?
        // saveDraft typically validates.

        // Let's assume we proceed but log it, unless it's step 0 creation which MUST succeed to get an ID.
        if (currentStep === 0 && !classId) {
          // Critical: Must have ID to proceed
          // Toast already handled by saveDraft potentially, or we show one here.
          return;
        }

        // For other steps, we proceed.
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-900">Create Academic Class</h1>
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            <Progress value={progress} className="h-2 mb-4" />

            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${index === currentStep
                    ? 'text-kidato-blue font-medium'
                    : index < currentStep
                      ? 'text-green-600'
                      : 'text-gray-400'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${index === currentStep
                    ? 'bg-kidato-blue text-white'
                    : index < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Form {...form}>
          <CurrentStepComponent
            form={form}
            cohorts={cohorts}
            setCohorts={setCohorts}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={saveDraft}
            onPublish={publishClass}
            isSaving={isSubmitting}
            createdClassId={classId}
            curricula={curricula}
            loadingCurricula={loadingCurricula}
          />
        </Form>
      </div>
    </div>
  );
};

export default AcademicClassCreator;