// Types for extracted course data from the upload-and-process endpoint

export interface ExtractedObjective {
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'skills' | 'knowledge' | 'application';
}

export interface ExtractedLessonObjective {
  objective: string;
  isCompleted: boolean;
}

export interface ExtractedLessonRequirement {
  type: 'read_article' | 'worksheet' | 'materials' | 'video' | 'document_upload' | 'survey';
  title: string;
  description: string;
  isRequired: boolean;
  materialsDescription?: string;
  materialsList?: string[];
  whereToGet?: string;
  estimatedCost?: string;
}

export interface ExtractedAssessmentMethod {
  method: string;
  description: string;
  timeAllocation: number;
  criteria: string[];
  format: 'written' | 'verbal' | 'practical' | 'online';
  type: 'formative' | 'summative' | 'peer';
  instructions: string;
}

export interface ExtractedLessonActivity {
  title: string;
  description: string;
  duration: number;
  instructions: string;
  activityType: 'individual' | 'group_work' | 'practical' | 'discussion' | 'presentation';
  learningOutcome: string;
  successCriteria: string[];
  differentiation: string;
  resourceFiles?: any[];
  resourceLinks?: any[];
}

export interface ExtractedLessonFlow {
  title: string;
  description: string;
  duration: number;
  order: number;
  teachingMethod: 'lecture' | 'discussion' | 'practical' | 'demonstration';
  studentActivity: string;
  teacherInstructions: string;
  materialsNeeded: string[];
  resourceFiles?: any[];
  resourceLinks?: any[];
}

export interface ExtractedStarter {
  title: string;
  description: string;
  duration: number;
  instructions: string;
  materialsNeeded: string[];
}

export interface ExtractedPlenary {
  summaryActivity: string;
  duration: number;
  keyTakeaways: string;
  closingInstructions: string;
  reflectionPrompts: string;
  assessmentMethods: ExtractedAssessmentMethod[];
}

export interface ExtractedResourceLink {
  title: string;
  url: string;
  description: string;
}

export interface ExtractedLessonPlan {
  title: string;
  description: string;
  type: 'lecture' | 'practical' | 'workshop' | 'assessment' | 'discussion' | 'field_trip' | 'presentation' | 'review';
  lessonNumber: number;
  duration: number;
  requirements: ExtractedLessonRequirement[];
  prerequisites: string;
  tags: string[];
  objectives: ExtractedLessonObjective[];
  successCriteria: string[];
  starter: ExtractedStarter;
  lessonFlow: ExtractedLessonFlow[];
  activities: ExtractedLessonActivity[];
  teachingTips: string;
  differentiation: string;
  vocabularyFocus: string;
  plenary: ExtractedPlenary;
  homework: string;
  nextStepsForStudents: string;
  reflectionPrompts: string;
  resourceFiles?: any[];
  resourceLinks: ExtractedResourceLink[];
  roomSetup: string;
  safetyConsiderations: string;
  assessmentMethods: ExtractedAssessmentMethod[];
  assessmentCriteria: string;
  estimatedPreparationTime: number;
  teacherNotes: string;
  backupActivities: string;
  challengesAnticipated: string;
  summary: string;
}

export interface ExtractedCourseRequirement {
  type: 'materials' | 'technical' | 'prerequisite';
  title: string;
  description: string;
  isRequired: boolean;
  materialsDescription?: string;
  materialsList?: string[];
  whereToGet?: string;
  estimatedCost?: string;
}

export interface ExtractedCourseData {
  title: string;
  curriculum: string;
  gradeLevel: string;
  duration: string;
  objectives: ExtractedObjective[];
  lessonPlans: ExtractedLessonPlan[];
  requirements: ExtractedCourseRequirement[];
  summary: string;
  description: string;
  teacherNotes: string;
  tags: string[];
  technicalRequirements: Array<{
    requirement: string;
  }>;
  materials: Array<{
    name: string;
  }>;
  confidence: number;
}

export interface CourseUploadResponse {
  success: boolean;
  message: string;
  data: {
    extractedData: ExtractedCourseData;
    classData: any;
    lessonPlansCreated: number;
    processingTime: number;
    confidence: number;
    uploadInfo: {
      fileName: string;
      fileSize: number;
      fileUrl: string;
    };
  };
}