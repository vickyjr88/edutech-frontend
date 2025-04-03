
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, FileSpreadsheet, Share2 } from "lucide-react";

// Import content from existing tabs
import { EmailInviteSection } from "./invite-sections/EmailInviteSection";
import { FileUploadSection } from "./invite-sections/FileUploadSection";
import { ShareLinkSection } from "./invite-sections/ShareLinkSection";

interface InviteStudentsTabProps {
  classId?: string;
}

const InviteStudentsTab = ({ classId }: InviteStudentsTabProps) => {
  const [inviteMethod, setInviteMethod] = useState("email");

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Invite Students</CardTitle>
            <CardDescription>
              Choose from multiple ways to invite students to your class
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Invite Methods
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="email" value={inviteMethod} onValueChange={setInviteMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span>Email Invite</span>
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Bulk Upload</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Link</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="email">
              <EmailInviteSection classId={classId} />
            </TabsContent>
            
            <TabsContent value="file">
              <FileUploadSection classId={classId} />
            </TabsContent>
            
            <TabsContent value="link">
              <ShareLinkSection classId={classId} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InviteStudentsTab;
