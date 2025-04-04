
import { Book, Users, Award, Globe, Shield, Clock } from "lucide-react";

const features = [
  {
    name: "Safe Learning Environment",
    description: "Your child connects with verified, background-checked tutors in a monitored online environment designed with child safety as the priority.",
    icon: Shield,
    color: "bg-blue-100",
    iconColor: "text-kidato-blue"
  },
  {
    name: "Personalized Attention",
    description: "Watch your child thrive with individualized support that addresses their specific learning needs, pace, and interests.",
    icon: Users,
    color: "bg-orange-100",
    iconColor: "text-kidato-orange"
  },
  {
    name: "Curriculum-Aligned Learning",
    description: "All sessions are designed to complement your child's school curriculum, ensuring they excel in their regular academic studies.",
    icon: Book,
    color: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    name: "Flexible Scheduling",
    description: "Find sessions that fit around your family's busy schedule with options available evenings, weekends, and school holidays.",
    icon: Clock,
    color: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    name: "Global Perspective",
    description: "Expose your child to diverse perspectives as they connect with peers and tutors from across the African continent.",
    icon: Globe,
    color: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    name: "Progress Tracking",
    description: "Receive regular updates on your child's development with detailed progress reports and achievement milestones.",
    icon: Award,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600"
  }
];

const Features = () => {
  return (
    <div className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why Parents Choose Kidato</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of parents who trust us with their children's education. Here's how we support your child's learning journey:
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full"
            >
              <div className={`${feature.color} rounded-full p-3 inline-block mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.name}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 max-w-3xl mx-auto italic">
            "Our mission is to empower your child with quality education that builds confidence, 
            sparks curiosity, and prepares them for future success - all while giving you peace of mind."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
