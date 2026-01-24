
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { MessageSquare } from "lucide-react";

const ParentsMessages = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />
      
      <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-50 to-white">
        {/* No ParentDashboardHeader or Messages title here */}
        <main className="flex-1 flex flex-col">
          <div className="max-w-6xl mx-auto w-full h-full">
            {/* Messaging platform content goes here */}
            {/* Example: <MessagingPlatform /> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsMessages;
