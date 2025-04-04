
import { Book, Award, Users, Star, MessageSquare, Video, Award as CertificateIcon, Globe, Briefcase, GraduationCap } from "lucide-react";
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

interface TeacherDetailsProps {
  teacher: {
    id: string;
    name: string;
    imageSrc: string;
    bio: string;
    position: string; // e.g., "Senior Math Teacher"
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
  }
}

export default function TeacherDetails({ teacher }: TeacherDetailsProps) {
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    // In a real app, this would send the message to the backend
    console.log("Message sent:", messageText);
    setMessageText("");
    setIsMessageDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
        <div className="bg-kidato-blue/10 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              <img 
                src={teacher.imageSrc} 
                alt={teacher.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{teacher.name}</h1>
              <p className="text-lg text-kidato-blue font-medium mb-3">{teacher.position}</p>
              
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
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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
      
      {/* Grid Layout for Teacher Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Education Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-kidato-blue" />
              <CardTitle className="text-xl">Educational Qualifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {teacher.education.map((edu) => (
              <div key={edu.id} className="mb-5 last:mb-0">
                <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                <p className="text-gray-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.dates}</p>
              </div>
            ))}
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
            {teacher.experience.map((exp) => (
              <div key={exp.id} className="mb-5 last:mb-0">
                <h4 className="font-medium text-gray-900">{exp.position}</h4>
                <p className="text-gray-600">{exp.institution}</p>
                <p className="text-sm text-gray-500">{exp.dates}</p>
                {exp.description && (
                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                )}
              </div>
            ))}
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
            {teacher.certifications.map((cert) => (
              <div key={cert.id} className="mb-5 last:mb-0">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900">{cert.name}</h4>
                  {cert.isVerified && (
                    <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{cert.date}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Additional Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Methodologies */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-kidato-blue" />
              <CardTitle className="text-xl">Teaching Methodologies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {teacher.methodologies.map((item) => (
                <li key={item.id} className="flex items-start">
                  <span className="bg-kidato-blue/10 text-kidato-blue p-1 rounded mr-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium text-gray-900">{item.methodology}</span>
                    {item.is_certified && (
                      <span className="ml-2 inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        Certified
                      </span>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
            <ul className="space-y-3">
              {teacher.strategies.map((item) => (
                <li key={item.id} className="flex items-start">
                  <span className="bg-kidato-blue/10 text-kidato-blue p-1 rounded mr-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <span className="font-medium text-gray-900">{item.strategy}</span>
                    {item.is_certified && (
                      <span className="ml-2 inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        Certified
                      </span>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
            <ul className="space-y-3">
              {teacher.languages.map((item) => (
                <li key={item.id} className="flex items-start">
                  <span className="bg-kidato-blue/10 text-kidato-blue p-1 rounded mr-3">
                    <Globe className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-medium text-gray-900">{item.language}</span>
                    {item.isCertified && (
                      <span className="ml-2 inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        Certified
                      </span>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Teacher's Classes */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Classes by {teacher.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacher.classes.map((cls) => (
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
        ))}
      </div>
    </div>
  );
}
