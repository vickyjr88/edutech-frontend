
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { Users, Star, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockTeachers = [
  {
    id: 1,
    name: "Dr. Sarah Williams",
    subjects: ["Mathematics", "Physics"],
    experience: "10+ years",
    rating: 4.9,
    availability: "Weekdays, 9 AM - 5 PM",
    reviews: 128,
    specializations: ["Advanced Calculus", "SAT Prep"],
    education: "Ph.D. in Mathematics Education"
  },
  {
    id: 2,
    name: "Prof. Michael Rodriguez",
    subjects: ["Chemistry", "Biology"],
    experience: "8 years",
    rating: 4.8,
    availability: "Mon-Fri, 2 PM - 8 PM",
    reviews: 96,
    specializations: ["Lab Experiments", "AP Biology"],
    education: "M.Sc. in Chemistry"
  },
  {
    id: 3,
    name: "Ms. Emily Thompson",
    subjects: ["English Literature", "Creative Writing"],
    experience: "12 years",
    rating: 4.9,
    availability: "Flexible Hours",
    reviews: 156,
    specializations: ["Essay Writing", "Reading Comprehension"],
    education: "M.A. in English Literature"
  }
];

const ParentsTeachers = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-6 w-6 text-kidato-blue" />
              <h1 className="text-2xl font-bold">Our Teachers</h1>
            </div>
            
            <div className="grid gap-6">
              {mockTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:border-blue-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-blue-500 text-lg">
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">{teacher.name}</h3>
                            <p className="text-gray-600">{teacher.education}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 font-medium">{teacher.rating}</span>
                                <span className="text-gray-500 text-sm ml-1">
                                  ({teacher.reviews} reviews)
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{teacher.experience} experience</p>
                            </div>
                            <Button className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Contact
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {teacher.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="secondary">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-medium">Specializations:</span>{' '}
                            {teacher.specializations.join(', ')}
                          </p>
                          
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Availability:</span>{' '}
                            {teacher.availability}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsTeachers;
