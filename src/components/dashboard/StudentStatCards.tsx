
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Calendar,
  Trophy,
  Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function StudentStatCards() {
  const [hovered, setHovered] = useState<number | null>(null);
  
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
      }
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
      }
    },
    {
      title: "Completion Rate",
      value: "87%",
      icon: GraduationCap,
      color: "green",
      detail: "Above average",
      progress: 87
    },
    {
      title: "Learning Streak",
      value: "7 days",
      icon: Flame,
      color: "orange",
      detail: "Keep it up!",
      progress: 70,
      badge: {
        text: "On fire!",
        variant: "warning" as const
      }
    },
    {
      title: "Achievements",
      value: "12",
      icon: Trophy,
      color: "yellow",
      detail: "2 new this month",
      badge: {
        text: "New badge",
        variant: "info" as const
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`overflow-hidden transition-all duration-300 ${
            hovered === index ? 'shadow-lg transform -translate-y-1' : ''
          }`}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className={`bg-${stat.color}-50 p-2 rounded-full mr-3 flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="font-semibold text-xl truncate">{stat.value}</p>
              </div>
              {stat.badge && (
                <Badge variant={stat.badge.variant} className="ml-auto text-xs">
                  {stat.badge.text}
                </Badge>
              )}
            </div>
            {stat.detail && (
              <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
            )}
            {stat.progress && (
              <div className="mt-2">
                <Progress value={stat.progress} className="h-1" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
