
import { Book, Users, Award, Globe, Shield, Clock, Star, Briefcase, GraduationCap, Languages, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const features = [
  {
    name: "Safe Learning Environment",
    description: "Your child connects with verified, background-checked tutors in a monitored online environment designed with child safety as the priority.",
    icon: Shield,
    color: "bg-blue-100",
    iconColor: "text-kidato-purple"
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
    name: "Dr. Sarah Okafor",
    subject: "Mathematics & Physics",
    experience: "8+ years",
    education: "PhD in Applied Mathematics, University of Lagos",
    rating: 4.9,
    availability: "Weekdays 3-8 PM",
    imageSrc: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: ["Advanced Calculus", "Mechanics", "Statistics"],
    hourlyRate: "$25/hour",
    students: 120,
    shortBio: "Joining Kidato transformed my teaching career. I now connect with motivated students from across Africa, set my own schedule, and earn a reliable income doing what I love.",
    languages: ["English", "Yoruba", "French"],
    featured: true
  },
  {
    name: "Mr. Taiwo Makinde",
    subject: "Computer Science & Programming",
    experience: "6 years",
    education: "MSc in Computer Science, University of Cape Town",
    rating: 4.8,
    availability: "Afternoons & Weekends",
    imageSrc: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: ["Python", "Web Development", "Mobile App Development"],
    hourlyRate: "$24/hour",
    students: 85,
    shortBio: "I specialize in teaching coding to beginners and advanced students. My passion is making complex programming concepts accessible to learners of all ages.",
    languages: ["English", "Hausa"],
    featured: true
  },
  {
    name: "Ms. Nneka Okonkwo",
    subject: "English Literature & Writing",
    experience: "10 years",
    education: "MA in English, University of Nairobi",
    rating: 5.0,
    availability: "Evenings & Weekends",
    imageSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: ["Essay Writing", "Critical Analysis", "Creative Writing"],
    hourlyRate: "$22/hour",
    students: 145,
    shortBio: "With a background in journalism and creative writing, I help students develop strong communication skills and a love for literature that will serve them throughout their lives.",
    languages: ["English", "Igbo", "Swahili"],
    featured: true
  },
  {
    name: "Mr. Kofi Mensah",
    subject: "Biology & Environmental Science",
    experience: "12 years",
    education: "PhD in Marine Biology, University of Ghana",
    rating: 4.9,
    availability: "Flexible Schedule",
    imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    expertise: ["Ecology", "Genetics", "Environmental Conservation"],
    hourlyRate: "$26/hour",
    students: 160,
    shortBio: "I bring science to life through practical experiments and real-world applications. My students learn to observe, question, and understand the natural world around them.",
    languages: ["English", "Twi", "French"],
    featured: true
  }
];

interface FeaturesProps {
  content?: any; // Accept any content for now, will use defaults
}

const Features = ({ content }: FeaturesProps = {}) => {
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
              className="px-6 border-kidato-purple text-kidato-purple hover:bg-kidato-light-blue"
            >
              View More Benefits
            </Button>
          </div>
        )}

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Available Classes</h3>
            <Link to="/all-classes">
              <Button className="bg-kidato-purple hover:bg-kidato-dark-blue text-white flex items-center gap-2">
                View All Classes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
                      <p className="text-sm font-medium text-kidato-purple">{classItem.subject}</p>
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
        
        {/* Featured Teachers Section - Now positioned above the "Become a Kidato Teacher" button */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900">Featured Educators</h3>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Meet our highly-rated teachers who are making a difference in students' lives across Africa
            </p>
          </div>
          
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {featuredTeachers.map((teacher, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-200">
                <div className="relative">
                  {teacher.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-kidato-orange text-white">Featured</Badge>
                    </div>
                  )}
                  <div className="h-48 overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200">
                    <img 
                      src={teacher.imageSrc} 
                      alt={teacher.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">{teacher.name}</h4>
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium">{teacher.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-kidato-purple">{teacher.subject}</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700">{teacher.experience} teaching experience</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700 line-clamp-1">{teacher.education}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Languages className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700">{teacher.languages.join(", ")}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {teacher.expertise.map((skill, i) => (
                        <span key={i} className="text-xs bg-kidato-light-blue text-kidato-purple px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{teacher.students}+ students</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{teacher.hourlyRate}</div>
                  </div>
                  
                  <Button className="w-full bg-kidato-purple hover:bg-kidato-dark-blue text-white">
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-kidato-orange hover:bg-orange-600 text-white px-8 py-6 text-lg">
              Become a Kidato Teacher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
