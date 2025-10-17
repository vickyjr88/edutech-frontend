import { Card, CardContent } from "@/components/ui/card";
import type { HiringSection as HiringSectionType } from "../types";

interface HiringSectionProps {
  section: HiringSectionType;
}

export const HiringSection = ({ section }: HiringSectionProps) => {
  return (
    <section className="py-16 bg-gray-50">
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
        <div className="grid gap-6 md:grid-cols-5">
          {section.steps?.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-gray-200 h-full">
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-kidato-purple to-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4 font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {index < (section.steps?.length || 0) - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-kidato-purple"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
