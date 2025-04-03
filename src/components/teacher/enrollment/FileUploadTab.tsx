
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormFileUpload } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Download, FileSpreadsheet, Upload, Check, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploadTabProps {
  classId?: string;
}

const FileUploadTab = ({ classId }: FileUploadTabProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<null | 'success' | 'error'>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    // Check file type - only allow CSV, XLS, XLSX
    const validFiles = selectedFiles.filter(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return ['csv', 'xls', 'xlsx'].includes(extension || '');
    });

    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only CSV, XLS, and XLSX files are supported.",
        variant: "destructive"
      });
    }

    setFiles(validFiles);
    setUploadStatus(null);
    setErrors([]);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);
    
    // Simulate API call with random success/error
    setTimeout(() => {
      setIsLoading(false);
      
      // Randomly succeed or show validation errors (for demo purposes)
      const randomSuccess = Math.random() > 0.3;
      
      if (randomSuccess) {
        setUploadStatus('success');
        toast({
          title: "File processed successfully",
          description: "The student data has been processed and invitations will be sent.",
        });
      } else {
        setUploadStatus('error');
        setErrors([
          "Row 3: Invalid email format for 'johndoe@'",
          "Row 5: Missing required field 'First Name'",
          "Row 8: Duplicate email address"
        ]);
        toast({
          title: "Validation errors found",
          description: "Please fix the errors in your file and try again.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template downloaded",
      description: "The CSV template has been downloaded to your device.",
    });
    // In a real app, this would trigger a file download
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Bulk Upload Students</CardTitle>
            <CardDescription>
              Upload a spreadsheet with student information to invite in bulk
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileSpreadsheet className="h-3 w-3" />
            CSV/Excel Upload
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Required Format</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 flex items-center gap-1 text-xs"
              onClick={handleDownloadTemplate}
            >
              <Download className="h-3 w-3" />
              Download Template
            </Button>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Your CSV or Excel file should have the following columns:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="font-medium">First Name</span>
              <span className="text-gray-400 ml-1">(Required)</span>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="font-medium">Last Name</span>
              <span className="text-gray-400 ml-1">(Required)</span>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="font-medium">Email</span>
              <span className="text-gray-400 ml-1">(Required)</span>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="font-medium">Phone</span>
              <span className="text-gray-400 ml-1">(Optional)</span>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="font-medium">Parent Name</span>
              <span className="text-gray-400 ml-1">(Optional)</span>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200">
              <span className="font-medium">Parent Email</span>
              <span className="text-gray-400 ml-1">(Optional)</span>
            </div>
          </div>
        </div>
        
        <FormFileUpload
          accept=".csv,.xls,.xlsx"
          onFilesSelected={handleFilesSelected}
          label="Upload Student List"
          description="Drag and drop your CSV or Excel file, or click to browse"
          icon={<Upload className="h-10 w-10 text-gray-400" />}
          files={files}
          acceptedFileTypes=".csv,.xls,.xlsx"
        />
        
        {files.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{files[0].name}</p>
                <p className="text-xs text-gray-500">
                  {(files[0].size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setFiles([])}
            >
              Remove
            </Button>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Upload Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              Your file has been processed successfully. Invitations will be sent to the students.
            </AlertDescription>
          </Alert>
        )}
        
        {uploadStatus === 'error' && errors.length > 0 && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Validation Errors</AlertTitle>
            <AlertDescription>
              <p className="text-red-700 mb-2">
                Please fix the following errors in your file:
              </p>
              <ul className="text-red-700 text-sm list-disc pl-5 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          onClick={handleUpload} 
          disabled={isLoading || files.length === 0}
          className="ml-auto flex items-center gap-2"
        >
          {isLoading ? 'Processing...' : 'Process File'}
          {isLoading ? <div className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploadTab;
