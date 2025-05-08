import React, { useState } from 'react';
import { BookOpen, Calendar, Check, Clock, Globe, MapPin, MessageSquare, Play, Star, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Moved inside the component function
import TeacherHighlights from './TeacherHighlights';
import TeacherReviews from './TeacherReviews';
import TeacherBookingDialog from './TeacherBookingDialog';

// Section components
import TeacherAboutSection from './public-profile/TeacherAboutSection';
import TeacherExperienceSection from './public-profile/TeacherExperienceSection';
import TeacherClassesSection from './public-profile/TeacherClassesSection';
import TeacherQualificationsSection from './public-profile/TeacherQualificationsSection';

interface TeacherPublicProfileProps {
  teacher: any;
  isOwnProfile?: boolean;
  hideBookingActions?: boolean;
  hideReviewsSection?: boolean;
}

const TeacherPublicProfile: React.FC<TeacherPublicProfileProps> = ({ 
  teacher,
  isOwnProfile = false,
  hideBookingActions = false,
  hideReviewsSection = false
}) => {
  const [activeTab, setActiveTab] = useState('about');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  
  // Helper function to format video URLs for embedding
  const formatVideoUrl = (url: string): string => {
    if (!url) return '';
    
    try {
      // Handle YouTube URLs
      if (url.includes('youtube.com/watch')) {
        // Convert youtube.com/watch?v=VIDEO_ID to youtube.com/embed/VIDEO_ID
        const videoId = new URL(url).searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Handle youtu.be short links
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Handle Vimeo URLs
      if (url.includes('vimeo.com/')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        if (videoId) return `https://player.vimeo.com/video/${videoId}`;
      }
      
      // If it's already an embed URL, return as is
      if (url.includes('/embed/') || url.includes('/player/')) {
        return url;
      }
      
      // Default fallback - return the original URL
      return url;
    } catch (error) {
      console.error('Error formatting video URL:', error);
      return '';
    }
  };

  return (
    <div className="w-full">
      {/* Cover Image Section with Video Integration */}
      <div className="relative">
        {/* Video Background (if available) */}
        {teacher.videoProfileUrl || teacher.introVideoUrl ? (
          <div className="relative w-full h-80 sm:h-96 overflow-hidden">
            {/* Video Thumbnail or Background Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ 
                backgroundColor: '#0063C9',
                backgroundImage: teacher.coverImage && teacher.coverImage !== '/placeholder.svg' 
                  ? `url(${teacher.coverImage})`
                  : 'linear-gradient(135deg, #0063C9 0%, #3484E5 100%)',
                filter: 'blur(4px)',
                transform: 'scale(1.05)'
              }}
            ></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
            
            {/* Video Preview Button */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center w-full max-w-lg">
                <div 
                  onClick={() => setShowVideoDialog(true)}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer mx-auto mb-4 hover:bg-white/30 transition-all border-2 border-white group"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center text-kidato-blue">
                    <Play className="h-8 w-8 ml-1 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-white text-lg md:text-xl font-medium mb-3 drop-shadow-md">Watch Intro Video</h3>
                <p className="text-white/90 text-sm md:text-base mx-auto drop-shadow-md px-4 leading-relaxed">
                  {teacher.isProfileResume 
                    ? "Preview how your introduction video appears to potential students on your public profile" 
                    : `Learn more about ${teacher.name.split(' ')[0]}'s teaching style, philosophy and approach to education`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Regular Cover Image (no video)
          <div 
            className="w-full h-64 bg-cover bg-center relative" 
            style={{ 
              backgroundColor: '#0063C9', // Kidato blue shade
              backgroundImage: teacher.coverImage && teacher.coverImage !== '/placeholder.svg' 
                ? `url(${teacher.coverImage})`
                : 'linear-gradient(135deg, #0063C9 0%, #3484E5 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Show "Add Intro Video" button for profile owner */}
            {teacher.isProfileResume && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white/20 hover:text-white"
                  onClick={() => alert("Upload video functionality would go here")}
                >
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Add Intro Video
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className={`flex flex-col md:flex-row ${(teacher.videoProfileUrl || teacher.introVideoUrl) ? '-mt-32 sm:-mt-36' : '-mt-24'} mb-8 relative z-10`}>
          {/* Profile Image */}
          <div className="flex-shrink-0 mr-8">
            <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white">
              {teacher.imageSrc ? (
                <img 
                  src={teacher.imageSrc} 
                  alt={teacher.name}
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.log("Image error, using fallback");
                    // @ts-ignore - target exists on the event
                    e.target.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 mt-6 md:mt-0 bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
                  {teacher.openToWork && (
                    <Badge variant="outline" className="ml-3 bg-green-50 text-green-700 border-green-200">
                      Available for new students
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{teacher.position}</p>
                <p className="text-gray-500 text-sm mt-1">{teacher.shortBio}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-3">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 font-semibold">{teacher.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">({teacher.ratingCount} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{teacher.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 border-t border-gray-100 pt-4">
              <div className="text-center">
                <p className="text-xl font-bold text-kidato-blue">{teacher.stats.studentsHelped}+</p>
                <p className="text-xs text-gray-500">Students Helped</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-kidato-blue">{teacher.stats.lessonsDelivered}+</p>
                <p className="text-xs text-gray-500">Lessons Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-kidato-blue">{teacher.stats.classesCreated}</p>
                <p className="text-xs text-gray-500">Classes Created</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-kidato-blue">{teacher.stats.successRate}%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>

            {/* Action Buttons */}
            {!hideBookingActions && (
              <div className="flex flex-wrap gap-3 mt-6">
                <Button 
                  onClick={() => setShowBookingDialog(true)}
                  className="bg-kidato-blue hover:bg-blue-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowMessageDialog(true)}
                  className="border-kidato-blue text-kidato-blue hover:bg-blue-50"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Teacher
                </Button>
                {/* Video button removed - now shown prominently in the header */}
              </div>
            )}
          </div>
        </div>

        {/* Dialogs */}
        {(teacher.videoProfileUrl || teacher.introVideoUrl) && (
          <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-gray-900 text-white border-none">
              <div className="p-6 pb-4 flex justify-between items-center border-b border-gray-800">
                <div>
                  <DialogTitle className="text-white text-xl">
                    {teacher.isProfileResume ? "Your Video Introduction" : `${teacher.name}'s Video Profile`}
                  </DialogTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    {teacher.isProfileResume ? 
                      "This is how your introduction video appears to students" : 
                      "Learn about teaching philosophy and expertise"
                    }
                  </p>
                </div>
                <button 
                  onClick={() => setShowVideoDialog(false)}
                  className="rounded-full w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={formatVideoUrl(teacher.introVideoUrl || teacher.videoProfileUrl)}
                  title={`${teacher.name}'s video profile`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              {teacher.isProfileResume && (
                <div className="p-4 bg-gray-800">
                  <Button 
                    variant="outline" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none"
                    onClick={() => {
                      setShowVideoDialog(false);
                      alert("Upload new video functionality would go here");
                    }}
                  >
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Replace Video
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
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
                  placeholder="Type your message here..."
                  className="w-full min-h-[150px]"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button>
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <TeacherBookingDialog 
          isOpen={showBookingDialog} 
          onClose={() => setShowBookingDialog(false)}
          teacher={teacher}
        />

        {/* Key Info Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Key Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-kidato-blue mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Hourly Rate</h3>
                <p className="text-gray-600">{teacher.hourlyRate}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-kidato-blue mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Availability</h3>
                <p className="text-gray-600">{teacher.availability}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Globe className="w-5 h-5 text-kidato-blue mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium">Languages</h3>
                <p className="text-gray-600">
                  {teacher.languages.slice(0, 2).map((lang: any) => lang.language).join(', ')}
                  {teacher.languages.length > 2 && ` +${teacher.languages.length - 2} more`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Highlights */}
        <div className="mb-8">
          <TeacherHighlights 
            title="Expertise & Qualifications"
            methodologies={teacher.methodologies || []}
            strategies={teacher.strategies || []} 
            certifications={teacher.certifications || []}
            teacher={teacher}
          />
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <Tabs defaultValue="about" onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="about" className="px-6 pb-6">
              <TeacherAboutSection teacher={teacher} />
            </TabsContent>

            <TabsContent value="experience" className="px-6 pb-6">
              <TeacherExperienceSection teacher={teacher} />
            </TabsContent>

            <TabsContent value="classes" className="px-6 pb-6">
              <TeacherClassesSection teacher={teacher} />
            </TabsContent>

            <TabsContent value="qualifications" className="px-6 pb-6">
              <TeacherQualificationsSection teacher={teacher} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Reviews Section */}
        {!hideReviewsSection && (
          <div className="mb-8">
            <TeacherReviews reviews={teacher.reviews} />
          </div>
        )}

        {/* CTA Section */}
        {!hideBookingActions && (
          <div className="bg-gradient-to-r from-kidato-blue/10 to-purple-500/10 rounded-xl p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to learn with {teacher.name}?</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Book a session today and take the first step towards educational success with personalized guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => setShowBookingDialog(true)}
                size="lg"
                className="bg-kidato-blue hover:bg-blue-700"
              >
                Book a Session Now
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMessageDialog(true)}
                size="lg"
                className="border-kidato-blue text-kidato-blue hover:bg-blue-50"
              >
                Ask a Question
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPublicProfile;