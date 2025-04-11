
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, CalendarClock, BookOpen } from "lucide-react";

// Mock data for important reminders
const reminders = [
  {
    id: 1,
    title: "Permission slip needed",
    dueDate: "Today",
    priority: "high",
    type: "form"
  },
  {
    id: 2,
    title: "Math homework due",
    child: "Noah",
    dueDate: "Tomorrow",
    priority: "medium",
    type: "homework"
  },
  {
    id: 3,
    title: "Science project supplies",
    child: "Emma",
    dueDate: "This week",
    priority: "medium",
    type: "materials"
  }
];

const ImportantReminders = () => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Clock className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "homework":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "form":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "materials":
        return <CalendarClock className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-2 border-2 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Important Reminders</h2>
          <Badge className="bg-amber-500">
            {reminders.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div 
              key={reminder.id} 
              className="flex items-start p-2 rounded-md bg-amber-50 border border-amber-200"
            >
              <div className="p-2 bg-white rounded-md mr-3">
                {getTypeIcon(reminder.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{reminder.title}</span>
                  {getPriorityBadge(reminder.priority)}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  {reminder.child && (
                    <span className="mr-2">
                      {reminder.child}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Due {reminder.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantReminders;
