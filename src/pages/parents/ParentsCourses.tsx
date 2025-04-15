
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockCourses = [
  {
    id: 1,
    title: "Advanced Mathematics",
    description: "Perfect for students who excel in mathematical thinking",
    teacher: "Mr. Williams",
    rating: 4.8,
    level: "Advanced",
    capacity: "8/12 spots",
    price: "$50/class",
    tags: ["Mathematics", "Advanced", "Ages 12-14"]
  },
  {
    id: 2,
    title: "Introduction to Science",
    description: "A fun and engaging way to learn basic scientific concepts",
    teacher: "Ms. Rodriguez",
    rating: 4.9,
    level: "Beginner",
    capacity: "6/15 spots",
    price: "$45/class",
    tags: ["Science", "Beginner", "Ages 8-10"]
  },
  {
    id: 3,
    title: "Creative Writing",
    description: "Develop storytelling and creative writing skills",
    teacher: "Mrs. Thompson",
    rating: 4.7,
    level: "Intermediate",
    capacity: "10/12 spots",
    price: "$40/class",
    tags: ["English", "Intermediate", "Ages 10-12"]
  }
];

const ParentsCourses = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-kidato-blue" />
              <h1 className="text-2xl font-bold">Available Courses</h1>
            </div>
            
            <div className="grid gap-6">
              {mockCourses.map((course) => (
                <Card key={course.id} className="hover:border-blue-200 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold">{course.title}</h3>
                        <p className="text-gray-600">{course.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Teacher: {course.teacher}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{course.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {course.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold text-blue-600">{course.price}</p>
                        <p className="text-sm text-gray-600">{course.capacity}</p>
                        <Button className="mt-2">View Details</Button>
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

export default ParentsCourses;
