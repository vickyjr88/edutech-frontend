
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Clock, GraduationCap, Trophy, Flame } from "lucide-react";
import { studentProgressData } from "../data/studentProgressData";

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
  const { toast } = useToast();
  const [hovered, setHovered] = useState<number | null>(null);
  const [animatePoints, setAnimatePoints] = useState<boolean>(false);
  
  const stats: StatCardData[] = [
    {
      title: "Enrolled Classes",
      value: "3",
      icon: BookOpen,
      color: "blue",
      detail: "2 in progress, 1 starting soon",
      badge: {
        text: "New class available",
        variant: "info" 
      },
      tooltip: "Classes you're currently taking"
    },
    {
      title: "Learning Hours",
      value: "42",
      icon: Clock,
      color: "purple",
      detail: "+3 hours this week",
      badge: {
        text: "Personal best",
        variant: "warning"
      },
      tooltip: "Total hours spent learning on the platform"
    },
    {
      title: "Completion Rate",
      value: "87%",
      icon: GraduationCap,
      color: "green",
      detail: "Above average",
      progress: 87,
      tooltip: "Percentage of assigned tasks you've completed"
    },
    {
      title: "Achievements & Streak",
      value: `${studentProgressData.achievements.unlocked}/${studentProgressData.achievements.total}`,
      icon: Trophy,
      secondaryIcon: Flame,
      color: "yellow",
      detail: `${studentProgressData.streak}-day streak`,
      badge: {
        text: "On fire!",
        variant: "warning"
      },
      progress: (studentProgressData.streak / 10) * 100, // Assuming 10 days is the max streak goal
      tooltip: "Your achievements and learning streak multiply your XP",
      clickable: true,
      clickMessage: "Your achievements and streak give you XP multipliers!"
    }
  ];

  const handleCardClick = (stat: any) => {
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
  };
};
