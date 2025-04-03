
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Star, Mail, Link, User, Users, MessageSquare } from "lucide-react";
import ReviewForm from "../../teacher/reviews/ReviewForm";

interface ReviewsTabProps {
  classId?: string;
}

const ReviewsTab = ({ classId }: ReviewsTabProps) => {
  const { toast } = useToast();
  const [inviteType, setInviteType] = useState<"email" | "link">("email");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewerType, setReviewerType] = useState("student");
  const [customMessage, setCustomMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("request");

  // Mock review data
  const pendingReviews = [
    { id: 1, name: "James Smith", type: "Parent", date: "2025-03-28", status: "Pending" },
    { id: 2, name: "Sarah Johnson", type: "Student", date: "2025-03-27", status: "Pending" },
  ];

  const receivedReviews = [
    { id: 1, name: "Michael Brown", type: "Parent", date: "2025-03-25", rating: 5, comment: "Excellent teacher!" },
    { id: 2, name: "Lisa Williams", type: "Student", date: "2025-03-24", rating: 4, comment: "Very helpful and patient." },
    { id: 3, name: "Robert Clark", type: "Supervisor", date: "2025-03-22", rating: 5, comment: "Outstanding professional." },
  ];

  const handleRequestReview = () => {
    if (!reviewerName || !reviewerEmail) {
      toast({
        title: "Missing information",
        description: "Please provide reviewer name and email address.",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending invitation
    toast({
      title: "Review invitation sent",
      description: `Invitation has been sent to ${reviewerName} (${reviewerEmail}).`,
    });

    // Reset form
    setReviewerName("");
    setReviewerEmail("");
    setCustomMessage("");
  };

  const handleCopyLink = () => {
    const reviewLink = "https://kidato.com/review/t123456";
    navigator.clipboard.writeText(reviewLink);
    setCopySuccess(true);
    toast({
      title: "Link copied",
      description: "Review link has been copied to clipboard.",
    });
    
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="request">Request Reviews</TabsTrigger>
          <TabsTrigger value="received">Received Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="request" className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-kidato-light-blue to-blue-50 pb-2">
              <CardTitle className="text-xl text-kidato-blue">Request Reviews</CardTitle>
              <CardDescription>
                Ask students, parents, and supervisors to provide feedback on your teaching
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <Tabs value={inviteType} onValueChange={(value) => setInviteType(value as "email" | "link")} className="w-full">
                  <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                    <TabsTrigger value="email" className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Invitation
                    </TabsTrigger>
                    <TabsTrigger value="link" className="flex items-center">
                      <Link className="mr-2 h-4 w-4" />
                      Share Link
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email">
                    <div className="space-y-4 max-w-xl mx-auto">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="reviewerName">Reviewer Name</Label>
                          <Input
                            id="reviewerName"
                            placeholder="Enter reviewer's name"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="reviewerEmail">Reviewer Email</Label>
                          <Input
                            id="reviewerEmail"
                            type="email"
                            placeholder="Enter reviewer's email"
                            value={reviewerEmail}
                            onChange={(e) => setReviewerEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="reviewerType">Reviewer Type</Label>
                        <Select value={reviewerType} onValueChange={setReviewerType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reviewer type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student" className="flex items-center">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Student
                              </div>
                            </SelectItem>
                            <SelectItem value="parent" className="flex items-center">
                              <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4" />
                                Parent
                              </div>
                            </SelectItem>
                            <SelectItem value="supervisor" className="flex items-center">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Supervisor
                              </div>
                            </SelectItem>
                            <SelectItem value="other" className="flex items-center">
                              <div className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                Other
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                        <Textarea
                          id="customMessage"
                          placeholder="Add a personal message to your review request"
                          rows={3}
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Button 
                          onClick={handleRequestReview}
                          className="w-full sm:w-auto"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Review Request
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowPreview(!showPreview)}
                          className="w-full sm:w-auto"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {showPreview ? "Hide Preview" : "Show Preview"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="link">
                    <div className="space-y-6 max-w-xl mx-auto">
                      <div className="bg-muted p-6 rounded-lg text-center">
                        <h3 className="text-lg font-medium mb-2">Share Review Link</h3>
                        <p className="text-muted-foreground mb-4">
                          Share this link with students, parents, or supervisors to get their reviews
                        </p>
                        <div className="flex items-center gap-2 max-w-md mx-auto mb-4">
                          <Input value="https://kidato.com/review/t123456" readOnly className="bg-white" />
                          <Button variant="outline" onClick={handleCopyLink}>
                            {copySuccess ? (
                              <span className="flex items-center gap-1">
                                <Copy className="h-4 w-4" />
                                Copied!
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Copy className="h-4 w-4" />
                                Copy
                              </span>
                            )}
                          </Button>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            Email Link
                          </Button>
                          <Button variant="outline" className="flex items-center">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center bg-blue-50 p-4 rounded-lg">
                        <p className="text-kidato-blue text-sm">
                          <strong>Tip:</strong> The more reviews you collect, the faster your profile will be approved, and the more likely students will be to enroll in your classes.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {showPreview && (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Review Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-w-xl mx-auto">
                      <ReviewForm teacherId="123" teacherName="Sam Gichuru" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="received" className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-2">
              <CardTitle className="text-xl text-green-700">Received Reviews</CardTitle>
              <CardDescription>
                Reviews you've received from students, parents, and supervisors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {receivedReviews.length > 0 ? (
                <div className="space-y-4">
                  {receivedReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{review.name}</h4>
                          <p className="text-sm text-muted-foreground">{review.type} • {review.date}</p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Reviews Yet</h3>
                  <p className="text-muted-foreground">
                    When you receive reviews, they will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-2">
              <CardTitle className="text-xl text-amber-700">Pending Reviews</CardTitle>
              <CardDescription>
                Review requests you've sent that are still waiting for responses
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {pendingReviews.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Sent
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingReviews.map((review) => (
                        <tr key={review.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{review.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{review.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {review.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">Resend</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Pending Invitations</h3>
                  <p className="text-muted-foreground">
                    When you send review requests, they will appear here until completed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsTab;
