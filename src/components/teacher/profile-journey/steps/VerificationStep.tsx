import React, { useState, useEffect } from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { useToast } from "@/components/ui/use-toast";
import { CheckSquare } from "lucide-react";
import { CertificationsStep } from "../../professional-profile";

const VerificationStep = () => {
  const { verification, updateVerification, setCertifications, certifications, completeStep } = useProfileJourney();
  const { toast } = useToast();
  
  // Debug certifications data
  console.log("VerificationStep - certifications:", certifications);
  
  // Handle certifications update
  const handleCertificationsUpdate = (newCertifications: any[]) => {
    setCertifications(newCertifications);
    checkCompletion(newCertifications, verification);
  };
  
  // Check if step should be marked as complete
  const checkCompletion = (
    certs: any[] | undefined, 
    verificationFields: typeof verification
  ) => {
    if (
      (certs && certs.length > 0 && certs[0]?.name) ||
      verificationFields.backgroundCheck ||
      verificationFields.idVerification
    ) {
      completeStep("verification");
    }
  };
  
  // Perform initial check for completion on mount
  useEffect(() => {
    checkCompletion(certifications, verification);
  }, [certifications, verification]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <CheckSquare className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Verification & Credentials</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Add teaching certifications, awards, and complete verification steps to build trust with students and parents.
        Verified teachers appear higher in search results and receive more class requests.
      </p>
      
      {/* Certifications Component with Tabs */}
      <CertificationsStep 
        certifications={certifications}
        setCertifications={handleCertificationsUpdate}
        onCertificationsChange={() => {
          // Track when certifications are changed/saved
          toast({
            title: "Saved",
            description: "Your credentials have been updated successfully",
          });
          checkCompletion(certifications, verification);
        }}
      />
    </div>
  );
};

export default VerificationStep;