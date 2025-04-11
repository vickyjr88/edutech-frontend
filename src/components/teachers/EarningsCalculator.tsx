
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Calendar, Clock, Users } from "lucide-react";

const EarningsCalculator = () => {
  const [students, setStudents] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [ratePerHour, setRatePerHour] = useState(25);

  // Calculate earnings
  const calculateEarnings = () => {
    const dailyEarnings = (ratePerHour * hoursPerWeek * students) / 5; // Assuming 5 working days
    const weeklyEarnings = ratePerHour * hoursPerWeek * students;
    const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      daily: dailyEarnings.toFixed(2),
      weekly: weeklyEarnings.toFixed(2),
      monthly: monthlyEarnings.toFixed(2),
      yearly: yearlyEarnings.toFixed(2)
    };
  };

  const earnings = calculateEarnings();

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Earnings Calculator</h2>
          <p className="mt-4 text-xl text-gray-600">
            Estimate your potential income as a Kidato teacher
          </p>
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
                      <Label htmlFor="hours" className="text-gray-700">Hours Per Week</Label>
                      <span className="text-sm text-gray-500">{hoursPerWeek} hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500 w-4 h-4" />
                      <Input
                        id="hours"
                        type="range"
                        min={1}
                        max={40}
                        value={hoursPerWeek}
                        onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="rate" className="text-gray-700">Rate Per Hour ($)</Label>
                      <span className="text-sm text-gray-500">${ratePerHour}.00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-gray-500 w-4 h-4" />
                      <Input
                        id="rate"
                        type="range"
                        min={15}
                        max={100}
                        step={5}
                        value={ratePerHour}
                        onChange={(e) => setRatePerHour(parseInt(e.target.value))}
                        className="h-2"
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
                      <span className="text-2xl font-bold text-green-600">${earnings.daily}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Weekly</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">${earnings.weekly}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Monthly</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">${earnings.monthly}</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Yearly</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">${earnings.yearly}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-600">
                  <p>These calculations are estimates based on your inputs. Actual earnings may vary based on class sizes, scheduling, and other factors.</p>
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
