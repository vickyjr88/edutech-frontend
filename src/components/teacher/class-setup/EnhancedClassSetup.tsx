import React, { useState, useEffect } from "react";
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
}

// Helper to calculate completion percentage
const calculateStepCompletion = (form: any, stepId: string, checkClassCompleteness?: any): number => {
  const values = form.getValues();
  
  switch (stepId) {
    case "basic":
      const requiredBasicFields = ['title', 'subject', 'summary', 'description'];
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
      const team = form.getValues().teamMembers || [];
      return team.length > 0 && team.every((member: any) => member.email) ? 100 : 50;
      
    default:
      return 0;
  }
};

const EnhancedClassSetup = ({ onSubmit, initialValues }: EnhancedClassSetupProps) => {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: initialValues || {
      type: "academic",
      title: "",
      subject: "",
      curriculum: "",
      gradeLevel: "",
      ageRange: "",
      summary: "",
      description: "",
      objectives: "",
      assessmentMethods: "",
      technicalRequirements: "",
      materialsRequired: "",
      commitmentRequired: "",
      numberOfLessons: 1,
      isPublic: true,
      hasCohorts: false,
      hasTeamTeaching: false,
      lessonPlans: [],
    },
  });

  return (
    <ClassFormProvider onSubmit={onSubmit}>
      <EnhancedClassSetupContent />
    </ClassFormProvider>
  );
};

// The main content component that uses the form context
const EnhancedClassSetupContent = () => {
  const {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    cohorts,
    teamMembers,
    lessonFileUploads,
    handleNavigateTab,
    handleLessonFileChange,
    removeLessonFile,
    appendLessonPlan,
    removeLessonPlan,
    updateLessonPlan,
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
  } = useClassForm();

  const [usingAI, setUsingAI] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  // Removed the viewMode state - we'll only use the wizard view
  const [activeAIHelper, setActiveAIHelper] = useState(false);
  
  // Define our steps with all required info
  const steps: Step[] = [
    {
      id: "basic",
      title: "Class Details",
      description: "Set up the basic information about your class",
      icon: BookOpen,
      color: "bg-blue-500",
      component: (
        <BasicInformationTab
          form={form}
          onNextTab={() => handleNavigateTab("lessons")}
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
          onPreviousTab={() => handleNavigateTab("basic")}
          onNextTab={() => handleNavigateTab("cohorts")}
          lessonFileUploads={lessonFileUploads}
          handleLessonFileChange={handleLessonFileChange}
          removeLessonFile={removeLessonFile}
          appendLessonPlan={appendLessonPlan}
          removeLessonPlan={removeLessonPlan}
          updateLessonPlan={updateLessonPlan}
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
          onPreviousTab={() => handleNavigateTab("lessons")}
          onNextTab={() => handleNavigateTab("teaching")}
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
          onPreviousTab={() => handleNavigateTab("cohorts")}
          onNextTab={() => handleNavigateTab("preview")}
          isSubmitting={isSubmitting}
          hasTeamTeaching={form.watch("hasTeamTeaching")}
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
          onPreviousTab={() => handleNavigateTab("teaching")}
          isSubmitting={isSubmitting}
          cohorts={cohorts}
          teamMembers={teamMembers}
          checkClassCompleteness={checkClassCompleteness}
        />
      ),
      isRequired: true,
    },
  ];

  // Find current step
  const currentStepIndex = steps.findIndex(step => step.id === activeTab);
  const currentStep = steps[currentStepIndex];
  const nextStep = steps[currentStepIndex + 1];
  const prevStep = steps[currentStepIndex - 1];

  // Calculate overall completion percentage
  useEffect(() => {
    // Calculate completion for each step
    const stepCompletions = steps.map(step => 
      calculateStepCompletion(form, step.id, checkClassCompleteness) * (step.isRequired ? 1 : 0.5)
    );
    
    // Weight required steps more heavily
    const totalPossible = steps.reduce((acc, step) => acc + (step.isRequired ? 100 : 50), 0);
    const totalCompleted = stepCompletions.reduce((acc, percent, i) => 
      acc + percent * (steps[i].isRequired ? 1 : 0.5), 0);
    
    setCompletionPercentage(Math.round((totalCompleted / totalPossible) * 100));
  }, [form.watch(), activeTab, cohorts, teamMembers]);

  // Check if we should auto-add a cohort
  useEffect(() => {
    if (cohorts.length === 0 && activeTab === "cohorts") {
      addCohort();
    }
  }, [activeTab, cohorts.length]);

  // Auto-generate lesson plans with AI
  const handleGenerateLessonPlans = () => {
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
  };

  // Handle AI helper suggestions
  const handleAIHelperChanges = (changes: any) => {
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
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* AI Helper Dialog */}
      <Dialog open={activeAIHelper} onOpenChange={setActiveAIHelper}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Class Creator</DialogTitle>
          </DialogHeader>
          <AIClassHelper 
            onApplyChanges={handleAIHelperChanges} 
            initialPrompt={form.watch("title") || form.watch("subject") || ""}
          />
        </DialogContent>
      </Dialog>
      
      {/* Header with progress */}
      <div className="mb-6">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h2 className="text-lg font-medium mb-1 sm:mb-0">
              {form.watch("title") ? `Creating: ${form.watch("title")}` : "Create a New Class"}
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
                    onClick={() => handleNavigateTab(step.id)}
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
                        onClick={() => handleNavigateTab(step.id)}
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
                  onClick={() => prevStep && handleNavigateTab(prevStep.id)}
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
                      onClick={() => handleNavigateTab(nextStep.id)}
                    >
                      Skip
                    </Button>
                  )}
                  
                  {/* Next/Submit button */}
                  {nextStep ? (
                    <Button
                      type="button"
                      onClick={() => handleNavigateTab(nextStep.id)}
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