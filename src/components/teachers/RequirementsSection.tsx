
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface RequirementsSectionProps {
  requirements: string[];
  ctaText: string;
  ctaLink: string;
  earningOptions: {
    title: string;
    rate: string;
    period: string;
    description?: string;
  }[];
}

const RequirementsSection = ({ 
  requirements, 
  ctaText, 
  ctaLink,
  earningOptions 
}: RequirementsSectionProps) => {
  return (
    <section className="py-16 bg-kidato-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Look For</h2>
            <ul className="space-y-4">
              {requirements.map((item, index) => (
                <li key={index} className="flex items-start">
                  <BookOpen className="h-6 w-6 text-kidato-purple mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button size="lg" className="bg-kidato-orange hover:bg-orange-600 text-white">
                <Link to={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          </div>
          
          <div className="md:w-2/5">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Earning Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {earningOptions.map((option, index) => (
                    <div key={index}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h4>
                      <p className="text-2xl font-bold text-kidato-purple">
                        {option.rate}
                        <span className="text-base font-normal text-gray-600">/{option.period}</span>
                      </p>
                      {option.description && (
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      )}
                    </div>
                  ))}
                  <p className="text-sm text-gray-600 mt-4">
                    Rates vary based on subject, experience level, and class size. Top teachers on our platform earn $1,500+ monthly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
