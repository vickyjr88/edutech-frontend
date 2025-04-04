
import { useState } from "react";
import AboutTab from "./tabs/AboutTab";
import ClassesTab from "./tabs/ClassesTab";
import ReviewsTab from "./tabs/ReviewsTab";

interface TabsProps {
  teacher: any; // Using any here as this is a wrapper component that passes data down
}

export default function Tabs({ teacher }: TabsProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'classes' | 'reviews'>('about');

  return (
    <>
      <div className="mb-8 border-b">
        <div className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'about' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            About
          </button>
          <button 
            onClick={() => setActiveTab('classes')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'classes' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Classes
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'reviews' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reviews
          </button>
        </div>
      </div>
      
      {activeTab === 'about' && <AboutTab teacher={teacher} />}
      {activeTab === 'classes' && <ClassesTab teacher={teacher} />}
      {activeTab === 'reviews' && <ReviewsTab teacher={teacher} />}
    </>
  );
}
