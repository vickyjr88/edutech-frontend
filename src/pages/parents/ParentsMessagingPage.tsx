
import { useState } from "react";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import ParentSidebar from "@/components/parents/ParentSidebar";
import MessagingPlatform from "@/components/messaging/MessagingPlatform";
import { useAuth } from "@/contexts/AuthContext";

const ParentsMessagingPage = () => {
    const { user } = useAuth();
    // Using user.fullName directly or fallback
    const userName = user?.fullName || "Parent";

    return (
        <div className="flex min-h-screen bg-gray-50">
            <ParentSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Nav */}
                <ParentDashboardHeader parentName={userName} />

                {/* Content */}
                <main className="p-6 flex-1">
                    <MessagingPlatform />
                </main>
            </div>
        </div>
    );
}

export default ParentsMessagingPage;
