
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Book, User, Settings, LogOut } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentStatCards from "@/components/dashboard/StudentStatCards";
import CurrentClasses from "@/components/dashboard/CurrentClasses";
import UpcomingAssignments from "@/components/dashboard/UpcomingAssignments";
import LearningProgress from "@/components/dashboard/LearningProgress";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DailyChallenges from "@/components/dashboard/DailyChallenges";
import StudentLevel from "@/components/dashboard/StudentLevel";

const Dashboard = () => {
  const [userName] = useState("John Doe");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <Link to="/">
            <img 
              src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
              alt="Kidato Logo" 
              className="h-8"
            />
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link 
            to="/student-dashboard" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-kidato-light-blue text-kidato-blue"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link 
            to="/courses" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Book className="mr-3 h-5 w-5" />
            My Courses
          </Link>
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <User className="mr-3 h-5 w-5" />
            Profile
          </Link>
          <Link 
            to="/settings" 
            className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link to="/">
            <Button variant="ghost" className="w-full flex items-center justify-center">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-6">
          <StudentStatCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <CurrentClasses />
            </div>
            <div className="space-y-6">
              <StudentLevel />
              <UpcomingAssignments />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <DailyChallenges />
            <RecentActivity />
          </div>
          
          <div className="mt-6">
            <LearningProgress />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
