import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Clock, Star, CalendarClock, Check, UserPlus, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { waitlistService } from "@/integrations/api/services/waitlist.service";

interface WaitingListTabProps {
  classId?: string;
}

const WaitingListTab = ({ classId }: WaitingListTabProps) => {
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitingIds, setInvitingIds] = useState<string[]>([]);
  const [waitingList, setWaitingList] = useState<any[]>([]);

  useEffect(() => {
    if (classId) {
      loadWaitlist();
    }
  }, [classId]);

  const loadWaitlist = async () => {
    if (!classId) return;
    try {
      const response = await waitlistService.getWaitlist(classId);
      setWaitingList(response.data);
    } catch (error) {
      console.error('Failed to load waitlist:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === waitingList.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(waitingList.map(student => student.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(studentId => studentId !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleInvite = async () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to invite.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "Invitations sent",
      description: `Successfully sent invitations to ${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''}.`,
    });
    setSelectedStudents([]);
    setIsLoading(false);
  };

  const handleInviteIndividual = async (id: string, name: string) => {
    setInvitingIds([...invitingIds, id]);
    toast({
      title: "Invitation sent",
      description: `Successfully sent invitation to ${name}.`,
    });
    setInvitingIds(invitingIds.filter(inviteId => inviteId !== id));
  };

  const getInterestIcon = (interest: string) => {
    switch(interest) {
      case 'very-high':
        return <div className="flex"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /></div>;
      case 'high':
        return <div className="flex"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /></div>;
      case 'medium':
        return <div className="flex"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /></div>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === "waiting" ? "secondary" : "outline";
  };

  return (
    <Card className="shadow-md border-slate-200">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-slate-800">Waiting List & Bookmarks</CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              Students who are waiting for a spot in your class or have bookmarked it
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 bg-white">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="font-medium">{waitingList.length} students</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {waitingList.length === 0 ? (
          <div className="text-center py-10">
            <div className="rounded-full bg-slate-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">No Students Waiting</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4 max-w-md mx-auto">
              No students are currently waiting to join this class.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border rounded-md">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedStudents.length === waitingList.length && waitingList.length > 0} 
                      onCheckedChange={handleSelectAll} 
                      className="ml-2"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingList.map((student) => (
                  <TableRow key={student.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <Checkbox 
                        checked={selectedStudents.includes(student.id)} 
                        onCheckedChange={() => handleSelect(student.id)} 
                        className="ml-2"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarImage src={student.avatar || undefined} alt={student.name} />
                          <AvatarFallback className="bg-kidato-purple text-white text-xs">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-800">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(student.status)} className="flex w-fit items-center gap-1 font-normal">
                        {student.status === "waiting" ? (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>Waiting</span>
                          </>
                        ) : (
                          <>
                            <Star className="h-3 w-3" />
                            <span>Bookmarked</span>
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarClock className="h-3 w-3" />
                        {new Date(student.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getInterestIcon(student.interest)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleInviteIndividual(student.id, student.name)}
                        disabled={invitingIds.includes(student.id)}
                        className="w-[110px] bg-white hover:bg-slate-50 border-slate-200"
                      >
                        {invitingIds.includes(student.id) ? (
                          <>
                            <span className="animate-pulse">Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5 mr-1.5" />
                            Invite
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-slate-50">
        <div className="text-sm text-slate-500">
          {selectedStudents.length > 0 ? (
            <Badge variant="outline" className="bg-white">
              <span className="font-medium">{selectedStudents.length}</span> student{selectedStudents.length > 1 ? 's' : ''} selected
            </Badge>
          ) : (
            'No students selected'
          )}
        </div>
        <Button 
          onClick={handleInvite} 
          disabled={selectedStudents.length === 0 || isLoading}
          className="flex items-center gap-2 bg-kidato-purple hover:bg-kidato-dark-blue"
        >
          {isLoading ? 'Sending Invites...' : 'Invite Selected'}
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WaitingListTab;
