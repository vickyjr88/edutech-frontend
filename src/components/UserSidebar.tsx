import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  DollarSign,
  Users,
  Award,
  Bell,
  MessageSquare,
  FileText,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[];
}

const UserSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Role-specific navigation items
  const getNavigationItems = (): SidebarItem[] => {
    const commonItems: SidebarItem[] = [
      { name: "Dashboard", href: getDashboardLink(), icon: LayoutDashboard },
      { name: "Profile", href: getProfileLink(), icon: User },
    ];

    const roleSpecificItems: Record<string, SidebarItem[]> = {
      teacher: [
        { name: "My Offerings", href: "/teacher-offerings", icon: BookOpen },
        { name: "Bookings", href: "/teacher/bookings", icon: Calendar },
        { name: "Availability", href: "/teacher-availability", icon: Calendar },
        { name: "Earnings", href: "/teacher-earnings", icon: DollarSign },
        { name: "Students", href: "/teacher-students", icon: Users },
        { name: "Resources", href: "/teacher-resources", icon: FileText },
        { name: "Messages", href: "/teacher/messages", icon: MessageSquare },
      ],
      parent: [
        { name: "My Children", href: "/parents-dashboard/children", icon: Users },
        { name: "Classes", href: "/parents-dashboard/courses", icon: BookOpen },
        { name: "Billing", href: "/parents-dashboard/billing", icon: DollarSign },
        { name: "Schedule", href: "/parents-dashboard/schedule", icon: Calendar },
        { name: "Messages", href: "/parent/messages", icon: MessageSquare },
      ],
      student: [
        { name: "My Classes", href: "/student/classes", icon: BookOpen },
        { name: "Schedule", href: "/student/schedule", icon: Calendar },
        { name: "Achievements", href: "/student/achievements", icon: Award },
        { name: "Messages", href: "/student/messages", icon: MessageSquare },
      ],
      admin: [
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Teachers", href: "/admin/teachers", icon: User },
        { name: "Classes", href: "/admin/classes", icon: BookOpen },
        { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
        { name: "Reports & Exports", href: "/admin/reports", icon: FileText },
      ],
    };

    const items = [
      ...commonItems,
      ...(roleSpecificItems[user.role] || []),
    ];

    return items;
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case 'teacher':
        return '/teacher-dashboard';
      case 'student':
        return '/student-dashboard';
      case 'parent':
        return '/parents-dashboard';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    switch (user.role) {
      case 'teacher':
        return '/teacher-profile-setup';
      case 'student':
        return '/student-profile';
      case 'parent':
        return '/parents-dashboard/profile';
      default:
        return '/profile';
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>

      <div className="flex flex-col h-full">
        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-kidato-purple text-white flex items-center justify-center font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href ||
                location.pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-kidato-purple text-white"
                      : "text-gray-700 hover:bg-gray-100",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-2 space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? "Home" : undefined}
          >
            <Home className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Home</span>}
          </Link>

          <Link
            to="/settings"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Settings</span>}
          </Link>

          <button
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-red-600 hover:bg-red-50",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
