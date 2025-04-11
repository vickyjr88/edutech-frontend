
export interface Assignment {
  id: string;
  title: string;
  status: "completed" | "pending_review" | "in_progress" | "upcoming" | "late";
  submitDate?: string;
  dueDate: string;
  score?: string;
  grade?: string;
  feedback?: string;
  type: "individual" | "group";
  description?: string;
  progress?: number;
  groupMembers?: number;
  lateBy?: string;
}

// Mock data for assignments
export const getMockAssignmentsData = (): Assignment[] => {
  return [
    {
      id: "assignment1",
      title: "Basic Operations Worksheet",
      status: "completed",
      submitDate: "Feb 3, 2025",
      dueDate: "Feb 5, 2025",
      score: "95%",
      grade: "A",
      feedback: "Excellent work with clear solutions.",
      type: "individual",
      description: "Complete the worksheet on basic arithmetic operations including addition, subtraction, multiplication and division."
    },
    {
      id: "assignment2",
      title: "Mathematical Problem Solving",
      status: "pending_review",
      submitDate: "Feb 12, 2025",
      dueDate: "Feb 12, 2025",
      type: "individual",
      description: "Solve the given word problems using appropriate mathematical operations and show your work."
    },
    {
      id: "assignment3",
      title: "Group Math Project",
      status: "in_progress",
      dueDate: "Feb 20, 2025",
      progress: 30,
      type: "group",
      groupMembers: 3,
      description: "Work with your group to create a presentation explaining how mathematics is used in everyday life with at least 5 examples."
    },
    {
      id: "assignment4",
      title: "Fractions and Decimals",
      status: "upcoming",
      dueDate: "Feb 28, 2025",
      type: "individual",
      description: "Complete the worksheet on converting fractions to decimals and vice versa. Include practice problems with mixed numbers."
    },
    {
      id: "assignment5",
      title: "Challenge Problem Set",
      status: "late",
      dueDate: "Feb 10, 2025",
      type: "individual",
      lateBy: "2 days",
      description: "Solve these advanced math problems that incorporate multiple concepts learned in class."
    },
  ];
};
