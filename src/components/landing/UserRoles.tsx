import { Link } from "react-router-dom";
import { BookOpen, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentCardSection } from "@/content/types";

interface UserRolesProps {
  content?: ContentCardSection;
}

// Icon mapping for string icon names
const iconMap: Record<string, any> = {
  BookOpen,
  Users,
  Heart
};

const UserRoles = ({ content }: UserRolesProps) => {
  // Default roles (fallback)
  const defaultRoles = [
    {
      id: "tutors",
      title: "For Tutors",
      description: "Share your knowledge, set your own schedule, and earn income while making a difference in students' lives.",
      icon: "BookOpen",
      link: { text: "Become a Tutor", href: "/tutor-signup", variant: "primary" as const }
    },
    {
      id: "parents",
      title: "For Parents",
      description: "Find qualified tutors to support your child's educational journey with personalized attention and care.",
      icon: "Heart",
      link: { text: "Find Tutors", href: "/parent-signup", variant: "primary" as const }
    },
    {
      id: "students",
      title: "For Students",
      description: "Learn at your own pace, make friends with peers across Africa, and have fun while developing your skills.",
      icon: "Users",
      link: { text: "Start Learning", href: "/student-signup", variant: "primary" as const }
    }
  ];

  const title = content?.title || "Something for Everyone";
  const subtitle = content?.subtitle || "Kidato serves different needs in the educational ecosystem";
  const roles = content?.cards || defaultRoles;

  // Color mapping for roles
  const colorMap: Record<string, { bg: string; icon: string }> = {
    BookOpen: { bg: "bg-blue-100", icon: "text-kidato-purple" },
    Heart: { bg: "bg-orange-100", icon: "text-kidato-orange" },
    Users: { bg: "bg-green-100", icon: "text-green-600" }
  };

  return (
    <div className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role) => {
            const IconComponent = role.icon ? iconMap[role.icon] : BookOpen;
            const colors = colorMap[role.icon || 'BookOpen'] || colorMap.BookOpen;

            return (
              <div
                key={role.id}
                className="relative p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
              >
                <div className={`${colors.bg} rounded-full p-4 inline-block mb-4 w-16 h-16 flex items-center justify-center`}>
                  <IconComponent className={`h-8 w-8 ${colors.icon}`} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{role.description}</p>
                {role.link && (
                  <Link to={role.link.href}>
                    <Button className="w-full bg-kidato-purple hover:bg-kidato-dark-blue button-hover-effect">
                      {role.link.text}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
