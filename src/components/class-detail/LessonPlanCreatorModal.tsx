import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Plus, 
  X, 
  Target, 
  Activity, 
  CheckSquare, 
  FileText, 
  Video, 
  Package, 
  Tag,
  Timer,
  Hash,
  ClipboardList,
  Home,
  Play,
  Trophy,
  Lightbulb,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Wand2,
  Brain,
  Loader2,
  Save
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Types based on your existing LessonPlan interface
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

interface LessonPlanData {
  id: string;
  title: string;
  description: string;
  type: LessonType;
  duration: number;
  sequenceNumber: number;
  objectives: CreateLessonObjectiveDto[];
  activities: CreateLessonActivityDto[];
  resourceFiles: CreateResourceFileDto[];
  resourceLinks: CreateResourceLinkDto[];
  isCompleted: boolean;
  scheduledDate?: Date;
  teachingNotes: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedPreparationTime: number;
  starterActivity: string;
  plenaryActivity: string;
  assessmentCriteria: string;
  homework: string;
  prerequisites: string;
  tags: string[];
  status: LessonStatus;
}

interface LessonPlanCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (lessonPlan: Partial<LessonPlanData>) => void;
  initialData?: Partial<LessonPlanData>;
  nextSequenceNumber: number;
}

const LessonPlanCreatorModal: React.FC<LessonPlanCreatorModalProps> = ({
  open,
  onOpenChange,
  onSave,
  initialData,
  nextSequenceNumber
}) => {
  // Initialize lesson plan state
  const [lessonPlan, setLessonPlan] = useState<Partial<LessonPlanData>>({
    id: `lesson-${Date.now()}`,
    title: "",
    description: "",
    type: LessonType.LECTURE,
    duration: 60,
    sequenceNumber: nextSequenceNumber,
    objectives: [],
    activities: [],
    resourceFiles: [],
    resourceLinks: [],
    isCompleted: false,
    teachingNotes: "",
    difficultyLevel: 'intermediate',
    estimatedPreparationTime: 30,
    starterActivity: "",
    plenaryActivity: "",
    assessmentCriteria: "",
    homework: "",
    prerequisites: "",
    tags: [],
    status: LessonStatus.DRAFT,
    ...initialData
  });

  const [newObjective, setNewObjective] = useState("");
  const [newTag, setNewTag] = useState("");
  const [activeSection, setActiveSection] = useState("topic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Update lesson plan field
  const updateField = (field: string, value: any) => {
    setLessonPlan(prev => ({ ...prev, [field]: value }));
  };

  // Section completion tracking
  const getSectionCompletionStatus = () => {
    return {
      topic: !!(lessonPlan.title && lessonPlan.type && lessonPlan.duration),
      requirements: !!(lessonPlan.prerequisites || (lessonPlan.tags && lessonPlan.tags.length > 0)),
      objectives: !!(lessonPlan.objectives && lessonPlan.objectives.length > 0),
      starter: !!(lessonPlan.starterActivity),
      main: !!(lessonPlan.description || (lessonPlan.activities && lessonPlan.activities.length > 0)),
      plenary: !!(lessonPlan.plenaryActivity || lessonPlan.assessmentCriteria || lessonPlan.homework || lessonPlan.teachingNotes)
    };
  };

  const completionStatus = getSectionCompletionStatus();

  // Objective management
  const addObjective = () => {
    if (newObjective.trim()) {
      const objectives = lessonPlan.objectives || [];
      const newObj: CreateLessonObjectiveDto = {
        objective: newObjective.trim(),
        isCompleted: false
      };
      updateField("objectives", [...objectives, newObj]);
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    const objectives = lessonPlan.objectives || [];
    updateField("objectives", objectives.filter((_, i) => i !== index));
  };

  const updateObjective = (index: number, field: keyof CreateLessonObjectiveDto, value: any) => {
    const objectives = lessonPlan.objectives || [];
    const updated = objectives.map((obj, i) => 
      i === index ? { ...obj, [field]: value } : obj
    );
    updateField("objectives", updated);
  };

  // Activity management
  const addActivity = () => {
    const activities = lessonPlan.activities || [];
    const newActivity: CreateLessonActivityDto = {
      title: "",
      description: "",
      duration: 15,
      instructions: "",
      resourceFiles: [],
      resourceLinks: []
    };
    updateField("activities", [...activities, newActivity]);
  };

  const updateActivity = (index: number, field: keyof CreateLessonActivityDto, value: any) => {
    const activities = lessonPlan.activities || [];
    const updated = activities.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    );
    updateField("activities", updated);
  };

  const removeActivity = (index: number) => {
    const activities = lessonPlan.activities || [];
    updateField("activities", activities.filter((_, i) => i !== index));
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim()) {
      const tags = lessonPlan.tags || [];
      updateField("tags", [...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const tags = lessonPlan.tags || [];
    updateField("tags", tags.filter((_, i) => i !== index));
  };

  // Resource link management
  const addResourceLink = () => {
    const resourceLinks = lessonPlan.resourceLinks || [];
    const newLink: CreateResourceLinkDto = {
      title: "",
      url: "",
      description: ""
    };
    updateField("resourceLinks", [...resourceLinks, newLink]);
  };

  const updateResourceLink = (index: number, field: keyof CreateResourceLinkDto, value: string) => {
    const resourceLinks = lessonPlan.resourceLinks || [];
    const updated = resourceLinks.map((link, i) => 
      i === index ? { ...link, [field]: value } : link
    );
    updateField("resourceLinks", updated);
  };

  const removeResourceLink = (index: number) => {
    const resourceLinks = lessonPlan.resourceLinks || [];
    updateField("resourceLinks", resourceLinks.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // AI Helper function
  const generateAIContent = async () => {
    if (!lessonPlan.title) {
      setAiError("Please add a lesson title first to generate a lesson plan");
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      // Mock AI generation - in real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lessonTitle = lessonPlan.title;
      const lessonDuration = lessonPlan.duration || 60;
      
      // Calculate time allocation based on duration
      const introTime = Math.max(5, Math.round(lessonDuration * 0.15));
      const coreTime = Math.max(15, Math.round(lessonDuration * 0.45));
      const practiceTime = Math.max(10, Math.round(lessonDuration * 0.25));
      const wrapTime = Math.max(5, Math.round(lessonDuration * 0.15));
      
      const generatedPlan = `1. Introduction (${introTime} min) - Opening & Context Setting
   - Welcome students and briefly review previous lesson connections
   - Introduce today's topic: "${lessonTitle}"
   - Share the lesson objectives with students
   - Hook: Start with an engaging question or real-world example

2. Core Content Delivery (${coreTime} min) - Main Teaching Phase
   - Break down the key concepts step by step
   - Use multiple teaching methods: visual aids, demonstrations, and interactive explanations
   - Connect new information to students' prior knowledge
   - Encourage questions and check for understanding throughout

3. Guided Practice (${practiceTime} min) - Students Apply with Support
   - Provide structured activities where students practice the concepts
   - Work through examples together as a class
   - Offer immediate feedback and clarification
   - Circulate to provide individual support where needed

4. Wrap-up & Assessment (${wrapTime} min) - Consolidation
   - Summarize the key points covered in today's lesson
   - Quick formative assessment to check understanding
   - Preview what's coming in the next lesson
   - Address any final questions`;

      updateField("description", generatedPlan);
      
    } catch (error) {
      setAiError("Failed to generate lesson plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave(lessonPlan);
    onOpenChange(false);
  };

  const sections = [
    { id: "topic", title: "Topic", icon: BookOpen, description: "Define what you're teaching and set the foundation" },
    { id: "requirements", title: "Requirements", icon: ClipboardList, description: "What students need before attending this lesson" },
    { id: "objectives", title: "Objectives", icon: Target, description: "What students will achieve by the end of this lesson" },
    { id: "starter", title: "Starter", icon: Play, description: "Opening activity to engage students and introduce the topic" },
    { id: "main", title: "Main Activity", icon: Activity, description: "The core learning experience" },
    { id: "plenary", title: "Plenary & Next Steps", icon: Trophy, description: "Consolidate learning and plan forward" }
  ];

  return (
    <div className={cn("fixed inset-0 z-50", open ? "block" : "hidden")}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-kidato-indigo-900/80 via-black/60 to-kidato-purple-900/80 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
        <div className="bg-gradient-to-br from-white via-kidato-indigo-50/50 to-white rounded-2xl shadow-2xl border w-[80vw] max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 px-8 py-6 border-b border-kidato-indigo-100 bg-gradient-to-r from-kidato-indigo-50 to-kidato-spindle-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-kidato-indigo-500 to-kidato-indigo-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-kidato-indigo-800">
                    Create New Lesson Plan
                  </h1>
                  <p className="text-kidato-gray-600 mt-1">
                    Build an engaging lesson with clear objectives and activities
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-kidato-indigo-600 to-kidato-purple-600 text-white hover:from-kidato-indigo-700 hover:to-kidato-purple-700 shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Lesson
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => onOpenChange(false)}
                  className="text-kidato-gray-600 hover:text-kidato-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              {/* Section Navigation */}
              <div className="mb-8">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-2 bg-kidato-gray-100 rounded-xl">
                  {sections.map((section) => {
                      const Icon = section.icon;
                      const isCompleted = completionStatus[section.id as keyof typeof completionStatus];
                      return (
                        <TabsTrigger
                          key={section.id}
                          value={section.id}
                          className="flex flex-col items-center gap-2 px-3 py-4 text-sm data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-kidato-indigo-200 rounded-lg transition-all duration-200"
                        >
                          <div className="flex items-center gap-1">
                            <Icon className={cn(
                              "h-5 w-5",
                              isCompleted ? 'text-kidato-indigo-600' : 'text-kidato-gray-500'
                            )} />
                            {isCompleted && <CheckSquare className="h-4 w-4 text-kidato-indigo-600" />}
                          </div>
                          <span className="font-medium">{section.title}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>

              {/* 1. TOPIC SECTION */}
              <TabsContent value="topic" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kidato-indigo-500 to-kidato-indigo-600 rounded-2xl shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-kidato-indigo-800">Lesson Topic & Overview</h3>
                        <p className="text-sm text-kidato-gray-600">Define what you're teaching and set the foundation</p>
                      </div>
                    </div>

                    <Card className="border-kidato-indigo-200 bg-gradient-to-br from-kidato-indigo-50 to-white shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Hash className="h-5 w-5 text-kidato-indigo-600" />
                            <Label className="text-lg font-semibold text-kidato-indigo-800">
                              Lesson Topic *
                            </Label>
                          </div>
                          <Input 
                            placeholder="e.g., 'Introduction to Photosynthesis' or 'Solving Quadratic Equations'"
                            value={lessonPlan.title || ""}
                            onChange={(e) => updateField("title", e.target.value)}
                            className="text-xl h-16 px-6 py-4 border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white shadow-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="space-y-3 p-5 bg-gradient-to-br from-kidato-orange-50 to-white rounded-2xl border border-kidato-orange-200 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Hash className="h-5 w-5 text-kidato-orange-600" />
                              <Label className="text-base font-semibold text-kidato-orange-800">Lesson #</Label>
                            </div>
                            <Input 
                              type="number"
                              placeholder="1"
                              value={lessonPlan.sequenceNumber || nextSequenceNumber}
                              onChange={(e) => updateField("sequenceNumber", parseInt(e.target.value) || nextSequenceNumber)}
                              className="h-12 text-lg font-semibold text-center border-2 border-kidato-orange-200 focus:border-kidato-orange-500 focus:ring-kidato-orange-500 rounded-xl bg-white shadow-sm"
                            />
                          </div>
                          
                          <div className="space-y-4 p-5 bg-gradient-to-br from-kidato-spindle-50 to-white rounded-2xl border border-kidato-spindle-200 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-kidato-spindle-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">T</span>
                              </div>
                              <Label className="text-base font-semibold text-kidato-spindle-800">Lesson Type *</Label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { type: LessonType.LECTURE, label: 'Lecture', icon: '📖' },
                                { type: LessonType.PRACTICAL, label: 'Practical', icon: '🔬' },
                                { type: LessonType.WORKSHOP, label: 'Workshop', icon: '🛠️' },
                                { type: LessonType.ASSESSMENT, label: 'Assessment', icon: '📝' }
                              ].map(({ type, label, icon }) => {
                                const isSelected = lessonPlan.type === type;
                                
                                return (
                                  <button
                                    key={type}
                                    type="button"
                                    onClick={() => updateField("type", type)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-1",
                                      isSelected 
                                        ? 'bg-kidato-spindle-600 text-white shadow-md border-2 border-kidato-spindle-600' 
                                        : 'bg-white text-kidato-spindle-700 border-2 border-kidato-spindle-200 hover:bg-kidato-spindle-50 hover:border-kidato-spindle-300'
                                    )}
                                  >
                                    <span className="text-sm">{icon}</span>
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-4 p-5 bg-gradient-to-br from-kidato-gray-50 to-white rounded-2xl border border-kidato-gray-200 shadow-sm">
                            <div className="flex items-center gap-2">
                              <Timer className="h-5 w-5 text-kidato-gray-600" />
                              <Label className="text-base font-semibold text-kidato-gray-800">Duration *</Label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {[15, 30, 45, 60, 90, 120].map((minutes) => {
                                const isSelected = lessonPlan.duration === minutes;
                                const hours = Math.floor(minutes / 60);
                                const remainingMinutes = minutes % 60;
                                const displayText = minutes >= 60 
                                  ? `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}` 
                                  : `${minutes}m`;
                                
                                return (
                                  <button
                                    key={minutes}
                                    type="button"
                                    onClick={() => updateField("duration", minutes)}
                                    className={cn(
                                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95",
                                      isSelected 
                                        ? 'bg-kidato-gray-600 text-white shadow-md border-2 border-kidato-gray-600' 
                                        : 'bg-white text-kidato-gray-700 border-2 border-kidato-gray-200 hover:bg-kidato-gray-50 hover:border-kidato-gray-300'
                                    )}
                                  >
                                    {displayText}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 2. REQUIREMENTS SECTION */}
                <TabsContent value="requirements" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                        <ClipboardList className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800">Pre-Session Requirements</h3>
                        <p className="text-sm text-kidato-gray-600">What students need before attending this lesson</p>
                      </div>
                    </div>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-purple-800">Prerequisites Knowledge</Label>
                          <Textarea 
                            placeholder="What knowledge or skills should students have before this lesson?"
                            className="resize-none border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white min-h-[100px]"
                            value={lessonPlan.prerequisites || ""}
                            onChange={(e) => updateField("prerequisites", e.target.value)}
                          />
                        </div>

                        {/* Tags & Keywords */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-kidato-gray-800">Tags & Keywords</h4>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200 min-h-[50px]">
                              {lessonPlan.tags?.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-cyan-200 text-cyan-800">
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
                              {(!lessonPlan.tags || lessonPlan.tags.length === 0) && (
                                <span className="text-cyan-600 text-sm italic">No tags added yet</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Input 
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="e.g., 'biology', 'interactive', 'beginner'"
                                onKeyDown={(e) => handleKeyDown(e, addTag)}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                onClick={addTag}
                                className="bg-cyan-600 text-white hover:bg-cyan-700"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 3. OBJECTIVES SECTION */}
                <TabsContent value="objectives" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kidato-spindle-500 to-kidato-spindle-600 rounded-2xl shadow-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-kidato-spindle-800">Learning Objectives</h3>
                        <p className="text-sm text-kidato-gray-600">What students will achieve by the end of this lesson</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {lessonPlan.objectives?.map((objective, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-kidato-spindle-50 to-white rounded-xl border border-kidato-spindle-200 shadow-sm">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-kidato-orange-500 to-kidato-orange-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-1 shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <Input 
                              value={objective.objective}
                              onChange={(e) => updateObjective(index, "objective", e.target.value)}
                              placeholder="Students will be able to..."
                              className="border-2 border-kidato-spindle-200 focus:border-kidato-spindle-500 focus:ring-kidato-spindle-500 bg-white rounded-xl"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeObjective(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-kidato-indigo-50 to-white rounded-xl border-2 border-dashed border-kidato-indigo-300">
                        <Input 
                          value={newObjective}
                          onChange={(e) => setNewObjective(e.target.value)}
                          placeholder="Students will be able to..."
                          onKeyDown={(e) => handleKeyDown(e, addObjective)}
                          className="border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 bg-white rounded-xl"
                        />
                        <Button
                          type="button"
                          onClick={addObjective}
                          disabled={!newObjective.trim()}
                          className="bg-gradient-to-r from-kidato-spindle-600 to-kidato-orange-600 text-white hover:from-kidato-spindle-700 hover:to-kidato-orange-700 shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 4. STARTER SECTION */}
                <TabsContent value="starter" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-orange-800">Lesson Starter</h3>
                        <p className="text-sm text-kidato-gray-600">Opening activity to engage students and introduce the topic</p>
                      </div>
                    </div>

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-orange-800">Starter Activity</Label>
                          <Textarea 
                            placeholder="How will you open the lesson? e.g., 'Quick review quiz', 'Think-pair-share question', 'Interesting fact or video'"
                            className="resize-none border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white min-h-[120px]"
                            value={lessonPlan.starterActivity || ""}
                            onChange={(e) => updateField("starterActivity", e.target.value)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 5. MAIN ACTIVITY SECTION */}
                <TabsContent value="main" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-800">Core Learning Experience</h3>
                        <p className="text-sm text-kidato-gray-600">The main teaching and learning activities</p>
                      </div>
                    </div>

                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                      <CardContent className="p-6 space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold text-blue-800">Detailed Teaching Plan</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateAIContent}
                              disabled={isGenerating}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 border-0 shadow-sm"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3 mr-1.5" />
                                  AI Helper
                                </>
                              )}
                            </Button>
                          </div>
                          <Textarea 
                            placeholder="Describe your step-by-step lesson flow:

1. Opening (5 min) - Quick review of previous lesson...
2. Introduction (10 min) - Introduce today's topic with...
3. Main Activity (20 min) - Students will...
4. Wrap-up (5 min) - Summarize key points..."
                            className="resize-none border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white min-h-[200px]"
                            value={lessonPlan.description || ""}
                            onChange={(e) => updateField("description", e.target.value)}
                          />
                          {aiError && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertDescription>{aiError}</AlertDescription>
                            </Alert>
                          )}
                        </div>

                        {/* Interactive Activities */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-kidato-gray-800">Interactive Activities</h4>
                          <div className="space-y-4">
                            {lessonPlan.activities?.map((activity, index) => (
                              <Card key={index} className="border-blue-200 bg-blue-50/50">
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center justify-center w-8 h-8 bg-blue-200 text-blue-800 text-sm font-bold rounded-full">
                                        {index + 1}
                                      </div>
                                      <span className="text-sm font-medium text-blue-800">Activity {index + 1}</span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeActivity(index)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input 
                                      value={activity.title}
                                      onChange={(e) => updateActivity(index, "title", e.target.value)}
                                      placeholder="Activity Name"
                                      className="bg-white"
                                    />
                                    <Input 
                                      value={activity.description || ""}
                                      onChange={(e) => updateActivity(index, "description", e.target.value)}
                                      placeholder="What Students Do"
                                      className="bg-white"
                                    />
                                    <div className="space-y-2">
                                      <div className="flex flex-wrap gap-1">
                                        {[5, 10, 15, 20, 30].map((minutes) => (
                                          <button
                                            key={minutes}
                                            type="button"
                                            onClick={() => updateActivity(index, "duration", minutes)}
                                            className={cn(
                                              "px-2 py-1 rounded text-xs font-medium transition-all",
                                              activity.duration === minutes 
                                                ? 'bg-blue-500 text-white shadow-md' 
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            )}
                                          >
                                            {minutes}m
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <Textarea 
                                    value={activity.instructions || ""}
                                    onChange={(e) => updateActivity(index, "instructions", e.target.value)}
                                    placeholder="Step-by-step instructions for students"
                                    rows={2}
                                    className="bg-white"
                                  />
                                </CardContent>
                              </Card>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addActivity}
                              className="w-full h-12 border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Plus className="h-5 w-5 mr-2" />
                              Add Activity
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* 6. PLENARY & NEXT STEPS SECTION */}
                <TabsContent value="plenary" className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-800">Wrap-up & Next Steps</h3>
                        <p className="text-sm text-kidato-gray-600">Consolidate learning and plan forward</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Plenary/Summary */}
                      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-purple-600" />
                            <Label className="text-base font-semibold text-purple-800">Plenary/Summary</Label>
                          </div>
                          <Textarea 
                            placeholder="How will you wrap up the lesson? e.g., 'Students share one thing they learned', 'Quick recap of key points'"
                            className="resize-none border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white min-h-[100px]"
                            value={lessonPlan.plenaryActivity || ""}
                            onChange={(e) => updateField("plenaryActivity", e.target.value)}
                          />
                        </CardContent>
                      </Card>

                      {/* Assessment Methods */}
                      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white shadow-lg">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-green-600" />
                            <Label className="text-base font-semibold text-green-800">Assessment Methods</Label>
                          </div>
                          <Textarea 
                            placeholder="How will you check understanding? e.g., 'Exit ticket', 'Quick quiz', 'Student explanations'"
                            className="resize-none border-2 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white min-h-[100px]"
                            value={lessonPlan.assessmentCriteria || ""}
                            onChange={(e) => updateField("assessmentCriteria", e.target.value)}
                          />
                        </CardContent>
                      </Card>

                      {/* Student Next Steps */}
                      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-lg">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-blue-600" />
                            <Label className="text-base font-semibold text-blue-800">Student Next Steps</Label>
                          </div>
                          <Textarea 
                            placeholder="Homework, practice, or preparation tasks. e.g., 'Complete practice problems 1-10', 'Read chapter 5'"
                            className="resize-none border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white min-h-[100px]"
                            value={lessonPlan.homework || ""}
                            onChange={(e) => updateField("homework", e.target.value)}
                          />
                        </CardContent>
                      </Card>

                      {/* Teacher Reflection Notes */}
                      <Card className="border-kidato-gray-200 bg-gradient-to-br from-kidato-gray-50 to-white shadow-lg">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-kidato-gray-600" />
                            <Label className="text-base font-semibold text-kidato-gray-800">Teacher Reflection Notes</Label>
                          </div>
                          <Textarea 
                            placeholder="Private reminders, challenges, backup plans. e.g., 'Check projector', 'Bring extra materials', 'Sarah needs extra help'"
                            className="resize-none border-2 border-kidato-gray-200 focus:border-kidato-gray-500 focus:ring-kidato-gray-500 rounded-xl bg-white min-h-[100px]"
                            value={lessonPlan.teachingNotes || ""}
                            onChange={(e) => updateField("teachingNotes", e.target.value)}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-kidato-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-kidato-gray-600">
                    Section {sections.findIndex((s) => s.id === activeSection) + 1} of {sections.length}
                  </div>
                  <div className="flex gap-3">
                    {sections.findIndex((s) => s.id === activeSection) > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const currentIndex = sections.findIndex((s) => s.id === activeSection);
                          setActiveSection(sections[currentIndex - 1].id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    )}
                    {sections.findIndex((s) => s.id === activeSection) < sections.length - 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          const currentIndex = sections.findIndex((s) => s.id === activeSection);
                          setActiveSection(sections[currentIndex + 1].id);
                        }}
                        className="flex items-center gap-2 bg-kidato-indigo-600 hover:bg-kidato-indigo-700 text-white"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                    {sections.findIndex((s) => s.id === activeSection) === sections.length - 1 && (
                      <Button
                        type="button"
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-kidato-indigo-600 hover:bg-kidato-indigo-700 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Save Lesson Plan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanCreatorModal;