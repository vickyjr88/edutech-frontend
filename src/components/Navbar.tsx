
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, User as UserIcon, Settings, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'teacher': return '/teacher-dashboard';
      case 'parent': return '/parents-dashboard';
      case 'student': return '/student';
      default: return '/dashboard';
    }
  };

  const getProfileLink = () => {
    switch (user?.role) {
      case 'teacher': return '/teacher-profile/preview';
      case 'parent': return '/parent-profile';
      default: return '/settings';
    }
  };

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
          </div>

          {/* Desktop navigation - centered */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
            <div className="flex space-x-8">
              <Link
                to="/all-classes"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                All Classes
              </Link>
              <Link
                to="/teachers"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                Teachers
              </Link>
              <Link
                to="/how-it-works"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                How It Works
              </Link>
              <Link
                to="/for-teachers"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                For Teachers
              </Link>
              <Link
                to="/for-parents"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                For Parents
              </Link>
              <Link
                to="/for-students"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                For Students
              </Link>
              <Link
                to="/blog"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-kidato-purple-500"
              >
                Blog
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {!isLoading && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                  <span className="text-sm text-gray-700 hover:text-kidato-purple transition-colors">
                    Welcome, {user.fullName.split(' ')[0]}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-kidato-purple text-white flex items-center justify-center font-semibold text-sm ring-2 ring-offset-2 ring-transparent hover:ring-kidato-purple transition-all">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={getDashboardLink()}>
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to={getProfileLink()}>
                    <DropdownMenuItem className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="mr-3">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup?role=student">
                  <Button className="bg-kidato-purple hover:bg-kidato-dark-blue button-hover-effect">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-kidato-purple focus:outline-none"
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
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              All Classes
            </Link>
            <Link
              to="/teachers"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Teachers
            </Link>
            <Link
              to="/how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              to="/for-teachers"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              For Teachers
            </Link>
            <Link
              to="/for-parents"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              For Parents
            </Link>
            <Link
              to="/for-students"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              For Students
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact-us"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-kidato-purple hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="flex flex-col px-3 py-2 space-y-2">
              {!isLoading && user ? (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-kidato-purple text-white flex items-center justify-center font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-kidato-purple capitalize">{user.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Use the sidebar to access dashboard, profile, and more options.</p>
                </div>
              ) : (
                <>
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
                    to="/signup?role=student"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-kidato-purple hover:bg-kidato-dark-blue">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
