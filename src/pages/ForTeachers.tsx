
import { BookOpen, DollarSign, Clock, Calendar, ShieldCheck, Award, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/teachers/HeroSection";
import BenefitsSection from "@/components/teachers/BenefitsSection";
import JoinStepsSection from "@/components/teachers/JoinStepsSection";
import TestimonialsSection from "@/components/teachers/TestimonialsSection";
import RequirementsSection from "@/components/teachers/RequirementsSection";
import CTASection from "@/components/common/CTASection";
import EarningsCalculator from "@/components/teachers/EarningsCalculator";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const ForTeachers = () => {
  const { content, loading, error } = useContent<PageContent>('pages/for-teachers.json');

  // Icon mapping for dynamic icons
  const iconMap: Record<string, any> = {
    BookOpen,
    DollarSign,
    Clock,
    Calendar,
    ShieldCheck,
    Award,
    CreditCard
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

  // Extract sections from content
  const heroSection = content?.sections.find(s => s.type === 'hero');
  const benefitsSection = content?.sections.find(s => s.type === 'benefits');
  const howItWorksSection = content?.sections.find(s => s.type === 'howItWorks');
  const testimonialsSection = content?.sections.find(s => s.type === 'testimonials');
  const requirementsSection = content?.sections.find(s => s.type === 'contentCards' && s.title === 'Teacher Requirements');
  const pricingSection = content?.sections.find(s => s.type === 'pricing');
  const ctaSection = content?.sections.find(s => s.type === 'cta');

  // Map benefits with icons
  const benefits = benefitsSection?.type === 'benefits' ? benefitsSection.benefits.map(benefit => ({
    ...benefit,
    icon: iconMap[benefit.icon] || BookOpen
  })) : [];

  // Extract data arrays
  const testimonials = testimonialsSection?.type === 'testimonials' ? testimonialsSection.testimonials : [];
  const steps = howItWorksSection?.type === 'howItWorks' ? howItWorksSection.steps : [];
  const requirements = requirementsSection?.type === 'contentCards' && requirementsSection.cards[0]?.tags ? requirementsSection.cards[0].tags : [];
  const earningOptions = pricingSection?.type === 'pricing' ? pricingSection.tiers : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection
          title={heroSection?.type === 'hero' ? heroSection.title : 'Share Your Knowledge, Inspire the Next Generation'}
          description={heroSection?.type === 'hero' ? heroSection.subtitle : 'Join our community of passionate educators making quality education accessible across Africa.'}
          primaryButtonText={heroSection?.type === 'hero' && heroSection.primaryCTA ? heroSection.primaryCTA.text : 'View Pricing'}
          primaryButtonLink={heroSection?.type === 'hero' && heroSection.primaryCTA ? heroSection.primaryCTA.href : '/teacher-pricing'}
          secondaryButtonText={heroSection?.type === 'hero' && heroSection.secondaryCTA ? heroSection.secondaryCTA.text : 'Learn More'}
          secondaryButtonLink={heroSection?.type === 'hero' && heroSection.secondaryCTA ? heroSection.secondaryCTA.href : '/teacher-pricing'}
        />

        <BenefitsSection
          title={benefitsSection?.type === 'benefits' ? benefitsSection.title : 'Why Teach with Kidato?'}
          subtitle={benefitsSection?.type === 'benefits' ? benefitsSection.subtitle : 'Our platform offers the perfect environment for passionate educators to thrive.'}
          benefits={benefits}
        />

        <EarningsCalculator />

        <JoinStepsSection
          title={howItWorksSection?.type === 'howItWorks' ? howItWorksSection.title : 'How to Join Our Teaching Community'}
          subtitle={howItWorksSection?.type === 'howItWorks' ? howItWorksSection.subtitle : 'Four simple steps to start your teaching journey with Kidato.'}
          steps={steps}
          ctaText="View Pricing Plans"
          ctaLink="/teacher-pricing"
        />

        <TestimonialsSection
          title={testimonialsSection?.type === 'testimonials' ? testimonialsSection.title : 'Hear From Our Teachers'}
          subtitle={testimonialsSection?.type === 'testimonials' ? testimonialsSection.subtitle : 'Discover how Kidato has helped educators across Africa pursue their passion for teaching.'}
          testimonials={testimonials}
        />

        <RequirementsSection
          requirements={requirements}
          ctaText="Explore Pricing"
          ctaLink="/teacher-pricing"
          earningOptions={earningOptions}
        />

        <CTASection
          title={ctaSection?.type === 'cta' ? ctaSection.title : 'Ready to Transform African Education?'}
          description={ctaSection?.type === 'cta' ? ctaSection.description : 'Join our teaching community today and help shape the future of thousands of African students.'}
          buttonText={ctaSection?.type === 'cta' && ctaSection.primaryCTA ? ctaSection.primaryCTA.text : 'View Pricing'}
          buttonLink={ctaSection?.type === 'cta' && ctaSection.primaryCTA ? ctaSection.primaryCTA.href : '/teacher-pricing'}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ForTeachers;
