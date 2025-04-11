
// Mock data for lessons
export const getMockLessonsData = () => {
  return [
    {
      id: "lesson1",
      title: "Introduction to Numbers",
      status: "completed",
      completedDate: "Jan 25, 2025",
      duration: "45 min",
      grade: "A",
      notes: true
    },
    {
      id: "lesson2",
      title: "Basic Addition and Subtraction",
      status: "completed",
      completedDate: "Feb 1, 2025",
      duration: "50 min",
      grade: "A-",
      notes: true
    },
    {
      id: "lesson3",
      title: "Multiplication Fundamentals",
      status: "completed",
      completedDate: "Feb 8, 2025",
      duration: "55 min",
      grade: "B+",
      notes: true
    },
    {
      id: "lesson4",
      title: "Division Basics",
      status: "in-progress",
      nextSession: "Feb 15, 2025",
      duration: "60 min",
      completedPercentage: 35,
      notes: false
    },
    {
      id: "lesson5",
      title: "Fractions Introduction",
      status: "upcoming",
      nextSession: "Feb 22, 2025",
      duration: "60 min",
      notes: false
    },
    {
      id: "lesson6",
      title: "Decimals and Percentages",
      status: "upcoming",
      nextSession: "Mar 1, 2025",
      duration: "65 min",
      notes: false
    },
  ];
};
