import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { CTASection as CTASectionType } from "../types";

interface CTASectionProps {
  section: CTASectionType;
}

export const CTASection = ({ section }: CTASectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-r from-kidato-purple to-blue-700 text-white text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">
          {section.title}
        </h2>
        {(section.subtitle || section.description) && (
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {section.subtitle || section.description}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {section.primaryCTA && (
            <Link to={section.primaryCTA.href}>
              <Button
                size="lg"
                className="bg-white text-kidato-purple hover:bg-gray-100"
              >
                {section.primaryCTA.text}
              </Button>
            </Link>
          )}
          {section.secondaryCTA && (
            <Link to={section.secondaryCTA.href}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                {section.secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
