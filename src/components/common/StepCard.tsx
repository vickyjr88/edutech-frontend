
interface StepCardProps {
  step: string;
  title: string;
  description: string;
}

const StepCard = ({ step, title, description }: StepCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 text-center">
      <div className="bg-kidato-orange text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold">
        {step}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default StepCard;
