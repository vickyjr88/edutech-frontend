
import { Users, Star, Book, Award, Check, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface TeacherStatsProps {
  teacher: {
    id: string;
    name: string;
    experience?: Array<{
      id: string;
      dates: string;
    }>;
    classes?: Array<any>;
    certifications?: Array<any>;
    ratingCount?: number;
    rating?: number;
    methodologies?: Array<any>;
    strategies?: Array<any>;
    reviews?: Array<any>;
    technicalSkills?: Array<any>;
  };
}

const TeacherStats = ({ teacher }: TeacherStatsProps) => {
  const navigate = useNavigate();
  
  // Count active classes (for demo purposes - in a real app this would be filtered by date)
  const countActiveClasses = () => {
    if (!teacher.classes) return 0;
    // In a real app, would filter by class status or date
    // For demo, just return half the classes as "active"
    return Math.ceil(teacher.classes.length / 2); 
  };
  
  // Calculate years of experience
  const calculateExperienceYears = () => {
    if (!teacher.experience || teacher.experience.length === 0) return 0;
    
    let earliestYear = new Date().getFullYear();
    
    teacher.experience.forEach(exp => {
      const startYear = parseInt(exp.dates.split(' - ')[0]);
      if (!isNaN(startYear) && startYear < earliestYear) {
        earliestYear = startYear;
      }
    });
    
    return new Date().getFullYear() - earliestYear;
  };

  // Count positive reviews (4-5 stars)
  const countPositiveReviews = () => {
    if (!teacher.reviews) return 0;
    return teacher.reviews.filter(review => review.rating >= 4).length;
  };

  // Count verified certifications
  const countVerifiedCertifications = () => {
    if (!teacher.certifications) return 0;
    return teacher.certifications.filter(cert => cert.isVerified).length;
  };

  const countStudentsTaught = () => {
    if (!teacher.classes) return 0;
    return teacher.classes.reduce((total, classItem) => {
      return total + (classItem.enrolledStudents || 0);
    }, 0);
  };

  const getGrowthMetrics = () => {
    return {
      classesGrowth: 0,
      reviewsGrowth: 0,
      certGrowth: 0,
      studentsGrowth: 0,
    };
  };

  const activeClasses = countActiveClasses();
  const totalClasses = teacher.classes ? teacher.classes.length : 0;
  const yearsExperience = calculateExperienceYears();
  const positiveReviews = countPositiveReviews();
  const verifiedCertifications = countVerifiedCertifications();
  const studentsTaught = countStudentsTaught();
  const growthMetrics = getGrowthMetrics();

  const handleClassesClick = () => {
    // Navigate to classes tab
    const tabsElement = document.getElementById("teacher-tabs");
    if (tabsElement) {
      tabsElement.scrollIntoView({ behavior: "smooth" });
      // Set active tab to Classes (assuming it's the second tab, index 1)
      const tabButtons = tabsElement.querySelectorAll('[role="tab"]');
      if (tabButtons && tabButtons.length > 1) {
        (tabButtons[1] as HTMLButtonElement).click();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Teacher Highlights</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Live/Total Classes */}
        <div 
          className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          onClick={handleClassesClick}
        >
          <div className="mb-2 bg-blue-100 p-2 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{activeClasses}</span>
            <span className="text-lg text-gray-500 mx-1">/</span>
            <span className="text-lg text-gray-500">{totalClasses}</span>
          </div>
          <p className="text-sm text-center text-gray-600">Live/Total Classes</p>
        </div>

        {/* Students Taught */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
          <div className="mb-2 bg-pink-100 p-2 rounded-full">
            <Book className="h-6 w-6 text-pink-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{studentsTaught}</span>
          <p className="text-sm text-center text-gray-600">Students Taught</p>
        </div>

        {/* Years of Experience */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
          <div className="mb-2 bg-indigo-100 p-2 rounded-full">
            <Award className="h-6 w-6 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{yearsExperience}</span>
          <p className="text-sm text-center text-gray-600">Years Experience</p>
        </div>

        {/* Positive Reviews */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors">
          <div className="mb-2 bg-yellow-100 p-2 rounded-full">
            <Star className="h-6 w-6 text-yellow-500" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{positiveReviews}</span>
          <p className="text-sm text-center text-gray-600">Positive Reviews</p>
        </div>

        {/* Verified Certifications */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
          <div className="mb-2 bg-green-100 p-2 rounded-full">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{verifiedCertifications}</span>
          <p className="text-sm text-center text-gray-600">Verified Certs</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherStats;
