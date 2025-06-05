import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlignLeft, Plus, Send, X, MessageCircle } from "lucide-react";
import { smsService, WhatsAppInviteRequest } from "@/integrations/api";

interface WhatsAppInviteSectionProps {
  classId?: string;
}

interface StudentContact {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const WhatsAppInviteSection = ({ classId }: WhatsAppInviteSectionProps) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<StudentContact[]>([
    { firstName: "", lastName: "", phoneNumber: "" }
  ]);
  const [message, setMessage] = useState<string>(
    `Hi there!\n\nI'd like to invite you to join my class. You can register and enroll using the link below.\n\nLooking forward to seeing you in class!\n\nBest regards,`
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAddContact = () => {
    setContacts([...contacts, { firstName: "", lastName: "", phoneNumber: "" }]);
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    if (newContacts.length === 0) {
      setContacts([{ firstName: "", lastName: "", phoneNumber: "" }]);
    } else {
      setContacts(newContacts);
    }
  };

  const handleContactChange = (index: number, field: keyof StudentContact, value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Basic phone number validation - should start with + and contain only digits, spaces, hyphens, and parentheses
    const phoneRegex = /^\+[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.trim());
  };

  const validateContacts = (contacts: StudentContact[]): boolean => {
    const validContacts = contacts.filter(contact => 
      contact.firstName.trim() !== '' && 
      contact.lastName.trim() !== '' && 
      validatePhoneNumber(contact.phoneNumber)
    );
    return validContacts.length > 0;
  };

  const handleSendInvites = async () => {
    if (!classId) {
      toast({
        title: "Error",
        description: "Class ID is required to send invitations.",
        variant: "destructive"
      });
      return;
    }

    const validContacts = contacts.filter(contact => 
      contact.firstName.trim() !== '' && 
      contact.lastName.trim() !== '' && 
      validatePhoneNumber(contact.phoneNumber)
    );

    if (!validateContacts(contacts)) {
      toast({
        title: "Invalid contact information",
        description: "Please enter valid names and phone numbers (must start with + and country code).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const requests: WhatsAppInviteRequest[] = validContacts.map(contact => ({
        classId,
        phoneNumber: contact.phoneNumber,
        firstName: contact.firstName,
        lastName: contact.lastName,
        customMessage: message
      }));

      // Send all invites
      const results = await Promise.allSettled(
        requests.map(request => smsService.sendWhatsAppInvite(request))
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.length - successful;

      if (successful > 0) {
        toast({
          title: "WhatsApp invitations sent",
          description: `Successfully sent ${successful} invitation${successful > 1 ? 's' : ''}${failed > 0 ? ` (${failed} failed)` : ''}.`,
        });
        
        // Reset form on success
        setContacts([{ firstName: "", lastName: "", phoneNumber: "" }]);
        setMessage(`Hi there!\n\nI'd like to invite you to join my class. You can register and enroll using the link below.\n\nLooking forward to seeing you in class!\n\nBest regards,`);
      } else {
        toast({
          title: "Failed to send invitations",
          description: "All invitations failed to send. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error sending invitations",
        description: "An error occurred while sending WhatsApp invitations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <Label className="text-sm font-medium">Student Contacts</Label>
        </div>
        
        {contacts.map((contact, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Contact {index + 1}</span>
              {contacts.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveContact(index)}
                  aria-label="Remove contact"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`firstName-${index}`} className="text-xs">First Name</Label>
                <Input
                  id={`firstName-${index}`}
                  placeholder="John"
                  value={contact.firstName}
                  onChange={(e) => handleContactChange(index, 'firstName', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`lastName-${index}`} className="text-xs">Last Name</Label>
                <Input
                  id={`lastName-${index}`}
                  placeholder="Doe"
                  value={contact.lastName}
                  onChange={(e) => handleContactChange(index, 'lastName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor={`phone-${index}`} className="text-xs">Phone Number</Label>
              <Input
                id={`phone-${index}`}
                placeholder="+1234567890"
                value={contact.phoneNumber}
                onChange={(e) => handleContactChange(index, 'phoneNumber', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Include country code (e.g., +1 for US, +44 for UK)
              </p>
            </div>
          </div>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddContact}
          className="mt-2 flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add Another Contact
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">WhatsApp Message</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs flex items-center gap-1"
            onClick={() => setMessage(`Hi there!\n\nI'd like to invite you to join my class. You can register and enroll using the link below.\n\nLooking forward to seeing you in class!\n\nBest regards,`)}
          >
            <AlignLeft className="h-3 w-3" />
            Reset to Default
          </Button>
        </div>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Enter your WhatsApp message here..."
        />
        <p className="text-xs text-gray-500">
          A registration link will automatically be included at the end of your message
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSendInvites} 
          disabled={isLoading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Sending...' : 'Send WhatsApp Invitations'}
          {isLoading ? <div className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};