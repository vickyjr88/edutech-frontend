
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, Brain, Calculator, Dna, Globe, Languages, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Merging the Educational Goals into Academic Progress for a unified view
const subjectProgress = [
  {
    id: 1,
    subject: "Mathematics",
    progress: 85,
    icon: <Calculator className="h-4 w-4" />,
    grade: "A",
    color: "bg-blue-500",
    goals: ["Complete Math Module 3", "Master Algebra Basics"]
  },
  {
    id: 2,
    subject: "Science",
    progress: 92,
    icon: <Dna className="h-4 w-4" />,
    grade: "A+",
    color: "bg-green-500",
    goals: ["Science Project Completion", "Lab Safety Certificate"]
  },
  {
    id: 3,
    subject: "Language Arts",
    progress: 78,
    icon: <BookText className="h-4 w-4" />,
    grade: "B+",
    color: "bg-purple-500",
    goals: ["Reading Challenge", "Essay Writing Skills"]
  }
];

const AcademicProgress = () => {
  return (
    <Card className="border border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
          Academic Progress & Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {subjectProgress.map((subject) => (
            <div key={subject.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md text-white ${subject.color}`}>
                    {subject.icon}
                  </div>
                  <span className="font-medium">{subject.subject}</span>
                </div>
                <Badge className={`${subject.color} text-white`}>{subject.grade}</Badge>
              </div>
              
              <Progress value={subject.progress} className="h-2" />
              
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Current Goals:</div>
                <div className="space-y-2">
                  {subject.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="h-3 w-3 text-blue-500" />
                      <span className="text-sm text-gray-600">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {subject.id !== subjectProgress.length && <Separator className="my-4" />}
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

// Add Badge component
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <span className={`px-2 py-0.5 text-xs font-medium rounded ${className}`}>
    {children}
  </span>
);

export default AcademicProgress;
