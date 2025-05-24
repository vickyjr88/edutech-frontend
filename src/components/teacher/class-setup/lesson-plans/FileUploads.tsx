
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormFileUpload } from "@/components/ui/form";
import { FileImage, FileVideo, FileText, Files, Trash2, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

export interface UploadedResource {
  id: string;
  filename: string;
  originalFile?: File;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed';
  uploadError?: string;
}

export interface FileUploadsProps {
  lessonId: string;
  classId?: string;
  lessonIndex?: number;
  files: File[];
  uploadedResources?: UploadedResource[];
  onFilesSelected: (lessonId: string, files: File[]) => void;
  onFileRemove: (lessonId: string, fileIndex: number) => void;
  onResourceUploaded?: (lessonId: string, resource: UploadedResource) => void;
  onResourceRemoved?: (lessonId: string, resourceId: string) => void;
}

export const FileUploads = ({
  lessonId,
  classId,
  lessonIndex,
  files,
  uploadedResources = [],
  onFilesSelected,
  onFileRemove,
  onResourceUploaded,
  onResourceRemoved
}: FileUploadsProps) => {
  const [uploading, setUploading] = useState<string[]>([]);
  const { toast } = useToast();

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Upload file to backend
  const uploadFile = async (file: File) => {
    if (!classId || lessonIndex === undefined) {
      toast({
        title: "Upload Error",
        description: "Class ID and lesson index are required for file upload",
        variant: "destructive",
      });
      return;
    }

    const fileId = `${lessonId}-${file.name}-${Date.now()}`;
    setUploading(prev => [...prev, fileId]);

    // Immediately create "uploading" resource to show in UI
    const uploadingResource: UploadedResource = {
      id: fileId,
      filename: file.name,
      originalFile: file,
      uploadStatus: 'uploading'
    };
    onResourceUploaded?.(lessonId, uploadingResource);

    try {
      // Convert file to base64
      const base64Data = await fileToBase64(file);
      
      // Upload to backend
      const response = await api.post(
        `/classes/${classId}/lesson-plans/${lessonIndex}/upload-resource`,
        {
          file: base64Data,
          filename: file.name
        }
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Update the existing resource to "uploaded" status
      const uploadedResource: UploadedResource = {
        id: response.data?.id || fileId,
        filename: file.name,
        originalFile: file,
        uploadStatus: 'uploaded'
      };

      // Remove the uploading resource and add the uploaded one
      onResourceRemoved?.(lessonId, fileId);
      onResourceUploaded?.(lessonId, uploadedResource);

      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      
      const failedResource: UploadedResource = {
        id: fileId,
        filename: file.name,
        originalFile: file,
        uploadStatus: 'failed',
        uploadError: error instanceof Error ? error.message : 'Upload failed'
      };

      // Remove the uploading resource and add the failed one
      onResourceRemoved?.(lessonId, fileId);
      onResourceUploaded?.(lessonId, failedResource);

      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setUploading(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    onFilesSelected(lessonId, selectedFiles);
    
    // Don't auto-upload immediately - let users see the selected files first
    // They can manually upload using the upload button for each file
  };
  
  const getFileTypeIcon = (file: File | string) => {
    const type = typeof file === 'string' ? file : file.type;
    if (type.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-purple-500" />;
    } else if (type.startsWith('video/')) {
      return <FileVideo className="h-4 w-4 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <Files className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (resource: UploadedResource) => {
    switch (resource.uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleResourceRemove = async (resource: UploadedResource) => {
    if (resource.uploadStatus === 'uploaded' && classId && lessonIndex !== undefined) {
      try {
        const response = await api.delete(
          `/classes/${classId}/lesson-plans/${lessonIndex}/resources/${resource.id}`
        );
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        onResourceRemoved?.(lessonId, resource.id);
        
        toast({
          title: "Resource Removed",
          description: `${resource.filename} has been removed successfully`,
        });
      } catch (error) {
        toast({
          title: "Remove Failed",
          description: `Failed to remove ${resource.filename}`,
          variant: "destructive",
        });
      }
    } else {
      onResourceRemoved?.(lessonId, resource.id);
    }
  };

  const totalFiles = uploadedResources.length + files.length;

  return (
    <div className="space-y-3 border-t pt-4 mt-4">
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Resource Files</Label>
          {totalFiles > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {files.length} selected, {uploadedResources.length} uploaded
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Upload PDFs, worksheets, slides, images or other materials that students will need for this lesson.
          Files will be available for download by enrolled students.
        </p>
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
        <FormFileUpload
          accept="*"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          label="📎 Choose Files to Upload"
          description="Drag and drop files here, or click to browse your files"
        />
      </div>
      
      {totalFiles > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Selected Files ({totalFiles})
            </Label>
            <span className="text-xs text-gray-500">
              {classId && lessonIndex !== undefined ? '💾 Click upload button to save to server' : '📁 Files will be stored locally'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {/* Uploaded Resources */}
            {uploadedResources.map((resource) => (
              <div key={resource.id} className={`flex items-center justify-between p-3 border rounded-lg shadow-sm ${
                resource.uploadStatus === 'uploaded' ? 'bg-green-50 border-green-200' :
                resource.uploadStatus === 'uploading' ? 'bg-blue-50 border-blue-200' :
                resource.uploadStatus === 'failed' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-3 overflow-hidden">
                  {getFileTypeIcon(resource.originalFile || resource.filename)}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-800 truncate block">{resource.filename}</span>
                    {resource.uploadStatus === 'failed' && resource.uploadError && (
                      <span className="text-xs text-red-500 truncate block">Error: {resource.uploadError}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(resource)}
                    <span className="text-xs font-medium capitalize">
                      {resource.uploadStatus === 'uploaded' ? '✅ Uploaded' :
                       resource.uploadStatus === 'uploading' ? '⏳ Uploading...' :
                       resource.uploadStatus === 'failed' ? '❌ Failed' : resource.uploadStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {resource.uploadStatus === 'failed' && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => resource.originalFile && uploadFile(resource.originalFile)}
                      className="text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50 flex-shrink-0"
                      title="Retry upload"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleResourceRemove(resource)}
                    className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                    disabled={resource.uploadStatus === 'uploading'}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {resource.uploadStatus === 'uploaded' ? 'Delete' : 'Remove'}
                  </Button>
                </div>
              </div>
            ))}

            {/* Local Files (not yet uploaded) */}
            {files.map((file, fileIndex) => (
              <div key={`local-${fileIndex}`} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {getFileTypeIcon(file)}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-800 truncate block">{file.name}</span>
                    <span className="text-xs text-yellow-700 font-medium">📄 Ready to upload • {(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {classId && lessonIndex !== undefined && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => uploadFile(file)}
                      className="text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50 flex-shrink-0"
                      disabled={uploading.some(id => id.includes(file.name))}
                      title="Upload to server"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => onFileRemove(lessonId, fileIndex)}
                    className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
