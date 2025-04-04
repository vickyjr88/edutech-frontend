
import { Users, Star, Book, Award, Globe, Check } from "lucide-react";

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
    languages?: Array<any>;
    reviews?: Array<any>;
    technicalSkills?: Array<any>;
  };
}

const TeacherStats = ({ teacher }: TeacherStatsProps) => {
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

  // Total number of teaching methods (methodologies + strategies)
  const countTeachingMethods = () => {
    const methodCount = teacher.methodologies ? teacher.methodologies.length : 0;
    const strategyCount = teacher.strategies ? teacher.strategies.length : 0;
    return methodCount + strategyCount;
  };

  // Count languages
  const countLanguages = () => {
    return teacher.languages ? teacher.languages.length : 0;
  };

  const yearsExperience = calculateExperienceYears();
  const positiveReviews = countPositiveReviews();
  const verifiedCertifications = countVerifiedCertifications();
  const teachingMethods = countTeachingMethods();
  const languagesCount = countLanguages();
  const classesCount = teacher.classes ? teacher.classes.length : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Teacher Highlights</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Years of Experience */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="mb-2 bg-blue-100 p-2 rounded-full">
            <Award className="h-6 w-6 text-kidato-blue" />
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

        {/* Teaching Methods */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
          <div className="mb-2 bg-purple-100 p-2 rounded-full">
            <Book className="h-6 w-6 text-purple-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{teachingMethods}</span>
          <p className="text-sm text-center text-gray-600">Teaching Methods</p>
        </div>

        {/* Languages */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
          <div className="mb-2 bg-indigo-100 p-2 rounded-full">
            <Globe className="h-6 w-6 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{languagesCount}</span>
          <p className="text-sm text-center text-gray-600">Languages</p>
        </div>

        {/* Classes Offered */}
        <div className="flex flex-col items-center p-4 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors">
          <div className="mb-2 bg-pink-100 p-2 rounded-full">
            <Users className="h-6 w-6 text-pink-600" />
          </div>
          <span className="text-2xl font-bold text-gray-900">{classesCount}</span>
          <p className="text-sm text-center text-gray-600">Classes Offered</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherStats;
