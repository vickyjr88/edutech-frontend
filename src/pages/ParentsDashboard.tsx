import ChildrenOverview from "@/components/parents/ChildrenOverview";
import ActivityFeed from "@/components/parents/ActivityFeed";
import RecommendedClasses from "@/components/parents/RecommendedClasses";
import FamilyCalendar from "@/components/parents/FamilyCalendar";
import ParentLayout from "@/components/parents/ParentLayout";

const ParentsDashboard = () => {
  return (
    <ParentLayout>
      {/* Top Row: Children Overview (Most Important) */}
      <ChildrenOverview />

      {/* Middle Row: Recommended Classes */}
      <RecommendedClasses />

      {/* Bottom Row: Activity Feed and Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityFeed />
        <FamilyCalendar />
      </div>
    </ParentLayout>
  );
}

export default ParentsDashboard;