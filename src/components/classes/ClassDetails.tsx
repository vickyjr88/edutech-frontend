
import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Star, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ClassItemProps } from "@/components/common/ClassCard";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EnrollmentForm from "./EnrollmentForm";

// This would typically come from an API
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
  
  // For demo purposes, we're using the first class if ID doesn't match
  return mockClasses.find(c => c.title.toLowerCase().replace(/\s+/g, '-') === id) || mockClasses[0];
};

const ClassDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  
  const classItem = getMockClassById(id || "");
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/all-classes" className="flex items-center text-kidato-blue mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Classes
      </Link>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-lg border border-gray-100 mb-6">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={classItem.imageSrc} 
                alt={classItem.title} 
                className="w-full h-full object-cover" 
              />
            </AspectRatio>
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-sm text-kidato-blue font-medium">{classItem.subject}</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{classItem.title}</h1>
              <p className="text-lg text-gray-600 mb-2">{classItem.level}</p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{classItem.rating}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Schedule</h3>
                <p className="text-gray-600">{classItem.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Duration</h3>
                <p className="text-gray-600">45 minutes per session</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Class Size</h3>
                <p className="text-gray-600">{classItem.spots}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Class</h2>
            <p className="text-gray-700 mb-4">
              This engaging and interactive class is designed to help students master key concepts through hands-on activities and personalized instruction. Our experienced teachers ensure that each student receives the support they need to succeed.
            </p>
            <p className="text-gray-700">
              Students will develop critical thinking skills, gain confidence in the subject matter, and learn strategies that can be applied to future academic challenges. The curriculum is aligned with international standards while being adaptable to individual learning needs.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What You'll Learn</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Fundamental concepts and principles in {classItem.subject}</li>
              <li>Problem-solving techniques and critical thinking skills</li>
              <li>Application of knowledge to real-world scenarios</li>
              <li>Effective study methods and organization skills</li>
              <li>Confidence in academic performance and subject mastery</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Meet Your Teacher</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt={classItem.teacher} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{classItem.teacher}</h3>
                <p className="text-gray-600 mb-2">Expert in {classItem.subject} Education</p>
                <p className="text-gray-700">
                  With over 8 years of teaching experience, {classItem.teacher.split(' ')[1]} is passionate about making learning engaging and accessible for all students. Their teaching approach combines traditional methods with innovative techniques to ensure student success.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Class Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Price</span>
                <span className="text-lg font-medium text-gray-900">{classItem.price}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Subject</span>
                <span className="font-medium text-gray-900">{classItem.subject}</span>
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Grade Level</span>
                <span className="font-medium text-gray-900">{classItem.level}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Availability</span>
                <span className="font-medium text-orange-600">{classItem.spots}</span>
              </div>
            </div>
            
            <Dialog open={isEnrollmentOpen} onOpenChange={setIsEnrollmentOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue mb-3">
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
            
            <Button variant="outline" className="w-full">
              Request More Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
