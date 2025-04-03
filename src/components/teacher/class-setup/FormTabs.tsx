
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, Users, ScrollText } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useClassForm } from "./ClassFormContext";

// Import tab components
import BasicInformationTab from "./BasicInformationTab";
import LessonPlansTab from "./LessonPlansTab";
import CohortsTab from "./CohortsTab";
import TeachingTeamTab from "./TeachingTeamTab";

interface FormTabsProps {
  onSubmit: (values: any) => void;
}

const FormTabs = ({ onSubmit }: FormTabsProps) => {
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
    addStudentToCohort,
    removeStudentFromCohort,
    updateStudent,
    
    addLessonSchedule,
    removeLessonSchedule,
    updateLessonSchedule,
    
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    calculateNumberOfLessons
  } = useClassForm();

  const hasTeamTeaching = form.watch("hasTeamTeaching");

  return (
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
          Cohorts & Schedule
        </TabsTrigger>
        <TabsTrigger value="teaching" className="flex items-center gap-2">
          <ScrollText className="h-4 w-4" />
          Teaching Team
        </TabsTrigger>
      </TabsList>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
              addLessonSchedule={addLessonSchedule}
              removeLessonSchedule={removeLessonSchedule}
              updateLessonSchedule={updateLessonSchedule}
              calculateNumberOfLessons={calculateNumberOfLessons}
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
  );
};

export default FormTabs;
