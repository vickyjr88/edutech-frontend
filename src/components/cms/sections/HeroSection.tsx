import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { HeroSection as HeroSectionType } from "../types";

interface HeroSectionProps {
  section: HeroSectionType;
}

export const HeroSection = ({ section }: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-kidato-purple to-blue-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {section.title}
        </h1>
        {section.subtitle && (
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {section.subtitle}
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
