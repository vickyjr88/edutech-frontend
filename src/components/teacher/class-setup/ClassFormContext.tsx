import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassFormValues, CohortData, TeamMember, classSchema, LessonSchedule, RepeatSchedule } from "./types";
import { addDays, addWeeks, parseISO, isAfter } from "date-fns";
import { classService } from "@/integrations/api/services/class.service";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  saveFormToStorage,
  getFormFromStorage,
  clearStoredForm,
  getFormMetadata
} from "./utils/storageUtils";
import { getApiRepeatPatternValue, getLocalRepeatPatternValue } from "./utils/repeatPatternUtils";

interface ClassFormContextType {
  form: UseFormReturn<ClassFormValues>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  cohorts: CohortData[];
  setCohorts: React.Dispatch<React.SetStateAction<CohortData[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  lessonFileUploads: Record<string, File[]>;
  setLessonFileUploads: React.Dispatch<React.SetStateAction<Record<string, File[]>>>;
  classId: string | null;
  setClassId: React.Dispatch<React.SetStateAction<string | null>>;
  lastSaved: number;
  hasUnsavedChanges: boolean;
  isLoadingFromStorage: boolean;
  draftExists: boolean;

  // Helper methods
  addCohort: () => void;
  removeCohort: (id: string) => void;
  updateCohort: (id: string, field: keyof CohortData, value: any) => void;
  updateRepeatSchedule: (cohortId: string, field: keyof RepeatSchedule, value: any) => void;
  toggleDayOfWeek: (cohortId: string, day: string) => void;

  // Lesson schedule methods
  addLessonSchedule: (cohortId: string) => void;
  removeLessonSchedule: (cohortId: string, scheduleId: string) => void;
  updateLessonSchedule: (cohortId: string, scheduleId: string, field: keyof LessonSchedule, value: any) => void;

  addTeamMember: () => void;
  removeTeamMember: (id: string) => void;
  updateTeamMember: (id: string, field: "email" | "role", value: string) => void;

  handleLessonFileChange: (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLessonFile: (lessonId: string, fileIndex: number) => void;
  appendLessonPlan: () => void;
  removeLessonPlan: (id: string) => void;
  updateLessonPlan: (id: string, field: string, value: string) => void;
  saveLessonPlans: () => Promise<boolean>;

  handleNavigateTab: (tab: string) => void;
  calculateNumberOfLessons: (startDate: Date | null, endDate: Date | null, repeatSchedule: RepeatSchedule) => number;
  calculateEndDate: (startDate: Date | null, numberOfLessons: number, repeatSchedule: RepeatSchedule) => Date | null;

  // Class completeness check
  checkClassCompleteness: () => {
    isComplete: boolean;
    basicInfoComplete: boolean;
    hasMinLessonPlans: boolean;
    hasMinCohorts: boolean;
    missingItems: string[];
  };

  // Storage and persistence methods
  saveCurrentFormState: () => void;
  loadFromStorage: () => void;
  clearStoredData: () => void;
  loadDraft: () => void;
  discardDraft: () => void;

  // Save basic info and continue
  saveBasicInfoAndContinue: () => Promise<void>;

  // Form submission
  onSubmit: (data: ClassFormValues) => void;
};

export const ClassFormContext = createContext<ClassFormContextType | undefined>(undefined);

export const useClassForm = () => {
  const context = useContext(ClassFormContext);
  if (!context) {
    throw new Error("useClassForm must be used within a ClassFormProvider");
  }
  return context;
};

interface ClassFormProviderProps {
  children: ReactNode;
  onSubmit: (data: ClassFormValues) => void;
  initialValues?: Partial<ClassFormValues>;
  initialCohorts?: any[];
  initialTeamMembers?: any[];
  enableStorageLoading?: boolean;
}

export const ClassFormProvider = ({
  children,
  onSubmit,
  initialValues,
  initialCohorts = [],
  initialTeamMembers = [],
  enableStorageLoading = true
}: ClassFormProviderProps) => {
  console.log("ClassFormProvider received initialCohorts:", initialCohorts);
  console.log("ClassFormProvider received initialTeamMembers:", initialTeamMembers);

  const navigate = useNavigate();
  // Don't use useAuth directly here, as it might be called outside the AuthProvider
  let userAuth = { user: null }; // Default empty user
  try {
    // Try to get auth context, but don't fail if not available
    const authContext = useAuth();
    userAuth = { ...userAuth, ...authContext };
  } catch (error) {
    console.warn("Auth context not available, using default values");
  }

  // Initialize state
  const { classId: urlClassId } = useParams<{ classId?: string }>();
  const [activeTab, setActiveTab] = useState("basic");
  const [cohorts, setCohorts] = useState<CohortData[]>(initialCohorts as CohortData[]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers as TeamMember[]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lessonFileUploads, setLessonFileUploads] = useState<Record<string, File[]>>({});
  const [classId, setClassId] = useState<string | null>(urlClassId || null);

  // New state for storage-related features
  const [lastSaved, setLastSaved] = useState<number>(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(false);
  const [draftExists, setDraftExists] = useState(false);

  // Removed log for cleaner initialization

  // Removed excessive logging to make initialization seamless
  const effectiveDefaultValues = initialValues ? {
    ...initialValues
  } : {
    type: "academic",
    title: "",
    subject: "",
    curriculum: "",
    curriculumLevel: "",
    gradeLevel: "",
    ageRange: "",
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
  };

  // Removed log for cleaner initialization

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: effectiveDefaultValues,
    mode: "onChange" // Enable onChange validation mode for better UX
  });

  // Save the current form state to local storage
  const saveCurrentFormState = () => {
    const formValues = form.getValues();
    const teacherId = userAuth.user?.teacherId || null;
    
    // Check if this is a new, mostly empty form that we shouldn't save
    const isEmptyNewForm = !classId && 
      (!formValues.title || formValues.title.trim() === "") && 
      (!formValues.subject || formValues.subject.trim() === "");
    
    // Don't save empty new forms to prevent auto-completion issues
    if (isEmptyNewForm) {
      return;
    }

    saveFormToStorage(
      formValues,
      cohorts,
      teamMembers,
      activeTab,
      classId,
      teacherId
    );

    setLastSaved(Date.now());
    setHasUnsavedChanges(false);
    setDraftExists(true);
    // Form state saved successfully
  };

  // Load saved form state from local storage
  const loadFromStorage = () => {
    setIsLoadingFromStorage(true);

    try {
      const {
        formValues,
        cohorts: storedCohorts,
        teamMembers: storedTeamMembers,
        activeTab: storedTab
      } = getFormFromStorage();

      const metadata = getFormMetadata();

      if (formValues) {
        form.reset(formValues);
        setCohorts(storedCohorts);
        setTeamMembers(storedTeamMembers);
        setActiveTab(storedTab);
        setLastSaved(metadata.lastSaved);
        setClassId(metadata.classId);

        // Removed verbose logging for cleaner form loading
      }
    } catch (error) {
      console.error('Error loading form from storage:', error);
    } finally {
      setIsLoadingFromStorage(false);
    }
  };

  // Clear all stored form data
  const clearStoredData = () => {
    clearStoredForm();
    setDraftExists(false);
    setLastSaved(0);
  };

  // Load draft from storage
  const loadDraft = () => {
    loadFromStorage();
  };

  // Discard draft
  const discardDraft = () => {
    clearStoredData();
    form.reset({
      type: "academic",
      title: "",
      subject: "",
      curriculum: "",
      curriculumLevel: "",
      gradeLevel: "",
      ageRange: "",
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
    });
    setCohorts([]);
    setTeamMembers([]);
    setActiveTab("basic");
  };

  // Check if a draft exists on component mount
  useEffect(() => {
    const metadata = getFormMetadata();
    const hasDraft = metadata.lastSaved > 0;
    setDraftExists(hasDraft);

    if (hasDraft) {
      setLastSaved(metadata.lastSaved);
    }
  }, []);

  // Handle initialization from props or storage
  useEffect(() => {
    // If we have initialValues from props, use those
    if (initialValues) {
      console.log("Initializing form with provided values:", initialValues);
      form.reset(initialValues);
      return;
    }

    // If we have a URL classId, prioritize API loading (handled elsewhere)
    if (urlClassId) {
      return;
    }

    // Only load from storage if explicitly requested by user.
    // We're disabling automatic draft loading to fix the issue with forms 
    // getting auto-completed when they're supposed to be blank
    /*
    if (enableStorageLoading && !initialValues && !urlClassId) {
      const metadata = getFormMetadata();
      const hasDraft = metadata.lastSaved > 0;

      if (hasDraft) {
        console.log("Loading form from local storage");
        loadFromStorage();
      }
    }
    */
  }, [initialValues, urlClassId]);

  // Track form changes and auto-save
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Auto-save when values change, but only if not a new form or if explicitly enabled
  useEffect(() => {
    // Only auto-save if we have either an existing class ID or explicit user interaction has occurred
    const shouldAutoSave = hasUnsavedChanges && (classId || form.formState.dirtyFields.title);
    
    if (shouldAutoSave) {
      const timeoutId = setTimeout(() => {
        saveCurrentFormState();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [form.formState.isDirty, cohorts, teamMembers, hasUnsavedChanges, classId, form.formState.dirtyFields]);

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
  };

  const saveBasicInfoAndContinue = async () => {
    try {
      // Validate basic info fields
      await form.trigger(['title', 'subject', 'type', 'description', 'numberOfLessons']);

      // Check if required fields are valid
      const requiredFields = ['title', 'subject', 'type', 'numberOfLessons'];
      const isValid = requiredFields.every(field => {
        const fieldValue = form.getValues(field as keyof ClassFormValues);
        return fieldValue && String(fieldValue).trim() !== "";
      });

      if (!isValid) {
        // Show error or validation message
        console.error("Please fill in all required fields");
        return;
      }

      setIsSubmitting(true);

      // Get the current form values
      const formValues = form.getValues();

      // Save current state to local storage before API call
      saveCurrentFormState();

      // Optimistically proceed to next tab before waiting for API
      setActiveTab("lessons");

      // Format data according to the backend DTO requirements

      const formattedData = {
        // Only include teacher field for new classes, not for updates
        ...(classId ? {} : { teacher: userAuth.user?.teacherId || "default_teacher_id" }),
        title: formValues.title,
        type: formValues.type,
        subject: formValues.subject,
        curriculum: formValues.curriculum || undefined,
        curriculumLevel: formValues.curriculumLevel || undefined,
        gradeLevel: formValues.type === "academic" ? formValues.gradeLevel : undefined,
        ageRange: formValues.type === "afterschool" ? formValues.ageRange : undefined,
        description: formValues.description || undefined,
        numberOfLessons: Number(formValues.numberOfLessons) || 1,
        isPublic: formValues.isPublic,
        enableMultipleCohorts: formValues.hasCohorts,
        enableTeamTeaching: formValues.hasTeamTeaching,

        // Format optional fields according to DTO
        technicalRequirements: formValues.technicalRequirements ?
          formValues.technicalRequirements.split('\n')
            .filter(req => req.trim() !== '')
            .map(req => ({ requirement: req.trim() })) :
          undefined,

        materials: formValues.materialsRequired ?
          formValues.materialsRequired.split('\n')
            .filter(mat => mat.trim() !== '')
            .map(mat => ({ name: mat.trim() })) :
          undefined,

        commitment: formValues.commitmentRequired || undefined,

        // Include existing lesson plans
        lessonPlans: formValues.lessonPlans || [],
        cohorts: cohorts.map(cohort => {
          // Extract _id if it exists, and other fields we don't want to send directly
          const { hasFlexibleSchedule, lessonSchedules, ...cohortData } = cohort;
          
          // Remove id field (but keep _id if it exists)
          if (cohortData.id) {
            delete cohortData.id;
          }
          
          // Convert days of week format to uppercase for API
          const daysOfWeek = cohort.repeatSchedule.daysOfWeek.map(day => 
            day.toUpperCase()
          );
          
          return {
            // Include _id field only if it exists (for existing cohorts)
            ...(cohort._id ? { _id: cohort._id } : {}),
            name: cohortData.name,
            isActive: cohortData.isActive,
            startDate: cohortData.startDate,
            endDate: cohortData.endDate,
            startTime: cohortData.startTime,
            endTime: cohortData.endTime,
            repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule.pattern),
            daysOfWeek,
            repeatEvery: Number(cohort.repeatSchedule.repeatEvery) || 1, // Ensure repeatEvery is included as a number
            customLessonTimes: hasFlexibleSchedule,
            minimumStudents: cohortData.minStudents,
            maximumStudents: cohortData.maxStudents,
            enrollmentDeadline: cohortData.enrollmentDeadline,
            price: Number(cohortData.price) || 0,
            discount: Number(cohortData.discount) || 0
          };
        }),
        teachingTeam: []
      };

      // Generate a temporary client-side ID if creating a new class
      if (!classId) {
        const tempClassId = `temp_${Date.now()}`;
        setClassId(tempClassId);

        // Optimistically update URL - this will be corrected when actual ID returns
        navigate(`/teacher-class-setup/${tempClassId}`, { replace: true });
      }

      try {
        if (classId) {
          // Update existing class
          const { data, error } = await classService.update(classId, formattedData as any);

          if (error) {
            throw new Error(error.message || "Error updating class");
          } else {
            // Update localStorage with newest state including any server-generated data
            saveCurrentFormState();
          }
        } else {
          // Create new class - at this point we should have a tempClassId set in the state
          const { data, error } = await classService.create(formattedData as any);

          if (error) {
            throw new Error(error.message || "Error creating class");
          } else if (data) {
            // Replace temp ID with real ID from server
            const newClassId = data._id || data.id;
            setClassId(newClassId);

            // Update URL to include real class ID
            navigate(`/teacher-class-setup/${newClassId}`, { replace: true });

            // Update localStorage with the server-generated class ID
            setTimeout(() => {
              saveCurrentFormState();
            }, 100);
          }
        }
      } catch (apiError) {
        console.error("API error:", apiError);

        // Show error toast (using the contextual component methods if available)
        // But don't navigate back - let the user continue editing in the next tab
        // with the local changes they've made

        // If really needed, you could implement a retry mechanism here
      }
    } catch (err) {
      console.error("Failed to save class:", err);
      // Even if there's a client-side error, don't block the user if possible
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const checkClassCompleteness = () => {
    const formValues = form.getValues();
    const missingItems: string[] = [];
    
    const requiredBasicFields = ['title', 'subject', 'description'];
    const basicMissing = requiredBasicFields.filter(field => !formValues[field as keyof ClassFormValues]);
    
    if (formValues.type === 'academic' && !formValues.gradeLevel) {
      basicMissing.push('gradeLevel');
    } else if (formValues.type === 'afterschool' && !formValues.ageRange) {
      basicMissing.push('ageRange');
    }
    
    const basicInfoComplete = basicMissing.length === 0;
    if (!basicInfoComplete) {
      missingItems.push('Basic information (title, subject, description, etc.)');
    }
    
    const futureLessonPlans = formValues.lessonPlans.filter(lesson => 
      lesson.title && lesson.description
    );
    
    const hasMinLessonPlans = futureLessonPlans.length >= 1;
    if (!hasMinLessonPlans) {
      missingItems.push(`At least 1 lesson plan (currently has ${futureLessonPlans.length})`);
    }
    
    const hasMinCohorts = cohorts.length >= (formValues.hasCohorts ? 1 : 1);
    if (!hasMinCohorts) {
      missingItems.push('At least one cohort');
    }
    return {
      isComplete: basicInfoComplete && hasMinLessonPlans && hasMinCohorts,
      basicInfoComplete,
      hasMinLessonPlans,
      hasMinCohorts,
      missingItems
    };
  };

  const calculateNumberOfLessons = (
    startDate: Date | null, 
    endDate: Date | null,
    repeatSchedule: RepeatSchedule
  ): number => {
    if (!startDate || !endDate) return 0;
    
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / millisecondsPerDay));
    
    const weeks = Math.ceil(days / 7);
    
    let lessonsPerWeek = 0;
    
    if (repeatSchedule.pattern === "weekly") {
      lessonsPerWeek = 1;
    } else if (repeatSchedule.pattern === "twice-weekly") {
      lessonsPerWeek = 2;
    } else if (repeatSchedule.pattern === "custom") {
      lessonsPerWeek = repeatSchedule.daysOfWeek.length;
    }
    
    return Math.ceil((weeks * lessonsPerWeek) / repeatSchedule.repeatEvery);
  };
  
  const calculateEndDate = (
    startDate: Date | null,
    numberOfLessons: number,
    repeatSchedule: RepeatSchedule
  ): Date | null => {
    if (!startDate || numberOfLessons <= 0) return null;
    
    let lessonsPerWeek = 0;
    if (repeatSchedule.pattern === "weekly") {
      lessonsPerWeek = 1;
    } else if (repeatSchedule.pattern === "twice-weekly") {
      lessonsPerWeek = 2;
    } else if (repeatSchedule.pattern === "custom") {
      lessonsPerWeek = repeatSchedule.daysOfWeek.length;
    }
    
    if (lessonsPerWeek === 0) return null;
    
    const weeksNeeded = Math.ceil(numberOfLessons / lessonsPerWeek) * repeatSchedule.repeatEvery;
    
    return addWeeks(startDate, weeksNeeded);
  };

  const addCohort = () => {
    const hasCohorts = form.getValues().hasCohorts;
    const tempId = Date.now().toString();
    const cohortNumber = cohorts.length + 1;
    const classTitle = form.getValues().title || "Class";
    
    if (!hasCohorts && cohorts.length > 0) {
      return;
    }
    
    setCohorts([...cohorts, { 
      id: tempId,  // Keep id for backward compatibility 
      name: hasCohorts ? `${classTitle} Cohort ${cohortNumber}` : classTitle, 
      startDate: null,
      endDate: null,
      startTime: "",
      endTime: "",
      numberOfLessons: form.getValues().numberOfLessons || 1,
      price: "",
      discount: "0",
      isActive: true,
      lessonSchedules: [],
      hasFlexibleSchedule: false,
      repeatSchedule: {
        pattern: "weekly",
        daysOfWeek: ["monday"],
        repeatEvery: 1
      },
      minStudents: 1,
      maxStudents: 20,
      enrollmentDeadline: null
    }]);
  };

  const removeCohort = (id: string) => {
    const hasCohorts = form.getValues().hasCohorts;
    
    if (!hasCohorts && cohorts.length <= 1) {
      return;
    }
    
    setCohorts(cohorts.filter(cohort => {
      // Check if this is the cohort to remove
      // First check _id (for existing cohorts from backend)
      if (cohort._id && cohort._id === id) {
        return false;
      }
      // Then check id (for newly created cohorts)
      if (cohort.id && cohort.id === id) {
        return false;
      }
      // Keep this cohort (not the one to remove)
      return true;
    }));
  };

  const updateCohort = (id: string, field: keyof CohortData, value: any) => {
    setCohorts(cohorts.map(cohort => {
      // Check if we need to update this cohort
      const isCohortMatch = 
        // Check _id for existing cohorts from backend
        (cohort._id && cohort._id === id) || 
        // Check id for newly created cohorts
        (cohort.id && cohort.id === id);
      
      if (isCohortMatch) {
        const updatedCohort = { ...cohort, [field]: value };
        
        if (field === 'startDate') {
          updatedCohort.endDate = calculateEndDate(
            value,
            form.getValues().numberOfLessons,
            cohort.repeatSchedule
          );
        }
        
        return updatedCohort;
      }
      return cohort;
    }));
  };
  
  const updateRepeatSchedule = (cohortId: string, field: keyof RepeatSchedule, value: any) => {
    setCohorts(cohorts.map(cohort => {
      // Check if we need to update this cohort
      const isCohortMatch = 
        // Check _id for existing cohorts from backend
        (cohort._id && cohort._id === cohortId) || 
        // Check id for newly created cohorts
        (cohort.id && cohort.id === cohortId);
      
      if (isCohortMatch) {
        const updatedRepeatSchedule = { ...cohort.repeatSchedule, [field]: value };
        
        const updatedEndDate = calculateEndDate(
          cohort.startDate,
          form.getValues().numberOfLessons,
          updatedRepeatSchedule
        );
        
        return { 
          ...cohort, 
          repeatSchedule: updatedRepeatSchedule,
          endDate: updatedEndDate
        };
      }
      return cohort;
    }));
  };
  
  const toggleDayOfWeek = (cohortId: string, day: string) => {
    setCohorts(cohorts.map(cohort => {
      // Check if we need to update this cohort
      const isCohortMatch = 
        // Check _id for existing cohorts from backend
        (cohort._id && cohort._id === cohortId) || 
        // Check id for newly created cohorts
        (cohort.id && cohort.id === cohortId);
      
      if (isCohortMatch) {
        const daysOfWeek = [...cohort.repeatSchedule.daysOfWeek];
        
        if (daysOfWeek.includes(day)) {
          const updatedDays = daysOfWeek.filter(d => d !== day);
          const finalDays = updatedDays.length > 0 ? updatedDays : daysOfWeek;
          
          const updatedRepeatSchedule = { 
            ...cohort.repeatSchedule, 
            daysOfWeek: finalDays 
          };
          
          const updatedEndDate = calculateEndDate(
            cohort.startDate,
            form.getValues().numberOfLessons,
            updatedRepeatSchedule
          );
          
          return { 
            ...cohort, 
            repeatSchedule: updatedRepeatSchedule,
            endDate: updatedEndDate
          };
        } else {
          const updatedRepeatSchedule = { 
            ...cohort.repeatSchedule, 
            daysOfWeek: [...daysOfWeek, day] 
          };
          
          const updatedEndDate = calculateEndDate(
            cohort.startDate,
            form.getValues().numberOfLessons,
            updatedRepeatSchedule
          );
          
          return { 
            ...cohort, 
            repeatSchedule: updatedRepeatSchedule,
            endDate: updatedEndDate
          };
        }
      }
      return cohort;
    }));
  };

  const addLessonSchedule = (cohortId: string) => {
    // Find cohort by either _id or id
    const cohort = cohorts.find(c => {
      // Check _id for existing cohorts from backend
      if (c._id && c._id === cohortId) {
        return true;
      }
      // Check id for newly created cohorts
      if (c.id && c.id === cohortId) {
        return true;
      }
      return false;
    });
    
    if (!cohort) return;
    
    const existingLessonNumbers = cohort.lessonSchedules.map(ls => ls.lessonNumber);
    let nextLessonNumber = 1;
    while (existingLessonNumbers.includes(nextLessonNumber)) {
      nextLessonNumber++;
    }
    
    const newSchedule: LessonSchedule = {
      id: Date.now().toString(),
      lessonNumber: nextLessonNumber,
      time: "morning"
    };
    
    const updatedCohort = {
      ...cohort,
      lessonSchedules: [...cohort.lessonSchedules, newSchedule]
    };
    
    setCohorts(cohorts.map(c => {
      const isCohortMatch = 
        (c._id && c._id === cohortId) || 
        (c.id && c.id === cohortId);
      
      return isCohortMatch ? updatedCohort : c;
    }));
  };
  
  const removeLessonSchedule = (cohortId: string, scheduleId: string) => {
    // Find cohort by either _id or id
    const cohort = cohorts.find(c => {
      // Check _id for existing cohorts from backend
      if (c._id && c._id === cohortId) {
        return true;
      }
      // Check id for newly created cohorts
      if (c.id && c.id === cohortId) {
        return true;
      }
      return false;
    });
    
    if (!cohort) return;
    
    const updatedCohort = {
      ...cohort,
      lessonSchedules: cohort.lessonSchedules.filter(schedule => schedule.id !== scheduleId)
    };
    
    // Update cohort by either _id or id
    setCohorts(cohorts.map(c => {
      const isCohortMatch = 
        (c._id && c._id === cohortId) || 
        (c.id && c.id === cohortId);
      
      return isCohortMatch ? updatedCohort : c;
    }));
  };
  
  const updateLessonSchedule = (cohortId: string, scheduleId: string, field: keyof LessonSchedule, value: any) => {
    // Find cohort by either _id or id
    const cohort = cohorts.find(c => {
      // Check _id for existing cohorts from backend
      if (c._id && c._id === cohortId) {
        return true;
      }
      // Check id for newly created cohorts
      if (c.id && c.id === cohortId) {
        return true;
      }
      return false;
    });
    
    if (!cohort) return;
    
    const updatedSchedules = cohort.lessonSchedules.map(schedule => 
      schedule.id === scheduleId ? { ...schedule, [field]: value } : schedule
    );
    
    const updatedCohort = {
      ...cohort,
      lessonSchedules: updatedSchedules
    };
    
    // Update cohort by either _id or id
    setCohorts(cohorts.map(c => {
      const isCohortMatch = 
        (c._id && c._id === cohortId) || 
        (c.id && c.id === cohortId);
      
      return isCohortMatch ? updatedCohort : c;
    }));
  };

  const addTeamMember = () => {
    const newId = Date.now().toString();
    setTeamMembers([...teamMembers, { id: newId, email: "", role: "co-teacher" }]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const updateTeamMember = (id: string, field: "email" | "role", value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleLessonFileChange = (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLessonFileUploads(prev => ({ ...prev, [lessonId]: files }));
  };

  const removeLessonFile = (lessonId: string, fileIndex: number) => {
    setLessonFileUploads(prev => {
      const updatedFiles = [...(prev[lessonId] || [])];
      updatedFiles.splice(fileIndex, 1);
      return { ...prev, [lessonId]: updatedFiles };
    });
  };

  const appendLessonPlan = () => {
    form.setValue("lessonPlans", [...form.getValues().lessonPlans, { id: Date.now().toString() }]);
  };

  const removeLessonPlan = (id: string) => {
    form.setValue("lessonPlans", form.getValues().lessonPlans.filter(lesson => lesson.id !== id));
  };

  const updateLessonPlan = (id: string, field: string, value: string) => {
    form.setValue("lessonPlans", form.getValues().lessonPlans.map(lesson => {
      if (lesson.id === id) {
        return { ...lesson, [field]: value };
      }
      return lesson;
    }));
  };

  // Save lesson plans to the API
  const saveLessonPlans = async () => {
    try {
      // Only proceed if we have a class ID and there are lesson plans
      if (!classId) {
        console.error("Cannot save lesson plans without a class ID");
        return false;
      }

      const formValues = form.getValues();
      const {data: currentClass} = await classService.getById(classId)

      if (!formValues.lessonPlans || formValues.lessonPlans.length === 0) {
        return false;
      }

      setIsSubmitting(true);

      // Format lesson plans according to the backend DTO requirements
      const lessonPlans = formValues.lessonPlans.map((lesson, index) => ({
          title: lesson.title || "",
          description: lesson.description || "",
          duration: Number(lesson.duration) || 60,
          lessonNumber: currentClass.lessonPlans.length + index + 1,
          resourceFiles: lesson.resources ? 
            (typeof lesson.resources === 'string' ? 
              lesson.resources.split(',').map(r => r.trim()) : 
              Array.isArray(lesson.resources) ? lesson.resources : 
              [lesson.resources]) :
            undefined
        }));

      // Update the class with the lesson plans
      const { data, error } = await classService.bulkAddLessonPlan(classId, lessonPlans as any);

      if (error) {
        console.error("Error saving lesson plans:", error);
        return false;
      } else {
        // Update localStorage after successful save
        saveCurrentFormState();

        // Return true but also schedule a page reload after a brief delay
        // This allows the UI to update and show success feedback first
        setTimeout(() => {
          // Reload the entire page to get fresh data from the API
          window.location.reload();
        }, 500);

        return true;
      }
    } catch (err) {
      console.error("Failed to save lesson plans:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue: ClassFormContextType = {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    setIsSubmitting,
    cohorts,
    setCohorts,
    teamMembers,
    setTeamMembers,
    lessonFileUploads,
    setLessonFileUploads,
    classId,
    setClassId,
    lastSaved,
    hasUnsavedChanges,
    isLoadingFromStorage,
    draftExists,

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

    handleLessonFileChange,
    removeLessonFile,
    appendLessonPlan,
    removeLessonPlan,
    updateLessonPlan,
    saveLessonPlans,

    handleNavigateTab,
    calculateNumberOfLessons,
    calculateEndDate,
    checkClassCompleteness,

    // Storage methods
    saveCurrentFormState,
    loadFromStorage,
    clearStoredData,
    loadDraft,
    discardDraft,

    saveBasicInfoAndContinue,

    // Wrap onSubmit to format data properly for backend
    onSubmit: (data: ClassFormValues) => {
      // Format data to match backend DTO requirements
      const formattedData = {
        // Only include teacher field for new classes, not for updates
        ...(classId ? {} : { teacher: userAuth.user?.teacherId || "default_teacher_id" }),
        title: data.title,
        type: data.type,
        subject: data.subject,
        curriculum: data.curriculum || undefined,
        curriculumLevel: data.curriculumLevel || undefined,
        gradeLevel: data.type === "academic" ? data.gradeLevel : undefined,
        ageRange: data.type === "afterschool" ? data.ageRange : undefined,
        description: data.description || undefined,
        numberOfLessons: Number(data.numberOfLessons) || 1,
        isPublic: data.isPublic,
        isPublished: data.isPublished || false,
        status: data.status || "draft",
        enableMultipleCohorts: data.hasCohorts,
        enableTeamTeaching: data.hasTeamTeaching,

        // Format optional fields
        technicalRequirements: data.technicalRequirements ?
          data.technicalRequirements.split('\n')
            .filter(req => req.trim() !== '')
            .map(req => ({ requirement: req.trim() })) :
          undefined,

        materials: data.materialsRequired ?
          data.materialsRequired.split('\n')
            .filter(mat => mat.trim() !== '')
            .map(mat => ({ name: mat.trim() })) :
          undefined,

        commitment: data.commitmentRequired || undefined,

        // Format lesson plans according to the LessonPlanDto
        lessonPlans: data.lessonPlans
          .filter(lesson => lesson.title && lesson.description)
          .map(lesson => ({
            title: lesson.title || "",
            description: lesson.description || "",
            duration: Number(lesson.duration) || 60,
            resourceFiles: lesson.resources ? 
              (typeof lesson.resources === 'string' ? 
                lesson.resources.split(',').map(r => r.trim()) : 
                Array.isArray(lesson.resources) ? lesson.resources : 
                [lesson.resources]) :
              undefined
          })),

        // Format cohorts according to the CohortDto
        cohorts: cohorts.map(cohort => {
          // Extract _id if it exists, and other fields we don't want to send directly
          const { hasFlexibleSchedule, lessonSchedules, ...cohortData } = cohort;
          
          // Remove id field (but keep _id if it exists)
          if (cohortData.id) {
            delete cohortData.id;
          }

          // Convert days of week format if needed
          const daysOfWeek = cohort.repeatSchedule.daysOfWeek.map(day =>
            day.toUpperCase()
          );

          return {
            // Include _id field only if it exists (for existing cohorts)
            ...(cohort._id ? { _id: cohort._id } : {}),
            name: cohortData.name,
            isActive: cohortData.isActive,
            startDate: cohortData.startDate,
            endDate: cohortData.endDate,
            startTime: cohortData.startTime,
            endTime: cohortData.endTime,
            repeatPattern: getApiRepeatPatternValue(cohort.repeatSchedule.pattern),
            daysOfWeek,
            repeatEvery: Number(cohort.repeatSchedule.repeatEvery) || 1, // Ensure repeatEvery is included as a number
            customLessonTimes: hasFlexibleSchedule,
            minimumStudents: cohortData.minStudents,
            maximumStudents: cohortData.maxStudents,
            enrollmentDeadline: cohortData.enrollmentDeadline,
            price: Number(cohortData.price) || 0,
            discount: Number(cohortData.discount) || 0
          };
        }),

        // Format teaching team if enabled
        teachingTeam: data.hasTeamTeaching ?
          teamMembers
            .filter(member => member.email)
            .map(member => member.id) :
          undefined,
      };

      // Call the original onSubmit with formatted data
      onSubmit(formattedData as any);
    }
  };

  return (
    <ClassFormContext.Provider value={contextValue}>
      {children}
    </ClassFormContext.Provider>
  );
};
