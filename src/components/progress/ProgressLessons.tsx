
import { useEffect, useState } from "react";
import InProgressLessonsCard from "./InProgressLessonsCard";
import AllLessonsCard from "./AllLessonsCard";
import LessonReviewModal from "./LessonReviewModal";
import JoinClassDialog from "@/components/dashboard/JoinClassDialog";
import { getMockLessonsData } from "./lessonData";

interface ProgressLessonsProps {
  courseId?: string;
}

const ProgressLessons = ({ courseId }: ProgressLessonsProps) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [joinClassOpen, setJoinClassOpen] = useState(false);
  const [selectedInProgressLesson, setSelectedInProgressLesson] = useState<any>(null);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call using courseId
      const data = getMockLessonsData();
      setLessons(data);
      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  const handleReviewLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setReviewModalOpen(true);
  };

  const handleContinueLearning = (lesson: any) => {
    setSelectedInProgressLesson(lesson);
    setJoinClassOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading lessons data...</div>;
  }

  const completedLessons = lessons.filter(lesson => lesson.status === "completed");
  const inProgressLessons = lessons.filter(lesson => lesson.status === "in-progress");
  const upcomingLessons = lessons.filter(lesson => lesson.status === "upcoming");

  return (
    <div className="space-y-6">
      {/* In Progress Lessons */}
      <InProgressLessonsCard 
        inProgressLessons={inProgressLessons}
        onContinueLearning={handleContinueLearning}
      />
      
      {/* All Lessons Table */}
      <AllLessonsCard 
        lessons={lessons}
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
