import { Book, Users, Award, Globe, Shield, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    name: "Global Perspective",
    description: "Expose your child to diverse perspectives as they connect with world-class tutors and peers from across the globe while focusing on African curriculum.",
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

const upcomingClasses = [
  {
    title: "Introduction to Algebra",
    subject: "Mathematics",
    level: "Grade 7-8",
    teacher: "Ms. Amina Okafor",
    rating: 4.9,
    time: "Tuesdays & Thursdays, 4:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "3 spots left",
    price: "$12/class"
  },
  {
    title: "Science Experiments at Home",
    subject: "Science",
    level: "Grade 5-6",
    teacher: "Mr. Daniel Mwangi",
    rating: 4.8,
    time: "Mondays & Wednesdays, 3:30 PM",
    imageSrc: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "2 spots left",
    price: "$10/class"
  },
  {
    title: "English Literature Essentials",
    subject: "English",
    level: "Grade 9-10",
    teacher: "Ms. Grace Okello",
    rating: 5.0,
    time: "Fridays, 5:00 PM",
    imageSrc: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "5 spots left",
    price: "$15/class"
  },
  {
    title: "Coding for Kids",
    subject: "Computer Science",
    level: "Grade 4-6",
    teacher: "Mr. Kwame Adu",
    rating: 4.7,
    time: "Saturdays, 10:00 AM",
    imageSrc: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    spots: "1 spot left",
    price: "$18/class"
  }
];

const featuredTeachers = [
  {
    name: "Dr. Nkem Adeyemi",
    subject: "Mathematics & Physics",
    experience: "10+ years",
    education: "PhD in Applied Mathematics",
    rating: 4.9,
    availability: "Weekdays 3-8 PM",
    imageSrc: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: "Advanced Calculus, Mechanics",
    hourlyRate: "$25/hour"
  },
  {
    name: "Ms. Nneka Okonkwo",
    subject: "English Literature",
    experience: "8 years",
    education: "MA in English",
    rating: 4.8,
    availability: "Evenings & Weekends",
    imageSrc: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: "Essay Writing, Critical Analysis",
    hourlyRate: "$22/hour"
  },
  {
    name: "Mr. Taiwo Makinde",
    subject: "Computer Science",
    experience: "6 years",
    education: "BSc in Computer Science",
    rating: 4.7,
    availability: "Afternoons & Weekends",
    imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: "Python, Web Development",
    hourlyRate: "$24/hour"
  }
];

const Features = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayedFeatures = showAllFeatures ? features : features.slice(0, 3);

  return (
    <div className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why Parents Choose Kidato</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Join parents who trust us with their children's education. Here's how we support your child's learning journey:
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {displayedFeatures.map((feature, index) => (
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
        
        {!showAllFeatures && (
          <div className="text-center mb-12">
            <Button 
              variant="outline" 
              onClick={() => setShowAllFeatures(true)}
              className="px-6 border-kidato-blue text-kidato-blue hover:bg-kidato-light-blue"
            >
              View More Benefits
            </Button>
          </div>
        )}

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Available Classes</h3>
            <Button className="bg-kidato-blue hover:bg-kidato-dark-blue text-white">
              View All Classes
            </Button>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingClasses.map((classItem, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={classItem.imageSrc} 
                    alt={classItem.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-kidato-blue">{classItem.subject}</p>
                      <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">{classItem.title}</h4>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{classItem.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{classItem.level}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">Teacher:</span> {classItem.teacher}
                  </p>
                  <div className="flex items-center gap-1 mb-3">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-xs text-gray-500">{classItem.time}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {classItem.spots}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{classItem.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700 max-w-3xl mx-auto italic">
            "Our mission is to empower your child with quality education that builds confidence, 
            sparks curiosity, and prepares them for future success - all while giving you peace of mind."
          </p>
        </div>
        
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900">Educators Available for On-Demand Tuition</h3>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Book a session with our highly qualified educators who are ready to help your child excel
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-3 mb-10">
            {featuredTeachers.map((teacher, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-20 w-20 mb-3">
                      <AvatarImage src={teacher.imageSrc} alt={teacher.name} />
                      <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h4 className="text-lg font-semibold text-gray-900">{teacher.name}</h4>
                    <p className="text-sm font-medium text-kidato-blue">{teacher.subject}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{teacher.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Education:</span>
                      <span className="font-medium line-clamp-1">{teacher.education}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expertise:</span>
                      <span className="font-medium line-clamp-1">{teacher.expertise}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{teacher.rating}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{teacher.hourlyRate}</div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-kidato-orange hover:bg-orange-600 text-white">
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-kidato-blue hover:bg-kidato-dark-blue text-white px-8">
              Become a Kidato Teacher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
