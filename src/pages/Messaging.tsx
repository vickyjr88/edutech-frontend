
import { useState } from "react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import MessagingPlatform from "@/components/messaging/MessagingPlatform";

const Messaging = () => {
  const [userName] = useState("John Doe");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-6">
          <MessagingPlatform />
        </main>
      </div>
    </div>
  );
}

export default Messaging;
