
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Award, FileCheck, Calendar, FileText } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

type FormItem = {
  id: string;
  value: string;
  details?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  certificateType?: string;
  description?: string;
  isVerifiable?: boolean;
  verificationUrl?: string;
};

type CertificationsStepProps = {
  certifications: FormItem[];
  setCertifications: React.Dispatch<React.SetStateAction<FormItem[]>>;
};

const CERTIFICATE_TYPES = [
  "Teaching License",
  "Subject Specialization",
  "Educational Technology",
  "Curriculum Development",
  "Special Education",
  "Leadership/Management",
  "Professional Development",
  "Language Proficiency",
  "Teaching Award",
  "Academic Award",
  "Honor/Recognition",
  "Other"
];

const CertificationsStep = ({ certifications, setCertifications }: CertificationsStepProps) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
      details: "",
      issuer: "",
      issueDate: "",
      certificateType: "Teaching License",
      description: "",
      isVerifiable: false
    };
    setCertifications([...certifications, newItem]);
  };

  const removeItem = (id: string) => {
    if (certifications.length === 1) return;
    setCertifications(certifications.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof FormItem, value: string | boolean) => {
    setCertifications(certifications.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Certifications & Awards</h3>
          <p className="text-sm text-muted-foreground">
            Add your teaching certifications, professional qualifications, and awards
          </p>
        </div>
      </div>

      {certifications.map((cert, index) => (
        <div key={cert.id} className="p-5 border rounded-md bg-white shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              {(cert.certificateType === "Teaching Award" || 
                cert.certificateType === "Academic Award" || 
                cert.certificateType === "Honor/Recognition") ? (
                <Award className="h-5 w-5 text-amber-500 mr-2" />
              ) : (
                <FileCheck className="h-5 w-5 text-blue-500 mr-2" />
              )}
              <h4 className="font-medium">
                {(cert.certificateType === "Teaching Award" || 
                  cert.certificateType === "Academic Award" || 
                  cert.certificateType === "Honor/Recognition") 
                  ? `Award ${index + 1}` 
                  : `Certification ${index + 1}`}
              </h4>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-type-${cert.id}`}>Certificate/Award Type</Label>
                <Select
                  defaultValue={cert.certificateType || "Teaching License"}
                  onValueChange={(value) => updateItem(cert.id, 'certificateType', value)}
                >
                  <SelectTrigger id={`cert-type-${cert.id}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CERTIFICATE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`cert-name-${cert.id}`}>Certificate/Award Name</Label>
                <Input 
                  id={`cert-name-${cert.id}`}
                  value={cert.value}
                  onChange={(e) => updateItem(cert.id, 'value', e.target.value)}
                  placeholder={cert.certificateType?.includes("Award") 
                    ? "e.g., Teacher of the Year, Excellence in Education" 
                    : "e.g., Certified Teacher, First Aid Training"}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                <Input
                  id={`cert-issuer-${cert.id}`}
                  value={cert.issuer || ""}
                  onChange={(e) => updateItem(cert.id, 'issuer', e.target.value)}
                  placeholder="e.g., Kenya Education Board, Ministry of Education"
                />
              </div>

              <div>
                <Label htmlFor={`cert-date-${cert.id}`}>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Issue Date</span>
                  </div>
                </Label>
                <Input
                  id={`cert-date-${cert.id}`}
                  type="month"
                  value={cert.issueDate || ""}
                  onChange={(e) => updateItem(cert.id, 'issueDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`cert-description-${cert.id}`}>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Description & Achievement Details</span>
                </div>
              </Label>
              <Textarea
                id={`cert-description-${cert.id}`}
                value={cert.description || ""}
                onChange={(e) => updateItem(cert.id, 'description', e.target.value)}
                placeholder={cert.certificateType?.includes("Award") 
                  ? "Describe the significance of this award and your achievement"
                  : "Describe what this certification qualifies you for and its significance"}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id={`cert-verifiable-${cert.id}`}
                checked={cert.isVerifiable || false}
                onCheckedChange={(checked) => updateItem(cert.id, 'isVerifiable', checked)}
              />
              <Label htmlFor={`cert-verifiable-${cert.id}`}>This credential is verifiable online</Label>
            </div>

            {cert.isVerifiable && (
              <div>
                <Label htmlFor={`cert-url-${cert.id}`}>Verification URL or Reference Number</Label>
                <Input
                  id={`cert-url-${cert.id}`}
                  value={cert.verificationUrl || ""}
                  onChange={(e) => updateItem(cert.id, 'verificationUrl', e.target.value)}
                  placeholder="https://verify.example.org/cert/123456 or REF: ABC123456"
                />
              </div>
            )}
          </div>
        </div>
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={addItem}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Certification or Award
      </Button>
    </div>
  );
};

export default CertificationsStep;
