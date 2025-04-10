
import { useState } from "react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementsList from "@/components/achievements/AchievementsList";
import LeaderboardTable from "@/components/achievements/LeaderboardTable";
import AchievementsSummary from "@/components/achievements/AchievementsSummary";
import { mockAchievements, mockLeaderboardData, mockRecentAchievements } from "@/components/achievements/mockData";
import { Button } from "@/components/ui/button";
import { BookOpen, Award } from "lucide-react";

const Achievements = () => {
  const [userName] = useState("John Doe");
  const currentUserId = 104; // ID matching John Doe in the leaderboard data
  const [filter, setFilter] = useState<"all" | "academic" | "non-academic">("all");
  
  // Achievement summary data
  const summaryData = {
    totalAchievements: 15,
    unlockedAchievements: 4,
    totalXP: 575,
    levelInfo: {
      current: 5,
      xpForNext: 1000,
      currentXP: 575,
      title: "Knowledge Explorer"
    },
    streak: 9
  };

  // Filter achievements based on current filter
  const getFilteredAchievements = (achievements: any[]) => {
    if (filter === "all") return achievements;
    
    return achievements.filter(achievement => {
      const isAcademic = ["academic"].includes(achievement.category);
      return filter === "academic" ? isAcademic : !isAcademic;
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <StudentDashboardHeader userName={userName} />

        {/* Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Achievements</h1>
            </div>
            
            <div className="space-y-6">
              {/* Achievement Summary */}
              <AchievementsSummary {...summaryData} />
              
              <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <TabsList>
                    <TabsTrigger value="all">All Achievements</TabsTrigger>
                    <TabsTrigger value="recent">Recently Earned</TabsTrigger>
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                  </TabsList>
                  
                  {/* Filter buttons */}
                  <div className="flex gap-2 ml-auto">
                    <Button 
                      size="sm" 
                      variant={filter === "all" ? "default" : "outline"}
                      onClick={() => setFilter("all")}
                    >
                      All Categories
                    </Button>
                    <Button 
                      size="sm" 
                      variant={filter === "academic" ? "default" : "outline"}
                      onClick={() => setFilter("academic")}
                      className="flex items-center gap-1"
                    >
                      <BookOpen className="h-4 w-4" />
                      Academic
                    </Button>
                    <Button 
                      size="sm" 
                      variant={filter === "non-academic" ? "default" : "outline"}
                      onClick={() => setFilter("non-academic")}
                      className="flex items-center gap-1"
                    >
                      <Award className="h-4 w-4" />
                      Non-Academic
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="all" className="space-y-6">
                  <AchievementsList achievements={getFilteredAchievements(mockAchievements)} />
                </TabsContent>
                
                <TabsContent value="recent" className="space-y-6">
                  <AchievementsList 
                    achievements={getFilteredAchievements(mockRecentAchievements)} 
                    title="Recently Earned Achievements" 
                  />
                </TabsContent>
                
                <TabsContent value="leaderboard" className="space-y-6">
                  <LeaderboardTable entries={mockLeaderboardData} currentUserId={currentUserId} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default Achievements;
