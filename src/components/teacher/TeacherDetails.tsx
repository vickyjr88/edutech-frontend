
import { Book, Award, Users, Star, MessageSquare, Video, Globe, Briefcase, GraduationCap, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StrategyItem } from "../teacher/professional-profile";
import { MethodologyItem } from "../teacher/professional-profile";
import { LanguageItem } from "../teacher/professional-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ALL_LANGUAGES } from "../teacher/professional-profile/utils/languageUtils";
import { TEACHING_METHODOLOGIES } from "../teacher/professional-profile/utils/methodologyUtils";
import { TEACHING_STRATEGIES } from "../teacher/professional-profile/utils/strategyUtils";
import { Badge } from "@/components/ui/badge";

// Using Award icon as a replacement for Certificate, but renamed for clarity
const CertificateIcon = Award;

interface TeacherDetailsProps {
  teacher: {
    id: string;
    name: string;
    imageSrc: string;
    bio: string;
    position: string; // e.g., "Senior Math Teacher"
    school?: string; // Added school property
    schoolStatus?: "active" | "past"; // Added school status property
    rating: number;
    ratingCount: number;
    videoProfileUrl?: string;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      dates: string;
    }>;
    experience: Array<{
      id: string;
      position: string;
      institution: string;
      dates: string;
      description?: string;
    }>;
    methodologies: MethodologyItem[];
    strategies: StrategyItem[];
    languages: LanguageItem[];
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
      isVerified: boolean;
    }>;
    classes: Array<{
      id: string;
      title: string;
      subject: string;
      level: string;
      rating?: number;
      imageSrc?: string;
    }>;
    reviews?: Array<{
      id: string;
      reviewer: string;
      reviewerImage?: string;
      rating: number;
      comment: string;
      date: string;
    }>;
    technicalSkills?: Array<{
      id: string;
      skill: string;
      description?: string;
      level?: string;
    }>;
  }
}

export default function TeacherDetails({ teacher }: TeacherDetailsProps) {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState<'about' | 'classes' | 'reviews'>('about');

  const handleSendMessage = () => {
    // In a real app, this would send the message to the backend
    console.log("Message sent:", messageText);
    setMessageText("");
    setIsMessageDialogOpen(false);
  };

  // Helper function to render check icons consistently
  const renderCheckIcon = () => (
    <span className="bg-kidato-blue/10 text-kidato-blue p-1.5 rounded-full flex items-center justify-center">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
        <div className="bg-kidato-blue/10 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative">
              <img 
                src={teacher.imageSrc} 
                alt={teacher.name} 
                className="w-full h-full object-cover"
              />
              {/* Verification badge */}
              <div className="absolute bottom-0 right-0 bg-kidato-blue text-white p-1 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
                <p className="text-lg text-kidato-blue font-medium">{teacher.position}</p>
                {teacher.school && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <span>{teacher.school}</span>
                    {teacher.schoolStatus && (
                      <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                        teacher.schoolStatus === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {teacher.schoolStatus === 'active' ? 'Current' : 'Past'}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{teacher.rating}</span>
                  <span className="text-gray-500 text-sm">({teacher.ratingCount} reviews)</span>
                </div>
                
                {teacher.languages.length > 0 && (
                  <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{teacher.languages.length} languages</span>
                  </div>
                )}
                
                {teacher.certifications.length > 0 && (
                  <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-full">
                    <CertificateIcon className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{teacher.certifications.filter(c => c.isVerified).length} verified certificates</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-6">{teacher.bio}</p>
              
              {/* Teaching methodologies and strategies */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {teacher.methodologies.map(methodology => (
                    <Badge 
                      key={methodology.id} 
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {methodology.methodology}
                    </Badge>
                  ))}
                  {teacher.strategies.map(strategy => (
                    <Badge 
                      key={strategy.id} 
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      {strategy.strategy}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Message/Contact Teacher Button - Made sticky on mobile for easier access */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start sticky md:static bottom-4 left-0 right-0 z-10 md:z-0 p-2 md:p-0 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
                <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-kidato-blue hover:bg-kidato-dark-blue">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Teacher
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Send Message to {teacher.name}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">
                          Subject
                        </label>
                        <Input 
                          id="subject" 
                          placeholder="Enter message subject"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full min-h-[150px]"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {teacher.videoProfileUrl && (
                  <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
                        <Video className="mr-2 h-4 w-4" />
                        Watch Video Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                      <DialogHeader className="p-6 pb-0">
                        <DialogTitle>{teacher.name}'s Video Profile</DialogTitle>
                      </DialogHeader>
                      <div className="aspect-video w-full">
                        <iframe
                          src={teacher.videoProfileUrl}
                          title={`${teacher.name}'s video profile`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
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
      
      {/* About Tab Content */}
      {activeTab === 'about' && (
        <>
          {/* Enhanced Bio Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Biography</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {teacher.methodologies.slice(0, 3).map(methodology => (
                  <span key={methodology.id} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {methodology.methodology}
                  </span>
                ))}
                {teacher.strategies.slice(0, 3).map(strategy => (
                  <span key={strategy.id} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                    {strategy.strategy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Layout for Teacher Details - Now with 2 cards per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Education Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-kidato-blue" />
                  <CardTitle className="text-xl">Educational Qualifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {teacher.education.length > 0 ? (
                  <ul className="space-y-5">
                    {teacher.education.map((edu) => (
                      <li key={edu.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">{renderCheckIcon()}</div>
                        <div className="ml-4">
                          <span className="font-medium text-gray-900">{edu.degree}</span>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <p className="text-xs text-gray-500">{edu.dates}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No educational information available</p>
                )}
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-kidato-blue" />
                  <CardTitle className="text-xl">Teaching Experience</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {teacher.experience.length > 0 ? (
                  <ul className="space-y-5">
                    {teacher.experience.map((exp) => (
                      <li key={exp.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">{renderCheckIcon()}</div>
                        <div className="ml-4">
                          <span className="font-medium text-gray-900">{exp.position}</span>
                          <p className="text-sm text-gray-600">{exp.institution}</p>
                          <p className="text-xs text-gray-500">{exp.dates}</p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No experience information available</p>
                )}
              </CardContent>
            </Card>

            {/* Certifications Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CertificateIcon className="h-5 w-5 text-kidato-blue" />
                  <CardTitle className="text-xl">Certifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {teacher.certifications.length > 0 ? (
                  <ul className="space-y-5">
                    {teacher.certifications.map((cert) => (
                      <li key={cert.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">{renderCheckIcon()}</div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{cert.name}</span>
                            {cert.isVerified && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No certifications available</p>
                )}
              </CardContent>
            </Card>

            {/* Methodologies */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-kidato-blue" />
                  <CardTitle className="text-xl">Teaching Methodologies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {teacher.methodologies.length > 0 ? (
                  <ul className="space-y-5">
                    {teacher.methodologies.map((item) => (
                      <li key={item.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">{renderCheckIcon()}</div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{item.methodology}</span>
                            {item.is_certified && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                Certified
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No methodologies available</p>
                )}
              </CardContent>
            </Card>

            {/* Strategies */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-kidato-blue" />
                  <CardTitle className="text-xl">Teaching Strategies</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {teacher.strategies.length > 0 ? (
                  <ul className="space-y-5">
                    {teacher.strategies.map((item) => (
                      <li key={item.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">{renderCheckIcon()}</div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{item.strategy}</span>
                            {item.is_certified && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                Certified
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No strategies available</p>
                )}
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-kidato-blue" />
                  <CardTitle className="text-xl">Languages</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {teacher.languages.length > 0 ? (
                  <ul className="space-y-5">
                    {teacher.languages.map((item) => (
                      <li key={item.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">
                          <span className="bg-kidato-blue/10 text-kidato-blue p-1.5 rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{item.language}</span>
                            {item.isCertified && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                Certified
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No languages available</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Technical Skills Section */}
          {teacher.technicalSkills && teacher.technicalSkills.length > 0 && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Skills</h2>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-5 w-5 text-kidato-blue" />
                    <CardTitle className="text-xl">Digital & Technical Proficiency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {teacher.technicalSkills.map((skill) => (
                      <li key={skill.id} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <div className="mt-1">{renderCheckIcon()}</div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-900">{skill.skill}</span>
                            {skill.level && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                skill.level === 'Advanced' ? 'bg-green-50 text-green-700' : 
                                skill.level === 'Intermediate' ? 'bg-blue-50 text-blue-700' :
                                'bg-yellow-50 text-yellow-700'
                              }`}>
                                {skill.level}
                              </span>
                            )}
                          </div>
                          {skill.description && (
                            <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Classes Tab Content */}
      {activeTab === 'classes' && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Classes by {teacher.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacher.classes.length > 0 ? (
              teacher.classes.map((cls) => (
                <Card key={cls.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 w-full overflow-hidden">
                    <img 
                      src={cls.imageSrc || 'https://via.placeholder.com/400x250?text=Class+Image'} 
                      alt={cls.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1">{cls.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{cls.subject} · {cls.level}</p>
                    
                    {cls.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{cls.rating}</span>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full mt-4 border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
                      View Class
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No classes available at the moment.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reviews Tab Content */}
      {activeTab === 'reviews' && (
        <>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews ({teacher.ratingCount})</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                <span className="text-3xl font-bold ml-2">{teacher.rating}</span>
              </div>
              <div>
                <p className="text-gray-500">{teacher.ratingCount} reviews</p>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(teacher.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {teacher.reviews && teacher.reviews.length > 0 ? (
              teacher.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start">
                    <img 
                      src={review.reviewerImage || 'https://via.placeholder.com/40?text=User'} 
                      alt={review.reviewer}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{review.reviewer}</h4>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No reviews available yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
