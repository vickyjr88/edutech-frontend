import ChildrenOverview from "@/components/parents/ChildrenOverview";
import ActivityFeed from "@/components/parents/ActivityFeed";
import RecommendedClasses from "@/components/parents/RecommendedClasses";
import FamilyCalendar from "@/components/parents/FamilyCalendar";
import ParentLayout from "@/components/parents/ParentLayout";
import MessagesInboxWidget from "@/components/parents/MessagesInboxWidget";

const ParentsDashboard = () => {
  return (
    <ParentLayout>
      {/* Top Row: Children Overview (Most Important) */}
      <ChildrenOverview />

      {/* Middle Row: Recommended Classes */}
      <RecommendedClasses />

      {/* Bottom Row: Activity Feed, Messages, and Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActivityFeed />
        <MessagesInboxWidget />
        <FamilyCalendar />
      </div>
    </ParentLayout>
  );
}

export default ParentsDashboard;