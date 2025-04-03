import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CohortData, TeamMember } from "./types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight, Clock, Calendar, Users, Book, BookOpen, User } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PreviewTabProps {
  form: UseFormReturn<any>;
  onPreviousTab: () => void;
  isSubmitting: boolean;
  cohorts: CohortData[];
  teamMembers: TeamMember[];
  checkClassCompleteness: () => { 
    isComplete: boolean; 
    basicInfoComplete: boolean; 
    hasMinLessonPlans: boolean; 
    hasMinCohorts: boolean;
    missingItems: string[];
  };
}

const PreviewTab = ({ 
  form, 
  onPreviousTab, 
  isSubmitting, 
  cohorts, 
  teamMembers, 
  checkClassCompleteness 
}: PreviewTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [publishRequiresApproval, setPublishRequiresApproval] = useState(true);
  const [isPublic, setIsPublic] = useState(form.getValues().isPublic);
  
  const formValues = form.getValues();
  const completenessCheck = checkClassCompleteness();
  
  const handlePublish = () => {
    if (!completenessCheck.isComplete) {
      toast({
        title: "Cannot publish class",
        description: "Please complete all required information before publishing.",
        variant: "destructive"
      });
      return;
    }
    
    // Update the form with final values
    form.setValue("isPublic", isPublic);
    
    // If form submission happens in parent component via form.handleSubmit
    if (publishRequiresApproval) {
      toast({
        title: "Approval requested",
        description: "Your class has been submitted for approval and will be published once reviewed.",
      });
    } else {
      toast({
        title: "Class published",
        description: "Your class has been published successfully and is now available for enrollment.",
      });
    }
    
    // Let the parent know to handle the form submission
    form.handleSubmit(() => {})();
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Class Preview and Publish</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="isPublic" 
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="isPublic">Publish class</Label>
          </div>
        </div>
      </div>
      
      {/* Completeness check alert */}
      {!completenessCheck.isComplete ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Your class is not ready to publish</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Please complete the following required items:</p>
            <ul className="list-disc pl-5 space-y-1">
              {completenessCheck.missingItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Your class is ready to publish</AlertTitle>
          <AlertDescription className="text-green-700">
            All required information has been provided. You can now publish your class.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Class preview */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{formValues.title || "Class Title"}</CardTitle>
              <CardDescription>
                {formValues.type === "academic" ? "Academic" : "After School"} - {formValues.subject || "Subject"}
              </CardDescription>
            </div>
            <Badge variant={isPublic ? "default" : "outline"}>
              {isPublic ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic info */}
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p>{formValues.type === "academic" ? "Academic" : "After School"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p>{formValues.subject || "Not specified"}</p>
              </div>
              {formValues.type === "academic" ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Grade Level</p>
                  <p>{formValues.gradeLevel || "Not specified"}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Age Range</p>
                  <p>{formValues.ageRange || "Not specified"}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Lessons</p>
                <p>{formValues.numberOfLessons}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="mt-1">{formValues.description || "No description provided."}</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Lesson plans */}
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-muted-foreground" /> Lesson Plans
            </h3>
            <div className="space-y-4">
              {formValues.lessonPlans.length === 0 ? (
                <p className="text-muted-foreground italic">No lesson plans created yet.</p>
              ) : (
                <div className="space-y-2">
                  {formValues.lessonPlans.slice(0, 3).map((lesson: any, index: number) => (
                    <div key={lesson.id} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{lesson.title || `Lesson ${index + 1}`}</p>
                          {lesson.duration && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {lesson.duration}
                            </p>
                          )}
                        </div>
                      </div>
                      {lesson.description && (
                        <p className="text-sm mt-2 line-clamp-2">{lesson.description}</p>
                      )}
                    </div>
                  ))}
                  
                  {formValues.lessonPlans.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      + {formValues.lessonPlans.length - 3} more lessons
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Cohorts */}
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" /> Cohorts
            </h3>
            <div className="space-y-4">
              {cohorts.length === 0 ? (
                <p className="text-muted-foreground italic">No cohorts created yet.</p>
              ) : (
                <div className="space-y-3">
                  {cohorts.slice(0, 2).map((cohort) => (
                    <div key={cohort.id} className="border rounded-md p-3">
                      <p className="font-medium">{cohort.name}</p>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                        {cohort.startDate && (
                          <p className="text-sm flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Starts: {format(new Date(cohort.startDate), 'MMM d, yyyy')}
                          </p>
                        )}
                        
                        {cohort.repeatSchedule && (
                          <p className="text-sm">
                            Schedule: {cohort.repeatSchedule.pattern === 'custom' 
                              ? cohort.repeatSchedule.daysOfWeek.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
                              : cohort.repeatSchedule.pattern.replace('-', ' ')}
                          </p>
                        )}
                        
                        {cohort.startTime && cohort.endTime && (
                          <p className="text-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {cohort.startTime} - {cohort.endTime}
                          </p>
                        )}
                        
                        <p className="text-sm">
                          Capacity: {cohort.minStudents} - {cohort.maxStudents} students
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {cohorts.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      + {cohorts.length - 2} more cohorts
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Team teaching */}
          {formValues.hasTeamTeaching && teamMembers.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" /> Teaching Team
                </h3>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {member.role}
                      </Badge>
                      <span>{member.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Navigation footer */}
      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPreviousTab}
          type="button"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        
        <Button
          onClick={handlePublish}
          disabled={isSubmitting || !completenessCheck.isComplete}
          type="button"
          className="flex items-center gap-2"
        >
          {isSubmitting ? 'Publishing...' : (publishRequiresApproval ? 'Request Review' : 'Publish Now')}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;
