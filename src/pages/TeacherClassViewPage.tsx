import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";
import { useParams } from "react-router-dom";

const TeacherClassViewPage = () => {
  const { classId } = useParams<{ classId: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 pt-20">
        <TeacherClassView classId={classId} />
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherClassViewPage;