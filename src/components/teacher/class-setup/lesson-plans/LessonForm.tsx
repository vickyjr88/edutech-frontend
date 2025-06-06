
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
  AlertCircle,
  Hash,
  Timer
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
    <Card className="w-full shadow-lg border-l-4 border-l-kidato-indigo-500 bg-gradient-to-br from-white to-kidato-indigo-50/30">
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
        {/* 1. What Will You Teach? - Enhanced Lesson Basics */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-xl font-bold text-kidato-indigo-800">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kidato-indigo-500 to-kidato-indigo-600 rounded-2xl shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-kidato-indigo-100 text-kidato-indigo-700 px-3 py-1 rounded-full text-sm font-bold tracking-wide">STEP 1</span>
              </div>
              <h3 className="text-xl font-bold text-kidato-indigo-800 mt-1">What Will You Teach In This Lesson?</h3>
            </div>
          </div>
          
          {/* Enhanced Lesson Title Section */}
          <div className="space-y-4 p-6 bg-gradient-to-br from-kidato-indigo-50 to-white rounded-2xl border border-kidato-indigo-200 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-kidato-indigo-600" />
                <Label htmlFor={`lesson-title-${lesson.id}`} className="text-lg font-semibold text-kidato-indigo-800">
                  Lesson Topic *
                </Label>
              </div>
              <div className="relative">
                <Input 
                  id={`lesson-title-${lesson.id}`}
                  placeholder="e.g., 'Introduction to Photosynthesis' or 'Solving Quadratic Equations'"
                  value={lesson.title || ""}
                  onChange={(e) => onUpdate("title", e.target.value)}
                  className="text-xl h-16 px-6 py-4 border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white shadow-sm transition-all duration-200 placeholder:text-gray-400"
                />
                {lesson.title && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor={`lesson-summary-${lesson.id}`} className="text-base font-medium text-kidato-indigo-700">
                What's this lesson about? (Brief summary)
              </Label>
              <Textarea 
                id={`lesson-summary-${lesson.id}`}
                placeholder="In 1-2 sentences, what will students learn in this lesson?"
                className="resize-none border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white text-base p-4 shadow-sm transition-all duration-200"
                rows={3}
                value={lesson.summary || ""}
                onChange={(e) => onUpdate("summary", e.target.value)}
              />
            </div>
          </div>

          {/* Enhanced Quick Setup Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lesson Number */}
            <div className="space-y-3 p-5 bg-gradient-to-br from-kidato-orange-50 to-white rounded-2xl border border-kidato-orange-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-kidato-orange-600" />
                <Label className="text-base font-semibold text-kidato-orange-800">Lesson #</Label>
              </div>
              <Input 
                type="number"
                placeholder="1"
                value={lesson.lessonNumber || lessonNumber}
                onChange={(e) => onUpdate("lessonNumber", parseInt(e.target.value) || lessonNumber)}
                className="h-12 text-lg font-semibold text-center border-2 border-kidato-orange-200 focus:border-kidato-orange-500 focus:ring-kidato-orange-500 rounded-xl bg-white shadow-sm"
              />
            </div>
            
            {/* Enhanced Lesson Type Selection */}
            <div className="space-y-4 p-5 bg-gradient-to-br from-kidato-spindle-50 to-white rounded-2xl border border-kidato-spindle-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-kidato-spindle-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <Label className="text-base font-semibold text-kidato-spindle-800">Lesson Type *</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(LessonType).slice(0, 4).map((type) => {
                  const isSelected = lesson.type === type;
                  const typeLabels = {
                    [LessonType.LECTURE]: { label: 'Lecture', icon: '📖' },
                    [LessonType.PRACTICAL]: { label: 'Practical', icon: '🔬' },
                    [LessonType.WORKSHOP]: { label: 'Workshop', icon: '🛠️' },
                    [LessonType.ASSESSMENT]: { label: 'Assessment', icon: '📝' }
                  };
                  const typeInfo = typeLabels[type as keyof typeof typeLabels];
                  
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onUpdate("type", type)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-1
                        ${isSelected 
                          ? 'bg-kidato-spindle-600 text-white shadow-md border-2 border-kidato-spindle-600' 
                          : 'bg-white text-kidato-spindle-700 border-2 border-kidato-spindle-200 hover:bg-kidato-spindle-50 hover:border-kidato-spindle-300'
                        }
                      `}
                    >
                      <span className="text-sm">{typeInfo.icon}</span>
                      {typeInfo.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Duration Selection */}
            <div className="space-y-4 p-5 bg-gradient-to-br from-kidato-gray-50 to-white rounded-2xl border border-kidato-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-kidato-gray-600" />
                <Label className="text-base font-semibold text-kidato-gray-800">Duration *</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {[15, 30, 45, 60, 90, 120].map((minutes) => {
                  const isSelected = lesson.duration === minutes;
                  const displayText = minutes >= 60 ? `${minutes / 60}h${minutes % 60 > 0 ? ` ${minutes % 60}m` : ''}` : `${minutes}m`;
                  
                  return (
                    <button
                      key={minutes}
                      type="button"
                      onClick={() => onUpdate("duration", minutes)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
                        ${isSelected 
                          ? 'bg-kidato-gray-600 text-white shadow-md border-2 border-kidato-gray-600' 
                          : 'bg-white text-kidato-gray-700 border-2 border-kidato-gray-200 hover:bg-kidato-gray-50 hover:border-kidato-gray-300'
                        }
                      `}
                    >
                      {displayText}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* 2. Learning Goals - What will students achieve by the end? */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-purple-600 font-bold text-sm mr-2">STEP 2</span>
            Learning Objectives - What Will Students Achieve?
          </div>
          <p className="text-sm text-gray-600 mb-4">
            💡 <strong>What will students be able to do</strong> after this lesson that they couldn't do before?
          </p>
          
          <div className="space-y-4">
            {lesson.objectives?.map((objective, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-300">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-200 text-purple-800 text-sm font-bold rounded-full flex-shrink-0 mt-1">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <Input 
                    value={objective.objective}
                    onChange={(e) => updateObjective(index, "objective", e.target.value)}
                    placeholder="e.g., 'Students will be able to identify the main parts of a plant cell'"
                    className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeObjective(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-dashed border-purple-300">
              <Input 
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add a learning goal starting with 'Students will be able to...'"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addObjective();
                  }
                }}
                className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
              />
              <Button
                type="button"
                onClick={addObjective}
                disabled={!newObjective.trim()}
                className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* 3. Prerequisites - What do students need to know first? */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <span className="text-indigo-600 font-bold text-sm mr-2">STEP 3</span>
            Prerequisites - What Should Students Know First?
          </div>
          <p className="text-sm text-gray-600 mb-4">
            📚 <strong>What knowledge or skills</strong> should students have before attending this lesson?
          </p>
          
          <Textarea 
            id={`lesson-prerequisites-${lesson.id}`}
            placeholder="e.g., 'Students should know basic multiplication tables' or 'Students should understand what atoms are'"
            className="resize-none border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            value={lesson.prerequisites || ""}
            onChange={(e) => onUpdate("prerequisites", e.target.value)}
          />
        </div>

        <Separator />

        {/* 4. Lesson Flow - How will you deliver this step by step? */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Activity className="h-5 w-5 text-orange-600" />
            <span className="text-orange-600 font-bold text-sm mr-2">STEP 4</span>
            Lesson Flow - How Will You Deliver This?
          </div>
          <p className="text-sm text-gray-600 mb-4">
            ⏰ <strong>Plan your lesson timeline</strong> - what happens first, second, third?
          </p>
          
          <div className="space-y-2">
            <Label htmlFor={`lesson-description-${lesson.id}`} className="text-sm font-medium text-gray-700">
              Detailed Teaching Plan
            </Label>
            <Textarea 
              id={`lesson-description-${lesson.id}`}
              placeholder="Describe how you'll teach this lesson step by step:\n\n1. Opening (5 min) - Quick review of previous lesson...\n2. Introduction (10 min) - Introduce today's topic with...\n3. Main Activity (20 min) - Students will...\n4. Wrap-up (5 min) - Summarize key points..."
              className="resize-none border-orange-300 focus:border-orange-500 focus:ring-orange-500"
              rows={6}
              value={lesson.description || ""}
              onChange={(e) => onUpdate("description", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* 5. Activities - Interactive things students will do */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Activity className="h-5 w-5 text-orange-600" />
            <span className="text-orange-600 font-bold text-sm mr-2">STEP 5</span>
            Activities - What Will Students Do?
          </div>
          <p className="text-sm text-gray-600 mb-4">
            🎯 <strong>Interactive activities</strong> that engage students and help them practice what they're learning
          </p>
          
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
                      <Label className="text-sm font-medium text-gray-700">Activity Name</Label>
                      <Input 
                        value={activity.title}
                        onChange={(e) => updateActivity(index, "title", e.target.value)}
                        placeholder="e.g., 'Plant Cell Drawing', 'Math Problem Solving'"
                        className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">What Students Do</Label>
                      <Input 
                        value={activity.description}
                        onChange={(e) => updateActivity(index, "description", e.target.value)}
                        placeholder="e.g., 'Work in pairs to label diagram'"
                        className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Duration</Label>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {[5, 10, 15, 20, 30].map((minutes) => {
                            const isSelected = activity.duration === minutes;
                            return (
                              <button
                                key={minutes}
                                type="button"
                                onClick={() => updateActivity(index, "duration", minutes)}
                                className={`
                                  px-2 py-1 rounded text-xs font-medium transition-all duration-200
                                  ${isSelected 
                                    ? 'bg-orange-500 text-white shadow-md' 
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                  }
                                `}
                              >
                                {minutes}m
                              </button>
                            );
                          })}
                        </div>
                        <Input 
                          type="number"
                          value={![5, 10, 15, 20, 30].includes(activity.duration) ? activity.duration : ""}
                          onChange={(e) => updateActivity(index, "duration", parseInt(e.target.value) || 0)}
                          placeholder="Custom duration"
                          className="border-orange-300 focus:border-orange-500 focus:ring-orange-500 bg-white text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Step-by-Step Instructions</Label>
                    <Textarea 
                      value={activity.instructions}
                      onChange={(e) => updateActivity(index, "instructions", e.target.value)}
                      placeholder="Write clear instructions for students:\n1. First, students will...\n2. Then they should...\n3. Finally..."
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

        {/* 6. Assessment & Follow-up */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <CheckSquare className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-600 font-bold text-sm mr-2">STEP 6</span>
            Assessment & Follow-up
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-gray-800">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                How Will You Check Understanding?
              </div>
              <p className="text-sm text-gray-600 mb-2">
                📝 How will you know students learned what you taught?
              </p>
              <Textarea 
                id={`lesson-assessment-${lesson.id}`}
                placeholder="e.g., 'Exit ticket with 3 questions', 'Students explain concept to partner', 'Quick quiz at end of class'"
                className="resize-none border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                rows={3}
                value={lesson.assessmentCriteria || ""}
                onChange={(e) => onUpdate("assessmentCriteria", e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-medium text-gray-800">
                <Home className="h-4 w-4 text-pink-600" />
                What Will Students Do Next?
              </div>
              <p className="text-sm text-gray-600 mb-2">
                🏠 Homework, practice, or preparation for next lesson
              </p>
              <Textarea 
                id={`lesson-homework-${lesson.id}`}
                placeholder="e.g., 'Practice problems 1-10 on page 45', 'Find 3 examples of photosynthesis in nature', 'Read chapter 5 before next class'"
                className="resize-none border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                rows={3}
                value={lesson.homework || ""}
                onChange={(e) => onUpdate("homework", e.target.value)}
              />
            </div>
          </div>
        </div>


        <Separator />

        {/* 7. Materials & Resources */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Package className="h-5 w-5 text-kidato-indigo-600" />
            <span className="text-kidato-indigo-600 font-bold text-sm mr-2">STEP 7</span>
            Materials & Resources
          </div>
          <p className="text-sm text-gray-600 mb-4">
            📦 <strong>What do you and your students need</strong> for this lesson to work well?
          </p>
          
          {/* Add Requirements Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.VIDEO)}
              className="bg-kidato-indigo-600 text-white hover:bg-kidato-indigo-700 border-kidato-indigo-600"
            >
              <Video className="h-4 w-4 mr-1" />
              Add Video
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.ARTICLE)}
              className="bg-kidato-orange-500 text-white hover:bg-kidato-orange-600 border-kidato-orange-500"
            >
              <FileText className="h-4 w-4 mr-1" />
              Add Article
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.WORKSHEET)}
              className="bg-kidato-spindle-600 text-white hover:bg-kidato-spindle-700 border-kidato-spindle-600"
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Add Worksheet
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.SURVEY)}
              className="bg-kidato-indigo-400 text-white hover:bg-kidato-indigo-500 border-kidato-indigo-400"
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Add Survey
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.MATERIALS)}
              className="bg-kidato-orange-400 text-white hover:bg-kidato-orange-500 border-kidato-orange-400"
            >
              <Package className="h-4 w-4 mr-1" />
              Add Materials
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addRequirement(RequirementType.DOCUMENT_UPLOAD)}
              className="bg-kidato-gray-600 text-white hover:bg-kidato-gray-700 border-kidato-gray-600"
            >
              <FileText className="h-4 w-4 mr-1" />
              Add Document Upload
            </Button>
          </div>

          {/* Requirements List */}
          <div className="space-y-4">
            {(Array.isArray(lesson.requirements) ? lesson.requirements : [])?.map((requirement, index) => (
              <Card key={index} className="border-kidato-gray-200 bg-kidato-gray-50/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize bg-kidato-indigo-100 text-kidato-indigo-800">
                        {requirement.type.replace('_', ' ')}
                      </Badge>
                      {requirement.isRequired && (
                        <Badge className="bg-kidato-orange-500 text-white">Required</Badge>
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
                        className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Input 
                        value={requirement.description || ""}
                        onChange={(e) => updateRequirement(index, "description", e.target.value)}
                        placeholder="Brief description"
                        className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
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
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Estimated Duration (minutes)</Label>
                        <Input 
                          type="number"
                          value={requirement.estimatedDuration || ""}
                          onChange={(e) => updateRequirement(index, "estimatedDuration", parseInt(e.target.value) || 0)}
                          placeholder="e.g. 15"
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
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
                        className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
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
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Platform</Label>
                        <Input 
                          value={requirement.surveyPlatform || ""}
                          onChange={(e) => updateRequirement(index, "surveyPlatform", e.target.value)}
                          placeholder="e.g. Google Forms, SurveyMonkey"
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
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
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Where to Get</Label>
                        <Input 
                          value={requirement.whereToGet || ""}
                          onChange={(e) => updateRequirement(index, "whereToGet", e.target.value)}
                          placeholder="e.g. Local store, online, provided by school"
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
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
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Max File Size (MB)</Label>
                        <Input 
                          type="number"
                          value={requirement.maxFileSize || ""}
                          onChange={(e) => updateRequirement(index, "maxFileSize", parseInt(e.target.value) || 0)}
                          placeholder="e.g. 10"
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Upload Instructions</Label>
                        <Textarea 
                          value={requirement.uploadInstructions || ""}
                          onChange={(e) => updateRequirement(index, "uploadInstructions", e.target.value)}
                          placeholder="Instructions for file upload"
                          rows={1}
                          className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
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
                        className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Notes</Label>
                      <Textarea 
                        value={requirement.notes || ""}
                        onChange={(e) => updateRequirement(index, "notes", e.target.value)}
                        placeholder="Internal notes for teachers"
                        rows={2}
                        className="border-kidato-gray-300 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        <Separator />

        {/* 8. Quick References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <Tag className="h-5 w-5 text-cyan-600" />
              <span className="text-cyan-600 font-bold text-sm mr-2">STEP 8</span>
              Tags & Keywords
            </div>
            <p className="text-sm text-gray-600 mb-4">
              🏷️ <strong>Tags help organize</strong> and find this lesson later
            </p>
            
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
                  placeholder="e.g., 'biology', 'interactive', 'beginner'"
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
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Helpful Links
            </div>
            <p className="text-sm text-gray-600 mb-4">
              🔗 <strong>Useful websites or resources</strong> for this lesson
            </p>
            
            <div className="space-y-3">
              {lesson.resourceLinks?.map((link, index) => (
                <Card key={index} className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-800 text-xs font-bold rounded-full">
                          {index + 1}
                        </div>
                        <span className="text-xs font-medium text-blue-800">Link {index + 1}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResourceLink(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input 
                        value={link.title}
                        onChange={(e) => updateResourceLink(index, "title", e.target.value)}
                        placeholder="Link title"
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-sm h-8"
                      />
                      <Input 
                        value={link.url}
                        onChange={(e) => updateResourceLink(index, "url", e.target.value)}
                        placeholder="https://..."
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-sm h-8"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addResourceLink}
                className="w-full h-10 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* 9. Teacher Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <FileText className="h-5 w-5 text-slate-600" />
            <span className="text-slate-600 font-bold text-sm mr-2">STEP 9</span>
            Private Teacher Notes
          </div>
          <p className="text-sm text-gray-600 mb-4">
            📝 <strong>Your private reminders</strong> - things to remember, potential challenges, backup plans
          </p>
          
          <Textarea 
            id={`lesson-teacher-notes-${lesson.id}`}
            placeholder="Write yourself reminders like:\n• Don't forget to bring extra pencils\n• If activity finishes early, have backup questions ready\n• Sarah might need extra help with this concept\n• Remember to check projector before class"
            className="resize-none border-slate-300 focus:border-slate-500 focus:ring-slate-500"
            rows={4}
            value={lesson.teacherNotes || ""}
            onChange={(e) => onUpdate("teacherNotes", e.target.value)}
          />
        </div>
        
        {/* Status */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <Label htmlFor={`lesson-status-${lesson.id}`} className="text-sm font-medium text-gray-700">
              Lesson Status
            </Label>
            <Select
              value={lesson.status || LessonStatus.DRAFT}
              onValueChange={(value) => onUpdate("status", value as LessonStatus)}
            >
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LessonStatus.DRAFT}>Draft - Still working on it</SelectItem>
                <SelectItem value={LessonStatus.SCHEDULED}>Ready to Teach</SelectItem>
                <SelectItem value={LessonStatus.IN_PROGRESS}>Currently Teaching</SelectItem>
                <SelectItem value={LessonStatus.COMPLETED}>Finished Teaching</SelectItem>
                <SelectItem value={LessonStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
