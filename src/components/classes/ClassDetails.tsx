import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ClassItemProps } from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EnrollmentForm from "./EnrollmentForm";
import TeacherClassView from "@/components/teacher/class-view/TeacherClassView";

// Mock data function - can be removed when real API integration is done
const getMockClassById = (id: string): ClassItemProps => {
  const mockClasses = [
    {
      title: "Introduction to Algebra",
      subject: "Mathematics",
      level: "Grade 7-8",
      teacher: "Ms. Amina Okafor",
      rating: 4.9,
      time: "Tuesdays & Thursdays, 4:00 PM",
      imageSrc: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      spots: "3 spots left",
      price: "$12/class"
    },
    {
      title: "Science Experiments at Home",
      subject: "Science",
      level: "Grade 5-6",
      teacher: "Mr. Daniel Mwangi",
      rating: 4.8,
      time: "Mondays & Wednesdays, 3:30 PM",
      imageSrc: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      spots: "2 spots left",
      price: "$10/class"
    },
    {
      title: "English Literature Essentials",
      subject: "English",
      level: "Grade 9-10",
      teacher: "Ms. Grace Okello",
      rating: 5.0,
      time: "Fridays, 5:00 PM",
      imageSrc: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      spots: "5 spots left",
      price: "$15/class"
    },
  ];
  
  return mockClasses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === id) || mockClasses[0];
};

const ClassDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const classItem = getMockClassById(id || "");
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Detect if user is a teacher viewing their own class
  // In a real implementation, you would check if the current user is a teacher and is the owner of this class
  const isTeacherViewingOwnClass = true; // This would be determined by auth context

  if (isTeacherViewingOwnClass) {
    return <TeacherClassView classId={id} />;
  }
  
  // Student/parent view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/all-classes" className="flex items-center text-kidato-blue mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
      </Link>
      
      {/* This is a simplified version that would show to students/parents */}
      {/* In a full implementation, you would have a separate StudentClassView component */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{classItem.title}</h1>
          <p className="text-lg text-gray-600">{classItem.subject} - {classItem.level}</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isEnrollmentOpen} onOpenChange={setIsEnrollmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                Enroll Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Enroll in {classItem.title}</DialogTitle>
              </DialogHeader>
              <EnrollmentForm
                classTitle={classItem.title}
                classPrice={classItem.price}
                onSubmitSuccess={() => setIsEnrollmentOpen(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleBookmark}
          >
            <Heart className={`h-4 w-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            {isBookmarked ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
      
      <div className="text-center p-12 border border-dashed rounded-lg">
        <p className="text-gray-600">Student view would appear here.</p>
        <p className="text-gray-500 mt-2">Currently showing the teacher view for demonstration purposes.</p>
        <Button 
          className="mt-4"
          onClick={() => navigate(`/teacher-class/${id}`)}
        >
          View Teacher Mode Separately
        </Button>
      </div>
    </div>
  );
};

export default ClassDetails;
