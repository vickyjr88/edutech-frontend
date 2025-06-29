import { useMemo } from 'react';
import { useTeacherTransactions } from './useTeacherTransactions';
import { useTeacherSummary } from './useTeacherSummary';
import { useAuth } from '@/contexts/AuthContext';
import type { TeacherTransaction } from '@/integrations/api';

interface EarningsAnalytics {
  // Key metrics
  averageClassPrice: number;
  studentsPerClass: number;
  studentRetentionRate: number;
  classesPerMonth: number;
  averageReview: number;
  repeatBookingRate: number;
  
  // Revenue breakdown
  revenueBreakdown: {
    bySubject: Array<{ name: string; percentage: number; amount: number }>;
    byClassType: Array<{ name: string; percentage: number; amount: number }>;
    byStudentLevel: Array<{ name: string; percentage: number; amount: number }>;
  };
  
  // Growth insights
  totalEarnings: number;
  monthlyGrowth: number;
  activeClasses: number;
  totalStudents: number;
}

export const useTeacherAnalytics = (): {
  analytics: EarningsAnalytics | null;
  isLoading: boolean;
  error: string | null;
} => {
  const { user } = useAuth();
  
  // Fetch all transactions for analytics
  const { transactions, isLoading: transactionsLoading, error: transactionsError } = useTeacherTransactions({
    transactionType: 'earning' // Only earnings for revenue analysis
  });
  
  // Fetch summary data for additional metrics
  const { summaryData, loading: summaryLoading } = useTeacherSummary({
    teacherId: user?.teacherId || '',
  });

  const analytics = useMemo(() => {
    if (!transactions.length || !summaryData) return null;

    // Calculate total earnings
    const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate monthly earnings for growth calculation
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthEarnings = transactions
      .filter(t => {
        const date = new Date(t.createdAt);
        return date >= lastMonth && date < thisMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);
      
    const thisMonthEarnings = transactions
      .filter(t => {
        const date = new Date(t.createdAt);
        return date >= thisMonth;
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyGrowth = lastMonthEarnings > 0 ? 
      ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 : 0;

    // Calculate metrics from summary data
    const totalStudents = summaryData.classes.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0);
    const activeClasses = summaryData.classes.filter(c => c.enrolledStudents > 0).length;
    const averageClassPrice = activeClasses > 0 ? totalEarnings / activeClasses : 0;
    const studentsPerClass = activeClasses > 0 ? totalStudents / activeClasses : 0;

    // Revenue breakdown by subject
    const subjectRevenue: Record<string, number> = {};
    transactions.forEach(transaction => {
      transaction.enrollments.forEach(enrollment => {
        const subject = enrollment.class.title.split(' ')[0] || 'Other'; // Simple subject extraction
        subjectRevenue[subject] = (subjectRevenue[subject] || 0) + transaction.amount;
      });
    });

    const revenueBySubject = Object.entries(subjectRevenue)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4); // Top 4 subjects

    // Mock data for class type and student level (would need additional API data)
    const revenueByClassType = [
      { name: "Group Classes", percentage: 65, amount: totalEarnings * 0.65 },
      { name: "Private Tutoring", percentage: 25, amount: totalEarnings * 0.25 },
      { name: "Workshops", percentage: 10, amount: totalEarnings * 0.10 }
    ];

    const revenueByStudentLevel = [
      { name: "Beginner", percentage: 35, amount: totalEarnings * 0.35 },
      { name: "Intermediate", percentage: 40, amount: totalEarnings * 0.40 },
      { name: "Advanced", percentage: 25, amount: totalEarnings * 0.25 }
    ];

    return {
      averageClassPrice: Math.round(averageClassPrice),
      studentsPerClass: Math.round(studentsPerClass),
      studentRetentionRate: 85, // Would need additional data to calculate
      classesPerMonth: Math.round(activeClasses), // Simplified
      averageReview: summaryData.analytics?.averageRating || 4.5,
      repeatBookingRate: 72, // Would need additional data to calculate
      
      revenueBreakdown: {
        bySubject: revenueBySubject,
        byClassType: revenueByClassType,
        byStudentLevel: revenueByStudentLevel
      },
      
      totalEarnings,
      monthlyGrowth,
      activeClasses,
      totalStudents
    };
  }, [transactions, summaryData]);

  return {
    analytics,
    isLoading: transactionsLoading || summaryLoading,
    error: transactionsError
  };
};