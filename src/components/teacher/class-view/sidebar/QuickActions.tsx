import { Calendar, MessageSquare, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  const actions = [
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Schedule Session",
      color: "bg-blue-100 text-blue-600 hover:bg-blue-200"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Message Students",
      color: "bg-green-100 text-green-600 hover:bg-green-200"
    },
    {
      icon: <FileText className="h-4 w-4" />,
      label: "Create Assignment",
      color: "bg-purple-100 text-purple-600 hover:bg-purple-200"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Manage Enrollment",
      color: "bg-orange-100 text-orange-600 hover:bg-orange-200"
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action, index) => (
            <Button 
              key={index} 
              variant="outline" 
              className={`w-full justify-start gap-2 ${action.color}`}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;