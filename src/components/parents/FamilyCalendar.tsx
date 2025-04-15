
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const FamilyCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-4">
        <h2 className="text-lg font-bold mb-3">Family Calendar</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};

export default FamilyCalendar;
