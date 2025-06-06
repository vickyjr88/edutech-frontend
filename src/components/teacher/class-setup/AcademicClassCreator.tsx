import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Target, 
  FileText, 
  Send,
  Plus,
  Clock,
  GraduationCap,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MapPin,
  DollarSign,
  Upload,
  Video,
  ExternalLink,
  X,
  Link2,
  Paperclip,
  Play,
  BookmarkCheck,
  AlertCircle,
  Trash2,
  Timer,
  Monitor,
  Zap,
  Star,
  Hash
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { FormFileUpload } from '@/components/ui/form/file-upload';

import { ClassFormValues, CohortData, classSchema } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { LessonForm } from './lesson-plans/LessonForm';

interface AcademicClassCreatorProps {
  onSubmit: (data: ClassFormValues) => void;
  initialValues?: Partial<ClassFormValues>;
  classId?: string;
}

interface StepConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType<any>;
}

// Step Components
const ClassFoundationStep = ({ form, onNext }: any) => {
  const [materials, setMaterials] = useState(form.watch('materials') || []);
  const [resourceLinks, setResourceLinks] = useState(form.watch('resourceLinks') || []);
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
      // For now, we'll just store the file name as a placeholder
      // In a real implementation, you'd upload to your file storage service
      const file = files[0];
      const fileName = file.name;
      form.setValue(fileType, fileName);
      
      // Simulate upload delay
      setTimeout(() => {
        setUploadingFiles(prev => ({ ...prev, [fileType]: false }));
      }, 1000);
    } catch (error) {
      console.error('File upload error:', error);
      setUploadingFiles(prev => ({ ...prev, [fileType]: false }));
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your class about?</h2>
        <p className="text-gray-600">Let's start with the foundation - what will students learn?</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Basic Information Card */}
        <Card className="border-kidato-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-kidato-blue-50 to-kidato-purple-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-kidato-blue" />
              Class Foundation
            </CardTitle>
            <CardDescription>The essential details that define your class</CardDescription>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Subject *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="kiswahili">Kiswahili</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="social-studies">Social Studies</SelectItem>
                        <SelectItem value="religious-education">Religious Education</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Grade Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grade-1">Grade 1</SelectItem>
                        <SelectItem value="grade-2">Grade 2</SelectItem>
                        <SelectItem value="grade-3">Grade 3</SelectItem>
                        <SelectItem value="grade-4">Grade 4</SelectItem>
                        <SelectItem value="grade-5">Grade 5</SelectItem>
                        <SelectItem value="grade-6">Grade 6</SelectItem>
                        <SelectItem value="grade-7">Grade 7</SelectItem>
                        <SelectItem value="grade-8">Grade 8</SelectItem>
                        <SelectItem value="grade-9">Grade 9</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Class Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what students will learn, your teaching approach, and what makes this class special..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Help parents and students understand what to expect from your class
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Learning Objectives */}
            <div>
              <FormLabel className="text-base font-semibold mb-4 block">Learning Objectives *</FormLabel>
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

            {/* YouTube Intro Video URL */}
            <FormField
              control={form.control}
              name="introVideoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Introduction Video (YouTube URL)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add a YouTube video introducing your class to help students understand what to expect
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Course Documents Card */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Course Documents
            </CardTitle>
            <CardDescription>Upload essential documents for your class (Course Outline is required)</CardDescription>
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
                          <p className="text-sm text-green-700">✓ {field.value}</p>
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
                          <p className="text-sm text-green-700">✓ {field.value}</p>
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
                          <p className="text-sm text-green-700">✓ {field.value}</p>
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


        <div className="flex justify-end mt-8">
          <Button
            type="button"
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-kidato-blue to-kidato-purple hover:from-kidato-blue-600 hover:to-kidato-purple-600"
            disabled={!form.watch('title') || !form.watch('subject') || !form.watch('gradeLevel') || objectives.filter(obj => obj.text.trim()).length === 0 || !form.watch('courseOutlineFile')}
          >
            Continue to Lesson Planning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const LessonPlanningStep = ({ form, onNext, onPrev }: any) => {
  const [lessons, setLessons] = useState(() => {
    const currentLessons = form.watch('lessonPlans') || [];
    // Ensure each lesson has the full LessonForm structure
    return currentLessons.map((lesson: any, index: number) => ({
      id: lesson.id || Date.now().toString() + index,
      title: lesson.title || '',
      description: lesson.description || '',
      duration: lesson.duration || '60',
      lessonNumber: lesson.lessonNumber || index + 1,
      durationInMinutes: lesson.durationInMinutes || 60,
      summary: lesson.summary || '',
      objectives: lesson.objectives || [],
      activities: lesson.activities || [],
      prerequisites: lesson.prerequisites || '',
      homework: lesson.homework || '',
      assessmentCriteria: lesson.assessmentCriteria || '',
      tags: lesson.tags || [],
      requirements: lesson.requirements || { videos: [], materials: [] }
    }));
  });

  const addLesson = () => {
    const newLesson = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: '60',
      lessonNumber: lessons.length + 1,
      durationInMinutes: 60,
      summary: '',
      objectives: [],
      activities: [],
      prerequisites: '',
      homework: '',
      assessmentCriteria: '',
      tags: [],
      requirements: { videos: [], materials: [] }
    };
    const updatedLessons = [...lessons, newLesson];
    setLessons(updatedLessons);
    form.setValue('lessonPlans', updatedLessons);
  };

  const removeLesson = (index: number) => {
    const updatedLessons = lessons.filter((_: any, i: number) => i !== index);
    // Re-number the remaining lessons
    const renumberedLessons = updatedLessons.map((lesson: any, i: number) => ({
      ...lesson,
      lessonNumber: i + 1
    }));
    setLessons(renumberedLessons);
    form.setValue('lessonPlans', renumberedLessons);
  };

  const updateLesson = (index: number, field: string, value: any) => {
    const updatedLessons = lessons.map((lesson: any, i: number) => 
      i === index ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
    form.setValue('lessonPlans', updatedLessons);
  };

  const validateLessons = () => {
    return lessons.length > 0 && lessons.every((lesson: any) => 
      lesson.title && 
      lesson.description &&
      lesson.objectives &&
      lesson.objectives.length >= 1 &&
      lesson.objectives.every((obj: any) => obj.objective && obj.objective.trim().length > 0)
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FileText className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan your lessons</h2>
        <p className="text-gray-600">Structure your curriculum into comprehensive, engaging lessons</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-amber-600 mt-1" />
            <div>
              <h4 className="font-semibold text-amber-900">Teaching Tip</h4>
              <p className="text-amber-800 text-sm">
                Create detailed lesson plans with objectives, activities, and assessments. Each lesson should build upon the previous one for optimal learning outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {lessons.map((lesson: any, index: number) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LessonForm
                  lesson={lesson}
                  onUpdate={(field: string, value: any) => updateLesson(index, field, value)}
                  onRemove={() => removeLesson(index)}
                  isRemovable={lessons.length > 1}
                  lessonNumber={index + 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50/30 transition-colors">
            <CardContent className="p-8">
              <Button
                type="button"
                variant="ghost"
                onClick={addLesson}
                className="w-full h-16 text-gray-600 hover:text-green-600 hover:bg-transparent"
              >
                <Plus className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Add Another Lesson</div>
                  <div className="text-sm text-gray-500">Create a comprehensive lesson plan</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Basics
          </Button>
          <Button
            type="button"
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            disabled={!validateLessons()}
          >
            Set Schedule & Pricing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const SchedulePricingStep = ({ form, cohorts, setCohorts, onNext, onPrev }: any) => {
  const addCohort = () => {
    const newCohort: Partial<CohortData> = {
      id: Date.now().toString(),
      name: `Cohort ${cohorts.length + 1}`,
      startDate: null,
      endDate: null,
      startTime: '',
      endTime: '',
      numberOfLessons: form.watch('numberOfLessons') || 8,
      price: '',
      discount: '0',
      isActive: true,
      lessonSchedules: [],
      hasFlexibleSchedule: false,
      repeatSchedule: {
        pattern: 'weekly',
        daysOfWeek: ['monday'],
        repeatEvery: 1
      },
      minStudents: 1,
      maxStudents: 20,
      enrollmentDeadline: null
    };
    setCohorts([...cohorts, newCohort]);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Calendar className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule & Pricing</h2>
        <p className="text-gray-600">When will your class run and how much will it cost?</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Class Schedule
            </CardTitle>
            <CardDescription>Set up when and how your class will run</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {cohorts.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No cohorts yet</h3>
                <p className="text-gray-600 mb-4">Create your first class schedule</p>
                <Button onClick={addCohort} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Schedule
                </Button>
              </div>
            )}

            {cohorts.map((cohort: any, index: number) => (
              <Card key={cohort.id} className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Schedule Name</label>
                      <Input
                        placeholder="e.g., Morning Session"
                        value={cohort.name}
                        onChange={(e) => {
                          const updated = cohorts.map((c: any, i: number) => 
                            i === index ? { ...c, name: e.target.value } : c
                          );
                          setCohorts(updated);
                        }}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Class Size</label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={cohort.minStudents}
                          onChange={(e) => {
                            const updated = cohorts.map((c: any, i: number) => 
                              i === index ? { ...c, minStudents: parseInt(e.target.value) || 1 } : c
                            );
                            setCohorts(updated);
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={cohort.maxStudents}
                          onChange={(e) => {
                            const updated = cohorts.map((c: any, i: number) => 
                              i === index ? { ...c, maxStudents: parseInt(e.target.value) || 20 } : c
                            );
                            setCohorts(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Price (KES)</label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-10"
                          value={cohort.price}
                          onChange={(e) => {
                            const updated = cohorts.map((c: any, i: number) => 
                              i === index ? { ...c, price: e.target.value } : c
                            );
                            setCohorts(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Lessons</label>
                      <Input
                        type="number"
                        value={cohort.numberOfLessons}
                        onChange={(e) => {
                          const updated = cohorts.map((c: any, i: number) => 
                            i === index ? { ...c, numberOfLessons: parseInt(e.target.value) || 1 } : c
                          );
                          setCohorts(updated);
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lessons
          </Button>
          <Button
            type="button"
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={cohorts.length === 0}
          >
            Review & Publish
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReviewPublishStep = ({ form, cohorts, onSubmit, onPrev }: any) => {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    const formData = {
      ...form.getValues(),
      type: 'academic',
      isPublished: true,
      status: 'published'
    };
    
    try {
      await onSubmit(formData);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    const formData = {
      ...form.getValues(),
      type: 'academic',
      isPublished: false,
      status: 'draft'
    };
    
    await onSubmit(formData);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & publish</h2>
        <p className="text-gray-600">Everything looks good? Let's get your class live!</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{form.watch('title')}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge>{form.watch('subject')}</Badge>
                    <Badge variant="outline">{form.watch('gradeLevel')}</Badge>
                  </div>
                </div>
                <p className="text-gray-600">{form.watch('description')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lesson Plans ({form.watch('lessonPlans')?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(form.watch('lessonPlans') || []).map((lesson: any, index: number) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-kidato-blue rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        <p className="text-sm text-gray-600">{lesson.duration} minutes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Ready to Launch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Class Foundation</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Lesson Plans</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Schedule & Pricing</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isPublishing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Publish Class
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="w-full"
                  >
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">What happens next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <p>Your class goes live immediately</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <p>Students can discover and enroll</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <p>You can start inviting students</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

const AcademicClassCreator: React.FC<AcademicClassCreatorProps> = ({
  onSubmit,
  initialValues,
  classId
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      type: 'academic',
      title: '',
      subject: '',
      gradeLevel: '',
      description: '',
      objectives: '',
      numberOfLessons: 8,
      isPublic: true,
      isPublished: false,
      status: 'draft',
      hasCohorts: false,
      hasTeamTeaching: false,
      lessonPlans: [],
      // New media fields
      introVideoUrl: '',
      thumbnailUrl: '',
      // Course documents
      courseOutlineFile: '',
      syllabusFile: '',
      schemeOfWorkFile: '',
      // Materials and resources
      materials: [],
      resourceLinks: [],
      ...initialValues
    }
  });

  const steps: StepConfig[] = [
    {
      id: 'foundation',
      title: 'Class Foundation',
      description: 'Basic information about your class',
      icon: GraduationCap,
      component: ClassFoundationStep
    },
    {
      id: 'lessons',
      title: 'Lesson Planning',
      description: 'Structure your curriculum',
      icon: FileText,
      component: LessonPlanningStep
    },
    {
      id: 'schedule',
      title: 'Schedule & Pricing',
      description: 'Set when and how much',
      icon: Calendar,
      component: SchedulePricingStep
    },
    {
      id: 'review',
      title: 'Review & Publish',
      description: 'Final review and launch',
      icon: CheckCircle,
      component: ReviewPublishStep
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold text-gray-900">Create Academic Class</h1>
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            
            <Progress value={progress} className="h-2 mb-4" />
            
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    index === currentStep 
                      ? 'text-kidato-blue font-medium' 
                      : index < currentStep 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index === currentStep 
                      ? 'bg-kidato-blue text-white' 
                      : index < currentStep 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Form {...form}>
          <CurrentStepComponent
            form={form}
            cohorts={cohorts}
            setCohorts={setCohorts}
            onNext={nextStep}
            onPrev={prevStep}
            onSubmit={onSubmit}
          />
        </Form>
      </div>
    </div>
  );
};

export default AcademicClassCreator;