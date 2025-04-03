
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailInviteTab from "./EmailInviteTab";
import FileUploadTab from "./FileUploadTab";
import ShareLinkTab from "./ShareLinkTab";
import WaitingListTab from "./WaitingListTab";
import ReviewsTab from "./ReviewsTab";

interface EnrollStudentsPageProps {
  classId?: string;
  className?: string;
}

const EnrollStudentsPage = ({ classId, className }: EnrollStudentsPageProps) => {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-2">
          {className ? `Enroll Students for ${className}` : "Enroll Students"}
        </h2>
        <p className="text-gray-500">
          Invite students to join your classes and track their enrollment status.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="email">Email Invite</TabsTrigger>
          <TabsTrigger value="file">Bulk Upload</TabsTrigger>
          <TabsTrigger value="link">Share Link</TabsTrigger>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <EmailInviteTab classId={classId} />
        </TabsContent>
        
        <TabsContent value="file">
          <FileUploadTab classId={classId} />
        </TabsContent>
        
        <TabsContent value="link">
          <ShareLinkTab classId={classId} />
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
