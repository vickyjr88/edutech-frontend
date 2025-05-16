import { ReactNode } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";

interface ParentLayoutProps {
  children: ReactNode;
  parentName?: string;
}

const ParentLayout = ({ 
  children, 
  parentName = "Kate Johnson" 
}: ParentLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Sidebar - fixed position with full height */}
      <aside className="fixed left-0 top-0 h-full w-64 z-40 hidden md:block">
        <ParentSidebar />
      </aside>
      
      {/* Main content area with left padding to account for sidebar */}
      <div className="flex-1 md:pl-64">
        {/* Header */}
        <ParentDashboardHeader parentName={parentName} />
        
        {/* Main content */}
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;