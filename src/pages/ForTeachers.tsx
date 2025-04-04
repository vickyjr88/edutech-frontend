
import { BookOpen, DollarSign, Clock, Calendar, ShieldCheck, Award, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForTeachers = () => {
  const benefits = [
    {
      title: "Flexible Teaching",
      description: "Set your own hours and teach from anywhere with our easy-to-use online platform.",
      icon: Clock,
    },
    {
      title: "Competitive Income",
      description: "Earn reliable income with our competitive rates and regular payment schedule.",
      icon: DollarSign,
    },
    {
      title: "Verified Students",
      description: "Teach verified students in a safe online environment designed with mutual trust in mind.",
      icon: ShieldCheck,
    },
    {
      title: "Growth Opportunities",
      description: "Enhance your teaching skills and grow your career with our professional development resources.",
      icon: Award,
    },
    {
      title: "Simple Scheduling",
      description: "Our intuitive calendar system makes managing your teaching schedule effortless.",
      icon: Calendar,
    },
    {
      title: "Secure Payments",
      description: "Get paid on time, every time with our secure and reliable payment system.",
      icon: CreditCard,
    }
  ];

  const testimonials = [
    {
      name: "Grace Muthoni",
      subject: "Mathematics Teacher",
      testimonial: "Joining Kidato has transformed my teaching career. I can now reach students across Africa while earning a reliable income on my own schedule.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Daniel Okonkwo",
      subject: "Science Educator",
      testimonial: "As a teacher on Kidato, I've found a supportive community that values quality education. The platform is intuitive and the students are motivated to learn.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      name: "Fatima Abdullahi",
      subject: "Language Arts Instructor",
      testimonial: "The flexibility Kidato offers has allowed me to balance my passion for teaching with my family responsibilities. It's truly the best of both worlds.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-kidato-blue to-kidato-dark-blue text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Share Your Knowledge, Inspire the Next Generation</h1>
              <p className="text-xl mb-8">Join our community of passionate educators making quality education accessible across Africa.</p>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
                  <Link to="/teacher-signup">Apply to Teach</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/teacher-requirements">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Teach with Kidato?</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform offers the perfect environment for passionate educators to thrive.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-kidato-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-kidato-blue" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* How to Join Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How to Join Our Teaching Community</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Four simple steps to start your teaching journey with Kidato.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Apply",
                  description: "Complete our simple online application form with your qualifications and expertise."
                },
                {
                  step: "2",
                  title: "Interview",
                  description: "Meet with our team to discuss your teaching approach and experience."
                },
                {
                  step: "3",
                  title: "Training",
                  description: "Learn how to use our platform effectively in our online onboarding sessions."
                },
                {
                  step: "4",
                  title: "Start Teaching",
                  description: "Set up your profile, create your schedule, and welcome your first students!"
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
              <Button size="lg" className="bg-kidato-blue hover:bg-kidato-dark-blue">
                <Link to="/teacher-signup">Start Your Application</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Teacher Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Hear From Our Teachers</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how Kidato has helped educators across Africa pursue their passion for teaching.
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
                        <p className="text-sm text-kidato-blue">{testimonial.subject}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.testimonial}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Requirements Section */}
        <section className="py-16 bg-kidato-light-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Look For</h2>
                <ul className="space-y-4">
                  {[
                    "Teaching qualification or relevant degree",
                    "At least 2 years of teaching experience",
                    "Passion for education and working with young learners",
                    "Strong communication skills",
                    "Reliable internet connection and computer",
                    "Commitment to professional growth"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <BookOpen className="h-6 w-6 text-kidato-blue mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button size="lg" className="bg-kidato-orange hover:bg-orange-600 text-white">
                    <Link to="/teacher-signup">Apply Now</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-2/5">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Earning Potential</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">One-on-One Sessions</h4>
                        <p className="text-2xl font-bold text-kidato-blue">$15-30<span className="text-base font-normal text-gray-600">/hour</span></p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Small Group Classes</h4>
                        <p className="text-2xl font-bold text-kidato-blue">$25-45<span className="text-base font-normal text-gray-600">/hour</span></p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Course Creation</h4>
                        <p className="text-2xl font-bold text-kidato-blue">$100-300<span className="text-base font-normal text-gray-600">/course</span></p>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Rates vary based on subject, experience level, and class size. Top teachers on our platform earn $1,500+ monthly.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-kidato-blue text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform African Education?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our teaching community today and help shape the future of thousands of African students.
            </p>
            <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
              <Link to="/teacher-signup">Start Your Teaching Journey</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForTeachers;
