
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form/form";
import { useForm } from "react-hook-form";
import { CheckCircle, Upload, Eye, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onUpdateAssignment?: (assignmentId: string, data: any) => void;
}

const formSchema = z.object({
  answer: z.string().optional(),
  attachedFile: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AssignmentDialog = ({ isOpen, onClose, assignment, onUpdateAssignment }: AssignmentDialogProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
      attachedFile: null,
    },
  });

  const isEditable = ["in_progress", "late", "upcoming"].includes(assignment?.status);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };
  
  const onSubmit = (values: FormValues) => {
    setUploading(true);
    
    // In a real app, this would handle file upload using Supabase Storage or similar
    setTimeout(() => {
      setUploading(false);
      
      // Call the parent handler with the updated data
      if (onUpdateAssignment) {
        onUpdateAssignment(assignment.id, {
          ...values,
          status: "pending_review",
          submitDate: new Date().toLocaleDateString("en-US", {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          })
        });
      }
      
      toast({
        title: "Assignment Submitted!",
        description: "Your teacher will review your work soon.",
      });
      
      onClose();
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="flex items-center w-fit">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "pending_review":
        return (
          <Badge variant="warning" className="flex items-center w-fit bg-amber-100 text-amber-700">
            <Eye className="h-3 w-3 mr-1" /> Under Review
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="info" className="flex items-center w-fit">
            <FileText className="h-3 w-3 mr-1" /> In Progress
          </Badge>
        );
      case "late":
        return (
          <Badge variant="destructive" className="flex items-center w-fit">
            <FileText className="h-3 w-3 mr-1" /> Late
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center w-fit">
            {status}
          </Badge>
        );
    }
  };

  if (!assignment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{assignment.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(assignment.status)}
            {assignment.type === "group" && (
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 mr-1 text-purple-500" />
                <span className="text-sm">Group ({assignment.groupMembers} members)</span>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-4 my-2">
          {/* Assignment description - in a real app, this would come from the backend */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-1">Assignment Description:</h3>
            <p className="text-sm text-gray-700">
              {assignment.description || "Complete the assigned problem set and show your work. Make sure to include all necessary steps and explanations."}
            </p>
          </div>
          
          {/* Due date info */}
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-gray-500">Due Date:</span>
              <p className="text-sm font-medium">{assignment.dueDate}</p>
            </div>
            
            {assignment.grade && (
              <div>
                <span className="text-xs text-gray-500">Grade:</span>
                <p className="text-sm font-medium">{assignment.grade} ({assignment.score})</p>
              </div>
            )}
          </div>
          
          {/* Teacher feedback for completed assignments */}
          {assignment.status === "completed" && assignment.feedback && (
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="text-sm font-medium mb-1">Teacher Feedback:</h3>
              <p className="text-sm text-gray-700">{assignment.feedback}</p>
            </div>
          )}
          
          {/* Form for submitting assignment */}
          {isEditable && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Answer</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Type your answer here..." 
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="attachedFile"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Attach Files (optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            onChange={(e) => {
                              handleFileChange(e);
                              onChange(e.target.files?.[0] || null);
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      {fileSelected && (
                        <p className="text-xs text-green-600">
                          {fileSelected.name} selected ({Math.round(fileSelected.size/1024)} KB)
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        Submit Assignment
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
          
          {/* View-only for completed/pending_review assignments */}
          {!isEditable && (
            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDialog;
