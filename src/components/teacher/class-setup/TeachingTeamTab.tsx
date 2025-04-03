
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollText, UserPlus, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "../CreateClassForm";

interface TeachingTeamTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  isSubmitting: boolean;
  hasTeamTeaching: boolean;
  teamMembers: { id: string; email: string; role: string }[];
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
  updateTeamMember
}: TeachingTeamTabProps) => {
  return (
    <div className="space-y-6">
      {hasTeamTeaching ? (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800">Team Teaching Enabled</h3>
            <p className="text-xs text-blue-700 mt-1">
              Add other teachers to collaborate on this class. Each team member will have access to the class materials and students.
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <ScrollText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No team members yet</h3>
              <p className="mt-1 text-sm text-gray-500">Add teachers to collaborate on this class</p>
              <Button
                type="button" 
                onClick={addTeamMember}
                className="mt-4"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border rounded-md p-3">
                  <div className="md:col-span-2">
                    <Label htmlFor={`member-email-${member.id}`} className="sr-only">Email</Label>
                    <Input
                      id={`member-email-${member.id}`}
                      placeholder="Team member email"
                      type="email"
                      value={member.email}
                      onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`member-role-${member.id}`} className="sr-only">Role</Label>
                    <Select
                      value={member.role}
                      onValueChange={(value) => updateTeamMember(member.id, "role", value)}
                    >
                      <SelectTrigger id={`member-role-${member.id}`}>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="co-teacher">Co-Teacher</SelectItem>
                        <SelectItem value="assistant">Teaching Assistant</SelectItem>
                        <SelectItem value="guest">Guest Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(member.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button" 
                variant="outline"
                onClick={addTeamMember}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Another Team Member
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800">Team Teaching Disabled</h3>
          <p className="text-xs text-yellow-700 mt-1">
            Enable team teaching in the Basic Information tab to add other teachers to this class.
          </p>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPreviousTab}>
          Back: Cohorts & Students
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Class...' : 'Create Class'}
        </Button>
      </div>
    </div>
  );
};

export default TeachingTeamTab;
