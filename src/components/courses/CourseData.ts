
// Types for course data
export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  rating: number;
  description: string;
  availability: string;
}

export interface Student {
  name: string;
  avatar: string;
  shared: number;
}

export interface RecommendedCourse {
  id: string;
  title: string;
  subject: string;
  description: string;
  nextClass: string;
  enrollmentDeadline: string;
  enrolledCount: number;
  maxCapacity: number;
  matchingTeacher: string;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  cost: string;
  students: Student[];
}

export interface EnrolledCourse {
  id: string;
  title: string;
  subject: string;
  description: string;
  progress: number;
  nextClass: string;
  enrollmentDeadline: string;
  enrolledCount: number;
  maxCapacity: number;
  rating: number;
  cost: string;
}

export interface CompletedCourse {
  id: string;
  title: string;
  subject: string;
  description: string;
  completedDate: string;
  grade: string;
  rating: number;
  cost: string;
}
