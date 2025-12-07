import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, PlusCircle, Clock, FileText, Book, ListChecks, Trash2, Calendar, Star, Edit, Link, Upload, Check, X, MoreHorizontal, Zap, Search, Filter, ChevronLeft, ChevronRight, Grid, List, SortAsc, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { ClassFormValues } from '../types';
import { FileUploads, UploadedResource } from './FileUploads';
import { ResourceLinks, ResourceLink } from './ResourceLinks';
import { EmptyState } from './EmptyState';
import { api } from '@/integrations/api/client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

// Learning standards by subject
const learningStandards: Record<string, string[]> = {
  'english': [
    'ELA.1 - Reading Comprehension',
    'ELA.2 - Writing Process',
    'ELA.3 - Speaking and Listening',
    'ELA.4 - Language Conventions',
    'ELA.5 - Literature Analysis'
  ],
  'mathematics': [
    'MATH.1 - Number Sense',
    'MATH.2 - Algebraic Thinking',
    'MATH.3 - Geometry',
    'MATH.4 - Measurement',
    'MATH.5 - Data Analysis'
  ],
  'science': [
    'SCI.1 - Scientific Method',
    'SCI.2 - Life Sciences',
    'SCI.3 - Physical Sciences',
    'SCI.4 - Earth and Space Sciences',
    'SCI.5 - Scientific Inquiry'
  ],
  'social_studies': [
    'SOC.1 - Historical Thinking',
    'SOC.2 - Geography',
    'SOC.3 - Civics and Government',
    'SOC.4 - Economics',
    'SOC.5 - Cultural Studies'
  ],
  'default': [
    'STD.1 - Content Knowledge',
    'STD.2 - Critical Thinking',
    'STD.3 - Skill Development',
    'STD.4 - Application',
    'STD.5 - Collaboration'
  ]
};

// Lesson plan templates
const templates = [
  {
    id: 'standard',
    name: 'Standard Lesson',
    description: 'A standard lesson with introduction, activities, and assessment',
    structure: {
      title: 'Standard Lesson',
      description: `# Lesson Overview
This lesson will cover core concepts and provide practice activities.

## Objectives
- Students will understand key concepts
- Students will practice applying their knowledge
- Students will demonstrate mastery through assessment

## Activities
1. Introduction and warm-up (10 minutes)
2. Direct instruction (15 minutes)
3. Guided practice (15 minutes)
4. Independent work (15 minutes)
5. Wrap-up and reflection (5 minutes)

## Assessment
Exit ticket to check understanding`,
      duration: '60',
    }
  },
  {
    id: 'project',
    name: 'Project-Based Lesson',
    description: 'A hands-on project-based learning experience',
    structure: {
      title: 'Project: Creative Application',
      description: `# Project Overview
Students will complete a creative project to demonstrate understanding.

## Objectives
- Students will apply concepts in a real-world context
- Students will create an original product
- Students will present and explain their work

## Project Structure
1. Project introduction and expectations (10 minutes)
2. Planning and brainstorming (15 minutes)
3. Creation/work time (25 minutes)
4. Sharing and feedback (10 minutes)

## Deliverables
Students will submit their completed project and reflection`,
      duration: '60',
    }
  },
  {
    id: 'discussion',
    name: 'Discussion-Based Lesson',
    description: 'Focused on student-led discussion and debate',
    structure: {
      title: 'Discussion: Critical Analysis',
      description: `# Discussion Overview
This lesson will center around student-led discussion and critical thinking.

## Objectives
- Students will analyze source materials critically
- Students will articulate and defend perspectives
- Students will engage with diverse viewpoints

## Discussion Format
1. Pre-discussion preparation (10 minutes)
2. Introduction of discussion topic/question (5 minutes)
3. Small group discussion (15 minutes)
4. Full class discussion (20 minutes)
5. Synthesis and reflection (10 minutes)

## Assessment
Students will submit a reflection on the discussion`,
      duration: '60',
    }
  },
  {
    id: 'assessment',
    name: 'Assessment Lesson',
    description: 'Focused on evaluating student learning',
    structure: {
      title: 'Assessment: Unit Evaluation',
      description: `# Assessment Overview
This lesson focuses on evaluating student learning and providing feedback.

## Objectives
- Students will demonstrate mastery of key concepts
- Students will reflect on their learning progress
- Teacher will identify areas for reinforcement

## Assessment Structure
1. Review and preparation (10 minutes)
2. Assessment period (30 minutes)
3. Self-evaluation (10 minutes)
4. Review of challenging concepts (10 minutes)

## Follow-up
Individual feedback will be provided to students`,
      duration: '60',
    }
  },
  {
    id: 'lab',
    name: 'Laboratory/Hands-on Lesson',
    description: 'Experimental and hands-on learning activities',
    structure: {
      title: 'Lab Activity: Practical Investigation',
      description: `# Lab Overview
Students will engage in hands-on experimentation and investigation.

## Objectives
- Students will follow experimental procedures
- Students will collect and analyze data
- Students will draw conclusions from evidence

## Lab Structure
1. Safety review and procedure explanation (10 minutes)
2. Material distribution and setup (5 minutes)
3. Experiment/activity time (35 minutes)
4. Clean-up (5 minutes)
5. Data analysis and conclusion (5 minutes)

## Deliverables
Lab report with findings and reflections`,
      duration: '60',
    }
  }
];

// Real AI generation using the teacher service API
const generateLessonWithAI = async (subjectId: string, title: string, classType: string, template?: string): Promise<any> => {
  try {
    // Import the teacher service
    const { teacherService } = await import('@/integrations/api/services/teacher.service');

    // Prepare the prompt for AI generation
    const templateInfo = template ? templates.find(t => t.id === template) : null;
    const templateName = templateInfo?.name || 'Standard Lesson';

    const prompt = `Create a detailed lesson plan for a ${classType} class on the subject "${subjectId}".
    
Lesson Title: ${title || 'Untitled Lesson'}
Template Type: ${templateName}
${templateInfo ? `Template Description: ${templateInfo.description}` : ''}

Please generate a comprehensive lesson plan that includes:
1. Clear learning objectives
2. Detailed activities with time allocations
3. Assessment methods
4. Required resources and materials
5. Differentiation strategies if applicable

Format the response in Markdown with clear sections.`;

    // Call the real AI API
    const response = await teacherService.generateCustomClassDescription(prompt);

    if (response.data && response.data.description) {
      // Extract standards based on subject
      const standards = subjectId ?
        (learningStandards[subjectId.split('_')[0]] || learningStandards.default).slice(0, 3) :
        learningStandards.default.slice(0, 3);

      return {
        title: title || 'AI-Generated Lesson Plan',
        description: response.data.description,
        duration: '60',
        standards
      };
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
};

interface EnhancedLessonPlanCreatorProps {
  form: UseFormReturn<ClassFormValues>;
  lessonPlans: any[];
  subject: string;
  classType: string;
  appendLessonPlan: () => void;
  removeLessonPlan: (id: string) => void;
  updateLessonPlan: (id: string, field: string, value: string) => void;
  saveLessonPlans?: () => Promise<boolean>;
  lessonFileUploads?: Record<string, File[]>;
  handleLessonFileChange?: (lessonId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLessonFile?: (lessonId: string, fileIndex: number) => void;
}

const EnhancedLessonPlanCreator: React.FC<EnhancedLessonPlanCreatorProps> = ({
  form,
  lessonPlans,
  subject,
  classType,
  appendLessonPlan,
  removeLessonPlan,
  updateLessonPlan,
  saveLessonPlans,
  lessonFileUploads = {},
  handleLessonFileChange,
  removeLessonFile
}) => {
  // State declarations first
  const [key, setKey] = useState(Date.now());
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customDuration, setCustomDuration] = useState('60');
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [uploadedResources, setUploadedResources] = useState<Record<string, UploadedResource[]>>({});
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [autoSaveTimeouts, setAutoSaveTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  const [addingLinkFor, setAddingLinkFor] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  // Navigation and filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStandard, setFilterStandard] = useState('all');
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'duration'>('order');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [lessonVisibility, setLessonVisibility] = useState<Record<string, boolean>>({});
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const LESSONS_PER_PAGE = 12;
  const { toast } = useToast();
  const { classId } = useParams<{ classId: string }>();

  // Update the key when lessonPlans change to force a re-render
  useEffect(() => {
    setKey(Date.now());
  }, [lessonPlans, lessonFileUploads]);

  // Cleanup auto-save timeouts when component unmounts
  useEffect(() => {
    return () => {
      Object.values(autoSaveTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [autoSaveTimeouts]);

  const availableStandards = subject ?
    learningStandards[subject.split('_')[0]] || learningStandards.default :
    learningStandards.default;

  // Helper functions to work with the actual API structure
  const getLessonId = (lesson: any): string => {
    return lesson.id || lesson._id;
  };

  const getLessonResourceFiles = (lesson: any): any[] => {
    return Array.isArray(lesson.resourceFiles) ? lesson.resourceFiles : [];
  };

  const getLessonResourceLinks = (lesson: any): any[] => {
    return Array.isArray(lesson.resourceLinks) ? lesson.resourceLinks : [];
  };

  const updateLessonResourceFiles = (lessonId: string, files: any[]) => {
    const lesson = lessonPlans.find(l => (l.id || l._id) === lessonId);
    if (lesson) {
      // Update the resourceFiles array directly
      updateLessonPlan(lessonId, "resourceFiles", files);
    }
  };

  const updateLessonResourceLinks = (lessonId: string, links: any[]) => {
    const lesson = lessonPlans.find(l => (l.id || l._id) === lessonId);
    if (lesson) {
      // Update the resourceLinks array directly
      updateLessonPlan(lessonId, "resourceLinks", links);
    }
  };

  // Filter and sort lesson plans
  const filteredAndSortedLessons = useMemo(() => {
    let filtered = lessonPlans.filter(lesson => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = lesson.title?.toLowerCase().includes(query);
        const descriptionMatch = lesson.description?.toLowerCase().includes(query);
        if (!titleMatch && !descriptionMatch) return false;
      }

      // Standards filter
      if (filterStandard !== 'all') {
        const lessonStandards = getLessonStandards(lesson.description || '');
        if (!lessonStandards.some(standard => standard.includes(filterStandard))) {
          return false;
        }
      }

      return true;
    });

    // Sort lessons
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'duration':
          return parseInt(a.duration || '60') - parseInt(b.duration || '60');
        case 'order':
        default:
          // Keep original order
          return lessonPlans.indexOf(a) - lessonPlans.indexOf(b);
      }
    });

    return filtered;
  }, [lessonPlans, searchQuery, filterStandard, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLessons.length / LESSONS_PER_PAGE);
  const startIndex = (currentPage - 1) * LESSONS_PER_PAGE;
  const paginatedLessons = filteredAndSortedLessons.slice(startIndex, startIndex + LESSONS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStandard, sortBy]);

  // Toggle lesson visibility
  const toggleLessonVisibility = (lessonId: string) => {
    setLessonVisibility(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  // Handle uploaded resources
  const handleResourceUploaded = (lessonId: string, resource: UploadedResource) => {
    setUploadedResources(prev => ({
      ...prev,
      [lessonId]: [...(prev[lessonId] || []), resource]
    }));
  };

  const handleResourceRemoved = (lessonId: string, resourceId: string) => {
    setUploadedResources(prev => ({
      ...prev,
      [lessonId]: (prev[lessonId] || []).filter(resource => resource.id !== resourceId)
    }));
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (isCreatingLesson) {
      setSelectedTemplate('');
      setCustomTitle('');
      setCustomDescription('');
      setCustomDuration('60');
      setSelectedStandards([]);
      setIsEditMode(false);
      setCurrentLessonId(null);
      setUseAI(false);
    }
  }, [isCreatingLesson]);

  // Apply template when selected
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setCustomTitle(template.structure.title);
        setCustomDescription(template.structure.description);
        setCustomDuration(template.structure.duration);
      }
    }
  }, [selectedTemplate]);

  // Generate content with AI when requested
  const handleAIGeneration = async () => {
    setIsGenerating(true);
    try {
      toast({
        title: "Generating lesson plan...",
        description: "AI is creating your lesson plan. This may take a moment.",
      });

      const result = await generateLessonWithAI(
        subject,
        customTitle,
        classType,
        selectedTemplate
      );

      setCustomTitle(result.title);
      setCustomDescription(result.description);
      setCustomDuration(result.duration);
      setSelectedStandards(result.standards || []);

      toast({
        title: "Success!",
        description: "AI-generated lesson plan is ready. Review and customize as needed.",
      });
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate lesson plan with AI. Please try again or create manually.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Create a new lesson plan
  const handleCreateLesson = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      if (isEditMode && currentLessonId) {
        // Update existing lesson
        updateLessonPlan(currentLessonId, 'title', customTitle);
        updateLessonPlan(currentLessonId, 'description', customDescription);
        updateLessonPlan(currentLessonId, 'duration', customDuration);

        // Store standards as metadata in the description
        const standardsMetadata = selectedStandards.length > 0
          ? `\n\n<!-- STANDARDS: ${selectedStandards.join(', ')} -->`
          : '';

        const descriptionWithStandards = customDescription.replace(/\n\n<!-- STANDARDS:.*?-->/, '') + standardsMetadata;
        updateLessonPlan(currentLessonId, 'description', descriptionWithStandards);
      } else {
        // Create new lesson
        appendLessonPlan();

        // Get the ID of the newly created lesson plan (last one in the array)
        const newLessonPlans = form.getValues().lessonPlans;
        const newLessonId = newLessonPlans[newLessonPlans.length - 1].id;

        // Append standards metadata to description
        const standardsMetadata = selectedStandards.length > 0
          ? `\n\n<!-- STANDARDS: ${selectedStandards.join(', ')} -->`
          : '';

        const descriptionWithStandards = customDescription + standardsMetadata;

        // Update the newly created lesson plan with our data
        updateLessonPlan(newLessonId, 'title', customTitle);
        updateLessonPlan(newLessonId, 'description', descriptionWithStandards);
        updateLessonPlan(newLessonId, 'duration', customDuration);
      }

      // Save lesson plans to the API and refresh the UI
      if (saveLessonPlans) {
        // Close the dialog first to avoid UI freezing
        setIsCreatingLesson(false);

        // Show some visual feedback by re-rendering
        setKey(Date.now());

        // Wait a brief moment to ensure the form state is updated
        setTimeout(async () => {
          // Save to API
          const success = await saveLessonPlans();

          // If save failed, console error and ensure UI is updated
          if (!success) {
            console.error("Failed to save lesson plans to API, but UI is updated locally");
            setKey(Date.now());
          }
          // If success, the page will reload via the saveLessonPlans implementation
        }, 100);
      } else {
        // If no API save method, just close the dialog and refresh UI
        setTimeout(() => {
          setIsCreatingLesson(false);
          setKey(Date.now());
        }, 100);
      }
    } catch (error) {
      console.error("Error creating lesson plan:", error);
    }
  };

  // Extract standards from lesson description
  const getLessonStandards = (description: string): string[] => {
    const match = description.match(/<!-- STANDARDS: (.*?) -->/);
    if (match && match[1]) {
      return match[1].split(', ');
    }
    return [];
  };

  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // Quick inline editing functions
  const startInlineEdit = (lessonId: string, field: string, currentValue: string) => {
    setEditingLesson(lessonId);
    setEditingField(field);
    setTempValues(prev => ({ ...prev, [`${lessonId}-${field}`]: currentValue }));
  };

  const cancelInlineEdit = () => {
    setEditingLesson(null);
    setEditingField(null);
    setTempValues({});
  };

  const saveInlineEdit = async (lessonId: string, field: string) => {
    const key = `${lessonId}-${field}`;
    const newValue = tempValues[key];

    if (newValue !== undefined) {
      updateLessonPlan(lessonId, field, newValue);

      // Auto-save after a short delay
      if (autoSaveTimeouts[lessonId]) {
        clearTimeout(autoSaveTimeouts[lessonId]);
      }

      const timeoutId = setTimeout(async () => {
        if (saveLessonPlans) {
          await saveLessonPlans();
        }
        // Clear the auto-save indicator after saving
        setAutoSaveTimeouts(prev => {
          const newTimeouts = { ...prev };
          delete newTimeouts[lessonId];
          return newTimeouts;
        });
      }, 1000);

      setAutoSaveTimeouts(prev => ({ ...prev, [lessonId]: timeoutId }));
    }

    cancelInlineEdit();
  };

  // Link management functions
  const startAddingLink = (lessonId: string) => {
    setAddingLinkFor(lessonId);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const cancelAddingLink = () => {
    setAddingLinkFor(null);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const saveNewLink = (lessonId: string) => {
    if (newLinkTitle.trim() && newLinkUrl.trim()) {
      const lesson = lessonPlans.find(l => l.id === lessonId);
      if (lesson) {
        const currentLinks = getLessonResourceLinks(lesson);
        const newResource = {
          id: Date.now().toString(),
          title: newLinkTitle.trim(),
          url: newLinkUrl.trim()
        };
        updateLessonResourceLinks(lessonId, [...currentLinks, newResource]);

        // Auto-save the new link
        if (autoSaveTimeouts[lessonId]) {
          clearTimeout(autoSaveTimeouts[lessonId]);
        }

        const timeoutId = setTimeout(async () => {
          if (saveLessonPlans) {
            await saveLessonPlans();
          }
          setAutoSaveTimeouts(prev => {
            const newTimeouts = { ...prev };
            delete newTimeouts[lessonId];
            return newTimeouts;
          });
        }, 1000);

        setAutoSaveTimeouts(prev => ({ ...prev, [lessonId]: timeoutId }));
      }
    }
    cancelAddingLink();
  };

  // Delete confirmation functions
  const handleDeleteClick = (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingLessonId(lessonId);
  };

  const confirmDelete = async () => {
    if (deletingLessonId) {
      // Remove from local state
      removeLessonPlan(deletingLessonId);

      // Update via API if available
      if (saveLessonPlans) {
        try {
          await saveLessonPlans();
        } catch (error) {
          console.error("Failed to save lesson plans after deletion:", error);
        }
      }

      setDeletingLessonId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingLessonId(null);
  };

  // File upload function
  const uploadFileToBackend = async (file: File, lessonId: string, lessonIndex: number, classId?: string) => {
    console.log("Uploading file:", form.getValues());
    if (!classId) {
      // For new classes, store files locally and show a message
      toast({
        title: "Class Not Saved Yet " + currentLessonId,
        description: "Files will be uploaded when you save the class. For now, files are stored locally.",
        variant: "default",
      });

      // Store file locally and return a temporary uploaded resource
      return {
        id: `temp-${lessonId}-${file.name}-${Date.now()}`,
        filename: file.name,
        originalFile: file,
        uploadStatus: 'uploaded' as const // Show as uploaded locally
      };
    }

    const fileKey = `${lessonId}-${file.name}`;
    setUploadingFiles(prev => new Set(prev).add(fileKey));

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // Upload to backend
      const response = await api.post(
        `/classes/${classId}/lesson-plans/${lessonIndex}/upload-resource`,
        {
          file: base64Data,
          filename: file.name
        }
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Add the uploaded file to the lesson's resourceFiles array
      const lesson = lessonPlans.find(l => (l.id || l._id) === lessonId);
      if (lesson && response.data) {
        const currentFiles = getLessonResourceFiles(lesson);
        const newFile = {
          _id: response.data.id || response.data._id,
          filename: file.name,
          url: response.data.url || '',
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        updateLessonResourceFiles(lessonId, [...currentFiles, newFile]);
      }

      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });

      return {
        id: response.data?.id || `${lessonId}-${file.name}-${Date.now()}`,
        filename: file.name,
        originalFile: file,
        uploadStatus: 'uploaded' as const
      };

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileKey);
        return newSet;
      });
    }
  };

  // Edit an existing lesson (for complex editing)
  const handleEditLesson = (lesson: any) => {
    setIsEditMode(true);
    setCurrentLessonId(lesson.id);
    setCustomTitle(lesson.title || '');
    setCustomDescription(lesson.description?.replace(/\n\n<!-- STANDARDS:.*?-->/, '') || '');
    setCustomDuration(lesson.duration || '60');
    setSelectedStandards(getLessonStandards(lesson.description || ''));
    setActiveTab("content");
    setIsEditModalOpen(true);
  };

  // Toggle a learning standard selection
  const toggleStandard = (standard: string) => {
    if (selectedStandards.includes(standard)) {
      setSelectedStandards(selectedStandards.filter(s => s !== standard));
    } else {
      setSelectedStandards([...selectedStandards, standard]);
    }
  };

  // Calculate completion rate for standards coverage
  const getStandardsCoverage = (): number => {
    // Get all standards from all lesson plans
    const allStandardsUsed = lessonPlans
      .map(lesson => getLessonStandards(lesson.description || ''))
      .flat();

    // Count unique standards used
    const uniqueStandardsUsed = new Set(allStandardsUsed);

    // Calculate percentage of available standards covered
    return Math.round((uniqueStandardsUsed.size / availableStandards.length) * 100);
  };

  const standardsCoverage = getStandardsCoverage();

  return (
    <div className="space-y-4" key={key}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Lesson Plans
              {filteredAndSortedLessons.length !== lessonPlans.length && (
                <Badge variant="secondary" className="ml-2">
                  {filteredAndSortedLessons.length} of {lessonPlans.length}
                </Badge>
              )}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create detailed lesson plans for your class. ✨ Click any field to edit inline!
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsCreatingLesson(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Lesson Plan
          </Button>
        </div>

        {/* Search and Filter Controls */}
        {lessonPlans.length > 5 && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="py-3">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search lessons by title or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <Select value={filterStandard} onValueChange={setFilterStandard}>
                      <SelectTrigger className="w-40 bg-white">
                        <SelectValue placeholder="Filter by standard" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Standards</SelectItem>
                        {availableStandards.map(standard => (
                          <SelectItem key={standard} value={standard.split(' - ')[0]}>
                            {standard.split(' - ')[0]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-gray-500" />
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-32 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex border rounded-lg bg-white">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none border-l"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="text-sm text-gray-600">
                  Showing {paginatedLessons.length} of {filteredAndSortedLessons.length} lessons
                </div>
                {totalPages > 1 && (
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lesson Creation Dialog */}
      <Dialog
        modal={true}
        open={isCreatingLesson}
        onOpenChange={(open) => {
          // Prevent unexpected closures
          if (!open) {
            setTimeout(() => {
              setIsCreatingLesson(false);
            }, 100);
          } else {
            setIsCreatingLesson(true);
          }
        }}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Lesson Plan' : 'Create New Lesson Plan'}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? 'Update your lesson plan content and settings'
                : 'Choose a template or create a custom lesson plan'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-hidden">
            <Tabs defaultValue="template">
              <TabsList className="w-full flex">
                <TabsTrigger value="template" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="custom" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Custom
                </TabsTrigger>
                <TabsTrigger value="standards" className="flex-1">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Standards
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Resources
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="max-h-[60vh] overflow-y-auto">
                <div className="p-1 mt-2">
                  <TabsContent value="template" className="space-y-4 mt-0">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="use-ai"
                        checked={useAI}
                        onCheckedChange={setUseAI}
                      />
                      <Label htmlFor="use-ai" className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
                        Enhance with AI
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templates.map(template => (
                        <div
                          key={template.id}
                          className="relative"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTemplate(template.id);
                            return false;
                          }}
                        >
                          <Card
                            className={`cursor-pointer hover:border-blue-300 transition-all ${selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : ''
                              }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedTemplate(template.id);
                              return false;
                            }}
                          >
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">{template.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2">
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                    {useAI && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAIGeneration();
                        }}
                        disabled={isGenerating}
                        className="w-full mt-4"
                        variant="outline"
                      >
                        {isGenerating ? (
                          <>
                            <motion.div
                              className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            ></motion.div>
                            Generating Content...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate AI Content
                          </>
                        )}
                      </Button>
                    )}
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4 mt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lesson-title">Lesson Title</Label>
                        <Input
                          id="lesson-title"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          placeholder="Enter a descriptive title for this lesson"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lesson-description">Detailed Plan</Label>
                        <Textarea
                          id="lesson-description"
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="Enter the detailed lesson plan including objectives, activities, and assessments"
                          className="h-[220px] font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Supports Markdown formatting. Use #, ##, ### for headings, * for lists, etc.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lesson-duration">Duration (minutes)</Label>
                        <Input
                          id="lesson-duration"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                          type="number"
                          placeholder="60"
                          className="w-full sm:w-40"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="standards" className="space-y-4 mt-0">
                    <h3 className="font-medium text-sm mb-2">Learning Standards</h3>
                    <div className="space-y-2">
                      {availableStandards.map(standard => (
                        <div key={standard} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`standard-${standard}`}
                            checked={selectedStandards.includes(standard)}
                            onChange={() => toggleStandard(standard)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`standard-${standard}`} className="text-sm">
                            {standard}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4 mt-0">
                    {isEditMode && currentLessonId && (
                      <div className="space-y-4">
                        <h3 className="font-medium text-sm mb-2">Lesson Resources</h3>

                        <div className="space-y-4">
                          <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              Supporting Files
                            </h4>
                            {handleLessonFileChange && removeLessonFile && (
                              <FileUploads
                                lessonId={currentLessonId}
                                classId={form.getValues('id') || undefined} // Pass class ID for upload API (if available)
                                lessonIndex={lessonPlans.findIndex(plan => plan.id === currentLessonId)} // Pass lesson index
                                files={lessonFileUploads[currentLessonId] || []}
                                uploadedResources={uploadedResources[currentLessonId] || []}
                                onFilesSelected={(lessonId, files) => {
                                  if (handleLessonFileChange) {
                                    const event = {
                                      target: { files: files }
                                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                                    handleLessonFileChange(lessonId, event);
                                  }
                                }}
                                onFileRemove={removeLessonFile}
                                onResourceUploaded={handleResourceUploaded}
                                onResourceRemoved={handleResourceRemoved}
                              />
                            )}
                          </div>

                          <div className="border rounded-md p-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center">
                              <Link className="h-4 w-4 mr-2" />
                              Resource Links
                            </h4>

                            {currentLessonId && (
                              <ResourceLinks
                                lessonId={currentLessonId}
                                resourceLinks={(() => {
                                  const lesson = lessonPlans.find(l => l.id === currentLessonId);
                                  return getLessonResourceLinks(lesson || {});
                                })()}
                                onAddResourceLink={(lessonId, title, url) => {
                                  const lesson = lessonPlans.find(l => l.id === lessonId);
                                  if (lesson) {
                                    const currentLinks = getLessonResourceLinks(lesson);
                                    const newResource = { id: Date.now().toString(), title, url };
                                    updateLessonResourceLinks(lessonId, [...currentLinks, newResource]);
                                  }
                                }}
                                onRemoveResourceLink={(lessonId, linkId) => {
                                  const lesson = lessonPlans.find(l => l.id === lessonId);
                                  if (lesson) {
                                    const currentLinks = getLessonResourceLinks(lesson);
                                    const updatedLinks = currentLinks.filter((res: ResourceLink) => res.id !== linkId);
                                    updateLessonResourceLinks(lessonId, updatedLinks);
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {!isEditMode && (
                      <div className="text-center p-4 text-muted-foreground text-sm">
                        <p>Resources can be added after creating the lesson plan.</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCreatingLesson(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCreateLesson();
              }}
              disabled={!customTitle || !customDescription}
              type="button"
            >
              {isEditMode ? 'Update Lesson' : 'Create Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standards Coverage */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Book className="h-4 w-4 mr-2 text-blue-600" />
            Learning Standards Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="w-full bg-blue-100 h-2 rounded-full mb-2">
            <div
              className={`h-full rounded-full ${standardsCoverage > 75 ? 'bg-green-500' :
                standardsCoverage > 50 ? 'bg-blue-500' :
                  standardsCoverage > 25 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              style={{ width: `${standardsCoverage}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{standardsCoverage}% of standards covered</span>
            <span>{lessonPlans.length} lesson plans</span>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Plans List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-3'}>
        <AnimatePresence>
          {lessonPlans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState
                onAddLesson={() => setIsCreatingLesson(true)}
                onApplyAIContent={(changes) => {
                  if (changes.lessonPlans) {
                    const currentPlans = form.getValues('lessonPlans') || [];
                    const newPlans = [...currentPlans, ...changes.lessonPlans];
                    form.setValue('lessonPlans', newPlans, { shouldValidate: true });
                  }
                }}
              />
            </motion.div>
          ) : (
            paginatedLessons.map((lesson, paginatedIndex) => {
              const originalIndex = filteredAndSortedLessons.indexOf(lesson);
              const displayIndex = startIndex + paginatedIndex + 1;
              const lessonId = getLessonId(lesson);
              const standards = getLessonStandards(lesson.description || '');
              const isEditingTitle = editingLesson === lessonId && editingField === 'title';
              const isEditingDescription = editingLesson === lessonId && editingField === 'description';
              const isCollapsed = lessonVisibility[lessonId] === true;
              const resourceLinks = getLessonResourceLinks(lesson);
              const resourceFiles = getLessonResourceFiles(lesson);
              const hasResources = (uploadedResources[lessonId]?.length || 0) + (lessonFileUploads[lessonId]?.length || 0) + resourceLinks.length + resourceFiles.length > 0;

              return (
                <motion.div
                  key={lesson.id || lesson._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={viewMode === 'list' ? 'w-full' : ''}
                >
                  <Card className={`hover:border-blue-200 transition-all group ${viewMode === 'list' ? 'mb-2' : 'h-fit'} ${isCollapsed ? 'bg-gray-50' : ''}`}>
                    <CardHeader className="py-3 flex flex-row items-start justify-between space-y-0">
                      <div className="flex-1 mr-3">
                        {/* Inline Title Editing */}
                        {isEditingTitle ? (
                          <div className="flex items-start space-x-2">
                            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-1">
                              {displayIndex}
                            </span>
                            <Input
                              value={tempValues[`${lesson.id}-title`] || ''}
                              onChange={(e) => setTempValues(prev => ({ ...prev, [`${lesson.id}-title`]: e.target.value }))}
                              className="text-base font-semibold min-h-[2rem] flex-1"
                              placeholder="Enter lesson title..."
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveInlineEdit(lesson.id, 'title');
                                } else if (e.key === 'Escape') {
                                  cancelInlineEdit();
                                }
                              }}
                              onBlur={() => saveInlineEdit(lesson.id, 'title')}
                            />
                            <div className="flex space-x-1 flex-shrink-0 mt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => saveInlineEdit(lesson.id, 'title')}
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={cancelInlineEdit}
                              >
                                <X className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <CardTitle
                            className="text-base flex items-start cursor-pointer hover:bg-blue-50 p-1 -m-1 rounded group-hover:bg-blue-50/50 transition-colors"
                            onClick={() => startInlineEdit(lesson.id, 'title', lesson.title || '')}
                          >
                            <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                              {displayIndex}
                            </span>
                            <span className="flex-1 min-w-0 break-words leading-tight">{lesson.title || 'Untitled Lesson'}</span>
                            <Edit className="h-3 w-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 mt-0.5 flex-shrink-0" />
                          </CardTitle>
                        )}

                        {/* Duration Display */}
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>{lesson.duration || 60} minutes</span>
                        </CardDescription>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleLessonVisibility(lesson.id)}
                          title={isCollapsed ? "Expand lesson" : "Collapse lesson"}
                        >
                          {isCollapsed ? <Eye className="h-4 w-4 text-gray-600" /> : <EyeOff className="h-4 w-4 text-gray-600" />}
                          <span className="sr-only">{isCollapsed ? "Expand" : "Collapse"}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditLesson(lesson);
                          }}
                          title="Advanced Edit"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          <span className="sr-only">Advanced Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => handleDeleteClick(e, lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardHeader>
                    {!isCollapsed && <CardContent className="py-2">
                      {/* Inline Description Editing */}
                      {isEditingDescription ? (
                        <div className="space-y-2">
                          <Textarea
                            value={tempValues[`${lesson.id}-description`] || ''}
                            onChange={(e) => setTempValues(prev => ({ ...prev, [`${lesson.id}-description`]: e.target.value }))}
                            className="min-h-[100px] text-sm font-mono"
                            placeholder="Enter lesson description..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                cancelInlineEdit();
                              }
                            }}
                          />
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                              Supports Markdown. Press Escape to cancel.
                            </p>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelInlineEdit}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => saveInlineEdit(lesson.id, 'description')}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="text-sm max-h-24 overflow-hidden relative mb-3 cursor-pointer hover:bg-blue-50/50 p-2 -m-2 rounded transition-colors group/desc"
                          onClick={() => startInlineEdit(lesson.id, 'description', lesson.description?.replace(/\\n\\n<!-- STANDARDS:.*?-->/, '') || '')}
                        >
                          <div className="prose prose-sm">
                            {lesson.description ? (
                              <div dangerouslySetInnerHTML={{
                                __html: lesson.description
                                  .replace(/# (.*)/g, '<h3 class="text-base font-medium mt-1 mb-2">$1</h3>')
                                  .replace(/## (.*)/g, '<h4 class="text-sm font-medium mt-1 mb-1">$1</h4>')
                                  .replace(/\\n/g, '<br />')
                                  .replace(/<!-- STANDARDS:.*?-->/g, '')
                              }}></div>
                            ) : (
                              <p className="text-muted-foreground italic">Click to add description...</p>
                            )}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                          <Edit className="absolute top-2 right-2 h-3 w-3 text-blue-400 opacity-0 group-hover/desc:opacity-100 transition-opacity" />
                        </div>
                      )}

                      {/* Badges and Indicators */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Auto-save indicator */}
                        {autoSaveTimeouts[lesson.id] && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center text-xs text-green-600"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-saving...
                          </motion.div>
                        )}

                        {standards.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {standards.map(standard => (
                              <Badge key={standard} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                <Star className="h-3 w-3 mr-1 text-amber-500" />
                                {standard}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Show resource indicators */}
                        {(() => {
                          const resourceLinks = getLessonResourceLinks(lesson);
                          const resourceFiles = getLessonResourceFiles(lesson);
                          return (
                            <>
                              {resourceLinks.length > 0 && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  <Link className="h-3 w-3 mr-1" />
                                  {resourceLinks.length} {resourceLinks.length === 1 ? 'link' : 'links'}
                                </Badge>
                              )}
                              {resourceFiles.length > 0 && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  <Upload className="h-3 w-3 mr-1" />
                                  {resourceFiles.length} {resourceFiles.length === 1 ? 'file' : 'files'}
                                </Badge>
                              )}
                            </>
                          );
                        })()}

                        {lessonFileUploads[lesson.id]?.length > 0 && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Upload className="h-3 w-3 mr-1" />
                            {lessonFileUploads[lesson.id].length} {lessonFileUploads[lesson.id].length === 1 ? 'file' : 'files'}
                          </Badge>
                        )}
                      </div>

                      {/* Resources & Links Section */}
                      <div className="mt-4 border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="text-sm font-medium text-gray-700">Resources & Files</Label>
                          {(() => {
                            const resourceLinks = getLessonResourceLinks(lesson);
                            const resourceFiles = getLessonResourceFiles(lesson);
                            const totalItems = (uploadedResources[lesson.id]?.length || 0) + (lessonFileUploads[lesson.id]?.length || 0) + resourceLinks.length + resourceFiles.length;
                            return totalItems > 0 && (
                              <span className="text-xs text-gray-500">
                                {totalItems} items
                              </span>
                            );
                          })()}
                        </div>

                        {/* Show Resource Links */}
                        {(() => {
                          const resourceLinks = getLessonResourceLinks(lesson);
                          return resourceLinks.length > 0 && (
                            <div className="space-y-2 mb-3">
                              <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Links</h4>
                              {resourceLinks.map((link: any) => (
                                <div key={link.id} className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded text-sm">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <Link className="h-3 w-3 text-amber-600 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-amber-700 truncate">{link.title}</div>
                                      <div className="text-xs text-amber-600 truncate">{link.url}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs flex-shrink-0">Link</Badge>
                                  </div>
                                  <div className="flex items-center space-x-1 ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => window.open(link.url, '_blank')}
                                      className="h-6 w-6 p-0 text-amber-600 hover:text-amber-700"
                                      title="Open link"
                                    >
                                      <Link className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentLinks = getLessonResourceLinks(lesson);
                                        const updatedLinks = currentLinks.filter((res: any) => res.id !== link.id);
                                        updateLessonResourceLinks(lesson.id, updatedLinks);
                                      }}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Show Resource Files */}
                        {(() => {
                          const resourceFiles = getLessonResourceFiles(lesson);
                          return resourceFiles.length > 0 && (
                            <div className="space-y-2 mb-3">
                              <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Server Files</h4>
                              {resourceFiles.map((file: any) => (
                                <div key={file._id || file.id} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <Upload className="h-3 w-3 text-blue-600 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-blue-700 truncate">{file.filename || file.name}</div>
                                      <div className="text-xs text-blue-600 truncate">Uploaded to server</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs flex-shrink-0">File</Badge>
                                  </div>
                                  <div className="flex items-center space-x-1 ml-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentFiles = getLessonResourceFiles(lesson);
                                        const updatedFiles = currentFiles.filter((res: any) => (res._id || res.id) !== (file._id || file.id));
                                        updateLessonResourceFiles(lesson.id || lesson._id, updatedFiles);
                                      }}
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}

                        {/* Show uploading files */}
                        {Array.from(uploadingFiles).some(key => key.startsWith(lesson.id)) && (
                          <div className="space-y-2 mb-3">
                            <h4 className="text-xs font-medium text-blue-600 uppercase tracking-wide">Uploading</h4>
                            {Array.from(uploadingFiles)
                              .filter(key => key.startsWith(lesson.id))
                              .map(fileKey => {
                                const filename = fileKey.split('-').slice(1, -1).join('-') || fileKey.split('-')[1];
                                return (
                                  <div key={fileKey} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                    <div className="flex items-center space-x-2">
                                      <motion.div
                                        className="h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                      />
                                      <span className="text-blue-700 font-medium">{filename}</span>
                                      <Badge variant="outline" className="text-xs">Uploading...</Badge>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}

                        {/* Show temporary uploaded files (only those not yet in resourceFiles) and local files */}
                        {(uploadedResources[lesson.id]?.length > 0 || lessonFileUploads[lesson.id]?.length > 0) && (
                          <div className="space-y-2 mb-3">
                            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">Temporary Files</h4>
                            {/* Show only temporary uploaded resources that aren't already in resourceFiles */}
                            {uploadedResources[lesson.id]?.filter(resource => {
                              // Only show temporary files or files not yet in resourceFiles
                              const resourceFiles = getLessonResourceFiles(lesson);
                              return resource.id.startsWith('temp-') || !resourceFiles.some(f => f.id === resource.id);
                            }).map((resource) => {
                              const isLocalFile = resource.id.startsWith('temp-');
                              return (
                                <div key={resource.id} className={`flex items-center justify-between p-2 rounded text-sm ${isLocalFile ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
                                  }`}>
                                  <div className="flex items-center space-x-2">
                                    <Upload className={`h-3 w-3 ${isLocalFile ? 'text-yellow-600' : 'text-green-600'}`} />
                                    <span className={`font-medium ${isLocalFile ? 'text-yellow-700' : 'text-green-700'}`}>
                                      {resource.filename}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {isLocalFile ? 'Local' : 'Temporary'}
                                    </Badge>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResourceRemoved(lesson.id, resource.id)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              );
                            })}

                            {/* Local Files (ready to upload) */}
                            {lessonFileUploads[lesson.id]?.map((file, fileIndex) => (
                              <div key={`local-${fileIndex}`} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-3 w-3 text-blue-600" />
                                  <span className="text-blue-700 font-medium">{file.name}</span>
                                  <Badge variant="outline" className="text-xs">Ready to upload</Badge>
                                </div>
                                <div className="flex items-center space-x-1">
                                  {handleLessonFileChange && form.getValues('id') && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={async () => {
                                        const lessonIndex = lessonPlans.findIndex(plan => plan.id === lesson.id);
                                        const fileKey = `${lesson.id}-${file.name}`;
                                        const isUploading = uploadingFiles.has(fileKey);

                                        if (isUploading) return; // Prevent double upload

                                        const uploadedResource = await uploadFileToBackend(file, lesson.id, lessonIndex, classId);

                                        if (uploadedResource) {
                                          handleResourceUploaded(lesson.id, uploadedResource);
                                          // Remove from local files
                                          if (removeLessonFile) {
                                            removeLessonFile(lesson.id, fileIndex);
                                          }
                                        }
                                      }}
                                      className="h-6 text-xs text-blue-600 border-blue-200"
                                      disabled={uploadingFiles.has(`${lesson.id}-${file.name}`)}
                                    >
                                      {uploadingFiles.has(`${lesson.id}-${file.name}`) ? (
                                        <>
                                          <motion.div
                                            className="h-3 w-3 border border-current border-t-transparent rounded-full mr-1"
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                          />
                                          Uploading...
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="h-3 w-3 mr-1" />
                                          Upload
                                        </>
                                      )}
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeLessonFile && removeLessonFile(lesson.id, fileIndex)}
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Link Form */}
                        {addingLinkFor === lesson.id && (
                          <div className="space-y-3 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
                            <div className="space-y-2">
                              <Input
                                placeholder="Link title (e.g., 'Interactive Quiz')"
                                value={newLinkTitle}
                                onChange={(e) => setNewLinkTitle(e.target.value)}
                                className="text-sm"
                                autoFocus
                              />
                              <Input
                                placeholder="URL (e.g., 'https://example.com')"
                                value={newLinkUrl}
                                onChange={(e) => setNewLinkUrl(e.target.value)}
                                className="text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    saveNewLink(lesson.id);
                                  } else if (e.key === 'Escape') {
                                    cancelAddingLink();
                                  }
                                }}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelAddingLink}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => saveNewLink(lesson.id)}
                                disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Add Link
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Add Files Button */}
                          {handleLessonFileChange && (
                            <div className="relative">
                              <input
                                type="file"
                                multiple
                                accept="*"
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;

                                  const lessonIndex = lessonPlans.findIndex(plan => plan.id === lesson.id);

                                  // Upload each file immediately
                                  for (const file of files) {
                                    const uploadedResource = await uploadFileToBackend(file, lesson.id, lessonIndex, classId);
                                    if (uploadedResource) {
                                      handleResourceUploaded(lesson.id, uploadedResource);
                                    }
                                  }

                                  // Clear the input
                                  e.target.value = '';
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id={`file-upload-${lesson.id}`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                                asChild
                              >
                                <label htmlFor={`file-upload-${lesson.id}`} className="cursor-pointer">
                                  <Upload className="h-4 w-4 mr-2" />
                                  Add Files
                                </label>
                              </Button>
                            </div>
                          )}

                          {/* Add Link Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startAddingLink(lesson.id)}
                            className="border-dashed border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-600"
                            disabled={addingLinkFor === lesson.id}
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Add Link
                          </Button>
                        </div>
                      </div>
                    </CardContent>}
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card className="bg-gray-50 border-gray-200 mt-6">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + LESSONS_PER_PAGE, filteredAndSortedLessons.length)} of {filteredAndSortedLessons.length} lessons
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Lesson Plan Modal */}
      <Dialog
        modal={true}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          // Prevent unexpected closures
          if (!open) {
            setTimeout(() => {
              setIsEditModalOpen(false);
            }, 100);
          } else {
            setIsEditModalOpen(true);
          }
        }}
      >
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Edit Lesson Plan
            </DialogTitle>
            <DialogDescription>
              Update your lesson plan content and resources in one place
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-hidden mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="content" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Files & Resources
                </TabsTrigger>
                <TabsTrigger value="standards" className="flex items-center">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Standards
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[50vh] mt-4">
                <TabsContent value="content" className="space-y-4 p-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-title">Lesson Title</Label>
                      <Input
                        id="edit-lesson-title"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Enter a descriptive title for this lesson"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-description">Detailed Plan</Label>
                      <Textarea
                        id="edit-lesson-description"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Enter the detailed lesson plan including objectives, activities, and assessments"
                        className="h-[220px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Supports Markdown formatting. Use #, ##, ### for headings, * for lists, etc.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-duration">Duration (minutes)</Label>
                      <Input
                        id="edit-lesson-duration"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        type="number"
                        placeholder="60"
                        className="w-full sm:w-40"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-6 p-1">
                  {currentLessonId && (
                    <>
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Supporting Files
                          </h4>
                          {handleLessonFileChange && removeLessonFile && (
                            <FileUploads
                              lessonId={currentLessonId}
                              classId={form.getValues('id') || undefined}
                              lessonIndex={lessonPlans.findIndex(plan => plan.id === currentLessonId)}
                              files={lessonFileUploads[currentLessonId] || []}
                              uploadedResources={uploadedResources[currentLessonId] || []}
                              onFilesSelected={(lessonId, files) => {
                                if (handleLessonFileChange) {
                                  const event = {
                                    target: { files: files }
                                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                                  handleLessonFileChange(lessonId, event);
                                }
                              }}
                              onFileRemove={removeLessonFile}
                              onResourceUploaded={handleResourceUploaded}
                              onResourceRemoved={handleResourceRemoved}
                            />
                          )}
                        </div>

                        <div className="border rounded-md p-4">
                          <h4 className="text-sm font-medium mb-3 flex items-center">
                            <Link className="h-4 w-4 mr-2" />
                            Resource Links
                          </h4>

                          <ResourceLinks
                            lessonId={currentLessonId}
                            resourceLinks={(() => {
                              const lesson = lessonPlans.find(l => l.id === currentLessonId);
                              return getLessonResourceLinks(lesson || {});
                            })()}
                            onAddResourceLink={(lessonId, title, url) => {
                              const lesson = lessonPlans.find(l => l.id === lessonId);
                              if (lesson) {
                                const currentLinks = getLessonResourceLinks(lesson);
                                const newResource = { id: Date.now().toString(), title, url };
                                updateLessonResourceLinks(lessonId, [...currentLinks, newResource]);
                              }
                            }}
                            onRemoveResourceLink={(lessonId, linkId) => {
                              const lesson = lessonPlans.find(l => l.id === lessonId);
                              if (lesson) {
                                const currentLinks = getLessonResourceLinks(lesson);
                                const updatedLinks = currentLinks.filter((res: ResourceLink) => res.id !== linkId);
                                updateLessonResourceLinks(lessonId, updatedLinks);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="standards" className="space-y-4 p-1">
                  <h3 className="font-medium text-sm mb-2">Learning Standards</h3>
                  <div className="space-y-2">
                    {availableStandards.map(standard => (
                      <div key={standard} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`edit-standard-${standard}`}
                          checked={selectedStandards.includes(standard)}
                          onChange={() => toggleStandard(standard)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor={`edit-standard-${standard}`} className="text-sm">
                          {standard}
                        </Label>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between">
            <div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                {customDuration} minutes
                {selectedStandards.length > 0 && (
                  <span className="ml-3 flex items-center">
                    <Star className="h-4 w-4 mr-1.5 text-amber-500" />
                    {selectedStandards.length} standards
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditModalOpen(false);
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (currentLessonId) {
                    // Update the lesson with all data
                    updateLessonPlan(currentLessonId, 'title', customTitle);
                    updateLessonPlan(currentLessonId, 'description', customDescription);
                    updateLessonPlan(currentLessonId, 'duration', customDuration);

                    // Store standards as metadata in the description
                    const standardsMetadata = selectedStandards.length > 0
                      ? `\n\n<!-- STANDARDS: ${selectedStandards.join(', ')} -->`
                      : '';

                    const descriptionWithStandards = customDescription.replace(/\n\n<!-- STANDARDS:.*?-->/, '') + standardsMetadata;
                    updateLessonPlan(currentLessonId, 'description', descriptionWithStandards);

                    // Save to API and refresh UI
                    if (saveLessonPlans) {
                      // First close the modal to avoid UI freezing
                      setIsEditModalOpen(false);

                      // Show some visual feedback before the page reloads
                      // This also helps with the transition by forcing a re-render
                      setKey(Date.now());

                      // Then save to API
                      saveLessonPlans().then(success => {
                        if (!success) {
                          console.error("Failed to save lesson plans to API, but UI is updated locally");
                          // If API save fails, we still want to update the UI
                          setKey(Date.now());
                        }
                        // If success, the page will reload via the saveLessonPlans implementation
                      });
                    } else {
                      // If no API save method, just close modal and refresh UI
                      setIsEditModalOpen(false);
                      setKey(Date.now());
                    }
                  }
                }}
                disabled={!customTitle || !customDescription}
                type="button"
              >
                Save Lesson Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Floating Dialog */}
      {deletingLessonId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={cancelDelete}
          />

          {/* Floating Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="relative bg-white rounded-lg shadow-xl border p-6 w-80 mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete lesson plan?</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={cancelDelete}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                className="px-4 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLessonPlanCreator;