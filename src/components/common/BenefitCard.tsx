
import { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const BenefitCard = ({ title, description, icon: Icon }: BenefitCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="bg-kidato-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-kidato-blue" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default BenefitCard;
