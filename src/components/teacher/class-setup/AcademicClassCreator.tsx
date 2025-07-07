import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Calendar, 
  FileText, 
  GraduationCap,
  CheckCircle} from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';

import { ClassFormValues, CohortData, classSchema, Curriculum } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { platformService } from '@/integrations/api/services/platform.service';
import { toast } from 'sonner';
import ClassPreviewPage from './ClassPreviewPage';
import ClassFoundationStep from './steps/ClassFoundationStep';
import LessonPlanningStep from './steps/LessonPlaningStep';
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
  onSubmit,
  initialValues,
  classId
}) => {
  const { } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [createdClassId, setCreatedClassId] = useState<string | null>(classId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loadingCurricula, setLoadingCurricula] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      type: 'academic',
      title: '',
      curriculum: '',
      curriculumLevel: '',
      subject: '',
      description: '',
      objectives: '',
      numberOfLessons: 8,
      isPublic: true,
      isPublished: false,
      status: 'draft',
      hasCohorts: false,
      hasTeamTeaching: false,
      lessonPlans: [],
      // New media fields
      introVideoUrl: '',
      thumbnailUrl: '',
      // Course documents
      courseOutlineFile: '',
      syllabusFile: '',
      schemeOfWorkFile: '',
      // Materials and resources
      materials: [],
      resourceLinks: [],
      ...initialValues
    }
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    const formData = {
      ...form.getValues(),
      type: 'academic' as const,
      isPublished: true,
      status: 'published'
    };
    
    try {
      await onSubmit(formData);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const formData = {
      ...form.getValues(),
      type: 'academic' as const,
      isPublished: false,
      status: 'draft'
    };
    
    await onSubmit(formData);
  };

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
      // Save class to API after foundation step (step 0) before moving to lesson planning
      if (currentStep === 0 && !createdClassId) {
        setIsSaving(true);
        try {
          const formData = {
            ...form.getValues(),
            type: 'academic' as const,
            isPublished: false,
            status: 'draft'
          };
          
          // Call the onSubmit function to create the class
          try {
            onSubmit(formData);
            // Note: onSubmit returns void, so we can't get the class ID from it
            // The classId would need to be passed as a prop or via a different mechanism
          } catch (submitError) {
            console.error('Submit error:', submitError);
          }
          
          setCurrentStep(currentStep + 1);
          toast.success('Class foundation saved! Moving to lesson planning...');
        } catch (error) {
          console.error('Error saving class:', error);
          toast.error('Failed to save class. Please try again.');
        } finally {
          setIsSaving(false);
        }
      } else {
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
                  className={`flex items-center gap-2 ${
                    index === currentStep 
                      ? 'text-kidato-blue font-medium' 
                      : index < currentStep 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index === currentStep 
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
            onSubmit={onSubmit}
            onPublish={() => {
              console.log('Publishing class...', form.getValues());
            }}
            isSaving={isSaving}
            createdClassId={createdClassId}
            curricula={curricula}
            loadingCurricula={loadingCurricula}
          />
        </Form>
      </div>
    </div>
  );
};

export default AcademicClassCreator;