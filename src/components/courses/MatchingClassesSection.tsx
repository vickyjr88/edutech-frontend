
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Users, Clock, Calendar, UserRound, Sparkles, Star, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  subject: string;
  rating: number;
  description: string;
  availability: string;
}

interface Student {
  name: string;
  avatar: string;
  shared: number;
}

interface RecommendedCourse {
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

interface MatchingClassesSectionProps {
  recommendedCourses: RecommendedCourse[];
  matchingTeachers: Teacher[];
}

const MatchingClassesSection = ({ recommendedCourses, matchingTeachers }: MatchingClassesSectionProps) => {
  const getMatchingTeacher = (teacherId: string) => {
    return matchingTeachers.find(teacher => teacher.id === teacherId);
  };

  return (
    <div className="space-y-6 mb-8">
      {recommendedCourses.map((course) => {
        const matchingTeacher = getMatchingTeacher(course.matchingTeacher);
        
        return (
          <div key={course.id} className="flex flex-col lg:flex-row gap-6">
            {/* Teacher Card - Now First */}
            {matchingTeacher && (
              <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-blue-200 bg-blue-100">
                      <AvatarFallback className="text-blue-700 font-medium">
                        {matchingTeacher.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{matchingTeacher.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                          {matchingTeacher.subject}
                        </Badge>
                        <div className="flex items-center text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                          <span className="font-medium">{matchingTeacher.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 my-4">{matchingTeacher.description}</p>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Available: {matchingTeacher.availability}</span>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">View Profile</Button>
                    <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                      Message Teacher
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Arrow Connecting Teacher to Class */}
            <div className="hidden lg:flex items-center justify-center">
              <ArrowRight className="h-10 w-10 text-blue-400" />
            </div>
            
            {/* Class Card - Now Second */}
            <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                      {course.isFeatured && (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                          <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                          Featured
                        </Badge>
                      )}
                      {course.isNew && (
                        <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {course.subject}
                      </Badge>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="h-3.5 w-3.5 text-gray-500 mr-0.5" />
                        <span>{course.cost}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="rounded-full p-2 h-auto" size="icon">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>

                <p className="text-gray-600 mb-6">{course.description}</p>

                <div className="flex flex-col space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    <span><strong>{course.enrolledCount}</strong> enrolled / <strong>{course.maxCapacity - course.enrolledCount}</strong> spots remaining</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{course.nextClass}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Enrollment deadline: {course.enrollmentDeadline}</span>
                  </div>
                </div>
                
                {/* Social Proof - Students you know taking this course */}
                <div className="bg-blue-50 p-3 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <UserRound className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Classmates taking this course</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.students.map((student, i) => (
                      <div key={i} className="flex items-center bg-white rounded-full py-1 px-3 border border-blue-100">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-blue-100 text-xs text-blue-700">{student.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{student.name}</span>
                        <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4 bg-blue-50">
                          {student.shared} shared {student.shared > 1 ? "classes" : "class"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default MatchingClassesSection;
