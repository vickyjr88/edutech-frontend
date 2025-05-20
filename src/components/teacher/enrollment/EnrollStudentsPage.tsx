
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteStudentsTab from "./InviteStudentsTab";
import WaitingListTab from "./WaitingListTab";
import { useLocation } from "react-router-dom";

interface EnrollStudentsPageProps {
  classId?: string;
  className?: string;
}

const EnrollStudentsPage = ({ classId, className }: EnrollStudentsPageProps) => {
  const location = useLocation();
  
  // Check if there's a tab parameter in the URL
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    // Only accept "waiting" as a valid tab parameter
    return tabParam === 'waiting' ? tabParam : "invite";
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Update activeTab when the URL changes
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.search]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-2">
          {className ? `Manage Students for ${className}` : "Student Management"}
        </h2>
        <p className="text-gray-500">
          Invite students to join your classes and manage enrollments. For feedback and reviews, visit the Feedback Hub.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="invite">Invite Students</TabsTrigger>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invite">
          <InviteStudentsTab classId={classId} />
        </TabsContent>
        
        <TabsContent value="waiting">
          <WaitingListTab classId={classId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnrollStudentsPage;
