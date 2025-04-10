
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Award, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AchievementsSummaryProps {
  totalAchievements: number;
  unlockedAchievements: number;
  totalXP: number;
  levelInfo: {
    current: number;
    xpForNext: number;
    currentXP: number;
    title: string;
  };
  streak: number;
}

const AchievementsSummary = ({
  totalAchievements,
  unlockedAchievements,
  totalXP,
  levelInfo,
  streak
}: AchievementsSummaryProps) => {
  const progressToNextLevel = (levelInfo.currentXP / levelInfo.xpForNext) * 100;
  
  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Achievement Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[250px]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-2">
                <span className="font-bold text-2xl text-blue-700">{levelInfo.current}</span>
              </div>
              <h3 className="font-semibold">{levelInfo.title}</h3>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{levelInfo.currentXP} XP</span>
                  <span>{levelInfo.xpForNext} XP</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {levelInfo.xpForNext - levelInfo.currentXP} XP needed for Level {levelInfo.current + 1}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-blue-50">
                <Award className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="font-bold text-xl">{unlockedAchievements}/{totalAchievements}</div>
                <div className="text-xs text-gray-500">Achievements</div>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-50">
                <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="font-bold text-xl">{totalXP}</div>
                <div className="text-xs text-gray-500">Total XP</div>
              </div>
              
              <div className="p-3 rounded-lg bg-amber-50">
                <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <div className="font-bold text-xl">{streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSummary;
