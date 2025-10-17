import { getIcon } from "../iconMapper";
import type { ValuesSection as ValuesSectionType } from "../types";

interface ValuesSectionProps {
  section: ValuesSectionType;
}

export const ValuesSection = ({ section }: ValuesSectionProps) => {
  return (
    <section className="py-16 bg-white">
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {section.values?.map((value, index) => {
            const Icon = getIcon(value.icon);
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-kidato-purple/30 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-kidato-purple to-blue-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
