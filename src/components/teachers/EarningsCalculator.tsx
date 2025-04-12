
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Calendar, Clock, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";

const EarningsCalculator = () => {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [ratePerHour, setRatePerHour] = useState(645);
  const [isCurrencyKsh, setIsCurrencyKsh] = useState(true);
  const [teachingFormat, setTeachingFormat] = useState("group");
  
  // Exchange rate (1 USD = 129 KSh approximately)
  const exchangeRate = 129;

  // Calculate earnings
  const calculateEarnings = () => {
    let rate = isCurrencyKsh ? ratePerHour : ratePerHour * (isCurrencyKsh ? 1 : 1);
    
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
  const formatCurrency = (amount) => {
    if (isCurrencyKsh) {
      // Format for KSh with a space and "/=" suffix
      return `KSh ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })} /=`;
    } else {
      // Format for USD
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const toggleCurrency = () => {
    setIsCurrencyKsh(!isCurrencyKsh);
    // Convert the rate when switching currency
    if (!isCurrencyKsh) {
      // Converting from USD to KSh
      setRatePerHour(Math.round(ratePerHour * exchangeRate));
    } else {
      // Converting from KSh to USD
      setRatePerHour(Math.round(ratePerHour / exchangeRate));
    }
  };

  const handleRateChange = (e) => {
    let value = parseInt(e.target.value, 10);
    const minRate = isCurrencyKsh ? 5 * exchangeRate : 5;
    
    // If value is NaN or less than minimum rate, set to minimum rate
    if (isNaN(value) || value < minRate) {
      value = minRate;
    }
    
    setRatePerHour(value);
  };

  const currencySymbol = isCurrencyKsh ? "KSh" : "$";
  const earnings = calculateEarnings();

  const minRate = isCurrencyKsh ? 5 * exchangeRate : 5;

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Earnings Calculator</h2>
          <p className="mt-2 md:mt-4 text-base md:text-xl text-gray-600">
            Estimate your potential income as a Kidato teacher
          </p>
          <div className="flex items-center justify-center mt-3 md:mt-4 space-x-2">
            <span className={!isCurrencyKsh ? "font-bold" : ""}>USD ($)</span>
            <Switch 
              checked={isCurrencyKsh}
              onCheckedChange={toggleCurrency}
              className="mx-2"
            />
            <span className={isCurrencyKsh ? "font-bold" : ""}>KSh</span>
          </div>
        </div>

        <Card className="shadow-lg border-2 border-blue-100">
          <CardContent className={`p-4 md:p-6 ${isMobile ? 'overflow-x-hidden' : ''}`}>
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
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
                        Rate Per Hour ({isCurrencyKsh ? "KSh" : "$"})
                      </Label>
                      <span className="text-xs md:text-sm text-gray-500">
                        {isCurrencyKsh ? "KSh " : "$"}{ratePerHour}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-500 w-4 h-4 hidden sm:block" />
                      <Slider
                        id="rate"
                        min={isCurrencyKsh ? 5 * 129 : 5}
                        max={isCurrencyKsh ? 50 * 129 : 50}
                        step={isCurrencyKsh ? 129 : 1}
                        value={[ratePerHour]}
                        onValueChange={(values) => setRatePerHour(values[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 md:p-6 rounded-lg">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5 text-kidato-blue" />
                  Your Potential Earnings
                </h3>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                    <div className="text-xs md:text-sm text-gray-500">Daily</div>
                    <div className="flex items-center">
                      <span className="text-lg md:text-2xl font-bold text-kidato-blue">{earnings.daily}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                    <div className="text-xs md:text-sm text-gray-500">Weekly</div>
                    <div className="flex items-center">
                      <span className="text-lg md:text-2xl font-bold text-kidato-blue">{earnings.weekly}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                    <div className="text-xs md:text-sm text-gray-500">Monthly</div>
                    <div className="flex items-center">
                      <span className="text-lg md:text-2xl font-bold text-kidato-blue">{earnings.monthly}</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                    <div className="text-xs md:text-sm text-gray-500">Yearly</div>
                    <div className="flex items-center">
                      <span className="text-lg md:text-2xl font-bold text-kidato-blue">{earnings.yearly}</span>
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
