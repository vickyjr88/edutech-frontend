
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
    onFilesSelected: (files: File[]) => void;
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }
>(({ 
  className, 
  accept = "*", 
  multiple = false, 
  onFilesSelected,
  label,
  description,
  icon = <Upload className="h-10 w-10 text-gray-400" />,
  ...props 
}, ref) => {
  const id = React.useId();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    onFilesSelected(Array.from(files));
  };

  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          {icon}
          <h3 className="font-medium">{label}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <div className="mt-2">
            <Input
              id={id}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById(id)?.click()}
            >
              Choose Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
FormFileUpload.displayName = "FormFileUpload";

export { FormFileUpload };
