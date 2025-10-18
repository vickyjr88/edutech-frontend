import { Briefcase, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PositionsSection as PositionsSectionType } from "../types";

interface PositionsSectionProps {
  section: PositionsSectionType;
}

export const PositionsSection = ({ section }: PositionsSectionProps) => {
  return (
    <section id="positions" className="py-16 bg-white">
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
        <div className="space-y-6">
          {section.positions?.map((position, index) => (
            <Card
              key={index}
              className="border-gray-200 hover:border-kidato-purple/50 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-kidato-purple/10 rounded-lg p-2">
                        <Briefcase className="h-5 w-5 text-kidato-purple" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {position.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {position.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {position.description}
                    </p>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {position.requirements?.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600">
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <a href={position.link}>
                      <Button className="w-full md:w-auto bg-kidato-purple hover:bg-kidato-dark-blue">
                        Apply Now
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
