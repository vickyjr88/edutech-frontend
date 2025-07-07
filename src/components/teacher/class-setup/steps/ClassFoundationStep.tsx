import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Target, 
  FileText, 
  Plus,
  GraduationCap,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Video,
  X,
  Paperclip,
  Play,
  AlertCircle,
  Loader2,
  Eye
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FormFileUpload } from '@/components/ui/form/file-upload';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Curriculum, CurriculumLevel, Subject } from '../types';
import { fileUploadService } from '@/integrations/api/services/file-upload.service';
import { AIDescriptionButton } from '@/components/ui/ai-description-button';
import { DescriptionContext } from '@/services/aiDescriptionService';
import { toast } from 'sonner';

// Step Components
const ClassFoundationStep = ({ form, onNext, isSaving, curricula, loadingCurricula }: any) => {
  const [materials, setMaterials] = useState(form.watch('materials') || []);
  const [resourceLinks, setResourceLinks] = useState(form.watch('resourceLinks') || []);
  
  // Curriculum API state
  const [curriculumLevels, setCurriculumLevels] = useState<CurriculumLevel[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  
  // Floating objectives card state
  const [showObjectivesCard, setShowObjectivesCard] = useState(false);
  
  // Accordion state for subjects
  const [subjectsAccordionOpen, setSubjectsAccordionOpen] = useState<string>('subjects');
  const selectedSubject = form.watch('subject');

  // Curriculum styling with Kidato brand colors using proper Tailwind classes
  const getCurriculumStyling = (curriculumCode: string) => {
    const styles = {
      'british': {
        gradient: 'bg-gradient-to-br from-kidato-indigo to-kidato-spindle',
        hoverGradient: 'hover:from-kidato-indigo-600 hover:to-kidato-spindle-400',
        selectedGradient: 'from-kidato-indigo-600 to-kidato-spindle-400',
        bgLight: 'bg-gradient-to-r from-kidato-indigo/10 to-kidato-spindle/10',
        borderColor: 'border-kidato-indigo/30',
        textColor: 'text-kidato-indigo',
        icon: '🇬🇧',
        accentColor: 'kidato-indigo',
        description: 'International General Certificate'
      },
      'ib': {
        gradient: 'bg-gradient-to-br from-kidato-orange to-kidato-indigo',
        hoverGradient: 'hover:from-kidato-orange-600 hover:to-kidato-indigo-600',
        selectedGradient: 'from-kidato-orange-600 to-kidato-indigo-600',
        bgLight: 'bg-gradient-to-r from-kidato-orange/10 to-kidato-indigo/10',
        borderColor: 'border-kidato-orange/30',
        textColor: 'text-kidato-orange',
        icon: '🌍',
        accentColor: 'kidato-orange',
        description: 'International Baccalaureate'
      },
      'cbc': {
        gradient: 'bg-gradient-to-br from-kidato-spindle to-kidato-orange',
        hoverGradient: 'hover:from-kidato-spindle-400 hover:to-kidato-orange-600',
        selectedGradient: 'from-kidato-spindle-400 to-kidato-orange-600',
        bgLight: 'bg-gradient-to-r from-kidato-spindle/10 to-kidato-orange/10',
        borderColor: 'border-kidato-spindle/30',
        textColor: 'text-kidato-spindle-700',
        icon: '🇰🇪',
        accentColor: 'kidato-spindle',
        description: 'Kenyan National Curriculum'
      },
      'american': {
        gradient: 'bg-gradient-to-br from-kidato-indigo via-kidato-orange to-kidato-spindle',
        hoverGradient: 'hover:from-kidato-indigo-600 hover:via-kidato-orange-600 hover:to-kidato-spindle-400',
        selectedGradient: 'from-kidato-indigo-600 via-kidato-orange-600 to-kidato-spindle-400',
        bgLight: 'bg-gradient-to-r from-kidato-indigo/10 via-kidato-orange/10 to-kidato-spindle/10',
        borderColor: 'border-kidato-indigo/30',
        textColor: 'text-kidato-indigo',
        icon: '🇺🇸',
        accentColor: 'kidato-indigo',
        description: 'American Education System'
      }
    };
    
    return styles[curriculumCode as keyof typeof styles] || {
      gradient: 'bg-gradient-to-br from-kidato-indigo to-kidato-spindle',
      hoverGradient: 'hover:from-kidato-indigo-600 hover:to-kidato-spindle-400',
      selectedGradient: 'from-kidato-indigo-600 to-kidato-spindle-400',
      bgLight: 'bg-gradient-to-r from-kidato-indigo/10 to-kidato-spindle/10',
      borderColor: 'border-kidato-indigo/30',
      textColor: 'text-kidato-indigo',
      icon: '📚',
      accentColor: 'kidato-indigo',
      description: 'Education Curriculum'
    };
  };

  const [objectives, setObjectives] = useState(() => {
    const currentObjectives = form.watch('objectives');
    if (currentObjectives && typeof currentObjectives === 'string') {
      // Convert existing string format to array
      return currentObjectives
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
        .filter(obj => obj.length > 0)
        .map((obj, index) => ({ id: Date.now() + index, text: obj }));
    }
    return [];
  });
  
  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: boolean}>({});
  
  // Handle extracted data from course outline upload
  const handleDataExtracted = (extractedData: any) => {
    // Populate form fields with extracted data
    if (extractedData.title) {
      form.setValue('title', extractedData.title);
    }
    
    if (extractedData.description) {
      form.setValue('description', extractedData.description);
    }
    
    if (extractedData.objectives && extractedData.objectives.length > 0) {
      // Convert objectives to the format expected by the component
      const formattedObjectives = extractedData.objectives.map((obj: any, index: number) => ({
        id: Date.now() + index,
        text: obj.text || obj.objective || obj
      }));
      setObjectives(formattedObjectives);
      updateObjectivesInForm(formattedObjectives);
    }
    
    if (extractedData.materials && extractedData.materials.length > 0) {
      const formattedMaterials = extractedData.materials.map((material: any, index: number) => ({
        id: (Date.now() + index).toString(),
        name: material.name || material,
        description: material.description || '',
        type: 'required' as const,
        link: material.link || '',
        file: '',
        cost: material.cost || ''
      }));
      setMaterials(formattedMaterials);
      form.setValue('materials', formattedMaterials);
    }
    
    if (extractedData.technicalRequirements && extractedData.technicalRequirements.length > 0) {
      const requirementsString = extractedData.technicalRequirements
        .map((req: any) => req.requirement || req)
        .join('\n');
      form.setValue('technicalRequirements', requirementsString);
    }
    
    // Set curriculum if found in curricula data
    if (extractedData.curriculum) {
      const matchingCurriculum = curricula.find(c => 
        c.name.toLowerCase().includes(extractedData.curriculum.toLowerCase()) ||
        c.code.toLowerCase().includes(extractedData.curriculum.toLowerCase())
      );
      if (matchingCurriculum) {
        form.setValue('curriculum', matchingCurriculum._id);
        setSelectedCurriculum(matchingCurriculum);
        setCurriculumLevelsFromData(matchingCurriculum._id);
      }
    }
    
    // Set grade level if found
    if (extractedData.gradeLevel && selectedCurriculum) {
      const matchingLevel = curriculumLevels.find(level => 
        level.name.toLowerCase().includes(extractedData.gradeLevel.toLowerCase()) ||
        level.gradeRange.toLowerCase().includes(extractedData.gradeLevel.toLowerCase())
      );
      if (matchingLevel) {
        form.setValue('curriculumLevel', matchingLevel.code);
        setSubjectsFromData(selectedCurriculum._id, matchingLevel.code);
      }
    }
    
    // Update number of lessons based on extracted lesson plans
    if (extractedData.lessonPlans && extractedData.lessonPlans.length > 0) {
      form.setValue('numberOfLessons', extractedData.lessonPlans.length);
      
      // Also populate lesson plans in the form
      const formattedLessonPlans = extractedData.lessonPlans.map((lesson: any, index: number) => ({
        id: (Date.now() + index).toString(),
        title: lesson.title || `Lesson ${index + 1}`,
        description: lesson.description || lesson.summary || '',
        duration: lesson.duration || 60,
        lessonNumber: lesson.lessonNumber || index + 1,
        durationInMinutes: lesson.duration || 60,
        summary: lesson.summary || lesson.description || '',
        objectives: lesson.objectives || [],
        activities: lesson.activities || [],
        prerequisites: lesson.prerequisites || '',
        homework: lesson.homework || '',
        assessmentCriteria: lesson.assessmentCriteria || '',
        tags: lesson.tags || [],
        requirements: lesson.requirements || { videos: [], materials: [] }
      }));
      form.setValue('lessonPlans', formattedLessonPlans);
    }
    
    toast.success('Course outline data has been extracted and populated in the form!');
  };


  // Set curriculum levels when curriculum changes (no API call needed)
  const setCurriculumLevelsFromData = (curriculumId: string) => {
    if (!curriculumId) {
      setCurriculumLevels([]);
      return;
    }
    
    const curriculum = curricula.find(c => c._id === curriculumId || c.code === curriculumId);
    if (curriculum && curriculum.levels) {
      setCurriculumLevels(curriculum.levels);
    } else {
      setCurriculumLevels([]);
    }
  };

  // Set subjects when curriculum and level change (no API call needed)
  const setSubjectsFromData = (curriculumId: string, levelId: string) => {
    if (!curriculumId || !levelId) {
      setSubjects([]);
      return;
    }
    
    const curriculum = curricula.find(c => c._id === curriculumId || c.code === curriculumId);
    if (!curriculum) {
      setSubjects([]);
      return;
    }
    
    const level = curriculum.levels.find(l => l.code === levelId);
    if (!level || !level.subjects) {
      setSubjects([]);
      return;
    }
    
    // Convert subjects to standardized format
    let subjectsList: Subject[] = [];
    
    if (Array.isArray(level.subjects)) {
      // Simple array of subject names
      subjectsList = level.subjects.map((name, index) => ({
        id: `${curriculumId}_${levelId}_${index}`,
        name,
        curriculumId,
        levelId
      }));
    } else {
      // Object with categories (like IGCSE/A-Levels)
      let index = 0;
      Object.entries(level.subjects).forEach(([category, subjectArray]) => {
        if (Array.isArray(subjectArray)) {
          subjectArray.forEach((name: string) => {
            subjectsList.push({
              id: `${curriculumId}_${levelId}_${category}_${index++}`,
              name,
              category,
              curriculumId,
              levelId
            });
          });
        } else if (typeof subjectArray === 'object') {
          // Handle nested categories (like CBC pathways)
          Object.entries(subjectArray).forEach(([subCategory, subSubjectArray]) => {
            if (Array.isArray(subSubjectArray)) {
              subSubjectArray.forEach((name: string) => {
                subjectsList.push({
                  id: `${curriculumId}_${levelId}_${category}_${subCategory}_${index++}`,
                  name,
                  category: `${category}-${subCategory}`,
                  curriculumId,
                  levelId
                });
              });
            }
          });
        }
      });
    }
    
    setSubjects(subjectsList);
  };
  
  // Learning objectives functions
  const addObjective = () => {
    const newObjective = {
      id: Date.now(),
      text: ''
    };
    const updatedObjectives = [...objectives, newObjective];
    setObjectives(updatedObjectives);
    updateObjectivesInForm(updatedObjectives);
  };

  const updateObjective = (id: number, text: string) => {
    const updatedObjectives = objectives.map(obj => 
      obj.id === id ? { ...obj, text } : obj
    );
    setObjectives(updatedObjectives);
    updateObjectivesInForm(updatedObjectives);
  };

  const removeObjective = (id: number) => {
    const updatedObjectives = objectives.filter(obj => obj.id !== id);
    setObjectives(updatedObjectives);
    updateObjectivesInForm(updatedObjectives);
  };

  const updateObjectivesInForm = (objectivesList: any[]) => {
    const objectivesString = objectivesList
      .filter(obj => obj.text.trim())
      .map(obj => `• ${obj.text.trim()}`)
      .join('\n');
    form.setValue('objectives', objectivesString);
  };
  
  const addMaterial = () => {
    const newMaterial = {
      id: Date.now().toString(),
      name: '',
      description: '',
      type: 'required' as const,
      link: '',
      file: '',
      cost: ''
    };
    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    form.setValue('materials', updatedMaterials);
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    const updatedMaterials = materials.map((material: any, i: number) => 
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
    form.setValue('materials', updatedMaterials);
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = materials.filter((_: any, i: number) => i !== index);
    setMaterials(updatedMaterials);
    form.setValue('materials', updatedMaterials);
  };

  const addResourceLink = () => {
    const newLink = {
      id: Date.now().toString(),
      title: '',
      url: '',
      description: '',
      type: 'website' as const
    };
    const updatedLinks = [...resourceLinks, newLink];
    setResourceLinks(updatedLinks);
    form.setValue('resourceLinks', updatedLinks);
  };

  const updateResourceLink = (index: number, field: string, value: string) => {
    const updatedLinks = resourceLinks.map((link: any, i: number) => 
      i === index ? { ...link, [field]: value } : link
    );
    setResourceLinks(updatedLinks);
    form.setValue('resourceLinks', updatedLinks);
  };

  const removeResourceLink = (index: number) => {
    const updatedLinks = resourceLinks.filter((_: any, i: number) => i !== index);
    setResourceLinks(updatedLinks);
    form.setValue('resourceLinks', updatedLinks);
  };

  const handleFileUpload = async (fileType: string, files: File[]) => {
    if (files.length === 0) return;
    
    setUploadingFiles(prev => ({ ...prev, [fileType]: true }));
    
    try {
      const file = files[0];
      const fileName = file.name;
      form.setValue(fileType, fileName);
      
      // If this is a course outline file, process it for data extraction
      if (fileType === 'courseOutlineFile') {
        const { data, error } = await fileUploadService.uploadAndProcessCourseOutline(file);
        
        if (error) {
          toast.error('Failed to process course outline: ' + error.message);
        } else if (data) {
          // Handle the extracted data
          handleDataExtracted(data);
          toast.success('Course outline processed successfully! Data has been extracted and populated in the form.');
        }
      }
      
      setUploadingFiles(prev => ({ ...prev, [fileType]: false }));
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('File upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setUploadingFiles(prev => ({ ...prev, [fileType]: false }));
    }
  };

  const classTitle = form.watch('title');
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-kidato-blue to-kidato-purple rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <GraduationCap className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={classTitle ? 'class-title' : 'default-title'}
        >
          {classTitle ? classTitle : "What's your class about?"}
        </motion.h2>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={classTitle ? 'class-subtitle' : 'default-subtitle'}
        >
          {classTitle ? "Perfect! Now let's set up the details..." : "Let's start with the foundation - what will students learn?"}
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Course Documents Card - Moved to top for AI generation */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Course Documents
            </CardTitle>
            <CardDescription>Upload your course outline first - we'll use it to help generate your class details (Course Outline is required)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Course Outline */}
              <div className={`${!form.watch('courseOutlineFile') ? 'ring-2 ring-red-200 bg-red-50 p-3 rounded-lg' : ''}`}>
                <FormField
                  control={form.control}
                  name="courseOutlineFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold flex items-center gap-1">
                        Course Outline *
                        {!field.value && <span className="text-red-500 text-xs">(Required)</span>}
                      </FormLabel>
                      <FormFileUpload
                        accept=".pdf,.doc,.docx"
                        acceptedFileTypes=".pdf,.doc,.docx"
                        onFilesSelected={(files) => handleFileUpload('courseOutlineFile', files)}
                        label="Upload Course Outline"
                        description="PDF, DOC, or DOCX files"
                        icon={<Paperclip className="h-8 w-8 text-gray-400" />}
                      />
                      {field.value && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-700">✓ {field.value}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                form.setValue('courseOutlineFile', '');
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {!field.value && (
                        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                          <p className="text-sm text-red-700">⚠ Course outline document is required</p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Syllabus */}
              <div>
                <FormField
                  control={form.control}
                  name="syllabusFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Syllabus</FormLabel>
                      <FormFileUpload
                        accept=".pdf,.doc,.docx"
                        acceptedFileTypes=".pdf,.doc,.docx"
                        onFilesSelected={(files) => handleFileUpload('syllabusFile', files)}
                        label="Upload Syllabus"
                        description="PDF, DOC, or DOCX files"
                        icon={<Paperclip className="h-8 w-8 text-gray-400" />}
                      />
                      {field.value && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-700">✓ {field.value}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                form.setValue('syllabusFile', '');
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Scheme of Work */}
              <div>
                <FormField
                  control={form.control}
                  name="schemeOfWorkFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Scheme of Work</FormLabel>
                      <FormFileUpload
                        accept=".pdf,.doc,.docx"
                        acceptedFileTypes=".pdf,.doc,.docx"
                        onFilesSelected={(files) => handleFileUpload('schemeOfWorkFile', files)}
                        label="Upload Scheme of Work"
                        description="PDF, DOC, or DOCX files"
                        icon={<Paperclip className="h-8 w-8 text-gray-400" />}
                      />
                      {field.value && (
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-green-700">✓ {field.value}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                form.setValue('schemeOfWorkFile', '');
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {!form.watch('courseOutlineFile') && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-red-800 text-sm font-medium">Course Outline is required</p>
                </div>
                <p className="text-red-700 text-xs mt-1">Please upload a course outline document to continue</p>
              </div>
            )}
            
            {/* AI Generation Hint */}
            {form.watch('courseOutlineFile') && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-purple-900 text-sm">Ready for AI Magic!</h4>
                    <p className="text-purple-800 text-xs mt-1">
                      Once you select your curriculum and subject below, we can help generate your class title, description, objectives, and lesson plans based on your uploaded documents.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Basic Information Card */}
            <Card className={`${selectedCurriculum ? `border-${getCurriculumStyling(selectedCurriculum.code).accentColor}-200` : 'border-kidato-blue-200'} shadow-lg`}>
          <CardHeader className={`${selectedCurriculum ? `bg-gradient-to-r from-${getCurriculumStyling(selectedCurriculum.code).accentColor}-50 to-${getCurriculumStyling(selectedCurriculum.code).accentColor}-100` : 'bg-gradient-to-r from-kidato-blue-50 to-kidato-purple-50'} border-b`}>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className={`h-5 w-5 ${selectedCurriculum ? `text-${getCurriculumStyling(selectedCurriculum.code).accentColor}-600` : 'text-kidato-blue'}`} />
              Class Foundation
              {selectedCurriculum && (
                <span className="text-sm bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  {getCurriculumStyling(selectedCurriculum.code).icon}
                  {selectedCurriculum.code}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {selectedCurriculum 
                ? `Create your ${selectedCurriculum.name} class with tailored settings`
                : 'The essential details that define your class'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Class Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Advanced Mathematics for Grade 8"
                      className="text-lg h-12"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a clear, descriptive title that tells students exactly what they'll learn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Curriculum Selection */}
            <FormField
              control={form.control}
              name="curriculum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold mb-4 block">Choose Your Curriculum *</FormLabel>
                  {loadingCurricula ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {curricula.map((curriculum: Curriculum) => {
                        const styling = getCurriculumStyling(curriculum.code);
                        const isSelected = field.value === curriculum._id;
                        
                        return (
                          <motion.div
                            key={curriculum._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`
                              relative p-6 rounded-xl cursor-pointer transition-all duration-300 
                              ${isSelected 
                                ? `bg-gradient-to-br ${styling.selectedGradient} ring-4 ring-white ring-opacity-60 shadow-2xl scale-105` 
                                : `${styling.gradient} ${styling.hoverGradient} hover:scale-105 shadow-lg hover:shadow-xl`
                              }
                              text-white group
                            `}
                            onClick={() => {
                              field.onChange(curriculum._id);
                              setSelectedCurriculum(curriculum);
                              setCurriculumLevelsFromData(curriculum._id);
                              // Reset dependent fields
                              form.setValue('curriculumLevel', '');
                              form.setValue('subject', '');
                              setSubjects([]);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Selection indicator */}
                            {isSelected && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                              >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </motion.div>
                            )}
                            
                            {/* Curriculum icon */}
                            <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                              {styling.icon}
                            </div>
                            
                            {/* Curriculum name */}
                            <h3 className="text-lg font-bold mb-2 group-hover:text-opacity-90">
                              {curriculum.name}
                            </h3>
                            
                            {/* Description */}
                            <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                              {styling.description}
                            </p>
                            
                            {/* Curriculum code badge */}
                            <div className="absolute top-4 right-4 px-2 py-1 bg-white bg-opacity-20 rounded-md text-xs font-medium">
                              {curriculum.code}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Selected curriculum info */}
                  {selectedCurriculum && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCurriculumStyling(selectedCurriculum.code).icon}</div>
                        <div>
                          <h4 className="font-semibold text-blue-900">Selected: {selectedCurriculum.name}</h4>
                          <p className="text-sm text-blue-700">{selectedCurriculum.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* British Curriculum Specific Flow */}
            {selectedCurriculum && (selectedCurriculum.code === 'british' || selectedCurriculum.code === 'BRITISH') ? (
              <div className="space-y-8">
                {/* Key Stage Selection for British Curriculum */}
                <FormField
                  control={form.control}
                  name="curriculumLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold mb-4 block">Choose Key Stage *</FormLabel>
                      <FormDescription className="mb-6">
                        British curriculum is organized by Key Stages. Select the appropriate stage for your class.
                      </FormDescription>
                      
                      {curriculumLevels.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No Key Stages available for this curriculum</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          {curriculumLevels.map((level) => {
                            const isSelected = field.value === level.code;
                            
                            return (
                              <motion.div
                                key={level.code}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`
                                  relative p-5 rounded-lg cursor-pointer transition-all duration-300 border-2
                                  ${isSelected 
                                    ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-indigo-300 shadow-lg scale-105' 
                                    : 'bg-white border-indigo-200 hover:border-indigo-400 hover:shadow-md hover:scale-102'
                                  }
                                `}
                                onClick={() => {
                                  field.onChange(level.code);
                                  setSubjectsFromData(form.watch('curriculum'), level.code);
                                  // Reset subject when level changes
                                  form.setValue('subject', '');
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {/* Selection indicator */}
                                {isSelected && (
                                  <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </motion.div>
                                )}
                                
                                {/* Key Stage info */}
                                <h3 className={`text-base font-bold mb-2 ${isSelected ? 'text-white' : 'text-indigo-900'}`}>
                                  {level.name}
                                </h3>
                                <p className={`text-sm ${isSelected ? 'text-indigo-100' : 'text-indigo-700'}`}>
                                  {level.gradeRange}
                                </p>
                                <p className={`text-xs mt-1 ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                                  Ages {level.ageRange}
                                </p>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject Selection for British Curriculum */}
                {form.watch('curriculumLevel') && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => {
                      const selectedLevel = curriculumLevels.find(l => l.code === form.watch('curriculumLevel'));
                      const isIGCSE = selectedLevel?.code === 'key-stage-4';
                      const isALevels = selectedLevel?.code === 'a-levels';
                      
                      // Get subjects based on level structure
                      const getSubjectsByCategory = () => {
                        if (!selectedLevel || !selectedLevel.subjects) return {};
                        
                        if (Array.isArray(selectedLevel.subjects)) {
                          return { 'All Subjects': selectedLevel.subjects };
                        }
                        
                        return selectedLevel.subjects;
                      };
                      
                      const subjectCategories = getSubjectsByCategory();
                      
                      return (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.4 }}
                        >
                          <FormItem>
                            <Accordion 
                              type="single" 
                              value={subjectsAccordionOpen} 
                              onValueChange={setSubjectsAccordionOpen}
                              className="w-full"
                            >
                              <AccordionItem value="subjects" className="border-none">
                                <AccordionTrigger className="text-base font-semibold mb-2 hover:no-underline">
                                  <div className="flex items-center gap-2">
                                    <span>
                                      Choose Subject *
                                      {isIGCSE && <span className="text-sm font-normal text-indigo-600 ml-2">(IGCSE Level)</span>}
                                      {isALevels && <span className="text-sm font-normal text-indigo-600 ml-2">(A-Level)</span>}
                                    </span>
                                    {selectedSubject && (
                                      <Badge variant="outline" className="bg-kidato-indigo-100 text-kidato-indigo-700 border-kidato-indigo-300">
                                        {selectedSubject}
                                      </Badge>
                                    )}
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2">
                                  <FormDescription className="mb-6">
                                    {isIGCSE && "Select from core, foundation, or elective subjects for IGCSE level."}
                                    {isALevels && "Choose from specialized A-Level subject areas."}
                                    {!isIGCSE && !isALevels && `Select the subject you'll be teaching in ${selectedLevel?.name}.`}
                                  </FormDescription>
                                  
                                  <div className="space-y-6">
                              {Object.entries(subjectCategories).map(([category, subjectList]) => (
                                <div key={category}>
                                  {Object.keys(subjectCategories).length > 1 && (
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                                      {category === 'core' && '🔵 Core Subjects'}
                                      {category === 'foundation' && '🟡 Foundation Subjects'}
                                      {category === 'electives' && '🟢 Elective Subjects'}
                                      {category === 'non-exam' && '⚪ Non-Exam Subjects'}
                                      {category === 'stem' && '🔬 STEM Subjects'}
                                      {category === 'humanities' && '📚 Humanities'}
                                      {category === 'languages' && '🗣️ Languages'}
                                      {category === 'arts' && '🎨 Arts'}
                                      {category === 'business' && '💼 Business'}
                                      {!['core', 'foundation', 'electives', 'non-exam', 'stem', 'humanities', 'languages', 'arts', 'business'].includes(category) && category}
                                    </h4>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-3">
                                    {(Array.isArray(subjectList) ? subjectList : []).map((subject, index) => {
                                      const subjectId = `${category}-${index}`;
                                      const isSelected = field.value === subject;
                                      
                                      // Category-specific styling
                                      const getCategoryStyle = () => {
                                        switch (category) {
                                          case 'core':
                                            return isSelected 
                                              ? 'bg-blue-600 text-white border-blue-600' 
                                              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300';
                                          case 'foundation':
                                            return isSelected 
                                              ? 'bg-amber-600 text-white border-amber-600' 
                                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300';
                                          case 'electives':
                                            return isSelected 
                                              ? 'bg-green-600 text-white border-green-600' 
                                              : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300';
                                          case 'non-exam':
                                            return isSelected 
                                              ? 'bg-gray-600 text-white border-gray-600' 
                                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300';
                                          case 'stem':
                                            return isSelected 
                                              ? 'bg-purple-600 text-white border-purple-600' 
                                              : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300';
                                          case 'humanities':
                                            return isSelected 
                                              ? 'bg-rose-600 text-white border-rose-600' 
                                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300';
                                          case 'languages':
                                            return isSelected 
                                              ? 'bg-cyan-600 text-white border-cyan-600' 
                                              : 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300';
                                          case 'arts':
                                            return isSelected 
                                              ? 'bg-pink-600 text-white border-pink-600' 
                                              : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:border-pink-300';
                                          case 'business':
                                            return isSelected 
                                              ? 'bg-emerald-600 text-white border-emerald-600' 
                                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300';
                                          default:
                                            return isSelected 
                                              ? 'bg-indigo-600 text-white border-indigo-600' 
                                              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300';
                                        }
                                      };
                                      
                                      return (
                                        <motion.button
                                          key={subjectId}
                                          type="button"
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.2, delay: index * 0.05 }}
                                          onClick={() => {
                                            field.onChange(subject);
                                            // Collapse accordion after selection
                                            setTimeout(() => setSubjectsAccordionOpen(''), 300);
                                          }}
                                          className={`
                                            px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200
                                            ${getCategoryStyle()}
                                            ${isSelected ? 'shadow-lg scale-105' : 'hover:scale-105 hover:shadow-md'}
                                          `}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          {subject}
                                          {isSelected && (
                                            <motion.span
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="ml-2"
                                            >
                                              ✓
                                            </motion.span>
                                          )}
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                </div>
                                      ))}
                                    </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                            
                            {field.value && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-kidato-indigo-50 border border-kidato-indigo-200 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="h-5 w-5 text-kidato-indigo-600" />
                                  <div>
                                    <h4 className="font-semibold text-kidato-indigo-900">Selected: {field.value}</h4>
                                    <p className="text-sm text-kidato-indigo-700">
                                      {isIGCSE && "This IGCSE subject will prepare students for international examinations."}
                                      {isALevels && "This A-Level subject offers advanced study for university preparation."}
                                      {!isIGCSE && !isALevels && `Subject for ${selectedLevel?.name} curriculum.`}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                            
                            <FormMessage />
                          </FormItem>
                        </motion.div>
                      );
                    }}
                  />
                )}
              </div>
            ) : (
              /* Standard curriculum flow for non-British curricula */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="curriculumLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Grade Level *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const curriculumId = form.watch('curriculum');
                          if (curriculumId && value) {
                            setSubjectsFromData(curriculumId, value);
                          }
                          // Reset subject when level changes
                          form.setValue('subject', '');
                        }} 
                        defaultValue={field.value}
                        disabled={false}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder={
                              !form.watch('curriculum') 
                                ? "Select curriculum first" 
                                : "Select grade level"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {curriculumLevels.map((level) => (
                            <SelectItem key={level.code} value={level.code}>
                              {level.name} ({level.gradeRange})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Subject *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!form.watch('curriculum') || !form.watch('curriculumLevel')}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder={
                              !form.watch('curriculum') || !form.watch('curriculumLevel')
                                ? "Select curriculum and level first" 
                                : "Select subject"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.name}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                // Build context for AI description generation
                const aiContext: DescriptionContext = {
                  title: form.watch("title"),
                  curriculum: selectedCurriculum?.name || selectedCurriculum?.code,
                  curriculumLevel: curriculumLevels.find(l => 
                    l.code === form.watch("curriculumLevel")
                  )?.name,
                  subject: form.watch("subject"),
                  classType: 'academic'
                };

                // Check if we have enough context for AI generation
                const hasEnoughContext = aiContext.title || aiContext.subject;

                return (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Class Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what students will learn, your teaching approach, and what makes this class special..."
                        className="min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    {hasEnoughContext && (
                      <div className="mt-3">
                        <AIDescriptionButton
                          context={aiContext}
                          onApplyDescription={(description) => {
                            console.log('Setting description in form (inline):', description);
                            field.onChange(description);
                            form.setValue('description', description);
                          }}
                          variant="inline"
                        />
                      </div>
                    )}
                    <FormDescription>
                      {selectedCurriculum 
                        ? `Describe your ${selectedCurriculum.name} class to help parents and students understand the curriculum approach and what to expect`
                        : 'Help parents and students understand what to expect from your class'
                      }
                      {!hasEnoughContext && (
                        <span className="block mt-2 text-amber-600 text-sm font-medium">
                          ✨ Add a class title above to enable AI-powered description generation
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Learning Objectives */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <FormLabel className="text-base font-semibold">Learning Objectives *</FormLabel>
                
                {/* Class Objectives Preview Button with Floating Card */}
                {objectives.length > 0 && (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                      onMouseEnter={() => setShowObjectivesCard(true)}
                      onMouseLeave={() => setShowObjectivesCard(false)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Preview Objectives
                      <Eye className="h-3 w-3 ml-1 opacity-60" />
                    </Button>

                    {/* Floating Objectives Card */}
                    {showObjectivesCard && (
                      <Card 
                        className="absolute top-full right-0 mt-2 w-96 z-50 shadow-xl border-2 border-purple-200 bg-white"
                        onMouseEnter={() => setShowObjectivesCard(true)}
                        onMouseLeave={() => setShowObjectivesCard(false)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                            <Target className="h-5 w-5" />
                            Learning Objectives Preview
                            <Badge variant="secondary" className="ml-auto">
                              {objectives.filter(obj => obj.text.trim()).length} objectives
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                          <p className="text-sm text-purple-700 font-medium">By the end of this class, students will be able to:</p>
                          
                          {objectives.filter(obj => obj.text.trim()).map((objective, index) => (
                            <div
                              key={objective.id}
                              className="p-3 rounded-lg border-l-4 border-l-purple-500 bg-purple-50 transition-all duration-200"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-purple-900">
                                    {objective.text}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs bg-purple-100 text-purple-700 border-purple-300"
                                    >
                                      Academic Goal
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Summary */}
                          <div className="mt-4 pt-3 border-t border-purple-200">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="text-center">
                                <p className="text-purple-500">Total Objectives</p>
                                <p className="font-bold text-purple-700">
                                  {objectives.filter(obj => obj.text.trim()).length}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-purple-500">Status</p>
                                <p className="font-bold text-green-600">
                                  Ready
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
              
              <FormDescription className="mb-4">
                What specific skills or knowledge will students gain? Add one objective at a time.
              </FormDescription>
              
              <div className="space-y-4">
                {objectives.map((objective, index) => (
                  <div key={objective.id} className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-200 text-purple-800 text-sm font-bold rounded-full flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <FormLabel className="text-sm font-medium text-purple-800 mb-2 block">
                          Learning Objective {index + 1}
                        </FormLabel>
                        <Textarea
                          placeholder="Describe what students will be able to do after this lesson (e.g., 'Students will be able to solve complex algebraic equations and apply them to real-world problems')"
                          value={objective.text}
                          onChange={(e) => updateObjective(objective.id, e.target.value)}
                          rows={3}
                          className="border-purple-300 focus:border-purple-500 focus:ring-purple-500 bg-white resize-none text-base"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(objective.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0 mt-1"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-dashed border-purple-300 hover:border-purple-400 transition-colors">
                  <div className="space-y-3">
                    <FormLabel className="text-sm font-medium text-purple-800 block">
                      Add New Learning Objective
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addObjective}
                      size="lg"
                      className="w-full bg-purple-600 text-white hover:bg-purple-700 border-purple-600 px-6"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Learning Objective
                    </Button>
                    <p className="text-xs text-purple-600 italic text-center">
                      Create detailed objectives that describe what students will achieve
                    </p>
                  </div>
                </div>
                
                {objectives.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
                    <Target className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-600 text-sm font-medium">Learning objectives are required</p>
                    <p className="text-red-500 text-xs mt-1">Add at least one learning objective to continue</p>
                  </div>
                )}
                
                {objectives.filter(obj => obj.text.trim()).length === 0 && objectives.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm font-medium">Please fill in all learning objectives</p>
                    <p className="text-amber-700 text-xs mt-1">Empty objectives will not be saved</p>
                  </div>
                )}
              </div>
              
              {objectives.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Preview: Learning Outcomes
                  </h4>
                  <p className="text-sm text-blue-700 mb-3 font-medium">By the end of this class, students will be able to:</p>
                  <ul className="text-sm text-blue-600 space-y-2">
                    {objectives.filter(obj => obj.text.trim()).map((objective, index) => (
                      <li key={objective.id} className="flex items-start gap-3 p-2 bg-blue-100 rounded">
                        <span className="flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="flex-1">{objective.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </CardContent>
        </Card>

        {/* Materials and Resources Card */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Materials & Resources
            </CardTitle>
            <CardDescription>What will students need for this class?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Required Materials */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Required Materials</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMaterial}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Material
                </Button>
              </div>

              <div className="space-y-4">
                {materials.map((material: any, index: number) => (
                  <Card key={material.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Material {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Material Name *</label>
                          <Input
                            placeholder="e.g., Textbook, Calculator, Notebook"
                            value={material.name}
                            onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Type</label>
                          <Select
                            value={material.type}
                            onValueChange={(value) => updateMaterial(index, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="required">Required</SelectItem>
                              <SelectItem value="recommended">Recommended</SelectItem>
                              <SelectItem value="optional">Optional</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                          placeholder="Describe the material and how it will be used..."
                          value={material.description}
                          onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                          className="mt-1 min-h-20"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Purchase Link (Optional)</label>
                          <Input
                            placeholder="https://..."
                            value={material.link}
                            onChange={(e) => updateMaterial(index, 'link', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Estimated Cost (Optional)</label>
                          <Input
                            placeholder="e.g., KES 500"
                            value={material.cost}
                            onChange={(e) => updateMaterial(index, 'cost', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Additional Resource Links */}
            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Additional Resources</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addResourceLink}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Resource Link
                </Button>
              </div>

              <div className="space-y-4">
                {resourceLinks.map((link: any, index: number) => (
                  <Card key={link.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Resource {index + 1}</h5>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResourceLink(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Resource Title *</label>
                          <Input
                            placeholder="e.g., Khan Academy Math Videos"
                            value={link.title}
                            onChange={(e) => updateResourceLink(index, 'title', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Type</label>
                          <Select
                            value={link.type}
                            onValueChange={(value) => updateResourceLink(index, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="article">Article</SelectItem>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="tool">Tool</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">URL *</label>
                        <Input
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => updateResourceLink(index, 'url', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                          placeholder="What can students learn from this resource?"
                          value={link.description}
                          onChange={(e) => updateResourceLink(index, 'description', e.target.value)}
                          className="mt-1 min-h-20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction Video Card */}
        <Card className="border-kidato-indigo-200 shadow-xl bg-gradient-to-br from-kidato-indigo-50 via-white to-kidato-spindle-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kidato-indigo-500 via-kidato-indigo-600 to-kidato-spindle-500"></div>
          <CardHeader className="pb-4 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-kidato-indigo-600 to-kidato-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="h-6 w-6 text-white" 
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a2.99 2.99 0 0 0-2.123-2.123C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.375.563A2.99 2.99 0 0 0 .502 6.186C-.001 8.056-.001 12-.001 12s0 3.944.503 5.814a2.99 2.99 0 0 0 2.123 2.123C4.495 20.5 12 20.5 12 20.5s7.505 0 9.375-.563a2.99 2.99 0 0 0 2.123-2.123C23.999 15.944 23.999 12 23.999 12s0-3.944-.501-5.814zM9.75 15.568V8.432L15.5 12l-5.75 3.568z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <Video className="h-2.5 w-2.5 text-kidato-indigo-600" />
                </div>
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-kidato-indigo-800 flex items-center gap-2">
                  Class Introduction Video
                  <Badge variant="secondary" className="text-xs bg-kidato-indigo-100 text-kidato-indigo-700 border-kidato-indigo-200">
                    YouTube
                  </Badge>
                </CardTitle>
                <p className="text-sm text-kidato-indigo-600 font-medium">Hook your audience with video</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="introVideoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-kidato-indigo-800 mb-3 block">
                    YouTube Video URL
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg 
                          viewBox="0 0 24 24" 
                          className="h-5 w-5 text-kidato-indigo-500" 
                          fill="currentColor"
                        >
                          <path d="M23.498 6.186a2.99 2.99 0 0 0-2.123-2.123C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.375.563A2.99 2.99 0 0 0 .502 6.186C-.001 8.056-.001 12-.001 12s0 3.944.503 5.814a2.99 2.99 0 0 0 2.123 2.123C4.495 20.5 12 20.5 12 20.5s7.505 0 9.375-.563a2.99 2.99 0 0 0 2.123-2.123C23.999 15.944 23.999 12 23.999 12s0-3.944-.501-5.814zM9.75 15.568V8.432L15.5 12l-5.75 3.568z"/>
                        </svg>
                      </div>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        className="pl-14 pr-12 h-12 border-kidato-indigo-200 focus:border-kidato-indigo-400 focus:ring-kidato-indigo-400 bg-white text-base font-medium"
                        {...field}
                      />
                      {field.value && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Valid</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <div className="mt-4 p-4 bg-gradient-to-r from-kidato-indigo-50 to-kidato-spindle-50 border border-kidato-indigo-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Play className="h-5 w-5 text-kidato-indigo-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-kidato-indigo-900 text-sm">Why add an intro video?</h4>
                        <ul className="text-xs text-kidato-indigo-700 space-y-1">
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-kidato-indigo-500 rounded-full"></div>
                            Build trust with parents & students
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-kidato-indigo-500 rounded-full"></div>
                            Showcase your teaching personality
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-kidato-indigo-500 rounded-full"></div>
                            Increase enrollment rates by 65%
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-kidato-indigo-500 rounded-full"></div>
                            Explain what makes your class unique
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {!field.value && (
                    <div className="mt-3 p-3 bg-kidato-orange-50 border border-kidato-orange-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-kidato-orange-600" />
                        <p className="text-kidato-orange-800 text-sm font-medium">Optional but highly recommended</p>
                      </div>
                      <p className="text-kidato-orange-700 text-xs mt-1">
                        Classes with introduction videos get 3x more enrollments
                      </p>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end mt-8">
          <Button
            type="button"
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-kidato-indigo-500 to-kidato-orange-500 hover:from-kidato-indigo-600 hover:to-kidato-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            disabled={isSaving || !form.watch('title') || !form.watch('curriculum') || !form.watch('curriculumLevel') || !form.watch('subject') || objectives.filter(obj => obj.text.trim()).length === 0 || !form.watch('courseOutlineFile')}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Class...
              </>
            ) : (
              <>
                Continue to Lesson Planning
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClassFoundationStep;