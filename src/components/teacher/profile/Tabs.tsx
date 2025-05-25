
import { useState } from "react";
import AboutTab from "./tabs/AboutTab";
import ClassesTab from "./tabs/ClassesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import TeacherHighlights from "./TeacherHighlights";
import { BookOpen, FileText, Star, Image, Video, FileBox } from "lucide-react";
import PhotosTab from "./tabs/PhotosTab";
import VideosTab from "./tabs/VideosTab";
import ResourcesTab from "./tabs/ResourcesTab";

interface TabsProps {
  teacher: any; // Using any here as this is a wrapper component that passes data down
}

export default function Tabs({ teacher }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'classes' | 'about' | 'reviews' | 'photos' | 'videos' | 'resources'>('classes');

  return (
    <>
      {/* Teacher Highlights Section */}
      <div className="mb-8">
        <TeacherHighlights teacher={teacher} />
      </div>
      
      <div className="mb-8 border-b overflow-x-auto">
        <div className="flex min-w-max">
          <button 
            onClick={() => setActiveTab('classes')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'classes' ? 'text-kidato-purple border-b-2 border-kidato-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BookOpen className="h-4 w-4" />
            Classes
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'about' ? 'text-kidato-purple border-b-2 border-kidato-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText className="h-4 w-4" />
            About me
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'reviews' ? 'text-kidato-purple border-b-2 border-kidato-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Star className="h-4 w-4" />
            Reviews
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'photos' ? 'text-kidato-purple border-b-2 border-kidato-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Image className="h-4 w-4" />
            Photos
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'videos' ? 'text-kidato-purple border-b-2 border-kidato-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Video className="h-4 w-4" />
            Videos
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'resources' ? 'text-kidato-purple border-b-2 border-kidato-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileBox className="h-4 w-4" />
            Resources
          </button>
        </div>
      </div>
      
      <div className="w-full">
        {activeTab === 'classes' && <ClassesTab teacher={teacher} />}
        {activeTab === 'about' && <AboutTab teacher={teacher} />}
        {activeTab === 'reviews' && <ReviewsTab teacher={teacher} />}
        {activeTab === 'photos' && <PhotosTab teacher={teacher} />}
        {activeTab === 'videos' && <VideosTab teacher={teacher} />}
        {activeTab === 'resources' && <ResourcesTab teacher={teacher} />}
      </div>
    </>
  );
}
