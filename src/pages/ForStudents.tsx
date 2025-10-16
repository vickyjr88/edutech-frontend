
import { BookOpen, Users, Star, Globe, Award, CheckCircle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const ForStudents = () => {
  const { content, loading, error } = useContent<PageContent>('pages/for-students.json');

  // Default benefits for fallback
  // Icon mapping for dynamic icons from JSON
  const iconMap: Record<string, any> = {
    BookOpen,
    Users,
    Award,
    Globe,
    Star,
    CheckCircle,
    Monitor
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-purple"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract sections from content (with defaults for error case)
  const heroSection = content?.sections.find(s => s.type === 'hero');
  const benefitsSection = content?.sections.find(s => s.type === 'benefits');
  const classesSection = content?.sections.find(s => s.type === 'contentCards' && s.title === 'Popular Classes You\'ll Love');
  const howItWorksSection = content?.sections.find(s => s.type === 'howItWorks');
  const requirementsSection = content?.sections.find(s => s.type === 'contentCards' && s.title === 'What You\'ll Need to Get Started');
  const freeTrialSection = content?.sections.find(s => s.type === 'contentCards' && s.title === 'Your First Class is Free!');
  const testimonialsSection = content?.sections.find(s => s.type === 'testimonials');
  const faqSection = content?.sections.find(s => s.type === 'faq');
  const ctaSection = content?.sections.find(s => s.type === 'cta');

  // Extract benefit cards with icon mapping
  const benefits = benefitsSection?.type === 'benefits' ? benefitsSection.benefits.map(benefit => ({
    ...benefit,
    icon: iconMap[benefit.icon] || BookOpen
  })) : [];

  const popularClasses = classesSection?.type === 'contentCards' ? classesSection.cards : [];
  const requirements = requirementsSection?.type === 'contentCards' && requirementsSection.cards[0]?.tags ? requirementsSection.cards[0].tags : ['Computer, tablet, or smartphone', 'Internet connection', 'Quiet place to learn', 'Notebook and pencil', 'Parent\'s permission', 'Curiosity and enthusiasm!'];
  const freeTrialCard = requirementsSection?.type === 'contentCards' ? requirementsSection.cards.find(c => c.id === 'free-trial') : null;
  const safetyPromiseCard = requirementsSection?.type === 'contentCards' ? requirementsSection.cards.find(c => c.id === 'safety-promise') : null;
  const testimonials = testimonialsSection?.type === 'testimonials' ? testimonialsSection.testimonials : [];
  const faqs = faqSection?.type === 'faq' ? faqSection.faqs : [];
  const howItWorksSteps = howItWorksSection?.type === 'howItWorks' ? howItWorksSection.steps : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-kidato-purple to-kidato-dark-blue text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {heroSection?.type === 'hero' ? heroSection.title : 'Learning That\'s Actually Fun!'}
              </h1>
              <p className="text-xl mb-8">
                {heroSection?.type === 'hero' ? heroSection.subtitle : 'Join thousands of students across Africa who are making friends, building confidence, and improving their grades with Kidato.'}
              </p>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-kidato-purple hover:bg-gray-100">
                  <Link to={heroSection?.type === 'hero' && heroSection.primaryCTA ? heroSection.primaryCTA.href : '/student-signup'}>
                    {heroSection?.type === 'hero' && heroSection.primaryCTA ? heroSection.primaryCTA.text : 'Join Now'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to={heroSection?.type === 'hero' && heroSection.secondaryCTA ? heroSection.secondaryCTA.href : '/student-classes'}>
                    {heroSection?.type === 'hero' && heroSection.secondaryCTA ? heroSection.secondaryCTA.text : 'See Classes'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                {benefitsSection?.type === 'benefits' ? benefitsSection.title : 'Why Students Love Kidato'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {benefitsSection?.type === 'benefits' ? benefitsSection.subtitle : 'Our platform is designed to make learning enjoyable and effective for students like you.'}
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-kidato-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-kidato-purple" />
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
              <h2 className="text-3xl font-bold text-gray-900">
                {classesSection?.type === 'contentCards' ? classesSection.title : 'Popular Classes You\'ll Love'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {classesSection?.type === 'contentCards' ? classesSection.subtitle : 'Join fun, interactive classes with amazing teachers and students from all over Africa.'}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popularClasses.map((classItem, index) => {
                // Parse tags array for display data
                const subject = classItem.tags?.[0] || classItem.subject || '';
                const rating = classItem.tags?.[1] || classItem.rating || '5.0';
                const students = classItem.tags?.[2] || (classItem.students ? `${classItem.students} students` : '');
                const isPopular = classItem.tags?.[3] === 'Popular' || classItem.featured;

                return (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200">
                    <div className="relative h-48">
                      {isPopular && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge className="bg-kidato-orange text-white">Popular</Badge>
                        </div>
                      )}
                      <img
                        src={classItem.image?.src || classItem.image}
                        alt={classItem.image?.alt || classItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-medium text-kidato-purple">{subject}</p>
                          <h3 className="text-lg font-semibold text-gray-900">{classItem.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{classItem.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{students}</span>
                        </div>
                        <Button variant="outline" className="text-kidato-purple border-kidato-purple hover:bg-kidato-light-blue">
                          <Link to={classItem.link?.href || '/class-details'}>
                            {classItem.link?.text || 'Learn More'}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-10">
              <Button size="lg" className="bg-kidato-purple hover:bg-kidato-dark-blue text-white">
                <Link to="/all-classes">Browse All Classes</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                {howItWorksSection?.type === 'howItWorks' ? howItWorksSection.title : 'How Kidato Works'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {howItWorksSection?.type === 'howItWorks' ? howItWorksSection.subtitle : 'Getting started is easy! Here\'s what to expect when you join.'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="bg-kidato-orange text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* What You'll Need Section */}
        <section className="py-16 bg-kidato-light-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {requirementsSection?.type === 'contentCards' ? requirementsSection.title : 'What You\'ll Need to Get Started'}
                </h2>
                <ul className="space-y-4">
                  {requirements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-kidato-purple mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button size="lg" className="bg-kidato-purple hover:bg-kidato-dark-blue text-white">
                    <Link to="/student-signup">Join Kidato Today</Link>
                  </Button>
                </div>
              </div>

              <div className="md:w-2/5">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="text-center mb-6">
                    <Monitor className="h-12 w-12 text-kidato-purple mx-auto mb-2" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {freeTrialCard?.title || 'Your First Class is Free!'}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {freeTrialCard?.description || 'Try any class with no commitment. If you enjoy it, you can sign up for more sessions!'}
                  </p>
                  <div className="bg-kidato-light-blue p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {safetyPromiseCard?.title || 'Student Safety Promise'}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {safetyPromiseCard?.description || 'All classes are monitored and taught by verified teachers in a secure online environment. Your safety is our top priority.'}
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
              <h2 className="text-3xl font-bold text-gray-900">
                {testimonialsSection?.type === 'testimonials' ? testimonialsSection.title : 'What Students Like You Say'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {testimonialsSection?.type === 'testimonials' ? testimonialsSection.subtitle : 'Hear from other students about their experiences with Kidato.'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={testimonial.avatar?.src || testimonial.avatar}
                        alt={testimonial.avatar?.alt || testimonial.name}
                        className="h-14 w-14 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-kidato-purple">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.content || testimonial.testimonial}"</p>
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
              <h2 className="text-3xl font-bold text-gray-900">
                {faqSection?.type === 'faq' ? faqSection.title : 'Questions Students Ask'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {faqSection?.type === 'faq' ? faqSection.subtitle : 'Answers to common questions that students have about Kidato.'}
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-kidato-purple text-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6">
              {ctaSection?.type === 'cta' ? ctaSection.title : 'Ready to Make Learning Fun?'}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {ctaSection?.type === 'cta' ? ctaSection.description : 'Join thousands of students who are learning, making friends, and having fun with Kidato!'}
            </p>
            <Button size="lg" className="bg-white text-kidato-purple hover:bg-gray-100">
              <Link to={ctaSection?.type === 'cta' && ctaSection.primaryCTA ? ctaSection.primaryCTA.href : '/student-signup'}>
                {ctaSection?.type === 'cta' && ctaSection.primaryCTA ? ctaSection.primaryCTA.text : 'Get Started Today'}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForStudents;
