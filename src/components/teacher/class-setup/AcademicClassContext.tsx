import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassFormValues, CohortData, classSchema } from "./types";
import { classService } from "@/integrations/api/services/class.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { getApiRepeatPatternValue } from "./utils/repeatPatternUtils";

interface AcademicClassContextType {
  // Form management
  form: UseFormReturn<ClassFormValues>;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;

  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  canProceedToStep: (stepIndex: number) => boolean;

  // Cohorts management
  cohorts: CohortData[];
  setCohorts: React.Dispatch<React.SetStateAction<CohortData[]>>;
  addCohort: () => void;
  removeCohort: (id: string) => void;
  updateCohort: (id: string, field: keyof CohortData, value: any) => void;

  // Lesson plans management
  addLessonPlan: () => void;
  removeLessonPlan: (id: string) => void;
  updateLessonPlan: (id: string, field: string, value: string) => void;

  // Class management
  classId: string | null;
  setClassId: React.Dispatch<React.SetStateAction<string | null>>;

  // Auto-save functionality
  lastSaved: number;
  hasUnsavedChanges: boolean;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  clearStorage: () => void;

  // Completion tracking
  getStepCompletion: (stepIndex: number) => boolean;
  getOverallProgress: () => number;

  // Submit handlers
  saveDraft: (silent?: boolean) => Promise<void>;
  publishClass: () => Promise<void>;

  // Validation
  validateStep: (stepIndex: number) => boolean;
  getStepErrors: (stepIndex: number) => string[];
}

export const AcademicClassContext = createContext<AcademicClassContextType | undefined>(undefined);

export const useAcademicClass = () => {
  const context = useContext(AcademicClassContext);
  if (!context) {
    throw new Error("useAcademicClass must be used within an AcademicClassProvider");
  }
  return context;
};

interface AcademicClassProviderProps {
  children: ReactNode;
  onComplete?: (classData: ClassFormValues, classId: string) => void;
  initialValues?: Partial<ClassFormValues>;
  initialCohorts?: CohortData[];
  classId?: string;
}

// Step validation schemas
const stepValidation = {
  0: { // Foundation step
    required: ['title', 'subject', 'gradeLevel', 'description'],
    optional: ['objectives']
  },
  1: { // Lesson plans step
    required: [],
    custom: (form: UseFormReturn<ClassFormValues>) => {
      const lessonPlans = form.getValues('lessonPlans') || [];
      const validLessons = lessonPlans.filter(lesson => lesson.title && lesson.description);
      return validLessons.length >= 1;
    }
  },
  2: { // Schedule & Pricing step
    required: [],
    custom: (form: UseFormReturn<ClassFormValues>, cohorts: CohortData[]) => {
      return cohorts.length >= 1 && cohorts.every(cohort =>
        cohort.name && cohort.price && cohort.numberOfLessons > 0
      );
    }
  },
  3: { // Review step
    required: [],
    custom: () => true // Review step is always valid if we reach it
  }
};

export const AcademicClassProvider = ({
  children,
  onComplete,
  initialValues,
  initialCohorts = [],
  classId: initialClassId
}: AcademicClassProviderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Core state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cohorts, setCohorts] = useState<CohortData[]>(initialCohorts);
  const [classId, setClassId] = useState<string | null>(initialClassId || null);

  // Auto-save state
  const [lastSaved, setLastSaved] = useState<number>(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form setup
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      type: 'academic',
      title: '',
      subject: '',
      gradeLevel: '',
      description: '',
      objectives: '',
      numberOfLessons: 8,
      isPublic: true,
      isPublished: false,
      status: 'draft',
      hasCohorts: false,
      hasTeamTeaching: false,
      lessonPlans: [],
      ...initialValues
    },
    mode: 'onChange'
  });

  // Storage keys
  const STORAGE_KEY = `academic-class-${user?.teacherId || 'anonymous'}`;
  const METADATA_KEY = `${STORAGE_KEY}-metadata`;

  // Auto-save functionality
  const saveToStorage = () => {
    if (typeof window === 'undefined') return;

    const formData = {
      formValues: form.getValues(),
      cohorts,
      currentStep,
      classId,
      lastSaved: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(METADATA_KEY, JSON.stringify({
      lastSaved: formData.lastSaved,
      classId,
      hasData: true
    }));

    setLastSaved(formData.lastSaved);
    setHasUnsavedChanges(false);
  };

  const loadFromStorage = () => {
    if (typeof window === 'undefined') return false;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;

      const data = JSON.parse(saved);

      form.reset(data.formValues);
      setCohorts(data.cohorts || []);
      setCurrentStep(data.currentStep || 0);
      setClassId(data.classId || null);
      setLastSaved(data.lastSaved || 0);

      return true;
    } catch (error) {
      console.error('Error loading from storage:', error);
      return false;
    }
  };

  const clearStorage = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(METADATA_KEY);
    setLastSaved(0);
    setHasUnsavedChanges(false);
  };

  // Step navigation
  const goToNextStep = async () => {
    if (currentStep < 3 && canProceedToStep(currentStep + 1)) {
      // Attempt to save draft silently when moving between steps (except first step if empty)
      const isFirstStep = currentStep === 0;
      const hasTitle = form.getValues('title');

      // Only save if we have at least a title, to avoid creating junk drafts
      if (!isFirstStep || hasTitle) {
        await saveDraft(true);
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep = (stepIndex: number) => {
    // Can always go to previous steps
    if (stepIndex <= currentStep) return true;

    // Must complete current step to proceed
    return validateStep(currentStep);
  };

  // Validation
  const validateStep = (stepIndex: number) => {
    const validation = stepValidation[stepIndex as keyof typeof stepValidation];
    if (!validation) return true;

    // Check required fields
    if (validation.required) {
      const values = form.getValues();
      const missingFields = validation.required.filter(field => {
        const value = values[field as keyof ClassFormValues];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) return false;
    }

    // Check custom validation
    if (validation.custom) {
      return validation.custom(form, cohorts);
    }

    return true;
  };

  const getStepErrors = (stepIndex: number) => {
    const errors: string[] = [];
    const validation = stepValidation[stepIndex as keyof typeof stepValidation];

    if (!validation) return errors;

    if (validation.required) {
      const values = form.getValues();
      validation.required.forEach(field => {
        const value = values[field as keyof ClassFormValues];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(`${field} is required`);
        }
      });
    }

    if (validation.custom && !validation.custom(form, cohorts)) {
      switch (stepIndex) {
        case 1:
          errors.push('At least 1 lesson plan is required');
          break;
        case 2:
          errors.push('At least 1 schedule with pricing is required');
          break;
      }
    }

    return errors;
  };

  // Progress tracking
  const getStepCompletion = (stepIndex: number) => {
    return validateStep(stepIndex);
  };

  const getOverallProgress = () => {
    let completedSteps = 0;
    for (let i = 0; i <= currentStep; i++) {
      if (validateStep(i)) completedSteps++;
    }
    return (completedSteps / 4) * 100;
  };

  // Cohort management
  const addCohort = () => {
    const newCohort: CohortData = {
      id: Date.now().toString(),
      name: `Schedule ${cohorts.length + 1}`,
      startDate: null,
      endDate: null,
      startTime: '',
      endTime: '',
      numberOfLessons: form.getValues('numberOfLessons') || 8,
      price: '',
      discount: '0',
      isActive: true,
      lessonSchedules: [],
      hasFlexibleSchedule: false,
      repeatSchedule: {
        pattern: 'weekly',
        daysOfWeek: ['monday'],
        repeatEvery: 1
      },
      minStudents: 1,
      maxStudents: 20,
      enrollmentDeadline: null
    };

    setCohorts([...cohorts, newCohort]);
    setHasUnsavedChanges(true);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id && cohort._id !== id));
    setHasUnsavedChanges(true);
  };

  const updateCohort = (id: string, field: keyof CohortData, value: any) => {
    setCohorts(cohorts.map(cohort => {
      const matches = cohort.id === id || cohort._id === id;
      return matches ? { ...cohort, [field]: value } : cohort;
    }));
    setHasUnsavedChanges(true);
  };

  // Lesson plan management
  const addLessonPlan = () => {
    const currentPlans = form.getValues('lessonPlans') || [];
    const newPlan = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: '60'
    };

    form.setValue('lessonPlans', [...currentPlans, newPlan]);
    setHasUnsavedChanges(true);
  };

  const removeLessonPlan = (id: string) => {
    const currentPlans = form.getValues('lessonPlans') || [];
    form.setValue('lessonPlans', currentPlans.filter(plan => plan.id !== id));
    setHasUnsavedChanges(true);
  };

  const updateLessonPlan = (id: string, field: string, value: string) => {
    const currentPlans = form.getValues('lessonPlans') || [];
    const updatedPlans = currentPlans.map(plan =>
      plan.id === id ? { ...plan, [field]: value } : plan
    );
    form.setValue('lessonPlans', updatedPlans);
    setHasUnsavedChanges(true);
  };

  // Submit handlers
  const saveDraft = async (silent: boolean = false) => {
    // Only show loading state if not silent
    if (!silent) setIsSubmitting(true);

    try {
      const {
        status,
        hasCohorts,
        hasTeamTeaching,
        objectives,
        technicalRequirements,
        materialsRequired,
        assessmentMethods,
        methodology,
        strategy,
        resourceLinks,
        commitmentRequired,
        courseOutlineFile,
        schemeOfWorkFile,
        syllabusFile,
        introVideoUrl,
        thumbnailUrl,
        ...validFormData
      } = form.getValues();

      // Helper to format objectives
      const formattedObjectives = objectives && typeof objectives === 'string'
        ? objectives.split('\n').filter(o => o.trim()).map(o => ({
          text: o.trim(),
          category: 'knowledge' as const
        }))
        : [];

      // Helper to format technical requirements
      const formattedTechReqs = technicalRequirements && typeof technicalRequirements === 'string'
        ? technicalRequirements.split('\n').filter(r => r.trim()).map(r => ({
          requirement: r.trim()
        }))
        : [];

      // Helper to format lesson plans
      const formattedLessonPlans = (validFormData.lessonPlans || []).map((plan: any, index: number) => ({
        ...plan,
        duration: Number(plan.duration) || 60,
        lessonNumber: index + 1
      }));

      // Helper to format materials (extract only name as per DTO)
      const formattedMaterials = (validFormData.materials || []).map((m: any) => ({
        name: m.name
      }));

      const formData = {
        ...validFormData,
        commitment: commitmentRequired,
        objectives: formattedObjectives,
        technicalRequirements: formattedTechReqs,
        lessonPlans: formattedLessonPlans,
        materials: formattedMaterials,
        // Map file URLs
        courseOutlineUrl: courseOutlineFile,
        schemeOfWorkUrl: schemeOfWorkFile,
        syllabusUrl: syllabusFile,

        // Map media
        media: {
          introVideoUrl: introVideoUrl,
          thumbnailUrl: thumbnailUrl
        },

        type: 'academic' as const,
        isPublished: false,
      };

      const payload = {
        ...formData,
        teacher: user?.teacherId,
        enableMultipleCohorts: cohorts.length > 1,
        enableTeamTeaching: false,
        cohorts: cohorts.map(cohort => {
          const daysOfWeek = (cohort.repeatSchedule?.daysOfWeek || []).map(day => day.toLowerCase());

          return {
            // Explicit whitelist of allowed fields
            ...((cohort._id && cohort._id.length === 24) ? { _id: cohort._id } : {}),
            name: cohort.name,
            isActive: cohort.isActive ?? true,
            startDate: cohort.startDate ? new Date(cohort.startDate) : undefined,
            endDate: cohort.endDate ? new Date(cohort.endDate) : undefined,
            startTime: cohort.startTime || "09:00",
            endTime: cohort.endTime || "10:00",
            repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule?.pattern || "weekly"),
            daysOfWeek,
            customLessonTimes: !!cohort.hasFlexibleSchedule,
            minimumStudents: Number(cohort.minStudents) || 1,
            maximumStudents: Number(cohort.maxStudents) || 20,
            price: Number(cohort.price) || 0,
            discount: Number(cohort.discount) || 0,
            enrollmentDeadline: cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline) : null,
            createdBy: user?.teacherId,
            weeklySchedule: daysOfWeek.map(day => ({
              dayOfWeek: day,
              startTime: cohort.startTime || "09:00",
              endTime: cohort.endTime || "10:00"
            }))
          };
        })
      };

      let response;
      if (classId) {
        // Exclude lessonPlans from update payload
        const { lessonPlans, ...updatePayload } = payload;
        response = await classService.update(classId, updatePayload as any);

        // Optionally save lesson plans here too if needed, but for draft saving 
        // we might skip it to avoid excessive API calls or duplicates until publish? 
        // Or better: try to save them if we can.
        if (!response.error && formattedLessonPlans.length > 0) {
          try {
            // Only attempt bulk add if not silent or maybe just do it? 
            // Sending bulk add on every auto-save is risky (duplicates).
            // For now, we omit lesson saving in auto-save update to prevent the crash.
            // They will be saved on Publish.
          } catch (e) { console.error(e); }
        }
      } else {
        response = await classService.create(payload as any);
      }

      if (response.error) {
        // If silent save fails, strict error might be annoying, just log it
        if (silent) {
          console.warn('Silent save failed:', response.error);
          return;
        }
        throw new Error(response.error.message || 'Failed to save class');
      }

      if (response.data && !classId) {
        const newClassId = response.data._id || response.data.id;
        setClassId(newClassId);
      }

      if (!silent) toast.success('Class saved as draft');
      // Update local storage metadata even if we don't clear it (keep it for offline redundancy)
      saveToStorage();

    } catch (error) {
      console.error('Error saving draft:', error);
      if (!silent) toast.error('Failed to save class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const publishClass = async () => {
    setIsSubmitting(true);

    try {
      const {
        status,
        hasCohorts,
        hasTeamTeaching,
        objectives,
        technicalRequirements,
        materialsRequired,
        assessmentMethods,
        methodology,
        strategy,
        resourceLinks,
        commitmentRequired,
        courseOutlineFile,
        schemeOfWorkFile,
        syllabusFile,
        introVideoUrl,
        thumbnailUrl,
        ...validFormData
      } = form.getValues();

      // Helper to format objectives
      const formattedObjectives = objectives && typeof objectives === 'string'
        ? objectives.split('\n').filter(o => o.trim()).map(o => ({
          text: o.trim(),
          category: 'knowledge' as const
        }))
        : [];

      // Helper to format technical requirements
      const formattedTechReqs = technicalRequirements && typeof technicalRequirements === 'string'
        ? technicalRequirements.split('\n').filter(r => r.trim()).map(r => ({
          requirement: r.trim()
        }))
        : [];

      // Helper to format lesson plans
      const formattedLessonPlans = (validFormData.lessonPlans || []).map((plan: any, index: number) => ({
        ...plan,
        duration: Number(plan.duration) || 60,
        lessonNumber: index + 1
      }));

      // Helper to format materials (extract only name as per DTO)
      const formattedMaterials = (validFormData.materials || []).map((m: any) => ({
        name: m.name
      }));

      const formData = {
        ...validFormData,
        commitment: commitmentRequired,
        objectives: formattedObjectives,
        technicalRequirements: formattedTechReqs,
        lessonPlans: formattedLessonPlans,
        materials: formattedMaterials,
        // Map file URLs
        courseOutlineUrl: courseOutlineFile,
        schemeOfWorkUrl: schemeOfWorkFile,
        syllabusUrl: syllabusFile,

        // Map media
        media: {
          introVideoUrl: introVideoUrl,
          thumbnailUrl: thumbnailUrl
        },

        type: 'academic' as const,
        isPublished: true,
        status: 'published',
      };

      const payload = {
        ...formData,
        teacher: user?.teacherId,
        enableMultipleCohorts: cohorts.length > 1,
        enableTeamTeaching: false,
        cohorts: cohorts.map(cohort => {
          const daysOfWeek = (cohort.repeatSchedule?.daysOfWeek || []).map(day => day.toLowerCase());

          return {
            // Explicit whitelist of allowed fields
            ...((cohort._id && cohort._id.length === 24) ? { _id: cohort._id } : {}),
            name: cohort.name,
            isActive: cohort.isActive ?? true,
            startDate: cohort.startDate ? new Date(cohort.startDate) : undefined,
            endDate: cohort.endDate ? new Date(cohort.endDate) : undefined,
            startTime: cohort.startTime || "09:00",
            endTime: cohort.endTime || "10:00",
            repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule?.pattern || "weekly"),
            daysOfWeek,
            customLessonTimes: !!cohort.hasFlexibleSchedule,
            minimumStudents: Number(cohort.minStudents) || 1,
            maximumStudents: Number(cohort.maxStudents) || 20,
            price: Number(cohort.price) || 0,
            discount: Number(cohort.discount) || 0,
            enrollmentDeadline: cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline) : null,
            createdBy: user?.teacherId,
            enrollment: {
              minimumStudents: Number(cohort.minStudents) || 1,
              maximumStudents: Number(cohort.maxStudents) || 20,
              enrollmentDeadline: cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline) : null,
              allowWaitlist: true,
              autoCloseEnrollment: false,
              currentStudents: 0
            },
            pricing: {
              pricePerLesson: 0, // Assuming single price for now, or calculate if needed
              totalLessons: Number(form.getValues().numberOfLessons) || 1,
              discount: Number(cohort.discount) || 0
            },
            weeklySchedule: daysOfWeek.map(day => ({
              dayOfWeek: day,
              startTime: cohort.startTime || "09:00",
              endTime: cohort.endTime || "10:00"
            }))
          };
        })
      };

      let response;
      let finalClassId = classId;

      if (classId) {
        // For updates, we must manage lesson plans separately because the update DTO 
        // likely expects IDs only, or doesn't support embedded creation/update of lesson plans.
        // We remove them from the main payload to avoid validation errors.
        const { lessonPlans, ...updatePayload } = payload;

        // 1. Update the class (without lesson plans)
        response = await classService.update(classId, updatePayload as any);

        if (!response.error) {
          // 2. Sync lesson plans if provided
          // Note: Ideally we'd use a sync endpoint. Here we'll rely on bulkAdd 
          // or individual updates if we had IDs. For now, bulk adding new ones is a start.
          // However, to avoid duplicates on every save, we might want to check invalid/new ones.
          // Since we can't easily diff, we will check if we have any formattedLessonPlans to save.
          if (formattedLessonPlans.length > 0) {
            // We use a try/catch here so lesson plan failure doesn't block the main publish
            try {
              // If the API supports replacing lesson plans, this would be best.
              // Otherwise, this might append.
              // Given the constraints, we attempt to save them.
              await classService.bulkAddLessonPlan(classId, formattedLessonPlans as any);
            } catch (lpError) {
              console.error("Failed to save lesson plans:", lpError);
              // We don't throw here to ensure class remains published/updated
            }
          }
        }
      } else {
        // For Valid Create (POST), usually embedded documents are allowed.
        response = await classService.create(payload as any);
        if (response.data) {
          finalClassId = response.data._id || response.data.id;
          setClassId(finalClassId);
        }
      }

      if (response.error) {
        throw new Error(response.error.message || 'Failed to publish class');
      }

      // Publish the class
      if (finalClassId) {
        const publishResponse = await classService.publish(finalClassId);
        if (publishResponse.error) {
          throw new Error(publishResponse.error.message || 'Failed to publish class');
        }
      }

      toast.success('Class published successfully!');
      clearStorage(); // Clear auto-save data after successful publish

      if (onComplete && finalClassId) {
        onComplete(formData, finalClassId);
      }

    } catch (error) {
      console.error('Error publishing class:', error);
      toast.error('Failed to publish class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-save timer
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        saveToStorage();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [hasUnsavedChanges, form.formState.isDirty, cohorts]);

  // Load from storage on mount
  useEffect(() => {
    if (!initialValues && !initialClassId) {
      loadFromStorage();
    }
  }, []);

  const contextValue: AcademicClassContextType = {
    // Form management
    form,
    isSubmitting,
    setIsSubmitting,

    // Step management
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPrevStep,
    canProceedToStep,

    // Cohorts management
    cohorts,
    setCohorts,
    addCohort,
    removeCohort,
    updateCohort,

    // Lesson plans management
    addLessonPlan,
    removeLessonPlan,
    updateLessonPlan,

    // Class management
    classId,
    setClassId,

    // Auto-save functionality
    lastSaved,
    hasUnsavedChanges,
    saveToStorage,
    loadFromStorage,
    clearStorage,

    // Completion tracking
    getStepCompletion,
    getOverallProgress,

    // Submit handlers
    saveDraft,
    publishClass,

    // Validation
    validateStep,
    getStepErrors
  };

  return (
    <AcademicClassContext.Provider value={contextValue}>
      {children}
    </AcademicClassContext.Provider>
  );
};