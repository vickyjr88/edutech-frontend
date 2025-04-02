
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Users, BookOpen, Award, Bell, Calendar, CheckCircle, MoreVertical, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Hero = () => {
  return (
    <div className="hero-gradient pt-20 pb-12 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-kidato-blue">Learn</span>, <span className="text-kidato-orange">Connect</span>, and <span className="text-kidato-blue">Grow</span> with Africa's Premier Learning Platform
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Connecting K12 students across Africa with exceptional tutors for personalized learning experiences.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button className="w-full sm:w-auto bg-kidato-blue hover:bg-kidato-dark-blue button-hover-effect text-lg px-6 py-5">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-6 py-5">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block animate-fade-in">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform scale-90">
              {/* Dashboard Header with User Profile */}
              <div className="bg-gradient-to-r from-kidato-light-blue to-blue-50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-kidato-blue flex items-center justify-center text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Sarah's Dashboard</h3>
                    <p className="text-xs text-gray-600">Grade 8 Student</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Bell className="h-4 w-4 text-gray-600 cursor-pointer hover:text-kidato-blue transition-colors" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">3</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 p-3">
                <Card className="bg-kidato-light-blue border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-2 flex flex-col items-center">
                    <div className="bg-kidato-blue p-1.5 rounded-full mb-1">
                      <BookOpen className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-600">Active Courses</p>
                    <p className="text-base font-bold text-kidato-blue">5</p>
                    <span className="text-[8px] text-green-600 flex items-center">
                      <ArrowRight className="h-2 w-2 rotate-45" /> +2 this month
                    </span>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-2 flex flex-col items-center">
                    <div className="bg-kidato-orange p-1.5 rounded-full mb-1">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-600">Tutors</p>
                    <p className="text-base font-bold text-kidato-orange">3</p>
                    <span className="text-[8px] text-orange-600 flex items-center">
                      <CheckCircle className="h-2 w-2 mr-0.5" /> All Active
                    </span>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-2 flex flex-col items-center">
                    <div className="bg-purple-500 p-1.5 rounded-full mb-1">
                      <Award className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] text-gray-600">Achievements</p>
                    <p className="text-base font-bold text-purple-500">12</p>
                    <span className="text-[8px] text-purple-600 flex items-center">
                      <ArrowRight className="h-2 w-2 rotate-45" /> +3 last week
                    </span>
                  </CardContent>
                </Card>
              </div>
              
              {/* Weekly Progress */}
              <div className="bg-gray-50 rounded-lg mx-3 p-2 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-medium text-gray-700">Weekly Learning Progress</h4>
                  <div className="text-[10px] text-kidato-blue hover:underline cursor-pointer">View Details</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>Mathematics</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-1.5 bg-gray-200" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>Science</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-1.5 bg-gray-200" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
                      <span>History</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-1.5 bg-gray-200" />
                  </div>
                </div>
                <div className="mt-2 flex items-end h-16 space-x-1">
                  {[40, 65, 45, 90, 80, 55, 70].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-kidato-blue rounded-sm transition-all duration-500 hover:opacity-80 cursor-pointer" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-[8px] mt-0.5 text-gray-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Classes */}
              <div className="border border-gray-100 bg-white rounded-lg mx-3 p-2 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-kidato-blue" />
                    <h4 className="text-xs font-medium text-gray-700">Upcoming Classes</h4>
                  </div>
                  <MoreVertical className="h-3 w-3 text-gray-400 cursor-pointer" />
                </div>
                {[
                  { subject: "Mathematics", time: "3:30 PM", tutor: "Mr. Johnson", status: "Starting Soon", statusColor: "bg-green-100 text-green-800" },
                  { subject: "Science", time: "5:00 PM", tutor: "Ms. Okafor", status: "In 2 Hours", statusColor: "bg-blue-100 text-blue-800" }
                ].map((cls, i) => (
                  <div key={i} className={`flex items-center justify-between p-1.5 ${i > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50 rounded-md transition-colors cursor-pointer`}>
                    <div>
                      <p className="text-xs font-medium">{cls.subject}</p>
                      <p className="text-[9px] text-gray-500">with {cls.tutor}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-[9px] font-medium bg-gray-100 px-1.5 py-0.5 rounded-full mb-0.5">
                        {cls.time} Today
                      </div>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${cls.statusColor}`}>
                        {cls.status}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mt-1 text-center">
                  <Button variant="ghost" size="sm" className="text-[10px] text-kidato-blue hover:text-kidato-dark-blue w-full py-0.5">
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
