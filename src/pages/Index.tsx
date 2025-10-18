import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import UserRoles from "@/components/landing/UserRoles";
import CallToAction from "@/components/landing/CallToAction";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const Index = () => {
  const { content, loading, error } = useContent<PageContent>('pages/index.json');

  // Show loading state
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

  // Show error state
  if (error || !content) {
    console.error('Failed to load homepage content:', error);
    // Fallback to components without content props (they'll use their hardcoded defaults)
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          <Features />
          <HowItWorks />
          <UserRoles />
          <Testimonials />
          <CallToAction />
        </main>
        <Footer />
      </div>
    );
  }

  // Extract sections by type
  const heroSection = content.sections.find(s => s.type === 'hero');
  const featuresSections = content.sections.filter(s => s.type === 'features' || s.type === 'contentCards' || s.type === 'text' || s.type === 'team');
  const howItWorksSection = content.sections.find(s => s.type === 'howItWorks');
  const benefitsSection = content.sections.find(s => s.type === 'benefits');
  const userRolesSection = content.sections.find(s => s.type === 'contentCards' && s.title === 'Something for Everyone');
  const testimonialsSection = content.sections.find(s => s.type === 'testimonials');
  const ctaSection = content.sections.find(s => s.type === 'cta');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero content={heroSection} />
        <Features content={featuresSections} />
        <HowItWorks content={{ howItWorks: howItWorksSection, benefits: benefitsSection }} />
        <UserRoles content={userRolesSection} />
        <Testimonials content={testimonialsSection} />
        <CallToAction content={ctaSection} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
