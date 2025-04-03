
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteStudentsTab from "./InviteStudentsTab";
import WaitingListTab from "./WaitingListTab";
import ReviewsTab from "./ReviewsTab";

interface EnrollStudentsPageProps {
  classId?: string;
  className?: string;
}

const EnrollStudentsPage = ({ classId, className }: EnrollStudentsPageProps) => {
  const [activeTab, setActiveTab] = useState("invite");

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-2">
          {className ? `Manage Students for ${className}` : "Student Management"}
        </h2>
        <p className="text-gray-500">
          Invite students to join your classes, manage enrollments, and collect feedback.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="invite">Invite Students</TabsTrigger>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invite">
          <InviteStudentsTab classId={classId} />
        </TabsContent>
        
        <TabsContent value="waiting">
          <WaitingListTab classId={classId} />
        </TabsContent>
        
        <TabsContent value="reviews">
          <ReviewsTab classId={classId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnrollStudentsPage;
