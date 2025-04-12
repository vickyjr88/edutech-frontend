
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { currencies } from "./earnings/currencyData";
import { calculateEarnings } from "./earnings/earningsUtils";
import EarningsDisplay from "./earnings/EarningsDisplay";
import TeachingSettings from "./earnings/TeachingSettings";
import { CurrencyType } from "./earnings/types";

const EarningsCalculator = () => {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [ratePerHour, setRatePerHour] = useState(645);
  const [currencyCode, setCurrencyCode] = useState<string>("KSH");
  const [teachingFormat, setTeachingFormat] = useState("group");
  
  // Get current currency information
  const currentCurrency = currencies.find(c => c.code === currencyCode) || currencies[0];

  const handleCurrencyChange = (value: string) => {
    const newCurrency = currencies.find(c => c.code === value) || currencies[0];
    const oldCurrency = currencies.find(c => c.code === currencyCode) || currencies[0];
    
    // Convert the rate based on exchange rates when switching currency
    const baseRateInUSD = ratePerHour / oldCurrency.exchangeRate;
    const newRate = Math.round(baseRateInUSD * newCurrency.exchangeRate);
    
    setCurrencyCode(value);
    setRatePerHour(newRate);
  };

  // Calculate earnings based on inputs
  const earnings = calculateEarnings(
    teachingFormat,
    ratePerHour,
    hoursPerWeek,
    students,
    currentCurrency
  );

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
              <TeachingSettings
                students={students}
                setStudents={setStudents}
                hoursPerWeek={hoursPerWeek}
                setHoursPerWeek={setHoursPerWeek}
                ratePerHour={ratePerHour}
                setRatePerHour={setRatePerHour}
                teachingFormat={teachingFormat}
                setTeachingFormat={setTeachingFormat}
                currencyCode={currencyCode}
                handleCurrencyChange={handleCurrencyChange}
                currencies={currencies}
                currentCurrency={currentCurrency}
              />
              
              <EarningsDisplay earnings={earnings} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EarningsCalculator;
