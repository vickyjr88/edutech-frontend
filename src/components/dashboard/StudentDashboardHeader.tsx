
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New assignment posted</p>
                  <p className="text-xs text-gray-500">Math Fundamentals • 15 mins ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Class reminder</p>
                  <p className="text-xs text-gray-500">Science Explorers • 1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center cursor-pointer">
                <Link to="/notifications">View all notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700 hidden md:inline">Welcome, {userName}</span>
            <div className="h-8 w-8 rounded-full bg-kidato-blue flex items-center justify-center text-white font-medium">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
