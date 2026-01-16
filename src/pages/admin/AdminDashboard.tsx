import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  LogOut,
  Menu,
  X,
  Home,
  List,
  Share2,
  BookOpen,
  Tag,
  Tags,
  Users,
  Mail,
  GraduationCap,
  UserCircle,
  UsersRound,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";

/**
 * Admin Dashboard Layout
 * Provides navigation and layout for all admin CMS pages
 */
const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: location.pathname === "/admin" || location.pathname === "/admin/dashboard",
    },
    {
      name: "Pages",
      href: "/admin/pages",
      icon: FileText,
      current: location.pathname.startsWith("/admin/pages"),
    },
    {
      name: "Menus",
      href: "/admin/menus",
      icon: List,
      current: location.pathname.startsWith("/admin/menus"),
    },
    {
      name: "Social Links",
      href: "/admin/social-links",
      icon: Share2,
      current: location.pathname.startsWith("/admin/social-links"),
    },
    {
      name: "Blog Posts",
      href: "/admin/blog/posts",
      icon: BookOpen,
      current: location.pathname.startsWith("/admin/blog/posts"),
    },
    {
      name: "Categories",
      href: "/admin/blog/categories",
      icon: Tag,
      current: location.pathname.startsWith("/admin/blog/categories"),
    },
    {
      name: "Tags",
      href: "/admin/blog/tags",
      icon: Tags,
      current: location.pathname.startsWith("/admin/blog/tags"),
    },
    {
      name: "Authors",
      href: "/admin/blog/authors",
      icon: Users,
      current: location.pathname.startsWith("/admin/blog/authors"),
    },
    {
      name: "Inquiries",
      href: "/admin/inquiries",
      icon: Mail,
      current: location.pathname.startsWith("/admin/inquiries"),
    },
    {
      name: "Newsletter Subscribers",
      href: "/admin/newsletter-subscribers",
      icon: Users,
      current: location.pathname.startsWith("/admin/newsletter-subscribers"),
    },
    {
      name: "Teachers",
      href: "/admin/teachers",
      icon: GraduationCap,
      current: location.pathname === "/admin/teachers" && !location.search,
    },
    {
      name: "Teacher Approvals",
      href: "/admin/teacher-approvals",
      icon: GraduationCap,
      current: location.pathname.startsWith("/admin/teacher-approvals"),
    },
    {
      name: "Classes",
      href: "/admin/classes",
      icon: BookOpen,
      current: location.pathname.startsWith("/admin/classes"),
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: List,
      current: location.pathname.startsWith("/admin/bookings"),
    },
    {
      name: "Students",
      href: "/admin/students",
      icon: UserCircle,
      current: location.pathname.startsWith("/admin/students"),
    },
    {
      name: "Parents",
      href: "/admin/parents",
      icon: UsersRound,
      current: location.pathname.startsWith("/admin/parents"),
    },
    {
      name: "Support Tickets",
      href: "/admin/tickets",
      icon: MessageSquare,
      current: location.pathname.startsWith("/admin/tickets"),
    },
    {
      name: "Messages",
      href: "/admin/messaging",
      icon: MessageSquare,
      current: location.pathname.startsWith("/admin/messaging"),
    },
    {
      name: "All Users",
      href: "/admin/users",
      icon: Users,
      current: location.pathname.startsWith("/admin/users"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              Kidato CMS
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${item.current
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-200 ease-in-out ${sidebarOpen ? "lg:pl-64" : ""
          }`}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <Link to="/admin/pages/new">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Page
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
