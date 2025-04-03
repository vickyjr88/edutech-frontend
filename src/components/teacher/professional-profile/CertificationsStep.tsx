
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Award, Medal, Calendar, FileText, Link, ExternalLink, GraduationCap } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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

// Group certificate types into categories for better organization
const CERTIFICATE_CATEGORIES = {
  "Teaching Credentials": [
    "Teaching License",
    "Subject Specialization",
    "Educational Technology",
    "Curriculum Development",
    "Special Education",
    "Leadership/Management",
    "Professional Development",
  ],
  "Language Qualifications": [
    "Language Proficiency",
    "TEFL/TESOL",
    "Language Teaching",
  ],
  "Recognitions": [
    "Teaching Award",
    "Academic Award",
    "Honor/Recognition",
  ],
  "Other": [
    "Online Course",
    "Workshop",
    "Other"
  ]
};

// Flatten the categories for direct access when needed
const CERTIFICATE_TYPES = Object.values(CERTIFICATE_CATEGORIES).flat();

// Icon mapping for certificate types
const getCertificateIcon = (type: string) => {
  if (type?.includes("Award") || type?.includes("Honor")) {
    return <Award className="h-5 w-5 text-amber-500" />;
  } else if (type?.includes("Language")) {
    return <GraduationCap className="h-5 w-5 text-purple-500" />;
  } else {
    return <Medal className="h-5 w-5 text-blue-500" />;
  }
};

const CertificationsStep = ({ certifications, setCertifications }: CertificationsStepProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Toggle expanded state for an item
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Initialize with first item expanded
  useEffect(() => {
    if (certifications.length > 0 && Object.keys(expandedItems).length === 0) {
      setExpandedItems({ [certifications[0].id]: true });
    }
  }, [certifications]);

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
    
    // Expand the newly added item
    setExpandedItems(prev => ({
      ...prev,
      [newItem.id]: true
    }));
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

  const renderCertificateIcon = (cert: FormItem, index: number) => {
    return (
      <div className="flex items-center">
        {getCertificateIcon(cert.certificateType)}
        <h4 className="font-medium ml-2">
          {(cert.certificateType?.includes("Award") || cert.certificateType?.includes("Honor")) 
            ? `Award ${index + 1}` 
            : `${cert.certificateType || "Certification"} ${index + 1}`}
        </h4>
      </div>
    );
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
        <div key={cert.id} className="p-5 border rounded-md bg-white shadow-sm transition-all">
          <div className="flex justify-between items-start mb-4">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => toggleExpanded(cert.id)}
            >
              {renderCertificateIcon(cert, index)}
              {cert.value && <span className="ml-2 text-muted-foreground">- {cert.value}</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleExpanded(cert.id)}
              >
                {expandedItems[cert.id] ? "Collapse" : "Edit"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeItem(cert.id)}
                disabled={certifications.length === 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          
          {expandedItems[cert.id] && (
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-type-${cert.id}`} className="mb-1 block">Certificate/Award Type</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {cert.certificateType || "Select type"}
                        <span>▼</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
                      {Object.entries(CERTIFICATE_CATEGORIES).map(([category, types]) => (
                        <div key={category}>
                          <DropdownMenuLabel>{category}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {types.map(type => (
                              <DropdownMenuItem 
                                key={type}
                                onClick={() => updateItem(cert.id, 'certificateType', type)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center">
                                  {getCertificateIcon(type)}
                                  <span className="ml-2">{type}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                          {category !== Object.keys(CERTIFICATE_CATEGORIES).pop() && (
                            <DropdownMenuSeparator />
                          )}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <Label htmlFor={`cert-name-${cert.id}`} className="mb-1 block">Certificate/Award Name</Label>
                  <Input 
                    id={`cert-name-${cert.id}`}
                    value={cert.value}
                    onChange={(e) => updateItem(cert.id, 'value', e.target.value)}
                    placeholder={cert.certificateType?.includes("Award") 
                      ? "e.g., Teacher of the Year, Excellence in Education" 
                      : "e.g., Certified Teacher, First Aid Training"}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-issuer-${cert.id}`} className="mb-1 block">Issuing Organization</Label>
                  <Input
                    id={`cert-issuer-${cert.id}`}
                    value={cert.issuer || ""}
                    onChange={(e) => updateItem(cert.id, 'issuer', e.target.value)}
                    placeholder="e.g., Kenya Education Board, Ministry of Education"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`cert-date-${cert.id}`} className="mb-1 block">
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
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cert-expiry-date-${cert.id}`} className="mb-1 block">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Expiry Date</span>
                      </div>
                    </Label>
                    <Input
                      id={`cert-expiry-date-${cert.id}`}
                      type="month"
                      value={cert.expiryDate || ""}
                      onChange={(e) => updateItem(cert.id, 'expiryDate', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor={`cert-description-${cert.id}`} className="mb-1 block">
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
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                <Switch
                  id={`cert-verifiable-${cert.id}`}
                  checked={cert.isVerifiable || false}
                  onCheckedChange={(checked) => updateItem(cert.id, 'isVerifiable', checked)}
                />
                <Label htmlFor={`cert-verifiable-${cert.id}`}>This credential is verifiable online</Label>
              </div>

              {cert.isVerifiable && (
                <div>
                  <Label htmlFor={`cert-url-${cert.id}`} className="mb-1 block">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-1" />
                      <span>Verification URL or Reference Number</span>
                    </div>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id={`cert-url-${cert.id}`}
                      value={cert.verificationUrl || ""}
                      onChange={(e) => updateItem(cert.id, 'verificationUrl', e.target.value)}
                      placeholder="https://verify.example.org/cert/123456 or REF: ABC123456"
                      className="flex-1"
                    />
                    {cert.verificationUrl && cert.verificationUrl.startsWith('http') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="ml-2"
                        onClick={() => window.open(cert.verificationUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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
