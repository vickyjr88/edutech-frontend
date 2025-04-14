import { useState } from "react";
import { Check, Shield, Star, Clock, Users, BookOpen, GraduationCap, CreditCard, BookText, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CurriculumGradeFilter from "@/components/courses/CurriculumGradeFilter";
import PackageDetailsDialog from "@/components/courses/PackageDetailsDialog";

const ForParents = () => {
  const benefits = [
    {
      title: "Quality Education",
      description: "Connect your child with verified, expert teachers who are passionate about education.",
      icon: GraduationCap,
    },
    {
      title: "Safe Learning Environment",
      description: "Our platform provides a secure, monitored online space designed specifically for children.",
      icon: Shield,
    },
    {
      title: "Personalized Attention",
      description: "One-on-one and small group sessions ensure your child receives the attention they need.",
      icon: Users,
    },
    {
      title: "Flexible Scheduling",
      description: "Book sessions that fit your family's busy schedule, with options across different time zones.",
      icon: Clock,
    }
  ];

  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const handleFilterChange = (curriculum: string, grade: string) => {
    setSelectedCurriculum(curriculum);
    setSelectedGrade(grade);
  };

  const openPackageDetails = (packageData: any) => {
    setSelectedPackage(packageData);
    setIsPackageDialogOpen(true);
  };

  const getFilteredPackages = () => {
    if (!selectedCurriculum && !selectedGrade) {
      return popularSubjects;
    }
    
    return popularSubjects.filter(subject => {
      const matchesCurriculum = !selectedCurriculum || subject.curriculum === selectedCurriculum;
      const matchesGrade = !selectedGrade || subject.grade === selectedGrade;
      return matchesCurriculum && matchesGrade;
    });
  };

  const packageDetailsData = {
    "igcse-6": {
      id: "igcse-6",
      name: "IGCSE Grade 6 Package",
      curriculum: "IGCSE",
      grade: "6",
      subjects: [
        "Mathematics", 
        "English Language", 
        "Science (Physics, Chemistry, Biology)", 
        "Geography",
        "History",
        "Computer Science",
        "Art and Design"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Encourage regular reading to build vocabulary and comprehension skills essential for IGCSE",
        "Establish a consistent homework routine to build good study habits",
        "Consider joining at least one extracurricular activity to develop social skills",
        "Use educational apps and games to reinforce concepts learned in class",
        "Schedule regular breaks during study time to maintain focus and retention"
      ],
      description: "Comprehensive preparation for Grade 6 IGCSE students with checkpoint exams focus"
    },
    "ib-7": {
      id: "ib-7",
      name: "IB MYP Year 7 Package",
      curriculum: "IB",
      grade: "7",
      subjects: [
        "Mathematics", 
        "Language and Literature", 
        "Sciences", 
        "Individuals and Societies",
        "Language Acquisition",
        "Design",
        "Arts",
        "Physical and Health Education"
      ],
      hasCheckpoint: false,
      developmentTips: [
        "Focus on developing critical thinking skills through discussions and debates",
        "Encourage global perspective by following international news and events",
        "Support inquiry-based learning by asking open-ended questions",
        "Help establish connections between different subject areas",
        "Practice time management skills for longer-term projects"
      ],
      description: "Holistic education following the IB Middle Years Programme framework"
    },
    "kenyan-4": {
      id: "kenyan-4",
      name: "Kenyan Curriculum Grade 4",
      curriculum: "Kenyan",
      grade: "4",
      subjects: [
        "Mathematics", 
        "English", 
        "Kiswahili", 
        "Science and Technology",
        "Social Studies",
        "Creative Arts",
        "Religious Education",
        "Agriculture"
      ],
      hasCheckpoint: true,
      developmentTips: [
        "Emphasize bilingual development with both English and Kiswahili practice",
        "Reinforce local cultural knowledge alongside academic subjects",
        "Engage in practical applications of science and agriculture concepts",
        "Develop strong mental arithmetic skills through daily practice",
        "Encourage participation in group activities to build teamwork"
      ],
      description: "Complete curriculum coverage for Kenyan education system"
    }
  };

  const popularSubjects = [
    { 
      name: "IGCSE Grade 6 Package", 
      level: "Primary", 
      popularity: "Most Popular",
      curriculum: "igcse",
      grade: "6",
      id: "igcse-6"
    },
    { 
      name: "IB MYP Year 7 Package", 
      level: "Secondary", 
      popularity: "Popular",
      curriculum: "ib",
      grade: "7",
      id: "ib-7"
    },
    { 
      name: "American Curriculum Grade 5", 
      level: "Primary", 
      popularity: "Popular",
      curriculum: "american",
      grade: "5",
      id: "american-5"
    },
    { 
      name: "British Year 9 Package", 
      level: "Secondary", 
      popularity: "Trending",
      curriculum: "british",
      grade: "9",
      id: "british-9"
    },
    { 
      name: "Kenyan Curriculum Grade 4", 
      level: "Primary", 
      popularity: "Growing",
      curriculum: "kenyan",
      grade: "4",
      id: "kenyan-4"
    },
    { 
      name: "IGCSE Grade 8 Package", 
      level: "Secondary", 
      popularity: "Essential",
      curriculum: "igcse",
      grade: "8",
      id: "igcse-8"
    },
  ];

  const testimonials = [
    {
      name: "Amina Khalid",
      location: "Nairobi, Kenya",
      testimonial: "Kidato has transformed my daughter's attitude toward math. Her confidence has soared, and she's now top of her class!",
      avatar: "https://randomuser.me/api/portraits/women/54.jpg",
      childAge: "Daughter, 12"
    },
    {
      name: "Nadia Mensah",
      location: "Accra, Ghana",
      testimonial: "As a working mother, I struggled to find quality tutoring that would fit our schedule. Kidato solved this problem with their flexible timing and excellent teachers.",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      childAge: "Son, 9"
    },
    {
      name: "Fatou Diallo",
      location: "Dakar, Senegal",
      testimonial: "The personalized attention my son receives has made all the difference. His teacher truly understands his learning style and challenges him appropriately.",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      childAge: "Son, 14"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="bg-gradient-to-r from-kidato-orange to-orange-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock Your Child's Potential with Personalized Learning</h1>
              <p className="text-xl mb-8">Trusted by thousands of parents across Africa to provide quality, accessible education that fits your family's needs.</p>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-kidato-orange hover:bg-gray-100">
                  <Link to="/find-tutors">Find a Tutor</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/explore-classes">Explore Classes</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Parents Choose Kidato</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                We partner with you to support your child's educational journey in a safe, engaging environment.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-kidato-orange" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How Kidato Works for Your Family</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Getting started is simple - we'll guide you through every step.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Find the Perfect Match",
                  description: "Browse our qualified teachers or let us recommend the best match for your child's needs."
                },
                {
                  step: "2",
                  title: "Schedule Sessions",
                  description: "Book one-on-one tutoring or small group classes at times that work for your family."
                },
                {
                  step: "3",
                  title: "Watch Them Grow",
                  description: "Track your child's progress with detailed reports and regular check-ins with their teacher."
                }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="bg-kidato-orange text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" className="bg-kidato-orange hover:bg-orange-600 text-white">
                <Link to="/parent-signup">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Popular Learning Packages</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Find the perfect full home learning package for your child based on their curriculum and grade level.
              </p>
            </div>
            
            <CurriculumGradeFilter onFilterChange={handleFilterChange} />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredPackages().map((subject, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{subject.name}</h3>
                        <p className="text-sm text-gray-600">{subject.level}</p>
                      </div>
                      <Badge className="bg-kidato-orange">{subject.popularity}</Badge>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        className="text-kidato-orange border-kidato-orange hover:bg-orange-50"
                        onClick={() => openPackageDetails(packageDetailsData[subject.id] || {
                          id: subject.id,
                          name: subject.name,
                          curriculum: subject.curriculum,
                          grade: subject.grade,
                          subjects: ["Mathematics", "English", "Science", "Social Studies", "Arts"],
                          hasCheckpoint: subject.grade === "6" || subject.grade === "9",
                          developmentTips: [
                            "Establish consistent homework routines",
                            "Encourage reading for at least 30 minutes daily",
                            "Practice concepts through real-world applications",
                            "Balance screen time with physical activities",
                            "Maintain regular communication with teachers"
                          ],
                          description: `Complete package for ${subject.curriculum.toUpperCase()} curriculum Grade ${subject.grade}`
                        })}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-kidato-light-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Parents Are Saying</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Join families who have seen real academic growth and increased confidence in their children.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="h-14 w-14 rounded-full mr-4" 
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                        <p className="text-xs text-kidato-blue">{testimonial.childAge}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Affordable Learning Options</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Quality education that fits your budget with transparent, flexible pricing.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "One-on-One Tuition Classes",
                  price: "$15-35",
                  unit: "per hour",
                  icon: Users,
                  features: [
                    "Personalized attention",
                    "Curriculum-aligned instruction",
                    "Flexible scheduling",
                    "Regular progress reports"
                  ],
                  description: "Personalized instruction tailored to individual student needs.",
                  cta: "Find a Tutor",
                  link: "/find-tutors"
                },
                {
                  title: "Learning Packages",
                  price: "$250-500",
                  unit: "per package",
                  icon: BookText,
                  features: [
                    "8-12 sessions bundled",
                    "Comprehensive subject coverage",
                    "End of term assessments",
                    "Discounted rates"
                  ],
                  description: "Complete learning solutions for students seeking full online education.",
                  cta: "View Packages",
                  link: "/learning-packages",
                  highlighted: true
                },
                {
                  title: "Exam-Prep",
                  price: "$25-60",
                  unit: "per hour",
                  icon: Education,
                  features: [
                    "Targeted test strategies",
                    "Practice exams",
                    "Personalized feedback",
                    "Confidence building"
                  ],
                  description: "Specialized sessions focused on test preparation and exam strategies.",
                  cta: "Prep for Exams",
                  link: "/exam-prep"
                }
              ].map((plan, index) => (
                <Card key={index} className={`border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden relative ${plan.highlighted ? 'border-kidato-orange border-2' : ''}`}>
                  {plan.highlighted && (
                    <div className="bg-kidato-orange text-white text-center py-1.5 text-sm font-medium">
                      Recommended
                    </div>
                  )}
                  <CardHeader className={`text-center pb-0 ${plan.highlighted ? 'pt-6' : 'pt-8'}`}>
                    <div className={`rounded-full mx-auto w-14 h-14 flex items-center justify-center mb-4 ${plan.highlighted ? 'bg-orange-100' : 'bg-blue-100'}`}>
                      <plan.icon className={`h-7 w-7 ${plan.highlighted ? 'text-kidato-orange' : 'text-kidato-blue'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                    <div className="mt-2">
                      <span className={`text-3xl font-bold ${plan.highlighted ? 'text-kidato-orange' : 'text-kidato-blue'}`}>{plan.price}</span>
                      <span className="text-gray-600"> {plan.unit}</span>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className={`h-5 w-5 ${plan.highlighted ? 'text-kidato-orange' : 'text-green-500'} mr-2 flex-shrink-0`} />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-kidato-orange hover:bg-orange-600' : 'bg-kidato-blue hover:bg-kidato-dark-blue'} text-white`}
                    >
                      <Link to={plan.link}>{plan.cta}</Link>
                    </Button>
                  </CardContent>
                  {plan.highlighted && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-kidato-orange text-white py-1 px-3 rounded-bl-lg text-xs font-medium">
                        Best Value
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8 text-gray-600">
              <p>All prices are in USD. Payment plans available for larger packages.</p>
              <div className="flex items-center justify-center mt-4 space-x-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span>Secure payments via credit card, mobile money, or bank transfer</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions from parents like you.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "How are Kidato teachers vetted?",
                  answer: "All teachers undergo a rigorous selection process including background checks, credential verification, teaching demonstrations, and ongoing performance evaluations."
                },
                {
                  question: "What ages/grades do you support?",
                  answer: "We offer tutoring and classes for students ages 5-18, covering primary and secondary education levels across all major African curricula."
                },
                {
                  question: "How do online sessions work?",
                  answer: "Sessions take place on our secure, child-friendly video platform with interactive tools. All you need is a device (computer, tablet, or smartphone) and an internet connection."
                },
                {
                  question: "What if we're not satisfied with a teacher?",
                  answer: "Your satisfaction is guaranteed. If you're not happy with your first session with a new teacher, we'll offer a replacement session with a different teacher at no additional cost."
                },
                {
                  question: "How do I track my child's progress?",
                  answer: "You'll receive detailed progress reports after each session, plus monthly comprehensive assessments. You can also schedule parent-teacher conferences at any time."
                }
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Still have questions? We're here to help.</p>
              <Button variant="outline" className="border-kidato-orange text-kidato-orange hover:bg-orange-50">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-kidato-orange text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">Give Your Child the Learning Support They Deserve</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of parents who trust Kidato to nurture their children's educational journey.
            </p>
            <Button size="lg" className="bg-white text-kidato-orange hover:bg-gray-100">
              <Link to="/parent-signup">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
      <PackageDetailsDialog 
        open={isPackageDialogOpen} 
        onOpenChange={setIsPackageDialogOpen}
        packageDetail={selectedPackage}
      />
    </div>
  );
};

export default ForParents;
