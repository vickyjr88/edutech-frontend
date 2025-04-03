
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormFileUpload } from "@/components/ui/form";
import { FileImage, FileVideo, FileText, Files, Trash2 } from "lucide-react";

interface FileUploadsProps {
  lessonId: string;
  files: File[];
  onFilesSelected: (lessonId: string, files: File[]) => void;
  onFileRemove: (lessonId: string, fileIndex: number) => void;
}

export const FileUploads = ({
  lessonId,
  files,
  onFilesSelected,
  onFileRemove
}: FileUploadsProps) => {
  const handleFilesSelected = (selectedFiles: File[]) => {
    onFilesSelected(lessonId, selectedFiles);
  };
  
  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-4 w-4 text-purple-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-4 w-4 text-blue-500" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else {
      return <Files className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-2 border-t pt-4 mt-4">
      <Label>Resource Files</Label>
      <p className="text-xs text-gray-500 mb-2">
        Upload PDFs, worksheets, slides, images or other materials that students will need for this lesson.
        Files will be available for download by enrolled students.
      </p>
      <FormFileUpload
        accept="*"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Upload Lesson Materials"
        description="Drag and drop files here, or click to browse your files"
      />
      
      {files && files.length > 0 && (
        <div className="mt-2 space-y-1">
          <Label className="text-xs text-gray-500">Uploaded Files ({files.length})</Label>
          <div className="grid grid-cols-1 gap-2">
            {files.map((file, fileIndex) => (
              <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                <div className="flex items-center space-x-2 overflow-hidden">
                  {getFileTypeIcon(file)}
                  <span className="text-sm text-gray-800 truncate">{file.name}</span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onFileRemove(lessonId, fileIndex)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
