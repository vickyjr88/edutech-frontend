
import { z } from "zod";

export const classSchema = z.object({
  type: z.enum(["academic", "afterschool"]),
  title: z.string().min(3, { message: "Class title must be at least 3 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  curriculum: z.string().optional(),
  gradeLevel: z.string().optional(),
  ageRange: z.string().optional(),
  summary: z.string().min(10, { message: "Class summary must be at least 10 characters" }).max(200, { message: "Class summary must be at most 200 characters" }),
  description: z.string().min(10, { message: "Detailed description must be at least 10 characters" }),
  objectives: z.string().optional(),
  assessmentMethods: z.string().optional(),
  technicalRequirements: z.string().optional(),
  materialsRequired: z.string().optional(),
  commitmentRequired: z.string().optional(),
  methodology: z.string().optional(),
  strategy: z.string().optional(),
  isPublic: z.boolean().default(true),
  hasCohorts: z.boolean().default(false),
  hasTeamTeaching: z.boolean().default(false),
  lessonPlans: z.array(z.object({
    id: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
    resourceUrl: z.string().optional(),
    resourceFiles: z.array(z.any()).optional(),
  })).default([]),
});

export type ClassFormValues = z.infer<typeof classSchema>;

// Extended cohort type with new fields
export type CohortData = {
  id: string;
  name: string; 
  schedule: string;
  scheduleDays: Date[];
  scheduleTime: string;
  price: string;
  siblingDiscount: string;
  friendDiscount: string;
  numberOfLessons: string;
  isActive: boolean;
  students: { id: string; name: string; email: string }[];
  lessonSchedules: LessonSchedule[];
  hasFlexibleSchedule: boolean;
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
