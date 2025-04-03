
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// File upload component for forms
const FormFileUpload = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    accept?: string;
    multiple?: boolean;
    onFilesSelected?: (files: File[]) => void;
    label?: string;
    description?: string;
    icon?: React.ReactNode;
    files?: File[];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove?: (index: number) => void;
    acceptedFileTypes?: string;
  }
>(({ 
  className, 
  accept = "*/*", 
  acceptedFileTypes = "*/*",
  multiple = false, 
  onFilesSelected,
  onChange,
  onRemove,
  files = [],
  label = "Upload Files",
  description = "Drag and drop files here, or click to browse",
  icon = <Upload className="h-10 w-10 text-gray-400" />,
  ...props 
}, ref) => {
  const id = React.useId();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    if (onFilesSelected) {
      onFilesSelected(Array.from(selectedFiles));
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
        <div className="flex flex-col items-center justify-center space-y-2">
          {icon}
          <h3 className="font-medium text-gray-800">{label}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <div className="mt-2">
            <Input
              id={id}
              type="file"
              accept={acceptedFileTypes || accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById(id)?.click()}
              className="bg-white hover:bg-gray-100"
            >
              Browse Files
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Supported file types: PDFs, DOC, images, slides, and more
          </p>
        </div>
      </div>
    </div>
  );
});
FormFileUpload.displayName = "FormFileUpload";

export { FormFileUpload };
