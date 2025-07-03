import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  FileText, 
  Plus,
  CheckCircle,
  ArrowRight,
  ArrowLeft} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { LessonFormRedesigned } from '../lesson-plans/LessonFormRedesigned';

const LessonPlanningStep = ({ form, onNext, onPrev, createdClassId }: any) => {
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

  const classTitle = form.watch('title');
  const selectedSubject = form.watch('subject');
  const selectedCurriculum = form.watch('curriculum');

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-kidato-orange to-kidato-indigo rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FileText className="h-8 w-8 text-white" />
        </motion.div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            Plan your lessons
            {classTitle && (
              <span className="block text-lg font-medium text-kidato-indigo-700 mt-1">
                for {classTitle}
              </span>
            )}
          </h2>
          
          <div className="space-y-2">
            <p className="text-gray-600">Structure your curriculum into comprehensive, engaging lessons</p>
            
            {/* Context badges */}
            {(selectedSubject || selectedCurriculum) && (
              <div className="flex items-center justify-center gap-2">
                {selectedSubject && (
                  <Badge variant="outline" className="bg-kidato-indigo-50 text-kidato-indigo-700 border-kidato-indigo-200 text-xs">
                    📚 {selectedSubject}
                  </Badge>
                )}
                {selectedCurriculum && (
                  <Badge variant="outline" className="bg-kidato-orange-50 text-kidato-orange-700 border-kidato-orange-200 text-xs">
                    🎓 {selectedCurriculum}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Class Created Notice */}
        {createdClassId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900">Class Created Successfully!</h4>
                <p className="text-green-800 text-sm">
                  Your class foundation has been saved. Class ID: <code className="bg-green-100 px-1 rounded text-xs">{createdClassId}</code>
                </p>
              </div>
            </div>
          </div>
        )}

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
                <LessonFormRedesigned
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
            className="bg-gradient-to-r from-kidato-indigo-500 to-kidato-orange-500 hover:from-kidato-indigo-600 hover:to-kidato-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
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

export default LessonPlanningStep;
