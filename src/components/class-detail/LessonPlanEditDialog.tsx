import React, { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Full-screen popup - no dialog components needed
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Workflow,
  Package,
  ClipboardList,
  StickyNote,
  Save,
  X,
  Clock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  Copy,
  RefreshCw,
  Calculator,
  Brain,
  Timer,
  Target,
  Users,
  FileText,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Trophy,
  BookOpen,
  Lightbulb,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { classService } from '@/integrations/api';

// Types matching the comprehensive lesson plan structure
interface LessonObjective {
  objective: string;
  isCompleted: boolean;
  _id?: string;
}

interface LessonRequirement {
  type: 'materials' | 'read_article' | 'worksheet' | 'video' | 'document_upload' | 'survey';
  title: string;
  description: string;
  instructions: string;
  isRequired: boolean;
  materialsDescription?: string;
  materialsList?: string[];
  whereToGet?: string;
  estimatedCost?: string;
  acceptedFileTypes?: string[];
  status: 'pending' | 'completed' | 'in_progress';
  _id?: string;
  attachments?: any[];
  resourceLinks?: any[];
}

interface LessonStarter {
  title: string;
  description: string;
  duration: number;
  instructions: string;
  materialsNeeded: string[];
  _id?: string;
}

interface LessonFlowStep {
  title: string;
  description: string;
  duration: number;
  order: number;
  teachingMethod: 'lecture' | 'demonstration' | 'practical' | 'discussion';
  studentActivity: string;
  teacherInstructions: string;
  materialsNeeded: string[];
  _id?: string;
  resourceFiles?: any[];
  resourceLinks?: any[];
}

interface LessonActivity {
  title: string;
  description: string;
  duration: number;
  instructions: string;
  activityType: 'lecture' | 'discussion' | 'group_work' | 'practical' | 'demonstration' | 'investigation' | 'presentation' | 'role_play' | 'problem_solving' | 'research';
  learningOutcome: string;
  successCriteria: string[];
  differentiation: string;
  resourceFiles?: any[];
  resourceLinks?: any[];
  _id?: string;
}

interface AssessmentMethod {
  method: string;
  description: string;
  timeAllocation: number;
  criteria: string[];
  format: 'written' | 'verbal' | 'practical' | 'online';
  type: 'formative' | 'summative' | 'peer';
  instructions: string;
  _id?: string;
  id?: string;
}

interface LessonPlenary {
  summaryActivity: string;
  duration: number;
  keyTakeaways: string;
  closingInstructions: string;
  reflectionPrompts: string;
  assessmentMethods: AssessmentMethod[];
  _id?: string;
}

interface ResourceFile {
  filename: string;
  url: string;
  fileSize: number;
  mimeType: string;
  description: string;
  _id?: string;
}

interface ResourceLink {
  title: string;
  url: string;
  description: string;
  _id?: string;
}

interface LessonPlanFormData {
  _id?: string;
  title: string;
  description: string;
  type: 'lecture' | 'practical' | 'workshop' | 'assessment' | 'discussion' | 'field_trip' | 'presentation' | 'review';
  lessonNumber: number;
  duration: number;
  requirements: LessonRequirement[];
  prerequisites: string;
  tags: string[];
  objectives: LessonObjective[];
  successCriteria: string[];
  starter: LessonStarter;
  lessonFlow: LessonFlowStep[];
  activities: LessonActivity[];
  plenary: LessonPlenary;
  homework: string;
  resourceFiles: ResourceFile[];
  resourceLinks: ResourceLink[];
  status: 'draft' | 'published' | 'archived';
  totalPreparationTime: number;
  teachingNotes?: string;
}

// Validation schema
const lessonPlanSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['lecture', 'practical', 'workshop', 'assessment', 'discussion', 'field_trip', 'presentation', 'review']),
  lessonNumber: z.number().min(1, 'Lesson number must be positive'),
  duration: z.number().min(5, 'Duration must be at least 5 minutes'),
  requirements: z.array(z.object({
    type: z.enum(['materials', 'read_article', 'worksheet', 'video', 'document_upload', 'survey']),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    instructions: z.string().min(1, 'Instructions are required'),
    isRequired: z.boolean(),
    materialsDescription: z.string().optional(),
    materialsList: z.array(z.string()).optional(),
    whereToGet: z.string().optional(),
    estimatedCost: z.string().optional(),
    status: z.enum(['pending', 'completed', 'in_progress']),
  })),
  prerequisites: z.string(),
  tags: z.array(z.string()),
  objectives: z.array(z.object({
    objective: z.string().min(1, 'Objective is required'),
    isCompleted: z.boolean(),
  })).min(1, 'At least one objective is required'),
  successCriteria: z.array(z.string()),
  starter: z.object({
    title: z.string().min(1, 'Starter title is required'),
    description: z.string().min(1, 'Starter description is required'),
    duration: z.number().min(1, 'Duration must be positive'),
    instructions: z.string().min(1, 'Instructions are required'),
    materialsNeeded: z.array(z.string()),
  }),
  lessonFlow: z.array(z.object({
    title: z.string().min(1, 'Step title is required'),
    description: z.string().min(1, 'Step description is required'),
    duration: z.number().min(1, 'Duration must be positive'),
    order: z.number(),
    teachingMethod: z.enum(['lecture', 'demonstration', 'practical', 'discussion']),
    studentActivity: z.string().min(1, 'Student activity is required'),
    teacherInstructions: z.string().min(1, 'Teacher instructions are required'),
    materialsNeeded: z.array(z.string()),
  })),
  activities: z.array(z.object({
    title: z.string().min(1, 'Activity title is required'),
    description: z.string().min(1, 'Activity description is required'),
    duration: z.number().min(1, 'Duration must be positive'),
    instructions: z.string().min(1, 'Instructions are required'),
    activityType: z.enum(['lecture', 'discussion', 'group_work', 'practical', 'demonstration', 'investigation', 'presentation', 'role_play', 'problem_solving', 'research']),
    learningOutcome: z.string().min(1, 'Learning outcome is required'),
    successCriteria: z.array(z.string()),
    differentiation: z.string(),
  })),
  plenary: z.object({
    summaryActivity: z.string().min(1, 'Summary activity is required'),
    duration: z.number().min(1, 'Duration must be positive'),
    keyTakeaways: z.string().min(1, 'Key takeaways are required'),
    closingInstructions: z.string().min(1, 'Closing instructions are required'),
    reflectionPrompts: z.string(),
    assessmentMethods: z.array(z.object({
      method: z.string().min(1, 'Assessment method is required'),
      description: z.string().min(1, 'Description is required'),
      timeAllocation: z.number().min(1, 'Time allocation must be positive'),
      criteria: z.array(z.string()),
      format: z.enum(['written', 'verbal', 'practical', 'online']),
      type: z.enum(['formative', 'summative', 'peer']),
      instructions: z.string().min(1, 'Instructions are required'),
    })),
  }),
  homework: z.string(),
  resourceFiles: z.array(z.object({
    filename: z.string(),
    url: z.string(),
    fileSize: z.number(),
    mimeType: z.string(),
    description: z.string(),
  })),
  resourceLinks: z.array(z.object({
    title: z.string(),
    url: z.string().url('Invalid URL'),
    description: z.string(),
  })),
  status: z.enum(['draft', 'published', 'archived']),
  totalPreparationTime: z.number().min(0),
  teachingNotes: z.string().optional(),
});

interface LessonPlanEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonPlan?: LessonPlanFormData;
  onSave: (data: LessonPlanFormData) => Promise<void>;
  mode?: 'create' | 'edit';
  classId?: string;
}

const LessonPlanEditDialog: React.FC<LessonPlanEditDialogProps> = ({
  open,
  onOpenChange,
  lessonPlan,
  onSave,
  mode = 'edit',
  classId,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize form with default values
  const defaultValues: LessonPlanFormData = {
    title: '',
    description: '',
    type: 'lecture',
    lessonNumber: 1,
    duration: 60,
    requirements: [],
    prerequisites: '',
    tags: [],
    objectives: [{ objective: '', isCompleted: false }],
    successCriteria: [],
    starter: {
      title: '',
      description: '',
      duration: 5,
      instructions: '',
      materialsNeeded: [],
    },
    lessonFlow: [],
    activities: [],
    plenary: {
      summaryActivity: '',
      duration: 5,
      keyTakeaways: '',
      closingInstructions: '',
      reflectionPrompts: '',
      assessmentMethods: [],
    },
    homework: '',
    resourceFiles: [],
    resourceLinks: [],
    status: 'draft',
    totalPreparationTime: 30,
    teachingNotes: '',
  };

  const form = useForm<LessonPlanFormData>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: lessonPlan || defaultValues,
    mode: 'onChange',
  });

  // Update form values when lessonPlan prop changes
  useEffect(() => {
    if (lessonPlan) {
      form.reset(lessonPlan);
    }
  }, [lessonPlan, form]);

  const { fields: objectiveFields, append: appendObjective, remove: removeObjective } = useFieldArray({
    control: form.control,
    name: 'objectives',
  });

  const { fields: requirementFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control: form.control,
    name: 'requirements',
  });

  const { fields: lessonFlowFields, append: appendLessonFlow, remove: removeLessonFlow } = useFieldArray({
    control: form.control,
    name: 'lessonFlow',
  });

  const { fields: activityFields, append: appendActivity, remove: removeActivity } = useFieldArray({
    control: form.control,
    name: 'activities',
  });

  // Watch form values for auto-save and calculations
  const watchedValues = form.watch();

  // Clean payload for API calls - removes MongoDB and internal fields
  const createCleanLessonPlanPayload = useCallback((data: LessonPlanFormData) => {
    const cleanObjective = (obj: LessonObjective) => ({
      objective: obj.objective,
      isCompleted: obj.isCompleted || false,
    });

    const cleanRequirement = (req: LessonRequirement) => ({
      type: req.type,
      title: req.title,
      description: req.description,
      instructions: req.instructions,
      isRequired: req.isRequired,
      materialsDescription: req.materialsDescription,
      materialsList: req.materialsList || [],
      whereToGet: req.whereToGet,
      estimatedCost: req.estimatedCost,
      acceptedFileTypes: req.acceptedFileTypes,
      status: req.status,
      attachments: req.attachments || [],
      resourceLinks: req.resourceLinks || [],
    });

    const cleanLessonFlowStep = (step: LessonFlowStep, index: number) => ({
      title: step.title,
      description: step.description,
      duration: step.duration,
      order: index + 1, // Ensure 1-based sequential ordering
      teachingMethod: step.teachingMethod,
      studentActivity: step.studentActivity,
      teacherInstructions: step.teacherInstructions,
      materialsNeeded: step.materialsNeeded || [],
      resourceFiles: step.resourceFiles || [],
      resourceLinks: step.resourceLinks || [],
    });

    const cleanActivity = (activity: LessonActivity) => ({
      title: activity.title,
      description: activity.description,
      duration: activity.duration,
      instructions: activity.instructions,
      activityType: activity.activityType,
      learningOutcome: activity.learningOutcome,
      successCriteria: activity.successCriteria || [],
      differentiation: activity.differentiation,
      resourceFiles: activity.resourceFiles || [],
      resourceLinks: activity.resourceLinks || [],
    });

    const cleanAssessmentMethod = (method: AssessmentMethod) => ({
      method: method.method,
      description: method.description,
      timeAllocation: method.timeAllocation,
      criteria: method.criteria || [],
      format: method.format,
      type: method.type,
      instructions: method.instructions,
    });

    const cleanResourceFile = (file: ResourceFile) => ({
      filename: file.filename,
      url: file.url,
      fileSize: file.fileSize,
      mimeType: file.mimeType,
      description: file.description,
    });

    const cleanResourceLink = (link: ResourceLink) => ({
      title: link.title,
      url: link.url,
      description: link.description,
    });

    const cleanPayload = {
      title: data.title,
      description: data.description,
      type: data.type,
      lessonNumber: data.lessonNumber,
      duration: data.duration,
      prerequisites: data.prerequisites,
      tags: data.tags || [],
      objectives: data.objectives?.map(cleanObjective) || [],
      successCriteria: data.successCriteria || [],
      requirements: data.requirements?.map(cleanRequirement) || [],
      starter: {
        title: data.starter?.title || '',
        description: data.starter?.description || '',
        duration: data.starter?.duration || 5,
        instructions: data.starter?.instructions || '',
        materialsNeeded: data.starter?.materialsNeeded || [],
      },
      lessonFlow: data.lessonFlow?.map((step, index) => cleanLessonFlowStep(step, index)) || [],
      activities: data.activities?.map(cleanActivity) || [],
      plenary: {
        summaryActivity: data.plenary?.summaryActivity || '',
        duration: data.plenary?.duration || 5,
        keyTakeaways: data.plenary?.keyTakeaways || '',
        closingInstructions: data.plenary?.closingInstructions || '',
        reflectionPrompts: data.plenary?.reflectionPrompts || '',
        assessmentMethods: data.plenary?.assessmentMethods?.map(cleanAssessmentMethod) || [],
      },
      homework: data.homework || '',
      resourceFiles: data.resourceFiles?.map(cleanResourceFile) || [],
      resourceLinks: data.resourceLinks?.map(cleanResourceLink) || [],
      status: data.status || 'draft',
      teachingNotes: data.teachingNotes,
    };

    return cleanPayload;
  }, []);

  // Calculate total duration from all components
  const calculateTotalDuration = useCallback((data: LessonPlanFormData): number => {
    let total = data.duration || 0;
    total += data.starter?.duration || 0;
    total += data.lessonFlow?.reduce((sum, step) => sum + (step.duration || 0), 0) || 0;
    total += data.activities?.reduce((sum, activity) => sum + (activity.duration || 0), 0) || 0;
    total += data.plenary?.duration || 0;
    return total;
  }, []);

  // Calculate detailed completion tracking
  const getCompletionDetails = useCallback((data: LessonPlanFormData) => {
    const sections = {
      overview: {
        name: 'Overview',
        complete: true,
        missing: [] as string[],
        weight: 1.5, // More important section
      },
      structure: {
        name: 'Structure',
        complete: true,
        missing: [] as string[],
        weight: 1.5, // More important section
      },
      activities: {
        name: 'Activities',
        complete: true,
        missing: [] as string[],
        weight: 1.2,
      },
      resources: {
        name: 'Resources',
        complete: true,
        missing: [] as string[],
        weight: 0.8, // Less critical
      },
      assessment: {
        name: 'Assessment',
        complete: true,
        missing: [] as string[],
        weight: 1.0,
      },
    };

    // Check Overview section
    if (!data.title?.trim()) {
      sections.overview.complete = false;
      sections.overview.missing.push('Title');
    }
    if (!data.description?.trim() || data.description.length < 10) {
      sections.overview.complete = false;
      sections.overview.missing.push('Description (min 10 characters)');
    }
    if (!data.objectives?.length || data.objectives.some(obj => !obj.objective?.trim())) {
      sections.overview.complete = false;
      sections.overview.missing.push('At least one complete objective');
    }

    // Check Structure section
    if (!data.starter?.title?.trim()) {
      sections.structure.complete = false;
      sections.structure.missing.push('Starter activity title');
    }
    if (!data.starter?.description?.trim()) {
      sections.structure.complete = false;
      sections.structure.missing.push('Starter activity description');
    }
    if (!data.lessonFlow?.length || data.lessonFlow.some(step => !step.title?.trim() || !step.description?.trim())) {
      sections.structure.complete = false;
      sections.structure.missing.push('At least one complete lesson flow step');
    }
    if (!data.plenary?.summaryActivity?.trim()) {
      sections.structure.complete = false;
      sections.structure.missing.push('Plenary summary activity');
    }

    // Check Activities section
    if (!data.activities?.length || data.activities.some(act => !act.title?.trim() || !act.description?.trim())) {
      sections.activities.complete = false;
      sections.activities.missing.push('At least one complete activity');
    }

    // Check Resources section (optional but tracked)
    if (!data.requirements?.length && !data.resourceFiles?.length && !data.resourceLinks?.length) {
      sections.resources.complete = false;
      sections.resources.missing.push('Consider adding requirements or resources');
    }

    // Check Assessment section
    if (!data.plenary?.assessmentMethods?.length || 
        data.plenary.assessmentMethods.some(method => !method.method?.trim() || !method.description?.trim())) {
      sections.assessment.complete = false;
      sections.assessment.missing.push('At least one assessment method');
    }

    // Calculate weighted completion percentage
    const completeSections = Object.values(sections).filter(section => section.complete);
    const totalWeight = Object.values(sections).reduce((sum, section) => sum + section.weight, 0);
    const completeWeight = completeSections.reduce((sum, section) => sum + section.weight, 0);
    const percentage = (completeWeight / totalWeight) * 100;

    return {
      percentage: Math.round(percentage),
      sections,
      incompleteSections: Object.values(sections).filter(section => !section.complete),
      isReadyToSave: percentage >= 50,
    };
  }, []);

  // Calculate form completion percentage (backward compatibility)
  const calculateCompletionPercentage = useCallback((data: LessonPlanFormData): number => {
    return getCompletionDetails(data).percentage;
  }, [getCompletionDetails]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(async () => {
      setAutoSaveStatus('saving');
      try {
        // Auto-save logic would go here
        // For now, just simulate saving
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAutoSaveStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        setAutoSaveStatus('error');
      }
    }, 30000); // Auto-save after 30 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [hasUnsavedChanges]);

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
      setAutoSaveStatus('idle');
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: LessonPlanFormData) => {
    setIsSaving(true);
    try {
      // Update total duration
      data.duration = calculateTotalDuration(data);
      
      if (mode === 'edit' && lessonPlan?._id && classId) {
        // Create clean payload without MongoDB and internal fields
        const cleanPayload = createCleanLessonPlanPayload(data);
        
        // Use PATCH API for updating existing lesson plan with clean payload
        const response = await classService.updateLessonPlanById(classId, lessonPlan._id, cleanPayload);
        
        if (response.error) {
          throw new Error(response.error.message);
        }
      } else {
        // Use the existing onSave callback for create mode
        await onSave(data);
      }
      
      setHasUnsavedChanges(false);
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save lesson plan:', error);
      setAutoSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle ESC key and close with unsaved changes warning
  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to close without saving?');
      if (!confirm) return;
    }
    onOpenChange(false);
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [open, hasUnsavedChanges]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Get lesson type configuration
  const getLessonTypeConfig = (type: string) => {
    const configs = {
      lecture: { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Lecture' },
      practical: { color: 'text-green-600', bg: 'bg-green-100', label: 'Practical' },
      workshop: { color: 'text-purple-600', bg: 'bg-purple-100', label: 'Workshop' },
      assessment: { color: 'text-red-600', bg: 'bg-red-100', label: 'Assessment' },
      discussion: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Discussion' },
      field_trip: { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Field Trip' },
      presentation: { color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Presentation' },
      review: { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Review' },
    };
    return configs[type as keyof typeof configs] || configs.lecture;
  };

  const completionDetails = getCompletionDetails(watchedValues);
  const completionPercentage = completionDetails.percentage;
  const totalDuration = calculateTotalDuration(watchedValues);
  const typeConfig = getLessonTypeConfig(watchedValues.type);

  // Get color for progress bar based on completion
  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Handle save button click explicitly
  const handleSaveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaving || !completionDetails.isReadyToSave) {
      return;
    }

    try {
      // Trigger form submission
      const isValid = await form.trigger();
      
      if (isValid || completionPercentage >= 50) {
        // Force submit even if form validation fails but completion is ≥50%
        const formData = form.getValues();
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Failed to save lesson plan:', error);
    }
  };

  // Don't render if not open
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[95vh] overflow-hidden border border-kidato-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-kidato-gray-200 bg-gradient-to-r from-kidato-indigo/5 to-kidato-spindle/5 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-kidato-gray-900">
                    {mode === 'create' ? 'Create New Lesson' : 'Edit Lesson Plan'}
                  </h1>
                  {watchedValues.title && (
                    <Badge variant="outline" className={cn(typeConfig.color, typeConfig.bg)}>
                      {typeConfig.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {/* Auto-save Status */}
                  <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                    {autoSaveStatus === 'saving' && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    )}
                    {autoSaveStatus === 'saved' && lastSaved && (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                      </>
                    )}
                    {autoSaveStatus === 'error' && (
                      <>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Save failed</span>
                      </>
                    )}
                    {hasUnsavedChanges && autoSaveStatus === 'idle' && (
                      <span className="text-kidato-orange">Unsaved changes</span>
                    )}
                  </div>
                  
                  {/* Progress Indicator with Tooltip */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <span className="text-sm text-kidato-gray-600">
                            {completionPercentage}% complete
                          </span>
                          <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-300", getProgressColor(completionPercentage))}
                              style={{ width: `${completionPercentage}%` }}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-sm">
                        <div className="space-y-2">
                          {completionDetails.incompleteSections.length === 0 ? (
                            <div className="text-green-600 font-medium">
                              ✅ All sections complete! Ready to save.
                            </div>
                          ) : (
                            <>
                              <div className="font-medium">
                                {completionPercentage >= 50 ? 
                                  `✅ Ready to save! ${completionDetails.incompleteSections.length} optional sections remaining:` :
                                  `❌ Need ${50 - completionPercentage}% more to save. Missing sections:`
                                }
                              </div>
                              <div className="space-y-1">
                                {completionDetails.incompleteSections.map((section, index) => (
                                  <div key={index} className="text-sm">
                                    <div className="font-medium text-kidato-indigo">{section.name}:</div>
                                    <ul className="ml-2 space-y-0.5">
                                      {section.missing.map((item, itemIndex) => (
                                        <li key={itemIndex} className="text-xs text-gray-600">• {item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-3">
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <Timer className="h-4 w-4" />
                  <span>{totalDuration} min total</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <Target className="h-4 w-4" />
                  <span>{watchedValues.objectives?.length || 0} objectives</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{watchedValues.activities?.length || 0} activities</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-kidato-gray-600">
                  <Calculator className="h-4 w-4" />
                  <span>{watchedValues.totalPreparationTime} min prep</span>
                </div>
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="mx-6 mt-4 grid w-full max-w-2xl grid-cols-5">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    <span className="hidden sm:inline">Overview</span>
                    {completionDetails.sections.overview?.complete && (
                      <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="structure" className="flex items-center gap-1">
                    <Workflow className="h-3 w-3" />
                    <span className="hidden sm:inline">Structure</span>
                    {completionDetails.sections.structure?.complete && (
                      <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    <span className="hidden sm:inline">Resources</span>
                    {completionDetails.sections.resources?.complete && (
                      <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="assessment" className="flex items-center gap-1">
                    <ClipboardList className="h-3 w-3" />
                    <span className="hidden sm:inline">Assessment</span>
                    {completionDetails.sections.assessment?.complete && (
                      <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-1">
                    <StickyNote className="h-3 w-3" />
                    <span className="hidden sm:inline">Notes</span>
                    <CheckCircle2 className="h-3 w-3 text-green-500 ml-1" />
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-auto px-6 py-4">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Basic Information
                        </h3>
                        
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lesson Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter lesson title..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe what students will learn in this lesson..."
                                  rows={4}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lesson Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="lecture">Lecture</SelectItem>
                                    <SelectItem value="practical">Practical</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="assessment">Assessment</SelectItem>
                                    <SelectItem value="discussion">Discussion</SelectItem>
                                    <SelectItem value="field_trip">Field Trip</SelectItem>
                                    <SelectItem value="presentation">Presentation</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="lessonNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lesson #</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1"
                                    readOnly
                                    className="bg-gray-50 cursor-not-allowed"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="totalPreparationTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prep Time (min)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="prerequisites"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prerequisites</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="What should students know before this lesson?"
                                  rows={2}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Learning Objectives */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                            <Target className="h-4 w-4 mr-2" />
                            Learning Objectives *
                          </h3>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendObjective({ objective: '', isCompleted: false })}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {objectiveFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                              <div className="w-6 h-6 rounded-full bg-kidato-indigo/10 flex items-center justify-center text-kidato-indigo text-xs font-medium flex-shrink-0 mt-2">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <FormField
                                  control={form.control}
                                  name={`objectives.${index}.objective`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Students will be able to..."
                                          rows={2}
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              {objectiveFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeObjective(index)}
                                  className="mt-2"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Success Criteria */}
                        <div className="mt-6">
                          <FormField
                            control={form.control}
                            name="successCriteria"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Success Criteria</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="How will you know students have achieved the objectives? (Enter one criterion per line)"
                                    rows={3}
                                    {...field}
                                    value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                                    onChange={(e) => {
                                      const criteria = e.target.value.split('\n').filter(c => c.trim());
                                      field.onChange(criteria);
                                    }}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Enter each success criterion on a new line
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Tags */}
                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="algebra, equations, problem-solving..."
                                  {...field}
                                  value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                  onChange={(e) => {
                                    const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                                    field.onChange(tags);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Separate tags with commas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Duration Calculator */}
                    <Alert>
                      <Calculator className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <span>Total calculated duration: <strong>{totalDuration} minutes</strong></span>
                          <Badge variant="outline">
                            {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  {/* Structure Tab */}
                  <TabsContent value="structure" className="space-y-6 mt-0">
                    {/* Starter Activity */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <Sparkles className="h-4 w-4 mr-2 text-green-600" />
                        Starter Activity
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="starter.title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity Title *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Quick Quiz, Word Association..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="starter.duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes) *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="starter.description"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the starter activity and its purpose..."
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="starter.instructions"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Instructions *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Step-by-step instructions for the starter activity..."
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="starter.materialsNeeded"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Materials Needed</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="whiteboard, markers, handouts..."
                                {...field}
                                value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                onChange={(e) => {
                                  const materials = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                                  field.onChange(materials);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Separate materials with commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Lesson Flow */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                          <Workflow className="h-4 w-4 mr-2 text-kidato-indigo" />
                          Lesson Flow
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendLessonFlow({
                            title: '',
                            description: '',
                            duration: 10,
                            order: lessonFlowFields.length + 1,
                            teachingMethod: 'lecture',
                            studentActivity: '',
                            teacherInstructions: '',
                            materialsNeeded: [],
                          })}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Step
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {lessonFlowFields.map((field, index) => (
                          <div key={field.id} className="border border-kidato-gray-200 rounded-lg p-4 bg-kidato-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-kidato-indigo/10 flex items-center justify-center text-kidato-indigo font-medium text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-kidato-gray-900">Step {index + 1}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {index > 0 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Move step up
                                      const steps = form.getValues('lessonFlow');
                                      const newSteps = [...steps];
                                      [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
                                      newSteps.forEach((step, i) => step.order = i + 1);
                                      form.setValue('lessonFlow', newSteps);
                                    }}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                )}
                                {index < lessonFlowFields.length - 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Move step down
                                      const steps = form.getValues('lessonFlow');
                                      const newSteps = [...steps];
                                      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
                                      newSteps.forEach((step, i) => step.order = i + 1);
                                      form.setValue('lessonFlow', newSteps);
                                    }}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeLessonFlow(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`lessonFlow.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Step Title *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Introduction, Main Activity..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`lessonFlow.${index}.duration`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duration (min) *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="1"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`lessonFlow.${index}.teachingMethod`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Teaching Method *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="lecture">Lecture</SelectItem>
                                        <SelectItem value="demonstration">Demonstration</SelectItem>
                                        <SelectItem value="practical">Practical</SelectItem>
                                        <SelectItem value="discussion">Discussion</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`lessonFlow.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Description *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe what happens in this step..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={form.control}
                                name={`lessonFlow.${index}.studentActivity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Student Activity *</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="What will students be doing?"
                                        rows={2}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`lessonFlow.${index}.teacherInstructions`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Teacher Instructions *</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="What will you be doing as the teacher?"
                                        rows={2}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`lessonFlow.${index}.materialsNeeded`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Materials Needed</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="slides, worksheets, equipment..."
                                      {...field}
                                      value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                      onChange={(e) => {
                                        const materials = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                                        field.onChange(materials);
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Separate materials with commas
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        {lessonFlowFields.length === 0 && (
                          <div className="text-center py-8 text-kidato-gray-500">
                            <Workflow className="h-12 w-12 mx-auto mb-2 text-kidato-gray-300" />
                            <p>No lesson flow steps yet. Add your first step to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-kidato-orange" />
                          Activities
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendActivity({
                            title: '',
                            description: '',
                            duration: 15,
                            instructions: '',
                            activityType: 'individual',
                            learningOutcome: '',
                            successCriteria: [],
                            differentiation: '',
                          })}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Activity
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {activityFields.map((field, index) => (
                          <div key={field.id} className="border border-kidato-orange/20 rounded-lg p-4 bg-kidato-orange/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-kidato-orange/20 flex items-center justify-center text-kidato-orange font-medium text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-kidato-gray-900">Activity {index + 1}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeActivity(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`activities.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Activity Title *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Group Discussion, Lab Experiment..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`activities.${index}.duration`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duration (min) *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="1"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`activities.${index}.activityType`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Activity Type *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="lecture">Lecture</SelectItem>
                                        <SelectItem value="discussion">Discussion</SelectItem>
                                        <SelectItem value="group_work">Group Work</SelectItem>
                                        <SelectItem value="practical">Practical</SelectItem>
                                        <SelectItem value="demonstration">Demonstration</SelectItem>
                                        <SelectItem value="investigation">Investigation</SelectItem>
                                        <SelectItem value="presentation">Presentation</SelectItem>
                                        <SelectItem value="role_play">Role Play</SelectItem>
                                        <SelectItem value="problem_solving">Problem Solving</SelectItem>
                                        <SelectItem value="research">Research</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`activities.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Description *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe the activity and what students will do..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                              <FormField
                                control={form.control}
                                name={`activities.${index}.instructions`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Instructions *</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Step-by-step instructions for students..."
                                        rows={3}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`activities.${index}.learningOutcome`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Learning Outcome *</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="What will students learn from this activity?"
                                        rows={3}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`activities.${index}.differentiation`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Differentiation</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="How will you adapt this activity for different learners?"
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`activities.${index}.successCriteria`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Success Criteria</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="How will you know students have succeeded? (Enter one criterion per line)"
                                      rows={2}
                                      {...field}
                                      value={Array.isArray(field.value) ? field.value.join('\n') : field.value}
                                      onChange={(e) => {
                                        const criteria = e.target.value.split('\n').filter(c => c.trim());
                                        field.onChange(criteria);
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter each criterion on a new line
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        {activityFields.length === 0 && (
                          <div className="text-center py-8 text-kidato-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-2 text-kidato-gray-300" />
                            <p>No activities yet. Add your first activity to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Plenary */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <Trophy className="h-4 w-4 mr-2 text-purple-600" />
                        Plenary & Wrap-up
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="plenary.summaryActivity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Summary Activity *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="How will you summarize the lesson?"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="plenary.duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes) *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="plenary.keyTakeaways"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Key Takeaways *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What are the main points students should remember?"
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="plenary.closingInstructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Closing Instructions *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="How will you end the lesson?"
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="plenary.reflectionPrompts"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reflection Prompts</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Questions to help students reflect on their learning..."
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Resources Tab */}
                  <TabsContent value="resources" className="space-y-6 mt-0">
                    {/* Requirements & Materials */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                          <Package className="h-4 w-4 mr-2 text-kidato-indigo" />
                          Requirements & Materials
                        </h3>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const totalCost = requirementFields.reduce((sum, _, index) => {
                              const cost = form.watch(`requirements.${index}.estimatedCost`) || '';
                              const costMatch = cost.match(/\d+/g);
                              if (costMatch) {
                                return sum + parseInt(costMatch[0]);
                              }
                              return sum;
                            }, 0);
                            return totalCost > 0 && (
                              <Badge variant="outline" className="text-kidato-orange border-kidato-orange">
                                <Calculator className="h-3 w-3 mr-1" />
                                Total: Ksh {totalCost}+
                              </Badge>
                            );
                          })()}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendRequirement({
                              type: 'materials',
                              title: '',
                              description: '',
                              instructions: '',
                              isRequired: true,
                              status: 'pending',
                            })}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Requirement
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {requirementFields.map((field, index) => (
                          <div key={field.id} className="border border-kidato-gray-200 rounded-lg p-4 bg-kidato-gray-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-kidato-indigo/10 flex items-center justify-center text-kidato-indigo font-medium text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-kidato-gray-900">Requirement {index + 1}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRequirement(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`requirements.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Algebra Workbook, Calculator..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`requirements.${index}.type`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="materials">Materials</SelectItem>
                                        <SelectItem value="read_article">Read Article</SelectItem>
                                        <SelectItem value="worksheet">Worksheet</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="document_upload">Document Upload</SelectItem>
                                        <SelectItem value="survey">Survey</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex items-center gap-4">
                                <FormField
                                  control={form.control}
                                  name={`requirements.${index}.isRequired`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="rounded border-kidato-gray-300"
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        Required
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`requirements.${index}.status`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="w-28">
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="in_progress">In Progress</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <FormField
                              control={form.control}
                              name={`requirements.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Description *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe this requirement..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`requirements.${index}.instructions`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Instructions *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Instructions for students..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {form.watch(`requirements.${index}.type`) === 'materials' && (
                              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  <FormField
                                    control={form.control}
                                    name={`requirements.${index}.materialsDescription`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Materials Description</FormLabel>
                                        <FormControl>
                                          <Textarea 
                                            placeholder="Detailed description of materials needed..."
                                            rows={2}
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`requirements.${index}.materialsList`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Materials List</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="List specific materials (one per line)"
                                            rows={2}
                                            {...field}
                                            value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                                            onChange={(e) => {
                                              const materials = e.target.value.split('\n').filter(m => m.trim());
                                              field.onChange(materials);
                                            }}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Enter each material on a new line
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                  <FormField
                                    control={form.control}
                                    name={`requirements.${index}.whereToGet`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Where to Get</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="e.g., School bookstore, online..."
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`requirements.${index}.estimatedCost`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Estimated Cost</FormLabel>
                                        <FormControl>
                                          <Input 
                                            placeholder="e.g., Ksh 500-800"
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {requirementFields.length === 0 && (
                          <div className="text-center py-8 text-kidato-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-2 text-kidato-gray-300" />
                            <p>No requirements yet. Add your first requirement to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resource Links */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-kidato-spindle" />
                          Resource Links
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentLinks = form.getValues('resourceLinks') || [];
                            form.setValue('resourceLinks', [
                              ...currentLinks,
                              { title: '', url: '', description: '' }
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Link
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {form.watch('resourceLinks')?.map((link, index) => (
                          <div key={index} className="border border-kidato-spindle/20 rounded-lg p-4 bg-kidato-spindle/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-kidato-spindle/20 flex items-center justify-center text-kidato-spindle font-medium text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-kidato-gray-900">Link {index + 1}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentLinks = form.getValues('resourceLinks') || [];
                                  const newLinks = currentLinks.filter((_, i) => i !== index);
                                  form.setValue('resourceLinks', newLinks);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`resourceLinks.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Link Title *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Khan Academy - Algebra..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`resourceLinks.${index}.url`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>URL *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="url"
                                        placeholder="https://example.com"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`resourceLinks.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Brief description of this resource..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )) || []}

                        {(!form.watch('resourceLinks') || form.watch('resourceLinks')?.length === 0) && (
                          <div className="text-center py-8 text-kidato-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-2 text-kidato-gray-300" />
                            <p>No resource links yet. Add your first link to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Homework Assignment */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                        Homework Assignment
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="homework"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assignment Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the homework assignment for students..."
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Include specific instructions, due dates, and expectations
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Assessment Tab */}
                  <TabsContent value="assessment" className="space-y-6 mt-0">
                    {/* Plenary Assessment Methods */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-kidato-gray-900 flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-kidato-indigo" />
                          Assessment Methods
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentMethods = form.getValues('plenary.assessmentMethods') || [];
                            form.setValue('plenary.assessmentMethods', [
                              ...currentMethods,
                              {
                                method: '',
                                description: '',
                                timeAllocation: 5,
                                criteria: [],
                                format: 'written',
                                type: 'formative',
                                instructions: '',
                              }
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Assessment
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {form.watch('plenary.assessmentMethods')?.map((assessment, index) => (
                          <div key={index} className="border border-kidato-indigo/20 rounded-lg p-4 bg-kidato-indigo/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-kidato-indigo/20 flex items-center justify-center text-kidato-indigo font-medium text-sm">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-kidato-gray-900">Assessment {index + 1}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const currentMethods = form.getValues('plenary.assessmentMethods') || [];
                                  const newMethods = currentMethods.filter((_, i) => i !== index);
                                  form.setValue('plenary.assessmentMethods', newMethods);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <FormField
                                control={form.control}
                                name={`plenary.assessmentMethods.${index}.method`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Assessment Method *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g., Exit Ticket, Quiz..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`plenary.assessmentMethods.${index}.timeAllocation`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Time (minutes) *</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="1"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <FormField
                                  control={form.control}
                                  name={`plenary.assessmentMethods.${index}.format`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Format *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="written">Written</SelectItem>
                                          <SelectItem value="verbal">Verbal</SelectItem>
                                          <SelectItem value="practical">Practical</SelectItem>
                                          <SelectItem value="online">Online</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`plenary.assessmentMethods.${index}.type`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Type *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="formative">Formative</SelectItem>
                                          <SelectItem value="summative">Summative</SelectItem>
                                          <SelectItem value="peer">Peer</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>

                            <FormField
                              control={form.control}
                              name={`plenary.assessmentMethods.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Description *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Describe this assessment method..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`plenary.assessmentMethods.${index}.instructions`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Instructions *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Instructions for students or teacher..."
                                      rows={2}
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`plenary.assessmentMethods.${index}.criteria`}
                              render={({ field }) => (
                                <FormItem className="mt-4">
                                  <FormLabel>Assessment Criteria</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="List assessment criteria (one per line)"
                                      rows={3}
                                      {...field}
                                      value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''}
                                      onChange={(e) => {
                                        const criteria = e.target.value.split('\n').filter(c => c.trim());
                                        field.onChange(criteria);
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Enter each criterion on a new line
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )) || []}

                        {(!form.watch('plenary.assessmentMethods') || form.watch('plenary.assessmentMethods')?.length === 0) && (
                          <div className="text-center py-8 text-kidato-gray-500">
                            <ClipboardList className="h-12 w-12 mx-auto mb-2 text-kidato-gray-300" />
                            <p>No assessment methods yet. Add your first assessment to get started.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status and Publishing */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Lesson Status
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Publication Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-48">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Draft lessons are only visible to you. Published lessons are accessible to students.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Notes Tab */}
                  <TabsContent value="notes" className="space-y-6 mt-0">
                    {/* Teaching Notes */}
                    <div className="bg-white rounded-lg border border-kidato-gray-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <StickyNote className="h-4 w-4 mr-2 text-kidato-indigo" />
                        Teaching Notes
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="teachingNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Personal Teaching Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Add your personal notes, tips, reminders, or observations about this lesson..."
                                rows={6}
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              These notes are private and will help you remember important details for future lessons
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Preparation Checklist */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <CheckSquare className="h-4 w-4 mr-2 text-green-600" />
                        Preparation Summary
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-kidato-gray-900 mb-3">Materials Needed</h4>
                          <div className="space-y-2">
                            {(() => {
                              const allMaterials = new Set<string>();
                              
                              // Collect materials from starter
                              form.watch('starter.materialsNeeded')?.forEach((material: string) => {
                                if (material.trim()) allMaterials.add(material.trim());
                              });
                              
                              // Collect materials from lesson flow
                              form.watch('lessonFlow')?.forEach((step: any) => {
                                step.materialsNeeded?.forEach((material: string) => {
                                  if (material.trim()) allMaterials.add(material.trim());
                                });
                              });
                              
                              // Collect materials from requirements
                              form.watch('requirements')?.forEach((req: any) => {
                                req.materialsList?.forEach((material: string) => {
                                  if (material.trim()) allMaterials.add(material.trim());
                                });
                              });

                              const materialsList = Array.from(allMaterials);
                              
                              return materialsList.length > 0 ? (
                                materialsList.map((material, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-kidato-gray-700">{material}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-kidato-gray-500">No materials specified yet</p>
                              );
                            })()}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-kidato-gray-900 mb-3">Time Breakdown</h4>
                          <div className="space-y-2">
                            {form.watch('starter.duration') && (
                              <div className="flex justify-between text-sm">
                                <span className="text-kidato-gray-700">Starter:</span>
                                <span className="font-medium">{form.watch('starter.duration')} min</span>
                              </div>
                            )}
                            {form.watch('lessonFlow')?.map((step: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-kidato-gray-700">{step.title || `Step ${index + 1}`}:</span>
                                <span className="font-medium">{step.duration} min</span>
                              </div>
                            ))}
                            {form.watch('activities')?.map((activity: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-kidato-gray-700">{activity.title || `Activity ${index + 1}`}:</span>
                                <span className="font-medium">{activity.duration} min</span>
                              </div>
                            ))}
                            {form.watch('plenary.duration') && (
                              <div className="flex justify-between text-sm">
                                <span className="text-kidato-gray-700">Plenary:</span>
                                <span className="font-medium">{form.watch('plenary.duration')} min</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm font-bold border-t border-green-300 pt-2">
                              <span className="text-kidato-gray-900">Total:</span>
                              <span className="text-green-700">{totalDuration} min</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-3 bg-white rounded-lg border border-green-300">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-kidato-gray-700">Estimated Preparation Time:</span>
                          <div className="flex items-center gap-2">
                            <Timer className="h-4 w-4 text-kidato-orange" />
                            <span className="font-bold text-kidato-orange">
                              {form.watch('totalPreparationTime')} minutes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Smart Suggestions */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                      <h3 className="font-semibold text-kidato-gray-900 flex items-center mb-4">
                        <Brain className="h-4 w-4 mr-2 text-blue-600" />
                        Smart Suggestions
                      </h3>
                      
                      <div className="space-y-3">
                        {(() => {
                          const suggestions = [];
                          
                          if (!form.watch('starter.title')) {
                            suggestions.push("Add a starter activity to engage students from the beginning");
                          }
                          
                          if (!form.watch('lessonFlow') || form.watch('lessonFlow')?.length === 0) {
                            suggestions.push("Create lesson flow steps to structure your teaching");
                          }
                          
                          if (!form.watch('activities') || form.watch('activities')?.length === 0) {
                            suggestions.push("Add interactive activities to keep students engaged");
                          }
                          
                          if (!form.watch('plenary.summaryActivity')) {
                            suggestions.push("Include a plenary activity to consolidate learning");
                          }
                          
                          if (!form.watch('homework')) {
                            suggestions.push("Consider adding homework to reinforce the lesson");
                          }
                          
                          if (totalDuration < 30) {
                            suggestions.push("Your lesson might be too short - consider adding more content");
                          }
                          
                          if (totalDuration > 90) {
                            suggestions.push("Your lesson might be too long - consider breaking it into parts");
                          }

                          return suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-start gap-3 text-sm">
                              <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="text-kidato-gray-700">{suggestion}</span>
                            </div>
                          ));
                        })()}
                        
                        {(() => {
                          const hasAllSections = form.watch('starter.title') && 
                                               form.watch('lessonFlow')?.length > 0 && 
                                               form.watch('activities')?.length > 0 && 
                                               form.watch('plenary.summaryActivity');
                          
                          return hasAllSections && (
                            <div className="flex items-start gap-3 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-green-700 font-medium">Great job! Your lesson plan is comprehensive and well-structured.</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-kidato-gray-200 bg-kidato-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <div className="flex flex-col items-end gap-2">
                  {completionPercentage < 100 && completionPercentage >= 50 && (
                    <div className="text-xs text-kidato-gray-500">
                      Saving incomplete lesson plan ({completionPercentage}%)
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    onClick={handleSaveClick}
                    disabled={isSaving || !completionDetails.isReadyToSave}
                    className={cn(
                      "bg-kidato-indigo hover:bg-kidato-indigo/90",
                      completionPercentage < 50 && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    {completionPercentage < 50 ? 
                      `Need ${50 - completionPercentage}% more` :
                      completionPercentage < 100 ?
                        (mode === 'create' ? 'Save Draft' : 'Save Changes') :
                        (mode === 'create' ? 'Create Lesson' : 'Save Complete Lesson')
                    }
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LessonPlanEditDialog;