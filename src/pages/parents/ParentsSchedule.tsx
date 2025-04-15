
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockSchedule = [
  {
    id: 1,
    childName: "Emma",
    subject: "Mathematics",
    teacher: "Mr. Williams",
    time: "09:00 AM - 10:30 AM",
    day: "Monday",
    status: "upcoming"
  },
  {
    id: 2,
    childName: "Noah",
    subject: "Science",
    teacher: "Ms. Rodriguez",
    time: "11:00 AM - 12:30 PM",
    day: "Monday",
    status: "upcoming"
  },
  {
    id: 3,
    childName: "Emma",
    subject: "English",
    teacher: "Mrs. Thompson",
    time: "02:00 PM - 03:30 PM",
    day: "Monday",
    status: "upcoming"
  }
];

const ParentsSchedule = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />
        
        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-6 w-6 text-kidato-blue" />
              <h1 className="text-2xl font-bold">Learning Schedule</h1>
            </div>
            
            <div className="grid gap-4">
              {mockSchedule.map((class_) => (
                <Card key={class_.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{class_.subject}</h3>
                        <p className="text-sm text-gray-600">Student: {class_.childName}</p>
                        <p className="text-sm text-gray-600">Teacher: {class_.teacher}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">{class_.status}</Badge>
                        <p className="text-sm font-medium">{class_.time}</p>
                        <p className="text-sm text-gray-600">{class_.day}</p>
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

export default ParentsSchedule;
