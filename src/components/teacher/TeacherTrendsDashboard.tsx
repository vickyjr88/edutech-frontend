import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import { teacherAnalyticsService, type TrendData, type TeacherTrends } from '@/integrations/api';

interface TeacherTrendsDashboardProps {
    teacherId: string;
    currentMetrics?: {
        engagement?: number;
        attendance?: number;
        satisfaction?: number;
        performance?: number;
        totalEnrollments?: number;
        activeEnrollments?: number;
    };
}

const TrendIndicator: React.FC<{ trend: TrendData | string }> = ({ trend }) => {
    if (typeof trend === 'string') {
        // Legacy format - just show the direction
        const getTrendIcon = (direction: string) => {
            switch (direction) {
                case 'improving':
                    return <TrendingUp className="h-4 w-4 text-green-600" />;
                case 'declining':
                    return <TrendingDown className="h-4 w-4 text-red-600" />;
                case 'stable':
                    return <Minus className="h-4 w-4 text-yellow-600" />;
                default:
                    return <Minus className="h-4 w-4 text-gray-600" />;
            }
        };

        const getTrendColor = (direction: string) => {
            switch (direction) {
                case 'improving':
                    return 'bg-green-100 text-green-800';
                case 'declining':
                    return 'bg-red-100 text-red-800';
                case 'stable':
                    return 'bg-yellow-100 text-yellow-800';
                default:
                    return 'bg-gray-100 text-gray-800';
            }
        };

        return (
            <Badge variant="outline" className={getTrendColor(trend)}>
                {getTrendIcon(trend)}
                <span className="ml-1 capitalize">{trend}</span>
            </Badge>
        );
    }

    // New detailed format
    const getTrendIcon = () => {
        switch (trend.direction) {
            case 'improving':
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case 'declining':
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            case 'stable':
                return <Minus className="h-4 w-4 text-yellow-600" />;
            default:
                return <Minus className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTrendColor = () => {
        switch (trend.direction) {
            case 'improving':
                return 'bg-green-100 text-green-800';
            case 'declining':
                return 'bg-red-100 text-red-800';
            case 'stable':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className={getTrendColor()}>
                {getTrendIcon()}
                <span className="ml-1 capitalize">{trend.direction}</span>
            </Badge>
            <span className="text-sm text-muted-foreground">
                {trend.changeValue > 0 ? '+' : ''}
                {trend.changeValue.toFixed(1)} ({trend.percentage.toFixed(1)}%)
            </span>
        </div>
    );
};

export const TeacherTrendsDashboard: React.FC<TeacherTrendsDashboardProps> = ({
    teacherId,
    currentMetrics,
}) => {
    const [trends, setTrends] = useState<TeacherTrends | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await teacherAnalyticsService.getTrends(teacherId, {
                    currentEngagement: currentMetrics?.engagement,
                    currentAttendance: currentMetrics?.attendance,
                    currentSatisfaction: currentMetrics?.satisfaction,
                    currentPerformance: currentMetrics?.performance,
                    totalEnrollments: currentMetrics?.totalEnrollments,
                    activeEnrollments: currentMetrics?.activeEnrollments,
                });
                setTrends(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load trends');
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, [teacherId, currentMetrics]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Analyzing your teaching performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!trends) {
        return null;
    }

    if (trends.message) {
        return (
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{trends.message}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>
                        Your teaching performance trends based on historical data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Student Engagement</span>
                                <TrendIndicator trend={trends.engagement} />
                            </div>
                            {trends.detailedTrends?.engagement && (
                                <div className="text-xs text-muted-foreground">
                                    Current: {trends.detailedTrends.engagement.currentValue.toFixed(1)} |
                                    Previous: {trends.detailedTrends.engagement.previousValue.toFixed(1)}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Attendance Rate</span>
                                <TrendIndicator trend={trends.attendance} />
                            </div>
                            {trends.detailedTrends?.attendance && (
                                <div className="text-xs text-muted-foreground">
                                    Current: {trends.detailedTrends.attendance.currentValue.toFixed(1)}% |
                                    Previous: {trends.detailedTrends.attendance.previousValue.toFixed(1)}%
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Student Satisfaction</span>
                                <TrendIndicator trend={trends.satisfaction} />
                            </div>
                            {trends.detailedTrends?.satisfaction && (
                                <div className="text-xs text-muted-foreground">
                                    Current: {trends.detailedTrends.satisfaction.currentValue.toFixed(1)} |
                                    Previous: {trends.detailedTrends.satisfaction.previousValue.toFixed(1)}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Overall Performance</span>
                                <TrendIndicator trend={trends.performance} />
                            </div>
                            {trends.detailedTrends?.performance && (
                                <div className="text-xs text-muted-foreground">
                                    Current: {trends.detailedTrends.performance.currentValue.toFixed(1)} |
                                    Previous: {trends.detailedTrends.performance.previousValue.toFixed(1)}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Week-over-Week Changes</CardTitle>
                    <CardDescription>Comparing this week to last week</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                            <div className="text-sm font-medium">Engagement</div>
                            <div className={`text-2xl font-bold ${trends.weekOverWeek.engagement > 0 ? 'text-green-600' :
                                    trends.weekOverWeek.engagement < 0 ? 'text-red-600' :
                                        'text-yellow-600'
                                }`}>
                                {trends.weekOverWeek.engagement > 0 ? '+' : ''}
                                {trends.weekOverWeek.engagement}%
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm font-medium">Attendance</div>
                            <div className={`text-2xl font-bold ${trends.weekOverWeek.attendance > 0 ? 'text-green-600' :
                                    trends.weekOverWeek.attendance < 0 ? 'text-red-600' :
                                        'text-yellow-600'
                                }`}>
                                {trends.weekOverWeek.attendance > 0 ? '+' : ''}
                                {trends.weekOverWeek.attendance}%
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm font-medium">New Enrollments</div>
                            <div className="text-2xl font-bold text-blue-600">
                                +{trends.weekOverWeek.newEnrollments}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {trends.monthOverMonth && (
                <Card>
                    <CardHeader>
                        <CardTitle>Month-over-Month Changes</CardTitle>
                        <CardDescription>Comparing this month to last month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Engagement</div>
                                <div className={`text-xl font-bold ${trends.monthOverMonth.engagement > 0 ? 'text-green-600' :
                                        trends.monthOverMonth.engagement < 0 ? 'text-red-600' :
                                            'text-yellow-600'
                                    }`}>
                                    {trends.monthOverMonth.engagement > 0 ? '+' : ''}
                                    {trends.monthOverMonth.engagement}%
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm font-medium">Attendance</div>
                                <div className={`text-xl font-bold ${trends.monthOverMonth.attendance > 0 ? 'text-green-600' :
                                        trends.monthOverMonth.attendance < 0 ? 'text-red-600' :
                                            'text-yellow-600'
                                    }`}>
                                    {trends.monthOverMonth.attendance > 0 ? '+' : ''}
                                    {trends.monthOverMonth.attendance}%
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm font-medium">Satisfaction</div>
                                <div className={`text-xl font-bold ${trends.monthOverMonth.satisfaction > 0 ? 'text-green-600' :
                                        trends.monthOverMonth.satisfaction < 0 ? 'text-red-600' :
                                            'text-yellow-600'
                                    }`}>
                                    {trends.monthOverMonth.satisfaction > 0 ? '+' : ''}
                                    {trends.monthOverMonth.satisfaction}%
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm font-medium">Performance</div>
                                <div className={`text-xl font-bold ${trends.monthOverMonth.performance > 0 ? 'text-green-600' :
                                        trends.monthOverMonth.performance < 0 ? 'text-red-600' :
                                            'text-yellow-600'
                                    }`}>
                                    {trends.monthOverMonth.performance > 0 ? '+' : ''}
                                    {trends.monthOverMonth.performance}%
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
