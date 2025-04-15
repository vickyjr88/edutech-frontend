
import { useState } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import ChildrenOverview from "@/components/parents/ChildrenOverview";
import ActivityFeed from "@/components/parents/ActivityFeed";
import AcademicProgress from "@/components/parents/AcademicProgress";
import AttendanceWidget from "@/components/parents/AttendanceWidget";
import ChildrenLiveStatus from "@/components/parents/ChildrenLiveStatus";
import QuickActions from "@/components/parents/QuickActions";
import EducationalGoals from "@/components/parents/EducationalGoals";
import FamilyCalendar from "@/components/parents/FamilyCalendar";

const ParentsDashboard = () => {
  const [parentName] = useState("Kate Johnson");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={parentName} />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Row: Quick Actions and Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <QuickActions />
              <FamilyCalendar />
            </div>

            {/* Middle Row: Live Status and Attendance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChildrenLiveStatus />
              <AttendanceWidget />
            </div>

            {/* Children Overview Section */}
            <ChildrenOverview />

            {/* Bottom Row: Combined Progress and Activity Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2">
                <AcademicProgress />
              </div>
              <div className="space-y-4">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ParentsDashboard;
