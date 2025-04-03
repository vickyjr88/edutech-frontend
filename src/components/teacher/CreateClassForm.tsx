
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Users, ScrollText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Import tab components
import BasicInformationTab from "./class-setup/BasicInformationTab";
import LessonPlansTab from "./class-setup/LessonPlansTab";
import CohortsTab from "./class-setup/CohortsTab";
import TeachingTeamTab from "./class-setup/TeachingTeamTab";

const classSchema = z.object({
  type: z.enum(["academic", "afterschool"]),
  title: z.string().min(3, { message: "Class title must be at least 3 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  curriculum: z.string().optional(),
  gradeLevel: z.string().optional(),
  ageRange: z.string().optional(),
  summary: z.string().min(10, { message: "Class summary must be at least 10 characters" }).max(200, { message: "Class summary must be at most 200 characters" }),
  description: z.string().min(10, { message: "Detailed description must be at least 10 characters" }),
  objectives: z.string().optional(),
  assessmentMethods: z.string().optional(),
  technicalRequirements: z.string().optional(),
  materialsRequired: z.string().optional(),
  commitmentRequired: z.string().optional(),
  methodology: z.string().optional(),
  strategy: z.string().optional(),
  isPublic: z.boolean().default(true),
  hasCohorts: z.boolean().default(false),
  hasTeamTeaching: z.boolean().default(false),
  lessonPlans: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
    resourceUrl: z.string().optional(),
    resourceFiles: z.array(z.any()).optional(),
  })).default([]),
});

export type ClassFormValues = z.infer<typeof classSchema>;

type CreateClassFormProps = {
  onSubmit: (data: ClassFormValues) => void;
  onCancel: () => void;
};

// Extended cohort type with new fields
export type CohortData = {
  id: string;
  name: string; 
  schedule: string;
  scheduleDays: Date[];
  scheduleTime: string;
  price: string;
  siblingDiscount: string;
  friendDiscount: string;
  numberOfLessons: string;
  isActive: boolean;
  students: { id: string; name: string; email: string }[];
};

const CreateClassForm = ({ onSubmit, onCancel }: CreateClassFormProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ id: string; email: string; role: string }[]>([]);
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

  const classType = form.watch("type");
  const hasCohorts = form.watch("hasCohorts");
  const hasTeamTeaching = form.watch("hasTeamTeaching");

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

  const handleSubmitForm = (values: ClassFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(values);
      toast({
        title: "Class created successfully",
        description: "Your new class has been created and is ready for students.",
      });
    }, 1000);
  };

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
      students: []
    }]);
  };

  const removeCohort = (id: string) => {
    setCohorts(cohorts.filter(cohort => cohort.id !== id));
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

  const updateCohort = (id: string, field: keyof CohortData, value: any) => {
    setCohorts(cohorts.map(cohort => 
      cohort.id === id ? { ...cohort, [field]: value } : cohort
    ));
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

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Create a New Class</h3>
        <p className="text-sm text-muted-foreground">
          Set up your class details, schedule, and teaching team
        </p>
      </div>
      <div className="p-6 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lesson Plans
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Cohorts & Students
            </TabsTrigger>
            <TabsTrigger value="teaching" className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              Teaching Team
            </TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitForm)}>
              <TabsContent value="basic">
                <BasicInformationTab 
                  form={form} 
                  onNextTab={() => handleNavigateTab("lessons")} 
                />
              </TabsContent>

              <TabsContent value="lessons">
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
              </TabsContent>

              <TabsContent value="cohorts">
                <CohortsTab 
                  form={form}
                  onPreviousTab={() => handleNavigateTab("lessons")}
                  onNextTab={() => handleNavigateTab("teaching")}
                  cohorts={cohorts}
                  addCohort={addCohort}
                  removeCohort={removeCohort}
                  updateCohort={updateCohort}
                  addStudentToCohort={addStudentToCohort}
                  removeStudentFromCohort={removeStudentFromCohort}
                  updateStudent={updateStudent}
                />
              </TabsContent>

              <TabsContent value="teaching">
                <TeachingTeamTab 
                  form={form}
                  onPreviousTab={() => handleNavigateTab("cohorts")}
                  isSubmitting={isSubmitting}
                  hasTeamTeaching={hasTeamTeaching}
                  teamMembers={teamMembers}
                  addTeamMember={addTeamMember}
                  removeTeamMember={removeTeamMember}
                  updateTeamMember={updateTeamMember}
                />
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateClassForm;
