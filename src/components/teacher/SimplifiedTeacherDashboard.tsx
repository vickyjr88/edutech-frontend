/**
 * MVP Simplified Teacher Dashboard
 *
 * Streamlined dashboard showing:
 * - Key stats (students, offerings, earnings)
 * - Upcoming bookings
 * - Quick actions
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  Plus,
  Clock,
  Settings,
  TrendingUp,
  Edit,
  Eye,
  HelpCircle,
  Star,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MvpTeacherService from '@/integrations/api/services/mvp-teacher.service';
import MvpBookingService from '@/integrations/api/services/mvp-booking.service';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';

interface DashboardStats {
  totalStudents: number;
  activeOfferings: number;
  totalEarnings: number;
  upcomingBookings: number;
  totalResources: number;
}

interface Booking {
  _id: string;
  studentName: string;
  offeringTitle: string;
  scheduledAt: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  parentName?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 hover:bg-green-100/80';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80';
    case 'completed':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100/80';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100/80';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/80';
  }
};

export default function SimplifiedTeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeOfferings: 0,
    totalEarnings: 0,
    upcomingBookings: 0,
    totalResources: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch real data from API
      const [statsData, bookingsData, resourcesData] = await Promise.all([
        MvpTeacherService.getDashboardStats(),
        MvpTeacherService.getUpcomingBookings(),
        MvpTeacherService.getResources()
      ]);

      // Map stats data
      setStats({
        totalStudents: statsData.totalStudents || 0,
        activeOfferings: statsData.activeOfferings || 0,
        totalEarnings: statsData.monthlyEarnings || 0,
        upcomingBookings: statsData.upcomingSessions || 0,
        totalResources: resourcesData?.length || 0,
      });

      // Map bookings data
      const mappedBookings: Booking[] = bookingsData.map((booking: any) => {
        // Construct scheduledAt from date and time
        const dateStr = booking.scheduledDate.split('T')[0];
        const scheduledAt = `${dateStr}T${booking.scheduledTime}:00`;

        return {
          _id: booking._id,
          studentName: booking.studentName,
          parentName: booking.parentName || booking.parentId?.fullName || booking.parent?.user?.fullName || 'Parent',
          offeringTitle: booking.offeringId?.title || 'Unknown Class',
          scheduledAt,
          duration: booking.duration,
          status: booking.status,
        };
      });

      setUpcomingBookings(mappedBookings);
      setPendingBookings(mappedBookings.filter(b => b.status === 'pending'));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptBooking = async (id: string) => {
    try {
      await MvpBookingService.acceptBooking(id);
      toast({
        title: "Booking Accepted",
        description: "The booking has been confirmed.",
      });
      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error("Error accepting booking:", error);
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: "Could not accept booking. Please try again.",
      });
    }
  };

  const quickActions = [
    {
      title: 'Create Offering',
      icon: Plus,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      path: '/teacher-offerings',
      description: 'Add a new class'
    },
    {
      title: 'Set Availability',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      path: '/teacher-availability',
      description: 'Manage schedule'
    },
    {
      title: 'Edit Profile',
      icon: Edit,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      path: '/teacher-profile',
      description: 'Update public profile'
    },
    {
      title: 'My Students',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      path: '/teacher-students',
      description: 'View student progress'
    },
    {
      title: 'Earnings',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      path: '/teacher-earnings',
      description: 'Track revenue'
    },
    {
      title: 'Resources',
      icon: BookOpen,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      path: '/teacher-resources',
      description: 'Manage materials'
    },
    {
      title: 'Support',
      icon: HelpCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      path: '/support',
      description: 'Get help'
    },
    {
      title: 'Ratings',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      path: '/teacher-dashboard/ratings',
      description: 'View student reviews'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your teaching</p>
        </div>
        <Button asChild>
          <Link to="/teacher-profile">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>

      {/* Storefront Preview */}
      <div className="flex justify-end -mt-4">
        <Button
          variant="link"
          className="text-gray-500 hover:text-blue-600 flex items-center gap-1"
          onClick={() => window.open(`/teacher/${user?.id}`, '_blank')}
        >
          <Eye className="w-4 h-4" />
          Preview Public Storefront
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offerings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOfferings}</div>
            <p className="text-xs text-muted-foreground">Available for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResources}</div>
            <p className="text-xs text-muted-foreground">Uploaded materials</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks to manage your teaching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-gray-50 bg-white"
                asChild
              >
                <Link to={action.path}>
                  <div className={`p-2 rounded-full ${action.bgColor}`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium block">{action.title}</span>
                    <span className="text-xs text-gray-500">{action.description}</span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Bookings Section */}
      {
        pendingBookings.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Clock className="h-5 w-5" />
                Pending Requests
              </CardTitle>
              <CardDescription className="text-orange-700">
                You have new booking requests waiting for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-100 shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{booking.offeringTitle}</h4>
                          <div className="text-sm text-gray-600">
                            <p>Student: {booking.studentName}</p>
                            {booking.parentName && <p className="text-xs text-gray-500">Parent: {booking.parentName}</p>}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">
                          {format(parseISO(booking.scheduledAt), 'EEE, MMM d')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(booking.scheduledAt), 'h:mm a')} • {booking.duration} min
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => handleAcceptBooking(booking._id)}
                      >
                        Accept Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      }

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your confirmed bookings for the next 7 days</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/teacher-availability">View Calendar</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
              <p className="text-gray-600 mb-4">
                You don't have any confirmed bookings yet.
              </p>
              <Button asChild>
                <Link to="/teacher-offerings">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Offering
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.offeringTitle}</h4>
                        <div className="text-sm text-gray-600">
                          <p>Student: {booking.studentName}</p>
                          {booking.parentName && <p className="text-xs text-gray-500">Parent: {booking.parentName}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(parseISO(booking.scheduledAt), 'EEE, MMM d')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(parseISO(booking.scheduledAt), 'h:mm a')} • {booking.duration} min
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Getting Started Card (if no offerings) */}
      {
        stats.activeOfferings === 0 && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Get Started</CardTitle>
              <CardDescription className="text-blue-700">
                Complete these steps to start accepting students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Plus className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Create your first offering</h4>
                    <p className="text-sm text-gray-600">
                      Add a lesson, package, or course you want to teach
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to="/teacher-offerings">Start</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Set your availability</h4>
                    <p className="text-sm text-gray-600">
                      Let parents know when you're available to teach
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/teacher-availability">Set Times</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div >
  );
}
