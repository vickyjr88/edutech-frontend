import { Bell, MessageSquare, Search, Calendar, Video, HelpCircle, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ParentDashboardHeaderProps {
  parentName: string;
}

const ParentDashboardHeader = ({ parentName }: ParentDashboardHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const initials = parentName
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Check if there are any live classes happening now
  const liveClassesCount = 1; // Mock data - in a real app this would be calculated

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
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
    <header className="bg-white border-b border-gray-200 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="md:hidden">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <span className="sr-only">Open sidebar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center bg-gray-50 rounded-md px-3 py-1.5 w-64">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent border-none focus:outline-none text-sm flex-1"
          />
        </div>

        {liveClassesCount > 0 && (
          <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white ml-2">
            <Video className="h-4 w-4 mr-1" />
            <span>Live Classes</span>
            <Badge variant="outline" className="ml-1 bg-white text-red-500 border-0">{liveClassesCount}</Badge>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-blue-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon" className="text-blue-600">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-blue-600">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 ml-2 cursor-pointer">
              <span className="hidden sm:inline text-sm font-medium">{parentName}</span>
              <Avatar className="h-9 w-9 border-2 border-blue-100">
                <AvatarFallback className="bg-kidato-purple text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ParentDashboardHeader;