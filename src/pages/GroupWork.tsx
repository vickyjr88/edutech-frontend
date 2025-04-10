import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus, BarChart2, Target, Users, Calendar } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import GoalTrackingDialog from "@/components/dashboard/GoalTrackingDialog";
import { useToast } from "@/components/ui/use-toast";

const GroupWork = () => {
  const [userName] = useState("John Doe");
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const { toast } = useToast();

  const handleEditQuest = (quest: any) => {
    setSelectedQuest(quest);
    setIsTrackingOpen(true);
  };
  
  const handleUpdateQuest = (questId: string, progress: number, notes: string, timeSpent?: string) => {
    console.log("Group quest updated:", { questId, progress, notes, timeSpent });
    toast({
      title: "Group Progress Updated",
      description: `Group quest progress has been updated to ${progress}%. ${timeSpent ? `Time spent: ${timeSpent}` : ''}`,
    });
  };

  // Mock data for groups
  const groups = [
    {
      id: 1,
      name: "Math Study Group",
      members: 4,
      subject: "Mathematics",
      nextMeeting: "Tomorrow, 3:00 PM",
      assignment: "Algebra Quiz Prep",
      avatars: ["JD", "AM", "RK", "SL"],
    },
    {
      id: 2,
      name: "Science Project Team",
      members: 3,
      subject: "Science",
      nextMeeting: "Wednesday, 4:30 PM",
      assignment: "Ecosystem Presentation",
      avatars: ["JD", "BT", "MP"],
    },
    {
      id: 3,
      name: "Coding Challenge Squad",
      members: 5,
      subject: "Computer Science",
      nextMeeting: "Friday, 5:00 PM",
      assignment: "Game Development Project",
      avatars: ["JD", "RJ", "KL", "DN", "AL"],
    }
  ];
  
  // Group quests data
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
  
  // Function to get progress color class
  const getProgressColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500"
    };
    
    return colorMap[color] || "bg-blue-500";
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
              <h1 className="text-2xl font-bold text-gray-800">Group Work</h1>
              <Link to="/challenges">
                <Button className="bg-kidato-blue hover:bg-kidato-dark-blue rounded-xl flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group Quest
                </Button>
              </Link>
            </div>
            
            {/* Group Quests Section */}
            <Card className="mb-6">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  Active Group Quests
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {groupQuests.map(quest => (
                    <div key={quest.id} className="border border-blue-100 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {quest.title}
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-600 border-blue-100">
                              {quest.subject}
                            </Badge>
                          </h3>
                          <p className="text-sm text-gray-600">{quest.description}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 border-blue-300 hover:bg-blue-100"
                          onClick={() => handleEditQuest(quest)}
                        >
                          <BarChart2 className="h-3 w-3" />
                          Update Progress
                        </Button>
                      </div>
                      
                      <div className="my-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">{quest.progress}%</span>
                        </div>
                        <Progress value={quest.progress} className="h-2" 
                          indicatorClassName={getProgressColorClass(quest.color)} />
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600 mr-2">Team:</span>
                          <div className="flex -space-x-2">
                            {quest.members.map((member, index) => {
                              const initials = member.split(' ').map(n => n[0]).join('');
                              return (
                                <Avatar key={index} className="border-2 border-white h-7 w-7">
                                  <AvatarFallback className="text-xs bg-blue-100 text-blue-500">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          Due: {quest.dueIn}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* My Groups */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Study Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {groups.map((group) => (
                <Card key={group.id} className="overflow-hidden border-2 border-blue-100">
                  <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1">{group.subject}</p>
                        <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-600">
                        {group.members} members
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Assignment</p>
                        <p className="font-medium">{group.assignment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Next Meeting</p>
                        <p className="font-medium">{group.nextMeeting}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex -space-x-2">
                          {group.avatars.map((avatar, index) => (
                            <Avatar key={index} className="border-2 border-white h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-500 text-xs">
                                {avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 rounded-lg border-blue-200 text-blue-600">
                          <MessageSquare className="h-3 w-3" /> 
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Join a Group Card */}
              <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30 flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-4">
                  <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                    <UserPlus className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Join a Group</h3>
                    <p className="text-sm text-gray-500 mt-1">Find study groups based on your classes</p>
                  </div>
                  <Button variant="outline" className="border-blue-200 text-blue-600">
                    Browse Groups
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Group Recommendations */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-500" />
                  Recommended Groups
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Advanced Math Study Group</p>
                      <p className="text-sm text-gray-600">6 members • Mathematics</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg border-green-200 text-green-600">
                      Join
                    </Button>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Python Programming Team</p>
                      <p className="text-sm text-gray-600">4 members • Computer Science</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg border-purple-200 text-purple-600">
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
      
      {/* Group Quest Progress Dialog */}
      <GoalTrackingDialog 
        isOpen={isTrackingOpen}
        setIsOpen={setIsTrackingOpen}
        goal={selectedQuest}
        onUpdateGoal={handleUpdateGoal}
      />
    </div>
  );
}

export default GroupWork;
