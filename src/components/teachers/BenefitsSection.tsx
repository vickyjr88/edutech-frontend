
import { LucideIcon } from "lucide-react";
import BenefitCard from "../common/BenefitCard";

interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface BenefitsSectionProps {
  title: string;
  subtitle: string;
  benefits: Benefit[];
}

const BenefitsSection = ({ title, subtitle, benefits }: BenefitsSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
