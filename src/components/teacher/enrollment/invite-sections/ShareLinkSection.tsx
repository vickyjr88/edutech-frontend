
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Mail, Check, QrCode } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface ShareLinkSectionProps {
  classId?: string;
}

export const ShareLinkSection = ({ classId }: ShareLinkSectionProps) => {
  const { toast } = useToast();
  const [showCopied, setShowCopied] = useState(false);
  const [showCodeCopied, setShowCodeCopied] = useState(false);
  
  // Generate enrollment links (in a real app, these would be proper URLs)
  const enrollmentLink = `https://app.kidato.com/enroll/${classId || '123'}`;
  const enrollmentLinkWithCode = `${enrollmentLink}?code=CLASS${classId || '123'}`;
  
  const handleCopyLink = (link: string, isCode = false) => {
    navigator.clipboard.writeText(link);
    
    if (isCode) {
      setShowCodeCopied(true);
      setTimeout(() => setShowCodeCopied(false), 2000);
    } else {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
    
    toast({
      title: "Link copied",
      description: "The enrollment link has been copied to your clipboard.",
    });
  };

  const handleShareEmail = () => {
    // In a real app, this might open an email client or a modal
    const subject = `Join my class on Kidato`;
    const body = `I'd like to invite you to join my class on Kidato. Click the link below to enroll:\n\n${enrollmentLinkWithCode}`;
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    
    toast({
      title: "Email client opened",
      description: "Your default email client has been opened with the invitation.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Direct Enrollment Link</h3>
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
          <p className="text-xs text-gray-500 mt-1">
            Anyone with this link can join your class immediately.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Link with Class Code</h3>
          <div className="flex items-center gap-2">
            <Input
              value={enrollmentLinkWithCode}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopyLink(enrollmentLinkWithCode, true)}
              aria-label="Copy link with code"
            >
              {showCodeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This link includes a class code for tracking which students came from specific invitations.
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-sm font-medium mb-3">Share Options</h3>
        
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
            <QrCode className="h-5 w-5 text-blue-500" />
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
    </div>
  );
};
