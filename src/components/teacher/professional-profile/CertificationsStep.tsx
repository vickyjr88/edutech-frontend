
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";

type FormItem = {
  id: string;
  value: string;
  details?: string;
};

type CertificationsStepProps = {
  certifications: FormItem[];
  setCertifications: React.Dispatch<React.SetStateAction<FormItem[]>>;
};

const CertificationsStep = ({ certifications, setCertifications }: CertificationsStepProps) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
      details: ""
    };
    setCertifications([...certifications, newItem]);
  };

  const removeItem = (id: string) => {
    if (certifications.length === 1) return;
    setCertifications(certifications.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'value' | 'details', value: string) => {
    setCertifications(certifications.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={cert.id} className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">Certification {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(cert.id)}
              disabled={certifications.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
              <Input 
                id={`cert-name-${cert.id}`}
                value={cert.value}
                onChange={(e) => updateItem(cert.id, 'value', e.target.value)}
                placeholder="e.g., Certified Teacher, First Aid Training"
              />
            </div>
            
            <div>
              <Label htmlFor={`cert-details-${cert.id}`}>Issuing Organization & Date</Label>
              <Input
                id={`cert-details-${cert.id}`}
                value={cert.details || ""}
                onChange={(e) => updateItem(cert.id, 'details', e.target.value)}
                placeholder="e.g., Kenya Education Board, 2020"
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={addItem}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Certification
      </Button>
    </div>
  );
};

export default CertificationsStep;
