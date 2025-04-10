
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

// Mock data
export const mockTeachers: Teacher[] = [
  {
    id: "teacher1",
    name: "Sarah Johnson",
    avatar: "SJ",
    subject: "Mathematics",
    rating: 4.8,
    description: "Experienced math teacher with 10+ years specializing in algebra and calculus. Uses interactive methods to make complex concepts easy to understand.",
    availability: "Weekdays afternoons"
  },
  {
    id: "teacher2",
    name: "Michael Rodriguez",
    avatar: "MR",
    subject: "Science",
    rating: 4.9,
    description: "Physics and chemistry expert with a talent for engaging experiments. Makes science come alive with real-world applications.",
    availability: "Evenings and weekends"
  },
  {
    id: "teacher3",
    name: "Emma Wilson",
    avatar: "EW",
    subject: "English",
    rating: 4.7,
    description: "Creative writing coach and literature enthusiast. Helps students develop their unique voice while mastering grammar and structure.",
    availability: "Monday, Wednesday, Friday"
  }
];

export const mockRecommendedCourses: RecommendedCourse[] = [
  {
    id: "math202",
    title: "Advanced Mathematics",
    subject: "Mathematics",
    description: "Take your math skills to the next level with advanced concepts and problem-solving.",
    nextClass: "Monday, 1:00 PM",
    enrollmentDeadline: "May 25, 2025",
    enrolledCount: 7,
    maxCapacity: 10,
    matchingTeacher: "teacher1",
    isFeatured: true,
    isNew: false,
    rating: 4.9,
    cost: "$17/class",
    students: [
      { name: "Tina Smith", avatar: "TS", shared: 2 },
      { name: "Alex Miller", avatar: "AM", shared: 1 },
      { name: "Emma Wong", avatar: "EW", shared: 3 }
    ]
  },
  {
    id: "phys101",
    title: "Physics Fundamentals",
    subject: "Science",
    description: "Discover the basic principles that govern the physical world around us.",
    nextClass: "Thursday, 11:30 AM",
    enrollmentDeadline: "June 10, 2025",
    enrolledCount: 8,
    maxCapacity: 12,
    matchingTeacher: "teacher2",
    isFeatured: false,
    isNew: true,
    rating: 4.7,
    cost: "$15/class",
    students: [
      { name: "Kevin Parker", avatar: "KP", shared: 2 },
      { name: "Rachel Johnson", avatar: "RJ", shared: 1 },
      { name: "Emma Wong", avatar: "EW", shared: 1 }
    ]
  },
  {
    id: "code101",
    title: "Introduction to Coding",
    subject: "Technology",
    description: "Begin your coding journey with the basics of programming logic and syntax.",
    nextClass: "Friday, 2:15 PM",
    enrollmentDeadline: "May 30, 2025",
    enrolledCount: 5,
    maxCapacity: 10,
    matchingTeacher: "teacher3",
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    cost: "$16/class",
    students: [
      { name: "Tina Smith", avatar: "TS", shared: 1 },
      { name: "Kevin Parker", avatar: "KP", shared: 2 },
      { name: "Rachel Johnson", avatar: "RJ", shared: 1 }
    ]
  }
];

export const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: "math101",
    title: "Mathematics Fundamentals",
    subject: "Mathematics",
    description: "Master essential math concepts for academic success and problem-solving skills.",
    progress: 68,
    nextClass: "Tuesday, 2:00 PM",
    enrollmentDeadline: "April 20, 2025",
    enrolledCount: 9,
    maxCapacity: 12,
    rating: 4.7,
    cost: "$15/class"
  },
  {
    id: "eng205",
    title: "Creative Writing Workshop",
    subject: "English",
    description: "Develop your creative writing skills through guided exercises and peer feedback.",
    progress: 42,
    nextClass: "Wednesday, 10:30 AM",
    enrollmentDeadline: "May 15, 2025",
    enrolledCount: 7,
    maxCapacity: 12,
    rating: 4.5,
    cost: "$12/class"
  },
  {
    id: "sci110",
    title: "Introduction to Biology",
    subject: "Science",
    description: "Explore the fundamentals of biology, from cells to ecosystems and everything in between.",
    progress: 75,
    nextClass: "Thursday, 1:15 PM",
    enrollmentDeadline: "April 30, 2025",
    enrolledCount: 8,
    maxCapacity: 12,
    rating: 4.8,
    cost: "$14/class"
  },
  {
    id: "art150",
    title: "Digital Art & Design",
    subject: "Art",
    description: "Learn digital art techniques using industry-standard software and design principles.",
    progress: 89,
    nextClass: "Monday, 3:45 PM",
    enrollmentDeadline: "June 5, 2025",
    enrolledCount: 10,
    maxCapacity: 16,
    rating: 4.9,
    cost: "$18/class"
  }
];

export const mockCompletedCourses: CompletedCourse[] = [
  {
    id: "hist101",
    title: "World History",
    subject: "History",
    description: "A comprehensive overview of major world events and their impact on society.",
    completedDate: "March 15, 2025",
    grade: "A",
    rating: 4.6,
    cost: "$14/class"
  },
  {
    id: "chem101",
    title: "Chemistry Basics",
    subject: "Science",
    description: "An introduction to the fundamental principles of chemistry and laboratory practice.",
    completedDate: "January 22, 2025",
    grade: "B+",
    rating: 4.5,
    cost: "$13/class"
  }
];
