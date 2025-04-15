
import { useState } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import ChildrenOverview from "@/components/parents/ChildrenOverview";
import ActivityFeed from "@/components/parents/ActivityFeed";
import AcademicProgress from "@/components/parents/AcademicProgress";
import AttendanceWidget from "@/components/parents/AttendanceWidget";
import ChildrenLiveStatus from "@/components/parents/ChildrenLiveStatus";
import ImportantReminders from "@/components/parents/ImportantReminders";

const ParentsDashboard = () => {
  const [parentName] = useState("Kate Johnson");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={parentName} />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Row 1: Children live classes status and attendance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ChildrenLiveStatus />
              <AttendanceWidget />
            </div>
            
            {/* Row 2: Important reminders and recent activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ImportantReminders />
              <ActivityFeed />
            </div>
            
            {/* Children Overview Row */}
            <div className="mb-6">
              <ChildrenOverview />
            </div>
            
            {/* Academic Progress Row */}
            <div className="mt-6">
              <AcademicProgress />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ParentsDashboard;
