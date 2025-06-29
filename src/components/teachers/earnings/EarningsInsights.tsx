import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Zap, 
  Users, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  Award,
  Lightbulb,
  CheckCircle2,
  Layers,
  MessageSquare,
  BookOpen,
  DollarSign,
  PieChart,
  Download,
  Loader2
} from "lucide-react";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";
import { useTeacherBalance } from "@/hooks/useTeacherBalance";

// Mock insights data
const mockInsightsData = {
  earningsGoal: {
    current: 4250.75,
    target: 10000,
    progress: 42.5
  },
  metrics: {
    averageClassPrice: 125,
    studentsPerClass: 8,
    studentRetentionRate: 85,
    classesPerMonth: 12,
    averageReview: 4.8,
    repeatBookingRate: 72
  },
  growthOpportunities: [
    {
      id: 1,
      title: "Increase Your Class Pricing",
      description: "Your class prices are below the platform average for your subject. Consider increasing prices by 10-15%.",
      impact: "high",
      effort: "low",
      status: "pending",
      type: "pricing"
    },
    {
      id: 2,
      title: "Create Advanced Level Classes",
      description: "Students who complete your beginner classes have nowhere to go. Create advanced classes to retain them.",
      impact: "high",
      effort: "high",
      status: "completed",
      type: "offerings"
    },
    {
      id: 3,
      title: "Improve Class Descriptions",
      description: "Adding more detailed descriptions with learning outcomes increases enrollment rates by up to 25%.",
      impact: "medium",
      effort: "low",
      status: "pending",
      type: "marketing"
    },
    {
      id: 4,
      title: "Request Reviews from Students",
      description: "You have 12 students who haven't left reviews. More reviews improve your visibility on the platform.",
      impact: "medium",
      effort: "low",
      status: "in_progress",
      type: "marketing"
    },
    {
      id: 5,
      title: "Add Weekend Class Options",
      description: "Our data shows high demand for weekend classes in your subject area. This could increase enrollments.",
      impact: "high",
      effort: "medium",
      status: "pending",
      type: "scheduling"
    },
    {
      id: 6,
      title: "Optimize Unused Time Slots",
      description: "You have several open weekday evening slots that are in high demand for your subject area.",
      impact: "medium",
      effort: "low",
      status: "pending",
      type: "scheduling"
    }
  ],
  revenueBreakdown: {
    bySubject: [
      { name: "Mathematics", percentage: 45 },
      { name: "Science", percentage: 30 },
      { name: "English", percentage: 15 },
      { name: "History", percentage: 10 }
    ],
    byClassType: [
      { name: "Group Classes", percentage: 65 },
      { name: "Private Tutoring", percentage: 25 },
      { name: "Workshops", percentage: 10 }
    ],
    byStudentLevel: [
      { name: "Beginner", percentage: 35 },
      { name: "Intermediate", percentage: 40 },
      { name: "Advanced", percentage: 25 }
    ]
  }
};

// Helper components
const ImpactBadge = ({ impact }: { impact: string }) => {
  const colors = {
    high: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    low: "bg-gray-100 text-gray-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[impact as keyof typeof colors]}`}>
      {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
    </span>
  );
};

const EffortBadge = ({ effort }: { effort: string }) => {
  const colors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-amber-100 text-amber-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[effort as keyof typeof colors]}`}>
      {effort.charAt(0).toUpperCase() + effort.slice(1)} Effort
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    pending: "bg-gray-100 text-gray-800"
  };
  
  const labels = {
    completed: "Completed",
    in_progress: "In Progress",
    pending: "Not Started"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
};

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "pricing":
      return <DollarSign className="h-5 w-5 text-green-600" />;
    case "offerings":
      return <Layers className="h-5 w-5 text-purple-600" />;
    case "marketing":
      return <MessageSquare className="h-5 w-5 text-blue-600" />;
    case "scheduling":
      return <Calendar className="h-5 w-5 text-amber-600" />;
    default:
      return <Lightbulb className="h-5 w-5 text-gray-600" />;
  }
};

const EarningsInsights = () => {
  const [activeTab, setActiveTab] = useState("opportunities");
  const { analytics, isLoading, error } = useTeacherAnalytics();
  const { balance, isLoading: balanceLoading } = useTeacherBalance();

  if (isLoading || balanceLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-red-600">Error loading insights: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-gray-500">No data available for insights</div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Earnings Goal Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Earnings Goal</CardTitle>
              <CardDescription>Track your progress toward your revenue target</CardDescription>
            </div>
            <Button variant="outline" size="sm">Edit Goal</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">${analytics.totalEarnings.toFixed(2)}</div>
              <div className="text-right">
                <span className="text-sm text-gray-500">of </span>
                <span className="font-medium">$10,000</span>
              </div>
            </div>
            
            <Progress
              value={(analytics.totalEarnings / 10000) * 100}
              className="h-3"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <div>{((analytics.totalEarnings / 10000) * 100).toFixed(1)}% complete</div>
              <div>${(10000 - analytics.totalEarnings).toFixed(2)} to go</div>
            </div>
            
            <div className="pt-2">
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-800 flex items-start">
                <Zap className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">On track to exceed your goal!</p>
                  <p>At your current pace, you'll reach your goal 15 days ahead of schedule. Consider setting a more ambitious target for the next period.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Metrics Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Performance indicators that affect your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                  Average Class Price
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  5%
                </div>
              </div>
              <div className="text-2xl font-semibold">${analytics.averageClassPrice}</div>
              <div className="text-xs text-gray-500">Platform average: $110</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-blue-500" />
                  Students per Class
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  {analytics.studentsPerClass >= 10 ? '+' : ''}
                  {((analytics.studentsPerClass - 10) / 10 * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-2xl font-semibold">{analytics.studentsPerClass}</div>
              <div className="text-xs text-gray-500">Platform average: 10</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-purple-500" />
                  Student Retention
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  {((analytics.studentRetentionRate - 70) / 70 * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-2xl font-semibold">{analytics.studentRetentionRate}%</div>
              <div className="text-xs text-gray-500">Platform average: 70%</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                  Active Classes
                </div>
                <div className="flex items-center text-blue-600 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  Current
                </div>
              </div>
              <div className="text-2xl font-semibold">{analytics.activeClasses}</div>
              <div className="text-xs text-gray-500">With enrolled students</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-amber-500" />
                  Average Rating
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  Great
                </div>
              </div>
              <div className="text-2xl font-semibold">{analytics.averageReview.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Platform average: 4.5</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-teal-500" />
                  Total Students
                </div>
                <div className="flex items-center text-green-600 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  Active
                </div>
              </div>
              <div className="text-2xl font-semibold">{analytics.totalStudents}</div>
              <div className="text-xs text-gray-500">Enrolled students</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Growth Opportunities and Revenue Analysis Tabs */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Earnings Growth</CardTitle>
          <CardDescription>Insights and analysis to help you increase your revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="opportunities" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Growth Opportunities
              </TabsTrigger>
              <TabsTrigger value="revenue" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Revenue Breakdown
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="opportunities" className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockInsightsData.growthOpportunities.map((opportunity) => (
                  <div 
                    key={opportunity.id} 
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <TypeIcon type={opportunity.type} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{opportunity.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          {opportunity.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <ImpactBadge impact={opportunity.impact} />
                          <EffortBadge effort={opportunity.effort} />
                          <StatusBadge status={opportunity.status} />
                        </div>
                      </div>
                    </div>
                    
                    {opportunity.status !== "completed" && (
                      <div className="mt-4 pt-3 border-t flex justify-end">
                        <Button size="sm">
                          {opportunity.status === "in_progress" ? (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          ) : (
                            <TrendingUp className="h-4 w-4 mr-2" />
                          )}
                          {opportunity.status === "in_progress" ? "Mark as Complete" : "Start Working On This"}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t text-center">
                <p className="text-sm text-gray-500 mb-3">
                  Want more personalized insights to boost your earnings?
                </p>
                <Button variant="outline">Schedule a Growth Strategy Call</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="revenue" className="space-y-8">
              <div>
                <h3 className="text-sm font-medium mb-4">Revenue by Subject</h3>
                <div className="space-y-3">
                  {analytics.revenueBreakdown.bySubject.length > 0 ? (
                    analytics.revenueBreakdown.bySubject.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.percentage.toFixed(1)}% (${item.amount.toFixed(0)})</span>
                        </div>
                        <Progress
                          value={item.percentage}
                          className="h-2"
                          style={{
                            background: '#e5e7eb',
                            ['--tw-progress-fill' as any]: `hsl(${210 + index * 30}, 80%, 60%)`
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No subject data available yet
                    </div>
                  )}
                </div>
                {analytics.revenueBreakdown.bySubject.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    {analytics.revenueBreakdown.bySubject[0]?.name} is your highest earning subject. Consider expanding your offerings in this area.
                  </p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4">Revenue by Class Type</h3>
                <div className="space-y-3">
                  {analytics.revenueBreakdown.byClassType.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.percentage}% (${item.amount.toFixed(0)})</span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-2"
                        style={{
                          background: '#e5e7eb',
                          ['--tw-progress-fill' as any]: `hsl(${120 + index * 60}, 70%, 50%)`
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {analytics.revenueBreakdown.byClassType[0]?.name} generates the most revenue. Consider optimizing this class type.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4">Revenue by Student Level</h3>
                <div className="space-y-3">
                  {analytics.revenueBreakdown.byStudentLevel.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.percentage}% (${item.amount.toFixed(0)})</span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-2"
                        style={{
                          background: '#e5e7eb',
                          ['--tw-progress-fill' as any]: `hsl(${280 + index * 40}, 70%, 60%)`
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {analytics.revenueBreakdown.byStudentLevel[2]?.name} level classes may have higher per-student rates. Consider creating more advanced offerings.
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t flex justify-center">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Revenue Report
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Educational Resources */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Earnings Resources</CardTitle>
          <CardDescription>Educational content to help you maximize your income</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium mb-1">Pricing Strategies Guide</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to price your classes optimally to maximize both enrollment and revenue.
                </p>
                <Button variant="outline" size="sm" className="w-full">Read Guide</Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-medium mb-1">Scheduling for Success</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Discover the best times to schedule your classes for maximum enrollment and attendance.
                </p>
                <Button variant="outline" size="sm" className="w-full">Watch Video</Button>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-medium mb-1">Student Retention Tactics</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Strategies to keep students coming back and increase your repeat booking rate.
                </p>
                <Button variant="outline" size="sm" className="w-full">Read Article</Button>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <Button variant="link" className="text-sm">
                View All Resources
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsInsights;