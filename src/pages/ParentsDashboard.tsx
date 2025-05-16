import { useState } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import ChildrenOverview from "@/components/parents/ChildrenOverview";
import ActivityFeed from "@/components/parents/ActivityFeed";
import RecommendedClasses from "@/components/parents/RecommendedClasses";
import FamilyCalendar from "@/components/parents/FamilyCalendar";

const ParentsDashboard = () => {
  const [parentName] = useState("Kate Johnson");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        <ParentDashboardHeader parentName={parentName} />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Row: Children Overview (Most Important) */}
            <ChildrenOverview />

            {/* Middle Row: Recommended Classes */}
            <RecommendedClasses />

            {/* Bottom Row: Activity Feed and Calendar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivityFeed />
              <FamilyCalendar />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ParentsDashboard;