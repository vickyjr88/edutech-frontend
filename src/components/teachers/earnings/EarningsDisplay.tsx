
import { DollarSign } from "lucide-react";
import { EarningsType } from "./types";

type EarningsDisplayProps = {
  earnings: EarningsType;
};

const EarningsDisplay = ({ earnings }: EarningsDisplayProps) => {
  return (
    <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
      <h3 className="text-lg md:text-xl font-semibold text-kidato-blue mb-4 md:mb-6 flex items-center">
        <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5 text-kidato-blue" />
        Your Potential Earnings
      </h3>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-xs md:text-sm text-gray-500 mb-1">Daily</div>
          <div className="flex items-center">
            <span className="text-base md:text-xl font-bold text-kidato-blue truncate">{earnings.daily}</span>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-xs md:text-sm text-gray-500 mb-1">Weekly</div>
          <div className="flex items-center">
            <span className="text-base md:text-xl font-bold text-kidato-blue truncate">{earnings.weekly}</span>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-xs md:text-sm text-gray-500 mb-1">Monthly</div>
          <div className="flex items-center">
            <span className="text-base md:text-xl font-bold text-kidato-blue truncate">{earnings.monthly}</span>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <div className="text-xs md:text-sm text-gray-500 mb-1">Yearly</div>
          <div className="flex items-center">
            <span className="text-base md:text-xl font-bold text-kidato-blue truncate">{earnings.yearly}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-600">
        <p className="mb-2">These calculations show gross revenue estimates based on your inputs. Actual earnings may vary based on class sizes, scheduling, and other factors.</p>
        <p className="font-medium">Note: Kidato takes a platform fee of 15-30% from gross revenue, depending on your approval status and experience level.</p>
      </div>
    </div>
  );
};

export default EarningsDisplay;
