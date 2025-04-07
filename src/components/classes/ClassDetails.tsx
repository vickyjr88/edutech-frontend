import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Star, Users, Hash, BookOpen, FileText, Image, Video, FileBox, Heart } from "lucide-react";
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
import TeacherProfileCard from "./TeacherProfileCard";
import ClassStats from "./ClassStats";

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
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'lesson-plans' | 'cohorts' | 'teaching-team' | 'reviews'>('about');
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const classItem = getMockClassById(id || "");
  
  const teacher = {
    name: classItem.teacher,
    subject: classItem.subject,
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    experience: "8+ years teaching experience",
    rating: classItem.rating,
    bio: `With over 8 years of teaching experience, ${classItem.teacher.split(' ')[1]} is passionate about making learning engaging and accessible for all students. Their teaching approach combines traditional methods with innovative techniques to ensure student success.`,
    videoProfileUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const classStats = {
    rating: classItem.rating,
    studentsEnrolled: Math.floor(Math.random() * 200) + 80,
    completionRate: Math.floor(Math.random() * 15) + 85,
    classHours: 12,
    sessionsCount: 12
  };
  
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
          </div>
          
          <TeacherProfileCard teacher={teacher} />
          
          <ClassStats 
            rating={classStats.rating}
            studentsEnrolled={classStats.studentsEnrolled}
            completionRate={classStats.completionRate}
            classHours={classStats.classHours}
            sessionsCount={classStats.sessionsCount}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Cohort Days</h3>
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
            
            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Number of Sessions</h3>
                <p className="text-gray-600">12 sessions</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Teaching Team Size</h3>
                <p className="text-gray-600">2 instructors</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Reviews</h3>
                <p className="text-gray-600">3 reviews</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="mb-8 border-b overflow-x-auto">
              <div className="flex min-w-max">
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'about' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <BookOpen className="h-4 w-4" />
                  About
                </button>
                <button 
                  onClick={() => setActiveTab('lesson-plans')}
                  className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'lesson-plans' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText className="h-4 w-4" />
                  Lesson Plans
                </button>
                <button 
                  onClick={() => setActiveTab('cohorts')}
                  className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'cohorts' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Users className="h-4 w-4" />
                  Cohorts
                </button>
                <button 
                  onClick={() => setActiveTab('teaching-team')}
                  className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'teaching-team' ? 'text-kidato-blue border-b-2 border-kidato-blue' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText className="h-4 w-4" />
                  Teaching Team
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
              {activeTab === 'about' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Class</h3>
                    <p className="text-gray-700 mb-4">
                      This engaging and interactive class is designed to help students master key concepts through hands-on activities and personalized instruction. Our experienced teachers ensure that each student receives the support they need to succeed.
                    </p>
                    <p className="text-gray-700">
                      Students will develop critical thinking skills, gain confidence in the subject matter, and learn strategies that can be applied to future academic challenges. The curriculum is aligned with international standards while being adaptable to individual learning needs.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Fundamental concepts and principles in {classItem.subject}</li>
                      <li>Problem-solving techniques and critical thinking skills</li>
                      <li>Application of knowledge to real-world scenarios</li>
                      <li>Effective study methods and organization skills</li>
                      <li>Confidence in academic performance and subject mastery</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Class Requirements</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Basic understanding of {classItem.subject} fundamentals</li>
                      <li>Access to a computer or tablet with internet connection</li>
                      <li>Ability to attend scheduled sessions regularly</li>
                      <li>Willingness to participate in class activities and discussions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Materials Needed</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Notebook and writing utensils</li>
                      <li>Basic calculator (for mathematics classes)</li>
                      <li>Textbook or digital resources (provided by instructor)</li>
                      <li>Headphones for clear audio during virtual sessions</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Commitment Required</h3>
                    <p className="text-gray-700 mb-2">
                      Students are expected to:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Attend two 45-minute classes per week</li>
                      <li>Complete approximately 1-2 hours of homework weekly</li>
                      <li>Participate in occasional group projects or presentations</li>
                      <li>Review material before exams (2-3 times per term)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Teaching Methodologies</h3>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li><span className="font-medium">Interactive Learning:</span> Engaging activities to promote active participation</li>
                      <li><span className="font-medium">Visual Aids:</span> Using diagrams, videos, and models to reinforce concepts</li>
                      <li><span className="font-medium">Guided Practice:</span> Step-by-step instruction with immediate feedback</li>
                      <li><span className="font-medium">Group Collaboration:</span> Peer learning through thoughtful discussion and teamwork</li>
                      <li><span className="font-medium">Individualized Feedback:</span> Personalized guidance to address specific learning needs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                    <p className="text-gray-700 mb-4">
                      Student progress is monitored through:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Weekly formative assessments to gauge understanding</li>
                      <li>Monthly progress reports shared with parents/guardians</li>
                      <li>Digital portfolio of student work and achievements</li>
                      <li>End-of-term comprehensive evaluation</li>
                      <li>One-on-one feedback sessions with the instructor</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'lesson-plans' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Lesson Plans</h3>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Week 1: Introduction to {classItem.subject}</h4>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Lesson 1: Core concepts and terminology</li>
                        <li>Lesson 2: Historical context and development</li>
                        <li>Activities: Group discussion and introductory exercises</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Week 2: Foundational Skills</h4>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Lesson 1: Building blocks and essential techniques</li>
                        <li>Lesson 2: Practical applications and examples</li>
                        <li>Activities: Hands-on exercises and problem-solving tasks</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Week 3: Advanced Concepts</h4>
                      <ul className="list-disc pl-5 text-gray-700 space-y-1">
                        <li>Lesson 1: Complex theories and their implications</li>
                        <li>Lesson 2: Real-world case studies and analysis</li>
                        <li>Activities: Research projects and collaborative work</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 italic">
                    Note: Detailed lesson plans are provided to enrolled students and may be adjusted based on class progress and needs.
                  </p>
                </div>
              )}
              
              {activeTab === 'cohorts' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Cohorts</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Morning Cohort</h4>
                        <p className="text-gray-700">Tuesdays & Thursdays, 10:00 AM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Start Date</h4>
                        <p className="text-gray-700">September 15, 2023</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Availability</h4>
                        <p className="text-orange-600 font-medium">3 spots left</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Afternoon Cohort</h4>
                        <p className="text-gray-700">Mondays & Wednesdays, 2:00 PM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Start Date</h4>
                        <p className="text-gray-700">September 20, 2023</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Availability</h4>
                        <p className="text-orange-600 font-medium">5 spots left</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Weekend Cohort</h4>
                        <p className="text-gray-700">Saturdays, 11:00 AM</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Start Date</h4>
                        <p className="text-gray-700">October 7, 2023</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Availability</h4>
                        <p className="text-green-600 font-medium">8 spots left</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'teaching-team' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Teaching Team</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                          alt={teacher.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{teacher.name}</h4>
                        <p className="text-gray-700 text-sm">Lead Instructor</p>
                        <p className="text-gray-600 text-sm mt-1">Specializes in {classItem.subject} with {teacher.experience}</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4 flex gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                          alt="Teaching Assistant" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">John Kamau</h4>
                        <p className="text-gray-700 text-sm">Teaching Assistant</p>
                        <p className="text-gray-600 text-sm mt-1">4+ years of tutoring experience in {classItem.subject}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Reviews & Ratings</h3>
                    <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{classItem.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                              alt="Reviewer" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Sarah Ahmed</p>
                            <p className="text-sm text-gray-500">March 15, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">5.0</span>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        My daughter has been taking this class for a month now and I've seen remarkable improvement in her understanding. The teacher is patient, knowledgeable, and makes learning fun!
                      </p>
                    </div>
                    
                    <div className="border-b border-gray-100 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                              alt="Reviewer" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Michael Omondi</p>
                            <p className="text-sm text-gray-500">February 28, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        The class is well-structured and the material is presented in an easy-to-understand way. My son looks forward to each session and has shown great progress in his skills.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" 
                              alt="Reviewer" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">David Njoroge</p>
                            <p className="text-sm text-gray-500">January 15, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">5.0</span>
                        </div>
                      </div>
                      <p className="text-gray-700">
                        Excellent teaching methods! The instructor is clearly passionate about the subject and communicates complex ideas in an accessible way. Highly recommended for any student looking to excel.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleBookmark}
            >
              <Heart className={`h-4 w-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
              {isBookmarked ? "Bookmarked" : "Bookmark this Class"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
