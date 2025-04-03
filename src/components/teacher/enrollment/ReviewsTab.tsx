
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Mail, UserPlus, Send, CalendarClock, Check, AlertCircle, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReviewsTabProps {
  classId?: string;
}

const ReviewsTab = ({ classId }: ReviewsTabProps) => {
  const { toast } = useToast();
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [typeInput, setTypeInput] = useState("student");
  const [isAdding, setIsAdding] = useState(false);
  const [reviewLink, setReviewLink] = useState("https://app.kidato.com/review/abc123");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [invitingIds, setInvitingIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("received");

  // Mock data for reviews
  const receivedReviews = [
    { 
      id: "1", 
      name: "Sarah Johnson", 
      email: "sarah.j@example.com", 
      type: "parent",
      date: "2025-04-01",
      rating: 5,
      text: "Ms. Smith has been an exceptional math teacher for my daughter. Her teaching methods have made complex concepts easy to understand.",
      status: "approved",
      avatar: null
    },
    { 
      id: "2", 
      name: "James Wilson", 
      email: "james.w@example.com", 
      type: "student",
      date: "2025-03-29",
      rating: 4,
      text: "I learned a lot in Ms. Smith's class. The lessons were interesting and fun.",
      status: "approved",
      avatar: null
    },
    { 
      id: "3", 
      name: "Robert Chen", 
      email: "robert.c@example.com", 
      type: "supervisor",
      date: "2025-03-25",
      rating: 5,
      text: "One of our most dedicated teachers, with excellent classroom management skills and curriculum development.",
      status: "approved",
      avatar: null
    },
    { 
      id: "4", 
      name: "Emily Davis", 
      email: "emily.d@example.com", 
      type: "parent",
      date: "2025-03-20",
      rating: 3,
      text: "Good teacher, but communication could be improved. My son enjoys the class.",
      status: "pending",
      avatar: null
    }
  ];

  // Mock data for pending review requests
  const pendingReviews = [
    { 
      id: "5", 
      name: "Michael Brown", 
      email: "michael.b@example.com", 
      type: "parent",
      date: "2025-04-02",
      status: "pending",
      avatar: null
    },
    { 
      id: "6", 
      name: "Jessica Lee", 
      email: "jessica.l@example.com", 
      type: "student",
      date: "2025-04-01",
      status: "pending",
      avatar: null
    },
    { 
      id: "7", 
      name: "David Thompson", 
      email: "david.t@example.com", 
      type: "parent",
      date: "2025-03-30",
      status: "pending",
      avatar: null
    }
  ];

  const handleAddReviewRequest = () => {
    if (!emailInput.trim() || !nameInput.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email for the reviewer.",
        variant: "destructive"
      });
      return;
    }

    // Simulate adding a review request
    toast({
      title: "Review request sent",
      description: `A review request has been sent to ${nameInput} (${emailInput}).`,
    });

    // Reset form
    setEmailInput("");
    setNameInput("");
    setTypeInput("student");
    setIsAdding(false);
  };

  const handleResendInvite = (id: string, name: string) => {
    setInvitingIds([...invitingIds, id]);
    
    // Simulate API call
    setTimeout(() => {
      setInvitingIds(invitingIds.filter(inviteId => inviteId !== id));
      toast({
        title: "Reminder sent",
        description: `Successfully sent a reminder to ${name}.`,
      });
    }, 1000);
  };

  const handleGenerateLink = () => {
    // Simulate generating a unique link
    const uniqueId = Math.random().toString(36).substring(2, 10);
    setReviewLink(`https://app.kidato.com/review/${uniqueId}`);
    setShowLinkDialog(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink);
    toast({
      title: "Link copied",
      description: "Review link has been copied to your clipboard.",
    });
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'student':
        return <Badge variant="secondary">Student</Badge>;
      case 'parent':
        return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">Parent</Badge>;
      case 'supervisor':
        return <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700">Supervisor</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 border-green-200 text-green-700">
          <Check className="h-3 w-3" />
          <span>Approved</span>
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 border-amber-200 text-amber-700">
        <AlertCircle className="h-3 w-3" />
        <span>Pending</span>
      </Badge>
    );
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="received">Received Reviews</TabsTrigger>
          <TabsTrigger value="pending">Review Requests</TabsTrigger>
        </TabsList>
      
        <TabsContent value="received">
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-slate-800">Your Reviews</CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Reviews from students, parents, and supervisors
                  </CardDescription>
                </div>
                <Badge variant="outline" className="flex items-center gap-1 bg-white">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span className="font-medium">{receivedReviews.length} reviews</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {receivedReviews.length === 0 ? (
                <div className="text-center py-10">
                  <div className="rounded-full bg-slate-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-7 w-7 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">No Reviews Yet</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4 max-w-md mx-auto">
                    You haven't received any reviews yet. Request reviews from your students, parents, or supervisors.
                  </p>
                  <Button onClick={() => setActiveTab("pending")}>
                    Request Reviews
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarImage src={review.avatar || undefined} alt={review.name} />
                          <AvatarFallback className="bg-kidato-blue text-white">
                            {getInitials(review.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-slate-800">{review.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {getTypeLabel(review.type)}
                                <span className="text-xs text-slate-500 flex items-center">
                                  <CalendarClock className="h-3 w-3 mr-1" />
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getRatingStars(review.rating)}
                              {getStatusBadge(review.status)}
                            </div>
                          </div>
                          <p className="mt-3 text-slate-700">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-slate-50">
              <div className="text-sm text-slate-500">
                Showing {receivedReviews.length} reviews
              </div>
              <Button 
                onClick={() => setActiveTab("pending")}
                className="bg-kidato-blue hover:bg-kidato-dark-blue"
              >
                Request More Reviews
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      
        <TabsContent value="pending">
          <Card className="shadow-md border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-slate-800">Review Requests</CardTitle>
                  <CardDescription className="text-slate-500 mt-1">
                    Manage your review requests and invite new reviewers
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleGenerateLink}>
                    Generate Review Link
                  </Button>
                  <Button onClick={() => setIsAdding(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Request
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {isAdding && (
                <div className="border rounded-lg p-4 bg-white mb-4">
                  <h3 className="font-medium mb-3">Request a New Review</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="reviewer-name">Reviewer Name</Label>
                      <Input 
                        id="reviewer-name" 
                        value={nameInput} 
                        onChange={(e) => setNameInput(e.target.value)} 
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviewer-email">Reviewer Email</Label>
                      <Input 
                        id="reviewer-email" 
                        type="email" 
                        value={emailInput} 
                        onChange={(e) => setEmailInput(e.target.value)} 
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="reviewer-type">Reviewer Type</Label>
                    <Select value={typeInput} onValueChange={setTypeInput}>
                      <SelectTrigger id="reviewer-type">
                        <SelectValue placeholder="Select reviewer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAdding(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddReviewRequest}>
                      Send Request
                    </Button>
                  </div>
                </div>
              )}
              
              {pendingReviews.length === 0 && !isAdding ? (
                <div className="text-center py-10">
                  <div className="rounded-full bg-slate-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-7 w-7 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">No Pending Requests</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4 max-w-md mx-auto">
                    You haven't sent any review requests yet.
                  </p>
                  <Button onClick={() => setIsAdding(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Request Your First Review
                  </Button>
                </div>
              ) : (
                <div className="overflow-hidden border rounded-md">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Reviewer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Sent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReviews.map((request) => (
                        <TableRow key={request.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-slate-200">
                                <AvatarImage src={request.avatar || undefined} alt={request.name} />
                                <AvatarFallback className="bg-kidato-blue text-white text-xs">
                                  {getInitials(request.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-slate-800">{request.name}</div>
                                <div className="text-xs text-slate-500">{request.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeLabel(request.type)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <CalendarClock className="h-3 w-3" />
                              {new Date(request.date).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleResendInvite(request.id, request.name)}
                              disabled={invitingIds.includes(request.id)}
                              className="w-[110px] bg-white hover:bg-slate-50 border-slate-200"
                            >
                              {invitingIds.includes(request.id) ? (
                                <>
                                  <span className="animate-pulse">Sending...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="h-3.5 w-3.5 mr-1.5" />
                                  Remind
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Review Link</DialogTitle>
            <DialogDescription>
              Share this link with anyone to get their review. They don't need to create an account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Input 
                value={reviewLink} 
                readOnly 
                className="pr-20"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1" 
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 border border-amber-200">
              <span className="font-medium">Note:</span> This link can be used by anyone and doesn't expire. Generate a new link if you want to invalidate the current one.
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLinkDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewsTab;
