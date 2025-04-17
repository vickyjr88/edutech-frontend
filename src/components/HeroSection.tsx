
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const HeroSection = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-kidato-blue to-kidato-dark-blue text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl mb-8">{description}</p>
          <div className="space-x-4">
            <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
              <Link to={primaryButtonLink}>{primaryButtonText}</Link>
            </Button>
            {secondaryButtonText && secondaryButtonLink && (
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-kidato-blue bg-white hover:bg-transparent hover:text-white transition-colors duration-300"
              >
                <Link to={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
