
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

  // Loading state - early return
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
  const benefits = benefitsSection?.type === 'benefits' ? (benefitsSection.benefits || []).map(benefit => ({
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
  const popularPackages = packagesSection?.type === 'contentCards' ? (packagesSection.cards || []) : [];

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
  const testimonials = testimonialsSection?.type === 'testimonials' ? (testimonialsSection.testimonials || []) : [];

  // Extract how it works steps
  const steps = howItWorksSection?.type === 'howItWorks' ? (howItWorksSection.steps || []) : [];

  // Extract pricing tiers
  const pricingTiers = pricingSection?.type === 'pricing' ? (pricingSection.tiers || []).map(tier => ({
    ...tier,
    icon: iconMap[tier.icon as string] || Users
  })) : [];

  // Extract FAQs
  const faqs = faqSection?.type === 'faq' ? (faqSection.questions || []) : [];

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
        <h1>For Parents</h1>
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
