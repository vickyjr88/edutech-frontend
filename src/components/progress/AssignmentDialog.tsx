
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

const AssignmentDialog = ({ isOpen, onClose, assignment, onUpdateAssignment }: AssignmentDialogProps) => {
  const { toast } = useToast();
  
  // Mock data for resources and video links if not provided
  const resources = assignment?.resources || [
    { id: "r1", name: "Assignment Instructions.pdf", type: "pdf", size: "245 KB" },
    { id: "r2", name: "Reference Document.docx", type: "docx", size: "120 KB" },
  ];
  
  const videoLinks = assignment?.videoLinks || [
    { id: "v1", title: "Introduction to the Assignment", url: "https://www.youtube.com/watch?v=example1" },
    { id: "v2", title: "How to Complete Section 2", url: "https://www.youtube.com/watch?v=example2" },
  ];
  
  const isEditable = ["in_progress", "late", "upcoming"].includes(assignment?.status);
  
  const handleUpdateAssignment = (assignmentId: string, updatedData: any) => {
    if (onUpdateAssignment) {
      onUpdateAssignment(assignmentId, updatedData);
    }
    
    toast({
      title: "Assignment Submitted!",
      description: "Your teacher will review your work soon.",
    });
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
