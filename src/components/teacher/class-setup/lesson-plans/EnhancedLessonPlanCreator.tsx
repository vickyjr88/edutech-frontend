import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, PlusCircle, Clock, FileText, Book, ListChecks, Trash2, Calendar, Star, Edit, Link, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { ClassFormValues } from '../types';
import { FileUploads } from './FileUploads';
import { ResourceLinks, ResourceLink } from './ResourceLinks';

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

// Mock AI generation - in a real implementation, this would call an API
const generateLessonWithAI = (subjectId: string, title: string, classType: string, template?: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create subject-specific content
      let content = '';
      const isAssessment = template === 'assessment';
      
      if (subjectId.includes('english') || subjectId.includes('language')) {
        content = isAssessment ? 
          `# Reading Comprehension Assessment
          
## Objectives
- Assess student understanding of main idea and supporting details
- Evaluate reading fluency and expression
- Measure vocabulary development

## Assessment Components
1. Reading passage analysis (20 minutes)
2. Vocabulary in context questions (10 minutes)
3. Short response questions (15 minutes)
4. Reading fluency check-in (individual assessments during independent work)

## Preparation
Prepare reading passages at appropriate levels and assessment rubrics.` :
          `# Language Arts Lesson: Narrative Elements
          
## Objectives
- Identify key elements of narrative texts
- Analyze character development in a story
- Apply narrative structure to writing

## Activities
1. Read-aloud and discussion (15 minutes)
2. Character analysis chart (10 minutes)
3. Story elements graphic organizer (15 minutes)
4. Writing prompt: Create a character (15 minutes)
5. Sharing and feedback (5 minutes)

## Resources
- Selected reading text
- Graphic organizers
- Writing materials`;
      } else if (subjectId.includes('math')) {
        content = isAssessment ?
          `# Mathematics Assessment: Problem Solving
          
## Objectives
- Evaluate understanding of key mathematical concepts
- Assess problem-solving strategies
- Measure procedural fluency

## Assessment Components
1. Quick skill review (10 minutes)
2. Problem-solving assessment (25 minutes)
3. Self-evaluation of strategies used (10 minutes)
4. Challenge problems (for early finishers)

## Preparation
Prepare assessment with varied question types and difficulty levels.` :
          `# Mathematics Lesson: Problem-Solving Strategies
          
## Objectives
- Apply multiple strategies to solve word problems
- Explain mathematical thinking and reasoning
- Evaluate the efficiency of different approaches

## Activities
1. Warm-up problem (5 minutes)
2. Strategy demonstration (10 minutes)
3. Guided practice with partner work (15 minutes)
4. Independent problem-solving (20 minutes)
5. Strategy sharing and comparison (10 minutes)

## Resources
- Problem set handouts
- Math manipulatives
- Strategy reference charts`;
      } else if (subjectId.includes('science')) {
        content = isAssessment ?
          `# Science Assessment: Concept Application
          
## Objectives
- Evaluate understanding of scientific concepts
- Assess ability to interpret data
- Measure application of scientific method

## Assessment Components
1. Concept review questions (15 minutes)
2. Data interpretation exercise (15 minutes)
3. Experimental design scenario (15 minutes)
4. Self-reflection (5 minutes)

## Preparation
Prepare assessment materials and data sets for interpretation.` :
          `# Science Lesson: Experimental Investigation
          
## Objectives
- Design a controlled experiment
- Collect and record accurate data
- Draw evidence-based conclusions

## Activities
1. Question and hypothesis formation (10 minutes)
2. Experimental design planning (15 minutes)
3. Experiment execution (20 minutes)
4. Data analysis and conclusion drawing (10 minutes)
5. Presentation of findings (5 minutes)

## Resources
- Lab equipment
- Data collection sheets
- Safety guidelines`;
      } else {
        content = isAssessment ?
          `# Unit Assessment
          
## Objectives
- Evaluate conceptual understanding
- Assess skill application in context
- Measure progress toward learning goals

## Assessment Components
1. Key concept review (10 minutes)
2. Written assessment (30 minutes)
3. Reflection on learning (10 minutes)
4. Self-evaluation (10 minutes)

## Preparation
Prepare assessment items aligned with unit objectives.` :
          `# Lesson Plan: Key Concept Exploration
          
## Objectives
- Understand foundational concepts
- Apply knowledge in relevant contexts
- Develop critical thinking skills

## Activities
1. Concept introduction (10 minutes)
2. Guided exploration (15 minutes)
3. Collaborative application (20 minutes)
4. Independent practice (10 minutes)
5. Check for understanding (5 minutes)

## Resources
- Presentation materials
- Activity worksheets
- Reference materials`;
      }
      
      resolve({
        title: title || (isAssessment ? 'Unit Assessment' : 'Lesson Plan'),
        description: content,
        duration: '60',
        standards: subjectId ? 
          (learningStandards[subjectId.split('_')[0]] || learningStandards.default).slice(0, 3) :
          learningStandards.default.slice(0, 3)
      });
    }, 1500); // Simulate API delay
  });
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
  // Force UI refresh when lessonPlans change
  const [key, setKey] = useState(Date.now());

  // Update the key when lessonPlans change to force a re-render
  useEffect(() => {
    setKey(Date.now());
  }, [lessonPlans, lessonFileUploads]);
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
  
  const availableStandards = subject ? 
    learningStandards[subject.split('_')[0]] || learningStandards.default :
    learningStandards.default;
  
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
    } catch (error) {
      console.error("AI generation error:", error);
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

  // Edit an existing lesson
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Lesson Plans
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create detailed lesson plans for your class.
          </p>
        </div>
        
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
          <DialogTrigger asChild>
            <Button type="button" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Lesson Plan
            </Button>
          </DialogTrigger>

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
                            className={`cursor-pointer hover:border-blue-300 transition-all ${
                              selectedTemplate === template.id ? 'border-blue-500 bg-blue-50' : ''
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
                                  files={lessonFileUploads[currentLessonId] || []}
                                  onFilesSelected={(lessonId, files) => {
                                    if (handleLessonFileChange) {
                                      const mockEvent = {
                                        target: { files: files }
                                      } as unknown as React.ChangeEvent<HTMLInputElement>;
                                      handleLessonFileChange(lessonId, mockEvent);
                                    }
                                  }}
                                  onFileRemove={removeLessonFile}
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
                                    return lesson?.resources ? JSON.parse(lesson.resources) : [];
                                  })()}
                                  onAddResourceLink={(lessonId, title, url) => {
                                    const lesson = lessonPlans.find(l => l.id === lessonId);
                                    if (lesson) {
                                      const resources = lesson.resources ? JSON.parse(lesson.resources) : [];
                                      const newResource = { id: Date.now().toString(), title, url };
                                      updateLessonPlan(lessonId, "resources", JSON.stringify([...resources, newResource]));
                                    }
                                  }}
                                  onRemoveResourceLink={(lessonId, linkId) => {
                                    const lesson = lessonPlans.find(l => l.id === lessonId);
                                    if (lesson) {
                                      const resources = lesson.resources ? JSON.parse(lesson.resources) : [];
                                      const updatedResources = resources.filter((res: ResourceLink) => res.id !== linkId);
                                      updateLessonPlan(lessonId, "resources", JSON.stringify(updatedResources));
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
      </div>
      
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
              className={`h-full rounded-full ${
                standardsCoverage > 75 ? 'bg-green-500' : 
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
      <div className="space-y-3">
        <AnimatePresence>
          {lessonPlans.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6 text-center"
            >
              <div className="flex flex-col items-center justify-center text-gray-500">
                <FileText className="h-10 w-10 mb-3 text-gray-400" />
                <h3 className="font-medium mb-1">No Lesson Plans Yet</h3>
                <p className="text-sm max-w-md mx-auto mb-4">
                  Create your first lesson plan using templates, or get AI-assisted content generation to save time.
                </p>
                <Button onClick={() => setIsCreatingLesson(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add First Lesson
                </Button>
              </div>
            </motion.div>
          ) : (
            lessonPlans.map((lesson, index) => {
              const standards = getLessonStandards(lesson.description || '');
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:border-blue-200 transition-all">
                    <CardHeader className="py-3 flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base flex items-center">
                          <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-2">
                            {index + 1}
                          </span>
                          {lesson.title || 'Untitled Lesson'}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>{lesson.duration || 60} minutes</span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditLesson(lesson);
                          }}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => removeLessonPlan(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="text-sm max-h-24 overflow-hidden relative mb-3">
                        <div className="prose prose-sm">
                          {lesson.description ? (
                            <div dangerouslySetInnerHTML={{ 
                              __html: lesson.description
                                .replace(/# (.*)/g, '<h3 class="text-base font-medium mt-1 mb-2">$1</h3>')
                                .replace(/## (.*)/g, '<h4 class="text-sm font-medium mt-1 mb-1">$1</h4>')
                                .replace(/\n/g, '<br />')
                                .replace(/<!-- STANDARDS:.*?-->/g, '')
                            }}></div>
                          ) : (
                            <p className="text-muted-foreground italic">No description provided</p>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
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
                        {lesson.resources && JSON.parse(lesson.resources).length > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Link className="h-3 w-3 mr-1" />
                            {JSON.parse(lesson.resources).length} {JSON.parse(lesson.resources).length === 1 ? 'link' : 'links'}
                          </Badge>
                        )}

                        {lessonFileUploads[lesson.id]?.length > 0 && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Upload className="h-3 w-3 mr-1" />
                            {lessonFileUploads[lesson.id].length} {lessonFileUploads[lesson.id].length === 1 ? 'file' : 'files'}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

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
                              files={lessonFileUploads[currentLessonId] || []}
                              onFilesSelected={(lessonId, files) => {
                                if (handleLessonFileChange) {
                                  const mockEvent = {
                                    target: { files: files }
                                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                                  handleLessonFileChange(lessonId, mockEvent);
                                }
                              }}
                              onFileRemove={removeLessonFile}
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
                              return lesson?.resources ? JSON.parse(lesson.resources) : [];
                            })()}
                            onAddResourceLink={(lessonId, title, url) => {
                              const lesson = lessonPlans.find(l => l.id === lessonId);
                              if (lesson) {
                                const resources = lesson.resources ? JSON.parse(lesson.resources) : [];
                                const newResource = { id: Date.now().toString(), title, url };
                                updateLessonPlan(lessonId, "resources", JSON.stringify([...resources, newResource]));
                              }
                            }}
                            onRemoveResourceLink={(lessonId, linkId) => {
                              const lesson = lessonPlans.find(l => l.id === lessonId);
                              if (lesson) {
                                const resources = lesson.resources ? JSON.parse(lesson.resources) : [];
                                const updatedResources = resources.filter((res: ResourceLink) => res.id !== linkId);
                                updateLessonPlan(lessonId, "resources", JSON.stringify(updatedResources));
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
    </div>
  );
};

export default EnhancedLessonPlanCreator;