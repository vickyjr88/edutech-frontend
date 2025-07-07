import { ExtractedLessonPlan, ExtractedLessonRequirement, ExtractedAssessmentMethod, ExtractedLessonActivity } from '@/types/course-data';

// Enums that match the lesson form DTOs
export enum RequirementType {
  VIDEO = 'video',
  ARTICLE = 'article',
  WORKSHEET = 'worksheet',
  SURVEY = 'survey',
  MATERIALS = 'materials',
  DOCUMENT_UPLOAD = 'document_upload'
}

export enum RequirementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum LessonType {
  LECTURE = 'lecture',
  PRACTICAL = 'practical',
  WORKSHOP = 'workshop',
  ASSESSMENT = 'assessment',
  DISCUSSION = 'discussion',
  FIELD_TRIP = 'field_trip',
  PRESENTATION = 'presentation',
  REVIEW = 'review'
}

export enum LessonStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// DTO interfaces that match the lesson form expected structure
export interface CreateLessonObjectiveDto {
  objective: string;
  isCompleted?: boolean;
}

export interface CreateLessonActivityDto {
  title: string;
  description?: string;
  duration: number; // in minutes
  instructions?: string;
  resourceFiles?: CreateResourceFileDto[];
  resourceLinks?: CreateResourceLinkDto[];
  activityType?: string;
  learningOutcome?: string;
  successCriteria?: string[];
  differentiation?: string;
}

export interface CreateResourceLinkDto {
  title: string;
  url: string;
  description?: string;
}

export interface CreateResourceFileDto {
  filename: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
}

export interface CreateLessonRequirementDto {
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

export interface CreateLessonPlanDto {
  title: string;
  description?: string;
  type: LessonType;
  lessonNumber: number;
  duration: number; // in minutes
  objectives?: CreateLessonObjectiveDto[];
  activities?: CreateLessonActivityDto[];
  requirements?: CreateLessonRequirementDto[];
  status?: LessonStatus;
  tags?: string[];
  teacherNotes?: string;
  homework?: string;
  assessmentMethods?: string[];
  successCriteria?: string[];
  prerequisites?: string;
  estimatedPreparationTime?: number;
  resourceLinks?: CreateResourceLinkDto[];
  
  // Additional fields for comprehensive lesson planning
  starter?: {
    title: string;
    description: string;
    duration: number;
    instructions: string;
    materialsNeeded: string[];
  };
  
  lessonFlow?: Array<{
    title: string;
    description: string;
    duration: number;
    order: number;
    teachingMethod: string;
    studentActivity: string;
    teacherInstructions: string;
    materialsNeeded: string[];
  }>;
  
  plenary?: {
    summaryActivity: string;
    duration: number;
    keyTakeaways: string;
    closingInstructions: string;
    reflectionPrompts: string;
    assessmentMethods: ExtractedAssessmentMethod[];
  };
  
  differentiation?: string;
  vocabularyFocus?: string;
  teachingTips?: string;
  nextStepsForStudents?: string;
  reflectionPrompts?: string;
  roomSetup?: string;
  safetyConsiderations?: string;
  assessmentCriteria?: string;
  backupActivities?: string;
  challengesAnticipated?: string;
  summary?: string;
}

/**
 * Transforms extracted lesson plan data to CreateLessonPlanDto format
 */
export const transformLessonPlan = (extractedLesson: ExtractedLessonPlan): CreateLessonPlanDto => {
  return {
    title: extractedLesson.title,
    description: extractedLesson.description,
    type: mapLessonType(extractedLesson.type),
    lessonNumber: extractedLesson.lessonNumber,
    duration: extractedLesson.duration,
    
    // Transform objectives
    objectives: extractedLesson.objectives?.map(obj => ({
      objective: obj.objective,
      isCompleted: obj.isCompleted
    })),
    
    // Transform activities
    activities: extractedLesson.activities?.map(activity => transformActivity(activity)),
    
    // Transform requirements
    requirements: extractedLesson.requirements?.map(req => transformRequirement(req)),
    
    // Basic fields
    status: LessonStatus.DRAFT,
    tags: extractedLesson.tags || [],
    teacherNotes: extractedLesson.teacherNotes,
    homework: extractedLesson.homework,
    
    // Assessment methods
    assessmentMethods: extractedLesson.assessmentMethods?.map(method => method.method) || [],
    successCriteria: extractedLesson.successCriteria || [],
    prerequisites: extractedLesson.prerequisites,
    estimatedPreparationTime: extractedLesson.estimatedPreparationTime,
    
    // Resource links
    resourceLinks: extractedLesson.resourceLinks?.map(link => ({
      title: link.title,
      url: link.url,
      description: link.description
    })),
    
    // Additional comprehensive fields
    starter: extractedLesson.starter ? {
      title: extractedLesson.starter.title,
      description: extractedLesson.starter.description,
      duration: extractedLesson.starter.duration,
      instructions: extractedLesson.starter.instructions,
      materialsNeeded: extractedLesson.starter.materialsNeeded || []
    } : undefined,
    
    lessonFlow: extractedLesson.lessonFlow?.map(flow => ({
      title: flow.title,
      description: flow.description,
      duration: flow.duration,
      order: flow.order,
      teachingMethod: flow.teachingMethod,
      studentActivity: flow.studentActivity,
      teacherInstructions: flow.teacherInstructions,
      materialsNeeded: flow.materialsNeeded || []
    })),
    
    plenary: extractedLesson.plenary ? {
      summaryActivity: extractedLesson.plenary.summaryActivity,
      duration: extractedLesson.plenary.duration,
      keyTakeaways: extractedLesson.plenary.keyTakeaways,
      closingInstructions: extractedLesson.plenary.closingInstructions,
      reflectionPrompts: extractedLesson.plenary.reflectionPrompts,
      assessmentMethods: extractedLesson.plenary.assessmentMethods || []
    } : undefined,
    
    differentiation: extractedLesson.differentiation,
    vocabularyFocus: extractedLesson.vocabularyFocus,
    teachingTips: extractedLesson.teachingTips,
    nextStepsForStudents: extractedLesson.nextStepsForStudents,
    reflectionPrompts: extractedLesson.reflectionPrompts,
    roomSetup: extractedLesson.roomSetup,
    safetyConsiderations: extractedLesson.safetyConsiderations,
    assessmentCriteria: extractedLesson.assessmentCriteria,
    backupActivities: extractedLesson.backupActivities,
    challengesAnticipated: extractedLesson.challengesAnticipated,
    summary: extractedLesson.summary
  };
};

/**
 * Maps extracted lesson type to LessonType enum
 */
export const mapLessonType = (type: string): LessonType => {
  const typeMap: { [key: string]: LessonType } = {
    'lecture': LessonType.LECTURE,
    'practical': LessonType.PRACTICAL,
    'workshop': LessonType.WORKSHOP,
    'assessment': LessonType.ASSESSMENT,
    'discussion': LessonType.DISCUSSION,
    'field_trip': LessonType.FIELD_TRIP,
    'presentation': LessonType.PRESENTATION,
    'review': LessonType.REVIEW
  };
  
  return typeMap[type.toLowerCase()] || LessonType.LECTURE;
};

/**
 * Transforms extracted activity to CreateLessonActivityDto
 */
export const transformActivity = (activity: ExtractedLessonActivity): CreateLessonActivityDto => {
  return {
    title: activity.title,
    description: activity.description,
    duration: activity.duration,
    instructions: activity.instructions,
    activityType: activity.activityType,
    learningOutcome: activity.learningOutcome,
    successCriteria: activity.successCriteria,
    differentiation: activity.differentiation,
    resourceFiles: activity.resourceFiles?.map(file => ({
      filename: file.filename || file.title || 'resource',
      url: file.url || '',
      description: file.description
    })),
    resourceLinks: activity.resourceLinks?.map(link => ({
      title: link.title,
      url: link.url,
      description: link.description
    }))
  };
};

/**
 * Transforms extracted requirement to CreateLessonRequirementDto
 */
export const transformRequirement = (requirement: ExtractedLessonRequirement): CreateLessonRequirementDto => {
  return {
    type: mapRequirementType(requirement.type),
    title: requirement.title,
    description: requirement.description,
    isRequired: requirement.isRequired,
    materialsDescription: requirement.materialsDescription,
    materialsList: requirement.materialsList,
    whereToGet: requirement.whereToGet,
    status: RequirementStatus.DRAFT,
    notes: `Extracted from course outline. Cost: ${requirement.estimatedCost || 'Not specified'}`
  };
};

/**
 * Maps extracted requirement type to RequirementType enum
 */
export const mapRequirementType = (type: string): RequirementType => {
  const typeMap: { [key: string]: RequirementType } = {
    'read_article': RequirementType.ARTICLE,
    'worksheet': RequirementType.WORKSHEET,
    'materials': RequirementType.MATERIALS,
    'video': RequirementType.VIDEO,
    'document_upload': RequirementType.DOCUMENT_UPLOAD,
    'survey': RequirementType.SURVEY
  };
  
  return typeMap[type.toLowerCase()] || RequirementType.MATERIALS;
};

/**
 * Transforms multiple lesson plans
 */
export const transformLessonPlans = (extractedLessons: ExtractedLessonPlan[]): CreateLessonPlanDto[] => {
  return extractedLessons.map(lesson => transformLessonPlan(lesson));
};

/**
 * Generates a summary of the transformation
 */
export const generateTransformationSummary = (
  extractedLessons: ExtractedLessonPlan[], 
  transformedLessons: CreateLessonPlanDto[]
): string => {
  const totalActivities = transformedLessons.reduce((sum, lesson) => sum + (lesson.activities?.length || 0), 0);
  const totalRequirements = transformedLessons.reduce((sum, lesson) => sum + (lesson.requirements?.length || 0), 0);
  const totalObjectives = transformedLessons.reduce((sum, lesson) => sum + (lesson.objectives?.length || 0), 0);
  const totalDuration = transformedLessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  
  return `Transformation Summary:
• ${transformedLessons.length} lesson plans transformed
• ${totalObjectives} learning objectives mapped
• ${totalActivities} activities converted
• ${totalRequirements} requirements processed
• ${Math.round(totalDuration / 60)} hours total duration
• All lesson plans set to DRAFT status for review`;
};