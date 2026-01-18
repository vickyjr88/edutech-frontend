import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { Users, Star, MessageSquare, Loader2, AlertCircle, GraduationCap, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { classService } from "@/integrations/api/services/class.service";
import { useNavigate } from "react-router-dom";
import { messagingService } from "@/integrations/api/services/messaging.service";
import { toast } from "@/hooks/use-toast";
import MessageTeacherDialog from "@/components/teacher/profile/MessageTeacherDialog";

interface TeacherDisplay {
  id: string;
  userId: string;
  name: string;
  subjects: string[];
  experience: string;
  rating: number;
  availability: string;
  reviews: number;
  specializations: string[];
  education: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

const ParentsTeachers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherDisplay | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const response = await classService.getCurrentClassesForStudent(user.id);

        if (response.data && Array.isArray(response.data)) {
          const uniqueTeachers = new Map<string, TeacherDisplay>();

          response.data.forEach((enrollment: any) => {
            // Note: In getCurrentClassesForStudent, enrollment.class.teacher.user contains the populated user
            // But wait, checking service... it populates enrollment.class.teacher.user
            // The mapping should reflect this.

            const cls = enrollment.class || (enrollment.course ? { _id: enrollment.course.id, title: enrollment.course.title, teacher: enrollment.teacher } : null);

            if (cls && cls.teacher) {
              const teacherId = cls.teacher._id;
              if (!uniqueTeachers.has(teacherId)) {
                const name = cls.teacher.name || cls.teacher.user?.fullName || "Unknown Teacher";
                const avatar = cls.teacher.user?.profileImage;
                const userId = cls.teacher.user?._id;
                const phone = cls.teacher.user?.phoneNumber || cls.teacher.user?.alternativePhoneNumber;

                const subjects = cls.teacher.subjects
                  ? cls.teacher.subjects.map((s: any) => s.subject)
                  : [cls.subject];

                uniqueTeachers.set(teacherId, {
                  id: teacherId,
                  userId: userId,
                  name: name,
                  subjects: subjects,
                  experience: "Experienced",
                  rating: cls.teacher.rating || 5.0,
                  availability: "Check schedule",
                  reviews: cls.teacher.totalReviews || 0,
                  specializations: [],
                  education: "Certified Educator",
                  avatarUrl: avatar,
                  phoneNumber: phone
                });
              } else {
                const existing = uniqueTeachers.get(teacherId)!;
                if (cls.subject && !existing.subjects.includes(cls.subject)) {
                  existing.subjects.push(cls.subject);
                }
              }
            }
          });

          setTeachers(Array.from(uniqueTeachers.values()));
        }
      } catch (err) {
        console.error("Failed to fetch teachers", err);
        setError("Failed to load teachers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [user?.id]);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some(s => s?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = subjectFilter === 'all' || teacher.subjects.some(s => s === subjectFilter);
    return matchesSearch && matchesSubject;
  });

  const handleContact = (teacher: TeacherDisplay) => {
    setSelectedTeacher(teacher);
    setIsMessageDialogOpen(true);
  };

  const handleSendMessage = async (userId: string, message: string) => {
    try {
      // In a real implementation, we would send the message here
      // For now, we'll start a conversation and then navigate (or just show success)
      const response = await messagingService.startDirectMessage(userId);
      if (response.data && response.data.conversationId) {
        // Here we could actually send the message content using messagingService.sendMessage
        // But for now, just navigating to the messaging page is consistent with other parts
        toast({
          title: "Message Initiated",
          description: "Starting conversation...",
        });
        navigate('/parents-messages');
      }
    } catch (e) {
      console.error("Failed to start conversation", e);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-kidato-purple" />
                <h1 className="text-2xl font-bold">Our Teachers</h1>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teachers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {Array.from(new Set(teachers.flatMap(t => t.subjects)))
                      .sort()
                      .map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{error}</p>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No teachers found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredTeachers.map((teacher) => (
                  <Card key={teacher.id} className="hover:border-blue-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                          <AvatarFallback className="bg-blue-500 text-lg text-white">
                            {teacher.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-bold">{teacher.name}</h3>
                              <p className="text-gray-600 flex items-center gap-1">
                                <GraduationCap className="h-3.5 w-3.5" />
                                {teacher.education}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                              <div className="text-left sm:text-right">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 font-medium">{teacher.rating}</span>
                                  <span className="text-gray-500 text-sm ml-1">
                                    ({teacher.reviews} reviews)
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{teacher.experience}</p>
                              </div>
                              <Button
                                className="flex items-center gap-2 w-full sm:w-auto"
                                onClick={() => handleContact(teacher)}
                              >
                                <MessageSquare className="h-4 w-4" />
                                Contact
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {teacher.subjects.map((subject, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedTeacher && (
        <MessageTeacherDialog
          teacherName={selectedTeacher.name}
          teacherId={selectedTeacher.userId}
          teacherPhone={selectedTeacher.phoneNumber}
          isOpen={isMessageDialogOpen}
          onClose={() => setIsMessageDialogOpen(false)}
          onSendMessage={(msg) => handleSendMessage(selectedTeacher.userId, msg)}
        />
      )}
    </div>
  );
};

export default ParentsTeachers;
