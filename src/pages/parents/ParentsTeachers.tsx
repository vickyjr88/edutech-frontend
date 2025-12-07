import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { Users, Star, MessageSquare, Loader2, AlertCircle, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { classService, Class } from "@/integrations/api/services/class.service";
import { useNavigate } from "react-router-dom";
import { messagingService } from "@/integrations/api/services/messaging.service";
import { toast } from "@/hooks/use-toast";

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
}

const ParentsTeachers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Fetch enrolled classes to find teachers
        // We'll use getCurrentClassesForStudent. Note: The return type in service is never[] but it returns data.
        const response = await classService.getCurrentClassesForStudent(user.id);

        if (response.data && Array.isArray(response.data)) {
          const uniqueTeachers = new Map<string, TeacherDisplay>();

          response.data.forEach((cls: any) => {
            if (cls.teacher) {
              const teacherId = cls.teacher._id;
              if (!uniqueTeachers.has(teacherId)) {
                // Extract teacher data
                // Note: The structure depends on population. 
                // Based on Class interface: teacher has user { fullName, profileImage }

                const name = cls.teacher.name || cls.teacher.user?.fullName || "Unknown Teacher";
                const avatar = cls.teacher.user?.profileImage;
                const userId = cls.teacher.user?._id;

                // Collect subjects from the teacher's profile in the class object if available,
                // otherwise start with the current class subject
                const subjects = cls.teacher.subjects
                  ? cls.teacher.subjects.map((s: any) => s.subject)
                  : [cls.subject];

                // If we encounter this teacher again, we might want to append the subject
                // But for now, let's just create the entry

                uniqueTeachers.set(teacherId, {
                  id: teacherId,
                  userId: userId,
                  name: name,
                  subjects: subjects,
                  experience: "Experienced", // Placeholder if not in class data
                  rating: cls.teacher.rating || 5.0,
                  availability: "Check schedule", // Placeholder
                  reviews: cls.teacher.totalReviews || 0, // Assuming this might be on the teacher object
                  specializations: [], // Placeholder
                  education: "Certified Educator", // Placeholder
                  avatarUrl: avatar
                });
              } else {
                // Update existing teacher with more subjects if found
                const existing = uniqueTeachers.get(teacherId)!;
                if (!existing.subjects.includes(cls.subject)) {
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

  const handleContact = async (teacherUserId: string) => {
    if (!teacherUserId) {
      toast({
        title: "Error",
        description: "Cannot contact teacher: User information missing",
        variant: "destructive"
      });
      return;
    }

    try {
      // Start a DM
      const response = await messagingService.startDirectMessage(teacherUserId);
      if (response.data && response.data.conversationId) {
        navigate('/parents-messages'); // Or navigate to specific conversation if detailed view supported
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
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-6 w-6 text-kidato-purple" />
              <h1 className="text-2xl font-bold">Our Teachers</h1>
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
            ) : teachers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No teachers found. Enroll in classes to see your teachers here.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {teachers.map((teacher) => (
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
                                onClick={() => handleContact(teacher.userId)}
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

                            {/* 
                            We removed specific fields like specializations/availability from display 
                            unless we fetch full profile. For now, we simplified the card based on available data.
                          */}
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
    </div>
  );
};

export default ParentsTeachers;
