import React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "./types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EnhancedLessonPlanCreator from "./lesson-plans/EnhancedLessonPlanCreator";

interface LessonPlansTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void;
  lessonFileUploads: Record<string, File[]>;
  handleLessonFileChange: (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLessonFile: (lessonId: string, fileIndex: number) => void;
  appendLessonPlan: () => void;
  removeLessonPlan: (id: string) => void;
  updateLessonPlan: (id: string, field: string, value: string) => void;
  saveLessonPlans?: () => Promise<boolean>;
}

const LessonPlansTab = ({
  form,
  onPreviousTab,
  onNextTab,
  lessonFileUploads,
  handleLessonFileChange,
  removeLessonFile,
  appendLessonPlan,
  removeLessonPlan,
  updateLessonPlan,
  saveLessonPlans
}: LessonPlansTabProps) => {
  const lessonPlans = form.watch("lessonPlans");
  const subject = form.watch("subject");
  const classType = form.watch("type");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <CardHeader className="px-0">
          <CardTitle>Lesson Plans</CardTitle>
          <CardDescription>
            Create detailed lesson plans for your class. Each lesson should have a title, objectives, and a description.
          </CardDescription>
        </CardHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lesson plans required</AlertTitle>
          <AlertDescription>
            You need to create at least 1 lesson plan before you can publish your class.
          </AlertDescription>
        </Alert>

        <EnhancedLessonPlanCreator
          form={form}
          lessonPlans={lessonPlans}
          subject={subject}
          classType={classType}
          appendLessonPlan={appendLessonPlan}
          removeLessonPlan={removeLessonPlan}
          updateLessonPlan={updateLessonPlan}
          saveLessonPlans={saveLessonPlans}
          lessonFileUploads={lessonFileUploads}
          handleLessonFileChange={handleLessonFileChange}
          removeLessonFile={removeLessonFile}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onPreviousTab}>
          Previous: Basic Information
        </Button>
        <Button type="button" variant="outline" onClick={onNextTab}>
          Next: Cohorts & Schedule
        </Button>
      </div>
    </div>
  );
};

export default LessonPlansTab;