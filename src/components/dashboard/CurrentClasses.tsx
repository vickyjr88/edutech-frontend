
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CurrentClasses() {
  const classes = [
    {
      id: "math101",
      title: "Math Fundamentals",
      teacher: "Ms. Sarah Johnson",
      nextSession: "Today, 3:30 PM",
      progress: 65,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "science205",
      title: "Science Explorers",
      teacher: "Dr. Michael Chen",
      nextSession: "Tomorrow, 4:00 PM",
      progress: 42,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    },
    {
      id: "coding101",
      title: "Intro to Coding",
      teacher: "Mr. David Park",
      nextSession: "Thursday, 2:15 PM",
      progress: 28,
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=100&q=80"
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Current Classes</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/courses">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="flex items-center border rounded-lg overflow-hidden">
              <img 
                src={cls.image} 
                alt={cls.title} 
                className="w-24 h-16 object-cover hidden sm:block"
              />
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{cls.title}</h3>
                  <span className="text-xs text-gray-500">{cls.nextSession}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{cls.teacher}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-kidato-blue h-1.5 rounded-full" 
                    style={{ width: `${cls.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium">{cls.progress}%</span>
                </div>
              </div>
              <Button variant="ghost" className="mr-2" asChild>
                <Link to={`/class/${cls.id}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
