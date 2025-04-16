
import { useState } from "react";
import { Building2, CheckCircle2, HelpCircle, Users2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TeachersPricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [teacherCount, setTeacherCount] = useState(1);

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for solo tutors just starting out",
      features: [
        "Up to 5 active students",
        "Basic analytics",
        "Live class tools",
        "Student progress tracking",
      ],
      revenueShare: "15% per transaction",
      cta: "Start for Free",
      link: "/teacher-signup",
      icon: Users2
    },
    {
      name: "Pro",
      price: isAnnual ? 29 : 39,
      description: "For dedicated educators growing their practice",
      features: [
        "Up to 50 active students",
        "Advanced analytics",
        "Custom branding",
        "Priority support",
        "Downloadable resources",
      ],
      revenueShare: "10% per transaction",
      cta: "Upgrade to Pro",
      link: "/teacher-signup?plan=pro",
      icon: CheckCircle2
    },
    {
      name: "Tuition Center",
      price: isAnnual ? 99 : 129,
      description: "For established educational centers",
      pricePerTeacher: isAnnual ? 19 : 29,
      features: [
        "Unlimited students",
        "Multiple teacher accounts",
        "Center dashboard",
        "Bulk student import",
        "API access",
      ],
      revenueShare: "8% per transaction",
      cta: "Get Started",
      link: "/contact-sales",
      icon: Building2
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-kidato-blue to-kidato-dark-blue text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Teaching Plan
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Flexible plans designed for solo tutors, coaching centers, and schools to maximize their teaching potential
            </p>
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className={`text-sm ${!isAnnual ? 'opacity-100' : 'opacity-70'}`}>Monthly</span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm ${isAnnual ? 'opacity-100' : 'opacity-70'}`}>
                Annual (Save 20%)
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className="relative hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <plan.icon className="h-8 w-8 text-kidato-blue" />
                      {plan.name === "Pro" && (
                        <span className="bg-kidato-blue text-white text-xs px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      )}
                      {plan.pricePerTeacher && (
                        <p className="text-sm text-gray-600 mt-1">
                          +${plan.pricePerTeacher} per additional teacher
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500 mb-6">
                      Revenue share: {plan.revenueShare}
                    </p>
                    <Button className="w-full bg-kidato-blue hover:bg-kidato-dark-blue">
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Calculate Your Tuition Center Cost</h2>
              <p className="text-gray-600">Adjust the slider to see pricing for your team size</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Number of Teachers: {teacherCount}
                    </label>
                    <Slider
                      value={[teacherCount]}
                      onValueChange={(value) => setTeacherCount(value[0])}
                      max={10}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Monthly Cost:</span>
                      <span className="text-2xl font-bold">
                        ${129 + (teacherCount - 1) * 29}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Need more than 10 teachers?</p>
              <Button size="lg" variant="outline" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How does revenue sharing work?</h3>
                  <p className="text-gray-600">
                    We take a small percentage of your earnings to cover platform costs and continue improving our services. The percentage varies by plan, with higher tiers offering lower revenue share rates.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">When do I get paid?</h3>
                  <p className="text-gray-600">
                    Payments are processed every two weeks for all completed classes. Funds are transferred directly to your linked bank account.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I switch plans later?</h3>
                  <p className="text-gray-600">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-kidato-blue text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Teaching?</h2>
            <p className="text-xl mb-8">Join thousands of educators already using Kidato</p>
            <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
              Create Your Account
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
