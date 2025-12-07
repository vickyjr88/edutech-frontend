import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useClassById } from "@/hooks/use-class-service";
import { ClassItemProps } from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EnrollmentForm from "./EnrollmentForm";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";

const ClassDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch class details
  const { data: response, isLoading, error } = useClassById(id || "");
  const classDetail = response?.data;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-purple"></div>
      </div>
    );
  }

  if (error || !classDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Class not found</h2>
        <p className="text-gray-600 mt-2">The class you are looking for does not exist or has been removed.</p>
        <Button
          className="mt-6"
          onClick={() => navigate("/all-classes")}
        >
          Browse Classes
        </Button>
      </div>
    );
  }

  // Detect if user is a teacher viewing their own class
  const isTeacherViewingOwnClass = user?.role === 'teacher' &&
    (classDetail.teacher?._id === user?.teacherId || classDetail.teacher?.user?._id === user?.id);

  if (isTeacherViewingOwnClass) {
    return <TeacherClassView classId={id} />;
  }

  // Helper to format simplified class item for display
  const activeCohort = classDetail.cohorts?.[0]; // Assuming first cohort for simplified view
  const classItem = {
    title: classDetail.title,
    subject: classDetail.subject,
    level: classDetail.gradeLevel,
    teacher: classDetail.teacher?.user?.fullName || classDetail.teacher?.name || "Unknown Teacher",
    rating: classDetail.rating || 0,
    time: activeCohort
      ? `${activeCohort.daysOfWeek.join(' & ')}, ${activeCohort.startTime}`
      : "Schedule TBA",
    imageSrc: classDetail.media?.thumbnailUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: activeCohort
      ? `${activeCohort.maximumStudents - activeCohort.currentStudents} spots left`
      : "Open",
    price: activeCohort ? `$${activeCohort.price}/class` : "Price Varies"
  };

  // Student/parent view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/all-classes" className="flex items-center text-kidato-purple mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
      </Link>

      {/* This is a simplified version that would show to students/parents */}
      {/* In a full implementation, you would have a separate StudentClassView component */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{classItem.title}</h1>
          <p className="text-lg text-gray-600">{classItem.subject} - {classItem.level}</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isEnrollmentOpen} onOpenChange={setIsEnrollmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kidato-purple hover:bg-kidato-dark-blue">
                Enroll Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Enroll in {classItem.title}</DialogTitle>
              </DialogHeader>
              <EnrollmentForm
                classId={id || ""}
                cohortId={activeCohort?._id}
                classTitle={classItem.title}
                classPrice={classItem.price}
                onSubmitSuccess={() => setIsEnrollmentOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleBookmark}
          >
            <Heart className={`h-4 w-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="text-center p-12 border border-dashed rounded-lg">
        <p className="text-gray-600">Student view - Full details would appear here.</p>
        <p className="text-gray-500 mt-2 text-sm">{classDetail.summary || classDetail.description}</p>
      </div>
    </div>
  );
};

export default ClassDetails;
