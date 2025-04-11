
import { useEffect, useState } from "react";
import InProgressLessonsCard from "./InProgressLessonsCard";
import AllLessonsCard from "./AllLessonsCard";
import LessonReviewModal from "./LessonReviewModal";
import JoinClassDialog from "@/components/dashboard/JoinClassDialog";
import { getMockLessonsData } from "./lessonData";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an API call using courseId
      const data = getMockLessonsData();
      
      // Add start and end times for testing live lessons
      const enhancedData = data.map(lesson => {
        if (lesson.status === "in-progress") {
          // Generate times for testing - some lessons are happening now
          const now = new Date();
          const isLive = Math.random() > 0.5; // 50% chance lesson is live now
          
          if (isLive) {
            const startTime = new Date(now);
            startTime.setMinutes(now.getMinutes() - Math.floor(Math.random() * 30)); // Started 0-30 mins ago
            
            const endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + 60); // 60 min duration
            
            return {
              ...lesson,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString()
            };
          }
        }
        return lesson;
      });
      
      setLessons(enhancedData);
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
