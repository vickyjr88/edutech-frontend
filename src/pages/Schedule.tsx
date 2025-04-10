
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const Schedule = () => {
  const [userName] = useState("John Doe");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
            </div>
            
            {/* Coming Soon Message */}
            <Card className="mb-6 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 p-8 rounded-xl text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Calendar className="h-16 w-16 text-blue-500" />
                    <h2 className="text-xl font-bold">Calendar View Coming Soon!</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                      We're working on an interactive calendar to help you manage your class schedule and assignments.
                    </p>
                    <Button className="bg-kidato-blue hover:bg-kidato-dark-blue mt-2">
                      Get Notified When Ready
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Schedule;
