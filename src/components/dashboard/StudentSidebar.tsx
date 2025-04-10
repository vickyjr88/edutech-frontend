
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Book, User, Settings, LogOut, MessageSquare, 
  Star, Sparkles, PieChart, Users, Target, Calendar, Award 
} from "lucide-react";

const StudentSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper function to determine if a link is active
  const isActive = (path: string) => currentPath === path;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-blue-100 shadow-md rounded-tr-xl rounded-br-xl mr-2 overflow-hidden">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
            alt="Kidato Logo" 
            className="h-10"
          />
          <Sparkles className="h-4 w-4 ml-1 text-yellow-400" />
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 mb-2">Main</h3>
        <Link 
          to="/student-dashboard" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/student-dashboard") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
          {isActive("/student-dashboard") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        
        <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Learning</h3>
        <Link 
          to="/courses" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/courses") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Book className="mr-3 h-5 w-5" />
          My Courses
          {isActive("/courses") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/learning-goals" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/learning-goals") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <PieChart className="mr-3 h-5 w-5" />
          Learning Goals
          {isActive("/learning-goals") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/challenges" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/challenges") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Target className="mr-3 h-5 w-5" />
          Quests & Challenges
          {isActive("/challenges") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/group-work" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/group-work") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Users className="mr-3 h-5 w-5" />
          Group Work
          {isActive("/group-work") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
          {!isActive("/group-work") && (
            <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </Link>
        
        <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Communication</h3>
        <Link 
          to="/messaging" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/messaging") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <MessageSquare className="mr-3 h-5 w-5" />
          Messages
          {isActive("/messaging") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/schedule" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/schedule") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Calendar className="mr-3 h-5 w-5" />
          Schedule
          {isActive("/schedule") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        
        <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">Account</h3>
        <Link 
          to="/profile" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/profile") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <User className="mr-3 h-5 w-5" />
          Profile
          {isActive("/profile") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/achievements" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/achievements") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Award className="mr-3 h-5 w-5" />
          Achievements
          {isActive("/achievements") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/settings" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/settings") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all`}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
          {isActive("/settings") && <Star className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
      </nav>
      
      <div className="p-4 border-t border-blue-100">
        <Link to="/">
          <Button variant="ghost" className="w-full flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default StudentSidebar;
