
import { Card, CardContent } from "@/components/ui/card";

const PricingFAQ = () => {
  const faqs = [
    {
      question: "How does the revenue share work?",
      answer: "We take a percentage of the payments you receive through our platform. The revenue share percentage varies by plan: 30% for Free accounts, 15% for Pro accounts, and 10% for Tuition Center accounts. This revenue share helps us maintain and improve the platform while providing you with payment processing, scheduling, and other services."
    },
    {
      question: "How do teacher payouts work?",
      answer: "Teacher payouts are processed automatically on a bi-weekly basis. Once a payment clears our system, we deduct our revenue share and transfer the remaining amount to your connected bank account or payment method. You can track all transactions in your dashboard, and we provide detailed reports for tax purposes."
    },
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new features will be available immediately, and we'll prorate your billing. When downgrading, the changes will take effect at the end of your current billing cycle. Your data will be preserved when switching between plans, though some features may become unavailable if you downgrade."
    },
    {
      question: "What happens if I need to add teachers mid-month?",
      answer: "You can add teachers at any time. For Tuition Center plans, additional teachers beyond your included three will be charged at $39 per teacher per month, prorated for the remainder of your billing cycle. You can manage your teacher accounts directly from your admin dashboard."
    },
    {
      question: "Do you offer discounts for educational institutions?",
      answer: "Yes, we offer special pricing for K-12 schools, colleges, and non-profit educational institutions. Please contact our sales team to discuss your specific needs and eligibility for educational discounts. We're committed to making our platform accessible to educational organizations of all sizes."
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ;
