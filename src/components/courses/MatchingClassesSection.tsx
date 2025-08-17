
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageSquare, Users, Clock, Calendar, UserRound, Sparkles, Star, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClassDetail } from "@/integrations/api/services/class.service";
import { describeAvailability, getNextClassTime, getUserInitials } from "@/lib/utils";
import { useSelfEnroll } from "@/hooks/use-enrollment-service";
import { formatDate } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { MessageTeacherDialog } from '@/components/common/MessageTeacherDialog'; // Import the new dialog

interface MatchingClassesSectionProps {
  course: ClassDetail;
}

function courseIsNew(course: ClassDetail) {
  const today = new Date();
  const createdAtDate = new Date(course.createdAt);
  return (today.getTime() - createdAtDate.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days
}

const MatchingClassesSection = ({ course }: MatchingClassesSectionProps) => {
  const { mutate: enroll } = useSelfEnroll();
  const { toast } = useToast();
  const matchingTeacher = course.teacher; // Use populated teacher data directly from course
  const cohort = course.cohorts?.find((cohort) => cohort.isActive) ?? course.cohorts?.[0];

  const [showMessageDialog, setShowMessageDialog] = useState(false); // State for dialog visibility

  const nextClassTime = getNextClassTime({
    daysOfWeek: cohort?.daysOfWeek,
    startTime: cohort?.startTime,
    endTime: cohort?.endTime
  });
  const handleEnroll = () => {
    enroll({
      classId: course._id,
      cohortId: cohort?._id
    });
    toast({
      title: "Enrollment Successful",
      description: "You have successfully enrolled in the class.",
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Teacher Card - Now First */}
      {matchingTeacher && matchingTeacher.user && (
        <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 border-2 border-blue-200 bg-blue-100">
                <AvatarFallback className="text-blue-700 font-medium">
                  {getUserInitials(matchingTeacher.user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{matchingTeacher.user.fullName}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {matchingTeacher.subjects?.map((subject, i) => (
                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {subject.subject}
                    </Badge>
                  ))}
                  <div className="flex items-center text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                    <span className="font-medium">{matchingTeacher.rating || course.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 my-4">{matchingTeacher.user.bio}</p>

            <div className="flex items-center text-gray-600 mb-4">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>Available: {matchingTeacher.availability ? describeAvailability(matchingTeacher.availability) : 'Contact for availability'}</span>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" asChild>
                <Link to={`/teacher/${matchingTeacher._id}`}>
                  View Profile
                </Link>
              </Button>
              <Button
                className="bg-kidato-purple hover:bg-kidato-dark-blue"
                onClick={() => setShowMessageDialog(true)} // Wire the button
              >
                Message Teacher
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arrow Connecting Teacher to Class */}
      <div className="hidden lg:flex items-center justify-center">
        <ArrowRight className="h-10 w-10 text-blue-400" />
      </div>

      {/* Class Card - Now Second */}
      <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                {course.isFeatured && (
                  <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                    <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                    Featured
                  </Badge>
                )}
                {courseIsNew(course) && (
                  <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                    New
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  {course.subject}
                </Badge>
                <div className="flex items-center text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500 mr-1" />
                  <span className="font-medium">{course.rating}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="h-3.5 w-3.5 text-gray-500 mr-0.5" />
                  <span>{cohort?.price || 'Free'}/class</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="rounded-full p-2 h-auto" size="icon">
              <MessageSquare className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          <p className="text-gray-600 mb-6">{course.description}</p>

          <div className="flex flex-col space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span><strong>{course.enrolledStudents || 0}</strong> enrolled / <strong>{(cohort?.maximumStudents || 0) - (course.enrolledStudents || 0)}</strong> spots remaining</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>{nextClassTime ?? 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span>Enrollment deadline: {cohort.enrollmentDeadline ? formatDate(cohort.enrollmentDeadline, 'MMMM d, yyyy') : 'N/A'}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg mb-6">
            <div className="flex items-center mb-2">
              <UserRound className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Classmates taking this course</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {course.studentsList?.map((student, i) => (
                <div key={i} className="flex items-center bg-white rounded-full py-1 px-3 border border-blue-100">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="bg-blue-100 text-xs text-blue-700">{student.profileImage ? student.profileImage : getUserInitials(student.fullName)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{student.fullName}</span>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4 bg-blue-50">
                    {student.shared || student.numberOfSharedClasses || 0} shared {(student.shared || student.numberOfSharedClasses || 0) > 1 ? "classes" : "class"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleEnroll} className="bg-kidato-purple hover:bg-kidato-dark-blue">
              Enroll Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Teacher Dialog */}
      {matchingTeacher && matchingTeacher._id && matchingTeacher.user && (
        <MessageTeacherDialog
          isOpen={showMessageDialog}
          onOpenChange={setShowMessageDialog}
          teacherName={matchingTeacher.user.fullName}
          teacherId={matchingTeacher._id}
        />
      )}
    </div>
  );
};

export default MatchingClassesSection;
