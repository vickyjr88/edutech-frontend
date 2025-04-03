
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassFormValues, CohortData, TeamMember, classSchema, LessonSchedule } from "./types";

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
  
  // Helper methods
  addCohort: () => void;
  removeCohort: (id: string) => void;
  updateCohort: (id: string, field: keyof CohortData, value: any) => void;
  addStudentToCohort: (cohortId: string) => void;
  removeStudentFromCohort: (cohortId: string, studentId: string) => void;
  updateStudent: (cohortId: string, studentId: string, field: "name" | "email", value: string) => void;
  
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
  
  handleNavigateTab: (tab: string) => void;
}

const ClassFormContext = createContext<ClassFormContextType | undefined>(undefined);

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
}

export const ClassFormProvider = ({ children, onSubmit }: ClassFormProviderProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lessonFileUploads, setLessonFileUploads] = useState<Record<string, File[]>>({});

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
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
      isPublic: true,
      hasCohorts: false,
      hasTeamTeaching: false,
      lessonPlans: [],
    },
  });

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
  };

  // Cohort methods
  const addCohort = () => {
    const newId = Date.now().toString();
    setCohorts([...cohorts, { 
      id: newId, 
      name: `Cohort ${cohorts.length + 1}`, 
      schedule: "",
      scheduleDays: [],
      scheduleTime: "",
      price: "",
      siblingDiscount: "0",
      friendDiscount: "0",
      numberOfLessons: "8",
      isActive: true,
      students: [],
      lessonSchedules: [],
      hasFlexibleSchedule: false
    }]);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id));
  };

  const updateCohort = (id: string, field: keyof CohortData, value: any) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === id ? { ...cohort, [field]: value } : cohort
    ));
  };

  // Lesson schedule methods
  const addLessonSchedule = (cohortId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;
    
    // Find the next available lesson number
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
    
    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };
  
  const removeLessonSchedule = (cohortId: string, scheduleId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;
    
    const updatedCohort = {
      ...cohort,
      lessonSchedules: cohort.lessonSchedules.filter(schedule => schedule.id !== scheduleId)
    };
    
    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };
  
  const updateLessonSchedule = (cohortId: string, scheduleId: string, field: keyof LessonSchedule, value: any) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;
    
    const updatedSchedules = cohort.lessonSchedules.map(schedule => 
      schedule.id === scheduleId ? { ...schedule, [field]: value } : schedule
    );
    
    const updatedCohort = {
      ...cohort,
      lessonSchedules: updatedSchedules
    };
    
    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  const addStudentToCohort = (cohortId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const newStudent = {
      id: Date.now().toString(),
      name: "",
      email: ""
    };

    const updatedCohort = {
      ...cohort,
      students: [...cohort.students, newStudent]
    };

    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  const removeStudentFromCohort = (cohortId: string, studentId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const updatedCohort = {
      ...cohort,
      students: cohort.students.filter(s => s.id !== studentId)
    };

    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  const updateStudent = (cohortId: string, studentId: string, field: "name" | "email", value: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return;

    const updatedStudents = cohort.students.map(student => 
      student.id === studentId ? { ...student, [field]: value } : student
    );

    const updatedCohort = {
      ...cohort,
      students: updatedStudents
    };

    setCohorts(cohorts.map(c => c.id === cohortId ? updatedCohort : c));
  };

  // Team members methods
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

  // Lesson plan methods
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

  const contextValue = {
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
    
    addCohort,
    removeCohort,
    updateCohort,
    addStudentToCohort,
    removeStudentFromCohort,
    updateStudent,
    
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
    
    handleNavigateTab
  };

  return (
    <ClassFormContext.Provider value={contextValue}>
      {children}
    </ClassFormContext.Provider>
  );
};
