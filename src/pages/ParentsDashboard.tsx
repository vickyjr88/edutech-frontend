
import { useState } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import ChildrenOverview from "@/components/parents/ChildrenOverview";
import UpcomingEvents from "@/components/parents/UpcomingEvents";
import ActivityFeed from "@/components/parents/ActivityFeed";
import AcademicProgress from "@/components/parents/AcademicProgress";
import AttendanceWidget from "@/components/parents/AttendanceWidget";
import NotificationsPanel from "@/components/parents/NotificationsPanel";

const ParentsDashboard = () => {
  const [parentName] = useState("Sarah Johnson");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={parentName} />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <ChildrenOverview />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2 space-y-6">
                <ActivityFeed />
                <AcademicProgress />
              </div>
              <div className="space-y-6">
                <NotificationsPanel />
                <UpcomingEvents />
                <AttendanceWidget />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ParentsDashboard;
