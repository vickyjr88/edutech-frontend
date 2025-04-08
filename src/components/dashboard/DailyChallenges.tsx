
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, XCircle, Circle, Award, Star, ChevronUp, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DailyChallenges() {
  const { toast } = useToast();
  const [challenges, setChalllenges] = useState([
    {
      id: 1,
      title: "Complete Math Quiz",
      points: 50,
      difficulty: "Easy",
      completed: true,
      description: "Answer 10 algebra questions in under 5 minutes"
    },
    {
      id: 2,
      title: "Watch Science Video",
      points: 30,
      difficulty: "Easy",
      completed: true,
      description: "Watch the full 'Introduction to Cells' video"
    },
    {
      id: 3,
      title: "Submit Coding Assignment",
      points: 100,
      difficulty: "Medium",
      completed: false,
      current: true,
      description: "Create a simple calculator app using HTML, CSS and JavaScript"
    },
    {
      id: 4,
      title: "Read Chapter 5",
      points: 75,
      difficulty: "Hard",
      completed: false,
      description: "Read and take notes on Chapter 5: World History"
    }
  ]);
  
  const [expanded, setExpanded] = useState<number | null>(null);
  const [streakCount, setStreakCount] = useState(2);

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

  const handleStart = (id: number) => {
    toast({
      title: "Challenge Started",
      description: "Good luck! Complete this to earn XP.",
    });
  };

  const handleComplete = (id: number) => {
    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === id) {
        return { ...challenge, completed: true, current: false };
      }
      if (challenge.id === id + 1) {
        return { ...challenge, current: true };
      }
      return challenge;
    });
    
    setChalllenges(updatedChallenges);
    
    // Update the challenge that was just completed
    const completedChallenge = challenges.find(c => c.id === id);
    
    if (completedChallenge) {
      setStreakCount(streakCount + 1);
      
      toast({
        title: "Challenge Completed! 🎉",
        description: `You earned ${completedChallenge.points} XP!`,
        variant: "default",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Daily Challenges</CardTitle>
        <div className="flex items-center">
          <div className="bg-yellow-50 p-1 rounded-md mr-2">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-bold">{totalPoints} XP</span>
              <ChevronUp className="h-3 w-3 text-green-500 ml-1" />
            </div>
            <div className="text-xs text-gray-500">{streakCount}-day streak</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={`flex flex-col p-3 rounded-md transition-all duration-300 ${
                challenge.current ? 'bg-blue-50 border border-blue-100' : 
                challenge.completed ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
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
                    <div className="flex items-center">
                      <p className="font-medium text-sm">{challenge.title}</p>
                      {challenge.completed && (
                        <Star className="h-3 w-3 text-yellow-500 ml-2" />
                      )}
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      {getDifficultyBadge(challenge.difficulty)}
                      <span className="text-xs text-gray-500">{challenge.points} XP</span>
                    </div>
                  </div>
                </div>
                {!challenge.completed ? (
                  <Button 
                    size="sm" 
                    variant={challenge.current ? "default" : "outline"}
                    className={challenge.current ? "" : "text-gray-500"}
                    onClick={challenge.current ? 
                      () => handleComplete(challenge.id) : 
                      () => {}}
                    disabled={!challenge.current}
                  >
                    {challenge.current ? "Complete" : "Locked"}
                  </Button>
                ) : (
                  <Badge variant="success" className="bg-green-100 text-green-800">
                    Completed
                  </Badge>
                )}
              </div>
              
              {challenge.current && (
                <div className="mt-3 text-xs text-gray-600 pl-8 animate-fade-in">
                  <p>{challenge.description}</p>
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStart(challenge.id)}
                    >
                      Start Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleComplete(challenge.id)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
