
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Clock, Star, CalendarClock, Check, UserPlus } from "lucide-react";

interface WaitingListTabProps {
  classId?: string;
}

const WaitingListTab = ({ classId }: WaitingListTabProps) => {
  const { toast } = useToast();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for waiting list - in a real app, this would come from the database
  const waitingList = [
    { 
      id: "1", 
      name: "Jane Smith", 
      email: "jane.smith@example.com", 
      status: "waiting",
      date: "2025-03-15",
      interest: "very-high"
    },
    { 
      id: "2", 
      name: "John Doe", 
      email: "john.doe@example.com", 
      status: "bookmarked",
      date: "2025-03-10",
      interest: "high"
    },
    { 
      id: "3", 
      name: "Alice Johnson", 
      email: "alice.johnson@example.com", 
      status: "waiting",
      date: "2025-03-20",
      interest: "medium"
    },
    { 
      id: "4", 
      name: "Bob Williams", 
      email: "bob.williams@example.com", 
      status: "bookmarked",
      date: "2025-03-05",
      interest: "high"
    },
    { 
      id: "5", 
      name: "Sarah Davis", 
      email: "sarah.davis@example.com", 
      status: "waiting",
      date: "2025-03-22",
      interest: "very-high"
    }
  ];

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

  const handleInvite = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to invite.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Invitations sent",
        description: `Successfully sent invitations to ${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''}.`,
      });
      setSelectedStudents([]);
    }, 1500);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Waiting List & Bookmarks</CardTitle>
            <CardDescription>
              Students who are waiting for a spot in your class or have bookmarked it
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {waitingList.length} students
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {waitingList.length === 0 ? (
          <div className="text-center py-10">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No Students Waiting</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              No students are currently waiting to join this class.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedStudents.length === waitingList.length && waitingList.length > 0} 
                    onCheckedChange={handleSelectAll} 
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Interest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitingList.map((student) => (
                <TableRow key={student.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedStudents.includes(student.id)} 
                      onCheckedChange={() => handleSelect(student.id)} 
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.status === "waiting" ? "secondary" : "outline"} className="flex w-fit items-center gap-1">
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
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <CalendarClock className="h-3 w-3" />
                      {new Date(student.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getInterestIcon(student.interest)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="text-sm text-gray-500">
          {selectedStudents.length > 0 ? `${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} selected` : 'No students selected'}
        </div>
        <Button 
          onClick={handleInvite} 
          disabled={selectedStudents.length === 0 || isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? 'Sending Invites...' : 'Invite Selected Students'}
          {isLoading ? <div className="h-4 w-4 animate.spin" /> : <UserPlus className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WaitingListTab;
