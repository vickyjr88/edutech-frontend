import { useMemo } from 'react';
import { useTeacherTransactions } from './useTeacherTransactions';
import { useTeacherSummary } from './useTeacherSummary';
import { useAuth } from '@/contexts/AuthContext';

export interface GrowthOpportunity {
  id: string | number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  type: 'pricing' | 'offerings' | 'marketing' | 'scheduling';
}

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

  // Dynamic Opportunities
  growthOpportunities: GrowthOpportunity[];
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
    if (!summaryData) return null; // We need summaryData at minimum

    // 1. Process Transactions & Revenue
    const totalEarnings = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Monthly growth
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

    // 2. Map Class Data
    const classMap = new Map(summaryData.classes.map(c => [c.classId, c]));

    // 3. Process Revenue Breakdowns
    const subjectRevenue: Record<string, number> = {};
    const classTypeRevenue: Record<string, number> = {};

    transactions.forEach(transaction => {
      // If transaction has specific enrollments, use them to find class details
      if (transaction.enrollments && transaction.enrollments.length > 0) {
        transaction.enrollments.forEach(enrollment => {
          const classId = enrollment.class._id;
          const classDetails = classMap.get(classId);

          const subject = classDetails?.subject || enrollment.class.title.split(' ')[0] || 'Other';
          const type = classDetails?.type || 'Standard';

          subjectRevenue[subject] = (subjectRevenue[subject] || 0) + transaction.amount;
          classTypeRevenue[type] = (classTypeRevenue[type] || 0) + transaction.amount;
        });
      } else {
        // Fallback for transactions without detailed enrollment info
        subjectRevenue['General'] = (subjectRevenue['General'] || 0) + transaction.amount;
        classTypeRevenue['Other'] = (classTypeRevenue['Other'] || 0) + transaction.amount;
      }
    });

    const revenueBySubject = Object.entries(subjectRevenue)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const revenueByClassType = Object.entries(classTypeRevenue)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalEarnings > 0 ? (amount / totalEarnings) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    // Mock student level breakdown as we lack this specific metadata in current types
    const revenueByStudentLevel = [
      { name: "Beginner", percentage: 40, amount: totalEarnings * 0.40 },
      { name: "Intermediate", percentage: 35, amount: totalEarnings * 0.35 },
      { name: "Advanced", percentage: 25, amount: totalEarnings * 0.25 }
    ];

    // 4. Calculate Key Metrics
    const totalStudents = summaryData.totalStudents || 0;
    // const totalClasses = summaryData.totalClasses || 0;
    const activeClasses = summaryData.classes.filter(c => c.activeCohorts > 0 || c.classState === 'in-progress').length;

    // Average Class Price calculation
    // Since we don't have price in ClassSummary, we estimate from transactions
    // Average transaction amount / enrollments per transaction (simplified)
    const validTransactions = transactions.filter(t => t.amount > 0);
    const averageTransactionValue = validTransactions.length > 0
      ? totalEarnings / validTransactions.length
      : 0;

    const studentsPerClass = activeClasses > 0 ? totalStudents / activeClasses : 0;

    // Use summary analytics or defaults
    const averageReview = summaryData.analytics?.overallPerformance?.averageEngagement
      ? (summaryData.analytics.overallPerformance.averageEngagement / 20) // Converting 100 scale to 5
      : 4.8;

    // 5. Generate Dynamic Growth Opportunities
    const opportunities: GrowthOpportunity[] = [];

    // Logic: Low students per class -> Marketing
    if (studentsPerClass < 5 && activeClasses > 0) {
      opportunities.push({
        id: 'opt-1',
        title: "Boost Enrollment",
        description: `Your average class size is ${studentsPerClass.toFixed(1)}. Try updating your class descriptions to attract more students.`,
        impact: 'high',
        effort: 'medium',
        status: 'pending',
        type: 'marketing'
      });
    }

    // Logic: High average review but low earnings -> Pricing
    if (averageReview > 4.5 && totalEarnings < 1000) {
      opportunities.push({
        id: 'opt-2',
        title: "Premium Pricing",
        description: "Your high ratings suggest students value your classes. Consider a small price increase.",
        impact: 'high',
        effort: 'low',
        status: 'pending',
        type: 'pricing'
      });
    }

    // Logic: Few active classes -> Scheduling (Offerings)
    if (activeClasses < 2) {
      opportunities.push({
        id: 'opt-3',
        title: "Expand Your Schedule",
        description: "Adding more class times, especially on weekends, can significantly increase revenue.",
        impact: 'medium',
        effort: 'medium',
        status: 'pending',
        type: 'scheduling'
      });
    }

    // Logic: Subject concentration
    if (revenueBySubject.length > 0 && revenueBySubject[0].percentage > 80) {
      opportunities.push({
        id: 'opt-4',
        title: "Diversify Subjects",
        description: `You are highly successful in ${revenueBySubject[0].name}. Consider creating related classes to cross-sell to existing students.`,
        impact: 'medium',
        effort: 'high',
        status: 'pending',
        type: 'offerings'
      });
    }

    // Fallback if no specific opportunities identified
    if (opportunities.length === 0) {
      opportunities.push({
        id: 'opt-default',
        title: "Request Reviews",
        description: "Encourage your recent students to leave reviews to boost your profile visibility.",
        impact: 'medium',
        effort: 'low',
        status: 'in_progress',
        type: 'marketing'
      });
    }

    return {
      averageClassPrice: Math.round(averageTransactionValue) || 50,
      studentsPerClass: parseFloat(studentsPerClass.toFixed(1)),
      studentRetentionRate: 85, // Placeholder
      classesPerMonth: activeClasses,
      averageReview: parseFloat(averageReview.toFixed(1)),
      repeatBookingRate: 72, // Placeholder

      revenueBreakdown: {
        bySubject: revenueBySubject,
        byClassType: revenueByClassType,
        byStudentLevel: revenueByStudentLevel
      },

      totalEarnings,
      monthlyGrowth,
      activeClasses,
      totalStudents,

      growthOpportunities: opportunities
    };
  }, [transactions, summaryData]);

  return {
    analytics,
    isLoading: transactionsLoading || summaryLoading,
    error: transactionsError
  };
};