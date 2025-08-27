
import { z } from "zod";

export interface Assignment {
  id: string;
  title: string;
  status: "completed" | "pending_review" | "in_progress" | "upcoming" | "late";
  submitDate?: string;
  dueDate: string;
  dueTime?: string;
  score?: string;
  grade?: string;
  feedback?: string;
  type: "individual" | "group";
  groupMembers?: number;
  course?: string;
  lesson?: string;
  description?: string;
  resources?: Resource[];
  videoLinks?: VideoLink[];
  lateBy?: string;
  isUrgent?: boolean;
  // Additional fields from real API data
  submissionContent?: string;
  submittedAt?: string;
  attachments?: string[];
  assignmentId?: string; // The actual assignment ID for API calls
  studentAssignmentId?: string; // For updating submissions
  totalPoints?: number;
  passingGrade?: number;
  submissionStatus?: string;
  timeSpent?: number;
  attempts?: number;
  isLate?: boolean;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface VideoLink {
  id: string;
  title: string;
  url: string;
}

export const assignmentFormSchema = z.object({
  answer: z.string().optional(),
  attachedFile: z.any().optional(),
  externalLink: z.string().optional(),
  difficultyRating: z.string().optional(),
});

export type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export interface AssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  onUpdateAssignment?: (assignmentId: string, data: any) => void;
}
