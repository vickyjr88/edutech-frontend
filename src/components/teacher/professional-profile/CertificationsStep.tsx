
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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
import { 
  CertificationItem, 
  CERTIFICATE_CATEGORIES, 
  CERTIFICATE_TYPES, 
  fetchCertifications,
  saveCertification,
  updateCertification,
  deleteCertification
} from "./utils/certificationUtils";
import { Switch } from "@/components/ui/switch";

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

type CertificationsStepProps = {
  certifications: CertificationItem[];
  setCertifications: React.Dispatch<React.SetStateAction<CertificationItem[]>>;
  onCertificationsChange?: () => void;
};

const CertificationsStep = ({ certifications, setCertifications, onCertificationsChange }: CertificationsStepProps) => {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Toggle expanded state for an item
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Load certifications from API
  useEffect(() => {
    if (user?.teacherId) {
      loadCertifications();
    }
  }, [user]);

  // Initialize with first item expanded
  useEffect(() => {
    if (certifications.length > 0 && Object.keys(expandedItems).length === 0) {
      setExpandedItems({ [certifications[0]._id]: true });
    }
  }, [certifications]);
  
  const loadCertifications = async () => {
    if (!user?.teacherId) return;
    
    setIsLoading(true);
    try {
      const loadedCertifications = await fetchCertifications(user.teacherId);
      console.log("Loaded certifications:", loadedCertifications);
      setCertifications(loadedCertifications);
    } catch (error) {
      console.error("Error loading certifications:", error);
      toast({
        title: "Error",
        description: "Failed to load certifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    const newItem: CertificationItem = {
      _id: `temp-${Date.now().toString()}`,
      name: "",
      issuer: "",
      issueDate: "",
      certificateType: "Teaching License",
      description: "",
      isVerifiable: false,
      credentialUrl: ""
    };
    setCertifications([...certifications, newItem]);
    
    // Expand the newly added item
    setExpandedItems(prev => ({
      ...prev,
      [newItem._id]: true
    }));
  };

  const removeItem = async (id: string) => {
    if (certifications.length === 1) return;
    
    const certToDelete = certifications.find(cert => cert._id === id);
    if (!certToDelete) return;
    
    // If it's a temporary item (not saved to the database yet)
    if (id.startsWith('temp-')) {
      setCertifications(certifications.filter(item => item._id !== id));
      return;
    }
    
    if (!user?.teacherId) {
      toast({
        title: "Error",
        description: "Cannot delete certification - user not authenticated",
        variant: "destructive"
      });
      return;
    }
    
    if (!confirm(`Are you sure you want to delete "${certToDelete.name || 'this certification'}"?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await deleteCertification(user.teacherId, id);
      
      if (result.success) {
        setCertifications(prev => prev.filter(item => item._id !== id));
        
        toast({
          title: "Success",
          description: "Certification deleted successfully"
        });
        
        if (onCertificationsChange) {
          onCertificationsChange();
        }
      } else {
        throw new Error(result.error || "Failed to delete certification");
      }
    } catch (error: any) {
      console.error("Error deleting certification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete certification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = (id: string, field: keyof CertificationItem, value: string | boolean) => {
    setCertifications(certifications.map(item => 
      item._id === id ? { ...item, [field]: value } : item
    ));
  };

  const renderCertificateIcon = (cert: CertificationItem, index: number) => {
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

  // Format dates for display
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return "";
    
    // Handle YYYY-MM or YYYY-MM-DD format
    const match = dateString.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (match) {
      const year = match[1];
      const month = new Date(`${match[1]}-${match[2]}-01`).toLocaleString('default', { month: 'long' });
      return `${month} ${year}`;
    }
    
    return dateString;
  };

  const saveAllCertifications = async () => {
    if (!user?.teacherId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save certifications",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Process each certification
      for (const cert of certifications) {
        // Skip items with no name (empty entries)
        if (!cert.name) continue;
        
        const isNew = cert._id.startsWith('temp-');
        
        if (isNew) {
          // Create new certification
          const { _id, ...newCert } = cert;
          const result = await saveCertification(user.teacherId, newCert);
          
          if (!result.success) {
            throw new Error(result.error || `Failed to save certification: ${cert.name}`);
          }
        } else {
          // Update existing certification
          const result = await updateCertification(user.teacherId, cert);
          
          if (!result.success) {
            throw new Error(result.error || `Failed to update certification: ${cert.name}`);
          }
        }
      }
      
      // Reload certifications to get latest data
      await loadCertifications();
      
      // Notify parent component if needed
      if (onCertificationsChange) {
        onCertificationsChange();
      }
      
      toast({
        title: "Success",
        description: "Your teaching certifications and awards have been saved",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Error saving certifications:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save certifications",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save an individual certification
  const saveCertificationItem = async (cert: CertificationItem) => {
    if (!user?.teacherId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save this certification",
        variant: "destructive"
      });
      return;
    }
    
    if (!cert.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for this certification",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const isNew = cert._id.startsWith('temp-');
      let result;
      
      if (isNew) {
        // Create new certification
        const { _id, ...newCert } = cert;
        result = await saveCertification(user.teacherId, newCert);
      } else {
        // Update existing certification
        result = await updateCertification(user.teacherId, cert);
      }
      
      if (!result.success) {
        throw new Error(result.error || `Failed to save certification: ${cert.name}`);
      }
      
      // Reload certifications to get latest data
      await loadCertifications();
      
      // Notify parent component if needed
      if (onCertificationsChange) {
        onCertificationsChange();
      }
      
      toast({
        title: "Success",
        description: `${cert.name} has been saved successfully`,
        variant: "default"
      });
    } catch (error: any) {
      console.error("Error saving certification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save certification",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
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
      
      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="animate-pulse text-center">
            <p>Loading certifications...</p>
          </div>
        </div>
      )}

      {certifications.map((cert, index) => (
        <div key={cert._id} className="p-5 border rounded-md bg-white shadow-sm transition-all">
          <div className="flex justify-between items-start mb-4">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => toggleExpanded(cert._id)}
            >
              {renderCertificateIcon(cert, index)}
              {cert.name && <span className="ml-2 text-muted-foreground">- {cert.name}</span>}
              {cert.issueDate && <span className="ml-2 text-xs text-muted-foreground">({formatDateForDisplay(cert.issueDate)})</span>}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => toggleExpanded(cert._id)}
              >
                {expandedItems[cert._id] ? "Collapse" : "Edit"}
              </Button>
              {expandedItems[cert._id] && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => saveCertificationItem(cert)}
                  disabled={isSaving}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeItem(cert._id)}
                disabled={certifications.length === 1}
                className="border-red-400 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
          
          {expandedItems[cert._id] && (
            <div className="space-y-4 mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-type-${cert._id}`} className="mb-1 block">Certificate/Award Type</Label>
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
                                onClick={() => updateItem(cert._id, 'certificateType', type)}
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
                  <Label htmlFor={`cert-name-${cert._id}`} className="mb-1 block">Certificate/Award Name</Label>
                  <Input 
                    id={`cert-name-${cert._id}`}
                    value={cert.name}
                    onChange={(e) => updateItem(cert._id, 'name', e.target.value)}
                    placeholder={cert.certificateType?.includes("Award") 
                      ? "e.g., Teacher of the Year, Excellence in Education" 
                      : "e.g., Certified Teacher, First Aid Training"}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-issuer-${cert._id}`} className="mb-1 block">Issuing Organization</Label>
                  <Input
                    id={`cert-issuer-${cert._id}`}
                    value={cert.issuer || ""}
                    onChange={(e) => updateItem(cert._id, 'issuer', e.target.value)}
                    placeholder="e.g., Kenya Education Board, Ministry of Education"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`cert-date-${cert._id}`} className="mb-1 block">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Issue Date</span>
                      </div>
                    </Label>
                    <Input
                      id={`cert-date-${cert._id}`}
                      type="month"
                      value={cert.issueDate || ""}
                      onChange={(e) => updateItem(cert._id, 'issueDate', e.target.value)}
                      className="w-full"
                    />
                    {cert.issueDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateForDisplay(cert.issueDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`cert-expiry-date-${cert._id}`} className="mb-1 block">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Expiry Date</span>
                      </div>
                    </Label>
                    <Input
                      id={`cert-expiry-date-${cert._id}`}
                      type="month"
                      value={cert.expiryDate || ""}
                      onChange={(e) => updateItem(cert._id, 'expiryDate', e.target.value)}
                      className="w-full"
                    />
                    {cert.expiryDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateForDisplay(cert.expiryDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor={`cert-description-${cert._id}`} className="mb-1 block">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>Description & Achievement Details</span>
                  </div>
                </Label>
                <Textarea
                  id={`cert-description-${cert._id}`}
                  value={cert.description || ""}
                  onChange={(e) => updateItem(cert._id, 'description', e.target.value)}
                  placeholder={cert.certificateType?.includes("Award") 
                    ? "Describe the significance of this award and your achievement"
                    : "Describe what this certification qualifies you for and its significance"}
                  rows={3}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                <Switch
                  id={`cert-verifiable-${cert._id}`}
                  checked={cert.isVerifiable || false}
                  onCheckedChange={(checked) => updateItem(cert._id, 'isVerifiable', checked)}
                />
                <Label htmlFor={`cert-verifiable-${cert._id}`}>This credential is verifiable online</Label>
              </div>

              {cert.isVerifiable && (
                <div>
                  <Label htmlFor={`cert-url-${cert._id}`} className="mb-1 block">
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-1" />
                      <span>Verification URL or Reference Number</span>
                    </div>
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id={`cert-url-${cert._id}`}
                      value={cert.credentialUrl || ""}
                      onChange={(e) => updateItem(cert._id, 'credentialUrl', e.target.value)}
                      placeholder="https://verify.example.org/cert/123456 or REF: ABC123456"
                      className="flex-1"
                    />
                    {cert.credentialUrl && (
                      cert.credentialUrl.startsWith('http') ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-2"
                          onClick={() => window.open(cert.credentialUrl, '_blank')}
                          title="Open credential verification URL"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {cert.credentialUrl}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="w-full md:w-auto border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Certification or Award
        </Button>
      </div>
    </div>
  );
};

export default CertificationsStep;
