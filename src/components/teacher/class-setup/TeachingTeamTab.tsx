
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues, TeamMember } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TeachingTeamTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void; 
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
  onNextTab,
  isSubmitting,
  hasTeamTeaching,
  teamMembers,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
}: TeachingTeamTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <CardHeader className="px-0">
          <CardTitle>Teaching Team</CardTitle>
          <CardDescription>
            Invite other teachers to collaborate on this class. They'll have access to modify the class, create lessons, and communicate with students.
          </CardDescription>
        </CardHeader>

        {hasTeamTeaching ? (
          <>
            {teamMembers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <p className="mb-2 text-muted-foreground">No teaching team members added yet.</p>
                  <Button onClick={addTeamMember} variant="outline" className="mt-2">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Co-Teacher
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div>
                            <p className="text-sm font-medium mb-2">Email Address</p>
                            <Input
                              type="email"
                              value={member.email}
                              onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                              placeholder="colleague@example.com"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Role</p>
                            <Select
                              value={member.role || "co-teacher"}
                              onValueChange={(value) => updateTeamMember(member.id, "role", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="co-teacher">Co-Teacher</SelectItem>
                                <SelectItem value="teaching-assistant">Teaching Assistant</SelectItem>
                                <SelectItem value="guest-lecturer">Guest Lecturer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTeamMember(member.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addTeamMember} variant="outline" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Another Team Member
                </Button>
              </div>
            )}
          </>
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Team teaching is disabled</AlertTitle>
            <AlertDescription>
              Enable team teaching in the basic information tab to invite other teachers to collaborate on this class.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="ghost" onClick={onPreviousTab}>
          Previous: Cohorts & Schedule
        </Button>
        <Button type="button" onClick={onNextTab}>
          Next: Preview
        </Button>
      </div>
    </div>
  );
};

export default TeachingTeamTab;
