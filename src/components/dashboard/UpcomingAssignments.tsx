
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import { useState } from "react";
import AssignmentDialog from "../progress/AssignmentDialog";

export default function UpcomingAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);

  const assignments = [
    {
      id: "a1",
      title: "Algebra Quiz",
      course: "Math Fundamentals",
      dueDate: "Today",
      dueTime: "11:59 PM",
      isUrgent: true,
      status: "in_progress",
      type: "individual",
      description: "Complete the online algebra quiz covering linear equations, inequalities, and basic graphing."
    },
    {
      id: "a2",
      title: "Lab Report",
      course: "Science Explorers",
      dueDate: "Tomorrow",
      dueTime: "3:00 PM",
      isUrgent: false,
      status: "in_progress",
      type: "individual",
      description: "Write a lab report based on the experiment conducted in class. Include methodology, results, and discussion sections."
    },
    {
      id: "a3",
      title: "Code Project",
      course: "Intro to Coding",
      dueDate: "Friday",
      dueTime: "5:00 PM",
      isUrgent: false,
      status: "upcoming",
      type: "individual",
      description: "Create a simple game using the programming concepts we've covered in class so far."
    }
  ];

  const handleViewAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setAssignmentDialogOpen(true);
  };

  const handleUpdateAssignment = (assignmentId: string, updatedData: any) => {
    // In a real app, this would update the assignment in the database
    console.log("Assignment updated:", assignmentId, updatedData);
  };

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
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewAssignment(assignment)}
                >
                  <FileCheck className="h-3.5 w-3.5 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full mt-2">
            View all assignments
          </Button>
        </div>
      </CardContent>

      {/* Assignment Dialog */}
      {selectedAssignment && (
        <AssignmentDialog
          isOpen={assignmentDialogOpen}
          onClose={() => setAssignmentDialogOpen(false)}
          assignment={selectedAssignment}
          onUpdateAssignment={handleUpdateAssignment}
        />
      )}
    </Card>
  );
}
