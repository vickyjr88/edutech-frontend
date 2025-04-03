
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormFileUpload } from "@/components/ui/form";
import { 
  FileText, 
  BookOpen, 
  Link as LinkIcon, 
  PlusCircle, 
  Trash2, 
  FileImage,
  FileVideo,
  Files,
  Plus,
  Clock
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ClassFormValues } from "../CreateClassForm";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LessonPlansTabProps {
  form: UseFormReturn<ClassFormValues>;
  onPreviousTab: () => void;
  onNextTab: () => void;
  lessonFileUploads: Record<string, File[]>;
  handleLessonFileChange: (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLessonFile: (lessonId: string, fileIndex: number) => void;
  appendLessonPlan: () => void;
  removeLessonPlan: (id: string) => void;
  updateLessonPlan: (id: string, field: string, value: string) => void;
}

type ResourceLink = {
  id: string;
  url: string;
  title: string;
};

const durationOptions = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "45m", label: "45 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1h30m", label: "1 hour 30 minutes" },
  { value: "2h", label: "2 hours" },
  { value: "2h30m", label: "2 hours 30 minutes" },
  { value: "3h", label: "3 hours" },
  { value: "custom", label: "Custom duration" },
];

const LessonPlansTab = ({ 
  form, 
  onPreviousTab, 
  onNextTab,
  lessonFileUploads,
  handleLessonFileChange,
  removeLessonFile,
  appendLessonPlan,
  removeLessonPlan,
  updateLessonPlan
}: LessonPlansTabProps) => {
  const [resourceLinks, setResourceLinks] = useState<Record<string, ResourceLink[]>>({});
  const [newResourceUrl, setNewResourceUrl] = useState<Record<string, string>>({});
  const [newResourceTitle, setNewResourceTitle] = useState<Record<string, string>>({});
  const [customDuration, setCustomDuration] = useState<Record<string, string>>({});

  const handleAddResourceLink = (lessonId: string) => {
    if (!newResourceUrl[lessonId]?.trim()) return;

    const newLink = {
      id: Date.now().toString(),
      url: newResourceUrl[lessonId],
      title: newResourceTitle[lessonId] || `Resource ${(resourceLinks[lessonId] || []).length + 1}`
    };

    const updatedLinks = {
      ...resourceLinks,
      [lessonId]: [...(resourceLinks[lessonId] || []), newLink]
    };

    setResourceLinks(updatedLinks);
    setNewResourceUrl({ ...newResourceUrl, [lessonId]: '' });
    setNewResourceTitle({ ...newResourceTitle, [lessonId]: '' });
  };

  const removeResourceLink = (lessonId: string, linkId: string) => {
    if (!resourceLinks[lessonId]) return;

    const updatedLinks = {
      ...resourceLinks,
      [lessonId]: resourceLinks[lessonId].filter(link => link.id !== linkId)
    };

    setResourceLinks(updatedLinks);
  };

  const handleDurationChange = (lessonId: string, value: string) => {
    if (value === "custom") {
      // If custom is selected, don't update the lesson plan yet
      setCustomDuration({ ...customDuration, [lessonId]: customDuration[lessonId] || "" });
    } else {
      // For predefined options, update the lesson plan directly
      updateLessonPlan(lessonId, "duration", value);
    }
  };

  const handleCustomDurationChange = (lessonId: string, value: string) => {
    setCustomDuration({ ...customDuration, [lessonId]: value });
    updateLessonPlan(lessonId, "duration", value);
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

  const getLinkTypeIcon = (url: string) => {
    if (url.includes('docs.google.com')) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <FileVideo className="h-4 w-4 text-red-600" />;
    } else if (url.includes('sheets.google.com')) {
      return <FileText className="h-4 w-4 text-green-600" />;
    } else if (url.includes('slides.google.com')) {
      return <FileText className="h-4 w-4 text-yellow-600" />;
    } else {
      return <LinkIcon className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLinkTypeName = (url: string) => {
    if (url.includes('docs.google.com')) return 'Google Doc';
    if (url.includes('sheets.google.com')) return 'Google Sheet';
    if (url.includes('slides.google.com')) return 'Google Slides';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    return 'Link';
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800">Lesson Plans</h3>
        <p className="text-xs text-blue-700 mt-1">
          Add lesson plans to organize your teaching curriculum and share with students.
        </p>
      </div>

      {form.watch("lessonPlans").length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-md">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson plans yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new lesson plan</p>
          <Button
            type="button" 
            onClick={appendLessonPlan}
            className="mt-4"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add First Lesson
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {form.watch("lessonPlans").map((lesson, index) => (
            <div key={lesson.id} className="border rounded-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Lesson {index + 1}</h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeLessonPlan(lesson.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`lesson-title-${lesson.id}`}>Title</Label>
                  <Input 
                    id={`lesson-title-${lesson.id}`}
                    placeholder="Enter lesson title"
                    value={lesson.title || ""}
                    onChange={(e) => updateLessonPlan(lesson.id, "title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`lesson-duration-${lesson.id}`}>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Duration
                    </div>
                  </Label>
                  <div className="flex gap-2">
                    <Select 
                      value={lesson.duration && durationOptions.some(option => option.value === lesson.duration) 
                        ? lesson.duration 
                        : "custom"}
                      onValueChange={(value) => handleDurationChange(lesson.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {(lesson.duration === "custom" || 
                     (lesson.duration && !durationOptions.some(option => option.value === lesson.duration))) && (
                      <Input
                        placeholder="e.g. 1 hour 15 min"
                        value={customDuration[lesson.id] || lesson.duration || ""}
                        onChange={(e) => handleCustomDurationChange(lesson.id, e.target.value)}
                        className="flex-1"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`lesson-description-${lesson.id}`}>Description</Label>
                <Textarea 
                  id={`lesson-description-${lesson.id}`}
                  placeholder="Enter lesson description"
                  className="resize-none"
                  value={lesson.description || ""}
                  onChange={(e) => updateLessonPlan(lesson.id, "description", e.target.value)}
                />
              </div>
              
              {/* Resource Files Upload */}
              <div className="space-y-2 border-t pt-4 mt-4">
                <Label>Resource Files</Label>
                <FormFileUpload
                  accept="*"
                  multiple={true}
                  onFilesSelected={(files) => {
                    const event = {
                      target: {
                        files: files
                      }
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleLessonFileChange(lesson.id, event)
                  }}
                  label="Upload Documents, Images & Files"
                  description="Drag and drop files here, or click to choose files"
                />
                
                {lessonFileUploads[lesson.id] && lessonFileUploads[lesson.id].length > 0 && (
                  <div className="mt-2 space-y-1">
                    <Label className="text-xs text-gray-500">Uploaded Files ({lessonFileUploads[lesson.id].length})</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {lessonFileUploads[lesson.id].map((file, fileIndex) => (
                        <div key={fileIndex} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            {getFileTypeIcon(file)}
                            <span className="text-sm text-gray-800 truncate">{file.name}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeLessonFile(lesson.id, fileIndex)}
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
              
              {/* Resource URLs */}
              <div className="space-y-3 border-t pt-4 mt-4">
                <Label>Resource Links</Label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Resource title (optional)"
                        value={newResourceTitle[lesson.id] || ''}
                        onChange={(e) => setNewResourceTitle({
                          ...newResourceTitle,
                          [lesson.id]: e.target.value
                        })}
                        className="flex-grow"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="https://... (YouTube, Google Docs, etc.)"
                        value={newResourceUrl[lesson.id] || ''}
                        onChange={(e) => setNewResourceUrl({
                          ...newResourceUrl,
                          [lesson.id]: e.target.value
                        })}
                        icon={<LinkIcon className="h-4 w-4" />}
                        className="flex-grow"
                      />
                      <Button 
                        type="button" 
                        onClick={() => handleAddResourceLink(lesson.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {resourceLinks[lesson.id] && resourceLinks[lesson.id].length > 0 && (
                  <div className="mt-2 space-y-1">
                    <Label className="text-xs text-gray-500">Added Links ({resourceLinks[lesson.id].length})</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {resourceLinks[lesson.id].map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            {getLinkTypeIcon(link.url)}
                            <span className="text-sm text-gray-800 truncate">{link.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {getLinkTypeName(link.url)}
                            </Badge>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeResourceLink(lesson.id, link.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button" 
            variant="outline" 
            onClick={appendLessonPlan}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Lesson
          </Button>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPreviousTab}>
          Back: Basic Information
        </Button>
        <Button type="button" variant="outline" onClick={onNextTab}>
          Next: Cohorts & Students
        </Button>
      </div>
    </div>
  );
};

export default LessonPlansTab;
