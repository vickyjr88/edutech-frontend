
import MessageTeacherDialog from "./MessageTeacherDialog";
import VideoProfileDialog from "./VideoProfileDialog";

interface TeacherActionsProps {
  teacher: {
    name: string;
    videoProfileUrl?: string;
  };
}

export default function TeacherActions({ teacher }: TeacherActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start sticky md:static bottom-4 left-0 right-0 z-10 md:z-0 p-2 md:p-0 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
      <MessageTeacherDialog teacherName={teacher.name} />
      
      {teacher.videoProfileUrl && (
        <VideoProfileDialog 
          teacherName={teacher.name}
          videoUrl={teacher.videoProfileUrl}
        />
      )}
    </div>
  );
}
