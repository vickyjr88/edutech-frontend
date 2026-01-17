
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, Filter } from "lucide-react";
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

interface TeacherDashboardHeaderProps {
    userName: string;
}

export default function TeacherDashboardHeader({ userName }: TeacherDashboardHeaderProps) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Get the signed profile image if available
    // Use type assertion to bypass strict type checking for potential missing properties
    const profileImage = (user as any)?.signedProfileImage || (user as any)?.profileImage || (user as any)?.profilePicture;

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-10 w-full">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        Teacher Dashboard
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative hover:bg-gray-50">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="sr-only">Notifications</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 rounded-xl overflow-hidden border border-gray-100 shadow-lg">
                            <DropdownMenuLabel className="bg-gray-50 font-semibold px-4 py-3">Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="py-4 text-center text-sm text-gray-500">
                                No new notifications
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="justify-center cursor-pointer py-2">
                                <Link to="/teacher-dashboard/settings" className="text-kidato-purple font-medium text-sm">View all notifications</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center cursor-pointer gap-2">
                                <span className="text-sm font-medium text-gray-700 hidden md:inline">Hello, {userName}</span>
                                <Avatar className="h-9 w-9 border border-gray-200">
                                    {profileImage ? (
                                        <AvatarImage src={profileImage} alt={userName} />
                                    ) : (
                                        <AvatarFallback className="bg-kidato-purple text-white font-medium">
                                            {userName.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg border border-gray-100 mt-1">
                            <DropdownMenuLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to="/teacher-profile" className="cursor-pointer hover:bg-gray-50 flex items-center px-4 py-2">
                                    <User className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>Public Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/teacher-dashboard/settings" className="cursor-pointer hover:bg-gray-50 flex items-center px-4 py-2">
                                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer hover:bg-red-50 hover:text-red-600 flex items-center px-4 py-2 text-red-500"
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
