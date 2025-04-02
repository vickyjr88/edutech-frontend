
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Book, User, Settings, LogOut } from "lucide-react";

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
            to="/dashboard" 
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
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-700">Welcome, {userName}</span>
              <div className="h-8 w-8 rounded-full bg-kidato-blue flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to Kidato!</h2>
            <p className="text-gray-600 mb-4">
              Your educational journey begins here. This is a placeholder dashboard. 
              In a full implementation, you would see your courses, progress, and recommendations.
            </p>
            <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
              Explore Courses
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Upcoming Classes</h3>
              <p className="text-gray-500 text-sm">No upcoming classes yet.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Your Progress</h3>
              <p className="text-gray-500 text-sm">Join a course to track your progress.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Notifications</h3>
              <p className="text-gray-500 text-sm">No new notifications.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
