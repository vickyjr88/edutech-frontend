import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageWrapper component that adds appropriate padding when sidebar is visible
 * Use this to wrap page content that should respect the sidebar
 */
const PageWrapper = ({ children, className }: PageWrapperProps) => {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        "transition-all duration-300",
        user && "md:pl-64", // Add left padding when user is logged in (sidebar is visible)
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
