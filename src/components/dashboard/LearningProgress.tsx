
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LearningProgress() {
  const [selectedClass, setSelectedClass] = useState("all");
  
  // Mock data for demonstration
  const subjects = [
    { name: "Mathematics", progress: 75 },
    { name: "Science", progress: 60 },
    { name: "Coding", progress: 40 },
    { name: "Language Arts", progress: 90 },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Learning Progress</CardTitle>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="math">Math Fundamentals</SelectItem>
            <SelectItem value="science">Science Explorers</SelectItem>
            <SelectItem value="coding">Intro to Coding</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{subject.name}</span>
                <span className="font-medium">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(subject.progress)}`} 
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="font-medium">66%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-kidato-blue h-2.5 rounded-full" 
                style={{ width: "66%" }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getProgressColor(progress: number): string {
  if (progress >= 75) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-500";
  return "bg-red-500";
}
