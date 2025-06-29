import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import type { TeacherSummaryResponse } from '@/types/enhanced-classes';
import { useTeacherBalance } from '@/hooks/useTeacherBalance';

interface FinancialOverviewCardProps {
  summaryData?: TeacherSummaryResponse;
}

const calculateEarningsFromSummary = (summaryData?: TeacherSummaryResponse) => {
  if (!summaryData) return { totalEnrolledStudents: 0, upcomingSessions: 0, potentialEarnings: 0 };

  const totalEnrolledStudents = summaryData.classes.reduce((total, classItem) => {
    return total + (classItem.enrolledStudents || 0);
  }, 0);

  const upcomingSessions = summaryData.classes.filter(classItem => 
    classItem.nextSession && classItem.enrolledStudents > 0
  ).length;

  // Simple calculation: assume $20 per student per session as base rate
  const potentialEarnings = totalEnrolledStudents * 20;

  return { totalEnrolledStudents, upcomingSessions, potentialEarnings };
};

const FinancialOverviewCard: React.FC<FinancialOverviewCardProps> = ({ summaryData }) => {
  const { balance, isLoading: balanceLoading } = useTeacherBalance();
  const { totalEnrolledStudents, upcomingSessions, potentialEarnings } = calculateEarningsFromSummary(summaryData);

  if (balanceLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Financial Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Financial Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold">
            ${balance?.currentBalance?.toFixed(2) || '0.00'}
          </div>
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Current available balance</span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{upcomingSessions} upcoming sessions</span>
            <span className="text-green-600">${potentialEarnings} potential</span>
          </div>
          <div className="flex justify-between">
            <span>{totalEnrolledStudents} enrolled students</span>
            <span className="text-blue-600">Active learners</span>
          </div>
          {balance && (
            <>
              <div className="flex justify-between">
                <span>Total earnings</span>
                <span className="text-gray-600">${balance.totalEarnings}</span>
              </div>
              <div className="flex justify-between">
                <span>Total payouts</span>
                <span className="text-gray-600">${balance.totalPayouts}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverviewCard;