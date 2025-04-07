
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, Award, Sparkles } from "lucide-react";

export default function StudentLevel() {
  const currentLevel = 5;
  const xpToNextLevel = 1250;
  const currentXP = 850;
  const progressPercentage = (currentXP / xpToNextLevel) * 100;
  
  const recentAchievements = [
    { name: "Quick Learner", date: "Today", icon: Sparkles, color: "text-blue-500" },
    { name: "Math Wizard", date: "Yesterday", icon: Award, color: "text-purple-500" },
    { name: "Reading Champion", date: "Last week", icon: Award, color: "text-green-500" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-3">
            <span className="font-bold text-2xl text-blue-700">{currentLevel}</span>
          </div>
          <h3 className="text-lg font-semibold">Level {currentLevel}</h3>
          <div className="text-sm text-gray-500 mt-1">Scholar</div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{currentXP} XP</span>
            <span>{xpToNextLevel} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
            <ChevronUp className="h-4 w-4 text-blue-500 mr-1" />
            <span>{xpToNextLevel - currentXP} XP needed for Level {currentLevel + 1}</span>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Recent Achievements</h4>
          <div className="space-y-2">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-center">
                <div className={`mr-2 ${achievement.color}`}>
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{achievement.name}</p>
                </div>
                <span className="text-xs text-gray-500">{achievement.date}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
