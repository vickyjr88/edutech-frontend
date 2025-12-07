import { api } from '../client';

export interface TrendData {
    direction: 'improving' | 'stable' | 'declining';
    percentage: number;
    currentValue: number;
    previousValue: number;
    changeValue: number;
}

export interface TeacherTrends {
    engagement: TrendData | string;
    attendance: TrendData | string;
    satisfaction: TrendData | string;
    performance: TrendData | string;
    weekOverWeek: {
        engagement: number;
        attendance: number;
        newEnrollments: number;
    };
    monthOverMonth?: {
        engagement: number;
        attendance: number;
        satisfaction: number;
        performance: number;
    };
    detailedTrends?: {
        engagement: TrendData;
        attendance: TrendData;
        satisfaction: TrendData;
        performance: TrendData;
    } | null;
    message?: string;
}

export interface HistoricalTrendData {
    date: Date;
    engagement: number;
    attendance: number;
    satisfaction: number;
    performance: number;
    enrollments: number;
    activeCohorts: number;
}

export interface TrendSummary {
    hasData: boolean;
    message?: string;
    period?: {
        start: Date;
        end: Date;
        days: number;
    };
    trends?: {
        engagement: TrendData;
        attendance: TrendData;
        satisfaction: TrendData;
        performance: TrendData;
    };
    averages?: {
        engagement: number;
        attendance: number;
        satisfaction: number;
        performance: number;
    };
}

export interface TrendMetrics {
    currentEngagement?: number;
    currentAttendance?: number;
    currentSatisfaction?: number;
    currentPerformance?: number;
    totalEnrollments?: number;
    activeEnrollments?: number;
}

export const teacherAnalyticsService = {
    /**
     * Get teacher trend data
     */
    async getTrends(
        teacherId: string,
        metrics?: TrendMetrics,
    ): Promise<TeacherTrends> {
        const params = new URLSearchParams();

        if (metrics) {
            if (metrics.currentEngagement !== undefined) {
                params.append('currentEngagement', metrics.currentEngagement.toString());
            }
            if (metrics.currentAttendance !== undefined) {
                params.append('currentAttendance', metrics.currentAttendance.toString());
            }
            if (metrics.currentSatisfaction !== undefined) {
                params.append('currentSatisfaction', metrics.currentSatisfaction.toString());
            }
            if (metrics.currentPerformance !== undefined) {
                params.append('currentPerformance', metrics.currentPerformance.toString());
            }
            if (metrics.totalEnrollments !== undefined) {
                params.append('totalEnrollments', metrics.totalEnrollments.toString());
            }
            if (metrics.activeEnrollments !== undefined) {
                params.append('activeEnrollments', metrics.activeEnrollments.toString());
            }
        }

        const queryString = params.toString();
        const url = `/teacher-analytics/${teacherId}/trends${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<TeacherTrends>(url);
        return response.data;
    },

    /**
     * Get historical trend data for charts
     */
    async getHistoricalTrends(
        teacherId: string,
        days: number = 30,
    ): Promise<HistoricalTrendData[]> {
        const response = await api.get<HistoricalTrendData[]>(
            `/teacher-analytics/${teacherId}/historical`,
            {
                params: { days },
            },
        );
        return response.data;
    },

    /**
     * Get trend summary
     */
    async getTrendSummary(teacherId: string): Promise<TrendSummary> {
        const response = await api.get<TrendSummary>(
            `/teacher-analytics/${teacherId}/summary`,
        );
        return response.data;
    },

    /**
     * Helper function to get trend icon based on direction
     */
    getTrendIcon(direction: 'improving' | 'stable' | 'declining'): string {
        switch (direction) {
            case 'improving':
                return '📈';
            case 'declining':
                return '📉';
            case 'stable':
                return '➡️';
            default:
                return '➡️';
        }
    },

    /**
     * Helper function to get trend color based on direction
     */
    getTrendColor(direction: 'improving' | 'stable' | 'declining'): string {
        switch (direction) {
            case 'improving':
                return 'text-green-600';
            case 'declining':
                return 'text-red-600';
            case 'stable':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    },

    /**
     * Helper function to format trend percentage
     */
    formatTrendPercentage(percentage: number, showSign: boolean = true): string {
        const sign = showSign && percentage > 0 ? '+' : '';
        return `${sign}${percentage.toFixed(1)}%`;
    },

    /**
     * Helper function to format trend value
     */
    formatTrendValue(value: number, decimals: number = 1): string {
        return value.toFixed(decimals);
    },
};
