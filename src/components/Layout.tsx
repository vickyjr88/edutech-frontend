import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const shouldShowSidebar = () => {
    if (!user) return false;

    const p = location.pathname;

    // Explicitly allow sidebar on these path prefixes
    if (p.startsWith('/dashboard')) return true;
    if (p.startsWith('/admin')) return true;
    if (p.startsWith('/settings')) return true;

    // Teacher Dashboard Routes
    if (p.startsWith('/teacher-dashboard') ||
      p.startsWith('/teacher-earnings') ||
      p.startsWith('/teacher-offerings') ||
      p.startsWith('/teacher-availability') ||
      p.startsWith('/teacher-students') ||
      p.startsWith('/teacher-resources') ||
      p.startsWith('/teacher-profile') ||
      p.startsWith('/teacher-class')) return true;

    // Parent Dashboard Routes
    if (p.startsWith('/parents-dashboard') ||
      p.startsWith('/parents/') ||
      p.startsWith('/parent-profile')) return true;

    // Student Dashboard Routes
    if (p.startsWith('/student')) return true;

    return false;
  };

  const showSidebar = shouldShowSidebar();

  return (
    <>
      {showSidebar && <UserSidebar />}
      {children}
    </>
  );
};

export default Layout;
