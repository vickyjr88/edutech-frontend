
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, Brain, Calculator, Dna, Globe, Languages } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Mock subject progress data
const subjectProgress = [
  {
    id: 1,
    subject: "Mathematics",
    progress: 85,
    icon: <Calculator className="h-4 w-4" />,
    grade: "A",
    color: "bg-blue-500"
  },
  {
    id: 2,
    subject: "Science",
    progress: 92,
    icon: <Dna className="h-4 w-4" />,
    grade: "A+",
    color: "bg-green-500"
  },
  {
    id: 3,
    subject: "Language Arts",
    progress: 78,
    icon: <BookText className="h-4 w-4" />,
    grade: "B+",
    color: "bg-purple-500"
  },
  {
    id: 4,
    subject: "Social Studies",
    progress: 81,
    icon: <Globe className="h-4 w-4" />,
    grade: "B+",
    color: "bg-amber-500"
  },
  {
    id: 5,
    subject: "Foreign Language",
    progress: 70,
    icon: <Languages className="h-4 w-4" />,
    grade: "B",
    color: "bg-indigo-500"
  },
  {
    id: 6,
    subject: "Critical Thinking",
    progress: 88,
    icon: <Brain className="h-4 w-4" />,
    grade: "A-",
    color: "bg-rose-500"
  }
];

const AcademicProgress = () => {
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          Academic Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {subjectProgress.map((subject, index) => (
            <div key={subject.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md text-white ${subject.color}`}>
                    {subject.icon}
                  </div>
                  <span className="font-medium">{subject.subject}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{subject.progress}%</span>
                  <Badge className={`${subject.color} text-white`}>{subject.grade}</Badge>
                </div>
              </div>
              <Progress value={subject.progress} className="h-2" />
              {index === 1 || index === 3 || index === 5 ? <Separator className="md:hidden mt-4" /> : null}
            </div>
          ))}
        </div>
        
        <div className="mt-6 bg-blue-50 p-3 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Overall Performance</h4>
              <p className="text-sm text-gray-600">Academic Year 2024-2025</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-semibold text-blue-600">82.3%</span>
              <div className="text-sm text-gray-500">Grade: B+</div>
            </div>
          </div>
          <Progress value={82.3} className="h-2.5 mt-3" />
        </div>
      </CardContent>
    </Card>
  );
};

// Add this Badge component to avoid importing it
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <span className={`px-2 py-0.5 text-xs font-medium rounded ${className}`}>
    {children}
  </span>
);

export default AcademicProgress;
