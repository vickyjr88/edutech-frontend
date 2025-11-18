import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  GraduationCap,
  BookOpen,
  UserCircle,
  Activity,
  BarChart3,
} from 'lucide-react';
import { adminService } from '@/integrations/api/services/admin.service';
import { cn } from '@/lib/utils';

/**
 * Admin Dashboard Page
 * Displays comprehensive metrics and statistics for the entire system
 */
const AdminDashboardPage = () => {
  const { data: statsResponse, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => adminService.getDashboardStats(),
    refetchInterval: 60000, // Refetch every minute
  });

  // API client wraps response in { data: ..., error: null }
  const rawStats = statsResponse?.data;

  // Handle both old and new API response formats
  const stats = {
    users: {
      total: rawStats?.users?.total || 0,
      active: rawStats?.users?.active || 0,
      inactive: rawStats?.users?.inactive || 0,
      suspended: rawStats?.users?.suspended || 0,
      newThisMonth: rawStats?.users?.newThisMonth || 0,
      newThisWeek: rawStats?.users?.newThisWeek || 0,
      verifiedEmails: rawStats?.users?.verifiedEmails || 0,
      verifiedPhones: rawStats?.users?.verifiedPhones || 0,
      verificationRate: rawStats?.users?.verificationRate || '0',
      byRole: rawStats?.users?.byRole || {},
      growthTrend: rawStats?.users?.growthTrend || [],
    },
    tickets: {
      total: rawStats?.tickets?.total || 0,
      open: rawStats?.tickets?.open || 0,
      inProgress: rawStats?.tickets?.inProgress || 0,
      pending: rawStats?.tickets?.pending || 0,
      resolved: rawStats?.tickets?.resolved || 0,
      closed: rawStats?.tickets?.closed || 0,
      newThisWeek: rawStats?.tickets?.newThisWeek || 0,
      urgent: rawStats?.tickets?.urgent || 0,
      highPriority: rawStats?.tickets?.highPriority || 0,
      needsAttention: rawStats?.tickets?.needsAttention || 0,
      resolutionRate: rawStats?.tickets?.resolutionRate || '0',
      byCategory: rawStats?.tickets?.byCategory || {},
      trend: rawStats?.tickets?.trend || [],
    },
    classes: {
      total: rawStats?.classes?.total || 0,
      active: rawStats?.classes?.active || 0,
      inactive: rawStats?.classes?.inactive || 0,
    },
    enrollments: {
      total: rawStats?.enrollments?.total || 0,
      active: rawStats?.enrollments?.active || 0,
      completed: rawStats?.enrollments?.completed || 0,
      pending: rawStats?.enrollments?.pending || 0,
    },
    activity: {
      recentActions: rawStats?.activity?.recentActions || 0,
      activeSuspensions: rawStats?.activity?.activeSuspensions || 0,
    },
    overview: {
      totalUsers: rawStats?.overview?.totalUsers || rawStats?.users?.total || 0,
      totalTeachers: rawStats?.overview?.totalTeachers || rawStats?.users?.byRole?.teacher || 0,
      totalStudents: rawStats?.overview?.totalStudents || rawStats?.users?.byRole?.student || 0,
      totalParents: rawStats?.overview?.totalParents || rawStats?.users?.byRole?.parent || 0,
      totalClasses: rawStats?.overview?.totalClasses || rawStats?.classes?.total || 0,
      totalEnrollments: rawStats?.overview?.totalEnrollments || rawStats?.enrollments?.total || 0,
      totalTickets: rawStats?.overview?.totalTickets || rawStats?.tickets?.total || 0,
      activeTickets: rawStats?.overview?.activeTickets || (rawStats?.tickets?.open || 0) + (rawStats?.tickets?.inProgress || 0),
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !rawStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Failed to load dashboard statistics</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              +{stats.users.newThisWeek} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Teachers
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalTeachers}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.users.byRole.teacher || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Students
            </CardTitle>
            <UserCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.users.byRole.student || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Tickets
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overview.activeTickets}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.tickets.urgent} urgent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-xl font-bold">{stats.users.active}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <UserX className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Inactive</p>
                    <p className="text-xl font-bold">{stats.users.inactive}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Suspended</p>
                    <p className="text-xl font-bold">{stats.users.suspended}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-xl font-bold">{stats.users.newThisMonth}</p>
                  </div>
                </div>
              </div>

              {/* Verification Stats */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Email Verification Rate</span>
                  <span className="text-sm font-semibold">{stats.users.verificationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${stats.users.verificationRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {stats.users.verifiedEmails} of {stats.users.total} users verified
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Needs Attention */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">Urgent Tickets</p>
                  <p className="text-2xl font-bold text-red-600">{stats.tickets.urgent}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-8 w-8 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-900">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.tickets.highPriority}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Open Tickets</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.tickets.open}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Ticket Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-semibold">{stats.tickets.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Open</span>
                <span className="font-semibold text-blue-600">{stats.tickets.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-semibold text-yellow-600">{stats.tickets.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved</span>
                <span className="font-semibold text-green-600">{stats.tickets.resolved}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="font-semibold text-green-600">{stats.tickets.resolutionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes & Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle>Classes & Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Classes</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold">{stats.classes.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="font-semibold text-green-600">{stats.classes.active}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Enrollments</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="font-semibold">{stats.enrollments.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="font-semibold text-green-600">{stats.enrollments.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-semibold text-blue-600">{stats.enrollments.completed}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actions (7 days)</p>
                  <p className="text-xl font-bold">{stats.activity.recentActions}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Suspensions</p>
                  <p className="text-xl font-bold">{stats.activity.activeSuspensions}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">New Tickets (7 days)</p>
                  <p className="text-xl font-bold">{stats.tickets.newThisWeek}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>User Distribution by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.users.byRole.teacher || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Teachers</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.users.byRole.student || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Students</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{stats.users.byRole.parent || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Parents</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{stats.users.byRole.admin || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Admins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
