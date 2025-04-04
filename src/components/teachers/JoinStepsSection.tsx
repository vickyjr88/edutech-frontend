
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import StepCard from "../common/StepCard";

interface Step {
  step: string;
  title: string;
  description: string;
}

interface JoinStepsSectionProps {
  title: string;
  subtitle: string;
  steps: Step[];
  ctaText: string;
  ctaLink: string;
}

const JoinStepsSection = ({ title, subtitle, steps, ctaText, ctaLink }: JoinStepsSectionProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-kidato-blue hover:bg-kidato-dark-blue">
            <Link to={ctaLink}>{ctaText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JoinStepsSection;
