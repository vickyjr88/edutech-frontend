import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormFileUpload } from '@/components/ui/form/file-upload';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import { ExtractedCourseData, CourseUploadResponse } from '@/types/course-data';
import { CourseImportDialog } from './CourseImportDialog';
import { toast } from 'sonner';

interface CourseImportTriggerProps {
  onImport: (extractedData: ExtractedCourseData) => void;
  className?: string;
  variant?: 'card' | 'button' | 'compact';
}

export const CourseImportTrigger: React.FC<CourseImportTriggerProps> = ({
  onImport,
  className = '',
  variant = 'card'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedCourseData | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or Word document.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Call the upload-and-process endpoint
      const response = await fetch('/api/course-outline/upload-and-process', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let the browser set it with boundary for FormData
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result: CourseUploadResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to process course outline');
      }

      // Set extracted data and show import dialog
      setExtractedData(result.data.extractedData);
      setShowImportDialog(true);

      toast.success('Course outline processed successfully!', {
        description: `Found ${result.data.extractedData.lessonPlans.length} lessons and ${result.data.extractedData.objectives.length} objectives.`
      });

    } catch (error) {
      console.error('Error uploading course outline:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload course outline');
      toast.error('Upload failed', {
        description: 'There was an error processing your course outline. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportConfirm = (selectedSections: string[]) => {
    if (extractedData) {
      onImport(extractedData);
      setShowImportDialog(false);
      setExtractedData(null);
      toast.success('Course data imported successfully!', {
        description: 'Your form has been populated with the extracted course information.'
      });
    }
  };

  if (variant === 'button') {
    return (
      <>
        <Button
          variant="outline"
          className={`border-dashed border-2 hover:border-green-400 hover:bg-green-50 ${className}`}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              AI Analyzing & Structuring...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Import Course Outline
            </>
          )}
        </Button>

        <CourseImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          extractedData={extractedData}
          onImport={handleImportConfirm}
          isImporting={false}
        />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-400 transition-colors">
          <FormFileUpload
            onFileChange={(e) => {
              const files = Array.from(e.target.files || []);
              handleFileUpload(files);
            }}
            acceptedFileTypes={['.pdf', '.doc', '.docx']}
            maxFileSize={10}
            uploadInstructions="Upload your course outline to auto-populate the form"
            multiple={false}
            disabled={isUploading}
          />
          
          {isUploading && (
            <div className="flex items-center justify-center mt-3 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              🤖 AI is extracting lessons, objectives, and materials for you...
            </div>
          )}
        </div>

        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <CourseImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          extractedData={extractedData}
          onImport={handleImportConfirm}
          isImporting={false}
        />
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="border-dashed border-2 border-gray-300 hover:border-green-400 transition-colors">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-lg">Import Course Outline</CardTitle>
          <CardDescription>
            Upload your existing course outline to automatically populate the form with lessons, objectives, and materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormFileUpload
            onFileChange={(e) => {
              const files = Array.from(e.target.files || []);
              handleFileUpload(files);
            }}
            acceptedFileTypes={['.pdf', '.doc', '.docx']}
            maxFileSize={10}
            uploadInstructions="Upload PDF or Word document"
            multiple={false}
            disabled={isUploading}
          />
          
          {isUploading && (
            <div className="flex items-center justify-center py-4 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              🤖 AI is analyzing your course outline and creating structured lesson plans...
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <CheckCircle className="h-3 w-3" />
            <span>Supports PDF and Word documents up to 10MB</span>
          </div>
        </CardContent>
      </Card>

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <CourseImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        extractedData={extractedData}
        onImport={handleImportConfirm}
        isImporting={false}
      />
    </div>
  );
};