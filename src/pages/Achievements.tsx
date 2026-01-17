
import { useState, useMemo } from "react";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementsList from "@/components/achievements/AchievementsList";
import LeaderboardTable from "@/components/achievements/LeaderboardTable";
import AchievementsSummary from "@/components/achievements/AchievementsSummary";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Loader2 } from "lucide-react";
import { useGetAllAchievements, useCurrentStudentAchievements, useCurrentRecentAchievements } from "@/hooks/use-achievement-service";
import { useLeaderboard } from "@/hooks/use-student-service";
import { useStudentId } from "@/hooks/useStudentId";
import { useAuth } from "@/contexts/AuthContext";
import type { AchievementType } from "@/components/achievements/AchievementsList";
import type { LeaderboardEntryType } from "@/components/achievements/LeaderboardTable";
import type { Achievement, StudentAchievement } from "@/integrations/api/services/achievement.service";
import type { LeaderboardEntry } from "@/integrations/api/services/student.service";

// Map backend categories to frontend categories
const mapCategory = (backendCategory: string): keyof typeof categoryColors => {
  const categoryMap: Record<string, keyof typeof categoryColors> = {
    'Academic': 'academic',
    'Participation': 'participation',
    'Completion': 'academic',
    'Streak': 'participation',
    'Skill': 'academic',
    'Special': 'special',
  };
  return categoryMap[backendCategory] || 'academic';
};

const categoryColors = {
  academic: "bg-blue-100 text-blue-700 border-blue-200",
  participation: "bg-green-100 text-green-700 border-green-200",
  social: "bg-purple-100 text-purple-700 border-purple-200",
  creativity: "bg-amber-100 text-amber-700 border-amber-200",
  special: "bg-rose-100 text-rose-700 border-rose-200",
};

const Achievements = () => {
  const { user } = useAuth();
  const { studentId } = useStudentId();
  const [userName] = useState(user?.fullName || "Student");
  const [filter, setFilter] = useState<"all" | "academic" | "non-academic">("all");

  // Fetch data from API
  const { data: allAchievementsResponse, isLoading: isLoadingAll } = useGetAllAchievements();
  const { data: studentAchievementsResponse, isLoading: isLoadingStudent } = useCurrentStudentAchievements();
  const { data: recentAchievementsResponse, isLoading: isLoadingRecent } = useCurrentRecentAchievements(3);
  const { data: leaderboardResponse, isLoading: isLoadingLeaderboard } = useLeaderboard(50);

  // Transform backend data to frontend format
  const transformAchievement = (
    achievement: Achievement,
    studentAchievements: StudentAchievement[] = []
  ): AchievementType => {
    const studentAchievement = studentAchievements.find(
      (sa) => sa.achievement._id === achievement._id
    );

    return {
      id: parseInt(achievement._id.substring(achievement._id.length - 8), 16), // Convert ObjectId to number
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon as keyof typeof achievementIconMap,
      category: mapCategory(achievement.category),
      xpValue: achievement.xpReward,
      unlocked: !!studentAchievement,
      date: studentAchievement
        ? new Date(studentAchievement.earnedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        : undefined,
    };
  };

  const achievementIconMap = {
    "Award": Award,
    "BookOpen": BookOpen,
    "Brain": Award,
    "Clock": Award,
    "Code": Award,
    "Beaker": Award,
    "Lightbulb": Award,
    "Medal": Award,
    "Puzzle": Award,
    "Sparkles": Award,
    "Star": Award,
    "Trophy": Award,
  };

  // Process achievements
  const allAchievements = useMemo(() => {
    if (!allAchievementsResponse?.data || !studentAchievementsResponse?.data) return [];
    return allAchievementsResponse.data.map((achievement) =>
      transformAchievement(achievement, studentAchievementsResponse.data!)
    );
  }, [allAchievementsResponse, studentAchievementsResponse]);

  const recentAchievements = useMemo(() => {
    if (!recentAchievementsResponse?.data) return [];
    return recentAchievementsResponse.data.map((sa) =>
      transformAchievement(sa.achievement, recentAchievementsResponse.data!)
    );
  }, [recentAchievementsResponse]);

  // Transform leaderboard data
  const leaderboardEntries: LeaderboardEntryType[] = useMemo(() => {
    if (!leaderboardResponse?.data) return [];

    return leaderboardResponse.data.map((entry: LeaderboardEntry) => ({
      id: parseInt(entry.id.substring(entry.id.length - 8), 16), // Convert ObjectId to number for compatibility
      rank: entry.rank,
      name: entry.name,
      avatar: entry.avatar,
      grade: entry.grade,
      points: entry.points,
      achievements: entry.achievements,
      streak: entry.streak,
    }));
  }, [leaderboardResponse]);

  // Find current user in leaderboard
  const currentUserLeaderboardId = useMemo(() => {
    if (!leaderboardResponse?.data || !studentId) return undefined;
    const currentUserEntry = leaderboardResponse.data.find(
      (entry: LeaderboardEntry) => entry.studentId === studentId
    );
    return currentUserEntry ? parseInt(currentUserEntry.id.substring(currentUserEntry.id.length - 8), 16) : undefined;
  }, [leaderboardResponse, studentId]);

  // Calculate summary data
  const summaryData = useMemo(() => {
    const unlockedAchievements = allAchievements.filter((a) => a.unlocked);
    const totalXP = unlockedAchievements.reduce((sum, a) => sum + a.xpValue, 0);
    const currentXP = totalXP;
    const level = Math.floor(currentXP / 200) + 1;
    const xpForNext = level * 200;

    // Get streak from leaderboard data if available
    let streak = 0;
    if (leaderboardResponse?.data && studentId) {
      const currentUserEntry = leaderboardResponse.data.find(
        (entry: LeaderboardEntry) => entry.studentId === studentId
      );
      streak = currentUserEntry?.streak || 0;
    }

    return {
      totalAchievements: allAchievements.length,
      unlockedAchievements: unlockedAchievements.length,
      totalXP,
      levelInfo: {
        current: level,
        xpForNext,
        currentXP,
        title: level >= 10 ? "Expert" : level >= 5 ? "Knowledge Explorer" : "Beginner",
      },
      streak,
    };
  }, [allAchievements, leaderboardResponse, studentId]);

  // Filter achievements based on current filter
  const getFilteredAchievements = (achievements: any[]) => {
    if (filter === "all") return achievements;

    return achievements.filter(achievement => {
      const isAcademic = ["academic"].includes(achievement.category);
      return filter === "academic" ? isAcademic : !isAcademic;
    });
  };

  // Loading state
  if (isLoadingAll || isLoadingStudent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white transition-all duration-300">
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-4 sm:p-6 transition-all duration-300">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
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
                  {allAchievements.length > 0 ? (
                    <AchievementsList achievements={getFilteredAchievements(allAchievements)} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No achievements available yet.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="recent" className="space-y-6">
                  {recentAchievements.length > 0 ? (
                    <AchievementsList
                      achievements={getFilteredAchievements(recentAchievements)}
                      title="Recently Earned Achievements"
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No achievements earned yet. Keep learning to unlock your first achievement!
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="leaderboard" className="space-y-6">
                  {isLoadingLeaderboard ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : leaderboardEntries.length > 0 ? (
                    <LeaderboardTable entries={leaderboardEntries} currentUserId={currentUserLeaderboardId} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No leaderboard data available yet. Start earning XP to see rankings!
                    </div>
                  )}
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
