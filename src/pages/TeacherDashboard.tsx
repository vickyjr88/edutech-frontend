
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, Users, Calendar, User, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeacherProfileForm from "@/components/teacher/TeacherProfileForm";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (profileData: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    console.log("Submitting profile data:", profileData);
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your teacher profile has been successfully updated.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <img 
            src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
            alt="Kidato Logo" 
            className="h-8"
          />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "profile" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="mr-3 h-5 w-5" />
            Complete Profile
          </button>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "dashboard" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("classes")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "classes" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            My Classes
          </button>
          <button 
            onClick={() => setActiveTab("students")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "students" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="mr-3 h-5 w-5" />
            Students
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "schedule" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full text-left ${
              activeTab === "settings" 
                ? "bg-kidato-light-blue text-kidato-blue" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center"
            onClick={() => navigate("/")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === "profile" ? "Complete Your Profile" : 
               activeTab === "dashboard" ? "Dashboard" :
               activeTab === "classes" ? "My Classes" :
               activeTab === "students" ? "Students" :
               activeTab === "schedule" ? "Schedule" : "Settings"}
            </h1>
            <div className="flex md:hidden">
              <Button variant="outline" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "profile" && (
            <div className="max-w-3xl mx-auto">
              <TeacherProfileForm
                onSubmit={handleProfileSubmit}
                onCancel={() => navigate("/dashboard")}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, Teacher!</CardTitle>
                  <CardDescription>
                    Complete your profile to start accepting students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                    <p className="font-medium">Your profile is incomplete</p>
                    <p className="text-sm mt-1">Complete your teacher profile to be visible to students.</p>
                    <Button 
                      className="mt-3 bg-amber-600 hover:bg-amber-700"
                      onClick={() => setActiveTab("profile")}
                    >
                      Complete Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Active classes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Enrolled students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Teaching hours</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {(activeTab === "classes" || activeTab === "students" || activeTab === "schedule" || activeTab === "settings") && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Complete your profile first</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to complete your teacher profile before accessing this section
                </p>
                <Button 
                  className="mt-4 bg-kidato-blue hover:bg-kidato-dark-blue"
                  onClick={() => setActiveTab("profile")}
                >
                  Go to Profile
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
