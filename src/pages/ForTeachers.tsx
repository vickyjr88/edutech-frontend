
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

  const steps = [
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
  ];

  const requirements = [
    "Teaching qualification or relevant degree",
    "At least 2 years of teaching experience",
    "Passion for education and working with young learners",
    "Strong communication skills",
    "Reliable internet connection and computer",
    "Commitment to professional growth"
  ];

  const earningOptions = [
    {
      title: "One-on-One Tuition Classes",
      rate: "$15-35",
      period: "hour",
      description: "Personalized instruction tailored to individual student needs."
    },
    {
      title: "Group Classes",
      rate: "$20-50",
      period: "hour",
      description: "Teaching multiple students with similar educational goals."
    },
    {
      title: "Exam-Prep",
      rate: "$25-60",
      period: "hour",
      description: "Specialized sessions focused on test preparation and exam strategies."
    },
    {
      title: "Online Schooling",
      rate: "$10-30",
      period: "lesson",
      description: "Regular curriculum-based lessons delivered through our online platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection 
          title="Share Your Knowledge, Inspire the Next Generation"
          description="Join our community of passionate educators making quality education accessible across Africa."
          primaryButtonText="Apply to Teach"
          primaryButtonLink="/teacher-signup"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/teacher-requirements"
        />
        
        <BenefitsSection 
          title="Why Teach with Kidato?"
          subtitle="Our platform offers the perfect environment for passionate educators to thrive."
          benefits={benefits}
        />

        <EarningsCalculator />
        
        <JoinStepsSection 
          title="How to Join Our Teaching Community"
          subtitle="Four simple steps to start your teaching journey with Kidato."
          steps={steps}
          ctaText="Start Your Application"
          ctaLink="/teacher-signup"
        />
        
        <TestimonialsSection 
          title="Hear From Our Teachers"
          subtitle="Discover how Kidato has helped educators across Africa pursue their passion for teaching."
          testimonials={testimonials}
        />
        
        <RequirementsSection 
          requirements={requirements}
          ctaText="Apply Now"
          ctaLink="/teacher-signup"
          earningOptions={earningOptions}
        />
        
        <CTASection 
          title="Ready to Transform African Education?"
          description="Join our teaching community today and help shape the future of thousands of African students."
          buttonText="Start Your Teaching Journey"
          buttonLink="/teacher-signup"
        />
      </main>
      <Footer />
    </div>
  );
};

export default ForTeachers;
