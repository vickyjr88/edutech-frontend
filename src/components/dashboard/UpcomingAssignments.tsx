
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UpcomingAssignments() {
  const assignments = [
    {
      id: "a1",
      title: "Algebra Quiz",
      course: "Math Fundamentals",
      dueDate: "Today",
      dueTime: "11:59 PM",
      isUrgent: true
    },
    {
      id: "a2",
      title: "Lab Report",
      course: "Science Explorers",
      dueDate: "Tomorrow",
      dueTime: "3:00 PM",
      isUrgent: false
    },
    {
      id: "a3",
      title: "Code Project",
      course: "Intro to Coding",
      dueDate: "Friday",
      dueTime: "5:00 PM",
      isUrgent: false
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Assignments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className="border rounded-md p-3"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                {assignment.isUrgent && (
                  <Badge variant="destructive" className="text-xs">Due soon</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Due {assignment.dueDate}, {assignment.dueTime}
                </span>
                <Button size="sm" variant="outline">Start</Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full mt-2">
            View all assignments
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
