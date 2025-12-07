
import { useState } from "react";
import InProgressLessonsCard from "./InProgressLessonsCard";
import AllLessonsCard from "./AllLessonsCard";
import LessonReviewModal from "./LessonReviewModal";
import JoinClassDialog from "@/components/dashboard/JoinClassDialog";
import { useToast } from "@/hooks/use-toast";
import { useGetLessonPlans } from "@/hooks/use-class-service";
interface ProgressLessonsProps {
  courseId?: string;
}

const ProgressLessons = ({ courseId }: ProgressLessonsProps) => {
  const {data: lessonsData, isLoading} = useGetLessonPlans(courseId);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [joinClassOpen, setJoinClassOpen] = useState(false);
  const [selectedInProgressLesson, setSelectedInProgressLesson] = useState<any>(null);
  const { toast } = useToast();
  const lessonPlans = lessonsData?.data?.data || [];
  const loading = isLoading;

  const handleReviewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setReviewModalOpen(true);
  };

  const handleContinueLearning = (lesson: any) => {
    setSelectedInProgressLesson(lesson);
    setJoinClassOpen(true);
    
    if (lesson.startTime && lesson.endTime) {
      const startTime = new Date(lesson.startTime);
      const endTime = new Date(lesson.endTime);
      const now = new Date();
      
      if (now >= startTime && now <= endTime) {
        // It's a live class
        toast({
          title: "Live Class In Progress!",
          description: "Joining you to your live class session.",
          variant: "default",
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading lessons data...</div>;
  }

  const completedLessons = lessonPlans?.filter(lesson => lesson.status === "completed");
  const inProgressLessons = lessonPlans?.filter(lesson => lesson.status === "in-progress");
  const upcomingLessons = lessonPlans?.filter(lesson => lesson.status === "upcoming");

  return (
    <div className="space-y-6">
      {/* In Progress Lessons */}
      <InProgressLessonsCard 
        inProgressLessons={inProgressLessons}
        onContinueLearning={handleContinueLearning}
      />

      {/* All Lessons Table */}
      <AllLessonsCard 
        lessons={lessonPlans}
        onReviewLesson={handleReviewLesson}
        onContinueLearning={handleContinueLearning}
      />

      {/* Review Modal */}
      {selectedLesson && (
        <LessonReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          lessonTitle={selectedLesson.title}
          lessonId={selectedLesson.id}
        />
      )}

      {/* Join Class Dialog */}
      {selectedInProgressLesson && (
        <JoinClassDialog
          isOpen={joinClassOpen}
          setIsOpen={setJoinClassOpen}
          classTitle={selectedInProgressLesson.title}
        />
      )}
    </div>
  );
};

export default ProgressLessons;
