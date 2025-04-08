
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Brain, Sparkles, Star, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LearningProgress() {
  const [selectedClass, setSelectedClass] = useState("all");
  
  // Mock data for demonstration
  const subjects = [
    { name: "Mathematics", progress: 75, icon: PieChart, color: "blue" },
    { name: "Science", progress: 60, icon: Brain, color: "purple" },
    { name: "Coding", progress: 40, icon: BookOpen, color: "green" },
    { name: "Language Arts", progress: 90, icon: BookOpen, color: "orange" },
  ];
  
  // Map color names to actual Tailwind classes
  const getProgressColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500"
    };
    
    return colorMap[color] || "bg-blue-500";
  };

  // Decorative elements for progress bars
  const ProgressDecorator = ({ progress }: { progress: number }) => {
    if (progress >= 90) {
      return <Star className="h-4 w-4 text-yellow-400 ml-2 animate-pulse" />;
    } else if (progress >= 70) {
      return <Sparkles className="h-4 w-4 text-blue-400 ml-2" />;
    }
    return null;
  };

  return (
    <Card className="border-2 border-blue-100 rounded-xl overflow-hidden shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-lg font-bold flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-blue-500" />
          Learning Progress
        </CardTitle>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[150px] border-blue-100 bg-white rounded-xl">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-blue-100">
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="math">Math Fundamentals</SelectItem>
            <SelectItem value="science">Science Explorers</SelectItem>
            <SelectItem value="coding">Intro to Coding</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <subject.icon className={`h-4 w-4 mr-2 text-${subject.color}-500`} />
                  <span className="font-medium">{subject.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold">{subject.progress}%</span>
                  <ProgressDecorator progress={subject.progress} />
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden relative p-0.5">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(subject.color)} transition-all duration-700 ease-out`} 
                  style={{ width: `${subject.progress}%` }}
                >
                  {subject.progress > 30 && (
                    <div className="absolute h-full w-full flex items-center justify-center">
                      <div className="h-1 bg-white/30 rounded-full w-[90%]"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-5 border-t mt-4 border-blue-100">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="font-bold text-blue-600 flex items-center">
                <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
                Overall Progress
              </span>
              <span className="font-bold text-blue-600">66%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative p-0.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: "66%" }}
              >
                <div className="absolute h-full w-full flex items-center justify-center">
                  <div className="h-1.5 bg-white/30 rounded-full w-[90%]"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full inline-flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                Keep learning to level up!
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
