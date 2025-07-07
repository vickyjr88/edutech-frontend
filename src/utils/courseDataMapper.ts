import { ExtractedCourseData, ExtractedLessonPlan, ExtractedObjective } from '@/types/course-data';
import { ClassFormValues } from '@/components/teacher/class-setup/types';

/**
 * Maps extracted course data to ClassFormValues format
 */
export const mapCourseDataToFormValues = (extractedData: ExtractedCourseData): Partial<ClassFormValues> => {
  const formValues: Partial<ClassFormValues> = {
    // Basic Information
    type: "academic",
    title: extractedData.title,
    curriculum: extractedData.curriculum,
    gradeLevel: extractedData.gradeLevel,
    description: extractedData.description,
    
    // Convert objectives array to string format
    objectives: mapObjectivesToString(extractedData.objectives),
    
    // Duration mapping - convert "8 weeks" to number of lessons
    numberOfLessons: extractLessonCount(extractedData.duration, extractedData.lessonPlans.length),
    
    // Materials and requirements
    materialsRequired: extractMaterialsString(extractedData.materials, extractedData.requirements),
    technicalRequirements: extractTechnicalRequirements(extractedData.technicalRequirements),
    
    // Assessment methods from lesson plans
    assessmentMethods: extractAssessmentMethods(extractedData.lessonPlans),
    
    // Teaching methodology from lesson plans
    methodology: extractTeachingMethodology(extractedData.lessonPlans),
    
    // Materials array for the form
    materials: mapMaterials(extractedData.materials, extractedData.requirements),
    
    // Resource links (if any are found in the data)
    resourceLinks: extractResourceLinks(extractedData.lessonPlans),
    
    // Lesson plans mapping
    lessonPlans: mapLessonPlans(extractedData.lessonPlans),
    
    // Publication settings
    isPublic: true,
    isPublished: false,
    status: "draft",
    
    // Additional fields
    tags: extractedData.tags || [],
    summary: extractedData.summary,
    teacherNotes: extractedData.teacherNotes,
    confidence: extractedData.confidence
  };

  return formValues;
};

/**
 * Converts objectives array to a formatted string
 */
export const mapObjectivesToString = (objectives: ExtractedObjective[]): string => {
  if (!objectives || objectives.length === 0) return '';
  
  return objectives.map((obj, index) => {
    const priority = obj.priority === 'high' ? '🔴' : obj.priority === 'medium' ? '🟡' : '🟢';
    const category = obj.category === 'skills' ? '🎯' : obj.category === 'knowledge' ? '📚' : '🔬';
    return `${index + 1}. ${priority} ${category} ${obj.text}`;
  }).join('\n');
};

/**
 * Extracts lesson count from duration string and lesson plans
 */
export const extractLessonCount = (duration: string, lessonPlansCount: number): number => {
  if (lessonPlansCount > 0) return lessonPlansCount;
  
  // Try to extract from duration string
  const weekMatch = duration.match(/(\d+)\s*week/i);
  if (weekMatch) {
    return parseInt(weekMatch[1]) * 2; // Assume 2 lessons per week
  }
  
  const lessonMatch = duration.match(/(\d+)\s*lesson/i);
  if (lessonMatch) {
    return parseInt(lessonMatch[1]);
  }
  
  return 10; // Default fallback
};

/**
 * Maps materials and requirements to materials string
 */
export const extractMaterialsString = (materials: Array<{ name: string }>, requirements: any[]): string => {
  const materialsList = materials?.map(m => m.name) || [];
  const requirementsList = requirements?.filter(r => r.type === 'materials')
    .flatMap(r => r.materialsList || [r.title]) || [];
  
  const allMaterials = [...materialsList, ...requirementsList];
  
  return allMaterials.length > 0 ? allMaterials.join(', ') : '';
};

/**
 * Extracts technical requirements
 */
export const extractTechnicalRequirements = (techReqs: Array<{ requirement: string }>): string => {
  if (!techReqs || techReqs.length === 0) return '';
  
  return techReqs.map(req => req.requirement).join(', ');
};

/**
 * Extracts assessment methods from lesson plans
 */
export const extractAssessmentMethods = (lessonPlans: ExtractedLessonPlan[]): string => {
  const assessmentMethods = new Set<string>();
  
  lessonPlans.forEach(lesson => {
    lesson.assessmentMethods?.forEach(method => {
      assessmentMethods.add(method.method);
    });
    
    lesson.plenary?.assessmentMethods?.forEach(method => {
      assessmentMethods.add(method.method);
    });
  });
  
  return Array.from(assessmentMethods).join(', ');
};

/**
 * Extracts teaching methodology from lesson plans
 */
export const extractTeachingMethodology = (lessonPlans: ExtractedLessonPlan[]): string => {
  const methodologies = new Set<string>();
  
  lessonPlans.forEach(lesson => {
    lesson.lessonFlow?.forEach(flow => {
      if (flow.teachingMethod) {
        methodologies.add(flow.teachingMethod);
      }
    });
    
    lesson.activities?.forEach(activity => {
      if (activity.activityType) {
        methodologies.add(activity.activityType);
      }
    });
  });
  
  return Array.from(methodologies).join(', ');
};

/**
 * Maps materials to form materials array
 */
export const mapMaterials = (materials: Array<{ name: string }>, requirements: any[]): ClassFormValues['materials'] => {
  const formMaterials: ClassFormValues['materials'] = [];
  
  // Add materials from materials array
  materials?.forEach((material, index) => {
    formMaterials.push({
      id: `material_${index}`,
      name: material.name,
      description: '',
      type: 'required' as const,
      link: '',
      file: '',
      cost: ''
    });
  });
  
  // Add materials from requirements
  requirements?.filter(req => req.type === 'materials').forEach((req, index) => {
    req.materialsList?.forEach((item: string, itemIndex: number) => {
      formMaterials.push({
        id: `req_material_${index}_${itemIndex}`,
        name: item,
        description: req.description || '',
        type: req.isRequired ? 'required' as const : 'optional' as const,
        link: req.whereToGet || '',
        file: '',
        cost: req.estimatedCost || ''
      });
    });
  });
  
  return formMaterials;
};

/**
 * Extracts resource links from lesson plans
 */
export const extractResourceLinks = (lessonPlans: ExtractedLessonPlan[]): ClassFormValues['resourceLinks'] => {
  const resourceLinks: ClassFormValues['resourceLinks'] = [];
  
  lessonPlans.forEach((lesson, lessonIndex) => {
    lesson.resourceLinks?.forEach((link, linkIndex) => {
      resourceLinks.push({
        id: `lesson_${lessonIndex}_link_${linkIndex}`,
        title: link.title,
        url: link.url,
        description: link.description || '',
        type: 'website' as const
      });
    });
  });
  
  return resourceLinks;
};

/**
 * Maps lesson plans to form lesson plans array
 */
export const mapLessonPlans = (lessonPlans: ExtractedLessonPlan[]): ClassFormValues['lessonPlans'] => {
  return lessonPlans.map((lesson, index) => ({
    id: `lesson_${index}`,
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration.toString(),
    resources: JSON.stringify({
      objectives: lesson.objectives,
      activities: lesson.activities,
      requirements: lesson.requirements,
      assessment: lesson.assessmentMethods,
      materials: lesson.lessonFlow?.flatMap(flow => flow.materialsNeeded) || [],
      homework: lesson.homework,
      teacherNotes: lesson.teacherNotes,
      tags: lesson.tags,
      type: lesson.type,
      lessonNumber: lesson.lessonNumber,
      prerequisites: lesson.prerequisites,
      successCriteria: lesson.successCriteria,
      starter: lesson.starter,
      lessonFlow: lesson.lessonFlow,
      teachingTips: lesson.teachingTips,
      differentiation: lesson.differentiation,
      vocabularyFocus: lesson.vocabularyFocus,
      plenary: lesson.plenary,
      nextStepsForStudents: lesson.nextStepsForStudents,
      reflectionPrompts: lesson.reflectionPrompts,
      roomSetup: lesson.roomSetup,
      safetyConsiderations: lesson.safetyConsiderations,
      assessmentCriteria: lesson.assessmentCriteria,
      estimatedPreparationTime: lesson.estimatedPreparationTime,
      backupActivities: lesson.backupActivities,
      challengesAnticipated: lesson.challengesAnticipated,
      summary: lesson.summary
    })
  }));
};

/**
 * Utility function to generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};