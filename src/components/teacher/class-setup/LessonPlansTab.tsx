
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "../CreateClassForm";
import { ResourceLink } from "./lesson-plans/ResourceLinks";
import { LessonForm } from "./lesson-plans/LessonForm";
import { EmptyState } from "./lesson-plans/EmptyState";

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
  updateLessonPlan
}: LessonPlansTabProps) => {
  const [resourceLinks, setResourceLinks] = useState<Record<string, ResourceLink[]>>({});

  const handleAddResourceLink = (lessonId: string, title: string, url: string) => {
    const newLink = {
      id: Date.now().toString(),
      url: url,
      title: title
    };

    const updatedLinks = {
      ...resourceLinks,
      [lessonId]: [...(resourceLinks[lessonId] || []), newLink]
    };

    setResourceLinks(updatedLinks);
  };

  const handleRemoveResourceLink = (lessonId: string, linkId: string) => {
    if (!resourceLinks[lessonId]) return;

    const updatedLinks = {
      ...resourceLinks,
      [lessonId]: resourceLinks[lessonId].filter(link => link.id !== linkId)
    };

    setResourceLinks(updatedLinks);
  };

  const handleFilesSelected = (lessonId: string, files: File[]) => {
    const event = {
      target: {
        files: files
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleLessonFileChange(lessonId, event);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800">Lesson Plans</h3>
        <p className="text-xs text-blue-700 mt-1">
          Add lesson plans to organize your teaching curriculum and share with students.
        </p>
      </div>

      {form.watch("lessonPlans").length === 0 ? (
        <EmptyState onAddLesson={appendLessonPlan} />
      ) : (
        <div className="space-y-4">
          {form.watch("lessonPlans").map((lesson, index) => (
            <LessonForm
              key={lesson.id}
              lesson={lesson}
              lessonIndex={index}
              files={lessonFileUploads[lesson.id] || []}
              resourceLinks={resourceLinks[lesson.id] || []}
              onLessonUpdate={updateLessonPlan}
              onLessonRemove={removeLessonPlan}
              onFilesSelected={handleFilesSelected}
              onFileRemove={removeLessonFile}
              onAddResourceLink={handleAddResourceLink}
              onRemoveResourceLink={handleRemoveResourceLink}
            />
          ))}
          <Button
            type="button" 
            variant="outline" 
            onClick={appendLessonPlan}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Lesson
          </Button>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPreviousTab}>
          Back: Basic Information
        </Button>
        <Button type="button" variant="outline" onClick={onNextTab}>
          Next: Cohorts & Students
        </Button>
      </div>
    </div>
  );
};

export default LessonPlansTab;
