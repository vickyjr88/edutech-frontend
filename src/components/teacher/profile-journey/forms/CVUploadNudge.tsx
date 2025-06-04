import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CVUploadNudgeProps {
  onCVUpload?: (file: File) => void;
  onDismiss?: () => void;
}

export const CVUploadNudge = ({ onCVUpload, onDismiss }: CVUploadNudgeProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, Word document, or text file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Here you would typically send the file to an AI service
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onCVUpload) {
        onCVUpload(file);
      }
      
      // Show success message
      alert('CV uploaded successfully! We\'ll help you auto-fill your profile information.');
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative mb-8 p-6 bg-gradient-to-br from-[#5c64d4]/10 to-[#fc9323]/10 rounded-3xl border-2 border-dashed border-[#5c64d4]/30 hover:border-[#5c64d4]/50 transition-all duration-300">
      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload area */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl transition-all duration-300",
          isDragOver ? "bg-[#5c64d4]/20 scale-[1.02]" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center py-8">
          {/* Icon and sparkles */}
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#5c64d4] to-[#fc9323] rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#fc9323] animate-pulse" />
          </div>

          {/* Title and description */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🚀 Quick Profile Setup
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Drop your CV here to quickly complete your profile. Our AI will help extract your information automatically!
          </p>

          {/* Upload button */}
          <Button
            onClick={triggerFileInput}
            disabled={isUploading}
            className={cn(
              "px-8 py-3 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300",
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#5c64d4] to-[#fc9323] hover:from-[#5c64d4]/90 hover:to-[#fc9323]/90 text-white hover:scale-105"
            )}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing CV...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload CV
              </>
            )}
          </Button>

          {/* Supported formats */}
          <p className="text-xs text-gray-500 mt-3">
            Supports PDF, Word documents, and text files (max 10MB)
          </p>

          {/* Drag and drop hint */}
          <div className="mt-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Upload className="w-4 h-4" />
              or drag and drop your file here
            </span>
          </div>
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-[#5c64d4]/20 border-2 border-[#5c64d4] border-dashed rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-12 h-12 text-[#5c64d4] mx-auto mb-2" />
              <p className="text-[#5c64d4] font-semibold">Drop your CV here!</p>
            </div>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-[#5c64d4] rounded-full"></div>
          Auto-fill education
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-[#fc9323] rounded-full"></div>
          Extract experience
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-[#5c64d4] rounded-full"></div>
          Parse skills
        </div>
      </div>
    </div>
  );
};