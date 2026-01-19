
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassDetails from "@/components/classes/ClassDetails";
import CTASection from "@/components/common/CTASection";
import { useParams } from "react-router-dom";

const ClassDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  // Check if this is a teacher viewing their own class (would come from auth context)
  // Logic is handled within ClassDetails component now
  const isTeacherViewingOwnClass = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className={`flex-grow ${isTeacherViewingOwnClass ? '' : 'pt-20'}`}>
        <ClassDetails />

        {/* Only show CTA section for student/parent views */}
        {!isTeacherViewingOwnClass && (
          <CTASection
            title="Ready to explore more classes?"
            description="Browse our extensive catalog of classes taught by Africa's top educators. Find the perfect class for your child's learning journey."
            buttonText="See All Classes"
            buttonLink="/all-classes"
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ClassDetailsPage;
