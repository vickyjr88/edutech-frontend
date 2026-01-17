
import { useState } from "react";
import MessagingPlatform from "@/components/messaging/MessagingPlatform";
import { useAuth } from "@/contexts/AuthContext";

const ParentMessaging = () => {
    const { user } = useAuth();
    const [userName] = useState(user?.fullName || "Parent");

    return (
        <div className="min-h-screen bg-gray-50 transition-all duration-300">
            <div className="flex-1 flex flex-col h-full">
                <main className="p-6 flex-1 h-full">
                    <MessagingPlatform />
                </main>
            </div>
        </div>
    );
}

export default ParentMessaging;
