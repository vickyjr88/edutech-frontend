
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, Info, Star, Flame } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { getColorClass } from "./utils/colorUtils";
import { studentProgressData } from "./data/studentProgressData";

export interface StatCardProps {
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
  onCardClick: (stat: StatCardProps) => void;
  isHovered: boolean;
  index: number;
  animatePoints?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  secondaryIcon: SecondaryIcon,
  color,
  detail,
  badge,
  progress,
  tooltip,
  clickable,
  clickMessage,
  onCardClick,
  isHovered,
  index,
  animatePoints,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card 
          className={`overflow-hidden transition-all duration-300 rounded-xl ${
            isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
          } ${clickable ? 'cursor-pointer' : ''} ${
            getColorClass(color, 'border')
          } border-2`}
          onClick={() => onCardClick({ 
            title, value, icon: Icon, secondaryIcon: SecondaryIcon, color, 
            detail, badge, progress, tooltip, clickable, clickMessage, 
            onCardClick, isHovered, index, animatePoints, onMouseEnter, onMouseLeave
          })}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <CardContent className="p-4">
            <div className="flex items-start mb-3">
              <div className={`${getColorClass(color, 'bg')} p-2.5 rounded-full mr-3 flex-shrink-0 ${
                title.includes("Streak") ? 'animate-pulse' : ''
              }`}>
                <Icon className={`h-5 w-5 ${getColorClass(color, 'text')}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-600 truncate">{title}</p>
                  {tooltip && (
                    <Info className="h-3 w-3 text-gray-400 ml-1 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-1">
                  <p className="font-bold text-xl truncate">{value}</p>
                  {title === "Achievements & Streak" && (
                    <div className="ml-2 flex items-center">
                      <div className="bg-orange-50 p-1 rounded-full">
                        <Flame className="h-4 w-4 text-orange-500" />
                      </div>
                    </div>
                  )}
                  {title === "Achievements & Streak" && animatePoints && (
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
              {detail && (
                <p className="text-xs text-gray-500 truncate max-w-[75%]">
                  {detail}
                  {title === "Achievements & Streak" && (
                    <span className="ml-1 inline-flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-purple-600 font-medium">Level {studentProgressData.level.current}</span>
                    </span>
                  )}
                </p>
              )}
              {badge && (
                <Badge variant={badge.variant} className="text-xs truncate mt-1 h-5 px-1.5 rounded-full">
                  {badge.text}
                </Badge>
              )}
            </div>
            {progress && (
              <div className="mt-2.5">
                <Progress 
                  value={progress} 
                  className="h-2 rounded-full overflow-hidden"
                  indicatorClassName={getColorClass(color, 'bg').replace('bg-', 'bg-').replace('-50', '-500')}
                />
              </div>
            )}
            {clickable && isHovered && (
              <div className="mt-2 text-xs text-blue-500 flex justify-end animate-bounce">
                Click for details ✨
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-white/90 backdrop-blur-sm border-2 rounded-xl shadow-lg p-2 text-sm">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default StatCard;
