
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
              alt="Happy students learning" 
              className="rounded-lg shadow-xl animate-fade-in" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
