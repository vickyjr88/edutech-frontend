import React, { useState, useCallback } from 'react';
import { Upload, FileText, Sparkles, CheckCircle, AlertCircle, Loader2, Wand2, Bot, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { cvService, type CVUploadResponse } from '@/integrations/api/services/cv.service';

interface AIProfileHelperProps {
  onProfileUpdate?: (data: CVUploadResponse['data']) => void;
  onClose?: () => void;
  className?: string;
}

const AIProfileHelper: React.FC<AIProfileHelperProps> = ({ onProfileUpdate, onClose, className }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<CVUploadResponse['data'] | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validation = cvService.validateFile(file);
    
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const simulateProgress = (callback: () => void) => {
    setUploadProgress(0);
    const stages = [
      { progress: 20, stage: 'Uploading CV to secure cloud...' },
      { progress: 40, stage: 'AI scanning document structure...' },
      { progress: 60, stage: 'Extracting professional information...' },
      { progress: 80, stage: 'Matching skills and experience...' },
      { progress: 95, stage: 'Finalizing profile data...' },
      { progress: 100, stage: 'Complete!' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setUploadProgress(stages[currentStage].progress);
        setProcessingStage(stages[currentStage].stage);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(callback, 500);
      }
    }, 800);
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setProcessing(true);
    setUploadedFile(file); // Store the file for later use

    try {
      // First, preview the CV to show what will be extracted
      await previewCV(file);
    } catch (error) {
      console.error('Error processing CV:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your CV. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
      setProcessing(false);
    }
  };

  const previewCV = async (file: File) => {
    simulateProgress(async () => {
      try {
        const { data, error } = await cvService.previewCV(file);
        
        if (error) {
          throw new Error(error.message || 'Failed to preview CV');
        }

        if (data && data.success) {
          setPreview(data.data);
          setUploading(false);
          setProcessing(false);
        } else {
          throw new Error(data?.message || 'Failed to process CV');
        }
      } catch (error) {
        console.error('Preview error:', error);
        setUploading(false);
        setProcessing(false);
        throw error;
      }
    });
  };

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const applyToProfile = async () => {
    if (!uploadedFile) {
      toast({
        title: "No file found",
        description: "Please upload your CV again.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProcessingStage('Applying changes to your profile...');
    setUploadProgress(50);

    try {
      const { data, error } = await cvService.uploadCV(uploadedFile);
      
      if (error) {
        throw new Error(error.message || 'Failed to apply CV data to profile');
      }

      if (data && data.success) {
        setUploadProgress(100);
        setProcessingStage('Profile updated successfully!');
        
        toast({
          title: "Profile updated!",
          description: `Your profile has been updated with ${data.data.profileUpdate?.itemsCreated || 0} new items and ${data.data.profileUpdate?.itemsUpdated || 0} updated items.`,
        });

        onProfileUpdate?.(data.data);
        
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        throw new Error(data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const resetUpload = () => {
    setPreview(null);
    setUploading(false);
    setProcessing(false);
    setUploadProgress(0);
    setProcessingStage('');
    setUploadedFile(null);
  };

  if (preview && !processing) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <Brain className="w-6 h-6 mr-3" />
              AI Successfully Analyzed Your CV
            </CardTitle>
            <CardDescription className="text-emerald-600">
              Here's what our AI found in your CV. Review and apply to your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Confidence Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <Progress value={preview.extractedData.confidence} className="w-20" />
                <span className="text-sm font-semibold text-emerald-700">
                  {preview.extractedData.confidence}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Personal Info</h4>
                <div className="text-sm text-gray-600">
                  <p>Name: {preview.extractedData.personalInfo.fullName || 'Not found'}</p>
                  <p>Email: {preview.extractedData.personalInfo.email || 'Not found'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Professional Data</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Education: {preview.extractedData.education?.length || 0} items</p>
                  <p>Experience: {preview.extractedData.experience?.length || 0} items</p>
                  <p>Certifications: {preview.extractedData.certifications?.length || 0} items</p>
                  <p>Languages: {preview.extractedData.languages?.length || 0} items</p>
                </div>
              </div>
            </div>

            {preview.extractedData.summary && (
              <div className="p-4 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-gray-700 mb-2">AI-Generated Summary</h4>
                <p className="text-sm text-gray-600 italic">"{preview.extractedData.summary}"</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button onClick={applyToProfile} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Wand2 className="w-4 h-4 mr-2" />
                Apply to Profile
              </Button>
              <Button variant="outline" onClick={resetUpload} className="border-emerald-200 text-emerald-700">
                Upload Different CV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        {/* Magical background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-8 w-4 h-4 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <CardHeader className="relative">
          <CardTitle className="flex items-center text-purple-700">
            <div className="relative mr-3">
              <Sparkles className="w-6 h-6" />
              <Bot className="w-3 h-3 absolute -top-1 -right-1 text-pink-500 animate-spin" />
            </div>
            AI Profile Wizard
          </CardTitle>
          <CardDescription className="text-purple-600">
            Let our AI magically complete your profile by analyzing your CV
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          {processing && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bot className="w-8 h-8 text-purple-600 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-purple-700">AI Processing Your CV</p>
                  <p className="text-sm text-purple-600">{processingStage}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-3" />
                <div className="flex justify-between text-xs text-purple-600">
                  <span>Analyzing...</span>
                  <span>{uploadProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {!processing && (
            <>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer relative",
                  dragActive ? "border-purple-400 bg-purple-100" : "border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('cv-upload')?.click()}
              >
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div className="space-y-4">
                  <div className="relative mx-auto w-16 h-16">
                    <Upload className="w-16 h-16 text-purple-400 mx-auto" />
                    <Sparkles className="w-4 h-4 absolute top-0 right-0 text-pink-500 animate-pulse" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-700 mb-2">
                      Drop your CV here or click to upload
                    </h3>
                    <p className="text-purple-600 text-sm">
                      Our AI will instantly analyze and extract your professional information
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 text-xs text-purple-500">
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      PDF only
                    </span>
                    <span>•</span>
                    <span>Max {cvService.formatFileSize(cvService.getMaxFileSize())}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-200">
                  <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-purple-700 text-sm">Smart Extraction</h4>
                  <p className="text-xs text-purple-600">AI extracts education, experience & skills</p>
                </div>
                
                <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-200">
                  <Wand2 className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <h4 className="font-medium text-pink-700 text-sm">Auto-Fill</h4>
                  <p className="text-xs text-pink-600">Automatically populates profile sections</p>
                </div>
                
                <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-200">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-medium text-emerald-700 text-sm">Preview First</h4>
                  <p className="text-xs text-emerald-600">Review before applying to profile</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-purple-100 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  Your CV is processed securely and only used to improve your profile. No data is stored permanently.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIProfileHelper;