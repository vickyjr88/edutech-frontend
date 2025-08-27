
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form/form";
import { Upload, Link, Star } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormFileUpload } from "@/components/ui/form";
import { 
  Assignment, 
  AssignmentFormValues,
  assignmentFormSchema 
} from "./types";

interface AssignmentSubmissionFormProps {
  assignment: Assignment;
  onClose: () => void;
  onUpdateAssignment?: (assignmentId: string, data: any) => void;
}

export const AssignmentSubmissionForm = ({
  assignment,
  onClose,
  onUpdateAssignment
}: AssignmentSubmissionFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileSelected, setFileSelected] = useState<File | null>(null);

  // Pre-populate form with existing submission data
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      answer: assignment?.submissionContent || "",
      attachedFile: null,
      externalLink: "", // Could be extracted from attachments if it's a link
      difficultyRating: "",
    },
  });

  const handleFilesSelected = (files: File[]) => {
    if (files && files.length > 0) {
      setFileSelected(files[0]);
      form.setValue("attachedFile", files[0]);
    }
  };

  const onSubmit = async (values: AssignmentFormValues) => {
    setUploading(true);
    
    try {
      // Prepare attachments - for now, just handle the file name
      // In a real implementation, you'd upload the file to storage first
      const attachments: string[] = [];
      if (fileSelected) {
        // In real implementation: upload file and get URL
        attachments.push(fileSelected.name); // Placeholder
      }
      
      // Call the parent handler with the updated data
      if (onUpdateAssignment) {
        await onUpdateAssignment(assignment.id, {
          content: values.answer,
          attachments,
          answer: values.answer, // For backward compatibility
          status: "pending_review",
          submitDate: new Date().toLocaleDateString("en-US", {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
          })
        });
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
        <div className="grid grid-cols-1 gap-5">
          {/* Show existing submission info if available */}
          {assignment?.submittedAt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Previous Submission</h4>
              <p className="text-sm text-blue-700 mb-2">
                Submitted: {new Date(assignment.submittedAt).toLocaleDateString()}
              </p>
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div>
                  <p className="text-sm text-blue-700 mb-1">Attachments:</p>
                  <ul className="text-xs text-blue-600">
                    {assignment.attachments.map((attachment: string, index: number) => (
                      <li key={index}>{attachment.split('/').pop()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Answer field */}
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  {assignment?.submissionContent ? "Update Your Notes" : "Your Notes"}
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add any notes or comments about your submission..." 
                    className="min-h-28 resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          {/* Submission options in a grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Upload file */}
            <FormField
              control={form.control}
              name="attachedFile"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Upload Your Assignment</FormLabel>
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
                    <p className="text-xs text-green-600 mt-1">
                      {fileSelected.name} selected ({Math.round(fileSelected.size/1024)} KB)
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              {/* External Link */}
              <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Add Link (Google Doc, etc.)</FormLabel>
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
                    <FormLabel className="text-sm font-medium">Rate Assignment Difficulty</FormLabel>
                    <FormControl>
                      <div className="bg-gray-50 rounded-md border p-3">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex justify-between"
                        >
                          <div className="flex items-center justify-between w-full px-4">
                            <span className="text-xs text-gray-500">Easy</span>
                            <div className="flex space-x-4">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <div key={rating} className="flex flex-col items-center">
                                  <RadioGroupItem value={rating.toString()} id={`r${rating}`} />
                                  <label
                                    htmlFor={`r${rating}`}
                                    className="text-xs mt-1"
                                  >
                                    {rating}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">Hard</span>
                          </div>
                        </RadioGroup>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="pt-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <>Saving...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1" />
                {assignment?.submittedAt ? "Update Submission" : "Submit Assignment"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
