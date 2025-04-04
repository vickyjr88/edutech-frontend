
import { BookOpen, Users, Star, Globe, Award, CheckCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ForStudents = () => {
  const benefits = [
    {
      title: "Learn Your Way",
      description: "Study at your own pace with teachers who understand how you learn best.",
      icon: BookOpen,
    },
    {
      title: "Make New Friends",
      description: "Connect with other students from across Africa in our collaborative group classes.",
      icon: Users,
    },
    {
      title: "Get Better Grades",
      description: "Improve your understanding and performance in school with targeted support.",
      icon: Award,
    },
    {
      title: "Learn From Anywhere",
      description: "Join classes from home, school, or anywhere with an internet connection.",
      icon: Globe,
    }
  ];

  const popularClasses = [
    {
      title: "Math Made Easy",
      subject: "Mathematics",
      level: "Grades 6-8",
      rating: 4.9,
      students: 245,
      image: "https://images.unsplash.com/photo-1596496181848-3091d4878b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      title: "Creative Writing Adventure",
      subject: "English",
      level: "Grades 4-7",
      rating: 4.8,
      students: 187,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Coding for Beginners",
      subject: "Computer Science",
      level: "Ages 10+",
      rating: 5.0,
      students: 164,
      image: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      title: "Science Experiments at Home",
      subject: "Science",
      level: "Grades 3-5",
      rating: 4.7,
      students: 203,
      image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const testimonials = [
    {
      name: "Kwame, 12",
      location: "Ghana",
      testimonial: "I used to struggle with math, but my Kidato teacher makes it fun! Now I understand fractions and can help my friends too.",
      avatar: "https://images.unsplash.com/photo-1595295425345-3917574f45b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Zainab, 15",
      location: "Nigeria",
      testimonial: "I've made friends from different countries in my English class. We practice speaking together and learn about each other's cultures.",
      avatar: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Tariq, 10",
      location: "Kenya",
      testimonial: "Coding class is my favorite! I built my first game and my parents were so impressed. I want to be a programmer when I grow up.",
      avatar: "https://images.unsplash.com/photo-1595295425202-61d18b0d3b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Learning That's Actually Fun!</h1>
              <p className="text-xl mb-8">Join thousands of students across Africa who are making friends, building confidence, and improving their grades with Kidato.</p>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Link to="/student-signup">Join Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/student-classes">See Classes</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Why Students Love Kidato</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform is designed to make learning enjoyable and effective for students like you.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Popular Classes Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Popular Classes You'll Love</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Join fun, interactive classes with amazing teachers and students from all over Africa.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popularClasses.map((classItem, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200">
                  <div className="relative h-48">
                    {classItem.featured && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-green-500 text-white">Popular</Badge>
                      </div>
                    )}
                    <img 
                      src={classItem.image} 
                      alt={classItem.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-green-600">{classItem.subject}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{classItem.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{classItem.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{classItem.level}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{classItem.students} students</span>
                      </div>
                      <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <Link to="/class-details">Learn More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link to="/all-classes">Browse All Classes</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How Kidato Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Getting started is easy! Here's what to expect when you join.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Create Your Account",
                  description: "Sign up with your parent's help and set up your student profile."
                },
                {
                  step: "2",
                  title: "Join Your First Class",
                  description: "Pick a class or teacher that interests you and book your spot."
                },
                {
                  step: "3",
                  title: "Learn and Have Fun",
                  description: "Attend interactive online sessions and track your progress as you improve!"
                }
              ].map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* What You'll Need Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll Need to Get Started</h2>
                <ul className="space-y-4">
                  {[
                    "Computer, tablet, or smartphone",
                    "Internet connection",
                    "Quiet place to learn",
                    "Notebook and pencil",
                    "Parent's permission",
                    "Curiosity and enthusiasm!"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    <Link to="/student-signup">Join Kidato Today</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-2/5">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="text-center mb-6">
                    <Monitor className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-gray-900">Your First Class is Free!</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Try any class with no commitment. If you enjoy it, you can sign up for more sessions!
                  </p>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Student Safety Promise</h4>
                    <p className="text-sm text-gray-700">
                      All classes are monitored and taught by verified teachers in a secure online environment. Your safety is our top priority.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Student Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Students Like You Say</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from other students about their experiences with Kidato.
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
                        className="h-14 w-14 rounded-full mr-4 object-cover" 
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-green-600">{testimonial.location}</p>
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
        
        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Questions Students Ask</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Answers to common questions that students have about Kidato.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {[
                {
                  question: "Will classes help with my school work?",
                  answer: "Yes! Our teachers design classes to support what you're learning in school. We can help you understand difficult topics, prepare for exams, and complete assignments with confidence."
                },
                {
                  question: "What if I miss a class?",
                  answer: "Don't worry! Many classes are recorded so you can watch them later. If you know you'll miss a class, just let your teacher know in advance."
                },
                {
                  question: "Do I need to turn on my camera?",
                  answer: "We encourage students to turn on their cameras during class to create a more interactive learning environment, but we understand if you're not comfortable. Talk to your teacher about options."
                },
                {
                  question: "Can I take classes with my friends?",
                  answer: "Absolutely! You can invite friends to join your class or sign up for the same group sessions together. Learning with friends can make the experience even more fun."
                }
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Learning Fun?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of students who are learning, making friends, and having fun with Kidato!
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Link to="/student-signup">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
