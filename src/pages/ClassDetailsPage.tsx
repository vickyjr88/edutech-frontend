
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassDetails from "@/components/classes/ClassDetails";
import CTASection from "@/components/common/CTASection";

const ClassDetailsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <ClassDetails />
        
        <CTASection 
          title="Ready to explore more classes?"
          description="Browse our extensive catalog of classes taught by Africa's top educators. Find the perfect class for your child's learning journey."
          buttonText="See All Classes"
          buttonLink="/all-classes"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClassDetailsPage;
