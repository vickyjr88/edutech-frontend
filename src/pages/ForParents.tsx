
import { useState } from "react";
import { Check, Shield, Star, Clock, Users, BookOpen, GraduationCap, CreditCard, BookText, Award, PieChart, Medal, Brain, FileText, BarChart, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CurriculumGradeFilter from "@/components/courses/CurriculumGradeFilter";
import PackageDetailsDialog from "@/components/courses/PackageDetailsDialog";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const ForParents = () => {
  const { content, loading, error } = useContent<PageContent>('pages/for-parents.json');

  // State hooks - must be declared before any conditional returns
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // Icon mapping
  const iconMap: Record<string, any> = {
    GraduationCap,
    Shield,
    Users,
    Clock,
    BookOpen,
    BookText,
    CreditCard,
    BookOpenCheck,
    FileText,
    Star
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kidato-orange"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // Extract sections
  const heroSection = content?.sections.find(s => s.type === 'hero');
  const benefitsSection = content?.sections.find(s => s.type === 'benefits');
  const howItWorksSection = content?.sections.find(s => s.type === 'howItWorks');
  const packagesSection = content?.sections.find(s => s.type === 'contentCards' && s.title?.includes('Popular Learning Packages'));
  const testimonialsSection = content?.sections.find(s => s.type === 'testimonials');
  const pricingSection = content?.sections.find(s => s.type === 'pricing');
  const faqSection = content?.sections.find(s => s.type === 'faq');
  const ctaSection = content?.sections.find(s => s.type === 'cta');

  // Map benefits with icons
  const benefits = benefitsSection?.type === 'benefits' ? benefitsSection.benefits.map(benefit => ({
    ...benefit,
    icon: iconMap[benefit.icon] || GraduationCap
  })) : [];

  const handleFilterChange = (curriculum: string, grade: string) => {
    setSelectedCurriculum(curriculum);
    setSelectedGrade(grade);
  };

  const openPackageDetails = (packageData: any) => {
    setSelectedPackage(packageData);
    setIsPackageDialogOpen(true);
  };

  // Extract curriculum packages from JSON
  const curriculumPackages = (content as any)?.curriculumPackages || {};

  // Create packageDetailsData from JSON
  const packageDetailsData: Record<string, any> = {};
  Object.keys(curriculumPackages).forEach(curriculumType => {
    if (curriculumPackages[curriculumType] && Array.isArray(curriculumPackages[curriculumType])) {
      curriculumPackages[curriculumType].forEach((pkg: any) => {
        packageDetailsData[pkg.id] = pkg;
      });
    }
  });

  // Extract popular packages from JSON
  const popularPackages = packagesSection?.type === 'contentCards' ? packagesSection.cards : [];

  const getFilteredPackages = () => {
    if (!selectedCurriculum && !selectedGrade) {
      return popularPackages;
    }

    return popularPackages.filter((subject: any) => {
      const matchesCurriculum = !selectedCurriculum || subject.curriculum === selectedCurriculum;
      const matchesGrade = !selectedGrade || subject.grade === selectedGrade;
      return matchesCurriculum && matchesGrade;
    });
  };

  // Extract testimonials from JSON
  const testimonials = testimonialsSection?.type === 'testimonials' ? testimonialsSection.testimonials : [];

  // Extract how it works steps
  const steps = howItWorksSection?.type === 'howItWorks' ? howItWorksSection.steps : [];

  // Extract pricing tiers
  const pricingTiers = pricingSection?.type === 'pricing' ? pricingSection.tiers.map(tier => ({
    ...tier,
    icon: iconMap[tier.icon as string] || Users
  })) : [];

  // Extract FAQs
  const faqs = faqSection?.type === 'faq' ? faqSection.questions : [];

  // Helper functions
  const getCurriculumIcon = (curriculum: string) => {
    switch(curriculum) {
      case "igcse": return BookOpenCheck;
      case "ib": return GraduationCap;
      case "american": return FileText;
      case "british": return BookOpen;
      case "kenyan": return BookText;
      default: return BookText;
    }
  };

  const getSubjectCount = (id: string) => {
    if (packageDetailsData[id]) {
      return packageDetailsData[id].subjects.length;
    }
    return 5;
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case "Primary": return "text-green-700";
      case "Secondary": return "text-blue-700";
      default: return "text-gray-700";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="bg-gradient-to-r from-kidato-orange to-orange-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {heroSection?.type === 'hero' ? heroSection.title : 'Unlock Your Child\'s Potential with Personalized Learning'}
              </h1>
              <p className="text-xl mb-8">
                {heroSection?.type === 'hero' ? heroSection.subtitle : 'Trusted by thousands of parents across Africa to provide quality, accessible education that fits your family\'s needs.'}
              </p>
              <div className="space-x-4">
                <Button size="lg" className="bg-white text-kidato-orange hover:bg-gray-100">
                  <Link to="/find-tutors">
                    {heroSection?.type === 'hero' && heroSection.primaryCTA ? heroSection.primaryCTA.text : 'Find a Tutor'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/explore-classes">
                    {heroSection?.type === 'hero' && heroSection.secondaryCTA ? heroSection.secondaryCTA.text : 'Explore Classes'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                {benefitsSection?.type === 'benefits' ? benefitsSection.title : 'Why Parents Choose Kidato'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {benefitsSection?.type === 'benefits' ? benefitsSection.subtitle : 'We partner with you to support your child\'s educational journey in a safe, engaging environment.'}
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
              <h2 className="text-3xl font-bold text-gray-900">
                {howItWorksSection?.type === 'howItWorks' ? howItWorksSection.title : 'How Kidato Works for Your Family'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {howItWorksSection?.type === 'howItWorks' ? howItWorksSection.subtitle : 'Getting started is simple - we\'ll guide you through every step.'}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center">
                  <div className="bg-kidato-orange text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step || index + 1}
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
              <h2 className="text-3xl font-bold text-gray-900">
                {packagesSection?.type === 'contentCards' ? packagesSection.title : 'Popular Learning Packages'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {packagesSection?.type === 'contentCards' ? packagesSection.subtitle : 'Find the perfect full home learning package for your child based on their curriculum and grade level.'}
              </p>
            </div>

            <CurriculumGradeFilter onFilterChange={handleFilterChange} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredPackages().map((subject, index) => {
                const CurriculumIcon = getCurriculumIcon(subject.curriculum);
                const subjectCount = getSubjectCount(subject.id);
                const levelClass = getLevelColor(subject.level);

                return (
                  <Card
                    key={index}
                    className="border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <div className={`absolute top-0 right-0 z-10 ${
                        subject.popularity === "Most Popular" ? "bg-kidato-orange" :
                        subject.popularity === "Trending" ? "bg-pink-500" :
                        subject.popularity === "Essential" ? "bg-amber-500" :
                        subject.popularity === "Growing" ? "bg-green-500" :
                        subject.popularity === "Recommended" ? "bg-purple-500" :
                        subject.popularity === "Important" ? "bg-indigo-500" :
                        subject.popularity === "New" ? "bg-teal-500" :
                        "bg-blue-500"
                      } text-white py-1 px-3 rounded-bl-lg text-xs font-medium`}>
                        {subject.popularity}
                      </div>
                      <div className={`h-1.5 w-full ${
                        subject.curriculum === "igcse" ? "bg-indigo-500" :
                        subject.curriculum === "ib" ? "bg-sky-500" :
                        subject.curriculum === "american" ? "bg-rose-500" :
                        subject.curriculum === "british" ? "bg-emerald-500" :
                        "bg-amber-500"
                      }`}></div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={`rounded-full p-2 mr-3 ${
                              subject.curriculum === "igcse" ? "bg-indigo-100 text-indigo-600" :
                              subject.curriculum === "ib" ? "bg-sky-100 text-sky-600" :
                              subject.curriculum === "american" ? "bg-rose-100 text-rose-600" :
                              subject.curriculum === "british" ? "bg-emerald-100 text-emerald-600" :
                              "bg-amber-100 text-amber-600"
                            }`}>
                              <CurriculumIcon className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{subject.name}</h3>
                          </div>
                          <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${levelClass} flex items-center`}>
                              {subject.level === "Primary" ? (
                                <BookOpen className={`h-4 w-4 mr-1 ${levelClass}`} />
                              ) : (
                                <GraduationCap className={`h-4 w-4 mr-1 ${levelClass}`} />
                              )}
                              {subject.level}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-600 flex items-center">
                              <BookText className="h-4 w-4 mr-1 text-gray-500" />
                              {subjectCount} Subjects
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-6">{subject.description}</p>

                      <div className="mt-2 flex flex-col space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Curriculum-aligned content</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Regular assessments</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>Learning materials included</span>
                        </div>
                      </div>

                      <Button
                        className="w-full mt-6 bg-white border-2 border-kidato-orange text-kidato-orange hover:bg-orange-50 group-hover:bg-kidato-orange group-hover:text-white transition-colors"
                        onClick={() => openPackageDetails(packageDetailsData[subject.id] || {
                          id: subject.id,
                          name: subject.name,
                          curriculum: subject.curriculum,
                          grade: subject.grade,
                          subjects: ["Mathematics", "English", "Science", "Social Studies", "Arts"],
                          hasCheckpoint: subject.grade === "6" || subject.grade === "9" || subject.grade === "3",
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
                        <span>View Details</span>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 bg-kidato-light-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                {testimonialsSection?.type === 'testimonials' ? testimonialsSection.title : 'What Parents Are Saying'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {testimonialsSection?.type === 'testimonials' ? testimonialsSection.subtitle : 'Join families who have seen real academic growth and increased confidence in their children.'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial: any, index: number) => (
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
                        <p className="text-xs text-kidato-purple">{testimonial.childAge}</p>
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
              <h2 className="text-3xl font-bold text-gray-900">
                {pricingSection?.type === 'pricing' ? pricingSection.title : 'Affordable Learning Options'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {pricingSection?.type === 'pricing' ? pricingSection.subtitle : 'Quality education that fits your budget with transparent, flexible pricing.'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {pricingTiers.map((plan: any, index: number) => (
                <Card key={index} className={`border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden relative ${plan.highlighted ? 'border-kidato-orange border-2' : ''}`}>
                  {plan.highlighted && (
                    <div className="bg-kidato-orange text-white text-center py-1.5 text-sm font-medium">
                      Recommended
                    </div>
                  )}
                  <CardHeader className={`text-center pb-0 ${plan.highlighted ? 'pt-6' : 'pt-8'}`}>
                    <div className={`rounded-full mx-auto w-14 h-14 flex items-center justify-center mb-4 ${plan.highlighted ? 'bg-orange-100' : 'bg-blue-100'}`}>
                      <plan.icon className={`h-7 w-7 ${plan.highlighted ? 'text-kidato-orange' : 'text-kidato-purple'}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                    <div className="mt-2">
                      <span className={`text-3xl font-bold ${plan.highlighted ? 'text-kidato-orange' : 'text-kidato-purple'}`}>{plan.price}</span>
                      <span className="text-gray-600"> {plan.unit}</span>
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {plan.features?.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <Check className={`h-5 w-5 ${plan.highlighted ? 'text-kidato-orange' : 'text-green-500'} mr-2 flex-shrink-0`} />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.highlighted ? 'bg-kidato-orange hover:bg-orange-600' : 'bg-kidato-purple hover:bg-kidato-dark-blue'} text-white`}
                    >
                      <Link to={plan.link || '#'}>{plan.cta}</Link>
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
              <h2 className="text-3xl font-bold text-gray-900">
                {faqSection?.type === 'faq' ? faqSection.title : 'Frequently Asked Questions'}
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                {faqSection?.type === 'faq' ? faqSection.subtitle : 'Get answers to common questions from parents like you.'}
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-gray-200">
              {faqs.map((faq: any, index: number) => (
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
            <h2 className="text-3xl font-bold mb-6">
              {ctaSection?.type === 'cta' ? ctaSection.title : 'Give Your Child the Learning Support They Deserve'}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {ctaSection?.type === 'cta' ? ctaSection.description : 'Join thousands of parents who trust Kidato to nurture their children\'s educational journey.'}
            </p>
            <Button size="lg" className="bg-white text-kidato-orange hover:bg-gray-100">
              <Link to="/parent-signup">
                {ctaSection?.type === 'cta' && ctaSection.primaryCTA ? ctaSection.primaryCTA.text : 'Create Free Account'}
              </Link>
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
