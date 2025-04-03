
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, BookOpen, Link, FileUp, PlusCircle, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "../CreateClassForm";

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
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800">Lesson Plans</h3>
        <p className="text-xs text-blue-700 mt-1">
          Add lesson plans to organize your teaching curriculum and share with students.
        </p>
      </div>

      {form.watch("lessonPlans").length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new lesson plan</p>
          <Button
            type="button" 
            onClick={appendLessonPlan}
            className="mt-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Lesson
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {form.watch("lessonPlans").map((lesson, index) => (
            <div key={lesson.id} className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Lesson {index + 1}</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeLessonPlan(lesson.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`lesson-title-${lesson.id}`}>Title</Label>
                  <Input 
                    id={`lesson-title-${lesson.id}`}
                    placeholder="Enter lesson title"
                    value={lesson.title || ""}
                    onChange={(e) => updateLessonPlan(lesson.id, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lesson-duration-${lesson.id}`}>Duration</Label>
                  <Input 
                    id={`lesson-duration-${lesson.id}`}
                    placeholder="Enter lesson duration"
                    value={lesson.duration || ""}
                    onChange={(e) => updateLessonPlan(lesson.id, "duration", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lesson-description-${lesson.id}`}>Description</Label>
                <Textarea 
                  id={`lesson-description-${lesson.id}`}
                  placeholder="Enter lesson description"
                  className="resize-none"
                  value={lesson.description || ""}
                  onChange={(e) => updateLessonPlan(lesson.id, "description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lesson-resource-${lesson.id}`}>Resource URL</Label>
                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id={`lesson-resource-${lesson.id}`}
                    placeholder="Enter resource URL"
                    type="url"
                    value={lesson.resourceUrl || ""}
                    onChange={(e) => updateLessonPlan(lesson.id, "resourceUrl", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lesson-files-${lesson.id}`}>Resource Files</Label>
                <div className="flex items-center space-x-2">
                  <FileUp className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="file"
                    id={`lesson-files-${lesson.id}`}
                    multiple
                    onChange={(e) => handleLessonFileChange(lesson.id, e)}
                    className="hidden"
                  />
                  <Label htmlFor={`lesson-files-${lesson.id}`} className="cursor-pointer bg-secondary text-secondary-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary/80">
                    Upload Files
                  </Label>
                </div>
                {lessonFileUploads[lesson.id] && lessonFileUploads[lesson.id].length > 0 && (
                  <div className="mt-2 space-y-1">
                    {lessonFileUploads[lesson.id].map((file, fileIndex) => (
                      <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-800">{file.name}</p>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeLessonFile(lesson.id, fileIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
