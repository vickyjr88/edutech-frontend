
import { z } from "zod";

// Curriculum data structures
export interface CurriculumSubject {
  name: string;
  code?: string;
}

export interface CurriculumSubjectGroups {
  [key: string]: string[] | CurriculumSubjectGroups;
}

export interface CurriculumLevel {
  code: string;
  name: string;
  gradeRange: string;
  ageRange: string;
  subjects?: string[] | CurriculumSubjectGroups;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  curriculumId: string;
  levelId: string;
}

export interface Curriculum {
  _id: string;
  code: string;
  name: string;
  description: string;
  levels: CurriculumLevel[];
}

// Maps to store curriculum data for easy lookup
export const curriculaMap: { [key: string]: Curriculum } = {};
export const curriculumLevelMap: { [key: string]: CurriculumLevel } = {};
export const subjectsMap: { [key: string]: Subject } = {};

export const classSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["academic", "afterschool"]),
  title: z.string().min(3, { message: "Class title must be at least 3 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  curriculum: z.string().optional(),
  curriculumLevel: z.string().optional(),
  gradeLevel: z.string().optional(),
  ageRange: z.string().optional(),
  description: z.string().min(10, { message: "Detailed description must be at least 10 characters" }),
  objectives: z.string().optional(),
  assessmentMethods: z.string().optional(),
  technicalRequirements: z.string().optional(),
  materialsRequired: z.string().optional(),
  commitmentRequired: z.string().optional(),
  methodology: z.string().optional(),
  strategy: z.string().optional(),
  numberOfLessons: z.number().min(1, { message: "Number of lessons must be at least 1" }).default(1),
  isPublic: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  status: z.string().optional().default("draft"),
  hasCohorts: z.boolean().default(false),
  hasTeamTeaching: z.boolean().default(false),

  // Media fields (aligns with backend ClassDetail.media)
  introVideoUrl: z.string().url().optional().or(z.literal("")),
  thumbnailUrl: z.string().optional(),

  // Course materials files
  courseOutlineFile: z.string().optional(), // Store file URL/path
  syllabusFile: z.string().optional(), // Store file URL/path  
  schemeOfWorkFile: z.string().optional(), // Store file URL/path

  // Materials and resources (aligns with backend ClassDetail.materials)
  materials: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    type: z.enum(["required", "recommended", "optional"]).default("required"),
    link: z.string().optional(),
    file: z.string().optional(), // Store file URL/path
    cost: z.string().optional()
  })).default([]),

  // Resource links for additional learning materials
  resourceLinks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url(),
    description: z.string().optional(),
    type: z.enum(["article", "video", "document", "website", "tool"]).default("website")
  })).default([]),

  lessonPlans: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
    resources: z.string().optional(), // Store as JSON string
  })).default([]),
});

export type ClassFormValues = z.infer<typeof classSchema>;

// Updated cohort type with new fields
export type CohortData = {
  _id?: string; // Make it optional for new cohorts
  id?: string;  // Keep for backward compatibility
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  numberOfLessons: number;
  price: string;
  discount: string;
  isActive: boolean;
  currency?: string;
  lessonSchedules: LessonSchedule[];
  hasFlexibleSchedule: boolean;

  // New fields for repeating lessons
  repeatSchedule: RepeatSchedule;

  // New fields for enrollment limits and deadline
  minStudents: number;
  maxStudents: number;
  enrollmentDeadline: Date | null;
};

export type RepeatSchedule = {
  pattern: "weekly" | "twice-weekly" | "custom";
  daysOfWeek: string[]; // ["monday", "wednesday", "friday"] etc.
  repeatEvery: number; // repeat every X weeks
};

export type LessonSchedule = {
  id: string;
  lessonNumber: number;
  time: string;
  customTime?: string;
};

export type TeamMember = {
  id: string;
  email: string;
  role: string;
};
