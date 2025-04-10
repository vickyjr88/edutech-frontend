
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Award, 
  BookOpen, 
  Brain, 
  Clock, 
  Code, 
  Lightbulb, 
  Medal, 
  Puzzle, 
  Sparkles, 
  Star, 
  Trophy,
  Beaker
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

// Achievement category colors
const categoryColors = {
  academic: "bg-blue-100 text-blue-700 border-blue-200",
  participation: "bg-green-100 text-green-700 border-green-200",
  social: "bg-purple-100 text-purple-700 border-purple-200",
  creativity: "bg-amber-100 text-amber-700 border-amber-200",
  special: "bg-rose-100 text-rose-700 border-rose-200",
};

const achievementIconMap = {
  "Award": Award,
  "BookOpen": BookOpen,
  "Brain": Brain,
  "Clock": Clock,
  "Code": Code,
  "Flask": Beaker, // Changed Flask to Beaker which is available in lucide-react
  "Lightbulb": Lightbulb,
  "Medal": Medal,
  "Puzzle": Puzzle,
  "Sparkles": Sparkles,
  "Star": Star,
  "Trophy": Trophy,
};

export type AchievementType = {
  id: number;
  name: string;
  description: string;
  icon: keyof typeof achievementIconMap;
  category: keyof typeof categoryColors;
  xpValue: number;
  progress?: number;
  unlocked: boolean;
  date?: string;
};

interface AchievementsListProps {
  achievements: AchievementType[];
  title?: string;
}

export const AchievementsList = ({ achievements, title = "Your Achievements" }: AchievementsListProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Award className="mr-2 h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const IconComponent = achievementIconMap[achievement.icon];
            const isExpanded = expandedId === achievement.id;
            
            return (
              <Card 
                key={achievement.id} 
                className={`border overflow-hidden transition-all duration-200 ${
                  achievement.unlocked ? "border-yellow-300" : "border-gray-200"
                } ${isExpanded ? "shadow-md" : ""}`}
              >
                <div 
                  className="p-4 flex items-start gap-3 cursor-pointer"
                  onClick={() => toggleExpand(achievement.id)}
                >
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? "bg-yellow-100" : "bg-gray-100"}`}>
                    <IconComponent className={`h-6 w-6 ${achievement.unlocked ? "text-yellow-500" : "text-gray-400"}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{achievement.name}</h3>
                      <Badge className={`${categoryColors[achievement.category]} ml-2`}>
                        {achievement.category}
                      </Badge>
                    </div>
                    
                    {isExpanded && (
                      <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
                    )}
                    
                    {achievement.progress !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1.5" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                        <span>{achievement.xpValue} XP</span>
                      </div>
                      
                      {achievement.unlocked && achievement.date && (
                        <span className="text-xs text-gray-500">Unlocked: {achievement.date}</span>
                      )}
                      
                      {!achievement.unlocked && (
                        <Badge variant="outline" className="text-gray-500 border-gray-200">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsList;
