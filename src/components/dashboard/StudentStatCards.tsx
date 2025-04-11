
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Calendar,
  Trophy,
  Flame,
  ChevronUp,
  Info,
  Sparkles,
  Award,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Shared data that will be used across components
export const studentProgressData = {
  streak: 7,
  achievements: {
    total: 12,
    unlocked: 8,
    recent: [
      { 
        name: "Quick Learner", 
        date: "Today", 
        icon: Sparkles, 
        color: "text-blue-500", 
        description: "Completed 5 lessons in a single day",
        xpEarned: 50
      },
      { 
        name: "Math Wizard", 
        date: "Yesterday", 
        icon: Award, 
        color: "text-purple-500",
        description: "Scored 95% or higher on 3 consecutive math quizzes",
        xpEarned: 100
      },
      { 
        name: "Reading Champion", 
        date: "Last week", 
        icon: Trophy, 
        color: "text-green-500",
        description: "Finished reading 5 books this month",
        xpEarned: 150
      },
    ]
  },
  level: {
    current: 5,
    xpForNext: 1250,
    currentXP: 850,
    title: "Scholar"
  }
};

export default function StudentStatCards() {
  const { toast } = useToast();
  const [hovered, setHovered] = useState<number | null>(null);
  const [animatePoints, setAnimatePoints] = useState<boolean>(false);
  
  const stats = [
    {
      title: "Enrolled Classes",
      value: "3",
      icon: BookOpen,
      color: "blue",
      detail: "2 in progress, 1 starting soon",
      badge: {
        text: "New class available",
        variant: "info" as const
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
        variant: "warning" as const
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
        variant: "warning" as const
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

  // Map color names to actual Tailwind classes to avoid string interpolation issues
  const getColorClass = (color: string, type: 'bg' | 'text' | 'border') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-300" },
      purple: { bg: "bg-purple-50", text: "text-purple-500", border: "border-purple-300" },
      green: { bg: "bg-green-50", text: "text-green-500", border: "border-green-300" },
      orange: { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-300" },
      yellow: { bg: "bg-yellow-50", text: "text-yellow-500", border: "border-yellow-300" }
    };
    
    return colorMap[color]?.[type] || "";
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card 
                className={`overflow-hidden transition-all duration-300 rounded-xl ${
                  hovered === index ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
                } ${stat.clickable ? 'cursor-pointer' : ''} ${
                  getColorClass(stat.color, 'border')
                } border-2`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleCardClick(stat)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start mb-3">
                    <div className={`${getColorClass(stat.color, 'bg')} p-2.5 rounded-full mr-3 flex-shrink-0 ${
                      stat.title.includes("Streak") ? 'animate-pulse' : ''
                    }`}>
                      <stat.icon className={`h-5 w-5 ${getColorClass(stat.color, 'text')}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-600 truncate">{stat.title}</p>
                        {stat.tooltip && (
                          <Info className="h-3 w-3 text-gray-400 ml-1 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center flex-wrap gap-1">
                        <p className="font-bold text-xl truncate">{stat.value}</p>
                        {stat.title === "Achievements & Streak" && (
                          <div className="ml-2 flex items-center">
                            <div className="bg-orange-50 p-1 rounded-full">
                              <Flame className="h-4 w-4 text-orange-500" />
                            </div>
                          </div>
                        )}
                        {stat.title === "Achievements & Streak" && animatePoints && (
                          <div className="ml-1 text-xs font-semibold text-green-500 animate-bounce flex-shrink-0">
                            <div className="flex items-center">
                              <ChevronUp className="h-3 w-3" />
                              <span>x2 XP</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-wrap">
                    {stat.detail && (
                      <p className="text-xs text-gray-500 truncate max-w-[75%]">
                        {stat.detail}
                        {stat.title === "Achievements & Streak" && (
                          <span className="ml-1 inline-flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-purple-600 font-medium">Level {studentProgressData.level.current}</span>
                          </span>
                        )}
                      </p>
                    )}
                    {stat.badge && (
                      <Badge variant={stat.badge.variant} className="text-xs truncate mt-1 h-5 px-1.5 rounded-full">
                        {stat.badge.text}
                      </Badge>
                    )}
                  </div>
                  {stat.progress && (
                    <div className="mt-2.5">
                      <Progress 
                        value={stat.progress} 
                        className="h-2 rounded-full overflow-hidden"
                        indicatorClassName={getColorClass(stat.color, 'bg').replace('bg-', 'bg-').replace('-50', '-500')}
                      />
                    </div>
                  )}
                  {stat.clickable && hovered === index && (
                    <div className="mt-2 text-xs text-blue-500 flex justify-end animate-bounce">
                      Click for details ✨
                    </div>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-white/90 backdrop-blur-sm border-2 rounded-xl shadow-lg p-2 text-sm">
              <p>{stat.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
