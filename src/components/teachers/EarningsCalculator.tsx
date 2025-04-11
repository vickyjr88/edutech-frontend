
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Calendar, Clock, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const EarningsCalculator = () => {
  const [students, setStudents] = useState(10);
  const [hoursPerDay, setHoursPerDay] = useState(4); // Changed from hoursPerWeek to hoursPerDay with a default of 4
  const [ratePerHour, setRatePerHour] = useState(645); // Default to KSh (5 USD * 129)
  const [isCurrencyKsh, setIsCurrencyKsh] = useState(true); // Set KSh as default
  
  // Exchange rate (1 USD = 129 KSh approximately)
  const exchangeRate = 129;

  // Calculate earnings
  const calculateEarnings = () => {
    const rate = isCurrencyKsh ? ratePerHour : ratePerHour * (isCurrencyKsh ? 1 : 1);
    const weeklyHours = hoursPerDay * 5; // Convert hours per day to weekly hours (5 working days)
    const dailyEarnings = rate * hoursPerDay * students;
    const weeklyEarnings = dailyEarnings * 5; // 5 working days per week
    const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      daily: formatCurrency(dailyEarnings),
      weekly: formatCurrency(weeklyEarnings),
      monthly: formatCurrency(monthlyEarnings),
      yearly: formatCurrency(yearlyEarnings)
    };
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
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Earnings Calculator</h2>
          <p className="mt-4 text-xl text-gray-600">
            Estimate your potential income as a Kidato teacher
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
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
          <CardContent className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-kidato-blue" />
                  Customize Your Teaching
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="students" className="text-gray-700">Number of Students</Label>
                      <span className="text-sm text-gray-500">{students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-500 w-4 h-4" />
                      <Input
                        id="students"
                        type="range"
                        min={1}
                        max={50}
                        value={students}
                        onChange={(e) => setStudents(parseInt(e.target.value))}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="hours" className="text-gray-700">Hours Per Day</Label>
                      <span className="text-sm text-gray-500">{hoursPerDay} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500 w-4 h-4" />
                      <Input
                        id="hours"
                        type="range"
                        min={1}
                        max={8}
                        value={hoursPerDay}
                        onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="rate" className="text-gray-700">
                        Rate Per Hour ({isCurrencyKsh ? "KSh" : "$"})
                      </Label>
                      <span className="text-sm text-gray-500">
                        {isCurrencyKsh ? "KSh " : "$"}{ratePerHour}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-500 w-4 h-4" />
                      <Input
                        id="rate"
                        type="number"
                        min={minRate}
                        value={ratePerHour}
                        onChange={handleRateChange}
                        className="w-full"
                        placeholder={`Enter rate (min: ${minRate})`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Your Potential Earnings
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Daily</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">{earnings.daily}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Weekly</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">{earnings.weekly}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Monthly</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">{earnings.monthly}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Yearly</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">{earnings.yearly}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600">
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
