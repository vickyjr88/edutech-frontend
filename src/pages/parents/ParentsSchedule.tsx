import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { Calendar, Loader2, AlertCircle, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import MvpBookingService, { Booking } from "@/integrations/api/services/mvp-booking.service";
import { format, isAfter, isBefore, addMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ParentsSchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const data = await MvpBookingService.getMyBookings();
        // Sort by scheduled date and time
        const sortedData = [...data].sort((a, b) => {
          const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
          const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
          return dateA.getTime() - dateB.getTime();
        });
        setBookings(sortedData);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
        setError("Failed to load schedule");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getSessionStatus = (booking: Booking) => {
    const now = new Date();
    const sessionStart = new Date(`${booking.scheduledDate}T${booking.scheduledTime}`);
    const sessionEnd = addMinutes(sessionStart, booking.duration);

    if (isBefore(now, sessionStart)) return "upcoming";
    if (isAfter(now, sessionEnd)) return "completed";
    return "in-progress";
  };

  return (
    <PageWrapper>
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Learning Schedule</h1>
            </div>
            <Button variant="outline" onClick={() => navigate('/parents-dashboard/courses')}>
              View All Sessions
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
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-dashed">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Your schedule is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                No classes have been scheduled yet. Once you book a session, it will appear here.
              </p>
              <Button onClick={() => navigate('/all-classes')} className="bg-kidato-purple">
                Explore Classes
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const status = getSessionStatus(booking);
                return (
                  <Card key={booking._id} className={`overflow-hidden border-l-4 ${status === 'in-progress' ? 'border-l-green-500 bg-green-50/30' :
                    status === 'upcoming' ? 'border-l-kidato-purple' : 'border-l-gray-300 opacity-75'
                    }`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-stretch">
                        <div className="md:w-48 bg-gray-50 p-6 flex flex-col justify-center items-center text-center border-r">
                          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                            {format(new Date(booking.scheduledDate), "MMM")}
                          </span>
                          <span className="text-3xl font-black text-gray-900">
                            {format(new Date(booking.scheduledDate), "dd")}
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            {booking.scheduledTime}
                          </span>
                        </div>

                        <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {status === 'in-progress' && (
                                <Badge className="bg-green-500 animate-pulse text-white">LIVE NOW</Badge>
                              )}
                              <h3 className="font-bold text-xl text-gray-900">
                                {(booking.offeringId as any)?.title || "Special Session"}
                              </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {booking.duration} Minutes
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="h-4 w-4 rounded-full bg-kidato-purple text-[10px] flex items-center justify-center text-white font-bold">S</div>
                                Student: {booking.studentName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto">
                            {!booking.isPaid ? (
                              <Button
                                variant="destructive"
                                className="w-full md:w-auto font-bold"
                                onClick={() => navigate(`/payment/${booking._id}`)}
                              >
                                PAY KES {booking.price}
                              </Button>
                            ) : status === 'completed' ? (
                              <Button variant="outline" className="w-full md:w-auto" disabled>
                                Completed
                              </Button>
                            ) : (
                              <Button className="w-full md:w-auto bg-kidato-purple font-bold">
                                Join Session
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default ParentsSchedule;
