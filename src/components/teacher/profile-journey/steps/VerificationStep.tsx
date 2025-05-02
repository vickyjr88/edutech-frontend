import React, { useState } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckSquare, 
  Award, 
  Shield, 
  UploadCloud, 
  CheckCircle,
  Save,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CertificationsStep } from "../../professional-profile";

const VerificationStep = () => {
  const { verification, updateVerification, setCertifications, certifications, completeStep } = useProfileJourney();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for verification controls
  const [verificationControls, setVerificationControls] = useState({
    backgroundCheck: verification.backgroundCheck,
    idVerification: verification.idVerification
  });
  
  // Handle verification toggle
  const handleVerificationToggle = (field: 'backgroundCheck' | 'idVerification') => {
    setVerificationControls(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Handle certifications update
  const handleCertificationsUpdate = (newCertifications: any[]) => {
    setCertifications(newCertifications);
    checkCompletion(newCertifications, verificationControls);
  };
  
  // Check if step should be marked as complete
  const checkCompletion = (
    certs: any[], 
    verificationFields: typeof verificationControls
  ) => {
    if (
      (certs.length > 0 && certs[0].value) ||
      verificationFields.backgroundCheck ||
      verificationFields.idVerification
    ) {
      completeStep("verification");
    }
  };
  
  // Save verification changes
  const saveVerification = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      updateVerification(verificationControls);
      checkCompletion(certifications, verificationControls);
      
      toast({
        title: "Verification Updated",
        description: "Your verification settings have been saved"
      });
      
      setIsSaving(false);
    }, 1000);
  };
  
  // Check if verification has been changed
  const hasVerificationChanges = 
    verification.backgroundCheck !== verificationControls.backgroundCheck ||
    verification.idVerification !== verificationControls.idVerification;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <CheckSquare className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Verification & Credentials</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Add teaching certifications and complete verification steps to build trust with students and parents.
        Verified teachers appear higher in search results and receive more class requests.
      </p>
      
      {/* Certifications */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Award className="mr-2 h-4 w-4 text-muted-foreground" />
          <h4 className="text-base font-medium">Teaching Certifications</h4>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            Add any professional teaching certifications, licenses, or credentials you hold.
            These help establish your credibility as an educator.
          </p>
        </div>
        
        <CertificationsStep 
          certifications={certifications}
          setCertifications={handleCertificationsUpdate}
        />
      </div>
      
      <Separator className="my-6" />
      
      {/* Verification */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
          <h4 className="text-base font-medium">Verification Steps</h4>
        </div>
        
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center mr-2",
                  verificationControls.backgroundCheck ? "bg-green-100" : "bg-gray-100"
                )}>
                  {verificationControls.backgroundCheck ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                Background Check
              </CardTitle>
              <CardDescription>
                Verify your background for safety and trust
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Complete a background check to verify your identity and teaching eligibility.
                  This helps build trust with parents and students.
                </div>
                <Switch
                  checked={verificationControls.backgroundCheck}
                  onCheckedChange={() => handleVerificationToggle('backgroundCheck')}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center mr-2",
                  verificationControls.idVerification ? "bg-green-100" : "bg-gray-100"
                )}>
                  {verificationControls.idVerification ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                ID Verification
              </CardTitle>
              <CardDescription>
                Verify your identity document
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Upload a government-issued ID to verify your identity.
                  This information is kept secure and private.
                </div>
                <Switch
                  checked={verificationControls.idVerification}
                  onCheckedChange={() => handleVerificationToggle('idVerification')}
                />
              </div>
              
              {verificationControls.idVerification && (
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm">
                    <UploadCloud className="h-4 w-4 mr-2" />
                    Upload ID Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Save button */}
      {hasVerificationChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={saveVerification}
            disabled={isSaving}
            className={cn(
              "transition-all",
              isSaving ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Verification Settings
              </>
            )}
          </Button>
        </div>
      )}
      
      {/* Verification benefits */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits of Verification</h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
            <span className="text-sm text-gray-600">Higher placement in search results</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
            <span className="text-sm text-gray-600">Verified badge on your profile</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
            <span className="text-sm text-gray-600">Increased trust from parents and students</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
            <span className="text-sm text-gray-600">More class bookings and enrollment</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VerificationStep;