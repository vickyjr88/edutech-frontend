
import { Book, Code, Flask, Calculator, GraduationCap, Laptop } from "lucide-react";
import CourseCard, { CourseProps } from "./CourseCard";

const coursesData: CourseProps[] = [
  {
    id: "math-101",
    title: "Algebra Fundamentals",
    subject: "Mathematics",
    progress: 68,
    teacher: "Dr. Emma Wright",
    nextLesson: "Tomorrow, 10:00 AM",
    color: "#9b87f5",
    icon: <Calculator className="h-5 w-5 text-purple-600" />
  },
  {
    id: "science-203",
    title: "Chemistry Lab Essentials",
    subject: "Science",
    progress: 42,
    teacher: "Prof. James Wilson",
    nextLesson: "Wednesday, 2:15 PM",
    color: "#33C3F0",
    icon: <Flask className="h-5 w-5 text-blue-500" />
  },
  {
    id: "cs-intro",
    title: "Introduction to Programming",
    subject: "Computer Science",
    progress: 89,
    teacher: "Alex Morgan",
    nextLesson: "Today, 4:30 PM",
    color: "#7E69AB",
    icon: <Code className="h-5 w-5 text-indigo-600" />
  },
  {
    id: "eng-lit",
    title: "World Literature Classics",
    subject: "English",
    progress: 35,
    teacher: "Sarah Johnson",
    nextLesson: "Friday, 1:00 PM",
    color: "#E5DEFF",
    icon: <Book className="h-5 w-5 text-violet-500" />
  },
  {
    id: "edu-tech",
    title: "Educational Technology",
    subject: "Education",
    progress: 55,
    teacher: "Prof. David Lee",
    nextLesson: "Thursday, 11:30 AM",
    color: "#1EAEDB",
    icon: <Laptop className="h-5 w-5 text-cyan-600" />
  },
  {
    id: "adv-study",
    title: "Advanced Study Methods",
    subject: "Academic Skills",
    progress: 72,
    teacher: "Dr. Lisa Coleman",
    nextLesson: "Monday, 9:45 AM",
    color: "#D6BCFA",
    icon: <GraduationCap className="h-5 w-5 text-purple-500" />
  },
];

const MyCourses = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
        <button className="text-sm text-kidato-blue hover:underline">View All</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coursesData.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
