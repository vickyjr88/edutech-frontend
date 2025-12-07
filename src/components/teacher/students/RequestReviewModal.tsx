import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  School, Star, User, Mail, MessageCircle,
  Users, Send, Copy, Edit, Info, Sparkles, Download as DownloadIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { teacherService, TeacherProfile } from "@/integrations/api/services/teacher.service";
import { useAuth } from "@/contexts/AuthContext";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  parent?: {
    name: string;
    email: string;
  };
}

interface TeacherParams {
  id: string;
  name: string;
  email: string;
  school?: string;
  avatar?: string;
}

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'student' | 'parent' | 'teacher';
  student?: Student;
  isBulkRequest?: boolean;
}

const RequestReviewModal: React.FC<RequestReviewModalProps> = ({
  isOpen,
  onClose,
  targetType,
  student,
  isBulkRequest = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();

  // State for form fields
  const [messageMethod, setMessageMethod] = useState<'email' | 'link'>('email');
  const [useAITemplate, setUseAITemplate] = useState(true);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [school, setSchool] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingTemplate, setGeneratingTemplate] = useState(false);

  // State for real data
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<TeacherParams[]>([]);
  const [currentTeacherProfile, setCurrentTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [reviewLink, setReviewLink] = useState("");

  // Fetch Teacher Profile and Data
  useEffect(() => {
    if (!isOpen || !user) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        // 1. Get Teacher Profile
        const profileResponse = await teacherService.getProfileByUserId(user.id);
        if (profileResponse.data) {
          setCurrentTeacherProfile(profileResponse.data);
          // Set review link based on teacher profile ID
          // Using a placeholder URL structure as actual frontend route might differ
          setReviewLink(`https://kidato.com/review/${profileResponse.data.id}`);

          // 2. Fetch Students if needed (for Student or Parent requests)
          if (targetType === 'student' || targetType === 'parent') {
            // Use getTeacherStudents to get list of students. 
            const studentsResp = await teacherService.getTeacherStudents(profileResponse.data.id);
            if (studentsResp.data) {
              const mappedStudents: Student[] = studentsResp.data.map((s: any) => ({
                id: s._id || s.id,
                name: s.name || s.fullName || `${s.firstName || ''} ${s.lastName || ''}`.trim() || "Student",
                email: s.email || "",
                avatar: s.profileImage || s.avatar,
                parent: s.parent ? {
                  name: s.parent.name || s.parent.fullName || "Parent",
                  email: s.parent.email || ""
                } : undefined
              }));
              setStudents(mappedStudents);
            }
          }

          // 3. Fetch Teachers if needed
          if (targetType === 'teacher') {
            const teachersResp = await teacherService.getAllProfiles();
            if (teachersResp.data) {
              const mappedTeachers: TeacherParams[] = teachersResp.data
                .filter((t: any) => t.id !== profileResponse.data.id) // Exclude self
                .map((t: any) => ({
                  id: t.id,
                  name: t.user?.fullName || "Unknown Teacher",
                  email: t.user?.email || "",
                  school: t.experience?.[0]?.institution || "Kidato",
                  avatar: t.profileImage
                }));
              setTeachers(mappedTeachers);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load data for review modal", error);
        toast({
          title: "Error loading data",
          description: "Could not fetch necessary information.",
          variant: "destructive"
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [isOpen, user, targetType, toast]);


  // Set default templates and subjects based on target type
  useEffect(() => {
    // Only set defaults if content is empty or we're switching targets
    if (messageContent && !useAITemplate) return;

    const teacherName = user?.fullName || "[Your Name]";

    if (targetType === 'student') {
      setMessageSubject("Your feedback matters! Share your experience with my class");
      setMessageContent(
        `Dear ${student?.name || "Student"},

I hope you've been enjoying our ${student?.parent ? "classes" : "class"} together. Your feedback would be incredibly valuable to me and would help other students discover my teaching style.

Could you please take a moment to share your experience by clicking the link below? It should only take about 2 minutes of your time.

${reviewLink}

Your honest feedback helps me improve as a teacher and helps other students make informed decisions.

Thank you so much!

Best regards,
${teacherName}
Kidato Teacher`
      );
    } else if (targetType === 'parent') {
      setMessageSubject("Request for feedback on your child's learning experience");
      setMessageContent(
        `Dear ${student?.parent?.name || "Parent"},

I've had the pleasure of teaching ${student?.name || "your child"} and would greatly appreciate your perspective on their learning experience in my class.

Your feedback is vital to my growth as an educator and helps other parents make informed decisions about their children's education.

Please take a moment to share your thoughts by clicking the link below:

${reviewLink}

Thank you for your time and partnership in ${student?.name || "your child"}'s education journey.

Warm regards,
${teacherName}
Kidato Teacher`
      );
    } else if (targetType === 'teacher') {
      setMessageSubject("Professional feedback request from a fellow educator");
      setMessageContent(
        `Dear Colleague,

I hope this message finds you well. As a fellow educator, I value your professional insight and would appreciate your feedback on my teaching methodology and approach.

Your perspective as an experienced educator would be invaluable to my professional development and would help enhance my teaching effectiveness.

Please share your feedback through this link:

${reviewLink}

Thank you for your collegiality and support.

Best regards,
${teacherName}
Kidato Teacher`
      );
    }
  }, [targetType, student, reviewLink, user, useAITemplate, messageContent]);

  // Get all available recipients based on target type
  const getAvailableRecipients = () => {
    if (targetType === 'student') {
      return students.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        avatar: s.avatar
      }));
    } else if (targetType === 'parent') {
      return students
        .filter(s => s.parent)
        .map(s => ({
          id: `p-${s.id}`,
          name: s.parent!.name,
          email: s.parent!.email,
          studentName: s.name,
          avatar: undefined // Parents might not have avatars in this context
        }));
    } else {
      return teachers.map(t => ({
        id: t.id,
        name: t.name,
        email: t.email,
        school: t.school,
        avatar: t.avatar
      }));
    }
  };

  const availableRecipients = getAvailableRecipients();

  // Generate AI template
  const generateAITemplate = () => {
    setGeneratingTemplate(true);
    const teacherName = user?.fullName || "[Your Name]";

    // Simulate AI template generation delay
    setTimeout(() => {
      if (targetType === 'student') {
        setMessageContent(
          `Dear ${student?.name || "Student"},

I hope this message finds you well! I wanted to reach out because your perspective on our ${student?.parent ? "classes" : "class"} would be incredibly valuable to me.

As your teacher, I'm always looking to improve and better serve my students. Your honest feedback about what's working well and what could be enhanced would help me do just that.

Would you please take a moment to share your thoughts through this quick feedback form? It should only take about 2 minutes:

${reviewLink}

Your insights will not only help me grow as an educator, but will also assist other students who are considering joining my classes.

Thank you so much for your time and participation!

With appreciation,
${teacherName}
Kidato Teacher`
        );
      } else if (targetType === 'parent') {
        setMessageContent(
          `Dear ${student?.parent?.name || "Parent"},

I hope you and your family are doing well! As ${student?.name || "your child"}'s teacher, I'm reaching out to request your valuable feedback on their learning experience in my class.

Parents provide a unique perspective that helps me ensure I'm meeting the needs of both students and their families. Your insights would be tremendously helpful as I continue to develop and improve my teaching approach.

Could you please take a few moments to share your thoughts through this link?

${reviewLink}

Your feedback remains confidential and will be used to enhance the learning experience for all students, while also helping other parents make informed decisions about their children's education.

Thank you for your partnership in ${student?.name || "your child"}'s educational journey!

Warm regards,
${teacherName}
Kidato Teacher`
        );
      } else if (targetType === 'teacher') {
        setMessageContent(
          `Dear Colleague,

I hope the academic year is treating you well! As a fellow educator, I'm reaching out to request your professional feedback on my teaching methodology and approach.

Your expertise and experience in education make your perspective particularly valuable to my growth as a teacher. Peer feedback is one of the most effective ways for educators to refine their craft and continue developing professionally.

If you could spare a few minutes, I would greatly appreciate you sharing your insights through this link:

${reviewLink}

Your feedback will help me enhance my teaching effectiveness and better serve my students, while also providing potential students and parents with a professional assessment of my teaching capabilities.

Thank you for your collegiality and support. I'm happy to reciprocate by providing feedback on your teaching if that would be helpful.

With professional regards,
${teacherName}
Kidato Teacher`
        );
      }

      setGeneratingTemplate(false);
    }, 1500);
  };

  // Handle sending review requests
  const handleSendRequest = () => {
    setIsSubmitting(true);

    // In a real implementation, this would call an API endpoint to send emails/messages.
    // For now, we simulate the network request but use the real data we gathered.
    // Ideally use messageAnalyticsService.createCampaign()
    setTimeout(() => {
      let recipientsCount = 0;

      if (messageMethod === 'email') {
        if (isBulkRequest) {
          recipientsCount = selectedRecipients.length;
          console.log("Sending to IDs:", selectedRecipients);
        } else {
          recipientsCount = 1;
          console.log("Sending to:", targetType === 'teacher' && !student ? recipientEmail : student?.email);
        }
      }

      toast({
        title: "Review requests sent successfully!",
        description: messageMethod === 'email'
          ? `Sent to ${recipientsCount} recipient${recipientsCount !== 1 ? 's' : ''}.`
          : "Review link has been copied to your clipboard.",
      });

      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  // Handle recipient selection for bulk emails
  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  // Copy review link to clipboard
  const copyReviewLink = () => {
    navigator.clipboard.writeText(reviewLink);
    toast({
      title: "Link copied to clipboard",
      description: "You can now paste it wherever you need.",
    });
  };

  // Get the appropriate icon for the target type
  const getTargetIcon = () => {
    switch (targetType) {
      case 'student':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'parent':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'teacher':
        return <School className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTargetIcon()}
            {isBulkRequest
              ? `Request Reviews from ${targetType === 'student' ? 'Students' : targetType === 'parent' ? 'Parents' : 'Teachers'}`
              : `Request Review from ${student?.name || (targetType === 'student' ? 'Student' : targetType === 'parent' ? 'Parent' : 'Teacher')}`
            }
          </DialogTitle>
          <DialogDescription>
            {targetType === 'student' && "Student reviews build your credibility and help attract new enrollments."}
            {targetType === 'parent' && "Parent reviews provide social proof of your effectiveness as a teacher."}
            {targetType === 'teacher' && "Professional reviews from fellow educators add credibility to your profile."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Tabs defaultValue="email" onValueChange={(value) => setMessageMethod(value as 'email' | 'link')} className="w-full h-full flex flex-col">
            <TabsList className="w-full grid grid-cols-2 mb-6 flex-shrink-0">
              <TabsTrigger value="email" className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                Send Email
              </TabsTrigger>
              <TabsTrigger value="link" className="flex gap-2 items-center">
                <MessageCircle className="h-4 w-4" />
                Share Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 max-h-[60vh] pr-4">
                {isBulkRequest ? (
                  <div className="mb-6">
                    <Label className="text-sm font-medium mb-2 block">
                      Select Recipients
                      {loadingData ? (
                        <span className="text-xs font-normal text-muted-foreground ml-2">Loading...</span>
                      ) : (
                        <span className="text-xs font-normal text-muted-foreground ml-2">
                          ({selectedRecipients.length}/{availableRecipients.length} selected)
                        </span>
                      )}
                    </Label>
                    <div className="border rounded-md overflow-hidden max-h-[250px]">
                      <div className="divide-y overflow-y-auto max-h-[250px]">
                        {loadingData ? (
                          <div className="p-4 text-center text-gray-500">Loading recipients...</div>
                        ) : availableRecipients.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No recipients found.</div>
                        ) : (
                          availableRecipients.map((recipient) => (
                            <div key={recipient.id} className="flex items-center p-3 hover:bg-gray-50">
                              <Checkbox
                                id={`recipient-${recipient.id}`}
                                checked={selectedRecipients.includes(recipient.id)}
                                onCheckedChange={() => toggleRecipient(recipient.id)}
                                className="mr-3"
                              />
                              <div className="flex items-center flex-1 min-w-0">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={(recipient as any).avatar} />
                                  <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                    {recipient.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <Label
                                    htmlFor={`recipient-${recipient.id}`}
                                    className="font-medium text-sm cursor-pointer"
                                  >
                                    {recipient.name}
                                  </Label>
                                  <p className="text-xs text-gray-500 truncate">{recipient.email}</p>
                                  {(recipient as any).studentName && (
                                    <p className="text-xs text-gray-500">
                                      <User className="inline h-3 w-3 mr-1" />
                                      Parent of {(recipient as any).studentName}
                                    </p>
                                  )}
                                  {(recipient as any).school && (
                                    <p className="text-xs text-gray-500">
                                      <School className="inline h-3 w-3 mr-1" />
                                      {(recipient as any).school}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {targetType === 'teacher' && !student && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="recipient-name">Teacher Name</Label>
                            <Input
                              id="recipient-name"
                              placeholder="Enter teacher's name"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="recipient-email">Teacher Email</Label>
                            <Input
                              id="recipient-email"
                              placeholder="Enter teacher's email"
                              value={recipientEmail}
                              onChange={(e) => setRecipientEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="school">School Name</Label>
                          <Input
                            id="school"
                            placeholder="Enter school name"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="subject" className="text-sm font-medium">Email Subject</Label>
                    <div className="flex items-center">
                      <Label htmlFor="use-ai" className="text-xs mr-2 cursor-pointer">Use AI Template</Label>
                      <Switch
                        id="use-ai"
                        checked={useAITemplate}
                        onCheckedChange={setUseAITemplate}
                      />
                    </div>
                  </div>

                  <Input
                    id="subject"
                    placeholder="Enter email subject"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />

                  <div className="flex justify-between items-center">
                    <Label htmlFor="message" className="text-sm font-medium">Email Message</Label>
                    {useAITemplate && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateAITemplate}
                        disabled={generatingTemplate}
                        className="flex items-center gap-2"
                      >
                        {generatingTemplate ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            Regenerate AI Message
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <Textarea
                    id="message"
                    rows={12}
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="font-mono text-sm"
                  />

                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex gap-2 items-start text-sm text-blue-700">
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Tips for effective review requests:</span>
                        <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                          <li>Personalize your message with specific class details</li>
                          <li>Keep it concise and respectful of their time</li>
                          <li>Mention the value of honest, constructive feedback</li>
                          <li>Express genuine gratitude for their participation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="link" className="overflow-hidden flex flex-col">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-2 text-center">Share Review Link</h3>
                  <p className="text-gray-600 text-sm text-center mb-4">
                    Share this link with {targetType === 'student' ? 'students' : targetType === 'parent' ? 'parents' : 'fellow teachers'} to collect reviews
                  </p>

                  <div className="flex items-center gap-2 max-w-lg mx-auto mb-4">
                    <Input value={reviewLink} readOnly className="bg-white" />
                    <Button variant="outline" onClick={copyReviewLink} className="flex-shrink-0">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <div className="flex justify-center gap-2 mb-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                  </div>

                  <div className="max-w-lg mx-auto border-t pt-4">
                    <p className="text-gray-600 text-xs text-center">
                      This link will take recipients directly to your review form. No sign-up required.
                    </p>
                  </div>
                </div>

                {/* QR Code preview */}
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-sm font-medium mb-2">QR Code</h3>
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded flex items-center justify-center mb-2">
                    <span className="text-xs text-gray-500">QR Code Preview</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>

                <div className="bg-amber-50 p-3 rounded-md">
                  <div className="flex gap-2 items-start text-sm text-amber-700">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">When to use the share link:</span>
                      <ul className="list-disc pl-5 mt-1 text-xs space-y-1">
                        <li>To share on social media or messaging apps</li>
                        <li>To include in newsletters or printed materials</li>
                        <li>When you don't have email addresses</li>
                        <li>For in-person requests using the QR code</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="pt-2 border-t mt-2 flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            disabled={isSubmitting || (isBulkRequest && messageMethod === 'email' && selectedRecipients.length === 0)}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                {messageMethod === 'email' ? (
                  <>
                    <Send className="h-4 w-4" />
                    {isBulkRequest ? `Send to ${selectedRecipients.length} ${targetType}${selectedRecipients.length !== 1 ? 's' : ''}` : "Send Request"}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};



export default RequestReviewModal;