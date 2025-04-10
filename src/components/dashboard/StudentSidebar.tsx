
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Book, MessageSquare, User, LogOut, 
  Sparkles, Target, Users, Calendar, Award,
  BellDot
} from "lucide-react";

const StudentSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper function to determine if a link is active
  const isActive = (path: string) => currentPath === path;

  // Mock notification states
  const hasNewMatches = true;
  const hasGroupInvites = true;
  const hasUnreadMessages = false;

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
        <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 mb-2">MAIN</h3>
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
          {isActive("/student-dashboard") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        
        <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">LEARNING</h3>
        <Link 
          to="/courses" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/courses") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all relative`}
        >
          <Book className="mr-3 h-5 w-5" />
          My Courses
          {isActive("/courses") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
          {!isActive("/courses") && hasNewMatches && (
            <span className="absolute right-3 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
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
          {isActive("/challenges") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        <Link 
          to="/group-work" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/group-work") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all relative`}
        >
          <Users className="mr-3 h-5 w-5" />
          Group Work
          {isActive("/group-work") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
          {!isActive("/group-work") && hasGroupInvites && (
            <div className="ml-auto flex items-center">
              <BellDot className="h-4 w-4 text-blue-600" />
            </div>
          )}
        </Link>
        
        {/* Moved Achievements from Account section to here */}
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
          {isActive("/achievements") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        
        <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">COMMUNICATION</h3>
        <Link 
          to="/messaging" 
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
            isActive("/messaging") 
              ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm" 
              : "text-gray-700 hover:bg-blue-50"
          } transition-all relative`}
        >
          <MessageSquare className="mr-3 h-5 w-5" />
          Messages
          {isActive("/messaging") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
          {!isActive("/messaging") && hasUnreadMessages && (
            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              3
            </span>
          )}
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
          {isActive("/schedule") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
        </Link>
        
        <h3 className="px-4 mt-5 text-xs font-semibold uppercase text-gray-500 mb-2">ACCOUNT</h3>
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
          {isActive("/profile") && <Sparkles className="ml-auto h-4 w-4 text-yellow-400" />}
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
