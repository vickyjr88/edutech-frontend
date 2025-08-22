
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, GraduationCap, Trophy, Flame } from "lucide-react";
import { studentProgressData } from "../data/studentProgressData";
import { useCurrentDashboardStats } from "@/hooks/use-student-service";
import { useStudentId } from "@/hooks";

export interface StatCardData {
  title: string;
  value: string;
  icon: React.ElementType;
  secondaryIcon?: React.ElementType;
  color: string;
  detail: string;
  badge?: {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline" | "info" | "warning";
  };
  progress?: number;
  tooltip?: string;
  clickable?: boolean;
  clickMessage?: string;
}

export const useStatCards = () => {
  const { studentId } = useStudentId();
  const { toast } = useToast();
  const [hovered, setHovered] = useState<number | null>(null);
  const [animatePoints, setAnimatePoints] = useState<boolean>(false);
  
  // Fetch real dashboard stats
  const { data: dashboardStatsResponse, isLoading } = useCurrentDashboardStats(studentId);
  const dashboardStats = dashboardStatsResponse?.data;

  
  const stats: StatCardData[] = [
    {
      title: "Enrolled Classes",
      value: isLoading ? "..." : (dashboardStats?.enrolledClasses?.total?.toString() || "0"),
      icon: BookOpen,
      color: "blue",
      detail: isLoading ? "Loading..." : `${dashboardStats?.enrolledClasses?.inProgress || 0} in progress, ${dashboardStats?.enrolledClasses?.startingSoon || 0} starting soon`,
      badge: dashboardStats?.enrolledClasses?.isNewClassAvailable ? {
        text: "New class available",
        variant: "info" 
      } : undefined,
      tooltip: "Classes you're currently taking"
    },
    {
      title: "Learning Hours",
      value: isLoading ? "..." : (dashboardStats?.learningHours?.total?.toString() || "0"),
      icon: Clock,
      color: "purple",
      detail: isLoading ? "Loading..." : `+${dashboardStats?.learningHours?.thisWeek || 0} hours this week`,
      badge: dashboardStats?.learningHours?.isPersonalBest ? {
        text: "Personal best",
        variant: "warning"
      } : undefined,
      tooltip: "Total hours spent learning on the platform"
    },
    {
      title: "Completion Rate",
      value: isLoading ? "..." : `${dashboardStats?.completionRate?.percentage || 0}%`,
      icon: GraduationCap,
      color: "green",
      detail: isLoading ? "Loading..." : (dashboardStats?.completionRate?.isAboveAverage ? "Above average" : "Keep it up!"),
      progress: dashboardStats?.completionRate?.percentage || 0,
      tooltip: "Percentage of assigned tasks you've completed"
    },
    {
      title: "Achievements & Streak",
      value: isLoading ? "..." : `${dashboardStats?.achievementsAndStreak?.achievements || 0}/${dashboardStats?.achievementsAndStreak?.totalPossible || 0}`,
      icon: Trophy,
      secondaryIcon: Flame,
      color: "yellow",
      detail: isLoading ? "Loading..." : `${dashboardStats?.achievementsAndStreak?.streak || 0}-day streak`,
      badge: dashboardStats?.achievementsAndStreak?.isOnFire ? {
        text: "On fire!",
        variant: "warning"
      } : undefined,
      progress: dashboardStats?.achievementsAndStreak?.streak ? Math.min((dashboardStats.achievementsAndStreak.streak / 10) * 100, 100) : 0,
      tooltip: "Your achievements and learning streak multiply your XP",
      clickable: true,
      clickMessage: "Your achievements and streak give you XP multipliers!"
    }
  ];

  // Update type from 'any' to a more specific type
  const handleCardClick = (stat: StatCardData) => {
    if (stat.clickable) {
      toast({
        title: stat.title,
        description: stat.clickMessage,
      });

      if (stat.title === "Achievements & Streak") {
        setAnimatePoints(true);
        setTimeout(() => setAnimatePoints(false), 2000);
      }
    }
  };

  return {
    stats,
    handleCardClick,
    hovered,
    setHovered,
    animatePoints,
    isLoading,
  };
};
