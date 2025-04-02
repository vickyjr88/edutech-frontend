
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Users, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
            <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Student Dashboard</h3>
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-kidato-light-blue border-0">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-kidato-blue p-2 rounded-full mb-2">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-kidato-blue">5</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-50 border-0">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-kidato-orange p-2 rounded-full mb-2">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">Tutors</p>
                    <p className="text-2xl font-bold text-kidato-orange">3</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-0">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="bg-purple-500 p-2 rounded-full mb-2">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-xs text-gray-600">Achievements</p>
                    <p className="text-2xl font-bold text-purple-500">12</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Weekly Progress</h4>
                  <div className="text-xs text-kidato-blue">View All</div>
                </div>
                <div className="flex items-end h-32 space-x-2">
                  {[40, 65, 45, 90, 80, 55, 70].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-kidato-blue rounded-sm transition-all duration-500" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs mt-1 text-gray-500">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Upcoming Classes</h4>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </div>
                {[
                  { subject: "Mathematics", time: "3:30 PM", tutor: "Mr. Johnson" },
                  { subject: "Science", time: "5:00 PM", tutor: "Ms. Okafor" }
                ].map((cls, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 ${i > 0 ? 'border-t' : ''}`}>
                    <div>
                      <p className="text-sm font-medium">{cls.subject}</p>
                      <p className="text-xs text-gray-500">with {cls.tutor}</p>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {cls.time} Today
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
