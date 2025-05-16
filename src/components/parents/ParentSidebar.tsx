import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, BookOpen, Users, MessageSquare, FileText, 
  CreditCard, GraduationCap, LogOut,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const ParentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  const navItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/parents-dashboard" },
    { name: "Schedule", icon: <Calendar className="h-5 w-5" />, href: "/parents-schedule" },
    { name: "Courses", icon: <BookOpen className="h-5 w-5" />, href: "/parents-courses" },
    { name: "Teachers", icon: <Users className="h-5 w-5" />, href: "/parents-teachers" },
    { name: "Messages", icon: <MessageSquare className="h-5 w-5" />, href: "/parents-messages" },
    { name: "Reports", icon: <FileText className="h-5 w-5" />, href: "/parents-reports" },
    { name: "Progress", icon: <GraduationCap className="h-5 w-5" />, href: "/parents-progress" },
    { name: "Billing", icon: <CreditCard className="h-5 w-5" />, href: "/parents-billing" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      // Navigate to login page
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-screen min-h-full flex flex-col bg-white border-r border-blue-100 shadow-md">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
            alt="Kidato Logo" 
            className="h-10"
          />
        </Link>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl ${
              isActive(item.href)
                ? "bg-gradient-to-r from-kidato-light-blue to-blue-100 text-kidato-blue shadow-sm"
                : "text-gray-700 hover:bg-blue-50"
            } transition-all`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-blue-100 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default ParentSidebar;