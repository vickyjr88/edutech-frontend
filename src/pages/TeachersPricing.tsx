import { useState } from "react";
import { Building2, CheckCircle2, HelpCircle, Users2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTable from "@/components/teachers/PricingTable";
import PricingFAQ from "@/components/teachers/PricingFAQ";
import EarningsCalculator from "@/components/teachers/EarningsCalculator";
import { useContent } from "@/hooks/useContent";
import type { PageContent } from "@/content/types";

const TeachersPricing = () => {
  const { content, loading, error } = useContent<PageContent>('pages/teachers-pricing.json');
  const [isAnnual, setIsAnnual] = useState(false);

  // Icon mapping
  const iconMap: Record<string, any> = {
    Building2,
    CheckCircle2,
    Users2
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

  // Extract sections
  const heroSection = content?.sections.find(s => s.type === 'hero');
  const pricingSection = content?.sections.find(s => s.type === 'pricing');
  const enterpriseSection = content?.sections.find(s => s.type === 'contentCards' && s.title?.includes('Need more'));
  const ctaSection = content?.sections.find(s => s.type === 'cta');

  // Get price variations from JSON
  const priceVariations = (content as any)?.priceVariations || { monthly: {}, annual: {} };

  // Map plans with dynamic pricing
  const jsonPlans = pricingSection?.type === 'pricing' ? pricingSection.tiers.map(tier => {
    const icon = iconMap[tier.icon as string] || Users2;
    let price = tier.price?.amount || 0;

    // Apply price variations based on billing cycle
    if (tier.id === 'pro') {
      price = isAnnual ? (priceVariations.annual?.pro || 23) : (priceVariations.monthly?.pro || 29);
    } else if (tier.id === 'tuition-center') {
      price = isAnnual ? (priceVariations.annual?.tuitionCenter || 79) : (priceVariations.monthly?.tuitionCenter || 99);
    }

    return {
      ...tier,
      price,
      icon,
      cta: tier.cta?.text || 'Get Started',
      link: tier.cta?.href || '/teacher-signup'
    };
  }) : [];

  const plans = jsonPlans.length > 0 ? jsonPlans : [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "Up to 5 students",
        "Basic scheduling tools",
        "Basic learning materials",
        "Student progress tracking",
      ],
      revenueShare: "30% revenue share on all transactions",
      cta: "Get Started",
      link: "/teacher-signup",
      icon: Users2
    },
    {
      name: "Pro",
      price: isAnnual ? 23 : 29,
      description: "For dedicated individual tutors",
      features: [
        "Unlimited students",
        "Advanced scheduling",
        "Premium learning materials",
        "Detailed analytics",
        "Custom branding",
        "Payment processing"
      ],
      revenueShare: "15% revenue share on all transactions",
      cta: "Choose Pro",
      link: "/teacher-signup?plan=pro",
      icon: CheckCircle2,
      popular: true
    },
    {
      name: "Tuition Center",
      price: isAnnual ? 79 : 99,
      description: "For coaching centers & small schools",
      pricePerTeacher: isAnnual ? 32 : 39,
      features: [
        "Up to 3 teachers included",
        "All Pro features",
        "Teacher management",
        "Admin dashboard",
        "Centralized billing",
        "Priority support"
      ],
      revenueShare: "10% revenue share on all transactions",
      cta: "Request for a Meeting",
      link: "/contact-us",
      icon: Building2
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-kidato-purple to-kidato-dark-blue text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {heroSection?.type === 'hero' ? heroSection.title : 'Choose Your Teaching Plan'}
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              {heroSection?.type === 'hero' ? heroSection.subtitle : 'Flexible plans for solo tutors, coaching centers, and schools'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                {heroSection?.type === 'hero' && heroSection.primaryCTA ? heroSection.primaryCTA.text : 'Start for Free'}
              </Button>
              <Button size="lg" variant="outline" className="border-2 text-white hover:bg-white hover:text-kidato-purple">
                {heroSection?.type === 'hero' && heroSection.secondaryCTA ? heroSection.secondaryCTA.text : 'Compare Plans'}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm ${!isAnnual ? 'opacity-100' : 'opacity-70'}`}>
                {pricingSection?.type === 'pricing' && pricingSection.billingToggle ? pricingSection.billingToggle.monthly : 'Monthly'}
              </span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? 'opacity-100' : 'opacity-70'}`}>
                {pricingSection?.type === 'pricing' && pricingSection.billingToggle ? pricingSection.billingToggle.annual : 'Annual'}{' '}
                <span className="text-green-400">
                  {pricingSection?.type === 'pricing' && pricingSection.billingToggle ? `(${pricingSection.billingToggle.discount})` : '(Save 20%)'}
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className={`text-sm ${!isAnnual ? 'opacity-100' : 'opacity-70'}`}>Monthly</span>
                <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                <span className={`text-sm ${isAnnual ? 'opacity-100' : 'opacity-70'}`}>
                  Annual <span className="text-green-400">(Save 20%)</span>
                </span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className={`relative hover:shadow-lg transition-shadow duration-300 ${plan.popular ? 'border-indigo-500 border-2' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <plan.icon className="h-8 w-8 text-kidato-purple" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 ml-2">/month</span>
                      )}
                      {plan.name === "Free" && (
                        <p className="text-sm text-gray-500 mt-1">No credit card required</p>
                      )}
                      {plan.price > 0 && (
                        <p className="text-sm text-gray-500 mt-1">Billed {isAnnual ? 'annually' : 'monthly'}</p>
                      )}
                      {(plan as any).pricePerTeacher && (
                        <p className="text-sm text-gray-600 mt-1">
                          + ${(plan as any).pricePerTeacher}/month per additional teacher
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500 mb-6">
                      {plan.note || (plan as any).revenueShare}
                    </p>
                    <Button className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-kidato-purple hover:bg-kidato-dark-blue'}`}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Earnings Calculator Section */}
        <EarningsCalculator />

        {/* Feature Comparison Table Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PricingTable />
          </div>
        </section>

        {/* Enterprise CTA Section */}
        <section className="py-12 bg-indigo-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {enterpriseSection?.type === 'contentCards' ? enterpriseSection.title : 'Need more than 10 teachers?'}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {enterpriseSection?.type === 'contentCards' ? enterpriseSection.subtitle : 'Our B2B plans offer custom pricing, dedicated support, and enterprise features for larger educational institutions.'}
            </p>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-indigo-700">
              {enterpriseSection?.type === 'contentCards' && enterpriseSection.cards[0]?.link?.text ? enterpriseSection.cards[0].link.text : 'Talk to Sales'}
              <HelpCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <PricingFAQ />

        {/* CTA Section */}
        <section className="bg-kidato-purple text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {ctaSection?.type === 'cta' ? ctaSection.title : 'Ready to Start Teaching?'}
            </h2>
            <p className="text-xl mb-8">
              {ctaSection?.type === 'cta' ? ctaSection.description : 'Join thousands of educators already using Kidato'}
            </p>
            <Button size="lg" className="bg-white text-kidato-purple hover:bg-gray-100">
              {ctaSection?.type === 'cta' && ctaSection.primaryCTA ? ctaSection.primaryCTA.text : 'Create Your Account'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TeachersPricing;
