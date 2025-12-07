import React, { useState, useEffect } from "react";
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
  Loader2
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  url?: string;
  thumbnail?: string;
  worksheetUrl?: string;
  surveyUrl?: string;
  surveyPlatform?: string;
  materialsDescription?: string;
  materialsList?: string[];
  whereToGet?: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  uploadInstructions?: string;
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
    duration?: number;
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
    starterActivity?: string;
    plenaryActivity?: string;
  };
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  isRemovable: boolean;
  lessonNumber: number;
  isImported?: boolean;
  importSource?: string;
  importedAt?: Date;
}

export const LessonFormRedesigned = ({
  lesson,
  onUpdate,
  onRemove,
  isRemovable,
  lessonNumber,
  isImported = false,
  importSource,
  importedAt
}: LessonFormProps) => {
  const [newObjective, setNewObjective] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [activeSection, setActiveSection] = useState("topic");
  
  // AI Helper state
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>(["all"]);

  // Section completion tracking
  const getSectionCompletionStatus = () => {
    return {
      topic: !!(lesson.title && lesson.type && lesson.duration),
      requirements: !!(lesson.prerequisites || (lesson.requirements && lesson.requirements.length > 0) || (lesson.tags && lesson.tags.length > 0)),
      objectives: !!(lesson.objectives && lesson.objectives.length > 0),
      starter: !!(lesson.starterActivity),
      main: !!(lesson.description || (lesson.activities && lesson.activities.length > 0)),
      plenary: !!(lesson.plenaryActivity || lesson.assessmentCriteria || lesson.homework || lesson.teacherNotes)
    };
  };

  const completionStatus = getSectionCompletionStatus();

  // Handle dynamic lesson prop updates (important for imported course data)
  useEffect(() => {
    // This effect ensures the component updates when lesson prop changes
    // Particularly useful when lesson data is imported from course outlines
    if (lesson && isImported) {
      // Component will re-render with new lesson data
      // All form fields will update automatically due to controlled component pattern
    }
  }, [lesson, isImported]);

  // Objective management
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

  // Activity management
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

  // Requirement management
  const addRequirement = (type: RequirementType) => {
    const requirements = Array.isArray(lesson.requirements) ? lesson.requirements : [];
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
    const requirements = Array.isArray(lesson.requirements) ? lesson.requirements : [];
    const updated = requirements.map((req, i) => 
      i === index ? { ...req, [field]: value } : req
    );
    onUpdate("requirements", updated);
  };

  const removeRequirement = (index: number) => {
    const requirements = Array.isArray(lesson.requirements) ? lesson.requirements : [];
    onUpdate("requirements", requirements.filter((_, i) => i !== index));
  };

  // Tag management
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

  // Resource link management
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

  // AI Helper functions
  const generateAIContent = async () => {
    const lessonTitle = lesson.title;
    const lessonDuration = lesson.duration || 60;
    const objectives = lesson.objectives || [];
    
    if (!lessonTitle) {
      setAiError("Please add a lesson title first to generate a lesson plan");
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const generatedPlan = generateMainContent(lessonTitle, lessonDuration, objectives);
      onUpdate("description", generatedPlan);
      
    } catch (error) {
      setAiError("Failed to generate lesson plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTitle = (prompt: string): string => {
    const subject = extractSubject(prompt);
    const topic = extractTopic(prompt);
    return `${subject ? subject + ': ' : ''}${topic || 'Comprehensive Lesson'}`;
  };

  const generateSummary = (prompt: string): string => {
    return `This lesson provides students with a comprehensive understanding of the key concepts in ${extractTopic(prompt) || 'the subject area'}. Students will engage in interactive activities and develop practical skills through hands-on learning experiences.`;
  };

  const generateObjectives = (prompt: string): CreateLessonObjectiveDto[] => {
    const topic = extractTopic(prompt) || "the lesson content";
    return [
      { objective: `Students will be able to understand the fundamental concepts of ${topic}`, isCompleted: false },
      { objective: `Students will be able to apply key principles in practical scenarios`, isCompleted: false },
      { objective: `Students will be able to analyze and evaluate different approaches to ${topic}`, isCompleted: false }
    ];
  };

  const generateStarterActivity = (prompt: string): string => {
    return `Begin with a quick brainstorm: Ask students what they already know about ${extractTopic(prompt) || 'today\'s topic'}. Write their responses on the board and use this as a foundation to introduce new concepts.`;
  };

  const generateMainContent = (lessonTitle: string, duration: number, objectives: CreateLessonObjectiveDto[]): string => {
    const topic = lessonTitle;
    const totalMinutes = duration;
    
    // Calculate time allocation based on duration
    const introTime = Math.max(5, Math.round(totalMinutes * 0.15));
    const coreTime = Math.max(15, Math.round(totalMinutes * 0.45));
    const practiceTime = Math.max(10, Math.round(totalMinutes * 0.25));
    const wrapTime = Math.max(5, Math.round(totalMinutes * 0.15));
    
    let plan = `1. Introduction (${introTime} min) - Opening & Context Setting
   - Welcome students and briefly review previous lesson connections
   - Introduce today's topic: "${topic}"
   - Share the lesson objectives with students
   - Hook: Start with an engaging question or real-world example related to ${topic}

2. Core Content Delivery (${coreTime} min) - Main Teaching Phase
   - Break down the key concepts of ${topic} step by step
   - Use multiple teaching methods: visual aids, demonstrations, and interactive explanations
   - Connect new information to students' prior knowledge
   - Encourage questions and check for understanding throughout`;

    if (objectives.length > 0) {
      plan += `\n   - Address each learning objective:\n`;
      objectives.forEach((obj, index) => {
        plan += `     • ${obj.objective}\n`;
      });
    }

    plan += `
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

    return plan;
  };

  const generateActivities = (prompt: string): CreateLessonActivityDto[] => {
    const topic = extractTopic(prompt) || "the topic";
    return [
      {
        title: "Interactive Discussion",
        description: "Students discuss key concepts in pairs",
        duration: 10,
        instructions: `Have students work in pairs to discuss the main principles of ${topic}. Each pair should identify 2-3 key points and be ready to share with the class.`
      },
      {
        title: "Hands-on Practice",
        description: "Students apply concepts through practical exercises",
        duration: 15,
        instructions: `Provide students with practical exercises that allow them to apply the concepts they've learned about ${topic}. Circulate and provide individual support as needed.`
      }
    ];
  };

  const generatePlenaryActivity = (prompt: string): string => {
    return `Wrap up with a 'One Thing I Learned' activity. Each student shares one key insight from today's lesson. Summarize the main points and preview what's coming in the next lesson.`;
  };

  const generateAssessment = (prompt: string): string => {
    return `Use exit tickets with 3 questions: 1) What is the most important thing you learned today? 2) What questions do you still have? 3) How confident do you feel about applying today's concepts? (Scale 1-5)`;
  };

  const generateHomework = (prompt: string): string => {
    const topic = extractTopic(prompt) || "today's lesson";
    return `Complete practice exercises 1-5 in your workbook. Find one real-world example of ${topic} and write a short paragraph explaining how it connects to what we learned in class.`;
  };

  const generateTeacherNotes = (prompt: string): string => {
    return `• Check projector and materials before class\n• Have backup activities ready if timing runs short\n• Watch for students who might need extra support\n• Keep energy high with movement and interaction\n• Allow flexibility for questions and discussion`;
  };

  const generateTags = (prompt: string): string[] => {
    const tags = ["interactive", "practical", "comprehensive"];
    const topic = extractTopic(prompt);
    if (topic) tags.push(topic.toLowerCase());
    return tags;
  };

  const extractSubject = (prompt: string): string | null => {
    const subjects = ["math", "science", "english", "history", "physics", "chemistry", "biology", "literature", "geography"];
    for (const subject of subjects) {
      if (prompt.toLowerCase().includes(subject)) {
        return subject.charAt(0).toUpperCase() + subject.slice(1);
      }
    }
    return null;
  };

  const extractTopic = (prompt: string): string | null => {
    // Simple extraction - in real implementation, this would use NLP
    const words = prompt.toLowerCase().split(' ');
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'lesson', 'teach', 'students', 'class'];
    const meaningfulWords = words.filter(word => !stopWords.includes(word) && word.length > 3);
    return meaningfulWords.length > 0 ? meaningfulWords[0] : null;
  };

  const applyGeneratedContent = () => {
    if (!generatedContent) return;
    
    const sections = selectedSections.includes("all") ? ["title", "summary", "type", "duration", "objectives", "starter", "main", "activities", "plenary", "assessment", "homework", "notes", "tags"] : selectedSections;
    
    sections.forEach(section => {
      switch (section) {
        case "title":
          onUpdate("title", generatedContent.title);
          break;
        case "summary":
          onUpdate("summary", generatedContent.summary);
          break;
        case "type":
          onUpdate("type", generatedContent.type);
          break;
        case "duration":
          onUpdate("duration", generatedContent.duration);
          break;
        case "objectives":
          onUpdate("objectives", generatedContent.objectives);
          break;
        case "starter":
          onUpdate("starterActivity", generatedContent.starterActivity);
          break;
        case "main":
          onUpdate("description", generatedContent.description);
          break;
        case "activities":
          onUpdate("activities", generatedContent.activities);
          break;
        case "plenary":
          onUpdate("plenaryActivity", generatedContent.plenaryActivity);
          break;
        case "assessment":
          onUpdate("assessmentCriteria", generatedContent.assessmentCriteria);
          break;
        case "homework":
          onUpdate("homework", generatedContent.homework);
          break;
        case "notes":
          onUpdate("teacherNotes", generatedContent.teacherNotes);
          break;
        case "tags":
          onUpdate("tags", generatedContent.tags);
          break;
      }
    });
    
    setIsAIHelperOpen(false);
    setGeneratedContent(null);
    setAiPrompt("");
    setSelectedSections(["all"]);
  };

  const resetAIHelper = () => {
    setAiPrompt("");
    setGeneratedContent(null);
    setAiError(null);
    setSelectedSections(["all"]);
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
    <Card className="w-full shadow-lg border-l-4 border-l-kidato-indigo-500 bg-gradient-to-br from-white to-kidato-indigo-50/30">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-2">
              <span>Lesson {lessonNumber}</span>
              {isImported && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Imported from Course Outline
                </Badge>
              )}
            </div>
          </CardTitle>
          {isRemovable && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          {/* Section Navigation */}
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1 bg-gray-100">
              {sections.map((section) => {
                const Icon = section.icon;
                const isCompleted = completionStatus[section.id as keyof typeof completionStatus];
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex flex-col items-center gap-1 px-2 py-3 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <div className="flex items-center gap-1">
                      <Icon className={`h-4 w-4 ${isCompleted ? 'text-green-600' : 'text-gray-500'}`} />
                      {isCompleted && <CheckSquare className="h-3 w-3 text-green-600" />}
                    </div>
                    <span className="font-medium">{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* 1. TOPIC SECTION */}
          <TabsContent value="topic" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kidato-indigo-500 to-kidato-indigo-600 rounded-2xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-kidato-indigo-800">Lesson Topic & Overview</h3>
                  <p className="text-sm text-gray-600">Define what you're teaching and set the foundation</p>
                </div>
              </div>

              <div className="space-y-4 p-6 bg-gradient-to-br from-kidato-indigo-50 to-white rounded-2xl border border-kidato-indigo-200 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-kidato-indigo-600" />
                    <Label htmlFor={`lesson-title-${lesson.id}`} className="text-lg font-semibold text-kidato-indigo-800">
                      Lesson Topic *
                    </Label>
                  </div>
                  <Input 
                    id={`lesson-title-${lesson.id}`}
                    placeholder="e.g., 'Introduction to Photosynthesis' or 'Solving Quadratic Equations'"
                    value={lesson.title || ""}
                    onChange={(e) => onUpdate("title", e.target.value)}
                    className="text-xl h-16 px-6 py-4 border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white shadow-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor={`lesson-summary-${lesson.id}`} className="text-base font-medium text-kidato-indigo-700">
                    Brief Summary
                  </Label>
                  <Textarea 
                    id={`lesson-summary-${lesson.id}`}
                    placeholder="In 1-2 sentences, what will students learn in this lesson?"
                    className="resize-none border-2 border-kidato-indigo-200 focus:border-kidato-indigo-500 focus:ring-kidato-indigo-500 rounded-xl bg-white text-base p-4 shadow-sm"
                    rows={3}
                    value={lesson.summary || ""}
                    onChange={(e) => onUpdate("summary", e.target.value)}
                  />
                </div>
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
                    value={lesson.lessonNumber || lessonNumber}
                    onChange={(e) => onUpdate("lessonNumber", parseInt(e.target.value) || lessonNumber)}
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
          </TabsContent>

          {/* 2. REQUIREMENTS SECTION */}
          <TabsContent value="requirements" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-800">Pre-Session Requirements</h3>
                  <p className="text-sm text-gray-600">What students need before attending this lesson</p>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200 shadow-sm">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-purple-800">Prerequisites Knowledge</Label>
                  <Textarea 
                    placeholder="What knowledge or skills should students have before this lesson?"
                    className="resize-none border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white"
                    rows={3}
                    value={lesson.prerequisites || ""}
                    onChange={(e) => onUpdate("prerequisites", e.target.value)}
                  />
                </div>
              </div>

              {/* Pre-work Assignments */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Pre-work Assignments</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRequirement(RequirementType.VIDEO)}
                    className="bg-red-500 text-white hover:bg-red-600 border-red-500"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Video to Watch
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRequirement(RequirementType.ARTICLE)}
                    className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Article to Read
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRequirement(RequirementType.WORKSHEET)}
                    className="bg-green-500 text-white hover:bg-green-600 border-green-500"
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Worksheet
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRequirement(RequirementType.SURVEY)}
                    className="bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500"
                  >
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Survey
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRequirement(RequirementType.DOCUMENT_UPLOAD)}
                    className="bg-purple-500 text-white hover:bg-purple-600 border-purple-500"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Document Upload
                  </Button>
                </div>

                <div className="space-y-4">
                  {Array.isArray(lesson.requirements) ? lesson.requirements.map((requirement, index) => (
                    <Card key={index} className="border-gray-200 bg-gray-50/50">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="capitalize">
                            {requirement.type.replace('_', ' ')}
                          </Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequirement(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input 
                            value={requirement.title}
                            onChange={(e) => updateRequirement(index, "title", e.target.value)}
                            placeholder="Title"
                            className="bg-white"
                          />
                          <Input 
                            value={requirement.description || ""}
                            onChange={(e) => updateRequirement(index, "description", e.target.value)}
                            placeholder="Description"
                            className="bg-white"
                          />
                        </div>
                        
                        {requirement.type === RequirementType.VIDEO && (
                          <Input 
                            value={requirement.url || ""}
                            onChange={(e) => updateRequirement(index, "url", e.target.value)}
                            placeholder="Video URL"
                            className="bg-white"
                          />
                        )}
                        
                        {requirement.type === RequirementType.ARTICLE && (
                          <Input 
                            value={requirement.url || ""}
                            onChange={(e) => updateRequirement(index, "url", e.target.value)}
                            placeholder="Article URL"
                            className="bg-white"
                          />
                        )}
                        
                        {requirement.type === RequirementType.WORKSHEET && (
                          <Input 
                            value={requirement.worksheetUrl || ""}
                            onChange={(e) => updateRequirement(index, "worksheetUrl", e.target.value)}
                            placeholder="Worksheet URL"
                            className="bg-white"
                          />
                        )}
                        
                        <Textarea 
                          value={requirement.instructions || ""}
                          onChange={(e) => updateRequirement(index, "instructions", e.target.value)}
                          placeholder="Instructions for students"
                          rows={2}
                          className="bg-white"
                        />
                      </CardContent>
                    </Card>
                  )) : null}
                </div>
              </div>

              {/* Tags & Keywords */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Tags & Keywords</h4>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 p-3 bg-cyan-50 rounded-lg border border-cyan-200 min-h-[50px]">
                    {lesson.tags?.map((tag, index) => (
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
                    {(!lesson.tags || lesson.tags.length === 0) && (
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
            </div>
          </TabsContent>

          {/* 3. OBJECTIVES SECTION */}
          <TabsContent value="objectives" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kidato-spindle-500 to-kidato-spindle-600 rounded-2xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-kidato-spindle-800">Learning Objectives</h3>
                  <p className="text-sm text-gray-600">What students will achieve by the end of this lesson</p>
                </div>
              </div>

              <div className="space-y-4">
                {lesson.objectives?.map((objective, index) => (
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
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-800">Lesson Starter</h3>
                  <p className="text-sm text-gray-600">Opening activity to engage students and introduce the topic</p>
                </div>
              </div>

              <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-200 shadow-sm">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-orange-800">Starter Activity</Label>
                  <Textarea 
                    placeholder="How will you open the lesson? e.g., 'Quick review quiz', 'Think-pair-share question', 'Interesting fact or video'"
                    className="resize-none border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white"
                    rows={4}
                    value={lesson.starterActivity || ""}
                    onChange={(e) => onUpdate("starterActivity", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 5. MAIN ACTIVITY SECTION */}
          <TabsContent value="main" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-800">Core Learning Experience</h3>
                  <p className="text-sm text-gray-600">The main teaching and learning activities</p>
                </div>
              </div>

              {/* Lesson Flow */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200 shadow-sm">
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
                    className="resize-none border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                    rows={6}
                    value={lesson.description || ""}
                    onChange={(e) => onUpdate("description", e.target.value)}
                  />
                  {aiError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{aiError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Interactive Activities */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Interactive Activities</h4>
                <div className="space-y-4">
                  {lesson.activities?.map((activity, index) => (
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
                                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                    activity.duration === minutes 
                                      ? 'bg-blue-500 text-white shadow-md' 
                                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  }`}
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

              {/* Resources and Materials */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Resources & Materials</h4>
                <div className="space-y-3">
                  {lesson.resourceLinks?.map((link, index) => (
                    <Card key={index} className="border-gray-200 bg-gray-50/50">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-gray-600">Resource {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeResourceLink(index)}
                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input 
                            value={link.title}
                            onChange={(e) => updateResourceLink(index, "title", e.target.value)}
                            placeholder="Resource title"
                            className="bg-white text-sm h-8"
                          />
                          <Input 
                            value={link.url}
                            onChange={(e) => updateResourceLink(index, "url", e.target.value)}
                            placeholder="https://..."
                            className="bg-white text-sm h-8"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addResourceLink}
                    className="w-full h-10 border-2 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Resource Link
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 6. PLENARY & NEXT STEPS SECTION */}
          <TabsContent value="plenary" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-800">Wrap-up & Next Steps</h3>
                  <p className="text-sm text-gray-600">Consolidate learning and plan forward</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plenary/Summary */}
                <div className="space-y-3 p-5 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    <Label className="text-base font-semibold text-purple-800">Plenary/Summary</Label>
                  </div>
                  <Textarea 
                    placeholder="How will you wrap up the lesson? e.g., 'Students share one thing they learned', 'Quick recap of key points'"
                    className="resize-none border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl bg-white"
                    rows={3}
                    value={lesson.plenaryActivity || ""}
                    onChange={(e) => onUpdate("plenaryActivity", e.target.value)}
                  />
                </div>

                {/* Assessment Methods */}
                <div className="space-y-3 p-5 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-green-600" />
                    <Label className="text-base font-semibold text-green-800">Assessment Methods</Label>
                  </div>
                  <Textarea 
                    placeholder="How will you check understanding? e.g., 'Exit ticket', 'Quick quiz', 'Student explanations'"
                    className="resize-none border-2 border-green-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white"
                    rows={3}
                    value={lesson.assessmentCriteria || ""}
                    onChange={(e) => onUpdate("assessmentCriteria", e.target.value)}
                  />
                </div>

                {/* Student Next Steps */}
                <div className="space-y-3 p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-600" />
                    <Label className="text-base font-semibold text-blue-800">Student Next Steps</Label>
                  </div>
                  <Textarea 
                    placeholder="Homework, practice, or preparation tasks. e.g., 'Complete practice problems 1-10', 'Read chapter 5'"
                    className="resize-none border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                    rows={3}
                    value={lesson.homework || ""}
                    onChange={(e) => onUpdate("homework", e.target.value)}
                  />
                </div>

                {/* Teacher Reflection Notes */}
                <div className="space-y-3 p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-gray-600" />
                    <Label className="text-base font-semibold text-gray-800">Teacher Reflection Notes</Label>
                  </div>
                  <Textarea 
                    placeholder="Private reminders, challenges, backup plans. e.g., 'Check projector', 'Bring extra materials', 'Sarah needs extra help'"
                    className="resize-none border-2 border-gray-200 focus:border-gray-500 focus:ring-gray-500 rounded-xl bg-white"
                    rows={3}
                    value={lesson.teacherNotes || ""}
                    onChange={(e) => onUpdate("teacherNotes", e.target.value)}
                  />
                </div>
              </div>

              {/* Lesson Status */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Lesson Status</Label>
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Section {sections.findIndex(s => s.id === activeSection) + 1} of {sections.length}
            </div>
            <div className="flex gap-2">
              {sections.findIndex(s => s.id === activeSection) > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    setActiveSection(sections[currentIndex - 1].id);
                  }}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              {sections.findIndex(s => s.id === activeSection) < sections.length - 1 && (
                <Button
                  type="button"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    setActiveSection(sections[currentIndex + 1].id);
                  }}
                  className="flex items-center gap-2 bg-kidato-indigo-600 hover:bg-kidato-indigo-700 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              {sections.findIndex(s => s.id === activeSection) === sections.length - 1 && (
                <Button
                  type="button"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};