import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { User, Calendar, Clock, CreditCard, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MvpBookingService, { Booking } from "@/integrations/api/services/mvp-booking.service";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ChildDashboard = () => {
  const { childId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const childName = (location.state as any)?.childName || "Your Child";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildBookings = async () => {
      try {
        setLoading(true);
        const allBookings = await MvpBookingService.getMyBookings();
        // Filter bookings for this child by name (MVP strategy)
        const childBookings = allBookings.filter(b => b.studentName === childName);
        setBookings(childBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load bookings for this child.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChildBookings();
  }, [childId, childName]);

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

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName="Kate Johnson" />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-kidato-purple text-white flex items-center justify-center font-bold text-xl">
                  {childName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{childName}</h1>
                  <p className="text-sm text-gray-500">Learning Dashboard & Bookings</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/parents-dashboard/children')}>
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
        </main>
      </div>
    </div>
  );
};

export default ChildDashboard;
