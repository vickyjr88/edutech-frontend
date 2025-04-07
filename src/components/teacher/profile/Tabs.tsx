
import { useState } from "react";
import AboutTab from "./tabs/AboutTab";
import ClassesTab from "./tabs/ClassesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import TeacherHighlights from "./TeacherHighlights";
import { BookOpen, FileText, Star } from "lucide-react";

interface TabsProps {
  teacher: any; // Using any here as this is a wrapper component that passes data down
}

export default function Tabs({ teacher }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'classes' | 'about' | 'reviews'>('classes');

  return (
    <>
      {/* Teacher Highlights Section */}
      <div className="mb-8">
        <TeacherHighlights teacher={teacher} />
      </div>
      
      <div className="mb-8 border-b">
        <div className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('classes')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'classes' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BookOpen className="h-4 w-4" />
            Classes
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'about' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText className="h-4 w-4" />
            About me
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Star className="h-4 w-4" />
            Reviews
          </button>
        </div>
      </div>
      
      <div className="w-full">
        {activeTab === 'classes' && <ClassesTab teacher={teacher} />}
        {activeTab === 'about' && <AboutTab teacher={teacher} />}
        {activeTab === 'reviews' && <ReviewsTab teacher={teacher} />}
      </div>
    </>
  );
}
