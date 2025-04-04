
import { BookOpen, Users, Search, Calendar, Monitor, CreditCard, MessageCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-kidato-blue to-blue-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How Kidato Works</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Discover how our platform connects students with quality educators across Africa in a safe, accessible online environment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
                <Link to="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">Ask Questions</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Platform Overview */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Online Learning Platform</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Kidato provides a comprehensive ecosystem that makes quality education accessible across Africa.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Live Interactive Classes",
                  description: "Real-time video sessions with teachers who engage directly with students, allowing for immediate feedback and personalized instruction.",
                  icon: Monitor,
                  color: "bg-blue-100",
                  iconColor: "text-kidato-blue"
                },
                {
                  title: "Verified Quality Teachers",
                  description: "All educators undergo thorough vetting, including background checks, credential verification, and teaching demonstrations.",
                  icon: CheckCircle,
                  color: "bg-green-100",
                  iconColor: "text-green-600"
                },
                {
                  title: "Safe Learning Environment",
                  description: "Our platform is designed with child safety as the priority, including monitored sessions and secure communication channels.",
                  icon: Users,
                  color: "bg-orange-100",
                  iconColor: "text-kidato-orange"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className={`${item.color} rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Process Flows for Different Users */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works For Everyone</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're a student, parent, or teacher, Kidato makes education accessible and straightforward.
              </p>
            </div>
            
            <Tabs defaultValue="parents" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="parents">For Parents</TabsTrigger>
                <TabsTrigger value="students">For Students</TabsTrigger>
                <TabsTrigger value="teachers">For Teachers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="parents">
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    {
                      step: "1",
                      title: "Create Account",
                      description: "Register and set up your family profile with your children's information."
                    },
                    {
                      step: "2",
                      title: "Find Classes or Tutors",
                      description: "Browse available options or receive personalized recommendations."
                    },
                    {
                      step: "3",
                      title: "Schedule & Payment",
                      description: "Book sessions and complete secure payment through our platform."
                    },
                    {
                      step: "4",
                      title: "Track Progress",
                      description: "Monitor your child's attendance and receive regular progress reports."
                    }
                  ].map((step, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="pt-6">
                        <div className="bg-kidato-orange text-white rounded-full w-10 h-10 flex items-center justify-center mb-4 font-bold">
                          {step.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button className="bg-kidato-orange hover:bg-orange-600 text-white">
                    <Link to="/parent-signup">Get Started as a Parent</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="students">
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    {
                      step: "1",
                      title: "Join with Parent",
                      description: "Create your student profile with your parent's help."
                    },
                    {
                      step: "2",
                      title: "Choose Classes",
                      description: "Pick subjects and teachers that interest you from our catalog."
                    },
                    {
                      step: "3",
                      title: "Attend Sessions",
                      description: "Join interactive online classes from your device at scheduled times."
                    },
                    {
                      step: "4",
                      title: "Learn & Grow",
                      description: "Complete assignments, track your progress, and see yourself improve!"
                    }
                  ].map((step, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="pt-6">
                        <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mb-4 font-bold">
                          {step.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Link to="/student-signup">Get Started as a Student</Link>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="teachers">
                <div className="grid gap-6 md:grid-cols-4">
                  {[
                    {
                      step: "1",
                      title: "Apply",
                      description: "Submit your application with qualifications and teaching experience."
                    },
                    {
                      step: "2",
                      title: "Verification",
                      description: "Complete background checks and teaching demonstration."
                    },
                    {
                      step: "3",
                      title: "Set Up Profile",
                      description: "Create your teacher profile and set your availability and rates."
                    },
                    {
                      step: "4",
                      title: "Teach & Earn",
                      description: "Start teaching students and receive secure payments through the platform."
                    }
                  ].map((step, index) => (
                    <Card key={index} className="border-gray-200">
                      <CardContent className="pt-6">
                        <div className="bg-kidato-blue text-white rounded-full w-10 h-10 flex items-center justify-center mb-4 font-bold">
                          {step.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button className="bg-kidato-blue hover:bg-kidato-dark-blue text-white">
                    <Link to="/teacher-signup">Apply as a Teacher</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Key Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Key Features That Make Us Different</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the tools and systems that make Kidato a unique educational platform in Africa.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Interactive Learning Tools",
                  description: "Our platform includes virtual whiteboards, screen sharing, collaborative documents, and interactive quizzes for engaging learning experiences.",
                  icon: BookOpen
                },
                {
                  title: "Flexible Class Formats",
                  description: "Choose from one-on-one tutoring, small group classes, or recorded sessions to fit your learning style and schedule.",
                  icon: Users
                },
                {
                  title: "Smart Matching System",
                  description: "Our algorithm recommends teachers based on your learning needs, goals, and preferences for the perfect educational fit.",
                  icon: Search
                },
                {
                  title: "Integrated Scheduling",
                  description: "Easily book sessions across time zones with automatic reminders and calendar integration for students and teachers.",
                  icon: Calendar
                },
                {
                  title: "Secure Messaging",
                  description: "Safe, monitored communication channels between students, parents, and teachers for questions and feedback.",
                  icon: MessageCircle
                },
                {
                  title: "Transparent Payments",
                  description: "Simple, secure payment processing with multiple options including mobile money for accessibility across Africa.",
                  icon: CreditCard
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-kidato-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-kidato-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Technology & Security */}
        <section className="py-16 bg-kidato-light-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology & Security</h2>
                <p className="text-gray-700 mb-6">
                  We've built Kidato with industry-leading technology that works even in areas with limited internet connectivity, and security measures that ensure a safe learning environment for everyone.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Bandwidth Optimization</h3>
                    <p className="text-gray-600">
                      Our platform is optimized to work on connections as low as 1 Mbps, ensuring accessibility across diverse infrastructure conditions.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">End-to-End Encryption</h3>
                    <p className="text-gray-600">
                      All communication and sessions are secured with enterprise-grade encryption to protect privacy and data.
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Monitoring</h3>
                    <p className="text-gray-600">
                      Our safety team conducts random session reviews and provides tools for parents to monitor their children's learning activities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/5">
                <img 
                  src="https://images.unsplash.com/photo-1581092921461-39b9d903fb01?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Technology showcase" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about how our platform works.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "What equipment do students need?",
                  answer: "Students need a computer, tablet, or smartphone with internet access. A quiet learning space and basic supplies like notebooks and pencils are also recommended. Our platform is optimized to work on various devices and internet speeds."
                },
                {
                  question: "How are payments processed?",
                  answer: "We offer multiple secure payment options including credit/debit cards, mobile money (M-Pesa, MTN Money, etc.), and bank transfers. Parents can pay per session or purchase discounted class packages."
                },
                {
                  question: "What happens if a session is missed?",
                  answer: "If a student misses a session, we have a 24-hour cancellation policy. Sessions cancelled with less than 24 hours notice may be subject to a fee. If a teacher cancels, the session will be rescheduled or refunded at the parent's preference."
                },
                {
                  question: "Are teachers qualified?",
                  answer: "Yes, all teachers undergo a rigorous vetting process including qualification verification, background checks, and teaching demonstrations. We only approve approximately 15% of teacher applicants to ensure quality."
                },
                {
                  question: "How do you ensure online safety?",
                  answer: "We use encrypted connections, monitor sessions, restrict private communications, and provide comprehensive safety training for all teachers. Parents can also access session recordings for added peace of mind."
                }
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">Still have questions? Our support team is here to help.</p>
              <Button className="bg-kidato-blue hover:bg-kidato-dark-blue text-white">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-kidato-blue to-blue-700 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience Quality Education?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our growing community of students, parents, and teachers who are transforming education across Africa.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/find-tutors">Browse Teachers</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
