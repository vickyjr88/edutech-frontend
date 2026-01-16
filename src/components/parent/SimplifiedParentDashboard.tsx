/**
 * MVP Simplified Parent Dashboard
 *
 * Streamlined parent dashboard showing:
 * - Active bookings & upcoming sessions
 * - Children enrolled
 * - Quick actions (find teachers, manage bookings)
 * - Payment history
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Plus,
  Search,
  Clock,
  CheckCircle,
  Settings,
  User,
  Edit,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mvpApiClient } from '@/integrations/api/mvp-client';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO } from 'date-fns';
import { MvpParentService } from '@/integrations/api/services/mvp-parent.service';

interface DashboardStats {
  activeBookings: number;
  totalChildren: number;
  upcomingSessions: number;
  totalSpent: number;
}

interface Booking {
  _id: string;
  teacherName: string;
  offeringTitle: string;
  studentName: string;
  scheduledAt: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: number;
}

interface Child {
  _id: string;
  fullName: string;
  gradeLevel: string;
  activeBookings: number;
}

export default function SimplifiedParentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    activeBookings: 0,
    totalChildren: 0,
    upcomingSessions: 0,
    totalSpent: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const [statsData, bookingsData, childrenData] = await Promise.all([
        MvpParentService.getDashboardStats(),
        MvpParentService.getUpcomingBookings(),
        MvpParentService.getChildren(),
      ]);

      setStats(statsData);
      setUpcomingBookings(bookingsData);
      setChildren(childrenData);
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

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.fullName?.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Manage your children's learning journey</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">Ongoing sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChildren}</div>
            <p className="text-xs text-muted-foreground">Enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your children's education</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              asChild
            >
              <Link to="/teachers">
                <Search className="h-6 w-6" />
                <span className="text-sm font-medium">Find Teachers</span>
                <span className="text-xs text-gray-500">Browse and book</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              asChild
            >
              <Link to="/parents-dashboard/courses">
                <BookOpen className="h-6 w-6" />
                <span className="text-sm font-medium">My Bookings</span>
                <span className="text-xs text-gray-500">View all sessions</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              asChild
            >
              <Link to="/parents-dashboard/billing">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm font-medium">Payment History</span>
                <span className="text-xs text-gray-500">View transactions</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Children
              </CardTitle>
              <CardDescription>Manage your children's profiles</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/parents-dashboard/children')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
              <p className="text-gray-600 mb-4">Add your child to start booking sessions</p>
              <Button onClick={() => navigate('/parents-dashboard/children')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Child
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <div
                  key={child._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                      {child.fullName.charAt(0)}
                    </div>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <h4 className="font-medium mb-1">{child.fullName}</h4>
                  <p className="text-sm text-gray-600 mb-3">{child.gradeLevel}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active bookings:</span>
                    <Badge variant="secondary">{child.activeBookings}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>Your confirmed sessions for the next 7 days</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/parents-dashboard/courses">View All</Link>
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
                <Link to="/teachers">
                  <Search className="h-4 w-4 mr-2" />
                  Find Teachers
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
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.offeringTitle}</h4>
                        <p className="text-sm text-gray-600">
                          with {booking.teacherName} • {booking.studentName}
                        </p>
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

      {/* Getting Started (if no bookings) */}
      {stats.activeBookings === 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Get Started</CardTitle>
            <CardDescription className="text-blue-700">
              Start your child's learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Browse Teachers</h4>
                  <p className="text-sm text-gray-600">
                    Find qualified teachers for your child
                  </p>
                </div>
                <Button size="sm" asChild>
                  <Link to="/teachers">Browse</Link>
                </Button>
              </div>

              {stats.totalChildren === 0 && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Plus className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Add Your Child</h4>
                    <p className="text-sm text-gray-600">
                      Create a profile for your child
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Add Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
