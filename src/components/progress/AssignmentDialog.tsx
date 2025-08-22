
import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AssignmentHeader } from "./assignment-dialog/AssignmentHeader";
import { AssignmentContext } from "./assignment-dialog/AssignmentContext";
import { AssignmentDescription } from "./assignment-dialog/AssignmentDescription";
import { ResourcesMaterials } from "./assignment-dialog/ResourcesMaterials";
import { AssignmentMetadata } from "./assignment-dialog/AssignmentMetadata";
import { TeacherFeedback } from "./assignment-dialog/TeacherFeedback";
import { AssignmentSubmissionForm } from "./assignment-dialog/AssignmentSubmissionForm";
import { Assignment, AssignmentDialogProps } from "./assignment-dialog/types";
import { useSubmitAssignment, useUpdateSubmission } from "@/hooks/use-assignment-service";

const AssignmentDialog = ({ isOpen, onClose, assignment, onUpdateAssignment }: AssignmentDialogProps) => {
  const { toast } = useToast();
  const submitAssignmentMutation = useSubmitAssignment();
  const updateSubmissionMutation = useUpdateSubmission();
  
  // Extract real resources from assignment data
  const resources = assignment?.attachments?.map((attachment: string, index: number) => ({
    id: `attachment_${index}`,
    name: attachment.split('/').pop() || `Resource ${index + 1}`,
    type: attachment.split('.').pop()?.toLowerCase() || 'file',
    size: "Unknown size", // API doesn't provide file sizes
    url: attachment
  })) || assignment?.resources || [];
  
  // For now, no video links in the API, so we'll show empty or allow them to be added later
  const videoLinks = assignment?.videoLinks || [];
  
  const isEditable = ["in_progress", "late", "upcoming", "not-started"].includes(assignment?.status);
  
  const handleUpdateAssignment = async (assignmentId: string, updatedData: any) => {
    if (!assignment?.assignmentId) return;
    
    try {
      if (assignment.submissionStatus === 'Not Started' || !assignment.submittedAt) {
        // Initial submission
        await submitAssignmentMutation.mutateAsync({
          assignmentId: assignment.assignmentId,
          content: updatedData.answer || updatedData.content || "",
          attachments: updatedData.attachments || []
        });
        
        toast({
          title: "Assignment Submitted!",
          description: "Your assignment has been submitted successfully.",
        });
      } else {
        // Update existing submission
        await updateSubmissionMutation.mutateAsync({
          studentAssignmentId: assignment.studentAssignmentId || assignment.id,
          data: {
            assignmentId: assignment.assignmentId,
            content: updatedData.answer || updatedData.content || "",
            attachments: updatedData.attachments || []
          }
        });
        
        toast({
          title: "Assignment Updated!",
          description: "Your assignment has been updated successfully.",
        });
      }
      
      // Call the parent callback
      if (onUpdateAssignment) {
        onUpdateAssignment(assignmentId, updatedData);
      }
      
      // Close dialog after successful submission
      onClose();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!assignment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-3xl h-[90vh] max-h-[90vh] flex flex-col p-0">
        <div className="overflow-y-auto flex-1">
          {/* Assignment Header */}
          <AssignmentHeader assignment={assignment} />
          
          <div className="p-6 pt-0 space-y-4">
            {/* Assignment Context - Class and lesson info */}
            <AssignmentContext assignment={assignment} />
            
            {/* Assignment Description */}
            <AssignmentDescription assignment={assignment} />
            
            {/* Resources/Materials Section */}
            <ResourcesMaterials resources={resources} videoLinks={videoLinks} />
            
            {/* Due date info */}
            <AssignmentMetadata assignment={assignment} />
            
            {/* Teacher feedback for completed assignments */}
            <TeacherFeedback assignment={assignment} />
            
            {/* Form for submitting assignment */}
            {isEditable ? (
              <AssignmentSubmissionForm 
                assignment={assignment}
                onClose={onClose}
                onUpdateAssignment={handleUpdateAssignment}
              />
            ) : (
              <DialogFooter className="px-6 pb-6">
                <Button onClick={onClose}>Close</Button>
              </DialogFooter>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
