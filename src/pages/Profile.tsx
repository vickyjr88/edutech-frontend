
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const Profile = () => {
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
              <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
            </div>
            
            {/* Profile Content */}
            <Card className="mb-6 border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                <CardTitle className="text-lg font-bold flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-kidato-blue to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
                      JD
                    </div>
                    <h2 className="text-xl font-bold">{userName}</h2>
                    <p className="text-gray-500">Grade 6 Student</p>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-1">Email</h3>
                        <p>john.doe@example.com</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-1">School</h3>
                        <p>Lincoln Elementary</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-1">Interests</h3>
                        <p>Math, Science, Reading</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-1">Joined</h3>
                        <p>January 2024</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-2">About Me</h3>
                      <p className="text-gray-600">
                        Hello! I'm John and I love learning new things. My favorite subjects are math and science.
                        I enjoy solving puzzles and reading adventure books in my free time.
                      </p>
                    </div>
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

export default Profile;
