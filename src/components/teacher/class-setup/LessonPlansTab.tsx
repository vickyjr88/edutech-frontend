
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, Plus, PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormFileUpload } from "@/components/ui/form/file-upload";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "./types";

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
  updateLessonPlan,
}: LessonPlansTabProps) => {
  const lessonPlans = form.watch("lessonPlans");
  const numberOfLessons = form.watch("numberOfLessons");

  // Calculate completion percentage
  const percentComplete = Math.min(100, Math.round((lessonPlans.length / numberOfLessons) * 100));
  
  // Check if we have at least 3 lesson plans
  const minimumLessonsCreated = lessonPlans.length >= 3;
  
  return (
    <div className="space-y-6">
      <Alert variant="info" className="bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertTitle>Create lesson plans</AlertTitle>
        <AlertDescription>
          Add lesson plans for each session of your class. You can upload resources and add links for each lesson.
        </AlertDescription>
      </Alert>
      
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium">Lesson Plans Completion</h3>
            <p className="text-xs text-muted-foreground">
              {lessonPlans.length} of {numberOfLessons} lesson plans created ({percentComplete}% complete)
            </p>
          </div>
          <Badge 
            variant={minimumLessonsCreated ? "success" : "destructive"}
            className={minimumLessonsCreated ? "bg-green-100 text-green-800" : ""}
          >
            {minimumLessonsCreated ? "Minimum requirement met" : "Minimum 3 lessons required"}
          </Badge>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${minimumLessonsCreated ? "bg-green-500" : "bg-amber-500"}`}
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>

      {/* Display lesson plans */}
      <div className="space-y-6">
        {lessonPlans.map((lessonPlan, index) => (
          <Card key={lessonPlan.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive"
              onClick={() => removeLessonPlan(lessonPlan.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-medium">Lesson {index + 1}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`lesson-title-${lessonPlan.id}`}>Lesson Title</Label>
                  <Input
                    id={`lesson-title-${lessonPlan.id}`}
                    value={lessonPlan.title || ""}
                    onChange={(e) => updateLessonPlan(lessonPlan.id, "title", e.target.value)}
                    placeholder="Enter a descriptive title for this lesson"
                  />
                </div>
                <div>
                  <Label htmlFor={`lesson-duration-${lessonPlan.id}`}>Duration</Label>
                  <Input
                    id={`lesson-duration-${lessonPlan.id}`}
                    value={lessonPlan.duration || ""}
                    onChange={(e) => updateLessonPlan(lessonPlan.id, "duration", e.target.value)}
                    placeholder="e.g. 45 minutes, 1 hour, etc."
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`lesson-description-${lessonPlan.id}`}>Description</Label>
                <Textarea
                  id={`lesson-description-${lessonPlan.id}`}
                  value={lessonPlan.description || ""}
                  onChange={(e) => updateLessonPlan(lessonPlan.id, "description", e.target.value)}
                  placeholder="Describe what students will learn in this lesson and the activities they'll complete"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor={`resource-url-${lessonPlan.id}`}>Resource URL</Label>
                <p className="text-xs text-gray-500 mb-1">Add links to external resources like videos, articles, or interactive content</p>
                <Input
                  id={`resource-url-${lessonPlan.id}`}
                  value={lessonPlan.resourceUrl || ""}
                  onChange={(e) => updateLessonPlan(lessonPlan.id, "resourceUrl", e.target.value)}
                  placeholder="https://example.com/resource"
                />
              </div>

              <div>
                <Label>Resource Files</Label>
                <p className="text-xs text-gray-500 mb-1">Upload handouts, slides, worksheets or other materials for this lesson</p>
                <FormFileUpload
                  files={lessonFileUploads[lessonPlan.id] || []}
                  onChange={(e) => handleLessonFileChange(lessonPlan.id, e)}
                  onRemove={(index) => removeLessonFile(lessonPlan.id, index)}
                  multiple
                  acceptedFileTypes="*/*"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={appendLessonPlan}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Lesson Plan
      </Button>

      <Separator className="my-6" />

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onPreviousTab}>
          Previous: Basic Information
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onNextTab}
          disabled={!minimumLessonsCreated}
        >
          Next: Cohorts & Schedule
        </Button>
      </div>
    </div>
  );
};

export default LessonPlansTab;
