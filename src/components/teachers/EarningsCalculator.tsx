
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Calendar, Clock, Users } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Define currency types and exchange rates
type CurrencyType = {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to USD
};

const currencies: CurrencyType[] = [
  { code: "KSH", symbol: "KSh", name: "Kenyan Shilling", exchangeRate: 129 },
  { code: "USD", symbol: "$", name: "US Dollar", exchangeRate: 1 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", exchangeRate: 1500 },
  { code: "ZAR", symbol: "R", name: "South African Rand", exchangeRate: 18.5 },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", exchangeRate: 14 }
];

const EarningsCalculator = () => {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [ratePerHour, setRatePerHour] = useState(645);
  const [currencyCode, setCurrencyCode] = useState<string>("KSH");
  const [teachingFormat, setTeachingFormat] = useState("group");
  
  // Get current currency information
  const currentCurrency = currencies.find(c => c.code === currencyCode) || currencies[0];
  
  // Calculate earnings
  const calculateEarnings = () => {
    const rate = ratePerHour;
    
    // Adjust rate based on teaching format
    if (teachingFormat === "one-on-one") {
      // For one-on-one, we calculate per student directly
      const dailyEarnings = rate * (hoursPerWeek / 5); // Convert weekly hours to daily (5 working days)
      const weeklyEarnings = rate * hoursPerWeek;
      const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
      const yearlyEarnings = monthlyEarnings * 12;

      return {
        daily: formatCurrency(dailyEarnings),
        weekly: formatCurrency(weeklyEarnings),
        monthly: formatCurrency(monthlyEarnings),
        yearly: formatCurrency(yearlyEarnings)
      };
    } else {
      // For group teaching
      const dailyEarnings = rate * (hoursPerWeek / 5) * students; // Convert weekly hours to daily
      const weeklyEarnings = rate * hoursPerWeek * students;
      const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
      const yearlyEarnings = monthlyEarnings * 12;

      return {
        daily: formatCurrency(dailyEarnings),
        weekly: formatCurrency(weeklyEarnings),
        monthly: formatCurrency(monthlyEarnings),
        yearly: formatCurrency(yearlyEarnings)
      };
    }
  };

  // Format currency based on selected currency
  const formatCurrency = (amount: number) => {
    // Format based on current currency
    if (currentCurrency.code === "KSH") {
      // Format for KSh with a space and "/=" suffix
      return `${currentCurrency.symbol} ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })} /=`;
    } else {
      // Format for other currencies
      return `${currentCurrency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
  };

  const handleCurrencyChange = (value: string) => {
    const newCurrency = currencies.find(c => c.code === value) || currencies[0];
    const oldCurrency = currencies.find(c => c.code === currencyCode) || currencies[0];
    
    // Convert the rate based on exchange rates when switching currency
    const baseRateInUSD = ratePerHour / oldCurrency.exchangeRate;
    const newRate = Math.round(baseRateInUSD * newCurrency.exchangeRate);
    
    setCurrencyCode(value);
    setRatePerHour(newRate);
  };

  const earnings = calculateEarnings();
  
  // Set min/max rates based on current currency
  const minRate = 5 * currentCurrency.exchangeRate;
  const maxRate = 50 * currentCurrency.exchangeRate;
  const stepRate = currentCurrency.code === "KSH" ? 5 : 1;

  return (
    <section className="py-6 md:py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Earnings Calculator</h2>
          <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-600">
            Estimate your potential income as a Kidato teacher
          </p>
        </div>

        <Card className="shadow-lg border-2 border-blue-100">
          <CardContent className={`p-4 md:p-6 ${isMobile ? 'overflow-x-hidden' : ''}`}>
            <div className="grid gap-5 md:gap-8 md:grid-cols-2">
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <Calculator className="mr-2 h-4 w-4 md:h-5 md:w-5 text-kidato-blue" />
                  Customize Your Teaching
                </h3>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                    <Label className="text-gray-700 font-medium mb-1 md:mb-2 block">Teaching Format</Label>
                    <RadioGroup 
                      value={teachingFormat} 
                      onValueChange={setTeachingFormat}
                      className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-on-one" id="one-on-one" />
                        <Label htmlFor="one-on-one" className="text-sm font-medium">
                          One-on-One
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="group" id="group" />
                        <Label htmlFor="group" className="text-sm font-medium">
                          Group Class
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {teachingFormat === "group" && (
                    <div>
                      <div className="flex justify-between items-center mb-1 md:mb-2">
                        <Label htmlFor="students" className="text-gray-700 text-sm md:text-base">Number of Students</Label>
                        <span className="text-xs md:text-sm text-gray-500">{students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="text-gray-500 w-4 h-4 hidden sm:block" />
                        <Slider
                          id="students"
                          min={1}
                          max={50}
                          value={[students]}
                          onValueChange={(values) => setStudents(values[0])}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1 md:mb-2">
                      <Label htmlFor="hours" className="text-gray-700 text-sm md:text-base">Hours Per Week</Label>
                      <span className="text-xs md:text-sm text-gray-500">{hoursPerWeek} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500 w-4 h-4 hidden sm:block" />
                      <Slider
                        id="hours"
                        min={1}
                        max={40}
                        value={[hoursPerWeek]}
                        onValueChange={(values) => setHoursPerWeek(values[0])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 md:mb-2">
                      <Label htmlFor="rate" className="text-gray-700 text-sm md:text-base">
                        Rate Per Hour
                      </Label>
                      <span className="text-xs md:text-sm text-gray-500">
                        {currentCurrency.symbol} {ratePerHour}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="text-gray-500 w-4 h-4 hidden sm:block" />
                      <Slider
                        id="rate"
                        min={minRate}
                        max={maxRate}
                        step={stepRate}
                        value={[ratePerHour]}
                        onValueChange={(values) => setRatePerHour(values[0])}
                        className="w-full"
                      />
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="currency" className="text-gray-700 text-sm mb-1 block">Currency</Label>
                      <Select value={currencyCode} onValueChange={handleCurrencyChange}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} - {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

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
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EarningsCalculator;
