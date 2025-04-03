
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormFileUpload } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Copy, Send, UploadCloud, Users, UserPlus, Mail, Share2, FileSpreadsheet, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WaitingListTab from "./WaitingListTab";
import EmailInviteTab from "./EmailInviteTab";
import FileUploadTab from "./FileUploadTab";
import ShareLinkTab from "./ShareLinkTab";

interface EnrollStudentsPageProps {
  classId?: string;
  className?: string;
}

const EnrollStudentsPage = ({ classId, className }: EnrollStudentsPageProps) => {
  const [activeTab, setActiveTab] = useState("waiting-list");
  const { toast } = useToast();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Enroll Students</h1>
          {className && (
            <p className="text-gray-500">
              Class: <span className="font-medium">{className}</span>
            </p>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="waiting-list" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Waiting List</span>
          </TabsTrigger>
          <TabsTrigger value="email-invite" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email Invite</span>
          </TabsTrigger>
          <TabsTrigger value="file-upload" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>File Upload</span>
          </TabsTrigger>
          <TabsTrigger value="share-link" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            <span>Share Link</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="waiting-list">
          <WaitingListTab classId={classId} />
        </TabsContent>

        <TabsContent value="email-invite">
          <EmailInviteTab classId={classId} className={className} />
        </TabsContent>

        <TabsContent value="file-upload">
          <FileUploadTab classId={classId} />
        </TabsContent>

        <TabsContent value="share-link">
          <ShareLinkTab classId={classId} className={className} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnrollStudentsPage;
