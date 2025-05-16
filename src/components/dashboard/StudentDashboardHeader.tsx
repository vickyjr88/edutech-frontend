
import { Link, useNavigate } from "react-router-dom";
import { Bell, Sparkles, Star, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StudentDashboardHeaderProps {
  userName: string;
}

export default function StudentDashboardHeader({ userName }: StudentDashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Get the signed profile image if available
  const profileImage = user?.signedProfileImage || user?.profileImage || user?.profilePicture;
  
  return (
    <header className="bg-white shadow-sm rounded-b-xl">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Star className="h-6 w-6 text-yellow-400 mr-2" />
          <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <Sparkles className="h-5 w-5 text-yellow-400 ml-2 animate-pulse" />
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50">
                <Bell className="h-5 w-5 text-blue-500" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl overflow-hidden border-2 border-blue-100">
              <DropdownMenuLabel className="bg-blue-50 font-bold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New assignment posted 📝</p>
                  <p className="text-xs text-gray-500">Math Fundamentals • 15 mins ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Class reminder ⏰</p>
                  <p className="text-xs text-gray-500">Science Explorers • 1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center cursor-pointer">
                <Link to="/notifications" className="text-blue-500 font-medium">View all notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <span className="mr-2 text-sm font-medium text-gray-700 hidden md:inline">Hi, {userName}! 👋</span>
                <Avatar className="h-9 w-9 shadow-md">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-kidato-blue to-purple-500 text-white font-bold">
                      {userName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl overflow-hidden border-2 border-blue-100">
              <DropdownMenuLabel className="bg-blue-50 font-bold">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-red-50 hover:text-red-500 focus:bg-red-50 focus:text-red-500 flex items-center"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
