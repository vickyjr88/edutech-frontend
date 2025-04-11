
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// Mock data for children's current live status
const childrenStatuses = [
  {
    id: 1,
    name: "Emma",
    initials: "EJ",
    status: "live",
    className: "Math - Algebra Fundamentals",
    timeRemaining: 25,
    teacher: "Mr. Williams",
  },
  {
    id: 2,
    name: "Noah",
    initials: "NJ",
    status: "upcoming",
    className: "Science - Introduction to Ecology",
    startTime: "30 mins",
    teacher: "Ms. Rodriguez",
  },
  {
    id: 3,
    name: "Olivia",
    initials: "OJ",
    status: "completed",
    className: "History - Ancient Civilizations",
    completedAt: "2 hours ago",
    attendance: "present",
  }
];

const ChildrenLiveStatus = () => {
  const [viewDetails, setViewDetails] = useState<number | null>(null);

  const getStatusBadge = (status: string, attendance?: string) => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-red-500 animate-pulse text-white">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              Live Now
            </span>
          </Badge>
        );
      case "upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Upcoming
          </Badge>
        );
      case "completed":
        if (attendance === "present") {
          return (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Attended
            </Badge>
          );
        } else if (attendance === "absent") {
          return (
            <Badge className="bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Missed
            </Badge>
          );
        } else {
          return (
            <Badge className="bg-amber-100 text-amber-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unknown
            </Badge>
          );
        }
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-4">Children's Live Classes Status</h2>
        <div className="space-y-4">
          {childrenStatuses.map((child) => (
            <div 
              key={child.id} 
              className={`p-3 rounded-lg ${
                child.status === "live" 
                  ? "bg-red-50 border border-red-200" 
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className={`
                      ${child.status === "live" ? "bg-red-500" : 
                        child.status === "upcoming" ? "bg-blue-500" : 
                        "bg-gray-500"} 
                      text-white
                    `}>
                      {child.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold mr-2">{child.name}</h3>
                      {getStatusBadge(child.status, child.attendance)}
                    </div>
                    <p className="text-sm text-gray-600">{child.className}</p>
                  </div>
                </div>
                
                {child.status === "live" && (
                  <Button 
                    size="sm" 
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-1" /> Join
                  </Button>
                )}
              </div>
              
              {viewDetails === child.id || child.status === "live" ? (
                <div className="mt-2 pl-12">
                  <div className="text-xs text-gray-500 space-y-1">
                    {child.status === "live" && (
                      <div className="flex items-center text-red-600">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{child.timeRemaining} minutes remaining</span>
                      </div>
                    )}
                    {child.status === "upcoming" && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Starts in {child.startTime}</span>
                      </div>
                    )}
                    {child.status === "completed" && child.completedAt && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Completed {child.completedAt}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="mr-1">Teacher:</span>
                      <span className="font-medium">{child.teacher}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 pl-12">
                  <button 
                    onClick={() => setViewDetails(child.id)} 
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Show details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChildrenLiveStatus;
