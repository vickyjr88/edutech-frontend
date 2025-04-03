
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Mail, LinkIcon, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShareLinkTabProps {
  classId?: string;
  className?: string;
}

const ShareLinkTab = ({ classId, className }: ShareLinkTabProps) => {
  const { toast } = useToast();
  const [showCopied, setShowCopied] = useState(false);
  
  // Generate enrollment links (in a real app, these would be proper URLs)
  const enrollmentLink = `https://app.kidato.com/enroll/${classId || '123'}`;
  const enrollmentLinkWithCode = `${enrollmentLink}?code=CLASS${classId || '123'}`;
  
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    toast({
      title: "Link copied",
      description: "The enrollment link has been copied to your clipboard.",
    });
  };

  const handleShareEmail = () => {
    // In a real app, this might open an email client or a modal
    const subject = `Join my class${className ? ` "${className}"` : ''} on Kidato`;
    const body = `I'd like to invite you to join my class${className ? ` "${className}"` : ''} on Kidato. Click the link below to enroll:\n\n${enrollmentLinkWithCode}`;
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    toast({
      title: "Email client opened",
      description: "Your default email client has been opened with the invitation.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Share Enrollment Link</CardTitle>
            <CardDescription>
              Create and share direct enrollment links with your students
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            Shareable Link
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Tabs defaultValue="direct">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direct">Direct Link</TabsTrigger>
              <TabsTrigger value="code">Link with Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct" className="pt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Direct Enrollment Link</h3>
                <p className="text-xs text-gray-500">
                  Anyone with this link can join your class immediately without requiring a code.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={enrollmentLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(enrollmentLink)}
                    aria-label="Copy link"
                  >
                    {showCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="pt-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Link with Enrollment Code</h3>
                <p className="text-xs text-gray-500">
                  This link includes a class code, making it easier to track which students came from specific invitations.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={enrollmentLinkWithCode}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(enrollmentLinkWithCode)}
                    aria-label="Copy link with code"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Share Options</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-dashed">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <Copy className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-sm">Copy & Paste</h4>
                <p className="text-xs text-gray-500 mb-4">
                  Copy the link and share it via your preferred method
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleCopyLink(enrollmentLinkWithCode)}
                >
                  Copy Link
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-dashed">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                  <Mail className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-medium text-sm">Email</h4>
                <p className="text-xs text-gray-500 mb-4">
                  Open your email client with a pre-filled invitation
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleShareEmail}
                >
                  Share via Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <LinkIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">QR Code Coming Soon</h3>
              <p className="text-xs text-blue-700">
                We're working on adding QR codes for easy enrollment during in-person sessions.
                Stay tuned for this feature in the next update!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShareLinkTab;
