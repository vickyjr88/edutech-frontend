import React, { useState, useMemo } from "react";
import {
  BarChart3, TrendingUp, Clock, CheckCircle, MessageCircle,
  Users, Eye, Reply, Timer, Calendar, Filter, Download,
  AlertTriangle, Star, Zap, Target, Activity, Mail,
  Phone, Bell, ChevronDown, MoreHorizontal, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetCampaigns,
  useGetOverallAnalytics,
  useGetStudentEngagement,
  useGetBestTemplates,
  useGetRecentActivity,
} from "@/hooks/use-message-analytics";
import { EngagementStatus } from "@/integrations/api/services/message-analytics.service";

interface MessageMetrics {
  sent: number;
  delivered: number;
  read: number;
  responded: number;
  responseRate: number;
  avgResponseTime: string;
  platformBreakdown: {
    whatsapp: { sent: number; delivered: number; read: number; responded: number };
    email: { sent: number; delivered: number; read: number; responded: number };
    app: { sent: number; delivered: number; read: number; responded: number };
  };
}

interface MessageCampaign {
  id: string;
  title: string;
  type: string;
  sentAt: string;
  recipients: number;
  metrics: MessageMetrics;
  status: 'active' | 'completed' | 'scheduled';
  platforms: string[];
}

interface StudentEngagement {
  id: string;
  name: string;
  avatar: string;
  totalMessages: number;
  responseRate: number;
  avgResponseTime: string;
  lastEngagement: string;
  preferredPlatform: string;
  status: 'highly-engaged' | 'moderate' | 'low-engagement' | 'non-responsive';
}

interface MessageAnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageAnalyticsDashboard: React.FC<MessageAnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'campaigns' | 'engagement'>('overview');
  const [engagementFilter, setEngagementFilter] = useState<EngagementStatus | undefined>(undefined);

  // Fetch data using API hooks
  const { data: campaignsData, isLoading: campaignsLoading } = useGetCampaigns();
  const { data: overallData, isLoading: overallLoading } = useGetOverallAnalytics();
  const { data: engagementData, isLoading: engagementLoading } = useGetStudentEngagement({
    engagementStatus: engagementFilter,
  });
  const { data: bestTemplatesData, isLoading: templatesLoading } = useGetBestTemplates(4);
  const { data: recentActivityData, isLoading: activityLoading } = useGetRecentActivity(5);

  const isLoading = overallLoading || campaignsLoading || engagementLoading;

  // Extract data from API responses
  const campaigns = campaignsData?.data?.campaigns || [];
  const overall = overallData?.data;
  const students = engagementData?.data?.students || [];
  const bestTemplates = bestTemplatesData?.data || [];
  const recentActivities = recentActivityData?.data || [];

  // Helper functions
  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.round(diffDays / 7)} weeks ago`;
  };

  const getStatusColor = (status: StudentEngagement['status']) => {
    switch (status) {
      case 'highly-engaged': return 'bg-[#2ed573] text-white';
      case 'moderate': return 'bg-[#5e6ad2] text-white';
      case 'low-engagement': return 'bg-[#f99325] text-white';
      case 'non-responsive': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return MessageCircle;
      case 'email': return Mail;
      case 'app': return Bell;
      default: return MessageCircle;
    }
  };

  const renderOverviewTab = () => {
    if (!overall) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">No analytics data available yet. Start by creating your first message campaign!</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{overall.totalMessagesSent}</p>
                  <p className="text-xs text-gray-500 mt-1">{overall.totalCampaigns} campaigns</p>
                </div>
                <div className="w-12 h-12 bg-[#5e6ad2]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#5e6ad2]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-[#2ed573]">{overall.responseRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">{overall.deliveryRate}% delivered</p>
                </div>
                <div className="w-12 h-12 bg-[#2ed573]/10 rounded-full flex items-center justify-center">
                  <Reply className="w-6 h-6 text-[#2ed573]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-[#f99325]">{overall.avgResponseTimeFormatted}</p>
                  <p className="text-xs text-gray-500 mt-1">{overall.readRate}% read rate</p>
                </div>
                <div className="w-12 h-12 bg-[#f99325]/10 rounded-full flex items-center justify-center">
                  <Timer className="w-6 h-6 text-[#f99325]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-[#5e6ad2]">{overall.activeStudents}</p>
                  <p className="text-xs text-gray-500 mt-1">{overall.totalResponded} responses</p>
                </div>
                <div className="w-12 h-12 bg-[#5e6ad2]/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#5e6ad2]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#5e6ad2]" />
                Platform Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { platform: 'WhatsApp', key: 'whatsapp', icon: MessageCircle, color: '#25D366' },
                { platform: 'Email', key: 'email', icon: Mail, color: '#EA4335' },
                { platform: 'SMS', key: 'sms', icon: Phone, color: '#00D9FF' },
                { platform: 'App Notifications', key: 'app', icon: Bell, color: '#5e6ad2' }
              ].map((platform) => {
                const metrics = overall.platformBreakdown[platform.key as keyof typeof overall.platformBreakdown];
                const Icon = platform.icon;
                if (!metrics || metrics.sent === 0) return null;

                return (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: platform.color }} />
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <span className="text-sm text-gray-600">{metrics.responseRate}% response</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Response Rate</span>
                          <span>{metrics.responseRate}%</span>
                        </div>
                        <Progress value={metrics.responseRate} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Delivery Rate</span>
                          <span>{metrics.deliveryRate}%</span>
                        </div>
                        <Progress value={metrics.deliveryRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2ed573]" />
                Best Performing Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bestTemplates.length > 0 ? (
                bestTemplates.map((template) => (
                  <div key={template.template} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{template.template}</p>
                      <Badge variant="outline" className="text-xs mt-1">{template.type}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#2ed573]">{template.responseRate}%</p>
                      <p className="text-xs text-gray-500">response rate</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">No completed campaigns yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#5e6ad2]" />
              Recent Message Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => {
                    const studentName = `${activity.student.firstName} ${activity.student.lastName}`;
                    const initials = activity.student.firstName[0] + activity.student.lastName[0];

                    return (
                      <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          {activity.student.avatar ? (
                            <AvatarImage src={activity.student.avatar} alt={studentName} />
                          ) : null}
                          <AvatarFallback className="bg-[#5e6ad2] text-white text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{studentName}</p>
                          <p className="text-xs text-gray-600 truncate">
                            {activity.type} - {activity.campaign}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{formatTime(activity.eventTime)}</p>
                          <div className={`w-2 h-2 rounded-full mt-1 ${activity.type === 'responded' ? 'bg-[#2ed573]' :
                              activity.type === 'sent' ? 'bg-[#f99325]' : 'bg-gray-400'
                            }`} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">No recent activity</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Message Campaigns</h3>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="space-y-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card key={campaign._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">{campaign.type}</Badge>
                      <span className="text-sm text-gray-600">{campaign.recipientCount} recipients</span>
                      {campaign.sentAt && (
                        <span className="text-sm text-gray-600">{new Date(campaign.sentAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <Badge className={campaign.status === 'completed' ? 'bg-[#2ed573]' :
                    campaign.status === 'active' ? 'bg-[#f99325]' : 'bg-gray-500'}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{campaign.metrics.sent}</p>
                    <p className="text-sm text-gray-600">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#5e6ad2]">{campaign.metrics.delivered}</p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#f99325]">{campaign.metrics.read}</p>
                    <p className="text-sm text-gray-600">Read</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#2ed573]">{campaign.metrics.responded}</p>
                    <p className="text-sm text-gray-600">Responded</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Platforms:</span>
                    <div className="flex gap-1">
                      {campaign.platforms.map((platform) => {
                        const Icon = getPlatformIcon(platform);
                        return (
                          <Icon key={platform} className="w-4 h-4 text-gray-400" />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[#2ed573]">
                      {campaign.metrics.responseRate}% response rate
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate Campaign</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center py-12">No campaigns yet. Create your first campaign to start tracking!</p>
        )}
      </div>
    </div>
  );

  const renderEngagementTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Student Engagement</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEngagementFilter(undefined)}>All Students</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEngagementFilter(EngagementStatus.HIGHLY_ENGAGED)}>
              Highly Engaged
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEngagementFilter(EngagementStatus.LOW_ENGAGEMENT)}>
              Low Engagement
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEngagementFilter(EngagementStatus.NON_RESPONSIVE)}>
              Non-Responsive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length > 0 ? (
          students.map((student) => {
            const studentName = `${student.student.firstName} ${student.student.lastName}`;
            const initials = student.student.firstName[0] + student.student.lastName[0];

            return (
              <Card key={student._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      {student.student.avatar ? (
                        <AvatarImage src={student.student.avatar} alt={studentName} />
                      ) : null}
                      <AvatarFallback className="bg-[#5e6ad2] text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{studentName}</h4>
                      <Badge className={`text-xs ${getStatusColor(student.status)}`}>
                        {student.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-medium">{student.responseRate}%</span>
                    </div>
                    <Progress value={student.responseRate} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Messages</span>
                      <span className="font-medium">{student.totalMessagesSent}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg Response Time</span>
                      <span className="font-medium">
                        {student.avgResponseTime > 0 ? `${Math.round(student.avgResponseTime / 60)} hours` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Engagement</span>
                      <span className="font-medium">
                        {student.lastResponse ? formatTime(student.lastResponse) : 'Never'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Preferred Platform</span>
                      <div className="flex items-center gap-1">
                        {React.createElement(getPlatformIcon(student.preferredPlatform), {
                          className: "w-4 h-4"
                        })}
                        <span className="font-medium capitalize">{student.preferredPlatform}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <p className="text-gray-500 text-center py-12">
              No student engagement data yet. Send messages to students to track their engagement!
            </p>
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#5e6ad2]" />
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#ededf4] rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="bg-white/60 backdrop-blur-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#5e6ad2] to-[#abb4dd] rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Message Analytics</h2>
                <p className="text-gray-600">Track performance and engagement across all communications</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab as any} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md bg-white/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(90vh-200px)]">
              <TabsContent value="overview" className="mt-0">
                {renderOverviewTab()}
              </TabsContent>
              <TabsContent value="campaigns" className="mt-0">
                {renderCampaignsTab()}
              </TabsContent>
              <TabsContent value="engagement" className="mt-0">
                {renderEngagementTab()}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
};