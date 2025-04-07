
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, XCircle, Circle, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DailyChallenges() {
  const challenges = [
    {
      id: 1,
      title: "Complete Math Quiz",
      points: 50,
      difficulty: "Easy",
      completed: true
    },
    {
      id: 2,
      title: "Watch Science Video",
      points: 30,
      difficulty: "Easy",
      completed: true
    },
    {
      id: 3,
      title: "Submit Coding Assignment",
      points: 100,
      difficulty: "Medium",
      completed: false,
      current: true
    },
    {
      id: 4,
      title: "Read Chapter 5",
      points: 75,
      difficulty: "Hard",
      completed: false
    }
  ];

  const totalPoints = challenges.reduce((sum, challenge) => 
    challenge.completed ? sum + challenge.points : sum, 0);
  
  const getDifficultyBadge = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return <Badge variant="secondary">Easy</Badge>;
      case "Medium": return <Badge variant="info">Medium</Badge>;
      case "Hard": return <Badge variant="warning">Hard</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Daily Challenges</CardTitle>
        <div className="flex items-center">
          <Award className="h-5 w-5 text-yellow-500 mr-1" />
          <span className="font-bold">{totalPoints} XP</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`flex items-center justify-between p-3 rounded-md ${
                challenge.current ? 'bg-blue-50 border border-blue-100' : 
                challenge.completed ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {challenge.completed ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : challenge.current ? (
                    <Circle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{challenge.title}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    {getDifficultyBadge(challenge.difficulty)}
                    <span className="text-xs text-gray-500">{challenge.points} XP</span>
                  </div>
                </div>
              </div>
              {!challenge.completed && (
                <Button 
                  size="sm" 
                  variant={challenge.current ? "default" : "outline"}
                  className={challenge.current ? "" : "text-gray-500"}
                >
                  {challenge.current ? "Start" : "Locked"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
