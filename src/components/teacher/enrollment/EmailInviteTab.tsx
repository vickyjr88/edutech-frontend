
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlignLeft, Mail, Plus, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EmailInviteTabProps {
  classId?: string;
  className?: string;
}

const EmailInviteTab = ({ classId, className }: EmailInviteTabProps) => {
  const { toast } = useToast();
  const [emailInputs, setEmailInputs] = useState<string[]>(['']);
  const [message, setMessage] = useState<string>(`Hi there,\n\nI'd like to invite you to join my class${className ? ` "${className}"` : ''}. You can register and enroll using the link below.\n\nLooking forward to seeing you in class!\n\nBest regards,`);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInputMode, setEmailInputMode] = useState<'single' | 'bulk'>('single');
  const [bulkEmails, setBulkEmails] = useState<string>('');

  const handleAddEmailInput = () => {
    setEmailInputs([...emailInputs, '']);
  };

  const handleRemoveEmailInput = (index: number) => {
    const newInputs = emailInputs.filter((_, i) => i !== index);
    if (newInputs.length === 0) {
      setEmailInputs(['']);
    } else {
      setEmailInputs(newInputs);
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newInputs = [...emailInputs];
    newInputs[index] = value;
    setEmailInputs(newInputs);
  };

  const validateEmails = (emails: string[]): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.filter(email => email.trim() !== '' && emailRegex.test(email.trim()));
    return validEmails.length > 0;
  };

  const extractBulkEmails = (text: string): string[] => {
    // Split by common separators (commas, semicolons, newlines) and filter out empty entries
    const emails = text
      .split(/[,;\n\s]+/)
      .map(e => e.trim())
      .filter(e => e.length > 0);
    return emails;
  };

  const handleSendInvites = () => {
    let emailsToSend: string[] = [];
    
    if (emailInputMode === 'single') {
      emailsToSend = emailInputs.filter(email => email.trim() !== '');
    } else {
      emailsToSend = extractBulkEmails(bulkEmails);
    }
    
    if (!validateEmails(emailsToSend)) {
      toast({
        title: "Invalid emails",
        description: "Please enter at least one valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Invitations sent",
        description: `Successfully sent invitations to ${emailsToSend.length} email${emailsToSend.length > 1 ? 's' : ''}.`,
      });
      
      if (emailInputMode === 'single') {
        setEmailInputs(['']);
      } else {
        setBulkEmails('');
      }
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Email Invitations</CardTitle>
            <CardDescription>
              Send personalized invitations to students via email
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Email Invite
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="single" value={emailInputMode} onValueChange={(value) => setEmailInputMode(value as 'single' | 'bulk')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Individual Emails</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Email Addresses</Label>
              {emailInputs.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {emailInputs.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveEmailInput(index)}
                      aria-label="Remove email"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddEmailInput}
                className="mt-2 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Another Email
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="bulk" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bulkEmails">Enter Multiple Emails</Label>
              <Textarea
                id="bulkEmails"
                placeholder="Enter emails separated by commas, spaces, or new lines"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                rows={5}
              />
              <p className="text-xs text-gray-500">
                Emails can be separated by commas, spaces, or each on a new line
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="message">Invitation Message</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs flex items-center gap-1"
              onClick={() => setMessage(`Hi there,\n\nI'd like to invite you to join my class${className ? ` "${className}"` : ''}. You can register and enroll using the link below.\n\nLooking forward to seeing you in class!\n\nBest regards,`)}
            >
              <AlignLeft className="h-3 w-3" />
              Reset to Default
            </Button>
          </div>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Enter your invitation message here..."
          />
          <p className="text-xs text-gray-500">
            A registration link will automatically be included at the end of your message
          </p>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button 
          onClick={handleSendInvites} 
          disabled={isLoading}
          className="ml-auto flex items-center gap-2"
        >
          {isLoading ? 'Sending...' : 'Send Invitations'}
          {isLoading ? <div className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailInviteTab;
