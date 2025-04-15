
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const mockGoals = [
  {
    childName: "Emma",
    goals: [
      { id: 1, title: "Complete Math Module 3", progress: 75, dueDate: "2025-05-01" },
      { id: 2, title: "Spanish Language Level 2", progress: 45, dueDate: "2025-06-15" }
    ]
  },
  {
    childName: "Noah",
    goals: [
      { id: 3, title: "Science Project Completion", progress: 90, dueDate: "2025-04-20" },
      { id: 4, title: "Reading Challenge", progress: 60, dueDate: "2025-05-10" }
    ]
  },
  {
    childName: "Olivia",
    goals: [
      { id: 5, title: "Art Portfolio Development", progress: 30, dueDate: "2025-05-30" },
      { id: 6, title: "Coding Basics Course", progress: 85, dueDate: "2025-04-25" }
    ]
  }
];

const EducationalGoals = () => {
  return (
    <Card className="border-2 border-purple-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-4">Educational Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockGoals.map((child) => (
            <div key={child.childName} className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-700">{child.childName}'s Goals</h3>
              {child.goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <Badge variant="outline" className="text-xs">
                      Due {new Date(goal.dueDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Progress value={goal.progress} className="h-2" />
                    <span className="text-xs text-gray-500">{goal.progress}% completed</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationalGoals;
