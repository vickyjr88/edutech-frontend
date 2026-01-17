import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Trophy, Plus, BarChart2, Users, Sparkles } from "lucide-react";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import LearningProgress from "@/components/dashboard/LearningProgress";
import GoalFormDialog from "@/components/dashboard/GoalFormDialog";
import GoalTrackingDialog from "@/components/dashboard/GoalTrackingDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Challenges = () => {
  const [userName] = useState("John Doe");
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const { toast } = useToast();

  const questChallenges = [
    {
      id: "st1",
      title: "Complete Mathematics Module 3",
      dueIn: "5 days",
      progress: 75,
      color: "blue",
      description: "Finish all exercises in Module 3",
      subject: "Mathematics",
      dueDate: "April 15, 2025",
      setBy: "teacher",
      goalTarget: "Complete all exercises",
      questMode: "individual"
    },
    {
      id: "st2",
      title: "Finish Science Project",
      dueIn: "2 days",
      progress: 50,
      color: "purple",
      description: "Complete the ecosystem model for biology class",
      subject: "Science",
      dueDate: "April 12, 2025",
      setBy: "teacher",
      goalTarget: "Submit final project",
      questMode: "individual"
    },
    {
      id: "st3",
      title: "Submit Coding Challenge",
      dueIn: "tomorrow",
      progress: 90,
      color: "green",
      description: "Finish the weekly coding challenge",
      subject: "Computer Science",
      dueDate: "April 10, 2025",
      setBy: "self",
      goalTarget: "Submit working solution",
      questMode: "individual"
    }
  ];

  const longTermQuests = [
    {
      id: "lt1",
      title: "Master Algebra Concepts",
      dueIn: "End of semester",
      progress: 40,
      color: "blue",
      description: "Master all key algebra concepts for the final exam",
      subject: "Mathematics",
      dueDate: "June 20, 2025",
      setBy: "self",
      goalTarget: "Pass final exam with A grade",
      questMode: "individual"
    },
    {
      id: "lt2",
      title: "Complete Science Curriculum",
      dueIn: "End of year",
      progress: 35,
      color: "purple",
      description: "Complete all required science modules for the year",
      subject: "Science",
      dueDate: "Dec 15, 2025",
      setBy: "teacher",
      goalTarget: "Complete all modules with passing grade",
      questMode: "individual"
    },
    {
      id: "lt3",
      title: "Build Final Coding Project",
      dueIn: "Next month",
      progress: 15,
      color: "orange",
      description: "Build a full-stack web application as final project",
      subject: "Computer Science",
      dueDate: "May 30, 2025",
      setBy: "teacher",
      goalTarget: "Deploy working application",
      questMode: "group"
    }
  ];

  const groupQuests = [
    {
      id: "g1",
      title: "Team Science Fair Project",
      dueIn: "2 weeks",
      progress: 30,
      color: "green",
      description: "Develop an interactive science exhibit for the school fair",
      subject: "Science",
      dueDate: "April 24, 2025",
      setBy: "teacher",
      goalTarget: "Complete and present exhibit",
      questMode: "group",
      members: ["John Doe", "Amy Martin", "Robert Kim", "Sarah Lopez"]
    },
    {
      id: "g2",
      title: "Math Olympiad Preparation",
      dueIn: "1 month",
      progress: 45,
      color: "blue",
      description: "Work together to prepare for the upcoming Math Olympiad",
      subject: "Mathematics",
      dueDate: "May 15, 2025",
      setBy: "coach",
      goalTarget: "Score at least 80% on practice tests",
      questMode: "group",
      members: ["John Doe", "Kevin Li", "David Ng"]
    },
    {
      id: "g3",
      title: "Coding Hackathon Project",
      dueIn: "3 weeks",
      progress: 25,
      color: "purple",
      description: "Create an educational game for the school hackathon",
      subject: "Computer Science",
      dueDate: "April 30, 2025",
      setBy: "self",
      goalTarget: "Complete a working game prototype",
      questMode: "group",
      members: ["John Doe", "Alex Brown", "Lisa Chang", "Michael Scott"]
    }
  ];

  const handleCreateGoal = (values: any) => {
    console.log("New quest created:", values);
    const message = values.questMode === "group"
      ? `Your new group quest "${values.title}" has been created successfully.`
      : `Your new quest "${values.title}" has been created successfully.`;

    toast({
      title: "Quest Created",
      description: message,
    });

    if (values.questMode === "group") {
      console.log("Group quest created - would send invites to members");
    }
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsTrackingOpen(true);
  };

  const handleUpdateGoal = (goalId: string, progress: number, notes: string, timeSpent?: string) => {
    console.log("Quest updated:", { goalId, progress, notes, timeSpent });
    toast({
      title: "Progress Updated",
      description: `Your quest progress has been updated to ${progress}%. ${timeSpent ? `Time spent: ${timeSpent}` : ''}`,
    });
  };

  const getProgressColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      orange: "text-orange-600",
      yellow: "text-yellow-600"
    };

    return colorMap[color] || "text-blue-600";
  };

  const renderGoalItem = (goal: any) => (
    <li key={goal.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <p className="font-medium">{goal.title}</p>
          {goal.questMode === "group" && (
            <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200 flex items-center gap-1">
              <Users className="h-3 w-3" /> Group
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">Due in {goal.dueIn}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className={`font-bold ${getProgressColorClass(goal.color)}`}>{goal.progress}%</p>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-blue-300 hover:bg-blue-100"
          onClick={() => handleEditGoal(goal)}
        >
          <BarChart2 className="h-3 w-3" />
          Update Progress
        </Button>
      </div>
    </li>
  );

  const renderGroupMemberInitials = (member: string) => {
    const initials = member.split(' ').map(n => n[0]).join('');
    return (
      <div key={member} className="h-7 w-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium border border-white">
        {initials}
      </div>
    );
  };

  const renderGroupQuestItem = (quest: any) => (
    <li key={quest.id} className="flex flex-col p-3 bg-blue-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <p className="font-medium">{quest.title}</p>
            <Badge variant="outline" className="bg-blue-100 text-blue-600 border-blue-200 flex items-center gap-1">
              <Users className="h-3 w-3" /> Group
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Due in {quest.dueIn}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className={`font-bold ${getProgressColorClass(quest.color)}`}>{quest.progress}%</p>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-blue-300 hover:bg-blue-100"
            onClick={() => handleEditGoal(quest)}
          >
            <BarChart2 className="h-3 w-3" />
            Update Progress
          </Button>
        </div>
      </div>
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-600 mr-2">Team:</span>
        <div className="flex -space-x-2">
          {quest.members.map(renderGroupMemberInitials)}
        </div>
      </div>
    </li>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-4 sm:p-6 transition-all duration-300">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Quests & Challenges</h1>
              <Button
                onClick={() => setIsGoalFormOpen(true)}
                className="bg-kidato-purple hover:bg-kidato-dark-blue rounded-xl flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Quest
              </Button>
            </div>

            <LearningProgress onEditGoal={handleEditGoal} />

            <Tabs defaultValue="all" className="mt-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="all">All Quests</TabsTrigger>
                <TabsTrigger value="individual">Individual Quests</TabsTrigger>
                <TabsTrigger value="group">Group Quests</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                        Active Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        {questChallenges.map(renderGoalItem)}
                        <li className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsGoalFormOpen(true)}
                            className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add New Challenge
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <Target className="mr-2 h-5 w-5 text-blue-500" />
                        Long-term Quests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        {longTermQuests.map(renderGoalItem)}
                        <li className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsGoalFormOpen(true)}
                            className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add New Quest
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                    <CardTitle className="text-lg font-bold flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-500" />
                      Group Quests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {groupQuests.map(renderGroupQuestItem)}
                      <li className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsGoalFormOpen(true)}
                          className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          <Users className="h-4 w-4 mx-1" />
                          Create Group Quest
                        </Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="individual">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                        Active Challenges
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        {questChallenges.filter(quest => quest.questMode === "individual").map(renderGoalItem)}
                        <li className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsGoalFormOpen(true)}
                            className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add New Challenge
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <Target className="mr-2 h-5 w-5 text-blue-500" />
                        Long-term Quests
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        {longTermQuests.filter(quest => quest.questMode === "individual").map(renderGoalItem)}
                        <li className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsGoalFormOpen(true)}
                            className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add New Quest
                          </Button>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="group">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                    <CardTitle className="text-lg font-bold flex items-center">
                      <Users className="mr-2 h-5 w-5 text-green-500" />
                      Group Quests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {groupQuests.map(renderGroupQuestItem)}
                      {longTermQuests.filter(quest => quest.questMode === "group").map(renderGoalItem)}
                      <li className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsGoalFormOpen(true)}
                          className="w-full border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-500 hover:text-blue-500 flex items-center justify-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          <Users className="h-4 w-4 mx-1" />
                          Create Group Quest
                        </Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <KidatoMascot />

      <GoalFormDialog
        isOpen={isGoalFormOpen}
        setIsOpen={setIsGoalFormOpen}
        onSubmit={handleCreateGoal}
      />

      <GoalTrackingDialog
        isOpen={isTrackingOpen}
        setIsOpen={setIsTrackingOpen}
        goal={selectedGoal}
        onUpdateGoal={handleUpdateGoal}
      />
    </div>
  );
}

export default Challenges;
