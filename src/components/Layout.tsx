import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

import TopBar from "./TopBar";
import { cn } from "@/lib/utils";

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const shouldShowSidebar = () => {
    if (!user) return false;

    const p = location.pathname;

    // Explicitly allow sidebar on these path prefixes
    if (p.startsWith('/dashboard')) return true;

    if (p.startsWith('/settings')) return true;

    // Teacher Dashboard Routes
    if (p.startsWith('/teacher-dashboard') ||
      p.startsWith('/teacher-earnings') ||
      p.startsWith('/teacher-offerings') ||
      p.startsWith('/teacher-availability') ||
      p.startsWith('/teacher-students') ||
      p.startsWith('/teacher-resources') ||
      p.startsWith('/teacher-profile') ||
      p.startsWith('/teacher/messages') ||
      p.startsWith('/teacher/bookings') ||
      p.startsWith('/teacher/custom-requests') ||
      p.startsWith('/teacher-class')) return true;

    // Parent Dashboard Routes
    if (p.startsWith('/parents-dashboard') ||
      p.startsWith('/parents/') ||
      p.startsWith('/parent/') ||
      p.startsWith('/parent-profile')) return true;

    // Student Dashboard Routes
    if (p.startsWith('/student')) return true;

    // Notifications
    if (p.startsWith('/notifications')) return true;

    return false;
  };

  const showSidebar = shouldShowSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar && <UserSidebar />}
      {showSidebar && <TopBar />}

      <main className={cn(
        "transition-all duration-300",
        showSidebar ? "sm:ml-64 pt-16" : ""
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
