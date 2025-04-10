
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  CreditCard,
  GraduationCap,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ParentSidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/parents-dashboard" },
    { name: "Schedule", icon: <Calendar className="h-5 w-5" />, href: "/parents-schedule" },
    { name: "Courses", icon: <BookOpen className="h-5 w-5" />, href: "/parents-courses" },
    { name: "Teachers", icon: <Users className="h-5 w-5" />, href: "/teachers" },
    { name: "Messages", icon: <MessageSquare className="h-5 w-5" />, href: "/parents-messages" },
    { name: "Reports", icon: <FileText className="h-5 w-5" />, href: "/parents-reports" },
    { name: "Progress", icon: <GraduationCap className="h-5 w-5" />, href: "/parents-progress" },
    { name: "Billing", icon: <CreditCard className="h-5 w-5" />, href: "/parents-billing" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-kidato-blue text-white flex items-center justify-center text-lg font-bold">
          K
        </div>
        <span className="text-xl font-bold">Kidato Parent</span>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-50 text-kidato-blue font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <Button variant="ghost" className="w-full justify-start px-3 py-2 text-gray-700 hover:bg-gray-100">
          <Settings className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start px-3 py-2 text-gray-700 hover:bg-gray-100">
          <Bell className="h-5 w-5 mr-3" />
          <span>Notifications</span>
        </Button>
      </div>
    </aside>
  );
};

export default ParentSidebar;
