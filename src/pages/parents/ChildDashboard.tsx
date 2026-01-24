import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { Calendar, Clock, CreditCard, ChevronRight, AlertCircle, CheckCircle2, Edit, GraduationCap, User, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MvpBookingService, { Booking } from "@/integrations/api/services/mvp-booking.service";
import { parentService } from "@/integrations/api/services/parent.service";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ChildDashboard = () => {
  const { childId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [childName, setChildName] = useState((location.state as any)?.childName || "Your Child");
  const [childData, setChildData] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    grade: "",
    school: "",
    curriculum: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Child Details (for name and edit)
        const profileResponse = await parentService.getChildren();
        const children = profileResponse.data || [];
        const foundChild = children.find((c: any) => c._id === childId);

        if (foundChild) {
          setChildName(foundChild.fullName);
          setChildData(foundChild);
          setEditForm({
            fullName: foundChild.fullName,
            grade: foundChild.grade || "",
            school: foundChild.school || "",
            curriculum: foundChild.curriculum || "",
            dateOfBirth: foundChild.dateOfBirth?.split('T')[0] || "",
          });
        }

        // 2. Fetch Bookings
        const allBookings = await MvpBookingService.getMyBookings();
        // Filter bookings for this child by name (MVP strategy)
        const targetName = foundChild ? foundChild.fullName : childName;
        const childBookings = allBookings.filter(b => b.studentName === targetName);
        setBookings(childBookings);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (childId) {
      fetchData();
    }
  }, [childId]);

  const handlePayNow = (booking: Booking) => {
    navigate(`/payment/${booking._id}`, {
      state: {
        amount: booking.price,
        offeringTitle: (booking.offeringId as any)?.title || 'Learning Session',
        teacherName: (booking.teacherId as any)?.fullName || 'Your Teacher',
        scheduledDate: booking.scheduledDate,
      }
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleEditSubmit = async () => {
    if (!childId) return;
    setIsSaving(true);
    try {
      await parentService.updateChild(childId, {
        fullName: editForm.fullName,
        grade: editForm.grade,
        school: editForm.school,
        curriculum: editForm.curriculum,
        // Only send DOB if it's not empty, to avoid clearing existing if any? 
        // Actually editForm.dateOfBirth handles it.
        dateOfBirth: editForm.dateOfBirth || undefined,
      });
      toast({ title: "Profile updated", description: "Child details updated successfully." });

      // Update local state
      const newName = editForm.fullName;
      setChildName(newName);
      setChildData((prev: any) => ({ ...prev, ...editForm }));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Update failed", error);
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const grades = [
    "Pre-K", "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4",
    "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
  ];

  const curriculums = [
    "CBC (Competency Based Curriculum)",
    "8-4-4 System",
    "British National Curriculum (BNC)",
    "American Curriculum",
    "International Baccalaureate (IB)",
    "ACE (Accelerated Christian Education)",
    "Montessori",
    "Other"
  ];

  const age = calculateAge(editForm.dateOfBirth);

  const today = new Date();
  const maxDate = today.toISOString().split('T')[0];
  const minDateObj = new Date();
  minDateObj.setFullYear(today.getFullYear() - 20);
  const minDate = minDateObj.toISOString().split('T')[0];

  return (
    <PageWrapper>
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-kidato-purple text-white flex items-center justify-center font-bold text-xl">
                {childName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{childName}</h1>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Child Profile</DialogTitle>
                        <DialogDescription>Update details for {childName}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input
                              type="date"
                              min={minDate}
                              max={maxDate}
                              value={editForm.dateOfBirth}
                              onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2 flex items-end pb-2">
                            {age !== null && (
                              <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-md w-full text-center">
                                Age: {age} years
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Grade</Label>
                          <Select
                            value={editForm.grade}
                            onValueChange={(v) => setEditForm({ ...editForm, grade: v })}
                          >
                            <SelectTrigger><SelectValue placeholder="Select Grade" /></SelectTrigger>
                            <SelectContent>
                              {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Curriculum</Label>
                          <Select
                            value={editForm.curriculum}
                            onValueChange={(v) => setEditForm({ ...editForm, curriculum: v })}
                          >
                            <SelectTrigger><SelectValue placeholder="Select Curriculum" /></SelectTrigger>
                            <SelectContent>
                              {curriculums.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>School</Label>
                          <Input
                            value={editForm.school}
                            onChange={(e) => setEditForm({ ...editForm, school: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSubmit} disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                  {childData?.age && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {childData.age} years old
                    </div>
                  )}
                  {childData?.curriculum && (
                    <div className="flex items-center">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {childData.curriculum}
                    </div>
                  )}
                  {childData?.school && (
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {childData.school}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/parents-dashboard/profile?tab=children')}>
              Back to Children
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Bookings */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-kidato-purple" />
                    Session History
                  </CardTitle>
                  <CardDescription>All scheduled and past learning sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-12 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kidato-purple"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900">No bookings yet</h3>
                      <p className="text-sm text-gray-500 mb-6">Start your child's learning journey today.</p>
                      <Button onClick={() => navigate('/teachers')} className="bg-kidato-purple">
                        Browse Courses
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all bg-white"
                        >
                          <div className="flex items-start gap-4 mb-4 sm:mb-0">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{(booking.offeringId as any)?.title || "Special Class"}</h4>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(booking.scheduledDate), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {booking.scheduledTime}
                                </span>
                                <span className="flex items-center gap-1 font-medium text-kidato-purple">
                                  KES {booking.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {!booking.isPaid ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 px-2 py-1">
                                <AlertCircle className="h-3 w-3" />
                                Unpaid
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 px-2 py-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Paid
                              </Badge>
                            )}

                            {!booking.isPaid && (
                              <Button size="sm" onClick={() => handlePayNow(booking)} className="bg-kidato-purple hover:bg-kidato-dark-blue h-9">
                                Pay Now
                              </Button>
                            )}
                            {booking.isPaid && booking.status === 'confirmed' && (
                              <Button size="sm" variant="outline" className="h-9 border-green-200 text-green-700 hover:bg-green-50">
                                Join Class
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-kidato-purple/5 to-blue-50 border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Learning Progress</CardTitle>
                  <CardDescription>Overview of activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white">
                      <span className="text-sm text-gray-600">Total Bookings</span>
                      <span className="font-bold text-gray-900">{bookings.length}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white">
                      <span className="text-sm text-gray-600">Completed Sessions</span>
                      <span className="font-bold text-gray-900">
                        {bookings.filter(b => b.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl border border-white">
                      <span className="text-sm text-gray-600">Pending Payments</span>
                      <span className="font-bold text-red-600">
                        {bookings.filter(b => !b.isPaid).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-12 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                        <img src="/placeholder.svg" alt="MPESA" className="h-full object-contain" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 tracking-tight">M-PESA ending in 254...89</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ChildDashboard;
