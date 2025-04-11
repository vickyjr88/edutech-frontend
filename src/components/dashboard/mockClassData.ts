
export const classes = [
  {
    id: "math101",
    title: "Math Fundamentals",
    teacher: "Ms. Sarah Johnson",
    teacherImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
    nextSession: "Today, 3:30 PM",
    sessionTime: new Date(),  // This will be dynamically set in the component
    progress: 65,
    students: 24,
    grade: "Grade 6",
    subject: "Mathematics",
    curriculum: "National Curriculum",
    classType: "Academic",
    nextTopic: "Fractions & Decimals",
    homeworkDue: "Thursday",
    totalLessonsCompleted: 8,
    totalLessons: 12,
    color: "bg-green-100 border-green-400",
    iconBg: "bg-green-200",
    buttonColor: "bg-green-500 hover:bg-green-600",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
  },
  {
    id: "science205",
    title: "Science Explorers",
    teacher: "Dr. Michael Chen",
    teacherImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
    nextSession: "Tomorrow, 4:00 PM",
    sessionTime: new Date(),  // This will be dynamically set in the component
    progress: 42,
    students: 18,
    grade: "Grade 8",
    subject: "Biology",
    curriculum: "Cambridge",
    classType: "Exam Prep",
    nextTopic: "Cellular Structure",
    homeworkDue: "Friday",
    totalLessonsCompleted: 5,
    totalLessons: 12,
    color: "bg-purple-100 border-purple-400",
    iconBg: "bg-purple-200",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
  },
  {
    id: "coding101",
    title: "Intro to Coding",
    teacher: "Mr. David Park",
    teacherImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
    nextSession: "Thursday, 2:15 PM",
    sessionTime: new Date(),  // This will be dynamically set in the component
    progress: 28,
    students: 15,
    grade: "Grade 10",
    subject: "Computer Science",
    curriculum: "National Curriculum",
    classType: "Non-Academic",
    nextTopic: "JavaScript Functions",
    homeworkDue: "Next Monday",
    totalLessonsCompleted: 3,
    totalLessons: 10,
    color: "bg-blue-100 border-blue-400",
    iconBg: "bg-blue-200",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
  },
  {
    id: "english101",
    title: "English Adventures",
    teacher: "Ms. Emily Rodriguez",
    teacherImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
    nextSession: "Friday, 1:30 PM",
    sessionTime: new Date(),  // This will be dynamically set in the component
    progress: 50,
    students: 22,
    grade: "Grade 7",
    subject: "English Literature",
    curriculum: "International Baccalaureate",
    classType: "Tutoring",
    nextTopic: "Creative Writing",
    homeworkDue: "Wednesday",
    totalLessonsCompleted: 6,
    totalLessons: 12,
    color: "bg-yellow-100 border-yellow-400",
    iconBg: "bg-yellow-200",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
  }
];

export function initializeSessionTimes(currentTime: Date): any[] {
  return classes.map((cls, index) => {
    const copy = { ...cls };
    
    if (index === 0) {
      // First class is happening now (30 minutes ago)
      copy.sessionTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), currentTime.getMinutes() - 30);
    } else if (index === 1) {
      // Second class is tomorrow
      copy.sessionTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 16, 0);
    } else if (index === 2) {
      // Third class is on Thursday (3 days from now)
      copy.sessionTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 3, 14, 15);
    } else {
      // Fourth class is on Friday (4 days from now)
      copy.sessionTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 4, 13, 30);
    }
    
    return copy;
  });
}
