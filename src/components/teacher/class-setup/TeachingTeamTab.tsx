
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, Plus, Trash2, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues, TeamMember } from "./types";

interface TeachingTeamTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  isSubmitting: boolean;
  hasTeamTeaching: boolean;
  teamMembers: TeamMember[];
  addTeamMember: () => void;
  removeTeamMember: (id: string) => void;
  updateTeamMember: (id: string, field: "email" | "role", value: string) => void;
}

const TeachingTeamTab = ({
  form,
  onPreviousTab,
  isSubmitting,
  hasTeamTeaching,
  teamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
}: TeachingTeamTabProps) => {
  const { toast } = useToast();
  const lessonPlans = form.watch("lessonPlans");
  const numberOfLessons = form.watch("numberOfLessons");
  
  // Check if we have at least 3 lesson plans
  const hasMinimumLessons = lessonPlans.length >= 3;

  const validateAndSubmit = () => {
    if (!hasMinimumLessons) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "You must create at least 3 lesson plans before submitting the class.",
      });
      return;
    }
    
    form.handleSubmit((data) => {
      // Form submission is handled in the parent component
    })();
  };

  return (
    <div className="space-y-6">
      {hasTeamTeaching ? (
        <>
          <Alert variant="info" className="bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertTitle>Team Teaching</AlertTitle>
            <AlertDescription>
              Add co-teachers to collaborate on this class. You can invite colleagues by email.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor={`email-${member.id}`}>Email Address</Label>
                      <Input
                        id={`email-${member.id}`}
                        value={member.email}
                        onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                        placeholder="Enter colleague's email"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`role-${member.id}`}>Role</Label>
                        <Select
                          value={member.role}
                          onValueChange={(value) => updateTeamMember(member.id, "role", value)}
                        >
                          <SelectTrigger id={`role-${member.id}`}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="co-teacher">Co-Teacher</SelectItem>
                            <SelectItem value="assistant">Teaching Assistant</SelectItem>
                            <SelectItem value="observer">Observer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mb-0.5 text-destructive"
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addTeamMember}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>

          <Separator className="my-6" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/20">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Team Teaching Disabled</h3>
          <p className="text-center text-muted-foreground mb-4">
            You're currently set to teach this class by yourself. You can enable team teaching in the Basic Information tab.
          </p>
        </div>
      )}

      {!hasMinimumLessons && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Minimum Lesson Plans Required</AlertTitle>
          <AlertDescription>
            You must create at least 3 lesson plans before you can submit this class.
            Currently you have {lessonPlans.length} of {numberOfLessons} lessons planned.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPreviousTab}>
          Previous: Cohorts & Schedule
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !hasMinimumLessons}
          onClick={validateAndSubmit}
        >
          {isSubmitting ? "Creating Class..." : "Create Class"}
        </Button>
      </div>
    </div>
  );
};

export default TeachingTeamTab;
