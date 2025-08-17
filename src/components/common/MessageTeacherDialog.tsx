import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Assuming useToast is available globally or imported

interface MessageTeacherDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teacherName: string;
  teacherId: string; // Assuming we need teacherId to send message
}

export const MessageTeacherDialog: React.FC<MessageTeacherDialogProps> = ({
  isOpen,
  onOpenChange,
  teacherName,
  teacherId,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    // Here you would implement the actual API call to send the message
    console.log(`Sending message to ${teacherName} (ID: ${teacherId}):`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Message Sent!',
        description: `Your message to ${teacherName} has been sent.`,
        variant: 'default',
      });
      onOpenChange(false); // Close dialog on success
      setSubject(''); // Clear form
      setMessage('');
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to {teacherName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Enter message subject"
              className="w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="w-full min-h-[150px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendMessage}>
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};