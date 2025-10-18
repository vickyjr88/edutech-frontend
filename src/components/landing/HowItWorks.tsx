
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, Users, Award, Calendar, Video, MessageSquare, 
  FileText, BarChart3, Clock, CheckCircle, User, Percent,
  Briefcase, GraduationCap, Star, Target, Lightbulb, Trophy,
  Globe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Build your teaching profile highlighting your expertise, qualifications, and teaching style to stand out to students and parents across Africa.",
    benefits: [
      "Showcase your teaching credentials and experience",
      "Highlight your subject expertise and teaching methodology",
      "Share your teaching philosophy and approach to education"
    ]
  },
  {
    number: "02",
    title: "Connect & Grow",
    description: "Build your professional network, join specialized teaching communities, and access continuous development opportunities.",
    benefits: [
      "Connect with fellow educators from around the world",
      "Access professional development resources and training",
      "Join subject-specific communities of practice"
    ]
  },
  {
    number: "03",
    title: "Teach & Earn",
    description: "Deliver engaging virtual lessons, build your reputation, and create flexible income streams while making a real impact on students' lives.",
    benefits: [
      "Set your own schedule and teaching availability",
      "Earn competitive rates based on your expertise",
      "Receive feedback to continuously improve your teaching"
    ]
  }
];

const teacherBenefits = [
  {
    title: "Professional Growth",
    description: "Access specialized training and certification programs to enhance your teaching skills and advance your career.",
    icon: GraduationCap,
    color: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Global Classroom",
    description: "Connect with students across Africa without geographical limitations, expanding your teaching reach beyond borders.",
    icon: Globe,
    color: "bg-blue-100",
    iconColor: "text-kidato-purple"
  },
  {
    title: "Recognition & Rewards",
    description: "Build your reputation through student reviews, ratings, and our teacher recognition program celebrating educational excellence.",
    icon: Trophy,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    title: "Teaching Resources",
    description: "Access our library of curriculum-aligned materials, interactive tools, and lesson templates to enhance your teaching.",
    icon: BookOpen,
    color: "bg-green-100",
    iconColor: "text-green-600"
  }
];

interface HowItWorksProps {
  content?: any; // Accept any content for now, will use defaults
}

const HowItWorks = ({ content }: HowItWorksProps = {}) => {
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
                {index === 0 && <ProfileSetupDashboard />}
                {index === 1 && <CommunityDashboard />}
                {index === 2 && <TeachingDashboard />}
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold text-kidato-purple mr-4">{step.number}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Teacher Benefits Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-10">Why Educators Choose Kidato</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teacherBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full"
              >
                <div className={`${benefit.color} rounded-full p-3 inline-block mb-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Testimonial */}
        <div className="mt-16 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <p className="text-lg text-gray-700 italic mb-4">
                "Joining Kidato transformed my teaching career. I now connect with motivated students from across Africa, 
                set my own schedule, and earn a reliable income doing what I love. The professional community has helped 
                me grow as an educator and opened doors I never thought possible."
              </p>
              <div>
                <p className="font-semibold text-gray-900">Sarah Okafor</p>
                <p className="text-sm text-gray-600">Mathematics Teacher, 4 years on Kidato</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/signup">
            <Button className="bg-kidato-purple hover:bg-kidato-dark-blue button-hover-effect text-lg px-8 py-6">
              Become a Kidato Teacher
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex justify-between text-xs font-medium">
        <span>Profile Completion</span>
        <span>85%</span>
      </div>
      <Progress value={85} className="h-2" />
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Card className="bg-blue-50 shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <GraduationCap className="h-3 w-3" />
              </div>
              <div>
                <p className="text-xs font-medium">Credentials</p>
                <p className="text-[9px] text-green-600">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <BookOpen className="h-3 w-3" />
              </div>
              <div>
                <p className="text-xs font-medium">Subjects</p>
                <p className="text-[9px] text-gray-500">4 Added</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gray-50 rounded p-2 text-[10px]">
        <h4 className="font-medium mb-1">Your Teaching Experience</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>International School of Nairobi</span>
            <span className="text-gray-500">3 years</span>
          </div>
          <div className="flex justify-between">
            <span>Digital Learning Academy</span>
            <span className="text-gray-500">2 years</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Community Dashboard Mockup
const CommunityDashboard = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform scale-90">
    <div className="bg-gradient-to-r from-kidato-light-blue to-blue-50 p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-kidato-purple flex items-center justify-center text-white">
          <Users className="h-3 w-3" />
        </div>
        <h3 className="text-xs font-bold">Community Hub</h3>
      </div>
    </div>
    
    <div className="p-3 space-y-2">
      <div className="bg-gray-50 rounded p-2 text-[10px]">
        <h4 className="font-medium mb-1">Your Communities</h4>
        <div className="flex flex-wrap gap-1">
          {["Math Educators", "STEM Teachers", "EdTech Innovators", "High School Prep"].map((group, i) => (
            <span key={i} className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-[8px]">
              {group}
            </span>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded p-2 text-[10px]">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium">Upcoming Events</h4>
          <span className="text-[8px] text-kidato-purple">View All</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center bg-white p-1 rounded text-[9px]">
            <div>
              <p className="font-medium">Teaching with AI Workshop</p>
              <p className="text-gray-500">Tomorrow, 3:00 PM</p>
            </div>
            <Button size="sm" className="h-auto py-0.5 px-2 text-[8px]">Join</Button>
          </div>
          <div className="flex justify-between items-center bg-white p-1 rounded text-[9px]">
            <div>
              <p className="font-medium">Math Teachers Forum</p>
              <p className="text-gray-500">Friday, 5:00 PM</p>
            </div>
            <Button size="sm" className="h-auto py-0.5 px-2 text-[8px]">Join</Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded p-2 border border-gray-100 text-[10px]">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium">Professional Development</h4>
          <span className="bg-green-100 text-green-700 rounded-full px-1.5 py-0.5 text-[8px]">New</span>
        </div>
        <p className="text-[9px] text-gray-600 mb-1">Complete courses to earn credentials</p>
        <Progress value={40} className="h-1.5 mb-1" />
        <p className="text-right text-[8px] text-kidato-purple">2/5 Modules Complete</p>
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
            <div className="bg-kidato-purple p-1 rounded-full mb-1">
              <Users className="h-3 w-3 text-white" />
            </div>
            <p className="text-[9px] text-gray-600">Students</p>
            <p className="text-xs font-bold text-kidato-purple">24</p>
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
        
        <Card className="bg-yellow-50 shadow-sm">
          <CardContent className="p-2 flex flex-col items-center">
            <div className="bg-yellow-500 p-1 rounded-full mb-1">
              <Star className="h-3 w-3 text-white" />
            </div>
            <p className="text-[9px] text-gray-600">Rating</p>
            <p className="text-xs font-bold text-yellow-700">4.8</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-gray-50 rounded p-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-medium">Earnings Overview</h4>
          <span className="text-[8px] text-kidato-purple">View Details</span>
        </div>
        <div className="flex items-end h-10 space-x-1 mb-1">
          {[60, 45, 70, 85, 75, 90, 80].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-kidato-orange rounded-sm transition-all duration-500 hover:opacity-80 cursor-pointer" 
                style={{ height: `${height}%` }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[8px] text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div className="mt-1 text-center">
          <p className="text-[10px] font-medium text-gray-800">This week: $420.00</p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded p-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-medium">Upcoming Sessions</h4>
          <span className="text-[8px] text-kidato-purple">View All</span>
        </div>
        <div className="space-y-1.5">
          {[
            { subject: "Physics", grade: "Grade 10", time: "2:30 PM", students: 8 },
            { subject: "Chemistry", grade: "Grade 12", time: "4:00 PM", students: 6 }
          ].map((session, i) => (
            <div key={i} className="flex justify-between items-center bg-white p-1.5 rounded text-[9px]">
              <div>
                <p className="font-medium">{session.subject}</p>
                <p className="text-gray-500">{session.grade} • {session.students} students</p>
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
