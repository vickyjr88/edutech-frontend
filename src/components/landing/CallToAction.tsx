import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { CTASection } from "@/content/types";

interface CallToActionProps {
  content?: CTASection;
}

const CallToAction = ({ content }: CallToActionProps) => {
  // Default content (fallback if no content prop provided)
  const defaultContent = {
    title: "Ready to Transform Learning in Africa?",
    description: "Join thousands of students, parents, and tutors who are already part of the Kidato community.",
    primaryCTA: { text: "Sign Up", href: "/signup", variant: "secondary" as const },
    secondaryCTA: { text: "Explore Courses", href: "/courses", variant: "outline" as const }
  };

  const data = content || defaultContent;

  return (
    <div className="section-padding bg-kidato-purple text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold md:text-4xl mb-6">
          {data.title}
        </h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
          <Link to={data.primaryCTA.href} className="w-full">
            <Button variant="secondary" size="lg" className="w-full text-kidato-purple hover:bg-white">
              {data.primaryCTA.text}
            </Button>
          </Link>
          {data.secondaryCTA && (
            <Link to={data.secondaryCTA.href} className="w-full">
              <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white/10">
                {data.secondaryCTA.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
