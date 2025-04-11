
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form/form";
import { useForm } from "react-hook-form";
import { CheckCircle, Upload, Eye, FileText, Users, Download, Link, Video, Star, File, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormFileUpload } from "@/components/ui/form";

interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
  onUpdateAssignment?: (assignmentId: string, data: any) => void;
}

const formSchema = z.object({
  answer: z.string().optional(),
  attachedFile: z.any().optional(),
  externalLink: z.string().optional(),
  difficultyRating: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AssignmentDialog = ({ isOpen, onClose, assignment, onUpdateAssignment }: AssignmentDialogProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  
  // Mock data for resources and video links
  const resources = assignment?.resources || [
    { id: "r1", name: "Assignment Instructions.pdf", type: "pdf", size: "245 KB" },
    { id: "r2", name: "Reference Document.docx", type: "docx", size: "120 KB" },
  ];
  
  const videoLinks = assignment?.videoLinks || [
    { id: "v1", title: "Introduction to the Assignment", url: "https://www.youtube.com/watch?v=example1" },
    { id: "v2", title: "How to Complete Section 2", url: "https://www.youtube.com/watch?v=example2" },
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer: "",
      attachedFile: null,
      externalLink: "",
      difficultyRating: "",
    },
  });

  const isEditable = ["in_progress", "late", "upcoming"].includes(assignment?.status);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileSelected(e.target.files[0]);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files && files.length > 0) {
      setFileSelected(files[0]);
      form.setValue("attachedFile", files[0]);
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
      <DialogContent className="sm:max-w-md md:max-w-2xl lg:max-w-3xl h-[90vh] max-h-[90vh] flex flex-col p-0">
        <div className="overflow-y-auto flex-1">
          <DialogHeader className="p-6 pb-2 sticky top-0 bg-background z-10">
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
          
          <div className="p-6 pt-0 space-y-4">
            {/* Assignment context - class and lesson info */}
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                <div>
                  <span className="font-medium">Class:</span>{" "}
                  <span>{assignment.course || "Math Fundamentals"}</span>
                </div>
                <div>
                  <span className="font-medium">Lesson:</span>{" "}
                  <span>{assignment.lesson || "Week 3: Algebraic Expressions"}</span>
                </div>
              </div>
            </div>
            
            {/* Assignment description */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-1">Assignment Description:</h3>
              <p className="text-sm text-gray-700">
                {assignment.description || "Complete the assigned problem set and show your work. Make sure to include all necessary steps and explanations."}
              </p>
            </div>
            
            {/* Resources/Materials Section in two columns */}
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-3">Resources & Materials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Downloadable resources */}
                {resources.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Documents</h4>
                    <div className="space-y-2">
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                          <div className="flex items-center">
                            <File className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm">{resource.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500">{resource.size}</span>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Column 2: Video links */}
                {videoLinks.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase text-gray-500 font-medium mb-2">Video Resources</h4>
                    <div className="space-y-2">
                      {videoLinks.map((video) => (
                        <div key={video.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
                          <div className="flex items-center">
                            <Video className="h-4 w-4 text-red-500 mr-2" />
                            <span className="text-sm">{video.title}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center"
                            onClick={() => window.open(video.url, '_blank')}
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            Watch
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                  {/* Form fields in two columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-4">
                      {/* Answer field */}
                      <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Notes (optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add any notes or comments about your submission..." 
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {/* File upload */}
                      <FormField
                        control={form.control}
                        name="attachedFile"
                        render={({ field: { value, onChange, ...field } }) => (
                          <FormItem>
                            <FormLabel>Upload Your Assignment</FormLabel>
                            <FormControl>
                              <FormFileUpload
                                label="Upload Assignment File"
                                description="PDF, Word, Excel, PowerPoint, or images"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                                onFilesSelected={handleFilesSelected}
                                {...field}
                              />
                            </FormControl>
                            {fileSelected && (
                              <p className="text-xs text-green-600">
                                {fileSelected.name} selected ({Math.round(fileSelected.size/1024)} KB)
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Column 2 */}
                    <div className="space-y-4">
                      {/* External Link */}
                      <FormField
                        control={form.control}
                        name="externalLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Or Add Link (Google Doc, etc.)</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <div className="bg-gray-100 p-2 rounded-l-md">
                                  <Link className="h-4 w-4 text-gray-500" />
                                </div>
                                <Input
                                  placeholder="https://docs.google.com/..."
                                  className="rounded-l-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Difficulty Rating */}
                      <FormField
                        control={form.control}
                        name="difficultyRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rate Assignment Difficulty</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-1"
                              >
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <div key={rating} className="flex flex-col items-center">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value={rating.toString()} id={`r${rating}`} />
                                    </div>
                                    <label
                                      htmlFor={`r${rating}`}
                                      className="text-xs mt-1"
                                    >
                                      {rating}
                                    </label>
                                  </div>
                                ))}
                                <div className="flex items-center space-x-2 text-xs text-gray-500 ml-2">
                                  <span>Easy</span>
                                  <span className="ml-24">Hard</span>
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="px-6 pb-6">
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
