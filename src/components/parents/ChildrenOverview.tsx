
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Award, BookOpen } from "lucide-react";

// Mock data for children
const children = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 12,
    grade: "7th Grade",
    nextClass: "Math - Algebra Fundamentals",
    nextClassTime: "Today, 3:30 PM",
    achievements: 2,
    activeTasks: 3,
    completedCourses: 8,
    avatar: null
  },
  {
    id: 2,
    name: "Noah Johnson",
    age: 10,
    grade: "5th Grade",
    nextClass: "Science - Introduction to Ecology",
    nextClassTime: "Tomorrow, 10:00 AM",
    achievements: 5,
    activeTasks: 1,
    completedCourses: 6,
    avatar: null
  }
];

const ChildrenOverview = () => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Children Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children.map((child) => (
          <Card key={child.id} className="overflow-hidden border border-blue-100">
            <div className="bg-blue-50/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-white">
                  {child.avatar ? (
                    <AvatarImage src={child.avatar} alt={child.name} />
                  ) : (
                    <AvatarFallback className="bg-kidato-blue text-white text-lg">
                      {child.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{child.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{child.age} years old</span>
                    <span>•</span>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {child.grade}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">View Details</Button>
            </div>

            <CardContent className="p-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Next Class</h4>
                <div className="flex items-start">
                  <BookOpen className="h-4 w-4 text-kidato-blue mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{child.nextClass}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{child.nextClassTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Award className="h-4 w-4 text-amber-500" />
                  </div>
                  <p className="text-lg font-semibold">{child.achievements}</p>
                  <p className="text-xs text-gray-500">Achievements</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-lg font-semibold">{child.activeTasks}</p>
                  <p className="text-xs text-gray-500">Active Tasks</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-lg font-semibold">{child.completedCourses}</p>
                  <p className="text-xs text-gray-500">Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChildrenOverview;
