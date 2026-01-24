import { useState, useEffect, useRef } from "react";
import { BookOpen, Calendar, Clock, Loader2, AlertCircle, User, GraduationCap, ArrowRight, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

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
    <PageWrapper>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Enrolled Sessions</h1>
              <p className="text-gray-500 mt-1">Manage your child's upcoming classes and learning schedule</p>
            </div>
            <Button
              className="bg-kidato-purple hover:bg-kidato-purple/90 shadow-sm"
              onClick={() => navigate('/teachers')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Browse More Courses
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-kidato-purple mb-4" />
              <p className="text-gray-500">Loading your schedule...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-red-100">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-400" />
              <p>{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200">
              <div className="h-20 w-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-kidato-purple" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No active sessions found</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                You haven't booked any classes yet. Start your child's learning journey by exploring our available courses.
              </p>
              <Button
                className="bg-kidato-purple hover:bg-kidato-purple/90 h-11 px-8 rounded-xl font-bold shadow-sm"
                onClick={() => navigate('/teachers')}
              >
                Find a Course
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => {
                const offering = booking.offeringId as any;
                const teacher = booking.teacherId as any;
                const date = new Date(booking.scheduledDate);

                return (
                  <Card key={booking._id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 group flex flex-col h-full">
                    {/* Course Thumbnail Header */}
                    <div className="relative h-40 bg-gray-100 overflow-hidden group-hover:h-40 transition-all">
                      {offering?.thumbnailUrl ? (
                        <img
                          src={offering.thumbnailUrl}
                          alt={offering.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-kidato-purple to-indigo-600 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white/20" />
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex gap-2">
                        <Badge className={`${booking.isPaid ? 'bg-green-500/90 hover:bg-green-600' : 'bg-red-500/90 hover:bg-red-600'} text-white border-0 backdrop-blur-sm shadow-sm`}>
                          {booking.isPaid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>

                      {offering?.subject && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-white/95 text-xs font-semibold text-gray-800 backdrop-blur-md shadow-sm border-0">
                            {offering.subject}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 flex-grow">
                      {/* Title & Schedule */}
                      <div className="mb-5">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-kidato-purple transition-colors">
                          {offering?.title || "Special Session"}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="font-medium mr-1">{format(date, "EEE, MMM d")}</span>
                          <span className="text-gray-300 mx-2">|</span>
                          <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>{booking.scheduledTime}</span>
                          <span className="text-xs text-gray-400 ml-1">({booking.duration}m)</span>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 flex items-center">
                            <User className="w-3 h-3 mr-1" /> Student
                          </div>
                          <div className="font-semibold text-sm text-gray-700 truncate" title={booking.studentName}>
                            {booking.studentName}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1 flex items-center">
                            <GraduationCap className="w-3 h-3 mr-1" /> Level
                          </div>
                          <div className="font-semibold text-sm text-gray-700 truncate">
                            {booking.studentGrade || offering?.gradeLevel || 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Teacher Row */}
                      {teacher && (
                        <div
                          className="flex items-center gap-3 pt-4 border-t border-gray-100 cursor-pointer hover:bg-gray-50 -mx-5 px-5 transition-colors"
                          onClick={() => navigate(`/teacher/${teacher._id}`)}
                        >
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={teacher.profileImage} />
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
                              {teacher.fullName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Instructor</p>
                            <p className="text-sm font-bold text-gray-900 truncate group-hover/teacher:text-kidato-purple">
                              {teacher.fullName}
                            </p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 bg-gray-50/50 border-t border-gray-100 gap-3">
                      {booking.isPaid && booking.status === 'confirmed' ? (
                        <Button className="flex-1 bg-kidato-purple hover:bg-kidato-purple/90 shadow-sm font-medium">
                          Join Class
                        </Button>
                      ) : !booking.isPaid ? (
                        <Button
                          className="flex-1 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm font-bold"
                          onClick={() => handlePayNow(booking)}
                        >
                          Pay {booking.price?.toLocaleString()}
                        </Button>
                      ) : (
                        <Button variant="secondary" className="flex-1" disabled>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="flex-1 border-gray-200 hover:bg-white hover:text-kidato-purple hover:border-kidato-purple/30 transition-all font-medium"
                        onClick={() => navigate(offering?._id ? `/class/${offering._id}` : '#')}
                        disabled={!offering?._id}
                      >
                        View Details
                      </Button>
                    </CardFooter>
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

export default ParentsCourses;
