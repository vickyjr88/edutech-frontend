
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Users, BookOpen, Award, Bell, Calendar, CheckCircle, MoreVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Hero = () => {
  return (
    <div className="hero-gradient pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-kidato-blue">Learn</span>, <span className="text-kidato-orange">Connect</span>, and <span className="text-kidato-blue">Grow</span> with Africa's Premier Learning Platform
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Connecting K12 students across Africa with exceptional tutors for personalized learning experiences.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto bg-kidato-blue hover:bg-kidato-dark-blue button-hover-effect text-lg px-8 py-6">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
              {/* Dashboard Header with User Profile */}
              <div className="bg-gradient-to-r from-kidato-light-blue to-blue-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-kidato-blue flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Sarah's Dashboard</h3>
                    <p className="text-xs text-gray-600">Grade 8 Student</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-kidato-blue transition-colors" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">3</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 p-4">
                <Card className="bg-kidato-light-blue border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-kidato-blue p-2 rounded-full mb-2">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-kidato-blue">5</p>
                    <span className="text-xs text-green-600 flex items-center mt-1">
                      <ArrowRight className="h-3 w-3 rotate-45" /> +2 this month
                    </span>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-kidato-orange p-2 rounded-full mb-2">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">Tutors</p>
                    <p className="text-2xl font-bold text-kidato-orange">3</p>
                    <span className="text-xs text-orange-600 flex items-center mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" /> All Active
                    </span>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-purple-500 p-2 rounded-full mb-2">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">Achievements</p>
                    <p className="text-2xl font-bold text-purple-500">12</p>
                    <span className="text-xs text-purple-600 flex items-center mt-1">
                      <ArrowRight className="h-3 w-3 rotate-45" /> +3 last week
                    </span>
                  </CardContent>
                </Card>
              </div>
              
              {/* Weekly Progress */}
              <div className="bg-gray-50 rounded-lg mx-4 p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Weekly Learning Progress</h4>
                  <div className="text-xs text-kidato-blue hover:underline cursor-pointer">View Details</div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Mathematics</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2 bg-gray-200" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Science</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-gray-200" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>History</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-gray-200" />
                  </div>
                </div>
                <div className="mt-4 flex items-end h-24 space-x-1">
                  {[40, 65, 45, 90, 80, 55, 70].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-kidato-blue rounded-sm transition-all duration-500 hover:opacity-80 cursor-pointer" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-[10px] mt-1 text-gray-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Classes */}
              <div className="border border-gray-100 bg-white rounded-lg mx-4 p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-kidato-blue" />
                    <h4 className="text-sm font-medium text-gray-700">Upcoming Classes</h4>
                  </div>
                  <MoreVertical className="h-4 w-4 text-gray-400 cursor-pointer" />
                </div>
                {[
                  { subject: "Mathematics", time: "3:30 PM", tutor: "Mr. Johnson", status: "Starting Soon", statusColor: "bg-green-100 text-green-800" },
                  { subject: "Science", time: "5:00 PM", tutor: "Ms. Okafor", status: "In 2 Hours", statusColor: "bg-blue-100 text-blue-800" }
                ].map((cls, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 ${i > 0 ? 'border-t' : ''} hover:bg-gray-50 rounded-md transition-colors cursor-pointer`}>
                    <div>
                      <p className="text-sm font-medium">{cls.subject}</p>
                      <p className="text-xs text-gray-500">with {cls.tutor}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full mb-1">
                        {cls.time} Today
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${cls.statusColor}`}>
                        {cls.status}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-3 text-center">
                  <Button variant="ghost" size="sm" className="text-xs text-kidato-blue hover:text-kidato-dark-blue w-full">
                    View All Classes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
