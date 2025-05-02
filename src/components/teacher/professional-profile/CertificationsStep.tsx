
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2, Award, Medal, Calendar, FileText, Link, ExternalLink, GraduationCap, Edit, Shield, BadgeCheck } from "lucide-react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
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

  // Debug received certifications
  useEffect(() => {
    console.log("CertificationsStep - received certifications:", certifications);
  }, [certifications]);

  // Initialize with first item expanded
  useEffect(() => {
    if (certifications && certifications.length > 0 && Object.keys(expandedItems).length === 0) {
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
    if (!certifications) return;
    
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
    
    // Check if certifications are defined
    if (!certifications || certifications.length === 0) {
      toast({
        title: "No Certifications",
        description: "There are no certifications to save",
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

  const filteredCertifications = (type: string) => {
    if (!certifications) return [];
    if (type === 'certifications') {
      return certifications.filter(cert => !cert.certificateType?.includes("Award") && !cert.certificateType?.includes("Honor"));
    } else if (type === 'awards') {
      return certifications.filter(cert => cert.certificateType?.includes("Award") || cert.certificateType?.includes("Honor"));
    }
    return certifications;
  };

  // State for background check and ID verification
  const [verificationControls, setVerificationControls] = useState({
    backgroundCheck: false,
    idVerification: false
  });

  const updateVerification = (field: keyof typeof verificationControls, value: boolean) => {
    setVerificationControls(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Qualifications & Verification</h3>
          <p className="text-sm text-muted-foreground">
            Add your teaching certifications, awards, and verification documents
          </p>
        </div>
        <Button
          variant="outline"
          className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center py-6 bg-gray-50 border rounded-md">
          <div className="animate-pulse flex items-center space-x-2 py-4">
            <div className="h-4 w-4 bg-blue-200 rounded-full animate-bounce"></div>
            <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce delay-75"></div>
            <div className="h-4 w-4 bg-blue-600 rounded-full animate-bounce delay-150"></div>
            <p className="text-gray-500 font-medium">Loading...</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="certifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Medal className="h-4 w-4" />
            <span>Certifications</span>
          </TabsTrigger>
          <TabsTrigger value="awards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Awards</span>
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Verification</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Certifications Tab */}
        <TabsContent value="certifications" className="mt-6">
          {filteredCertifications('certifications').length > 0 ? (
            <div className="space-y-6">
              {filteredCertifications('certifications').map((cert, index) => (
                <div 
                  key={cert._id} 
                  className="border rounded-lg bg-white shadow-sm transition-all hover:shadow-md overflow-hidden border-blue-200 w-full"
                >
                  <div className="px-4 py-3 flex justify-between items-center border-b bg-blue-50">
                    <div 
                      className="flex items-center cursor-pointer flex-grow" 
                      onClick={() => toggleExpanded(cert._id)}
                    >
                      {getCertificateIcon(cert.certificateType || "")}
                      <div className="ml-2 flex-grow truncate">
                        <h4 className="font-medium text-blue-800">
                          {cert.name || `${cert.certificateType || "Certification"}`}
                        </h4>
                        {cert.issuer && (
                          <p className="text-xs text-gray-600 truncate">{cert.issuer}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full"
                        onClick={() => toggleExpanded(cert._id)}
                      >
                        {expandedItems[cert._id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <Edit className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full"
                        onClick={() => removeItem(cert._id)}
                        disabled={!certifications || certifications.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      {cert.issueDate ? (
                        <span className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <span>Issued: {formatDateForDisplay(cert.issueDate)}</span>
                          {cert.expiryDate && (
                            <span className="ml-2">• Expires: {formatDateForDisplay(cert.expiryDate)}</span>
                          )}
                        </span>
                      ) : (
                        <span></span>
                      )}
                      {cert.isCertified && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    {cert.description && !expandedItems[cert._id] && (
                      <p className="text-sm text-gray-600 mt-2">{cert.description}</p>
                    )}
                    
                    {cert.credentialUrl && !expandedItems[cert._id] && (
                      <span className="mt-3 block">
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View credential
                        </a>
                      </span>
                    )}
                  </div>
              
                  {expandedItems[cert._id] && (
                    <div className="mt-3 pt-3 space-y-6 border-t px-4 pb-4 bg-gray-50">
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => saveCertificationItem(cert)}
                          disabled={isSaving}
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor={`cert-type-${cert._id}`} className="mb-2 block text-sm font-medium">Type</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between bg-white">
                                <div className="flex items-center">
                                  {getCertificateIcon(cert.certificateType || "")}
                                  <span className="ml-2 truncate">{cert.certificateType || "Select type"}</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
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
                          <Label htmlFor={`cert-name-${cert._id}`} className="mb-2 block text-sm font-medium">Name/Title</Label>
                          <Input 
                            id={`cert-name-${cert._id}`}
                            value={cert.name}
                            onChange={(e) => updateItem(cert._id, 'name', e.target.value)}
                            placeholder="e.g., First Aid Training, Teaching License"
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor={`cert-issuer-${cert._id}`} className="mb-2 block text-sm font-medium">Issuing Organization</Label>
                          <Input
                            id={`cert-issuer-${cert._id}`}
                            value={cert.issuer || ""}
                            onChange={(e) => updateItem(cert._id, 'issuer', e.target.value)}
                            placeholder="e.g., Ministry of Education"
                            className="w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`cert-date-${cert._id}`} className="mb-2 block text-sm font-medium">
                              Issue Date
                            </Label>
                            <Input
                              id={`cert-date-${cert._id}`}
                              type="month"
                              value={cert.issueDate ? cert.issueDate.substring(0, 7) : ""}
                              onChange={(e) => updateItem(cert._id, 'issueDate', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cert-expiry-date-${cert._id}`} className="mb-2 block text-sm font-medium">
                              Expiry Date
                            </Label>
                            <Input
                              id={`cert-expiry-date-${cert._id}`}
                              type="month"
                              value={cert.expiryDate ? cert.expiryDate.substring(0, 7) : ""}
                              onChange={(e) => updateItem(cert._id, 'expiryDate', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`cert-description-${cert._id}`} className="mb-2 block text-sm font-medium">
                          Description & Details
                        </Label>
                        <Textarea
                          id={`cert-description-${cert._id}`}
                          value={cert.description || ""}
                          onChange={(e) => updateItem(cert._id, 'description', e.target.value)}
                          placeholder="Describe what this certification qualifies you for"
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center space-x-2 bg-white p-4 rounded-md border">
                        <Switch
                          id={`cert-verifiable-${cert._id}`}
                          checked={cert.isVerifiable || false}
                          onCheckedChange={(checked) => updateItem(cert._id, 'isVerifiable', checked)}
                        />
                        <Label htmlFor={`cert-verifiable-${cert._id}`} className="text-sm">This credential is verifiable online</Label>
                      </div>

                      {cert.isVerifiable && (
                        <div className="block">
                          <Label htmlFor={`cert-url-${cert._id}`} className="mb-2 block text-sm font-medium">
                            Verification URL
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id={`cert-url-${cert._id}`}
                              value={cert.credentialUrl || ""}
                              onChange={(e) => updateItem(cert._id, 'credentialUrl', e.target.value)}
                              placeholder="https://verify.example.org/cert/123456"
                              className="flex-1"
                            />
                            {cert.credentialUrl && cert.credentialUrl.startsWith('http') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="ml-2"
                                onClick={() => window.open(cert.credentialUrl, '_blank')}
                                title="Open credential verification URL"
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
              
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => {
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
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Certification
                </Button>
              </div>
            </div>
          ) : !isLoading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Medal className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Teaching Certifications Yet</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Add your teaching certifications and professional qualifications to enhance your credibility.
              </p>
              <Button
                onClick={() => {
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
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Certification
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Awards Tab */}
        <TabsContent value="awards" className="mt-6">
          {filteredCertifications('awards').length > 0 ? (
            <div className="space-y-6">
              {filteredCertifications('awards').map((cert, index) => (
                <div 
                  key={cert._id} 
                  className="border rounded-lg bg-white shadow-sm transition-all hover:shadow-md overflow-hidden border-amber-200 w-full"
                >
                  <div className="px-4 py-3 flex justify-between items-center border-b bg-amber-50">
                    <div 
                      className="flex items-center cursor-pointer flex-grow" 
                      onClick={() => toggleExpanded(cert._id)}
                    >
                      <Award className="h-5 w-5 text-amber-500" />
                      <div className="ml-2 flex-grow truncate">
                        <h4 className="font-medium text-amber-800">
                          {cert.name || "Award/Honor"}
                        </h4>
                        {cert.issuer && (
                          <p className="text-xs text-gray-600 truncate">{cert.issuer}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full"
                        onClick={() => toggleExpanded(cert._id)}
                      >
                        {expandedItems[cert._id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <Edit className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 rounded-full"
                        onClick={() => removeItem(cert._id)}
                        disabled={!certifications || certifications.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      {cert.issueDate ? (
                        <span className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <span>Awarded: {formatDateForDisplay(cert.issueDate)}</span>
                        </span>
                      ) : (
                        <span></span>
                      )}
                      {cert.isCertified && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    {cert.description && !expandedItems[cert._id] && (
                      <p className="text-sm text-gray-600 mt-2">{cert.description}</p>
                    )}
                    
                    {cert.credentialUrl && !expandedItems[cert._id] && (
                      <span className="mt-3 block">
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View award details
                        </a>
                      </span>
                    )}
                  </div>
              
                  {expandedItems[cert._id] && (
                    <div className="mt-3 pt-3 space-y-6 border-t px-4 pb-4 bg-gray-50">
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => saveCertificationItem(cert)}
                          disabled={isSaving}
                          className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                        >
                          {isSaving ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </span>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor={`cert-type-${cert._id}`} className="mb-2 block text-sm font-medium">Type</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between bg-white">
                                <div className="flex items-center">
                                  <Award className="h-5 w-5 text-amber-500" />
                                  <span className="ml-2 truncate">{cert.certificateType || "Select type"}</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                              <DropdownMenuLabel>Select Award Type</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                {["Teaching Award", "Honor & Recognition", "Excellence Award", "Community Service Award"].map(type => (
                                  <DropdownMenuItem 
                                    key={type}
                                    onClick={() => updateItem(cert._id, 'certificateType', type)}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center">
                                      <Award className="h-4 w-4 text-amber-500 mr-2" />
                                      <span>{type}</span>
                                    </div>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div>
                          <Label htmlFor={`cert-name-${cert._id}`} className="mb-2 block text-sm font-medium">Award Title</Label>
                          <Input 
                            id={`cert-name-${cert._id}`}
                            value={cert.name}
                            onChange={(e) => updateItem(cert._id, 'name', e.target.value)}
                            placeholder="e.g., Teacher of the Year, Excellence in Education"
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor={`cert-issuer-${cert._id}`} className="mb-2 block text-sm font-medium">Awarded By</Label>
                          <Input
                            id={`cert-issuer-${cert._id}`}
                            value={cert.issuer || ""}
                            onChange={(e) => updateItem(cert._id, 'issuer', e.target.value)}
                            placeholder="e.g., Ministry of Education, School District"
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`cert-date-${cert._id}`} className="mb-2 block text-sm font-medium">
                            Date Awarded
                          </Label>
                          <Input
                            id={`cert-date-${cert._id}`}
                            type="month"
                            value={cert.issueDate ? cert.issueDate.substring(0, 7) : ""}
                            onChange={(e) => updateItem(cert._id, 'issueDate', e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor={`cert-description-${cert._id}`} className="mb-2 block text-sm font-medium">
                          Award Description
                        </Label>
                        <Textarea
                          id={`cert-description-${cert._id}`}
                          value={cert.description || ""}
                          onChange={(e) => updateItem(cert._id, 'description', e.target.value)}
                          placeholder="Describe the significance of this award and your achievement"
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div className="flex items-center space-x-2 bg-white p-4 rounded-md border">
                        <Switch
                          id={`cert-verifiable-${cert._id}`}
                          checked={cert.isVerifiable || false}
                          onCheckedChange={(checked) => updateItem(cert._id, 'isVerifiable', checked)}
                        />
                        <Label htmlFor={`cert-verifiable-${cert._id}`} className="text-sm">This award is verifiable online</Label>
                      </div>

                      {cert.isVerifiable && (
                        <div className="block">
                          <Label htmlFor={`cert-url-${cert._id}`} className="mb-2 block text-sm font-medium">
                            Award Verification URL
                          </Label>
                          <div className="flex items-center">
                            <Input
                              id={`cert-url-${cert._id}`}
                              value={cert.credentialUrl || ""}
                              onChange={(e) => updateItem(cert._id, 'credentialUrl', e.target.value)}
                              placeholder="https://example.org/awards/123456"
                              className="flex-1"
                            />
                            {cert.credentialUrl && cert.credentialUrl.startsWith('http') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="ml-2"
                                onClick={() => window.open(cert.credentialUrl, '_blank')}
                                title="Open award verification URL"
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
              
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                  onClick={() => {
                    const newItem: CertificationItem = {
                      _id: `temp-${Date.now().toString()}`,
                      name: "",
                      issuer: "",
                      issueDate: "",
                      certificateType: "Teaching Award",
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
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Award
                </Button>
              </div>
            </div>
          ) : !isLoading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Awards or Honors Yet</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Add any teaching awards or honors you've received to showcase your achievements.
              </p>
              <Button
                onClick={() => {
                  const newItem: CertificationItem = {
                    _id: `temp-${Date.now().toString()}`,
                    name: "",
                    issuer: "",
                    issueDate: "",
                    certificateType: "Teaching Award",
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
                }}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Award
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Verification Tab */}
        <TabsContent value="verification" className="mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mr-4">
                <Shield className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">Background Verification</h3>
                <p className="text-sm text-gray-600">
                  Complete verification to build trust with parents and students
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="mr-4">
                  <Switch
                    id="background-check"
                    checked={verificationControls.backgroundCheck}
                    onCheckedChange={(checked) => updateVerification('backgroundCheck', checked)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="background-check" className="font-medium">Background Check</Label>
                  <p className="text-sm text-gray-600">
                    I have completed a background check with an approved provider
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              
              <div className="flex items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="mr-4">
                  <Switch
                    id="id-verification"
                    checked={verificationControls.idVerification}
                    onCheckedChange={(checked) => updateVerification('idVerification', checked)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="id-verification" className="font-medium">ID Verification</Label>
                  <p className="text-sm text-gray-600">
                    I have verified my identity with an official government ID
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="ml-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex">
                  <div className="mr-3 mt-0.5">
                    <BadgeCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 mb-1">Why Verification Matters</h4>
                    <p className="text-sm text-blue-700">
                      Complete verification to increase your credibility and trustworthiness. 
                      Verified teachers typically receive more student enrollments and higher ratings.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Save Verification Information
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificationsStep;
