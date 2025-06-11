import React, { useState, useMemo } from "react";
import {
  BarChart3, TrendingUp, Clock, CheckCircle, MessageCircle,
  Users, Eye, Reply, Timer, Calendar, Filter, Download,
  AlertTriangle, Star, Zap, Target, Activity, Mail,
  Phone, Bell, ChevronDown, MoreHorizontal
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

const MOCK_CAMPAIGNS: MessageCampaign[] = [
  {
    id: '1',
    title: 'Weekly Assignment Reminder',
    type: 'Check-in',
    sentAt: '2024-01-15 09:00:00',
    recipients: 32,
    status: 'completed',
    platforms: ['whatsapp', 'email'],
    metrics: {
      sent: 32,
      delivered: 31,
      read: 28,
      responded: 24,
      responseRate: 75,
      avgResponseTime: '2.5 hours',
      platformBreakdown: {
        whatsapp: { sent: 20, delivered: 20, read: 19, responded: 18 },
        email: { sent: 12, delivered: 11, read: 9, responded: 6 },
        app: { sent: 0, delivered: 0, read: 0, responded: 0 }
      }
    }
  },
  {
    id: '2',
    title: 'Celebration Message - Test Results',
    type: 'Celebration',
    sentAt: '2024-01-14 15:30:00',
    recipients: 15,
    status: 'completed',
    platforms: ['whatsapp', 'app'],
    metrics: {
      sent: 15,
      delivered: 15,
      read: 15,
      responded: 14,
      responseRate: 93,
      avgResponseTime: '45 minutes',
      platformBreakdown: {
        whatsapp: { sent: 10, delivered: 10, read: 10, responded: 10 },
        email: { sent: 0, delivered: 0, read: 0, responded: 0 },
        app: { sent: 5, delivered: 5, read: 5, responded: 4 }
      }
    }
  },
  {
    id: '3',
    title: 'Support Offer - Struggling Students',
    type: 'Support',
    sentAt: '2024-01-13 14:00:00',
    recipients: 8,
    status: 'active',
    platforms: ['whatsapp', 'email'],
    metrics: {
      sent: 8,
      delivered: 8,
      read: 6,
      responded: 3,
      responseRate: 38,
      avgResponseTime: '6.2 hours',
      platformBreakdown: {
        whatsapp: { sent: 5, delivered: 5, read: 4, responded: 3 },
        email: { sent: 3, delivered: 3, read: 2, responded: 0 },
        app: { sent: 0, delivered: 0, read: 0, responded: 0 }
      }
    }
  }
];

const MOCK_STUDENT_ENGAGEMENT: StudentEngagement[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar: 'EJ',
    totalMessages: 12,
    responseRate: 92,
    avgResponseTime: '1.2 hours',
    lastEngagement: '2 hours ago',
    preferredPlatform: 'whatsapp',
    status: 'highly-engaged'
  },
  {
    id: '2',
    name: 'Michael Torres',
    avatar: 'MT',
    totalMessages: 8,
    responseRate: 100,
    avgResponseTime: '25 minutes',
    lastEngagement: '1 day ago',
    preferredPlatform: 'whatsapp',
    status: 'highly-engaged'
  },
  {
    id: '3',
    name: 'Sophia Chen',
    avatar: 'SC',
    totalMessages: 15,
    responseRate: 47,
    avgResponseTime: '8.5 hours',
    lastEngagement: '1 week ago',
    preferredPlatform: 'email',
    status: 'low-engagement'
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'DK',
    totalMessages: 6,
    responseRate: 0,
    avgResponseTime: 'N/A',
    lastEngagement: '3 weeks ago',
    preferredPlatform: 'app',
    status: 'non-responsive'
  }
];

export const MessageAnalyticsDashboard: React.FC<MessageAnalyticsDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'campaigns' | 'engagement'>('overview');

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totals = MOCK_CAMPAIGNS.reduce((acc, campaign) => ({
      sent: acc.sent + campaign.metrics.sent,
      delivered: acc.delivered + campaign.metrics.delivered,
      read: acc.read + campaign.metrics.read,
      responded: acc.responded + campaign.metrics.responded
    }), { sent: 0, delivered: 0, read: 0, responded: 0 });

    return {
      ...totals,
      responseRate: totals.sent > 0 ? Math.round((totals.responded / totals.sent) * 100) : 0,
      deliveryRate: totals.sent > 0 ? Math.round((totals.delivered / totals.sent) * 100) : 0,
      readRate: totals.delivered > 0 ? Math.round((totals.read / totals.delivered) * 100) : 0
    };
  }, []);

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

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">{overallMetrics.sent}</p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
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
                <p className="text-2xl font-bold text-[#2ed573]">{overallMetrics.responseRate}%</p>
                <p className="text-xs text-green-600 mt-1">+5% vs last month</p>
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
                <p className="text-2xl font-bold text-[#f99325]">2.8h</p>
                <p className="text-xs text-green-600 mt-1">-15 min improvement</p>
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
                <p className="text-2xl font-bold text-[#5e6ad2]">127</p>
                <p className="text-xs text-gray-500 mt-1">89% engagement rate</p>
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
              { platform: 'WhatsApp', responseRate: 89, deliveryRate: 98, icon: MessageCircle, color: '#25D366' },
              { platform: 'Email', responseRate: 45, deliveryRate: 92, icon: Mail, color: '#EA4335' },
              { platform: 'App Notifications', responseRate: 67, deliveryRate: 95, icon: Bell, color: '#5e6ad2' }
            ].map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: platform.color }} />
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <span className="text-sm text-gray-600">{platform.responseRate}% response</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Response Rate</span>
                        <span>{platform.responseRate}%</span>
                      </div>
                      <Progress value={platform.responseRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Delivery Rate</span>
                        <span>{platform.deliveryRate}%</span>
                      </div>
                      <Progress value={platform.deliveryRate} className="h-2" />
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
            {[
              { template: 'Achievement Praise', responseRate: 95, category: 'Celebration' },
              { template: 'Assignment Reminder', responseRate: 87, category: 'Check-in' },
              { template: 'Support Offer', responseRate: 82, category: 'Support' },
              { template: 'Class Announcement', responseRate: 76, category: 'Information' }
            ].map((template, index) => (
              <div key={template.template} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{template.template}</p>
                  <Badge variant="outline" className="text-xs mt-1">{template.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2ed573]">{template.responseRate}%</p>
                  <p className="text-xs text-gray-500">response rate</p>
                </div>
              </div>
            ))}
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
              {[
                { type: 'response', student: 'Emma Johnson', message: 'Replied to assignment reminder', time: '2 mins ago', status: 'positive' },
                { type: 'read', student: 'Michael Torres', message: 'Read celebration message', time: '15 mins ago', status: 'neutral' },
                { type: 'sent', student: 'Sophia Chen', message: 'Sent support offer message', time: '1 hour ago', status: 'pending' },
                { type: 'response', student: 'Aisha Patel', message: 'Responded to check-in', time: '2 hours ago', status: 'positive' },
                { type: 'delivery', student: 'Alex Mboya', message: 'Message delivered via WhatsApp', time: '3 hours ago', status: 'neutral' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#5e6ad2] text-white text-xs">
                      {activity.student.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.message}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <div className={`w-2 h-2 rounded-full mt-1 ${
                      activity.status === 'positive' ? 'bg-[#2ed573]' :
                      activity.status === 'pending' ? 'bg-[#f99325]' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

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
        {MOCK_CAMPAIGNS.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{campaign.title}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline">{campaign.type}</Badge>
                    <span className="text-sm text-gray-600">{campaign.recipients} recipients</span>
                    <span className="text-sm text-gray-600">{new Date(campaign.sentAt).toLocaleDateString()}</span>
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
        ))}
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
            <DropdownMenuItem>All Students</DropdownMenuItem>
            <DropdownMenuItem>Highly Engaged</DropdownMenuItem>
            <DropdownMenuItem>Low Engagement</DropdownMenuItem>
            <DropdownMenuItem>Non-Responsive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_STUDENT_ENGAGEMENT.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#5e6ad2] text-white">
                    {student.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{student.name}</h4>
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
                  <span className="font-medium">{student.totalMessages}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-medium">{student.avgResponseTime}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Engagement</span>
                  <span className="font-medium">{student.lastEngagement}</span>
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
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

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