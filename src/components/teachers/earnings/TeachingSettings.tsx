
import { useState } from "react";
import { Calculator, DollarSign, Clock, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyType } from "./types";

type TeachingSettingsProps = {
  students: number;
  setStudents: (value: number) => void;
  hoursPerWeek: number;
  setHoursPerWeek: (value: number) => void;
  ratePerHour: number;
  setRatePerHour: (value: number) => void;
  teachingFormat: string;
  setTeachingFormat: (value: string) => void;
  currencyCode: string;
  handleCurrencyChange: (value: string) => void;
  currencies: CurrencyType[];
  currentCurrency: CurrencyType;
};

const TeachingSettings = ({
  students,
  setStudents,
  hoursPerWeek,
  setHoursPerWeek,
  ratePerHour,
  setRatePerHour,
  teachingFormat,
  setTeachingFormat,
  currencyCode,
  handleCurrencyChange,
  currencies,
  currentCurrency
}: TeachingSettingsProps) => {
  // Set min/max rates based on current currency
  const minRate = 5 * currentCurrency.exchangeRate;
  const maxRate = 50 * currentCurrency.exchangeRate;
  const stepRate = currentCurrency.code === "KSH" ? 5 : 1;

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 flex items-center">
        <Calculator className="mr-2 h-4 w-4 md:h-5 md:w-5 text-kidato-purple" />
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
  );
};

export default TeachingSettings;
