import { useState, useEffect } from "react";
import { BookOpen, Calendar, Clock, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import MvpBookingService, { Booking } from "@/integrations/api/services/mvp-booking.service";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { format } from "date-fns";

const ParentsCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await MvpBookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
        setError("Failed to load your classes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <PageWrapper>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">My Enrolled Sessions</h1>
            </div>
            <Button
              className="bg-kidato-purple hover:bg-kidato-purple/90"
              onClick={() => navigate('/teachers')}
            >
              Browse More Courses
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-kidato-purple" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-400" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No active sessions found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                You haven't booked any classes yet. Start your child's learning journey by exploring our available courses.
              </p>
              <Button
                className="bg-kidato-purple hover:bg-kidato-purple/90 h-11 px-8 rounded-xl font-bold"
                onClick={() => navigate('/teachers')}
              >
                Find a Course
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden hover:shadow-md transition-all border-gray-100">
                  <div className="h-32 bg-gradient-to-br from-kidato-purple to-blue-600 p-4 flex flex-col justify-between">
                    <Badge className={`${booking.isPaid ? 'bg-green-500' : 'bg-red-500'} text-white border-0`}>
                      {booking.isPaid ? 'Paid' : 'Payment Pending'}
                    </Badge>
                    <h3 className="text-white font-bold text-lg line-clamp-1">
                      {(booking.offeringId as any)?.title || "Special Session"}
                    </h3>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-kidato-purple" />
                        {format(new Date(booking.scheduledDate), "EEEE, d MMM yyyy")}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-kidato-purple" />
                        {booking.scheduledTime} ({booking.duration} mins)
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="h-4 w-4 mr-2 rounded-full bg-kidato-purple text-[10px] flex items-center justify-center text-white font-bold">
                          S
                        </div>
                        Student: <span className="font-semibold ml-1">{booking.studentName}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      {booking.isPaid && booking.status === 'confirmed' ? (
                        <Button className="flex-1 bg-kidato-purple h-10">
                          Join Meeting
                        </Button>
                      ) : !booking.isPaid ? (
                        <Button
                          className="flex-1 bg-red-600 hover:bg-red-700 h-10"
                          onClick={() => navigate(`/payment/${booking._id}`)}
                        >
                          Pay KES {booking.price}
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1 h-10" disabled>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 border"
                        onClick={() => navigate(`/parents-dashboard/child/${booking.parentId}`)} // Assuming parentId refers to common link for now, or just use childId if we had it
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ParentsCourses;
