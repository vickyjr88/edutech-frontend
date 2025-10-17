import { getIcon } from "../iconMapper";
import type { StatsSection as StatsSectionType } from "../types";

interface StatsSectionProps {
  section: StatsSectionType;
}

export const StatsSection = ({ section }: StatsSectionProps) => {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {section.stats?.map((stat, index) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={index} className="text-center">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="bg-kidato-purple/10 rounded-full p-4">
                      <Icon className="h-8 w-8 text-kidato-purple" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-kidato-purple mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
