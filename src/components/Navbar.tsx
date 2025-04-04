
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/15671e94-4ac9-490c-95b6-aa4fe6bbc23c.png" 
                alt="Kidato Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                to="/all-classes" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-blue"
              >
                All Classes
              </Link>
              <Link 
                to="/for-teachers" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-blue"
              >
                For Teachers
              </Link>
              <Link 
                to="/for-parents" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-blue"
              >
                For Parents
              </Link>
              <Link 
                to="/for-students" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-blue"
              >
                For Students
              </Link>
              <Link 
                to="/how-it-works" 
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-blue"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link to="/login">
              <Button variant="outline" className="mr-3">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-kidato-blue hover:bg-kidato-dark-blue button-hover-effect">
                Sign up
              </Button>
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-kidato-blue focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/all-classes" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-blue hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              All Classes
            </Link>
            <Link 
              to="/for-teachers" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-blue hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              For Teachers
            </Link>
            <Link 
              to="/for-parents" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-blue hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              For Parents
            </Link>
            <Link 
              to="/for-students" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-blue hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              For Students
            </Link>
            <Link 
              to="/how-it-works" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-blue hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <div className="flex flex-col px-3 py-2 space-y-2">
              <Link 
                to="/login" 
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link 
                to="/signup" 
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
