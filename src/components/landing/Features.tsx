
import { Book, Users, Award, Globe } from "lucide-react";

const features = [
  {
    name: "Expert African Tutors",
    description: "Connect with qualified teachers across Africa who understand local curricula and learning contexts.",
    icon: Users,
    color: "bg-blue-100",
    iconColor: "text-kidato-blue"
  },
  {
    name: "Interactive Learning",
    description: "Engage in interactive, fun classes designed to keep children motivated and excited about learning.",
    icon: Book,
    color: "bg-orange-100",
    iconColor: "text-kidato-orange"
  },
  {
    name: "Flexible Schedules",
    description: "Choose from a wide range of class times that work with your family's busy schedule.",
    icon: Globe,
    color: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    name: "Quality Assurance",
    description: "All tutors undergo rigorous vetting to ensure they meet our high standards for education excellence.",
    icon: Award,
    color: "bg-purple-100",
    iconColor: "text-purple-600"
  }
];

const Features = () => {
  return (
    <div className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why Choose Kidato?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is designed to make quality education accessible, engaging, and effective for K12 students across Africa.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className={`${feature.color} rounded-full p-3 inline-block mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
