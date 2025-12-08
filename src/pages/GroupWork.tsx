import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Users, Target, MessageSquare, UserPlus, Loader2 } from "lucide-react";
import StudentDashboardHeader from "@/components/dashboard/StudentDashboardHeader";
import StudentSidebar from "@/components/dashboard/StudentSidebar";
import KidatoMascot from "@/components/dashboard/KidatoMascot";
import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import GroupDetails from "@/components/groups/GroupDetails";
import { groupService, Group, GroupInvitation } from "@/integrations/api/services/group.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Helper to format date for display
const formatDate = (dateString?: string) => {
  if (!dateString) return "TBA";
  try {
    return format(new Date(dateString), "MMMM d, yyyy");
  } catch {
    return dateString;
  }
};

const formatMeetingTime = (dateString?: string) => {
  if (!dateString) return "TBA";
  try {
    return format(new Date(dateString), "EEEE, h:mm a");
  } catch {
    return dateString;
  }
};

// Helper to get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const GroupWork = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("current");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // API data states
  const [currentGroups, setCurrentGroups] = useState<Group[]>([]);
  const [completedGroups, setCompletedGroups] = useState<Group[]>([]);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const [activeRes, completedRes, invitationsRes] = await Promise.all([
        groupService.getAll(),
        groupService.getCompleted(),
        groupService.getInvitations(),
      ]);

      if (activeRes.data) setCurrentGroups(activeRes.data);
      if (completedRes.data) setCompletedGroups(completedRes.data);
      if (invitationsRes.data) setInvitations(invitationsRes.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (groupId: string, currentProgress: number) => {
    const newProgress = Math.min(currentProgress + 10, 100);
    setActionLoading(groupId);
    try {
      const { data } = await groupService.updateProgress(groupId, newProgress);
      if (data) {
        setCurrentGroups((prev) =>
          prev.map((g) => (g._id === groupId ? data : g))
        );
        if (data.isCompleted) {
          // Move to completed
          setCurrentGroups((prev) => prev.filter((g) => g._id !== groupId));
          setCompletedGroups((prev) => [data, ...prev]);
          toast({ title: "Congratulations!", description: "Group project completed!" });
        } else {
          toast({ title: "Progress Updated", description: `Progress: ${newProgress}%` });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update progress.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleGroupCreate = async (newGroup: any) => {
    try {
      const { data } = await groupService.create(newGroup);
      if (data) {
        setCurrentGroups((prev) => [data, ...prev]);
        toast({ title: "Success", description: "Group created successfully!" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create group.", variant: "destructive" });
    }
    setCreateDialogOpen(false);
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      const { data } = await groupService.acceptInvitation(invitationId);
      if (data) {
        setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
        setCurrentGroups((prev) => [data, ...prev]);
        toast({ title: "Joined!", description: "You have joined the group." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept invitation.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      await groupService.declineInvitation(invitationId);
      setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
      toast({ title: "Declined", description: "Invitation declined." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to decline invitation.", variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const openGroupDetails = (group: Group) => {
    setSelectedGroup(group);
    setDetailsDialogOpen(true);
  };

  const renderMemberAvatars = (members: Group["members"], maxShow = 3) => (
    <div className="flex -space-x-2">
      {members.slice(0, maxShow).map((member) => (
        <Avatar key={member._id} className="border-2 border-white h-8 w-8">
          {member.profileImage ? (
            <AvatarImage src={member.profileImage} alt={member.fullName} />
          ) : (
            <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
              {getInitials(member.fullName)}
            </AvatarFallback>
          )}
        </Avatar>
      ))}
      {members.length > maxShow && (
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 border-2 border-white">
          +{members.length - maxShow}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <StudentSidebar />
        <div className="flex-1 flex flex-col">
          <StudentDashboardHeader userName={user?.fullName || "Student"} />
          <main className="p-4 sm:p-6 flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-kidato-purple mx-auto mb-2" />
              <p className="text-gray-600">Loading groups...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <StudentSidebar />

      <div className="flex-1 flex flex-col">
        <StudentDashboardHeader userName={user?.fullName || "Student"} />

        <main className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Group Work</h1>
                <p className="text-gray-600">Collaborate with your classmates on projects</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline">Find Groups</Button>
                <Button
                  className="bg-kidato-purple hover:bg-kidato-dark-blue"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </div>
            </div>

            <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-blue-50/50 p-1 border border-blue-100">
                <TabsTrigger
                  value="current"
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Current Groups ({currentGroups.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Completed ({completedGroups.length})
                </TabsTrigger>
                <TabsTrigger
                  value="invited"
                  className="data-[state=active]:bg-white data-[state=active]:text-kidato-purple data-[state=active]:shadow-sm rounded-md"
                >
                  Invitations ({invitations.length})
                </TabsTrigger>
              </TabsList>

              {/* Current Groups Tab */}
              <TabsContent value="current">
                {currentGroups.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Groups</h3>
                    <p className="text-gray-500 mb-4">Create a group or join one to get started!</p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Your First Group
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {currentGroups.map((group) => (
                      <Card key={group._id} className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                              <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                {group.subject || group.class?.subject || "General"}
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

                          {group.description && (
                            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                          )}

                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Users className="mr-2 h-4 w-4 text-blue-500" />
                              <span>{group.members.length} Members</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="mr-2 h-4 w-4 text-blue-500" />
                              <span>{formatMeetingTime(group.nextSession)}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Due: {formatDate(group.dueDate)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {renderMemberAvatars(group.members)}
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => openGroupDetails(group)}>
                                Details
                              </Button>
                              <Button
                                className="bg-kidato-purple hover:bg-kidato-dark-blue"
                                size="sm"
                                onClick={() => handleUpdateProgress(group._id, group.progress)}
                                disabled={actionLoading === group._id}
                              >
                                {actionLoading === group._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Update Progress"
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Completed Groups Tab */}
              <TabsContent value="completed">
                {completedGroups.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Completed Groups Yet</h3>
                    <p className="text-gray-500">Complete your current projects to see them here!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {completedGroups.map((group) => (
                      <Card key={group._id} className="border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                  Completed
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                  {group.subject || group.class?.subject || "General"}
                                </Badge>
                              </div>
                            </div>
                            <div className="px-3 py-1 rounded-md bg-green-100 text-green-800 font-medium">
                              100%
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {group.description && (
                            <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                          )}

                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Users className="mr-2 h-4 w-4 text-blue-500" />
                              <span>{group.members.length} Members</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Completed: {formatDate(group.updatedAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {renderMemberAvatars(group.members)}
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View Report</Button>
                              <Button variant="outline" size="sm">Certificate</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Invitations Tab */}
              <TabsContent value="invited">
                {invitations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Pending Invitations</h3>
                    <p className="text-gray-500">Check back later for group invitations!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {invitations.map((invitation) => (
                      <Card key={invitation._id} className="border border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold">{invitation.group.name}</CardTitle>
                              <Badge variant="outline" className="mt-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
                                Invitation
                              </Badge>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                              {invitation.group.subject || "General"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {invitation.group.description && (
                            <p className="text-sm text-gray-600 mb-4">{invitation.group.description}</p>
                          )}

                          <div className="p-3 mb-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm">
                            <p className="font-medium text-yellow-800">
                              You've been invited by {invitation.inviter.fullName} to join this group!
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-4">
                            <div className="flex items-center text-sm">
                              <Users className="mr-2 h-4 w-4 text-blue-500" />
                              <span>{invitation.group.members.length} Current Members</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Target className="mr-2 h-4 w-4 text-blue-500" />
                              <span>Timeline: {invitation.group.timeline || "Ongoing"}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {renderMemberAvatars(invitation.group.members)}
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-500 hover:bg-red-50"
                                onClick={() => handleDeclineInvitation(invitation._id)}
                                disabled={actionLoading === invitation._id}
                              >
                                {actionLoading === invitation._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Decline"
                                )}
                              </Button>
                              <Button
                                className="bg-kidato-purple hover:bg-kidato-dark-blue"
                                size="sm"
                                onClick={() => handleAcceptInvitation(invitation._id)}
                                disabled={actionLoading === invitation._id}
                              >
                                {actionLoading === invitation._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Accept"
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onGroupCreate={handleGroupCreate}
      />

      <GroupDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        group={selectedGroup}
      />

      {/* Kidato AI Mascot */}
      <KidatoMascot />
    </div>
  );
};

export default GroupWork;
