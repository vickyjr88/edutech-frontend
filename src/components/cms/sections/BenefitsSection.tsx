import { getIcon } from "../iconMapper";
import type { BenefitsSection as BenefitsSectionType } from "../types";

interface BenefitsSectionProps {
  section: BenefitsSectionType;
}

export const BenefitsSection = ({ section }: BenefitsSectionProps) => {
  return (
    <section className="py-16 bg-kidato-light-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-4 text-xl text-gray-600">
              {section.subtitle}
            </p>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {section.benefits?.map((benefit, index) => {
            const Icon = getIcon(benefit.icon);
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-kidato-purple to-blue-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
