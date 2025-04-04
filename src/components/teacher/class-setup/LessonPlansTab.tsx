
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "./types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Plus, AlertCircle } from "lucide-react";
import { EmptyState } from "./lesson-plans/EmptyState";
import { LessonForm } from "./lesson-plans/LessonForm";
import { FileUploads } from "./lesson-plans/FileUploads";
import { ResourceLinks, ResourceLink } from "./lesson-plans/ResourceLinks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const lessonPlans = form.watch("lessonPlans");
  const numberOfLessons = form.watch("numberOfLessons") || 0;

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
          <AlertTitle>Minimum lesson plans required</AlertTitle>
          <AlertDescription>
            You need to create at least 3 lesson plans before you can publish your class.
          </AlertDescription>
        </Alert>

        {lessonPlans.length === 0 ? (
          <EmptyState onAddLesson={appendLessonPlan} />
        ) : (
          <div className="space-y-6">
            <Accordion type="multiple" defaultValue={[lessonPlans[0]?.id]}>
              {lessonPlans.map((lesson, index) => (
                <AccordionItem key={lesson.id} value={lesson.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>
                        {lesson.title ? (
                          `Lesson ${index + 1}: ${lesson.title}`
                        ) : (
                          `Lesson ${index + 1} (untitled)`
                        )}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border-none shadow-none">
                      <CardContent className="p-0 pt-4">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex-1 min-w-[300px] space-y-6">
                            <LessonForm
                              lesson={lesson}
                              onUpdate={(field, value) => updateLessonPlan(lesson.id, field, value)}
                              onRemove={() => removeLessonPlan(lesson.id)}
                              isRemovable={lessonPlans.length > 1}
                              lessonNumber={index + 1}
                            />
                          </div>
                          <div className="flex-1 min-w-[300px] space-y-6">
                            <FileUploads
                              lessonId={lesson.id}
                              files={lessonFileUploads[lesson.id] || []}
                              onFilesSelected={(lessonId, files) => {
                                // Handle files selected - this is a wrapper around handleLessonFileChange
                                const mockEvent = { 
                                  target: { files: files } 
                                } as unknown as React.ChangeEvent<HTMLInputElement>;
                                handleLessonFileChange(lessonId, mockEvent);
                              }}
                              onFileRemove={removeLessonFile}
                            />
                            
                            <ResourceLinks
                              lessonId={lesson.id}
                              resourceLinks={lesson.resources ? JSON.parse(lesson.resources) : []}
                              onAddResourceLink={(lessonId, title, url) => {
                                const resources = lesson.resources ? JSON.parse(lesson.resources) : [];
                                const newResource = { id: Date.now().toString(), title, url };
                                updateLessonPlan(lessonId, "resources", JSON.stringify([...resources, newResource]));
                              }}
                              onRemoveResourceLink={(lessonId, linkId) => {
                                const resources = lesson.resources ? JSON.parse(lesson.resources) : [];
                                const updatedResources = resources.filter((res: ResourceLink) => res.id !== linkId);
                                updateLessonPlan(lessonId, "resources", JSON.stringify(updatedResources));
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              onClick={appendLessonPlan}
              variant="outline"
              className="w-full"
              disabled={lessonPlans.length >= numberOfLessons}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Lesson
            </Button>

            {lessonPlans.length >= numberOfLessons && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                You've created the maximum number of lessons based on your class settings.
                To add more lessons, increase the "Number of Lessons" in Basic Information.
              </p>
            )}
          </div>
        )}
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
