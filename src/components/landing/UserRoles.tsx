
import { Link } from "react-router-dom";
import { BookOpen, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  {
    title: "For Tutors",
    description: "Share your knowledge, set your own schedule, and earn income while making a difference in students' lives.",
    icon: BookOpen,
    color: "bg-blue-100",
    iconColor: "text-kidato-purple",
    buttonText: "Become a Tutor",
    buttonLink: "/tutor-signup"
  },
  {
    title: "For Parents",
    description: "Find qualified tutors to support your child's educational journey with personalized attention and care.",
    icon: Heart,
    color: "bg-orange-100",
    iconColor: "text-kidato-orange",
    buttonText: "Find Tutors",
    buttonLink: "/parent-signup"
  },
  {
    title: "For Students",
    description: "Learn at your own pace, make friends with peers across Africa, and have fun while developing your skills.",
    icon: Users,
    color: "bg-green-100",
    iconColor: "text-green-600",
    buttonText: "Start Learning",
    buttonLink: "/student-signup"
  }
];

const UserRoles = () => {
  return (
    <div className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Something for Everyone</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Kidato serves different needs in the educational ecosystem
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role, index) => (
            <div 
              key={index} 
              className="relative p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
            >
              <div className={`${role.color} rounded-full p-4 inline-block mb-4 w-16 h-16 flex items-center justify-center`}>
                <role.icon className={`h-8 w-8 ${role.iconColor}`} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{role.title}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{role.description}</p>
              <Link to={role.buttonLink}>
                <Button className="w-full bg-kidato-purple hover:bg-kidato-dark-blue button-hover-effect">
                  {role.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
