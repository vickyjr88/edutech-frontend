
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Users, Target, MessageSquare } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";

const GroupWork = () => {
  const [userName] = useState("John Doe");
  const [activeTab, setActiveTab] = useState("current");

  // Mock data for group projects
  const currentGroups = [
    {
      id: 1,
      name: "Math Problem Solvers",
      subject: "Mathematics",
      progress: 65,
      members: [
        { id: 1, name: "John D", image: "" },
        { id: 2, name: "Emma W", image: "" },
        { id: 3, name: "Tyler S", image: "" }
      ],
      meetingTime: "Tuesday, 4:00 PM",
      deadline: "April 20, 2025",
      description: "Collaborative group working on advanced algebra problems and preparing for the math competition."
    },
    {
      id: 2,
      name: "Science Fair Team",
      subject: "Science",
      progress: 40,
      members: [
        { id: 1, name: "John D", image: "" },
        { id: 4, name: "Olivia P", image: "" },
        { id: 5, name: "Michael T", image: "" },
        { id: 6, name: "Sophia R", image: "" }
      ],
      meetingTime: "Thursday, 3:30 PM",
      deadline: "May 15, 2025",
      description: "Preparing a research project on renewable energy sources for the national science fair competition."
    }
  ];
  
  const completedGroups = [
    {
      id: 3,
      name: "History Documentary",
      subject: "History",
      grade: "A",
      members: [
        { id: 1, name: "John D", image: "" },
        { id: 7, name: "David L", image: "" },
        { id: 8, name: "Lisa M", image: "" }
      ],
      completedDate: "March 10, 2025",
      description: "Created a documentary film about local historical landmarks and their significance."
    }
  ];
  
  const invitedGroups = [
    {
      id: 4,
      name: "Creative Writing Circle",
      subject: "English",
      members: [
        { id: 9, name: "James K", image: "" },
        { id: 10, name: "Emily H", image: "" },
      ],
      invitedBy: "Ms. Johnson",
      deadline: "Ongoing",
      description: "A group dedicated to creative writing, poetry, and short story development."
    }
  ];

  const handleUpdateGoal = (groupId: number, progress: number) => {
    console.log("Updating group progress:", { groupId, progress });
    // This would update the progress in a real application
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
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Group Work</h1>
                <p className="text-gray-600">Collaborate with your classmates on projects</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline">Find Groups</Button>
                <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                  Create Group
                </Button>
              </div>
            </div>
            
            {/* Group Tabs */}
            <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Current Groups
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Completed Groups
                </TabsTrigger>
                <TabsTrigger value="invited" className="data-[state=active]:bg-white data-[state=active]:text-kidato-blue data-[state=active]:shadow-sm rounded-md">
                  Group Invitations
                </TabsTrigger>
              </TabsList>
              
              {/* Current Groups Tab */}
              <TabsContent value="current">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {currentGroups.map(group => (
                    <Card key={group.id} className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                              {group.subject}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{group.progress}%</span>
                          </div>
                          <Progress value={group.progress} className="h-2" />
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">
                          {group.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{group.members.length} Members</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{group.meetingTime}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Due: {group.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 3).map(member => (
                              <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                                {member.image ? (
                                  <AvatarImage src={member.image} alt={member.name} />
                                ) : (
                                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            ))}
                            {group.members.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
                                +{group.members.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Materials</Button>
                            <Button 
                              className="bg-kidato-blue hover:bg-kidato-dark-blue" 
                              size="sm"
                              onClick={() => handleUpdateGoal(group.id, group.progress + 10)}
                            >
                              Update Progress
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Completed Groups Tab */}
              <TabsContent value="completed">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedGroups.map(group => (
                    <Card key={group.id} className="border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                Completed
                              </Badge>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                {group.subject}
                              </Badge>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-md bg-green-100 text-green-800 font-medium">
                            Grade: {group.grade}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                          {group.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{group.members.length} Members</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Completed: {group.completedDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-2">
                            {group.members.map(member => (
                              <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                                {member.image ? (
                                  <AvatarImage src={member.image} alt={member.name} />
                                ) : (
                                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View Report</Button>
                            <Button variant="outline" size="sm">Certificate</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Invitations Tab */}
              <TabsContent value="invited">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {invitedGroups.map(group => (
                    <Card key={group.id} className="border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                            <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                              Invitation
                            </Badge>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {group.subject}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                          {group.description}
                        </p>
                        
                        <div className="p-3 mb-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm">
                          <p className="font-medium text-yellow-800">
                            You've been invited by {group.invitedBy} to join this group!
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Users className="mr-2 h-4 w-4 text-blue-500" />
                            <span>{group.members.length} Current Members</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Target className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Timeline: {group.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex -space-x-2">
                            {group.members.map(member => (
                              <Avatar key={member.id} className="border-2 border-white h-8 w-8">
                                {member.image ? (
                                  <AvatarImage src={member.image} alt={member.name} />
                                ) : (
                                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
                              Decline
                            </Button>
                            <Button className="bg-kidato-blue hover:bg-kidato-dark-blue" size="sm">
                              Accept Invitation
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
}

export default GroupWork;
