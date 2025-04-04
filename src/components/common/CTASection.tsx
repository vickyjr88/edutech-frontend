
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const CTASection = ({ title, description, buttonText, buttonLink }: CTASectionProps) => {
  return (
    <section className="py-20 bg-kidato-blue text-white text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          {description}
        </p>
        <Button size="lg" className="bg-white text-kidato-blue hover:bg-gray-100">
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
