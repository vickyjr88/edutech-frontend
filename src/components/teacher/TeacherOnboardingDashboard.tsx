import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Video, 
  Calendar, 
  Globe, 
  Zap,
  Star,
  TrendingUp,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeacherOnboardingDashboardProps {
  hasProfile: boolean;
  hasClasses: boolean;
  zoomConnected: boolean;
  calendarConnected: boolean;
  driveConnected: boolean;
  onCreateClass: () => void;
  onViewProfile: () => void;
  onConnectZoom: () => void;
  onConnectCalendar: () => void;
  onConnectDrive: () => void;
}

const TeacherOnboardingDashboard: React.FC<TeacherOnboardingDashboardProps> = ({
  hasProfile,
  hasClasses,
  zoomConnected,
  calendarConnected,
  driveConnected,
  onCreateClass,
  onViewProfile,
  onConnectZoom,
  onConnectCalendar,
  onConnectDrive
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  // Progress calculation
  const completedSteps = [
    hasProfile,
    hasClasses,
    zoomConnected && calendarConnected && driveConnected,
    false // Go live step
  ].filter(Boolean).length;

  const progressPercentage = (completedSteps / 4) * 100;

  // Trigger confetti on page load
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const currentStep = hasProfile 
    ? hasClasses 
      ? (zoomConnected && calendarConnected && driveConnected) 
        ? 4 
        : 3
      : 2
    : 1;

  const integrationCount = [zoomConnected, calendarConnected, driveConnected].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                i % 3 === 0 ? 'bg-orange-400' : i % 3 === 1 ? 'bg-blue-500' : 'bg-purple-400'
              }`} />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-400 to-blue-600 rounded-2xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 mr-3 animate-pulse" />
              <h1 className="text-4xl font-bold">Welcome to Your Teaching Journey! 🎉</h1>
            </div>
            <p className="text-xl mb-8 opacity-95">
              Let's set you up for success in just a few steps
            </p>
            <Button 
              onClick={() => {
                if (!hasProfile) {
                  navigate('/teacher/profile-journey');
                } else if (!hasClasses) {
                  onCreateClass();
                } else {
                  // Scroll to next action
                  document.getElementById('action-cards')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {!hasProfile ? 'Start Your Setup Journey' : !hasClasses ? 'Create Your First Class' : 'Continue Setup'}
            </Button>
          </div>
        </div>

        {/* Progress Tracker */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-blue-600 text-lg">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Create your profile' :
                currentStep === 2 ? 'Create your first amazing class' :
                currentStep === 3 ? 'Connect & Share' :
                'Go Live!'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-3 bg-gray-200 rounded-full mb-6">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              {[
                { step: 1, label: 'Create Profile', completed: hasProfile },
                { step: 2, label: 'Build First Class', completed: hasClasses },
                { step: 3, label: 'Connect & Share', completed: zoomConnected && calendarConnected && driveConnected },
                { step: 4, label: 'Go Live!', completed: false }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold mb-2 transition-all duration-300 ${
                    item.completed 
                      ? 'bg-orange-400 text-white' 
                      : currentStep === item.step
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-300 text-gray-600'
                  }`}>
                    {item.completed ? <CheckCircle2 className="h-5 w-5" /> : item.step}
                  </div>
                  <span className={`text-xs text-center max-w-20 ${
                    currentStep === item.step ? 'text-blue-600 font-semibold' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Standards Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <Star className="h-6 w-6 text-orange-400" />
          <p className="text-blue-600 font-medium">
            Great teachers on Kidato have complete profiles and engaging class descriptions
          </p>
        </div>

        {/* Success Indicators */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-orange-400">
          <CardHeader>
            <CardTitle className="text-blue-600 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Teachers Like You Succeed Fast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-blue-600 font-medium">Average first student in 3 days</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-blue-600 font-medium">85% get 5+ enrollments in first week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards Grid */}
        <div id="action-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
            hasProfile 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200' 
              : 'bg-white hover:bg-blue-50 border-2 border-blue-200 animate-pulse'
          }`}>
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                hasProfile 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              }`}>
                {hasProfile ? <CheckCircle2 className="h-8 w-8" /> : <UserPlus className="h-8 w-8" />}
              </div>
              <CardTitle className="text-lg">
                {hasProfile ? 'Profile Complete!' : 'Create Your Profile'}
              </CardTitle>
              <CardDescription>
                {hasProfile 
                  ? 'Your teaching identity looks amazing' 
                  : 'Set up your professional teaching profile'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {hasProfile && (
                <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
                  ✓ Completed
                </Badge>
              )}
              <p className="text-sm text-gray-600 mb-4">
                {hasProfile ? '' : '5 minutes to complete'}
              </p>
              <Button 
                onClick={hasProfile ? onViewProfile : () => navigate('/teacher/profile-journey')}
                className={hasProfile ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-500 hover:bg-blue-600 text-white'}
                size="sm"
              >
                {hasProfile ? 'View Profile' : 'Create Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Create Class Card */}
          <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
            hasClasses 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
              : !hasProfile 
                ? 'bg-gray-50 border-2 border-gray-200'
                : 'bg-white hover:bg-orange-50 border-2 border-orange-300 ring-2 ring-orange-200 ring-opacity-50 animate-pulse'
          }`}>
            <CardHeader className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                hasClasses 
                  ? 'bg-green-100 text-green-600'
                  : !hasProfile
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-gradient-to-br from-orange-400 to-orange-500 text-white'
              }`}>
                {hasClasses ? <CheckCircle2 className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
              </div>
              <CardTitle className="text-lg">
                {hasClasses ? 'Class Created!' : 'Launch Your First Class'}
              </CardTitle>
              <CardDescription>
                {hasClasses 
                  ? 'Your first class is ready to go'
                  : 'Use our templates to create an amazing class'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {hasClasses && (
                <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200">
                  ✓ Completed
                </Badge>
              )}
              <p className="text-sm text-gray-600 mb-4">
                {hasClasses ? '' : !hasProfile ? 'Complete profile first' : '5 minutes to complete'}
              </p>
              <Button 
                onClick={hasClasses ? () => navigate('/teacher/dashboard') : onCreateClass}
                disabled={!hasProfile && !hasClasses}
                className={
                  hasClasses 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : !hasProfile 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                }
                size="sm"
              >
                {hasClasses ? 'View Classes' : 'Create Class'}
              </Button>
            </CardContent>
          </Card>

          {/* Network Building Card */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white hover:bg-purple-50 border-2 border-purple-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <Globe className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">Build Your Network</CardTitle>
              <CardDescription>
                Invite students and colleagues for reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">Optional but recommended</p>
              <Button 
                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                size="sm"
                onClick={() => {
                  // Handle invite others
                  console.log('Invite others functionality');
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Invite Others
              </Button>
            </CardContent>
          </Card>

          {/* Practice Mode Card */}
          <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Video className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">Practice Your Teaching</CardTitle>
              <CardDescription>
                Test your setup with our virtual classroom simulator
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {/* Integration Status */}
              <div className="flex justify-center gap-2 mb-4">
                {[
                  { name: 'Zoom', connected: zoomConnected, onClick: onConnectZoom, color: 'bg-blue-500' },
                  { name: 'Calendar', connected: calendarConnected, onClick: onConnectCalendar, color: 'bg-green-500' },
                  { name: 'Drive', connected: driveConnected, onClick: onConnectDrive, color: 'bg-yellow-500' }
                ].map((integration, index) => (
                  <div key={index} className="relative">
                    <div 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-110 ${integration.color}`}
                      onClick={integration.onClick}
                      title={`${integration.connected ? 'Connected' : 'Click to connect'} ${integration.name}`}
                    >
                      {integration.name[0]}
                    </div>
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      integration.connected ? 'bg-green-400' : 'bg-gray-300 cursor-pointer hover:bg-gray-400'
                    }`} />
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {integrationCount === 3 ? 'Ready to practice! ✨' : 'Connect your tools first'}
              </p>
              
              <Button 
                disabled={integrationCount < 3}
                className={integrationCount === 3 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                size="sm"
                onClick={() => {
                  if (integrationCount === 3) {
                    console.log('Start practice session');
                  }
                }}
              >
                {integrationCount === 3 ? 'Start Practice Session' : 'Connect Integrations First'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherOnboardingDashboard;