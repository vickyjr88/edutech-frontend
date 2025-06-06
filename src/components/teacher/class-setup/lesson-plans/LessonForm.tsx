
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  Clock, 
  Plus, 
  X, 
  Target, 
  Activity, 
  BookOpen, 
  CheckSquare, 
  FileText, 
  Video, 
  Package, 
  Tag,
  GraduationCap,
  Home,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// DTOs based on backend structure
interface CreateResourceLinkDto {
  title: string;
  url: string;
  description?: string;
}

interface CreateResourceFileDto {
  filename: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
}

interface CreateLessonObjectiveDto {
  objective: string;
  isCompleted?: boolean;
}

interface CreateLessonActivityDto {
  title: string;
  description?: string;
  duration: number; // in minutes
  instructions?: string;
  resourceFiles?: CreateResourceFileDto[];
  resourceLinks?: CreateResourceLinkDto[];
}

enum RequirementType {
  VIDEO = 'video',
  ARTICLE = 'article', 
  WORKSHEET = 'worksheet',
  SURVEY = 'survey',
  MATERIALS = 'materials',
  DOCUMENT_UPLOAD = 'document_upload'
}

enum RequirementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

enum LessonType {
  LECTURE = 'lecture',
  PRACTICAL = 'practical',
  WORKSHOP = 'workshop',
  ASSESSMENT = 'assessment',
  DISCUSSION = 'discussion',
  FIELD_TRIP = 'field_trip',
  PRESENTATION = 'presentation',
  REVIEW = 'review'
}

enum LessonStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

interface CreateLessonRequirementDto {
  type: RequirementType;
  title: string;
  description?: string;
  instructions?: string;
  isRequired?: boolean;
  dueDate?: Date;
  estimatedDuration?: number;
  // For video/article requirements
  url?: string;
  thumbnail?: string;
  // For worksheet requirements
  worksheetUrl?: string;
  // For survey requirements
  surveyUrl?: string;
  surveyPlatform?: string;
  // For materials requirements
  materialsDescription?: string;
  materialsList?: string[];
  whereToGet?: string;
  // For document upload requirements
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  uploadInstructions?: string;
  // General fields
  attachments?: CreateResourceFileDto[];
  resourceLinks?: CreateResourceLinkDto[];
  status?: RequirementStatus;
  notes?: string;
}

interface LessonFormProps {
  lesson: {
    id: string;
    title?: string;
    description?: string;
    type?: LessonType;
    duration?: number; // in minutes
    lessonNumber?: number;
    sessionStartTime?: Date;
    summary?: string;
    objectives?: CreateLessonObjectiveDto[];
    activities?: CreateLessonActivityDto[];
    requirements?: CreateLessonRequirementDto[];
    prerequisites?: string;
    homework?: string;
    assessmentCriteria?: string;
    tags?: string[];
    resourceFiles?: CreateResourceFileDto[];
    resourceLinks?: CreateResourceLinkDto[];
    teacherNotes?: string;
    status?: LessonStatus;
    scheduledDate?: Date;
  };
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  isRemovable: boolean;
  lessonNumber: number;
}

const durationOptions = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "45m", label: "45 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1h15m", label: "1 hour 15 minutes" },
  { value: "1h30m", label: "1 hour 30 minutes" },
  { value: "1h45m", label: "1 hour 45 minutes" },
  { value: "2h", label: "2 hours" },
  { value: "2h15m", label: "2 hours 15 minutes" },
  { value: "2h30m", label: "2 hours 30 minutes" },
  { value: "2h45m", label: "2 hours 45 minutes" },
  { value: "3h", label: "3 hours" },
  { value: "custom", label: "Custom duration" },
];

export const LessonForm = ({
  lesson,
  onUpdate,
  onRemove,
  isRemovable,
  lessonNumber
}: LessonFormProps) => {
  const [newObjective, setNewObjective] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");

  const addObjective = () => {
    if (newObjective.trim()) {
      const objectives = lesson.objectives || [];
      const newObj: CreateLessonObjectiveDto = {
        objective: newObjective.trim(),
        isCompleted: false
      };
      onUpdate("objectives", [...objectives, newObj]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    const objectives = lesson.objectives || [];
    onUpdate("objectives", objectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, field: keyof CreateLessonObjectiveDto, value: any) => {
    const objectives = lesson.objectives || [];
    const updated = objectives.map((obj, i) => 
      i === index ? { ...obj, [field]: value } : obj
    );
    onUpdate("objectives", updated);
  };

  const addActivity = () => {
    const activities = lesson.activities || [];
    const newActivity: CreateLessonActivityDto = {
      title: "",
      description: "",
      duration: 15,
      instructions: "",
      resourceFiles: [],
      resourceLinks: []
    };
    onUpdate("activities", [...activities, newActivity]);
  };

  const updateActivity = (index: number, field: keyof CreateLessonActivityDto, value: any) => {
    const activities = lesson.activities || [];
    const updated = activities.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    );
    onUpdate("activities", updated);
  };

  const removeActivity = (index: number) => {
    const activities = lesson.activities || [];
    onUpdate("activities", activities.filter((_, i) => i !== index));
  };

  const addRequirement = (type: RequirementType) => {
    const requirements = lesson.requirements || [];
    const newRequirement: CreateLessonRequirementDto = {
      type,
      title: "",
      description: "",
      isRequired: true,
      status: RequirementStatus.DRAFT
    };
    onUpdate("requirements", [...requirements, newRequirement]);
  };

  const updateRequirement = (index: number, field: keyof CreateLessonRequirementDto, value: any) => {
    const requirements = lesson.requirements || [];
    const updated = requirements.map((req, i) => 
      i === index ? { ...req, [field]: value } : req
    );
    onUpdate("requirements", updated);
  };

  const removeRequirement = (index: number) => {
    const requirements = lesson.requirements || [];
    onUpdate("requirements", requirements.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim()) {
      const tags = lesson.tags || [];
      onUpdate("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const tags = lesson.tags || [];
    onUpdate("tags", tags.filter((_, i) => i !== index));
  };

  const addResourceLink = () => {
    const resourceLinks = lesson.resourceLinks || [];
    const newLink: CreateResourceLinkDto = {
      title: "",
      url: "",
      description: ""
    };
    onUpdate("resourceLinks", [...resourceLinks, newLink]);
  };

  const updateResourceLink = (index: number, field: keyof CreateResourceLinkDto, value: string) => {
    const resourceLinks = lesson.resourceLinks || [];
    const updated = resourceLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    onUpdate("resourceLinks", updated);
  };

  const removeResourceLink = (index: number) => {
    const resourceLinks = lesson.resourceLinks || [];
    onUpdate("resourceLinks", resourceLinks.filter((_, i) => i !== index));
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Card className="w-full shadow-lg border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            Lesson {lessonNumber}
          </CardTitle>
          {isRemovable && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FileText className="h-5 w-5 text-blue-600" />
            Basic Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`lesson-title-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input 
                id={`lesson-title-${lesson.id}`}
                placeholder="Enter a descriptive lesson title"
                value={lesson.title || ""}
                onChange={(e) => onUpdate("title", e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`lesson-number-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Lesson Number
              </Label>
              <Input 
                id={`lesson-number-${lesson.id}`}
                type="number"
                placeholder="e.g. 1"
                value={lesson.lessonNumber || lessonNumber}
                onChange={(e) => onUpdate("lessonNumber", parseInt(e.target.value) || lessonNumber)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`lesson-type-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Lesson Type
              </Label>
              <Select
                value={lesson.type || LessonType.LECTURE}
                onValueChange={(value) => onUpdate("type", value as LessonType)}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LessonType.LECTURE}>Lecture</SelectItem>
                  <SelectItem value={LessonType.PRACTICAL}>Practical</SelectItem>
                  <SelectItem value={LessonType.WORKSHOP}>Workshop</SelectItem>
                  <SelectItem value={LessonType.ASSESSMENT}>Assessment</SelectItem>
                  <SelectItem value={LessonType.DISCUSSION}>Discussion</SelectItem>
                  <SelectItem value={LessonType.FIELD_TRIP}>Field Trip</SelectItem>
                  <SelectItem value={LessonType.PRESENTATION}>Presentation</SelectItem>
                  <SelectItem value={LessonType.REVIEW}>Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`lesson-duration-minutes-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Duration (minutes)
              </Label>
              <Input 
                id={`lesson-duration-minutes-${lesson.id}`}
                type="number"
                placeholder="e.g. 60"
                value={lesson.duration || ""}
                onChange={(e) => onUpdate("duration", parseInt(e.target.value) || 0)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`lesson-status-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <Select
                value={lesson.status || LessonStatus.DRAFT}
                onValueChange={(value) => onUpdate("status", value as LessonStatus)}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LessonStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={LessonStatus.SCHEDULED}>Scheduled</SelectItem>
                  <SelectItem value={LessonStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={LessonStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={LessonStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Summary & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <ClipboardList className="h-5 w-5 text-green-600" />
            Overview
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`lesson-summary-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Summary
              </Label>
              <Textarea 
                id={`lesson-summary-${lesson.id}`}
                placeholder="Brief summary of the lesson"
                className="resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                rows={2}
                value={lesson.summary || ""}
                onChange={(e) => onUpdate("summary", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`lesson-description-${lesson.id}`} className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea 
                id={`lesson-description-${lesson.id}`}
                placeholder="Detailed description of the lesson content"
                className="resize-none border-gray-300 focus:border-green-500 focus:ring-green-500"
                rows={3}
                value={lesson.description || ""}
                onChange={(e) => onUpdate("description", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Learning Objectives */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Target className="h-5 w-5 text-purple-600" />
            Learning Objectives *
          </div>
          <div className="space-y-4">
            {lesson.objectives?.map((objective, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-200 text-purple-800 text-sm font-bold rounded-full flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-purple-800 mb-2 block">
                      Learning Objective {index + 1}
                    </Label>
                    <Textarea 
                      value={objective.objective}
                      onChange={(e) => updateObjective(index, "objective", e.target.value)}
                      placeholder="Describe what students will be able to do after this lesson (e.g., 'Students will be able to explain the water cycle')"
                      rows={3}
                      className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-white resize-none text-base"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0 mt-1"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-purple-800 block">
                  Add New Learning Objective
                </Label>
                <div className="flex gap-3">
                  <Textarea 
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="What will students learn or be able to do? (e.g., 'Students will identify the main components of...')"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        addObjective();
                      }
                    }}
                    className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-white resize-none text-base flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={addObjective}
                    disabled={!newObjective.trim()}
                    className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-6"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-purple-600 italic">
                  Tip: Use Ctrl+Enter to quickly add an objective
                </p>
              </div>
            </div>
            
            {(!lesson.objectives || lesson.objectives.length === 0) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-red-800 text-sm font-medium">Learning objectives are required</p>
                </div>
                <p className="text-red-700 text-xs mt-1">Add at least one learning objective for this lesson</p>
              </div>
            )}
            
            {lesson.objectives && lesson.objectives.length > 0 && lesson.objectives.every((obj: any) => !obj.objective || obj.objective.trim() === "") && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-amber-800 text-sm font-medium">Please fill in all learning objectives</p>
                </div>
                <p className="text-amber-700 text-xs mt-1">Empty objectives will not be saved</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Activities */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Activity className="h-5 w-5 text-orange-600" />
            Activities
          </div>
          <div className="space-y-4">
            {lesson.activities?.map((activity, index) => (
              <Card key={index} className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 bg-orange-200 text-orange-800 text-sm font-bold rounded-full">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-orange-800">Activity {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeActivity(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Title</Label>
                      <Input 
                        value={activity.title}
                        onChange={(e) => updateActivity(index, "title", e.target.value)}
                        placeholder="Activity title"
                        className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Input 
                        value={activity.description}
                        onChange={(e) => updateActivity(index, "description", e.target.value)}
                        placeholder="Activity description"
                        className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Duration (minutes)</Label>
                      <Input 
                        type="number"
                        value={activity.duration}
                        onChange={(e) => updateActivity(index, "duration", parseInt(e.target.value) || 0)}
                        placeholder="e.g. 15"
                        className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Instructions</Label>
                    <Textarea 
                      value={activity.instructions}
                      onChange={(e) => updateActivity(index, "instructions", e.target.value)}
                      placeholder="Detailed instructions for the activity"
                      rows={2}
                      className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addActivity}
              className="w-full h-12 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>

        <Separator />

        {/* Prerequisites & Homework */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              Prerequisites
            </div>
            <Textarea 
              id={`lesson-prerequisites-${lesson.id}`}
              placeholder="What students need to know before this lesson"
              className="resize-none border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              value={lesson.prerequisites || ""}
              onChange={(e) => onUpdate("prerequisites", e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Home className="h-5 w-5 text-pink-600" />
              Homework
            </div>
            <Textarea 
              id={`lesson-homework-${lesson.id}`}
              placeholder="Homework assignments for this lesson"
              className="resize-none border-pink-300 focus:border-pink-500 focus:ring-pink-500"
              rows={3}
              value={lesson.homework || ""}
              onChange={(e) => onUpdate("homework", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Assessment Criteria */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <CheckSquare className="h-5 w-5 text-emerald-600" />
            Assessment Criteria
          </div>
          <Textarea 
            id={`lesson-assessment-${lesson.id}`}
            placeholder="How will student learning be assessed?"
            className="resize-none border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
            rows={3}
            value={lesson.assessmentCriteria || ""}
            onChange={(e) => onUpdate("assessmentCriteria", e.target.value)}
          />
        </div>

        <Separator />

        {/* Requirements */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Package className="h-5 w-5 text-red-600" />
            Requirements
          </div>
          
          {/* Add Requirements Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.VIDEO)}
              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              <Video className="h-4 w-4 mr-1" />
              Add Video
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.ARTICLE)}
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
            >
              <FileText className="h-4 w-4 mr-1" />
              Add Article
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.WORKSHEET)}
              className="bg-green-600 text-white hover:bg-green-700 border-green-600"
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Add Worksheet
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.SURVEY)}
              className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Add Survey
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.MATERIALS)}
              className="bg-amber-600 text-white hover:bg-amber-700 border-amber-600"
            >
              <Package className="h-4 w-4 mr-1" />
              Add Materials
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.DOCUMENT_UPLOAD)}
              className="bg-orange-600 text-white hover:bg-orange-700 border-orange-600"
            >
              <FileText className="h-4 w-4 mr-1" />
              Add Document Upload
            </Button>
          </div>

          {/* Requirements List */}
          <div className="space-y-4">
            {(Array.isArray(lesson.requirements) ? lesson.requirements : [])?.map((requirement, index) => (
              <Card key={index} className="border-gray-200 bg-gray-50/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {requirement.type.replace('_', ' ')}
                      </Badge>
                      {requirement.isRequired && (
                        <Badge variant="destructive">Required</Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Title</Label>
                      <Input 
                        value={requirement.title}
                        onChange={(e) => updateRequirement(index, "title", e.target.value)}
                        placeholder="Requirement title"
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Input 
                        value={requirement.description || ""}
                        onChange={(e) => updateRequirement(index, "description", e.target.value)}
                        placeholder="Brief description"
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                      />
                    </div>
                  </div>
                  
                  {/* Type-specific fields */}
                  {(requirement.type === RequirementType.VIDEO || requirement.type === RequirementType.ARTICLE) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">URL</Label>
                        <Input 
                          value={requirement.url || ""}
                          onChange={(e) => updateRequirement(index, "url", e.target.value)}
                          placeholder="https://..."
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Estimated Duration (minutes)</Label>
                        <Input 
                          type="number"
                          value={requirement.estimatedDuration || ""}
                          onChange={(e) => updateRequirement(index, "estimatedDuration", parseInt(e.target.value) || 0)}
                          placeholder="e.g. 15"
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {requirement.type === RequirementType.WORKSHEET && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Worksheet URL</Label>
                      <Input 
                        value={requirement.worksheetUrl || ""}
                        onChange={(e) => updateRequirement(index, "worksheetUrl", e.target.value)}
                        placeholder="https://..."
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                      />
                    </div>
                  )}
                  
                  {requirement.type === RequirementType.SURVEY && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Survey URL</Label>
                        <Input 
                          value={requirement.surveyUrl || ""}
                          onChange={(e) => updateRequirement(index, "surveyUrl", e.target.value)}
                          placeholder="https://..."
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Platform</Label>
                        <Input 
                          value={requirement.surveyPlatform || ""}
                          onChange={(e) => updateRequirement(index, "surveyPlatform", e.target.value)}
                          placeholder="e.g. Google Forms, SurveyMonkey"
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {requirement.type === RequirementType.MATERIALS && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Materials Description</Label>
                        <Textarea 
                          value={requirement.materialsDescription || ""}
                          onChange={(e) => updateRequirement(index, "materialsDescription", e.target.value)}
                          placeholder="e.g. A candle and match-box"
                          rows={2}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Where to Get</Label>
                        <Input 
                          value={requirement.whereToGet || ""}
                          onChange={(e) => updateRequirement(index, "whereToGet", e.target.value)}
                          placeholder="e.g. Local store, online, provided by school"
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {requirement.type === RequirementType.DOCUMENT_UPLOAD && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Accepted File Types</Label>
                        <Input 
                          value={requirement.acceptedFileTypes?.join(", ") || ""}
                          onChange={(e) => updateRequirement(index, "acceptedFileTypes", e.target.value.split(", ").filter(Boolean))}
                          placeholder="e.g. pdf, doc, docx"
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Max File Size (MB)</Label>
                        <Input 
                          type="number"
                          value={requirement.maxFileSize || ""}
                          onChange={(e) => updateRequirement(index, "maxFileSize", parseInt(e.target.value) || 0)}
                          placeholder="e.g. 10"
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Upload Instructions</Label>
                        <Textarea 
                          value={requirement.uploadInstructions || ""}
                          onChange={(e) => updateRequirement(index, "uploadInstructions", e.target.value)}
                          placeholder="Instructions for file upload"
                          rows={1}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Instructions</Label>
                      <Textarea 
                        value={requirement.instructions || ""}
                        onChange={(e) => updateRequirement(index, "instructions", e.target.value)}
                        placeholder="Detailed instructions for students"
                        rows={2}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Notes</Label>
                      <Textarea 
                        value={requirement.notes || ""}
                        onChange={(e) => updateRequirement(index, "notes", e.target.value)}
                        placeholder="Internal notes for teachers"
                        rows={2}
                        className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 bg-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Tag className="h-5 w-5 text-cyan-600" />
            Tags
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200 min-h-[50px]">
              {lesson.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-cyan-200 text-cyan-800 hover:bg-cyan-300 transition-colors">
                  <Tag className="h-3 w-3" />
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(index)}
                    className="h-auto p-0 text-red-600 hover:text-red-700 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {(!lesson.tags || lesson.tags.length === 0) && (
                <span className="text-cyan-600 text-sm italic">No tags added yet</span>
              )}
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Input 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => handleKeyDown(e, addTag)}
                className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="bg-cyan-600 text-white hover:bg-cyan-700 border-cyan-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Resource Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FileText className="h-5 w-5 text-blue-600" />
            Resource Links
          </div>
          <div className="space-y-3">
            {lesson.resourceLinks?.map((link, index) => (
              <Card key={index} className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 text-xs font-bold rounded-full">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-blue-800">Resource Link {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeResourceLink(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Title</Label>
                      <Input 
                        value={link.title}
                        onChange={(e) => updateResourceLink(index, "title", e.target.value)}
                        placeholder="Resource title"
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">URL</Label>
                      <Input 
                        value={link.url}
                        onChange={(e) => updateResourceLink(index, "url", e.target.value)}
                        placeholder="https://..."
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-sm font-medium text-gray-700">Description</Label>
                    <Textarea 
                      value={link.description || ""}
                      onChange={(e) => updateResourceLink(index, "description", e.target.value)}
                      placeholder="Brief description of the resource"
                      rows={2}
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addResourceLink}
              className="w-full h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Resource Link
            </Button>
          </div>
        </div>

        <Separator />

        {/* Teacher Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FileText className="h-5 w-5 text-slate-600" />
            Teacher Notes
          </div>
          <Textarea 
            id={`lesson-teacher-notes-${lesson.id}`}
            placeholder="Private notes for teachers (not visible to students)"
            className="resize-none border-slate-300 focus:border-slate-500 focus:ring-slate-500"
            rows={4}
            value={lesson.teacherNotes || ""}
            onChange={(e) => onUpdate("teacherNotes", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
