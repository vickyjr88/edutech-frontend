import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { notificationService } from "@/services/notificationService";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = ({ toggleSidebar }: { toggleSidebar?: () => void }) => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'teacher': return '/teacher-dashboard';
            case 'student': return '/student-dashboard';
            case 'parent': return '/parents-dashboard';
            case 'admin': return '/admin';
            default: return '/';
        }
    };

    const getProfileLink = () => {
        if (!user) return '/profile';
        switch (user.role) {
            case 'teacher': return '/teacher-profile-setup';
            case 'student': return '/student-profile';
            case 'parent': return '/parents-dashboard/profile';
            default: return '/profile';
        }
    };

    // Determine page title based on path
    const getPageTitle = () => {
        const p = location.pathname;
        if (p.includes("student-dashboard")) return "Student Dashboard";
        if (p.includes("teacher-dashboard")) return "Teacher Dashboard";
        if (p.includes("parents-dashboard")) return "Parent Dashboard";
        if (p.includes("admin")) return "Admin Dashboard";
        if (p.includes("notifications")) return "Notifications";
        if (p.includes("settings")) return "Settings";
        if (p.includes("profile")) return "Profile";
        if (p.includes("messages")) return "Messages";
        return "Dashboard";
    };

    useEffect(() => {
        if (!user) return;

        const fetchStats = async () => {
            try {
                const stats = await notificationService.getStats();
                setUnreadCount(stats.unreadCount);
            } catch (error) {
                console.error("Failed to fetch notification stats", error);
            }
        };

        fetchStats();

        // Simple polling for now
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, [user]);

    if (!user) return null;

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 z-30 sm:ml-64 transition-all duration-300">
            {/* Mobile Menu Button - Visible only on small screens if we had sidebar management here */}
            {/* Since Sidebar handles itself, we just need to align correctly */}
            {/* Assuming Sidebar is width 64 (16rem) when open. 
           In Layout, we need to adjust TopBar to respect Sidebar width. */}

            <div className="flex items-center">
                <h1 className="text-xl font-bold text-kidato-purple">{getPageTitle()}</h1>
            </div>

            <div className="flex items-center space-x-4">
                <Link to="/notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Bell className="h-6 w-6 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center space-x-2 cursor-pointer outline-none">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Hi, {user.fullName}! 👋</span>
                            <div className="h-8 w-8 rounded-full bg-kidato-purple text-white flex items-center justify-center font-semibold text-sm">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to={getDashboardLink()} className="w-full cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={getProfileLink()} className="w-full cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to="/settings" className="w-full cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default TopBar;
