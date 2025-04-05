
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FormCardProps {
  title: string;
  children: ReactNode;
}

export const FormCard = ({ title, children }: FormCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormCard;
