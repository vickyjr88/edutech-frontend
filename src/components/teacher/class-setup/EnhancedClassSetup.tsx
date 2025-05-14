import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ClassFormProvider, useClassForm } from "./ClassFormContext";
import { ClassFormValues, classSchema } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  Users,
  ScrollText,
  Eye,
  Sparkles,
  Check,
  ArrowRight,
  ChevronLeft,
  Clock,
  Calendar,
  BookCopy,
  LucideIcon
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import AIClassHelper from "./AIClassHelper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormErrorNotification from "./FormErrorNotification";
import useFormErrors from "./hooks/useFormErrors";

// Import tab components
import BasicInformationTab from "./BasicInformationTab";
import LessonPlansTab from "./LessonPlansTab";
import CohortsTab from "./CohortsTab";
import TeachingTeamTab from "./TeachingTeamTab";
import PreviewTab from "./PreviewTab";

// Improved types for our steps
interface Step {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  component: React.ReactNode;
  isRequired: boolean;
}

interface EnhancedClassSetupProps {
  onSubmit: (values: ClassFormValues) => void;
  initialValues?: Partial<ClassFormValues>;
  initialCohorts?: any[];
  initialTeamMembers?: any[];
  classId?: string;
  loadFromStorage?: boolean;
  onFormStateUpdate?: (state: {
    lastSaved: number;
    hasUnsavedChanges: boolean;
    draftExists: boolean;
  }) => void;
}

// Helper to calculate completion percentage
const calculateStepCompletion = (form: any, stepId: string, checkClassCompleteness?: any): number => {
  const values = form.getValues();
  
  switch (stepId) {
    case "basic":
      const requiredBasicFields = ['title', 'subject', 'description'];
      const optionalBasicFields = ['curriculum', 'objectives', 'assessmentMethods', 'technicalRequirements', 'materialsRequired'];
      
      let completedRequired = requiredBasicFields.filter(field => 
        values[field as keyof ClassFormValues] && String(values[field as keyof ClassFormValues]).trim() !== ""
      ).length;
      
      let completedOptional = optionalBasicFields.filter(field => 
        values[field as keyof ClassFormValues] && String(values[field as keyof ClassFormValues]).trim() !== ""
      ).length;
      
      // Required fields count 80%, optional fields count 20%
      return Math.min(100, (completedRequired / requiredBasicFields.length) * 80 + 
        (completedOptional / optionalBasicFields.length) * 20);
      
    case "lessons":
      const lessonPlans = values.lessonPlans || [];
      const completeLessons = lessonPlans.filter((lesson: any) => 
        lesson.title && lesson.description
      ).length;
      
      return Math.min(100, completeLessons >= 3 ? 100 : (completeLessons / 3) * 100);
      
    case "cohorts":
      if (checkClassCompleteness) {
        const { hasMinCohorts } = checkClassCompleteness();
        return hasMinCohorts ? 100 : 0;
      }
      return 0;
      
    case "teaching":
      // Teaching team is optional, so return 100 if not using team teaching
      if (!values.hasTeamTeaching) return 100;
      
      // Otherwise check if there are team members with emails
      const team = values.teamMembers || [];
      return team.length > 0 && team.every((member: any) => member.email) ? 100 : 50;
      
    default:
      return 0;
  }
};

const EnhancedClassSetup = ({
  onSubmit,
  initialValues,
  initialCohorts = [],
  initialTeamMembers = [],
  classId,
  loadFromStorage = true,
  onFormStateUpdate
}: EnhancedClassSetupProps) => {
  // Removed excessive logging to make initialization cleaner

  // Create a ref for event handling
  const formRef = useRef<HTMLDivElement>(null);

  // Handle form state updates up to parent
  const handleFormStateUpdate = (state: {
    lastSaved: number;
    hasUnsavedChanges: boolean;
    draftExists: boolean;
  }) => {
    if (onFormStateUpdate) {
      onFormStateUpdate(state);
    }
  };

  return (
    <div ref={formRef}>
      <ClassFormProvider
        onSubmit={onSubmit}
        initialValues={initialValues}
        initialCohorts={initialCohorts}
        initialTeamMembers={initialTeamMembers}
        enableStorageLoading={loadFromStorage}
      >
        <EnhancedClassSetupContent
          initialClassId={classId}
          formRef={formRef}
          onFormStateUpdate={handleFormStateUpdate}
        />
      </ClassFormProvider>
    </div>
  );
};

// The main content component that uses the form context
const EnhancedClassSetupContent = ({
  initialClassId,
  formRef,
  onFormStateUpdate
}: {
  initialClassId?: string;
  formRef?: React.RefObject<HTMLDivElement>;
  onFormStateUpdate?: (state: { lastSaved: number; hasUnsavedChanges: boolean; draftExists: boolean; }) => void;
}) => {
  // Removed console log for cleaner initialization

  const {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    cohorts,
    teamMembers,
    lessonFileUploads,
    handleNavigateTab,
    setClassId,
    handleLessonFileChange,
    removeLessonFile,
    appendLessonPlan,
    removeLessonPlan,
    updateLessonPlan,
    saveLessonPlans,
    addCohort,
    removeCohort,
    updateCohort,
    updateRepeatSchedule,
    toggleDayOfWeek,
    addLessonSchedule,
    removeLessonSchedule,
    updateLessonSchedule,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    calculateNumberOfLessons,
    calculateEndDate,
    checkClassCompleteness,
    onSubmit,
    // Storage-related features
    lastSaved,
    hasUnsavedChanges,
    draftExists,
    saveCurrentFormState,
    loadFromStorage,
    clearStoredData,
    loadDraft,
    discardDraft,
  } = useClassForm();

  const [usingAI, setUsingAI] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [activeAIHelper, setActiveAIHelper] = useState(false);
  
  // Store hasTeamTeaching value in a ref to avoid dependency issues
  const hasTeamTeachingRef = useRef(form.getValues("hasTeamTeaching"));
  
  // Update the ref when the value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "hasTeamTeaching") {
        hasTeamTeachingRef.current = form.getValues("hasTeamTeaching");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Define enhancedNavigateTab first with useCallback to avoid circular references
  const enhancedNavigateTab = useCallback((tab: string) => {
    handleNavigateTab(tab);

    // Auto-save state when changing tabs
    saveCurrentFormState();
    // Using empty dependency array since these functions shouldn't change during component lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Define our steps with all required info - using activeTab as the only dependency
  // This prevents the need to re-render the entire step structure on each form change
  const steps: Step[] = React.useMemo(() => [
    {
      id: "basic",
      title: "Class Details",
      description: "Set up the basic information about your class",
      icon: BookOpen,
      color: "bg-blue-500",
      component: (
        <BasicInformationTab
          form={form}
          onNextTab={() => enhancedNavigateTab("lessons")}
        />
      ),
      isRequired: true,
    },
    {
      id: "lessons",
      title: "Lesson Plans",
      description: "Create your lesson plans and upload resources",
      icon: FileText,
      color: "bg-emerald-500",
      component: (
        <LessonPlansTab
          form={form}
          onPreviousTab={() => enhancedNavigateTab("basic")}
          onNextTab={() => enhancedNavigateTab("cohorts")}
          lessonFileUploads={lessonFileUploads}
          handleLessonFileChange={handleLessonFileChange}
          removeLessonFile={removeLessonFile}
          appendLessonPlan={appendLessonPlan}
          removeLessonPlan={removeLessonPlan}
          updateLessonPlan={updateLessonPlan}
          saveLessonPlans={saveLessonPlans}
        />
      ),
      isRequired: true,
    },
    {
      id: "cohorts",
      title: "Schedule & Pricing",
      description: "Set up your class schedule, cohorts, and pricing",
      icon: Calendar,
      color: "bg-orange-500",
      component: (
        <CohortsTab
          form={form}
          onPreviousTab={() => enhancedNavigateTab("lessons")}
          onNextTab={() => enhancedNavigateTab("teaching")}
          cohorts={cohorts}
          addCohort={addCohort}
          removeCohort={removeCohort}
          updateCohort={updateCohort}
          updateRepeatSchedule={updateRepeatSchedule}
          toggleDayOfWeek={toggleDayOfWeek}
          addLessonSchedule={addLessonSchedule}
          removeLessonSchedule={removeLessonSchedule}
          updateLessonSchedule={updateLessonSchedule}
          calculateNumberOfLessons={calculateNumberOfLessons}
          calculateEndDate={calculateEndDate}
        />
      ),
      isRequired: true,
    },
    {
      id: "teaching",
      title: "Teaching Team",
      description: "Add co-teachers or assistants if needed",
      icon: Users,
      color: "bg-purple-500",
      component: (
        <TeachingTeamTab
          form={form}
          onPreviousTab={() => enhancedNavigateTab("cohorts")}
          onNextTab={() => enhancedNavigateTab("preview")}
          isSubmitting={isSubmitting}
          hasTeamTeaching={hasTeamTeachingRef.current}
          teamMembers={teamMembers}
          addTeamMember={addTeamMember}
          removeTeamMember={removeTeamMember}
          updateTeamMember={updateTeamMember}
        />
      ),
      isRequired: false,
    },
    {
      id: "preview",
      title: "Preview & Publish",
      description: "Review your class and make it live",
      icon: Eye,
      color: "bg-rose-500",
      component: (
        <PreviewTab
          form={form}
          onPreviousTab={() => enhancedNavigateTab("teaching")}
          isSubmitting={isSubmitting}
          cohorts={cohorts}
          teamMembers={teamMembers}
          checkClassCompleteness={checkClassCompleteness}
        />
      ),
      isRequired: true,
    },
  // Use only activeTab as dependency to prevent unnecessary recalculations
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [activeTab]);

  // Find current step
  const currentStepIndex = steps.findIndex(step => step.id === activeTab);
  const currentStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const prevStep = steps[currentStepIndex - 1];

  // Define the navigation tab handler with validation
  const validateAndNavigate = useCallback(async (tab: string) => {
    const currentTabIndex = steps.findIndex(step => step.id === activeTab);
    const targetTabIndex = steps.findIndex(step => step.id === tab);

    // Moving forward - validate current tab first
    if (targetTabIndex > currentTabIndex) {
      // Determine fields to validate based on current tab
      let fieldsToValidate: string[] = [];

      switch (activeTab) {
        case "basic":
          fieldsToValidate = ["title", "subject", "type"];
          if (form.getValues("type") === "academic") {
            fieldsToValidate.push("gradeLevel");
          } else {
            fieldsToValidate.push("ageRange");
          }
          if (form.getValues("curriculum")) {
            fieldsToValidate.push("curriculum", "curriculumLevel");
          }
          break;

        case "lessons":
          // Validate at least one lesson plan
          if (form.getValues("lessonPlans")?.length === 0) {
            addError({
              field: "lessonPlans",
              message: "Please add at least one lesson plan before proceeding",
              type: "warning"
            });
            return; // Prevent navigation
          }
          break;

        case "cohorts":
          // Check if cohorts exist
          if (cohorts.length === 0) {
            addError({
              field: "",
              message: "Please add at least one cohort before proceeding",
              type: "warning"
            });
            return; // Prevent navigation
          }
          break;

        case "teaching":
          // If team teaching is enabled, validate team members
          if (form.getValues("hasTeamTeaching") && teamMembers.length === 0) {
            addError({
              field: "",
              message: "Please add at least one team member or disable team teaching",
              type: "warning"
            });
            return; // Prevent navigation
          }
          break;
      }

      // Validate fields if any
      if (fieldsToValidate.length > 0) {
        const isValid = await form.trigger(fieldsToValidate as any);

        if (!isValid) {
          // Add a general error message
          addError({
            field: "",
            message: "Please fix the validation errors before proceeding",
            type: "error"
          });

          // Let the useFormErrors hook handle showing field errors
          return; // Prevent navigation
        }
      }
    }

    // If we reach here, validation passed or we're moving backward
    enhancedNavigateTab(tab);

    // Create stable references to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Initialize the form errors hook with a lower debounce value for more responsive validation
  const {
    errors: formErrors,
    addError,
    dismissError,
    scrollToField,
    validateFields
  } = useFormErrors(form, {
    // More responsive validation with lower debounce
    debounceMs: 300
  });

  // Set the class ID in context if it was provided - using a ref to prevent infinite loops
  const initializedClassIdRef = useRef(false);
  useEffect(() => {
    if (initialClassId && !initializedClassIdRef.current) {
      console.log("Setting classId in context (once only):", initialClassId);
      setClassId(initialClassId);
      initializedClassIdRef.current = true;
    }
  }, [initialClassId, setClassId]);

  // Update parent with form state - use refs and previous value comparison to prevent unnecessary updates
  const formStateRef = useRef({
    lastSaved,
    hasUnsavedChanges,
    draftExists
  });

  const prevFormStateRef = useRef({
    lastSaved,
    hasUnsavedChanges,
    draftExists
  });

  // Update the ref when state changes, but only notify parent if there's an actual change
  useEffect(() => {
    const currentState = {
      lastSaved,
      hasUnsavedChanges,
      draftExists
    };

    // Check if any values have changed before updating
    const hasChanged =
      prevFormStateRef.current.lastSaved !== currentState.lastSaved ||
      prevFormStateRef.current.hasUnsavedChanges !== currentState.hasUnsavedChanges ||
      prevFormStateRef.current.draftExists !== currentState.draftExists;

    if (hasChanged) {
      // Update refs
      formStateRef.current = currentState;
      prevFormStateRef.current = currentState;

      // Notify parent only when there's a change
      if (onFormStateUpdate) {
        onFormStateUpdate(currentState);
      }
    }
  // Using a custom comparison instead of object dependencies to prevent unnecessary effect runs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Convert timestamps to strings for stable comparison
    String(lastSaved),
    // These are booleans, so they're already stable for comparison
    hasUnsavedChanges,
    draftExists
  ]);

  // Set up event listeners for form actions from parent
  useEffect(() => {
    const element = formRef?.current;
    if (!element) return;

    const handleLoadDraft = () => {
      loadDraft();
    };

    const handleDiscardDraft = () => {
      discardDraft();
    };

    const handleSaveNow = () => {
      saveCurrentFormState();
    };

    element.addEventListener('load-draft', handleLoadDraft);
    element.addEventListener('discard-draft', handleDiscardDraft);
    element.addEventListener('save-now', handleSaveNow);

    return () => {
      element.removeEventListener('load-draft', handleLoadDraft);
      element.removeEventListener('discard-draft', handleDiscardDraft);
      element.removeEventListener('save-now', handleSaveNow);
    };
  }, [formRef, loadDraft, discardDraft, saveCurrentFormState]);

  // Removed debugging log to make initialization seamless

  // Calculate overall completion percentage - using interval-based approach to prevent infinite loops
  const calculateCompletion = useCallback(() => {
    // Calculate completion for each step
    const stepCompletions = steps.map(step =>
      calculateStepCompletion(form, step.id, checkClassCompleteness) * (step.isRequired ? 1 : 0.5)
    );

    // Weight required steps more heavily
    const totalPossible = steps.reduce((acc, step) => acc + (step.isRequired ? 100 : 50), 0);
    const totalCompleted = stepCompletions.reduce((acc, percent, i) =>
      acc + percent * (steps[i].isRequired ? 1 : 0.5), 0);

    return Math.round((totalCompleted / totalPossible) * 100);
  }, [form, steps, checkClassCompleteness]);

  // Use interval for calculation instead of watching form changes
  useEffect(() => {
    // Calculate initially
    setCompletionPercentage(calculateCompletion());

    // Set up interval to periodically recalculate
    const interval = setInterval(() => {
      setCompletionPercentage(calculateCompletion());
    }, 1000);

    // Cleanup interval
    return () => clearInterval(interval);
  }, [calculateCompletion]);

  // Check if we should auto-add a cohort
  useEffect(() => {
    if (cohorts.length === 0 && activeTab === "cohorts") {
      addCohort();
    }
  }, [activeTab, cohorts.length, addCohort]);

  // Auto-generate lesson plans with AI
  const handleGenerateLessonPlans = useCallback(() => {
    setUsingAI(true);
    
    // In a real implementation, this would call an API to generate lesson plans
    setTimeout(() => {
      const defaultLessons = [
        {
          id: Date.now().toString() + "1",
          title: "Introduction to the Subject",
          description: "This first lesson introduces students to key concepts and establishes the foundation for the course.",
          duration: "60 minutes",
          resources: "",
        },
        {
          id: Date.now().toString() + "2",
          title: "Core Principles and Practice",
          description: "Students will dive deeper into the subject matter, learning essential principles and getting hands-on practice.",
          duration: "60 minutes",
          resources: "",
        },
        {
          id: Date.now().toString() + "3",
          title: "Advanced Concepts and Application",
          description: "Building on previous knowledge, students will explore advanced concepts and apply their learning to real-world scenarios.",
          duration: "60 minutes",
          resources: "",
        },
      ];
      
      form.setValue("lessonPlans", defaultLessons);
      setUsingAI(false);
    }, 2000); // Simulate API call
  }, [form]);

  // Handle AI helper suggestions
  const handleAIHelperChanges = useCallback((changes: any) => {
    if (changes.title) {
      form.setValue("title", changes.title);
    }
    if (changes.description) {
      form.setValue("description", changes.description);
    }
    if (changes.objectives) {
      form.setValue("objectives", changes.objectives);
    }
    if (changes.lessonPlans) {
      form.setValue("lessonPlans", changes.lessonPlans);
    }
  }, [form]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Error Notifications */}
      <FormErrorNotification
        errors={formErrors}
        onDismiss={dismissError}
        onScrollToField={scrollToField}
      />

      {/* AI Helper Dialog */}
      <Dialog open={activeAIHelper} onOpenChange={setActiveAIHelper}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Class Creator</DialogTitle>
          </DialogHeader>
          <AIClassHelper
            onApplyChanges={handleAIHelperChanges}
            initialPrompt={form.getValues("title") || form.getValues("subject") || ""}
          />
        </DialogContent>
      </Dialog>
      
      {/* Header with progress */}
      <div className="mb-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h2 className="text-lg font-medium mb-1 sm:mb-0">
              {form.getValues("title") ? `Creating: ${form.getValues("title")}` : "Create a New Class"}
            </h2>
            <span className="text-sm font-medium text-gray-600">
              {completionPercentage}% complete
            </span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-2 bg-gray-100" 
            indicatorClassName={cn(
              completionPercentage >= 80 ? "bg-green-500" : 
              completionPercentage >= 40 ? "bg-blue-500" : 
              "bg-orange-500"
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mobile step indicator - visible only on smaller screens */}
        <div className="lg:hidden w-full mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}</h3>
            <div className="text-xs text-gray-500">
              {calculateStepCompletion(form, currentStep.id, checkClassCompleteness)}% complete
            </div>
          </div>
          <div className="flex w-full mb-4">
            {steps.map((step, index) => {
              const stepCompletion = calculateStepCompletion(form, step.id, checkClassCompleteness);
              return (
                <div key={step.id} className="flex-1 px-0.5">
                  <button 
                    type="button"
                    onClick={() => validateAndNavigate(step.id)}
                    className="w-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 rounded-full"
                  >
                    <div 
                      className={cn(
                        "h-2.5 rounded-full transition-colors",
                        activeTab === step.id 
                          ? step.color 
                          : stepCompletion === 100
                            ? "bg-green-500"
                            : "bg-gray-100"
                      )}
                    />
                    {/* Small dot indicator below the progress bar */}
                    <div className="flex justify-center mt-1">
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        activeTab === step.id ? step.color : "bg-transparent"
                      )}/>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Left sidebar with steps - hidden on mobile */}
        <div className="hidden lg:block lg:col-span-3">
          <Card className="shadow-sm sticky top-4">
            <CardContent className="p-0">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <h3 className="font-medium">Class Setup Steps</h3>
                <p className="text-sm text-gray-600">
                  Complete these steps to set up your class
                </p>
              </div>
              <ul className="py-2">
                {steps.map((step, index) => {
                  const stepCompletion = calculateStepCompletion(form, step.id, checkClassCompleteness);
                  
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => validateAndNavigate(step.id)}
                        className={cn(
                          "w-full flex items-start p-3 gap-3 hover:bg-gray-50 transition-colors",
                          activeTab === step.id && "bg-blue-50"
                        )}
                      >
                        <div className="relative mt-0.5">
                          <div 
                            className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full text-white",
                              stepCompletion === 100 ? "bg-green-500" : step.color
                            )}
                          >
                            {stepCompletion === 100 ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          {index < steps.length - 1 && (
                            <div className="absolute top-7 bottom-0 left-1/2 w-px h-full -translate-x-1/2 bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between">
                            <div className="font-medium">{step.title}</div>
                            <div className="text-xs text-gray-500">{stepCompletion}%</div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                          
                          {/* Show micro-progress for each step */}
                          <div className="mt-2 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                stepCompletion === 100 ? "bg-green-500" : step.color
                              )}
                              style={{ width: `${stepCompletion}%` }}
                            ></div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Quick tips card */}
          <Card className="shadow-sm mt-4 sticky top-96">
            <CardContent className="p-4">
              <h3 className="flex items-center text-sm font-medium mb-3">
                <Sparkles className="h-4 w-4 mr-1.5 text-amber-500" />
                Tips for this step
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-gray-600 space-y-2"
                >
                  {activeTab === "basic" && (
                    <>
                      <p>• Keep your class title clear and descriptive</p>
                      <p>• Include grade level and curriculum information</p>
                      <p>• Write a compelling description that engages parents and students</p>
                      <div className="pt-2">
                        <Button 
                          type="button"
                          size="sm"
                          className="w-full"
                          variant="outline" 
                          onClick={() => setActiveAIHelper(true)}
                        >
                          <Sparkles className="h-4 w-4 mr-1.5" />
                          AI Class Helper
                        </Button>
                      </div>
                    </>
                  )}
                  {activeTab === "lessons" && (
                    <>
                      <p>• Be specific about each lesson's objectives</p>
                      <p>• Include at least 3 lesson plans to get started</p>
                      <p>• Add resources like worksheets or presentations</p>
                      <div className="pt-2">
                        <Button 
                          type="button"
                          size="sm"
                          className="w-full"
                          variant="outline" 
                          onClick={handleGenerateLessonPlans}
                          disabled={usingAI}
                        >
                          {usingAI ? (
                            <>
                              <motion.div 
                                className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              ></motion.div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-1.5" />
                              Generate with AI
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                  {activeTab === "cohorts" && (
                    <>
                      <p>• Set clear start and end dates</p>
                      <p>• Choose reasonable enrollment limits</p>
                      <p>• Price your class competitively</p>
                    </>
                  )}
                  {activeTab === "teaching" && (
                    <>
                      <p>• Invite co-teachers early to collaborate</p>
                      <p>• Clearly define team member roles</p>
                      <p>• Consider adding teaching assistants for larger classes</p>
                    </>
                  )}
                  {activeTab === "preview" && (
                    <>
                      <p>• Review all details before publishing</p>
                      <p>• Make sure your class meets all requirements</p>
                      <p>• Consider using the "Preview as Student" feature</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Tips card for mobile, showing only when needed */}
        <div className="lg:hidden mb-4">
          <Card className="shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-1.5 text-amber-500" />
                  Quick Tips
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto font-normal flex items-center text-blue-600 hover:text-blue-700"
                  onClick={() => setActiveAIHelper(true)}
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">AI Helper</span>
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                {activeTab === "basic" && (
                  <>
                    <p>• Keep your title clear and descriptive</p>
                    <p>• Include grade level and curriculum info</p>
                  </>
                )}
                {activeTab === "lessons" && (
                  <>
                    <p>• Add at least 3 lesson plans</p>
                    <p>• Include resources when possible</p>
                    {usingAI ? (
                      <div className="flex items-center mt-1 text-blue-600">
                        <motion.div 
                          className="h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1.5"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        ></motion.div>
                        Generating with AI...
                      </div>
                    ) : (
                      <Button 
                        type="button"
                        size="sm"
                        variant="outline" 
                        onClick={handleGenerateLessonPlans}
                        className="mt-1 h-7 text-xs"
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Generate with AI
                      </Button>
                    )}
                  </>
                )}
                {activeTab === "cohorts" && (
                  <>
                    <p>• Set clear start and end dates</p>
                    <p>• Choose reasonable enrollment limits</p>
                  </>
                )}
                {activeTab === "teaching" && (
                  <>
                    <p>• Invite co-teachers early to collaborate</p>
                    <p>• Define team member roles clearly</p>
                  </>
                )}
                {activeTab === "preview" && (
                  <>
                    <p>• Review all details before publishing</p>
                    <p>• Make sure all requirements are met</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="col-span-1 lg:col-span-9">
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      {currentStep.component}
                    </form>
                  </Form>
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row justify-between mt-8 border-t pt-6 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => prevStep && validateAndNavigate(prevStep.id)}
                  disabled={!prevStep}
                  className="order-2 sm:order-1"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                
                <div className="flex flex-col-reverse sm:flex-row gap-3 order-1 sm:order-2">
                  {/* Skip button for optional steps */}
                  {!currentStep.isRequired && nextStep && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => validateAndNavigate(nextStep.id)}
                    >
                      Skip
                    </Button>
                  )}
                  
                  {/* Next/Submit button */}
                  {nextStep ? (
                    <Button
                      type="button"
                      onClick={() => validateAndNavigate(nextStep.id)}
                      className="gap-1.5 w-full sm:w-auto"
                    >
                      <span>{currentStepIndex === 0 ? 'Next: Lesson Plans' : 'Next'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={isSubmitting}
                      className="gap-1.5 w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Submitting...' : 'Publish Class'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedClassSetup;