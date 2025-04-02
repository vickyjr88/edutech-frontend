
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Users, Award, Calendar, Video, MessageSquare, 
  FileText, BarChart3, Clock, CheckCircle, User, Percent
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account and tell us about your teaching expertise and subjects you specialize in.",
  },
  {
    number: "02",
    title: "Set Up Your Profile",
    description: "Build your teaching profile, set your availability, and customize your virtual classroom.",
  },
  {
    number: "03",
    title: "Connect & Teach",
    description: "Start connecting with students across Africa and deliver engaging lessons on our platform.",
  }
];

const HowItWorks = () => {
  return (
    <div className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How Kidato Works for Teachers</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform empowers educators to reach students across Africa with just a few simple steps
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}
            >
              <div className="w-full lg:w-1/2">
                {/* Dashboard mockups based on step */}
                {index === 0 && <SignUpDashboard />}
                {index === 1 && <ProfileSetupDashboard />}
                {index === 2 && <TeachingDashboard />}
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold text-kidato-blue mr-4">{step.number}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/signup">
            <Button className="bg-kidato-blue hover:bg-kidato-dark-blue button-hover-effect text-lg px-8 py-6">
              Become a Kidato Teacher
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Sign Up Dashboard Mockup
const SignUpDashboard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform scale-90">
    <div className="bg-gradient-to-r from-kidato-light-blue to-blue-50 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-kidato-blue flex items-center justify-center text-white">
          <User className="h-3 w-3" />
        </div>
        <h3 className="text-xs font-bold">Teacher Onboarding</h3>
      </div>
    </div>
    
    <div className="p-3 space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>Profile Completion</span>
        <span>65%</span>
      </div>
      <Progress value={65} className="h-2" />
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Card className="shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <CheckCircle className="h-3 w-3" />
              </div>
              <div>
                <p className="text-xs font-medium">Personal Info</p>
                <p className="text-[9px] text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Clock className="h-3 w-3" />
              </div>
              <div>
                <p className="text-xs font-medium">Subjects</p>
                <p className="text-[9px] text-gray-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center py-2">
        <Button size="sm" className="text-[10px] bg-kidato-blue py-1 px-3 h-auto">Continue Setup</Button>
      </div>
    </div>
  </div>
);

// Profile Setup Dashboard Mockup
const ProfileSetupDashboard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform scale-90">
    <div className="bg-gradient-to-r from-purple-100 to-blue-50 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white">
          <User className="h-3 w-3" />
        </div>
        <h3 className="text-xs font-bold">Teacher Profile</h3>
      </div>
    </div>
    
    <div className="p-3 space-y-2">
      <div className="bg-gray-50 rounded p-2 text-[10px]">
        <h4 className="font-medium mb-1">Your Subjects</h4>
        <div className="flex flex-wrap gap-1">
          {["Mathematics", "Physics", "Chemistry"].map((subject, i) => (
            <span key={i} className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-[8px]">
              {subject}
            </span>
          ))}
          <span className="bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 text-[8px] flex items-center">
            <span>+</span>
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded p-2 text-[10px]">
        <h4 className="font-medium mb-1">Teaching Schedule</h4>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className={`p-1 rounded ${i < 5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {day}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center py-1">
        <Button size="sm" className="text-[10px] bg-purple-500 hover:bg-purple-600 py-1 px-3 h-auto">Complete Profile</Button>
      </div>
    </div>
  </div>
);

// Teaching Dashboard Mockup
const TeachingDashboard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform scale-90">
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-kidato-orange flex items-center justify-center text-white">
          <Award className="h-3 w-3" />
        </div>
        <h3 className="text-xs font-bold">Teaching Dashboard</h3>
      </div>
    </div>
    
    <div className="p-3 space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Card className="bg-blue-50 shadow-sm">
          <CardContent className="p-2 flex flex-col items-center">
            <div className="bg-kidato-blue p-1 rounded-full mb-1">
              <Users className="h-3 w-3 text-white" />
            </div>
            <p className="text-[9px] text-gray-600">Students</p>
            <p className="text-xs font-bold text-kidato-blue">24</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 shadow-sm">
          <CardContent className="p-2 flex flex-col items-center">
            <div className="bg-green-500 p-1 rounded-full mb-1">
              <BookOpen className="h-3 w-3 text-white" />
            </div>
            <p className="text-[9px] text-gray-600">Classes</p>
            <p className="text-xs font-bold text-green-700">12</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 shadow-sm">
          <CardContent className="p-2 flex flex-col items-center">
            <div className="bg-purple-500 p-1 rounded-full mb-1">
              <Percent className="h-3 w-3 text-white" />
            </div>
            <p className="text-[9px] text-gray-600">Rating</p>
            <p className="text-xs font-bold text-purple-700">4.8</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gray-50 rounded p-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-medium">Upcoming Sessions</h4>
          <span className="text-[8px] text-kidato-blue">View All</span>
        </div>
        <div className="space-y-1.5">
          {[
            { subject: "Physics", grade: "Grade 10", time: "2:30 PM" },
            { subject: "Chemistry", grade: "Grade 12", time: "4:00 PM" }
          ].map((session, i) => (
            <div key={i} className="flex justify-between items-center bg-white p-1.5 rounded text-[9px]">
              <div>
                <p className="font-medium">{session.subject}</p>
                <p className="text-gray-500">{session.grade}</p>
              </div>
              <div className="bg-orange-100 text-orange-700 rounded-full px-2 py-0.5">
                {session.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default HowItWorks;
